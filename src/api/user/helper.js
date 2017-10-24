import {inject} from 'aurelia-framework';
import {Api} from "../index";
import {Session} from "../session";

@inject(Api)
export class UserHelper{
    constructor(Api){
        this.api = Api;
    }
    create(user, callback){
        let stmt = "call create_user("+user.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    update(user, callback){
        let stmt = "call user_update("+user.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getList(callback){
        let stmt = "call user_list();";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getInfo(id, callback){
        let stmt = "call user_info('"+(id || "")+"');";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    deleteInfo(id, callback){
        let arr = [id,JSON.stringify(Session.getDate())].join(",");
        let stmt = "call user_delete("+arr+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    uploadProfile(input, id, callback){
        let self = this;
        this.api.uploadPicture(input, id, function(result){
            callback(result);
        });
    }
}