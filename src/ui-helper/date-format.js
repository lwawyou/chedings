import {Session} from '../api/session';

export class DateFormatValueConverter{
    toView(value){
        
        return Session.getFormalDate(value || "");
    }
}