import { inject } from 'aurelia-framework';
import { ProductHelper } from "../api/product/helper";
import { Session } from "../api/session";

@inject(ProductHelper)
export class View {
    product = [];
    user = {};
    usertypeRights = true;
    constructor(ProductHelper) {
        this.productHelper = ProductHelper;
    }
    activate() {
        let self = this;
        self.user = Session.user;
        if (self.user.type == 3) self.usertypeRights = false;
        self.productHelper.getStocks(function (result) {
            self.product = JSON.parse(result || '[]');
            console.log(self.product);
        });
    }
    removeProduct(_id) {
        let self = this;
        var id = _id;
        if (confirm("Do you want to remove the product?")) {
            this.productHelper.deleteProduct(id, function (result) {
                let msg = JSON.parse(result || "");
                Session.message(msg[0].output);
                self.activate();
                $("#loadStack").click();
            });
        }
    }
    validateItem(item){
        var percentage = parseFloat(item.percentage);
        var limitPercentage = parseFloat("10.00%");
        // if there percentage limit reach its limit|almost expired then show notify
        if(((percentage <= limitPercentage || (item.no_of_days <= 30)) && ((item.discount+"").length == 0 || item.no_of_days <= 0)  && (item.ref_id == '' || item.ref_id == null))){
            console.log("View1: ", item);
            return true;
        }
        // almost expired and already discounted show notify
        else if(item.no_of_days <= 2 && item.discount > 0){console.log("View2: ", item);
            return true;
        }
        return false;
    }
    discounted(item){
        if(item.no_of_days <= 30 && item.no_of_days > 0 && (item.discount+"").length == 0){
            return true;
        }
        return false;
    }
    restock(item){
        var percentage = parseFloat(item.percentage);
        var limitPercentage = parseFloat("10.00%");
        if(percentage <= limitPercentage){
            return true;
        }
        return false;
    }
    expired(item){
        if(item.no_of_days <= 0){
            return true;
        }
        return false;
    }
    toBeDeleted(item){
        // almost expired and already discounted show notify
        if(item.no_of_days <= 2 && item.discount > 0){
            return true;
        }
        return false;
    }
}