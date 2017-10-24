export class Supplier{
    id = "";
    constructor(){
        this._url = this.route()[0]["module"];
    }
    activate(){
        this._url = this.route()[0]["module"];
    }
    addSupplier(){
        this._url = this.route()[1]["module"]; 
    }
    addProduct(){
        this._url = this.route()[3]["module"]; 
    }
    editSupplier(_id){
        window.chedings.supplier_id = _id;
        this._url = this.route()[2]["module"]; 
    }
    viewProduct(_id){
        window.chedings.supplier_id = _id;
        this._url = this.route()[4]["module"]; 
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
            ,
            {
                name: "Add Product",
                module: "./add-product"
            }
            ,
            {
                name: "View Product",
                module: "./view-product"
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