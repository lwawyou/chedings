import {Config} from "../config";
import {Session} from "./session";

export class Api{
    constructor(){

    }
    get(value){
        return this.request(value, "GET");
    }
    post(value){
        return this.request(value, "POST");
    }
    request(_data, _type){
        return $.ajax(Config.host(),{
            data: {data: _data || ""},
            type: _type || "POST"
        })
    }
    authLogin(user, callback){
        let sql = "call login_user('"+user.username+"','"+user.password+"')"
        this.request(sql, "POST").done(function(data){
            let _data = JSON.parse(data);
            Session.setUser(_data);
            let type = _data[0]["type"];
            switch(type){
                case '1': callback("chedings/admin/dashboard");
                    break;
                case '2': callback("chedings/manager/dashboard");
                    break;
                case '3': callback("chedings/employee/dashboard");
                    break;
                default: callback("");
                    break;
            }
        }).fail(function(data){
            console.log("Fail: ",data)
            callback("");
        });
    }
    uploadPicture(input, id, callback){
        console.log("file: ", input.files);
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(id).attr('src', e.target.result);
                callback(e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
}