import {inject} from 'aurelia-framework';
import {ProductHelper} from "../api/product/helper";
import {Session} from "../api/session";

@inject(ProductHelper)
export class Edit{
    product = {};
    constructor(ProductHelper){
        this.productHelper = ProductHelper;
        
        let self = this;

        this.product.id = window.chedings.id;
        this.productHelper.getInfo(this.product.id, function(result){
            let _product = JSON.parse(result || "");
            if(_product.length>0){
                self.product = _product[0];
            }
        });
    }
    save(){
        let _arr = [
            "'"+this.product.id+"'",
            "'"+this.product.description+"'",
            "'"+this.product.cost+"'",
            "'"+this.product.discount+"'",
            "'"+this.product.quantity+"'",
            "'"+this.product.supplier_id+"'",
            "'"+this.product.expire_date+"'",
            "'"+this.product.pic+"'"
        ];
        let self = this;
        this.productHelper.update(_arr, function(result){
            let msg = JSON.parse(result || "");
            console.log(msg);
            Session.message(msg[0].output);
            $("#loadStack").click();
        });
    }
    
    clear(){
        this.product = {};
    }
}