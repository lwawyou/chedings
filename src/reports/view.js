import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ReportsHelper } from "../api/reports/helper";
import { Session } from '../api/session';

@inject(ReportsHelper,Router)
export class View {
    table = {
        calendar: [],
        data: {},
        dates: [],
        month: [],
        grandtotal: []
    };
    reports = {};
    selectedreports = "";
    constructor(ReportsHelper,Router) {
        this.reportsHelper = ReportsHelper;
        this.router = Router;

        let data = Session.getGlobal();
        this.selectedreports = data[2];
        if(this.selectedreports == 3) {
            this.viewSalesReport(data);
        }else{
            this.deletedReports(data);
        }
    }
    activate() {
    }
    back(){
        this.router.navigateBack();
    }
    viewSalesReport(data){
        let self = this;
        let arr = ["'"+data[0]+"'", "'"+data[1]+"'"];
        this.reportsHelper.sales(arr, function (result) {
            self.table.data = JSON.parse(result || "[]");
            self.setMonths();
            self.setCalendar();
        });
    }
    deletedReports(data){
        let self = this;
        let arr = [
            "'"+data[0]+"'", 
            "'"+data[1]+"'",
            "'"+data[2]+"'"
        ];
        this.reportsHelper.deleted(arr, function(result){
            let temp = JSON.parse(result || "");
            self.reports.products = temp;
            console.log("Deleted Reports: ", temp);
        });
    }
    setCalendar() {
        let data = this.table.dates;
        for (var i in data) {
            let date = data[i];
            this.table.calendar.push(
                this.createCalendar(
                    Session.getFirstDay(Session.getFirstDate(date)),
                    Session.getLastDate(date),
                    i)
            );
        }
    }
    setMonths() {
        let self = this;
        let data = this.table.data;
        for (var i in data) {
            let date = data[i].saledate;
            let init = function () {
                return self.table.dates.indexOf(Session.getFirstDate(date));
            }
            let checkDate = init();
            if (checkDate < 0) {
                this.table.dates.push(
                    Session.getFirstDate(date)
                );
                this.table.month.push(Session.getMonthByName(date));
                checkDate = init();
            }
            this.table.data[i].indexOfDates = checkDate;
        }
    }
    createCalendar(day, max, signature) {
        var tr = [],
            td = [],
            min = 1,
            week = 7,
            sum = 0,
            grandtotal = 0,
            cont = 0;
        let data = this.table.data.filter(function (data) {
            return data.indexOfDates == signature;
        });
        for (var i = 1; i <= max; i++) {
            if (i == 1) {
                for (var j = 0; j < day; j++) {
                    td.push("");
                    min++;
                }
            }
            var content = i;
            if (data.length > cont) {
                if (data[cont].indexOfDates == signature &&
                    data[cont].saledate == (Session.getDateByYearMonth(data[cont].saledate) + "-" + Session.lpad(i, 2, "0"))
                ) {
                    sum += Number(data[cont].sales);
                    content += " | " + Session.phpFormat(data[cont].sales);
                    cont++;
                }
            }

            td.push(content);
            if (min == week) {
                grandtotal += sum;
                td.push(Session.phpFormat(sum));
                tr.push(td);
                td = [];
                min = 1;
                sum = 0;
            } else if (i == max) {
                for (var j = td.length; j < 7; j++) {
                    td.push("");
                }
                grandtotal += sum;
                td.push(Session.phpFormat(sum));
                tr.push(td);
                sum = 0;
            } else {
                min++;
            }
        }
        this.table.grandtotal.push(Session.phpFormat(grandtotal));
        return tr;
    }
}