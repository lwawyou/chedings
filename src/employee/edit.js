import {inject} from 'aurelia-framework';
import {UserHelper} from "../api/user/helper";
import {UserType} from "../api/user/user-type";
import {Session} from "../api/session";

@inject(UserHelper, UserType)
export class View{
    user={};
    constructor(UserHelper, UserType){
        this.userHelper = UserHelper;
        this.userType = UserType;
        
        let self = this;

        this.userType.getData(function(result){
            self.selectType = JSON.parse(result || "");
        });
        this.user.id = window.chedings.id;
        this.userHelper.getInfo(this.user.id, function(result){
            let _user = JSON.parse(result || "");
            if(_user.length>0){
                self.user = _user[0];
            }
        });
    }
    save(){
        let _arr = [
            "'"+this.user.id+"'",
            "'"+this.user.firstname+"'",
            "'"+this.user.middlename+"'",
            "'"+this.user.lastname+"'",
            "'"+this.user.username+"'",
            "'"+this.user.type+"'",
            "'"+(this.user.pic || "")+"'",
        ];
        let self = this;
        this.userHelper.update(_arr, function(result){
            let msg = JSON.parse(result || "");
            Session.message(msg[0].output);
        });
    }
    clear(){
        this.user = {};
    }
}