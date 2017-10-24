import {inject} from 'aurelia-framework';
import {Api} from "../index";
import {Session} from "../session";

@inject(Api)
export class ProductHelper{
    constructor(Api){
        this.api = Api;
    }
    create(item, callback){
        let stmt = "call product_add("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    update(user, callback){
        let stmt = "call product_update("+user.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    restock(item, callback){
        let stmt = "call product_restock("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getList(callback){
        let stmt = "call product_list();";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getStocks(callback){
        let stmt = "call stocks();";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getInfo(id, callback){
        let stmt = "call product_info('"+(id || "")+"');";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    deleteProduct(id, callback){
        let arr = [id,JSON.stringify(Session.getDate())].join(",");
        let stmt = "call product_delete("+arr+");";
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