import {inject} from 'aurelia-framework';
import {SupplierHelper} from "../api/supplier/helper";
import {Session} from "../api/session";

@inject(SupplierHelper)
export class View{
    supplier=[];
    constructor(SupplierHelper){
        this.supplierHelper = SupplierHelper;

        
    }
    activate(){
        console.log("View activated");
        let self = this;
        this.supplierHelper.getList(function(result){
            self.supplier = JSON.parse(result || "");
        });
    }
    deleteSupplier(_id){
        let self = this;
        this.supplierHelper.delete(_id, function(result){
            let msg = JSON.parse(result || "");
            self.activate();
            Session.message(msg[0].output);
        });
    }
    
}