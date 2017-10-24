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
        this.router = Router;
        this.dashboard = this.config();
        this.productHelper = ProductHelper;
        this.user = Session.user;
        if(this.user.pic.length == 0){
            this.user.pic = "/src/resources/img/img_avatar2.png";
        }
        let self = this;

        Session.showOrder(function(result){
            if(result) self.router.navigate("/chedings/order/dashboard");
        });
        
        Session.landingpage = window.location.pathname;
    }
    attached(){
        this.loadStock();
    }
    loadStock(){
        this.productHelper.getStocks(function(result){
            this.stocks = JSON.parse(result || '[]');
            Session.loadBadge(
                this.notification(this.stocks)
            );
        }.bind(this));
    }
    notification(stocks){
        let limitPercentage = parseFloat("10.00%");
        let total = 0;
        for(var i in stocks){
            var a = stocks[i];
            if((parseFloat(a.percentage || "0.00%") <= limitPercentage || a.no_of_days <= 30) && (a.discount+"").length == 0 && (a.ref_id == '' || a.ref_id == null)) {
                total++;
            }
            else if((parseFloat(a.percentage || "0.00%") != limitPercentage && a.no_of_days <= 30) && (a.discount+"").length == 0 && (a.ref_id == '' || a.ref_id == null)) {
                total++;
            }
            else if((a.no_of_days <= 2) && (a.discount+"").length > 0) {
                total++;
            }
        }
        return total;
    }
    triggerDashboardButton(data){
        this.contentheader = data.name || "";
        this.contenturl = data.module || "";
        document.getElementById('id01').style.display='block';
    }
    logout(){
        Session.logout();
    }
    openUserInfo(){
        this.contentheader = this.user.name || "";
        this.contenturl = "./profile";
        document.getElementById('id01').style.display='block';
    }
    restock(){
        this.contentheader = "Restock Product";
        this.contenturl = "../restock/index";
        document.getElementById('id01').style.display='block';
    }
    config(){
        return [
            {
                name: "Supplier",
                module: "../supplier/index"
            },
            {
                name: "Reports",
                module: "../reports/index"
            },
            {
                name: "Products",
                module: "../product/index"
            },
            {
                name: "Employee",
                module: "../employee/index"
            }
        ]
    }
}