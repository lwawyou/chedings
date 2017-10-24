import {Session} from '../api/session';

export class PhpFormatValueConverter{
    toView(value){
        return Session.phpFormat(value);
    }
}