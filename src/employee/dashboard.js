import {inject} from 'aurelia-framework';
import {Session} from "../api/session";
import {ProductHelper} from "../api/product/helper";
import { Router } from 'aurelia-router';

@inject(ProductHelper,Router)
export class Dashboard{
    dashboard = [];
    user = {};
    stocks = [];
    constructor(ProductHelper,Router){
        this.productHelper = ProductHelper;
        this.router = Router;
        this.dashboard = this.config();
        this.user = Session.user;
        if(this.user.pic.length == 0){
            this.user.pic = "/src/resources/img/img_avatar2.png";
        }


        let self = this;
        self.productHelper.getStocks(function(result){
            self.stocks = JSON.parse(result || '[]');
        });
        
        Session.showOrder(function(result){
            if(result) self.router.navigate("/chedings/order/dashboard");
        });
        Session.landingpage = window.location.pathname;
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
        Session.logout();
    }
    config(){
        return [
            {
                name: "Products",
                module: "../product/index"
            }
        ]
    }
}