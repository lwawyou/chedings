import {inject} from 'aurelia-framework';
import {SupplierHelper} from "../api/supplier/helper";
import {ProductHelper} from "../api/product/helper";
import {Session} from "../api/session";

@inject(SupplierHelper, ProductHelper)
export class ViewProduct{
    product = {};
    productArr = [];
    edit_product = false;
    constructor(SupplierHelper, ProductHelper){
        this.supplierHelper = SupplierHelper;
        this.productHelper = ProductHelper;

    }
    activate(){
        let id = window.chedings.supplier_id;
        let self = this;
        this.supplierHelper.viewProduct(id,function(result){
            let arr = JSON.parse(result || "");
            self.productArr = arr;
        });
    }
    editProduct(i){
        $(".show"+i).css("display", "block");
        $(".hide"+i).css("display", "none");
    }
    revert(i){
        $(".show"+i).css("display", "none");
        $(".hide"+i).css("display", "block");
    }
    deleteProduct(item){
        var id = item.id || 0;
        console.log("Deleted: ", item);
        this.supplierHelper.deleteProduct(id, function(result){
            let msg = JSON.parse(result || "");
            this.activate();
            Session.message(msg[0].output);
        }.bind(this));
    }
    updateProduct(id){
        let self = this;
        let arr = this.productArr;
        for(var i=0; i<arr.length; i++)
        {
            if(id == arr[i].id) 
            {
                self.revert(i);
                console.log("Info: ", arr[i]);
                let _arr = [
                    "'"+arr[i].description+"'",
                    "'"+arr[i].pic+"'",
                    "'"+id+"'"
                ];
                self.supplierHelper.updateProduct(_arr, function(result){
                    let msg = JSON.parse(result || "");
                    console.log(msg[0].output);
                });
            }
        }
        Session.message("Update Successfully");
        
    }
    clear(){
        this.product = {};
    }
    upload(i){
        let self = this;
        let input = $("#productImage"+i)[0];
        this.supplierHelper.uploadProfile(input, "#imgProductPreview"+i, function(result){
            self.productArr[i].pic = result || "";
        });
    }
}