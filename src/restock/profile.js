import {inject} from 'aurelia-framework';
import {UserHelper} from "../api/user/helper";
import {UserType} from "../api/user/user-type";
import {Session} from "../api/session";

@inject(UserHelper, UserType)
export class Profile{
    constructor(UserHelper, UserType){
        this.userHelper = UserHelper;
        this.userType = UserType;
        
        
    }
    activate(){
        let self = this;
        this.user = Session.user;
        this.userType.getData(function(result){
            self.selectType = JSON.parse(result || "");
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
        this.user.name = [this.user.firstname,this.user.lastname].join(" ");
        let self = this;
        this.userHelper.update(_arr, function(result){
            let msg = JSON.parse(result || "");
            Session.user = self.user;
            Session.message(msg[0].output);
            $("#loadStack").click();
        });
    }
    upload(){
        let self = this;
        let input = $("#FileUploadImage")[0];
        this.userHelper.uploadProfile(input, "#imgPreview", function(result){
            self.user.pic = result || "";
        });
    }
}