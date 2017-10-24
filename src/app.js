import {Main} from "./resources/js/main";
import {Redirect} from 'aurelia-router';

export class App {
  configureRouter(config, router){
    var step = new AuthorizeStep;
    config.addAuthorizeStep(step)
    config.title = 'Chedings';
    config.options.pushState = true;
    config.options.root = "/";
    config.map([
      { 
        route: ['/', '/chedings'],              
        moduleId: 'login',   
        title: 'Login'
      },
      { 
        route: '/chedings/admin/dashboard',              
        moduleId: 'admin/dashboard',   
        title: 'Dashboard', 
        settings: { auth: true } 
      },
      { 
        route: '/chedings/manager/dashboard',              
        moduleId: 'manager/dashboard',   
        title: 'Dashboard', 
        settings: { auth: true } 
      },
      { 
        route: '/chedings/employee/dashboard',              
        moduleId: 'employee/dashboard',   
        title: 'Dashboard', 
        settings: { auth: true } 
      },
      { 
        route: '/chedings/order/dashboard',              
        moduleId: 'order/view',   
        title: 'View', 
        settings: { auth: true } 
      },
      { 
        route: '/chedings/dashboard/reports-sales',              
        moduleId: 'reports/view',   
        title: 'View', 
        settings: { auth: true } 
      }
      
    ]);
    this.router = router;
  }

  attached(){
    console.log("Initializing resources.");
    Main.loginJS();
  }
}  
class AuthorizeStep {
    run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
        // console.log(navigationInstruction);
        var isLoggedIn = true;// insert magic here;
        if (!isLoggedIn) {
          return next.cancel(new Redirect('chedings'));
        }
      }

      return next();
    }
  }