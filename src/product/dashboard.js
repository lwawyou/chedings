import {Session} from "../api/session";

export class Dashboard{
    dashboard = [];
    user = {};
    constructor(){
        this.dashboard = this.config();
        //this.user.pic = "../src/resources/img/avatar_hat.jpg";
        this.user = Session.user;
    }
    triggerDashboardButton(data){
        this.contentheader = data.name || "";
        this.contenturl = data.module || "";
        document.getElementById('id01').style.display='block';
    }
    openUserInfo(){
        this.contentheader = this.user.name || "";
        this.contenturl = "./profile";
        document.getElementById('id01').style.display='block';
    }
    logout(){
        Sessiong.logout();
    }
    config(){
        return [
            {
                name: "Products",
                module: ""
            }
        ]
    }
}