import {inject} from 'aurelia-framework';
import {Api} from "../index";
import {Session} from "../session";

@inject(Api)
export class ReportsHelper{
    constructor(Api){
        this.api = Api;
    }
    deleted(arr, callback){
        let stmt = "call reports_for_deleted("+arr.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    sales(arr, callback){
        let stmt = "call report_sales("+arr.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
}