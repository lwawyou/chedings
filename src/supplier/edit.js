import {inject} from 'aurelia-framework';
import {SupplierHelper} from "../api/supplier/helper";
import {Session} from "../api/session";

@inject(SupplierHelper)
export class View{
    supplier={};
    constructor(SupplierHelper){
        this.supplierHelper = SupplierHelper;
        
        let self = this;
        this.supplier.id = window.chedings.supplier_id;
        this.supplierHelper.getInfo(this.supplier.id, function(result){
            let _supplier = JSON.parse(result || "");
            if(_supplier.length>0){
                self.supplier = _supplier[0];
            }
        });
    }
    save(){
        let _arr = [
            "'"+this.supplier.id+"'",
            "'"+this.supplier.company+"'",
            "'"+this.supplier.contact_name+"'",
            "'"+this.supplier.address+"'",
            "'"+this.supplier.phone+"'"
        ];
        let self = this;
        this.supplierHelper.update(_arr, function(result){
            let msg = JSON.parse(result || "");
            console.log(msg);
            Session.message(msg[0].output);
        });
    }
    clear(){
        this.supplier = {};
    }
}