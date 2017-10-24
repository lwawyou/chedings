import {inject} from 'aurelia-framework';
import {Api} from "../index";
import {Session} from "../session";

@inject(Api)
export class SupplierHelper{
    constructor(Api){
        this.api = Api;
    }
    create(item, callback){
        let stmt = "call supplier_add("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    update(arr, callback){
        let stmt = "call supplier_update("+arr.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    delete(id, callback){
        let arr = [id,JSON.stringify(Session.getDate())].join(",");
        let stmt = "call supplier_delete("+arr+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getList(callback){
        let stmt = "call supplier_list();";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    getInfo(id, callback){
        let stmt = "call supplier_info('"+(id || "")+"');";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    registerProduct(item, callback){
        let stmt = "call supplier_add_product("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    updateProduct(item, callback){
        let stmt = "call supplier_update_product("+item.join(",")+");";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    viewProduct(id, callback){
        let stmt = "call supplier_view_product('"+(id || "")+"');";
        this.api.post(stmt).done(function(result){
            callback(result);
        }).fail(function(err){console.log(err);});
    }
    deleteProduct(id, callback){
        let arr = [id,JSON.stringify(Session.getDate())].join(",");
        let stmt = "call supplier_product_delete("+arr+");";
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