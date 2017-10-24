export class Employee{
    id = "";
    constructor(){
        this._url = this.route()[0]["module"];
    }
    activate(){
        this._url = this.route()[0]["module"];
    }
    addEmployee(){
        this._url = this.route()[1]["module"]; 
    }
    editEmployee(_id){
        window.chedings.id = _id;
        this._url = this.route()[2]["module"]; 
    }
    route(){
        return [
            {
                name: "View",
                module: "./view"
            },
            {
                name: "Add",
                module: "./add"
            }
            ,
            {
                name: "Edit",
                module: "./edit"
            }
        ]
    }
    openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-border-red", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.firstElementChild.className += " w3-border-red";
    }
    
}