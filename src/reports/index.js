import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Session} from "../api/session";
import {ReportsHelper} from "../api/reports/helper";

@inject(ReportsHelper, Router)
export class Reports{
    id = "";
    user = {};
    reports = {
        products: []
    };
    constructor(ReportsHelper, Router){
        this.user = Session.user;
        this.reportsHelper = ReportsHelper;
        this.router = Router;

        this.startdate = Session.getDate();
        this.enddate = Session.getDate();
    }
    activate(){
    }
    viewReport(){
        
        let ch = this.selectedreports;
        let startdate = this.startdate || "";
        let enddate = this.enddate || "";
        this.reports.title = '';
        if(startdate.length > 0 || enddate.length > 0){
            switch(ch){
                case "1": 
                    // this.reports.title = 'Deleted Products';
                    Session.setGlobal([startdate, enddate, ch]);
                    this.router.navigate("/chedings/dashboard/reports-sales");
                    break;
                case "2": 
                    // this.reports.title = 'Deleted Employees';
                    Session.setGlobal([startdate, enddate, ch]);
                    this.router.navigate("/chedings/dashboard/reports-sales");
                    break;
                case "3": 
                    // this.reports.title = 'Sales';
                    Session.setGlobal([startdate, enddate, ch]);
                    this.router.navigate("/chedings/dashboard/reports-sales");
                    break;
                default: Session.message("Select a category!");
                    break;
            }
        }else Session.message("Invalid Date.");
    }
    print(){
        let ch = this.selectedreports;
        let startdate = this.startdate || "";
        let enddate = this.enddate || "";
        this.reports.title = '';
        if(startdate.length > 0 || enddate.length > 0){
            switch(ch){
                case "1": 
                    this.reports.title = 'Deleted Products';
                    this.deletedReports(1);
                    break;
                case "2": 
                    this.reports.title = 'Deleted Employees';
                    this.deletedReports(2);
                    break;
                case "3": 
                    this.reports.title = 'Sales';
                    this.salesReports(3);
                    break;
                default: Session.message("Select a category!");
                    break;
            }
        }else Session.message("Invalid Date.");
    }
    deletedReports(ch){
        let _arr = [
            "'"+this.startdate+"'",
            "'"+this.enddate+"'",
            ch
        ];
        let self = this;
        this.reportsHelper.deleted(_arr, function(result){
            let temp = JSON.parse(result || "");
            self.reports.products = temp;
            Session.message("Loading print report.");
            self.printPage();
        });
    }
    salesReports(ch){
        let _arr = [
            "'"+this.startdate+"'",
            "'"+this.enddate+"'"
        ];
        let self = this;
        this.reportsHelper.sales(_arr, function(result){
            let temp = JSON.parse(result || "");
            self.reports.products = temp;
            Session.message("Loading print report.");
            self.printPage();
        });
    }
    printPage(){
        $("#reportprint").contents().find("body").html("");
        setTimeout(function(){
            $("#reportprint").contents().find("body").append($("#reportprintpage").html());
            setTimeout(function(){
                window.frames["reportprint"].focus();
                window.frames["reportprint"].print();
            },1000);
        },500);
    }
    
}