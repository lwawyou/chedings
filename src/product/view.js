import {inject} from 'aurelia-framework';
import {ProductHelper} from "../api/product/helper";
import {Session} from "../api/session";

@inject(ProductHelper)
export class View{
    product = [];
    user = {};
    usertypeRights = true;
    constructor(ProductHelper){
        this.productHelper = ProductHelper;
        
    }
    activate(){
        console.log("View activated");
        this.user = Session.user;
        if(this.user.type == 3) this.usertypeRights = false;
        this.productHelper.getList(function(result){
            this.product = JSON.parse(result || "");
            console.log("Product List: ", this.product);

        }.bind(this));
    }
    deleteProduct(_id){
        let self = this;
        this.productHelper.deleteProduct(_id, function(result){
            let msg = JSON.parse(result || "");
            self.activate();
            Session.message(msg[0].output);
        });
    }
}