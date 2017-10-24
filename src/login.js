import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import {Main} from "./resources/js/main";
import {Api} from "./api/index";
import {Session} from "./api/session";

@inject(EventAggregator,Router,Api)
export class Login{
    user = {};
    constructor(EventAggregator,Router,Api){
        this.router = Router;
        this.api = Api;
        this.user.type = "ADMIN";
        this.user.username = localStorage.getItem('user') || "";
        this.user.password = "";
        
    }
    attached(){
        this.greetname = localStorage.getItem('name') || 'Back';
        if(this.greetname != "Back") Main.initializeJS();
    }
    login(){
        let self = this;
        window.chedings = {};
        localStorage.setItem('name',"Admin");
        localStorage.setItem('user',this.user.username);
        this.api.authLogin(this.user, function(data){
            if(data.length > 0) self.router.navigate(data);
            else Session.message("Invalid Username or Password!");
        });
        
    }
}