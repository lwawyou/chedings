import {inject} from 'aurelia-framework';
import {Api} from "../index";

@inject(Api)
export class UserType{
    constructor(Api){
        this.api = Api;
    }
    getData(callback){
        let stmt = "call usertype();";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
}