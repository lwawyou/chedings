import {inject} from 'aurelia-framework';
import {SupplierHelper} from "../api/supplier/helper";
import {Session} from "../api/session";

@inject(SupplierHelper)
export class Add{
    supplier = {};
    constructor(SupplierHelper){
        this.supplierHelper = SupplierHelper;
    }
    activate(){
        
    }
    register(){
        let _arr = [
            "'"+this.supplier.company+"'",
            "'"+this.supplier.contact_name+"'",
            "'"+this.supplier.address+"'",
            "'"+this.supplier.phone+"'"
        ];
        let self = this;
        this.supplierHelper.create(_arr, function(result){
            let msg = JSON.parse(result || "");
            self.clear();
            Session.message(msg[0].output);
        });
    }
    clear(){
        this.supplier = {};
    }
}