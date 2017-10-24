import {inject} from 'aurelia-framework';
import {SupplierHelper} from "../api/supplier/helper";
import {Session} from "../api/session";

@inject(SupplierHelper)
export class AddProduct{
    product = {};
    selectType = [];
    constructor(SupplierHelper){
        this.supplierHelper = SupplierHelper;
        let self = this;
        this.supplierHelper.getList(function(result){
            let arr = JSON.parse(result || "");
            self.selectType = arr;
            console.log(self.selectType);
        });

    }
    activate(){
        
    }
    register_product(){
        let _arr = [
            "'"+this.product.description+"'",
            "'"+this.product.pic+"'",
            "'"+this.product.supplier_id+"'"
        ];
        let self = this;
        this.supplierHelper.registerProduct(_arr, function(result){
            let msg = JSON.parse(result || "");
            self.clear();
            Session.message(msg[0].output);
        });
    }
    clear(){
        this.product = {};
    }
    upload(){
        let self = this;
        let input = $("#productImage")[0];
        this.supplierHelper.uploadProfile(input, "#imgProductPreview", function(result){
            self.product.pic = result || "";
        });
    }
}