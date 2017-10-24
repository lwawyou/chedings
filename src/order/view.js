import { Router } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {Session} from "../api/session";
import {ProductHelper} from "../api/product/helper";
import {OrderHelper} from "../api/order/helper";

@inject(Router,ProductHelper,OrderHelper)
export class View{
    order = {};
    product = {};
    productArr = [];

    user = Session.user;
    receipt = {};
    receiptorder = [];
    constructor(Router,ProductHelper,OrderHelper){
        this.router = Router;
        this.productHelper = ProductHelper;
        this.orderHelper = OrderHelper;
    
        let self = this;
        this.productHelper.getList(function(result){
            self.productArr = JSON.parse(result || "");
            self.loadAutoCompleter(self.productArr);
        });
        this.order.purchase = [];
        
    }
    activate(){
        let self = this;
        Session.showOrder(function(result){
            if(result) self.router.navigate(Session.landingpage);
        });
    }
    attached(){
       
    }
    loadAutoCompleter(valArray){
        let arr = [];
        for(var i=0; i<valArray.length;i++)
        {
            arr.push(valArray[i].pin_number);
        }
        console.log("Completer: ",arr);
        $( "#productnocompleter" ).autocomplete({
            source: arr
        });
    }
    loadProductInfo(){
        let self = this;
        let id = this.order.productno || "";
        this.productArr.forEach(function(val){
            if(val.pin_number == id)
            {
                val.quantity = "1";
                self.product = val;
                self.order.purchase.push(val);
                self.order.productno = "";
            }
        });
    }
    removeOrder(i){
        console.log(i);
        this.order.purchase.splice(i, 1);
    }
    cashIn(){
        let self = this;
        let cash = Number(this.order.cash);
        let total = Number(this.totalAmount);
        this.receipt.time = Session.getTime();
        this.receipt.date = Session.getDate();
        let time = JSON.stringify(this.receipt.time);
        let date = JSON.stringify(this.receipt.date);
        this.receiptorder = this.order.purchase;
        this.receipt.total = total;
        this.receipt.cash = cash;
        this.receipt.vat = total * 0.12;

        if(cash>=total)
        {
            this.order.change = (Number(cash) - Number(total))+"";
            this.receipt.change = this.order.change;
            document.getElementById("id01").style.display='block';
            
            this.orderHelper.createTransaction([cash, time, date, Session.user.id],function(done){
                let row = JSON.parse(done || "");
                self.receipt.no = row[0].receiptno;
                let order = self.order.purchase;
                for(var i=0;i<order.length;i++)
                {
                    let arr = [
                        order[i].id,
                        order[i].quantity,
                        row[0].id
                    ];
                    self.orderHelper.create(arr,function(result){
                        console.log("",result);
                    });
                }
                self.clear();
            });
            $("#receiptprint").contents().find("body").html("");
            setTimeout(function(){
                $("#receiptprint").contents().find("body").append($("#receiptpage").html());
                setTimeout(function(){
                    window.frames["receiptiframe"].focus();
                    window.frames["receiptiframe"].print();
                },1000);
            },500);
        }
    }
    clear(){
        this.order.purchase = [];
        this.order.cash = "";
        this.product = {};
    }
    get totalAmount(){
        let arr = this.order.purchase;
        let sum = 0;
        for(var i=0;i<arr.length;i++)
        {
            let temp = arr[i];
            let quantity = temp.quantity.length>0 ? temp.quantity : 0;
            sum+= quantity * (temp.cost - temp.discount);
        }
        return sum+"";
    }
}