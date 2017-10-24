import {inject} from 'aurelia-framework';
import {UserHelper} from "../api/user/helper";
import {Session} from "../api/session";

@inject(UserHelper)
export class View{
    employee=[];
    constructor(UserHelper){
        this.userHelper = UserHelper;

        
    }
    activate(){
        console.log("View activated");
        let self = this;
        this.userHelper.getList(function(result){
            self.employee = JSON.parse(result || "");
            self.employee = self.employee.filter(function(a){
                return a.id != Session.user.id;
            });
        });
    }
    deleteEmployee(_id){
        let self = this;
        this.userHelper.deleteInfo(_id, function(result){
            let msg = JSON.parse(result || "");
            self.activate();
            Session.message(msg[0].output);
        });
    }
    checkProfileImage(user){
        if((user.pic || "").length == 0){
            return "/src/resources/img/img_avatar2.png";
        }
        return user.pic;
    }
}