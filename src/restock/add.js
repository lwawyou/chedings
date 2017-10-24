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
    
        this.product.id = window.chedings.id;
        this.productHelper.getInfo(this.product.id, function(result){
            let _product = JSON.parse(result || "");
            if(_product.length>0){
                self.product = _product[0];
            }
        });
        
        this.supplierHelper.getList(function(result){
            let arr = JSON.parse(result || "");
            self.selectSupplier = arr;
        });
        

    }
    activate(){
        
    }
    register(){
        let _arr = [
            "'"+this.product.description+"'",
            "'"+this.product.cost+"'",
            "'"+this.product.quantity+"'",
            "'"+this.product.company+"'",
            "'"+this.product.expire_date+"'",
            "'"+this.product.pic+"'",
            "'"+this.product.id+"'"
        ];
        let self = this;
        this.productHelper.restock(_arr, function(result){
            let msg = JSON.parse(result || "");
            self.clear();
            Session.message(msg[0].output);
            $("#loadStack").click();
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