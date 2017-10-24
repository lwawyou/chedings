import moment from "moment";

export const Session = {
    user: Object.assign({}, (window.user || {})),
    setUser: function (data) {
        window.user = {};
        window.user = Object.assign({}, data[0]);
        Session.user = data[0];
    },
    getGlobal: function(){
        return JSON.parse(localStorage.getItem("global") || "");
    },
    setGlobal: function(value){
        localStorage.setItem("global",JSON.stringify(value || ""));
    },
    logout: function () {
        window.user = {};
        window.logout = true;
        location.href = "/chedings";
        // window.history.back();
        // location.reload();
    },
    showOrder: function (callback) {
        $('body').on('keydown', function (e) {
            if ((e.which || e.keyCode) == 112) {
                window.order = false;
                var event = new Event('keypress');
                event.which = 122; // Character F11 equivalent.
                event.altKey = false;
                event.ctrlKey = false;
                event.shiftKey = false;
                event.metaKey = false;
                document.dispatchEvent(event);
                callback(true);
                e.preventDefault();
            } else callback(false);
            // else
            // {
            //     window.order = true;
            //     $('body').trigger(122);
            //     callback(true);
            //     e.preventDefault();
            // }
        });
    },
    message: function (msg) {
        $("#notificationbar #value").html(msg);
        $("#notificationbar").removeClass("show");
        setTimeout(function () { $("#notificationbar").toggleClass("show"); }, 500);
    },
    getYear: function () {
        return moment().format("YYYY");
    },
    getDay: function () {
        return moment().format("DD");
    },
    getMonth: function () {
        return moment().format("MM");
    },
    getDate: function () {
        return moment().format("YYYY-MM-DD").toString();
    },
    getDateByYearMonth: function (value) {
        return moment(value).format("YYYY-MM").toString();
    },
    getMonthByName: function (value) {
        return moment(value).format("MMMM");
    },
    getTime: function () {
        return moment().format("LT").toString();
    },
    getFormalDate: function (value) {
        return moment(value).format('LL');
    },
    getFirstDay: function (value) {
        return moment(value).weekday();
    },
    getFirstDate: function (value) {
        return moment(value).startOf('month').format("YYYY-MM-DD").toString();
    },
    getLastDate: function (value) {
        return moment(value).endOf('month').format('DD');
    },
    lpad: function(value, num, optional){
        var temp = "";
        value = value+"";
        for(var i = num; i > 0; i--){
            if(i<=value.length){
                temp += value[value.length - i];
            }else{
                temp += optional || " ";
            }
        }
        return temp;
    },
    rpad: function(value, num, optional){
        var temp = "";
        for(var i = 0; i < num; i++){
            if(i<value.length){
                temp += value[i];
            }else{
                temp += optional || " ";
            }
        }
        return temp;
    },
    phpFormat: function(value){
        var number = (value || "")+"", 
        dollars = number.split('.')[0], 
        cents = (number.split('.')[1] || '') +'00';
        dollars = dollars.split('').reverse().join('')
            .replace(/(\d{3}(?!$))/g, '$1,')
            .split('').reverse().join('');
        if(number.length>0)
        return '₱' + dollars + '.' + cents.slice(0, 2);
        return "";
    },
    loadBadge: function (i) {
        var badge = document.getElementById('badge');
        clearInterval(window.int);
        if (i == 0) {
            badge.removeChild(badge.children[0]);
            return;
        }
        updateBadge(i);
        window.int = window.setInterval(function () {
            updateBadge(i);
            if (!document.getElementById('badge')) {
                clearInterval(window.int);
            }
        }, 2000); //Update the badge ever 5 seconds
        var badgeNum;
        function updateBadge(alertNum) {//To rerun the animation the element must be re-added back to the DOM
            var badgeChild = badge.children[0];
            if (badgeChild.className === 'badge-num')
                badge.removeChild(badge.children[0]);

            badgeNum = document.createElement('div');
            badgeNum.setAttribute('class', 'badge-num');
            badgeNum.innerText = alertNum;
            var insertedElement = badge.insertBefore(badgeNum, badge.firstChild);
        }
    }
}