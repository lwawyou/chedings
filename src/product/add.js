import {inject} from 'aurelia-framework';
import {ProductHelper} from "../api/product/helper";
import {SupplierHelper} from "../api/supplier/helper";
import {Session} from "../api/session";

@inject(ProductHelper,SupplierHelper)
export class Add{
    product = {};
    selectProduct = [];
    selectedProduct = "";
    selectSupplier = [];
    selectedSupplier = "";
    constructor(ProductHelper,SupplierHelper){
        this.productHelper = ProductHelper;
        this.supplierHelper = SupplierHelper;
        let self = this;
        this.supplierHelper.getList(function(result){
            let arr = JSON.parse(result || "");
            self.selectSupplier = arr;
        });

    }
    activate(){
        
    }
    changeSupplier(){
        console.log(this.selectedSupplier);
        let self = this;
        this.supplierHelper.viewProduct(self.selectedSupplier, function(result){
            let arr = JSON.parse(result || "");
            self.selectProduct = arr;
        });
    }
    chooseProduct(){
        let arr = this.selectProduct;
        for(var i=0; i<arr.length; i++){
            if(this.selectedProduct == arr[i].id){
                this.product = arr[i];
            }
        }
    }
    register(){
        let _arr = [
            "'"+this.product.description+"'",
            "'"+this.product.cost+"'",
            "'"+this.product.quantity+"'",
            "'"+this.product.company+"'",
            "'"+this.product.expire_date+"'",
            "'"+this.product.pic+"'"
        ];
        let self = this;
        this.productHelper.create(_arr, function(result){
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
        this.productHelper.uploadProfile(input, "#imgProductPreview", function(result){
            self.product.pic = result || "";
        });
    }
}