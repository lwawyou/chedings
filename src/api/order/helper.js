import {inject} from 'aurelia-framework';
import {Api} from "../index";

@inject(Api)
export class OrderHelper{
    constructor(Api){
        this.api = Api;
    }
    create(item, callback){
        let stmt = "call order_create("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    createTransaction(item, callback){
        let stmt = "call order_createtransaction("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getReceipt(id, callback){
        let stmt = "call order_receipt("+id+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
}