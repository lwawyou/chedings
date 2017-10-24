import {inject} from 'aurelia-framework';
import {UserType} from "../api/user/user-type";
import {UserHelper} from "../api/user/helper";
import {Session} from "../api/session";

@inject(UserType,UserHelper)
export class Add{
    user = {};
    constructor(UserType,UserHelper){
        this.userType = UserType;
        this.userHelper = UserHelper;
        let self = this;
        this.userType.getData(function(result){
            self.selectType = JSON.parse(result || "");
        });
    }
    activate(){
        
    }
    register(){
        let _arr = [
            "'"+this.user.firstname+"'",
            "'"+this.user.lastname+"'",
            "'"+this.user.username+"'",
            "'"+this.user.password+"'",
            "'"+this.user.type+"'",
        ];
        let self = this;
        this.userHelper.create(_arr, function(result){
            let msg = JSON.parse(result || "");
            self.clear();
            Session.message(msg[0].output);
        });
    }
    clear(){
        this.user = {};
    }
}