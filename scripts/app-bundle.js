define('app',['exports', './resources/js/main', 'aurelia-router'], function (exports, _main, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      var step = new AuthorizeStep();
      config.addAuthorizeStep(step);
      config.title = 'Chedings';
      config.options.pushState = true;
      config.options.root = "/";
      config.map([{
        route: ['/', '/chedings'],
        moduleId: 'login',
        title: 'Login'
      }, {
        route: '/chedings/admin/dashboard',
        moduleId: 'admin/dashboard',
        title: 'Dashboard',
        settings: { auth: true }
      }, {
        route: '/chedings/manager/dashboard',
        moduleId: 'manager/dashboard',
        title: 'Dashboard',
        settings: { auth: true }
      }, {
        route: '/chedings/employee/dashboard',
        moduleId: 'employee/dashboard',
        title: 'Dashboard',
        settings: { auth: true }
      }, {
        route: '/chedings/order/dashboard',
        moduleId: 'order/view',
        title: 'View',
        settings: { auth: true }
      }, {
        route: '/chedings/dashboard/reports-sales',
        moduleId: 'reports/view',
        title: 'View',
        settings: { auth: true }
      }]);
      this.router = router;
    };

    App.prototype.attached = function attached() {
      console.log("Initializing resources.");
      _main.Main.loginJS();
    };

    return App;
  }();

  var AuthorizeStep = function () {
    function AuthorizeStep() {
      _classCallCheck(this, AuthorizeStep);
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.auth;
      })) {
        var isLoggedIn = true;
        if (!isLoggedIn) {
          return next.cancel(new _aureliaRouter.Redirect('chedings'));
        }
      }

      return next();
    };

    return AuthorizeStep;
  }();
});
define('config',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Config = exports.Config = function () {
        function Config() {
            _classCallCheck(this, Config);
        }

        Config.host = function host() {
            return "http://localhost/Chedings/server/query.php";
        };

        return Config;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('login',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', './resources/js/main', './api/index', './api/session'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter, _main, _index, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _aureliaRouter.Router, _index.Api), _dec(_class = function () {
        function Login(EventAggregator, Router, Api) {
            _classCallCheck(this, Login);

            this.user = {};

            this.router = Router;
            this.api = Api;
            this.user.type = "ADMIN";
            this.user.username = localStorage.getItem('user') || "";
            this.user.password = "";
        }

        Login.prototype.attached = function attached() {
            this.greetname = localStorage.getItem('name') || 'Back';
            if (this.greetname != "Back") _main.Main.initializeJS();
        };

        Login.prototype.login = function login() {
            var self = this;
            window.chedings = {};
            localStorage.setItem('name', "Admin");
            localStorage.setItem('user', this.user.username);
            this.api.authLogin(this.user, function (data) {
                if (data.length > 0) self.router.navigate(data);else _session.Session.message("Invalid Username or Password!");
            });
        };

        return Login;
    }()) || _class);
});
define('main',['exports', './environment', 'jquery-ui'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('admin/dashboard',["exports", "aurelia-framework", "../api/session", "../api/product/helper", "aurelia-router"], function (exports, _aureliaFramework, _session, _helper, _aureliaRouter) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dashboard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper, _aureliaRouter.Router), _dec(_class = function () {
        function Dashboard(ProductHelper, Router) {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];
            this.user = {};
            this.stocks = [];

            this.router = Router;
            this.dashboard = this.config();
            this.productHelper = ProductHelper;
            this.user = _session.Session.user;
            if (this.user.pic.length == 0) {
                this.user.pic = "/src/resources/img/img_avatar2.png";
            }
            var self = this;

            _session.Session.showOrder(function (result) {
                if (result) self.router.navigate("/chedings/order/dashboard");
            });

            _session.Session.landingpage = window.location.pathname;
        }

        Dashboard.prototype.attached = function attached() {
            this.loadStock();
        };

        Dashboard.prototype.loadStock = function loadStock() {
            this.productHelper.getStocks(function (result) {
                this.stocks = JSON.parse(result || '[]');
                _session.Session.loadBadge(this.notification(this.stocks));
            }.bind(this));
        };

        Dashboard.prototype.notification = function notification(stocks) {
            var limitPercentage = parseFloat("10.00%");
            var total = 0;
            for (var i in stocks) {
                var a = stocks[i];
                if ((parseFloat(a.percentage || "0.00%") <= limitPercentage || a.no_of_days <= 30) && (a.discount + "").length == 0 && (a.ref_id == '' || a.ref_id == null)) {
                    total++;
                } else if (parseFloat(a.percentage || "0.00%") != limitPercentage && a.no_of_days <= 30 && (a.discount + "").length == 0 && (a.ref_id == '' || a.ref_id == null)) {
                    total++;
                } else if (a.no_of_days <= 2 && (a.discount + "").length > 0) {
                    total++;
                }
            }
            return total;
        };

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.logout = function logout() {
            _session.Session.logout();
        };

        Dashboard.prototype.openUserInfo = function openUserInfo() {
            this.contentheader = this.user.name || "";
            this.contenturl = "./profile";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.restock = function restock() {
            this.contentheader = "Restock Product";
            this.contenturl = "../restock/index";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Supplier",
                module: "../supplier/index"
            }, {
                name: "Reports",
                module: "../reports/index"
            }, {
                name: "Products",
                module: "../product/index"
            }, {
                name: "Employee",
                module: "../employee/index"
            }];
        };

        return Dashboard;
    }()) || _class);
});
define('admin/profile',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function Profile(UserHelper, UserType) {
            _classCallCheck(this, Profile);

            this.userHelper = UserHelper;
            this.userType = UserType;
        }

        Profile.prototype.activate = function activate() {
            var self = this;
            this.user = _session.Session.user;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        };

        Profile.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            this.user.name = [this.user.firstname, this.user.lastname].join(" ");
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.user = self.user;
                _session.Session.message(msg[0].output);
            });
        };

        Profile.prototype.upload = function upload() {
            var self = this;
            var input = $("#FileUploadImage")[0];
            this.userHelper.uploadProfile(input, "#imgPreview", function (result) {
                self.user.pic = result || "";
            });
        };

        return Profile;
    }()) || _class);
});
define('employee/add',["exports", "aurelia-framework", "../api/user/user-type", "../api/user/helper", "../api/session"], function (exports, _aureliaFramework, _userType, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Add = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Add = exports.Add = (_dec = (0, _aureliaFramework.inject)(_userType.UserType, _helper.UserHelper), _dec(_class = function () {
        function Add(UserType, UserHelper) {
            _classCallCheck(this, Add);

            this.user = {};

            this.userType = UserType;
            this.userHelper = UserHelper;
            var self = this;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        }

        Add.prototype.activate = function activate() {};

        Add.prototype.register = function register() {
            var _arr = ["'" + this.user.firstname + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.password + "'", "'" + this.user.type + "'"];
            var self = this;
            this.userHelper.create(_arr, function (result) {
                var msg = JSON.parse(result || "");
                self.clear();
                _session.Session.message(msg[0].output);
            });
        };

        Add.prototype.clear = function clear() {
            this.user = {};
        };

        return Add;
    }()) || _class);
});
define('employee/dashboard',["exports", "aurelia-framework", "../api/session", "../api/product/helper", "aurelia-router"], function (exports, _aureliaFramework, _session, _helper, _aureliaRouter) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dashboard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper, _aureliaRouter.Router), _dec(_class = function () {
        function Dashboard(ProductHelper, Router) {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];
            this.user = {};
            this.stocks = [];

            this.productHelper = ProductHelper;
            this.router = Router;
            this.dashboard = this.config();
            this.user = _session.Session.user;
            if (this.user.pic.length == 0) {
                this.user.pic = "/src/resources/img/img_avatar2.png";
            }

            var self = this;
            self.productHelper.getStocks(function (result) {
                self.stocks = JSON.parse(result || '[]');
            });

            _session.Session.showOrder(function (result) {
                if (result) self.router.navigate("/chedings/order/dashboard");
            });
            _session.Session.landingpage = window.location.pathname;
        }

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.openUserInfo = function openUserInfo() {
            this.contentheader = this.user.name || "";
            this.contenturl = "./profile";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.logout = function logout() {
            _session.Session.logout();
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Products",
                module: "../product/index"
            }];
        };

        return Dashboard;
    }()) || _class);
});
define('employee/edit',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function View(UserHelper, UserType) {
            _classCallCheck(this, View);

            this.user = {};

            this.userHelper = UserHelper;
            this.userType = UserType;

            var self = this;

            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
            this.user.id = window.chedings.id;
            this.userHelper.getInfo(this.user.id, function (result) {
                var _user = JSON.parse(result || "");
                if (_user.length > 0) {
                    self.user = _user[0];
                }
            });
        }

        View.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.message(msg[0].output);
            });
        };

        View.prototype.clear = function clear() {
            this.user = {};
        };

        return View;
    }()) || _class);
});
define('employee/index',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Employee = exports.Employee = function () {
        function Employee() {
            _classCallCheck(this, Employee);

            this.id = "";

            this._url = this.route()[0]["module"];
        }

        Employee.prototype.activate = function activate() {
            this._url = this.route()[0]["module"];
        };

        Employee.prototype.addEmployee = function addEmployee() {
            this._url = this.route()[1]["module"];
        };

        Employee.prototype.editEmployee = function editEmployee(_id) {
            window.chedings.id = _id;
            this._url = this.route()[2]["module"];
        };

        Employee.prototype.route = function route() {
            return [{
                name: "View",
                module: "./view"
            }, {
                name: "Add",
                module: "./add"
            }, {
                name: "Edit",
                module: "./edit"
            }];
        };

        Employee.prototype.openCity = function openCity(evt, cityName) {
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
        };

        return Employee;
    }();
});
define('employee/profile',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function Profile(UserHelper, UserType) {
            _classCallCheck(this, Profile);

            this.userHelper = UserHelper;
            this.userType = UserType;
        }

        Profile.prototype.activate = function activate() {
            var self = this;
            this.user = _session.Session.user;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        };

        Profile.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            this.user.name = [this.user.firstname, this.user.lastname].join(" ");
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.user = self.user;
                _session.Session.message(msg[0].output);
            });
        };

        Profile.prototype.upload = function upload() {
            var self = this;
            var input = $("#FileUploadImage")[0];
            this.userHelper.uploadProfile(input, "#imgPreview", function (result) {
                self.user.pic = result || "";
            });
        };

        return Profile;
    }()) || _class);
});
define('employee/view',["exports", "aurelia-framework", "../api/user/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper), _dec(_class = function () {
        function View(UserHelper) {
            _classCallCheck(this, View);

            this.employee = [];

            this.userHelper = UserHelper;
        }

        View.prototype.activate = function activate() {
            console.log("View activated");
            var self = this;
            this.userHelper.getList(function (result) {
                self.employee = JSON.parse(result || "");
                self.employee = self.employee.filter(function (a) {
                    return a.id != _session.Session.user.id;
                });
            });
        };

        View.prototype.deleteEmployee = function deleteEmployee(_id) {
            var self = this;
            this.userHelper.deleteInfo(_id, function (result) {
                var msg = JSON.parse(result || "");
                self.activate();
                _session.Session.message(msg[0].output);
            });
        };

        View.prototype.checkProfileImage = function checkProfileImage(user) {
            if ((user.pic || "").length == 0) {
                return "/src/resources/img/img_avatar2.png";
            }
            return user.pic;
        };

        return View;
    }()) || _class);
});
define('manager/dashboard',["exports", "aurelia-framework", "../api/session", "../api/product/helper", "aurelia-router"], function (exports, _aureliaFramework, _session, _helper, _aureliaRouter) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dashboard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper, _aureliaRouter.Router), _dec(_class = function () {
        function Dashboard(ProductHelper, Router) {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];
            this.user = {};
            this.stocks = [];

            this.productHelper = ProductHelper;
            this.router = Router;
            this.dashboard = this.config();
            this.user = _session.Session.user;
            if (this.user.pic.length == 0) {
                this.user.pic = "/src/resources/img/img_avatar2.png";
            }
            var self = this;

            _session.Session.showOrder(function (result) {
                if (result) self.router.navigate("/chedings/order/dashboard");
            });
            _session.Session.landingpage = window.location.pathname;
        }

        Dashboard.prototype.attached = function attached() {
            this.loadStock();
        };

        Dashboard.prototype.loadStock = function loadStock() {
            this.productHelper.getStocks(function (result) {
                this.stocks = JSON.parse(result || '[]');
                _session.Session.loadBadge(this.notification(this.stocks));
            }.bind(this));
        };

        Dashboard.prototype.notification = function notification(stocks) {
            var limitPercentage = parseFloat("10.00%");
            var total = 0;
            for (var i in stocks) {
                var a = stocks[i];
                if ((parseFloat(a.percentage || "0.00%") <= limitPercentage || a.no_of_days <= 30) && (a.discount + "").length == 0 && (a.ref_id == '' || a.ref_id == null)) total++;else if (parseFloat(a.percentage || "0.00%") != limitPercentage && a.no_of_days <= 30 && (a.discount + "").length == 0 && (a.ref_id == '' || a.ref_id == null)) total++;else if (a.no_of_days <= 2 && (a.discount + "").length > 0) total++;
            }
            return total;
        };

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.openUserInfo = function openUserInfo() {
            this.contentheader = this.user.name || "";
            this.contenturl = "./profile";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.restock = function restock() {
            this.contentheader = "Restock Product";
            this.contenturl = "../restock/index";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.logout = function logout() {
            _session.Session.logout();
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Supplier",
                module: "../supplier/index"
            }, {
                name: "Reports",
                module: "../reports/index"
            }, {
                name: "Products",
                module: "../product/index"
            }];
        };

        return Dashboard;
    }()) || _class);
});
define('manager/profile',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function Profile(UserHelper, UserType) {
            _classCallCheck(this, Profile);

            this.userHelper = UserHelper;
            this.userType = UserType;
        }

        Profile.prototype.activate = function activate() {
            var self = this;
            this.user = _session.Session.user;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        };

        Profile.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            this.user.name = [this.user.firstname, this.user.lastname].join(" ");
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.user = self.user;
                _session.Session.message(msg[0].output);
            });
        };

        Profile.prototype.upload = function upload() {
            var self = this;
            var input = $("#FileUploadImage")[0];
            this.userHelper.uploadProfile(input, "#imgPreview", function (result) {
                self.user.pic = result || "";
            });
        };

        return Profile;
    }()) || _class);
});
define('order/receipt',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Receipt = exports.Receipt = function Receipt() {
        _classCallCheck(this, Receipt);
    };
});
define('order/view',['exports', 'aurelia-router', 'aurelia-framework', '../api/session', '../api/product/helper', '../api/order/helper'], function (exports, _aureliaRouter, _aureliaFramework, _session, _helper, _helper2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _helper.ProductHelper, _helper2.OrderHelper), _dec(_class = function () {
        function View(Router, ProductHelper, OrderHelper) {
            _classCallCheck(this, View);

            this.order = {};
            this.product = {};
            this.productArr = [];
            this.user = _session.Session.user;
            this.receipt = {};
            this.receiptorder = [];

            this.router = Router;
            this.productHelper = ProductHelper;
            this.orderHelper = OrderHelper;

            var self = this;
            this.productHelper.getList(function (result) {
                self.productArr = JSON.parse(result || "");
                self.loadAutoCompleter(self.productArr);
            });
            this.order.purchase = [];
        }

        View.prototype.activate = function activate() {
            var self = this;
            _session.Session.showOrder(function (result) {
                if (result) self.router.navigate(_session.Session.landingpage);
            });
        };

        View.prototype.attached = function attached() {};

        View.prototype.loadAutoCompleter = function loadAutoCompleter(valArray) {
            var arr = [];
            for (var i = 0; i < valArray.length; i++) {
                arr.push(valArray[i].pin_number);
            }
            console.log("Completer: ", arr);
            $("#productnocompleter").autocomplete({
                source: arr
            });
        };

        View.prototype.loadProductInfo = function loadProductInfo() {
            var self = this;
            var id = this.order.productno || "";
            this.productArr.forEach(function (val) {
                if (val.pin_number == id) {
                    val.quantity = "1";
                    self.product = val;
                    self.order.purchase.push(val);
                    self.order.productno = "";
                }
            });
        };

        View.prototype.removeOrder = function removeOrder(i) {
            console.log(i);
            this.order.purchase.splice(i, 1);
        };

        View.prototype.cashIn = function cashIn() {
            var self = this;
            var cash = Number(this.order.cash);
            var total = Number(this.totalAmount);
            this.receipt.time = _session.Session.getTime();
            this.receipt.date = _session.Session.getDate();
            var time = JSON.stringify(this.receipt.time);
            var date = JSON.stringify(this.receipt.date);
            this.receiptorder = this.order.purchase;
            this.receipt.total = total;
            this.receipt.cash = cash;
            this.receipt.vat = total * 0.12;

            if (cash >= total) {
                this.order.change = Number(cash) - Number(total) + "";
                this.receipt.change = this.order.change;
                document.getElementById("id01").style.display = 'block';

                this.orderHelper.createTransaction([cash, time, date, _session.Session.user.id], function (done) {
                    var row = JSON.parse(done || "");
                    self.receipt.no = row[0].receiptno;
                    var order = self.order.purchase;
                    for (var i = 0; i < order.length; i++) {
                        var arr = [order[i].id, order[i].quantity, row[0].id];
                        self.orderHelper.create(arr, function (result) {
                            console.log("", result);
                        });
                    }
                    self.clear();
                });
                $("#receiptprint").contents().find("body").html("");
                setTimeout(function () {
                    $("#receiptprint").contents().find("body").append($("#receiptpage").html());
                    setTimeout(function () {
                        window.frames["receiptiframe"].focus();
                        window.frames["receiptiframe"].print();
                    }, 1000);
                }, 500);
            }
        };

        View.prototype.clear = function clear() {
            this.order.purchase = [];
            this.order.cash = "";
            this.product = {};
        };

        _createClass(View, [{
            key: 'totalAmount',
            get: function get() {
                var arr = this.order.purchase;
                var sum = 0;
                for (var i = 0; i < arr.length; i++) {
                    var temp = arr[i];
                    var quantity = temp.quantity.length > 0 ? temp.quantity : 0;
                    sum += quantity * (temp.cost - temp.discount);
                }
                return sum + "";
            }
        }]);

        return View;
    }()) || _class);
});
define('product/add',["exports", "aurelia-framework", "../api/product/helper", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _helper2, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Add = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Add = exports.Add = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper, _helper2.SupplierHelper), _dec(_class = function () {
        function Add(ProductHelper, SupplierHelper) {
            _classCallCheck(this, Add);

            this.product = {};
            this.selectProduct = [];
            this.selectedProduct = "";
            this.selectSupplier = [];
            this.selectedSupplier = "";

            this.productHelper = ProductHelper;
            this.supplierHelper = SupplierHelper;
            var self = this;
            this.supplierHelper.getList(function (result) {
                var arr = JSON.parse(result || "");
                self.selectSupplier = arr;
            });
        }

        Add.prototype.activate = function activate() {};

        Add.prototype.changeSupplier = function changeSupplier() {
            console.log(this.selectedSupplier);
            var self = this;
            this.supplierHelper.viewProduct(self.selectedSupplier, function (result) {
                var arr = JSON.parse(result || "");
                self.selectProduct = arr;
            });
        };

        Add.prototype.chooseProduct = function chooseProduct() {
            var arr = this.selectProduct;
            for (var i = 0; i < arr.length; i++) {
                if (this.selectedProduct == arr[i].id) {
                    this.product = arr[i];
                }
            }
        };

        Add.prototype.register = function register() {
            var _arr = ["'" + this.product.description + "'", "'" + this.product.cost + "'", "'" + this.product.quantity + "'", "'" + this.product.company + "'", "'" + this.product.expire_date + "'", "'" + this.product.pic + "'"];
            var self = this;
            this.productHelper.create(_arr, function (result) {
                var msg = JSON.parse(result || "");
                self.clear();
                _session.Session.message(msg[0].output);
            });
        };

        Add.prototype.clear = function clear() {
            this.product = {};
        };

        Add.prototype.upload = function upload() {
            var self = this;
            var input = $("#productImage")[0];
            this.productHelper.uploadProfile(input, "#imgProductPreview", function (result) {
                self.product.pic = result || "";
            });
        };

        return Add;
    }()) || _class);
});
define('product/dashboard',["exports", "../api/session"], function (exports, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dashboard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Dashboard = exports.Dashboard = function () {
        function Dashboard() {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];
            this.user = {};

            this.dashboard = this.config();

            this.user = _session.Session.user;
        }

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.openUserInfo = function openUserInfo() {
            this.contentheader = this.user.name || "";
            this.contenturl = "./profile";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.logout = function logout() {
            Sessiong.logout();
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Products",
                module: ""
            }];
        };

        return Dashboard;
    }();
});
define('product/edit',["exports", "aurelia-framework", "../api/product/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Edit = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Edit = exports.Edit = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper), _dec(_class = function () {
        function Edit(ProductHelper) {
            _classCallCheck(this, Edit);

            this.product = {};

            this.productHelper = ProductHelper;

            var self = this;

            this.product.id = window.chedings.id;
            this.productHelper.getInfo(this.product.id, function (result) {
                var _product = JSON.parse(result || "");
                if (_product.length > 0) {
                    self.product = _product[0];
                }
            });
        }

        Edit.prototype.save = function save() {
            var _arr = ["'" + this.product.id + "'", "'" + this.product.description + "'", "'" + this.product.cost + "'", "'" + this.product.quantity + "'", "'" + this.product.supplier_id + "'", "'" + this.product.expire_date + "'", "'" + this.product.pic + "'"];
            var self = this;
            this.productHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                console.log(msg);
                _session.Session.message(msg[0].output);
            });
        };

        Edit.prototype.clear = function clear() {
            this.product = {};
        };

        return Edit;
    }()) || _class);
});
define('product/index',["exports", "../api/session"], function (exports, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Product = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Product = exports.Product = function () {
        function Product() {
            _classCallCheck(this, Product);

            this.id = "";
            this.user = {};
            this.usertypeRights = true;

            this._url = this.route()[0]["module"];
            this.user = _session.Session.user;
            if (self.user.type == 3) this.usertypeRights = false;
        }

        Product.prototype.activate = function activate() {
            this._url = this.route()[0]["module"];
        };

        Product.prototype.addProduct = function addProduct() {
            this._url = this.route()[1]["module"];
        };

        Product.prototype.editProduct = function editProduct(_id) {
            window.chedings.id = _id;
            this._url = this.route()[2]["module"];
        };

        Product.prototype.route = function route() {
            return [{
                name: "View",
                module: "./view"
            }, {
                name: "Add",
                module: "./add"
            }, {
                name: "Edit",
                module: "./edit"
            }];
        };

        Product.prototype.openCity = function openCity(evt, cityName) {
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
        };

        return Product;
    }();
});
define('product/profile',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function Profile(UserHelper, UserType) {
            _classCallCheck(this, Profile);

            this.userHelper = UserHelper;
            this.userType = UserType;
        }

        Profile.prototype.activate = function activate() {
            var self = this;
            this.user = _session.Session.user;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        };

        Profile.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            this.user.name = [this.user.firstname, this.user.lastname].join(" ");
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.user = self.user;
                _session.Session.message(msg[0].output);
            });
        };

        Profile.prototype.upload = function upload() {
            var self = this;
            var input = $("#FileUploadImage")[0];
            this.userHelper.uploadProfile(input, "#imgPreview", function (result) {
                self.user.pic = result || "";
            });
        };

        return Profile;
    }()) || _class);
});
define('product/view',["exports", "aurelia-framework", "../api/product/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper), _dec(_class = function () {
        function View(ProductHelper) {
            _classCallCheck(this, View);

            this.product = [];
            this.user = {};
            this.usertypeRights = true;

            this.productHelper = ProductHelper;
        }

        View.prototype.activate = function activate() {
            console.log("View activated");
            this.user = _session.Session.user;
            if (this.user.type == 3) this.usertypeRights = false;
            this.productHelper.getList(function (result) {
                this.product = JSON.parse(result || "");
                console.log("Product List: ", this.product);
            }.bind(this));
        };

        View.prototype.deleteProduct = function deleteProduct(_id) {
            var self = this;
            this.productHelper.deleteProduct(_id, function (result) {
                var msg = JSON.parse(result || "");
                self.activate();
                _session.Session.message(msg[0].output);
            });
        };

        return View;
    }()) || _class);
});
define('api/index',["exports", "../config", "./session"], function (exports, _config, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Api = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Api = exports.Api = function () {
        function Api() {
            _classCallCheck(this, Api);
        }

        Api.prototype.get = function get(value) {
            return this.request(value, "GET");
        };

        Api.prototype.post = function post(value) {
            return this.request(value, "POST");
        };

        Api.prototype.request = function request(_data, _type) {
            return $.ajax(_config.Config.host(), {
                data: { data: _data || "" },
                type: _type || "POST"
            });
        };

        Api.prototype.authLogin = function authLogin(user, callback) {
            var sql = "call login_user('" + user.username + "','" + user.password + "')";
            this.request(sql, "POST").done(function (data) {
                var _data = JSON.parse(data);
                _session.Session.setUser(_data);
                var type = _data[0]["type"];
                switch (type) {
                    case '1':
                        callback("chedings/admin/dashboard");
                        break;
                    case '2':
                        callback("chedings/manager/dashboard");
                        break;
                    case '3':
                        callback("chedings/employee/dashboard");
                        break;
                    default:
                        callback("");
                        break;
                }
            }).fail(function (data) {
                console.log("Fail: ", data);
                callback("");
            });
        };

        Api.prototype.uploadPicture = function uploadPicture(input, id, callback) {
            console.log("file: ", input.files);
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(id).attr('src', e.target.result);
                    callback(e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        return Api;
    }();
});
define('api/session',["exports", "moment"], function (exports, _moment) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Session = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var Session = exports.Session = {
        user: Object.assign({}, window.user || {}),
        setUser: function setUser(data) {
            window.user = {};
            window.user = Object.assign({}, data[0]);
            Session.user = data[0];
        },
        getGlobal: function getGlobal() {
            return JSON.parse(localStorage.getItem("global") || "");
        },
        setGlobal: function setGlobal(value) {
            localStorage.setItem("global", JSON.stringify(value || ""));
        },
        logout: function logout() {
            window.user = {};
            window.logout = true;
            location.href = "/chedings";
        },
        showOrder: function showOrder(callback) {
            $('body').on('keydown', function (e) {
                if ((e.which || e.keyCode) == 112) {
                    window.order = false;
                    var event = new Event('keypress');
                    event.which = 122;
                    event.altKey = false;
                    event.ctrlKey = false;
                    event.shiftKey = false;
                    event.metaKey = false;
                    document.dispatchEvent(event);
                    callback(true);
                    e.preventDefault();
                } else callback(false);
            });
        },
        message: function message(msg) {
            $("#notificationbar #value").html(msg);
            $("#notificationbar").removeClass("show");
            setTimeout(function () {
                $("#notificationbar").toggleClass("show");
            }, 500);
        },
        getYear: function getYear() {
            return (0, _moment2.default)().format("YYYY");
        },
        getDay: function getDay() {
            return (0, _moment2.default)().format("DD");
        },
        getMonth: function getMonth() {
            return (0, _moment2.default)().format("MM");
        },
        getDate: function getDate() {
            return (0, _moment2.default)().format("YYYY-MM-DD").toString();
        },
        getDateByYearMonth: function getDateByYearMonth(value) {
            return (0, _moment2.default)(value).format("YYYY-MM").toString();
        },
        getMonthByName: function getMonthByName(value) {
            return (0, _moment2.default)(value).format("MMMM");
        },
        getTime: function getTime() {
            return (0, _moment2.default)().format("LT").toString();
        },
        getFormalDate: function getFormalDate(value) {
            return (0, _moment2.default)(value).format('LL');
        },
        getFirstDay: function getFirstDay(value) {
            return (0, _moment2.default)(value).weekday();
        },
        getFirstDate: function getFirstDate(value) {
            return (0, _moment2.default)(value).startOf('month').format("YYYY-MM-DD").toString();
        },
        getLastDate: function getLastDate(value) {
            return (0, _moment2.default)(value).endOf('month').format('DD');
        },
        lpad: function lpad(value, num, optional) {
            var temp = "";
            value = value + "";
            for (var i = num; i > 0; i--) {
                if (i <= value.length) {
                    temp += value[value.length - i];
                } else {
                    temp += optional || " ";
                }
            }
            return temp;
        },
        rpad: function rpad(value, num, optional) {
            var temp = "";
            for (var i = 0; i < num; i++) {
                if (i < value.length) {
                    temp += value[i];
                } else {
                    temp += optional || " ";
                }
            }
            return temp;
        },
        phpFormat: function phpFormat(value) {
            var number = (value || "") + "",
                dollars = number.split('.')[0],
                cents = (number.split('.')[1] || '') + '00';
            dollars = dollars.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('');
            if (number.length > 0) return '₱' + dollars + '.' + cents.slice(0, 2);
            return "";
        },
        loadBadge: function loadBadge(i) {
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
            }, 2000);
            var badgeNum;
            function updateBadge(alertNum) {
                var badgeChild = badge.children[0];
                if (badgeChild.className === 'badge-num') badge.removeChild(badge.children[0]);

                badgeNum = document.createElement('div');
                badgeNum.setAttribute('class', 'badge-num');
                badgeNum.innerText = alertNum;
                var insertedElement = badge.insertBefore(badgeNum, badge.firstChild);
            }
        }
    };
});
define('reports/index',['exports', 'aurelia-framework', 'aurelia-router', '../api/session', '../api/reports/helper'], function (exports, _aureliaFramework, _aureliaRouter, _session, _helper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Reports = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Reports = exports.Reports = (_dec = (0, _aureliaFramework.inject)(_helper.ReportsHelper, _aureliaRouter.Router), _dec(_class = function () {
        function Reports(ReportsHelper, Router) {
            _classCallCheck(this, Reports);

            this.id = "";
            this.user = {};
            this.reports = {
                products: []
            };

            this.user = _session.Session.user;
            this.reportsHelper = ReportsHelper;
            this.router = Router;

            this.startdate = _session.Session.getDate();
            this.enddate = _session.Session.getDate();
        }

        Reports.prototype.activate = function activate() {};

        Reports.prototype.viewReport = function viewReport() {

            var ch = this.selectedreports;
            var startdate = this.startdate || "";
            var enddate = this.enddate || "";
            this.reports.title = '';
            if (startdate.length > 0 || enddate.length > 0) {
                switch (ch) {
                    case "1":
                        _session.Session.setGlobal([startdate, enddate, ch]);
                        this.router.navigate("/chedings/dashboard/reports-sales");
                        break;
                    case "2":
                        _session.Session.setGlobal([startdate, enddate, ch]);
                        this.router.navigate("/chedings/dashboard/reports-sales");
                        break;
                    case "3":
                        _session.Session.setGlobal([startdate, enddate, ch]);
                        this.router.navigate("/chedings/dashboard/reports-sales");
                        break;
                    default:
                        _session.Session.message("Select a category!");
                        break;
                }
            } else _session.Session.message("Invalid Date.");
        };

        Reports.prototype.print = function print() {
            var ch = this.selectedreports;
            var startdate = this.startdate || "";
            var enddate = this.enddate || "";
            this.reports.title = '';
            if (startdate.length > 0 || enddate.length > 0) {
                switch (ch) {
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
                    default:
                        _session.Session.message("Select a category!");
                        break;
                }
            } else _session.Session.message("Invalid Date.");
        };

        Reports.prototype.deletedReports = function deletedReports(ch) {
            var _arr = ["'" + this.startdate + "'", "'" + this.enddate + "'", ch];
            var self = this;
            this.reportsHelper.deleted(_arr, function (result) {
                var temp = JSON.parse(result || "");
                self.reports.products = temp;
                _session.Session.message("Loading print report.");
                self.printPage();
            });
        };

        Reports.prototype.salesReports = function salesReports(ch) {
            var _arr = ["'" + this.startdate + "'", "'" + this.enddate + "'"];
            var self = this;
            this.reportsHelper.sales(_arr, function (result) {
                var temp = JSON.parse(result || "");
                self.reports.products = temp;
                _session.Session.message("Loading print report.");
                self.printPage();
            });
        };

        Reports.prototype.printPage = function printPage() {
            $("#reportprint").contents().find("body").html("");
            setTimeout(function () {
                $("#reportprint").contents().find("body").append($("#reportprintpage").html());
                setTimeout(function () {
                    window.frames["reportprint"].focus();
                    window.frames["reportprint"].print();
                }, 1000);
            }, 500);
        };

        return Reports;
    }()) || _class);
});
define('reports/print',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Print = exports.Print = function Print() {
        _classCallCheck(this, Print);
    };
});
define('reports/view',['exports', 'aurelia-framework', 'aurelia-router', '../api/reports/helper', '../api/session'], function (exports, _aureliaFramework, _aureliaRouter, _helper, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.ReportsHelper, _aureliaRouter.Router), _dec(_class = function () {
        function View(ReportsHelper, Router) {
            _classCallCheck(this, View);

            this.table = {
                calendar: [],
                data: {},
                dates: [],
                month: [],
                grandtotal: []
            };
            this.reports = {};
            this.selectedreports = "";

            this.reportsHelper = ReportsHelper;
            this.router = Router;

            var data = _session.Session.getGlobal();
            this.selectedreports = data[2];
            if (this.selectedreports == 3) {
                this.viewSalesReport(data);
            } else {
                this.deletedReports(data);
            }
        }

        View.prototype.activate = function activate() {};

        View.prototype.back = function back() {
            this.router.navigateBack();
        };

        View.prototype.viewSalesReport = function viewSalesReport(data) {
            var self = this;
            var arr = ["'" + data[0] + "'", "'" + data[1] + "'"];
            this.reportsHelper.sales(arr, function (result) {
                self.table.data = JSON.parse(result || "[]");
                self.setMonths();
                self.setCalendar();
            });
        };

        View.prototype.deletedReports = function deletedReports(data) {
            var self = this;
            var arr = ["'" + data[0] + "'", "'" + data[1] + "'", "'" + data[2] + "'"];
            this.reportsHelper.deleted(arr, function (result) {
                var temp = JSON.parse(result || "");
                self.reports.products = temp;
                console.log("Deleted Reports: ", temp);
            });
        };

        View.prototype.setCalendar = function setCalendar() {
            var data = this.table.dates;
            for (var i in data) {
                var date = data[i];
                this.table.calendar.push(this.createCalendar(_session.Session.getFirstDay(_session.Session.getFirstDate(date)), _session.Session.getLastDate(date), i));
            }
        };

        View.prototype.setMonths = function setMonths() {
            var _this = this;

            var self = this;
            var data = this.table.data;

            var _loop = function _loop() {
                var date = data[i].saledate;
                var init = function init() {
                    return self.table.dates.indexOf(_session.Session.getFirstDate(date));
                };
                var checkDate = init();
                if (checkDate < 0) {
                    _this.table.dates.push(_session.Session.getFirstDate(date));
                    _this.table.month.push(_session.Session.getMonthByName(date));
                    checkDate = init();
                }
                _this.table.data[i].indexOfDates = checkDate;
            };

            for (var i in data) {
                _loop();
            }
        };

        View.prototype.createCalendar = function createCalendar(day, max, signature) {
            var tr = [],
                td = [],
                min = 1,
                week = 7,
                sum = 0,
                grandtotal = 0,
                cont = 0;
            var data = this.table.data.filter(function (data) {
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
                    if (data[cont].indexOfDates == signature && data[cont].saledate == _session.Session.getDateByYearMonth(data[cont].saledate) + "-" + _session.Session.lpad(i, 2, "0")) {
                        sum += Number(data[cont].sales);
                        content += " | " + _session.Session.phpFormat(data[cont].sales);
                        cont++;
                    }
                }

                td.push(content);
                if (min == week) {
                    grandtotal += sum;
                    td.push(_session.Session.phpFormat(sum));
                    tr.push(td);
                    td = [];
                    min = 1;
                    sum = 0;
                } else if (i == max) {
                    for (var j = td.length; j < 7; j++) {
                        td.push("");
                    }
                    grandtotal += sum;
                    td.push(_session.Session.phpFormat(sum));
                    tr.push(td);
                    sum = 0;
                } else {
                    min++;
                }
            }
            this.table.grandtotal.push(_session.Session.phpFormat(grandtotal));
            return tr;
        };

        return View;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('restock/add',["exports", "aurelia-framework", "../api/product/helper", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _helper2, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Add = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Add = exports.Add = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper, _helper2.SupplierHelper), _dec(_class = function () {
        function Add(ProductHelper, SupplierHelper) {
            _classCallCheck(this, Add);

            this.product = {};
            this.selectProduct = [];
            this.selectedProduct = "";
            this.selectSupplier = [];
            this.selectedSupplier = "";

            this.productHelper = ProductHelper;
            this.supplierHelper = SupplierHelper;
            var self = this;

            this.product.id = window.chedings.id;
            this.productHelper.getInfo(this.product.id, function (result) {
                var _product = JSON.parse(result || "");
                if (_product.length > 0) {
                    self.product = _product[0];
                }
            });

            this.supplierHelper.getList(function (result) {
                var arr = JSON.parse(result || "");
                self.selectSupplier = arr;
            });
        }

        Add.prototype.activate = function activate() {};

        Add.prototype.register = function register() {
            var _arr = ["'" + this.product.description + "'", "'" + this.product.cost + "'", "'" + this.product.quantity + "'", "'" + this.product.company + "'", "'" + this.product.expire_date + "'", "'" + this.product.pic + "'", "'" + this.product.id + "'"];
            var self = this;
            this.productHelper.restock(_arr, function (result) {
                var msg = JSON.parse(result || "");
                self.clear();
                _session.Session.message(msg[0].output);
                $("#loadStack").click();
            });
        };

        Add.prototype.clear = function clear() {
            this.product = {};
        };

        Add.prototype.upload = function upload() {
            var self = this;
            var input = $("#productImage")[0];
            this.productHelper.uploadProfile(input, "#imgProductPreview", function (result) {
                self.product.pic = result || "";
            });
        };

        return Add;
    }()) || _class);
});
define('restock/dashboard',["exports", "../api/session"], function (exports, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Dashboard = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Dashboard = exports.Dashboard = function () {
        function Dashboard() {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];
            this.user = {};

            this.dashboard = this.config();

            this.user = _session.Session.user;
        }

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.openUserInfo = function openUserInfo() {
            this.contentheader = this.user.name || "";
            this.contenturl = "./profile";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.logout = function logout() {
            Sessiong.logout();
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Products",
                module: ""
            }];
        };

        return Dashboard;
    }();
});
define('restock/edit',["exports", "aurelia-framework", "../api/product/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Edit = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Edit = exports.Edit = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper), _dec(_class = function () {
        function Edit(ProductHelper) {
            _classCallCheck(this, Edit);

            this.product = {};

            this.productHelper = ProductHelper;

            var self = this;

            this.product.id = window.chedings.id;
            this.productHelper.getInfo(this.product.id, function (result) {
                var _product = JSON.parse(result || "");
                if (_product.length > 0) {
                    self.product = _product[0];
                }
            });
        }

        Edit.prototype.save = function save() {
            var _arr = ["'" + this.product.id + "'", "'" + this.product.description + "'", "'" + this.product.cost + "'", "'" + this.product.discount + "'", "'" + this.product.quantity + "'", "'" + this.product.supplier_id + "'", "'" + this.product.expire_date + "'", "'" + this.product.pic + "'"];
            var self = this;
            this.productHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                console.log(msg);
                _session.Session.message(msg[0].output);
                $("#loadStack").click();
            });
        };

        Edit.prototype.clear = function clear() {
            this.product = {};
        };

        return Edit;
    }()) || _class);
});
define('restock/index',["exports", "../api/session"], function (exports, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Product = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Product = exports.Product = function () {
        function Product() {
            _classCallCheck(this, Product);

            this.id = "";
            this.user = {};
            this.usertypeRights = true;

            this._url = this.route()[0]["module"];
            this.user = _session.Session.user;
            if (self.user.type == 3) this.usertypeRights = false;
        }

        Product.prototype.activate = function activate() {
            this._url = this.route()[0]["module"];
        };

        Product.prototype.addProduct = function addProduct(_id) {
            window.chedings.id = _id;
            this._url = this.route()[1]["module"];
        };

        Product.prototype.editProduct = function editProduct(_id) {
            window.chedings.id = _id;
            this._url = this.route()[2]["module"];
        };

        Product.prototype.route = function route() {
            return [{
                name: "View",
                module: "./view"
            }, {
                name: "Add",
                module: "./add"
            }, {
                name: "Edit",
                module: "./edit"
            }];
        };

        Product.prototype.openCity = function openCity(evt, cityName) {
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
        };

        return Product;
    }();
});
define('restock/profile',["exports", "aurelia-framework", "../api/user/helper", "../api/user/user-type", "../api/session"], function (exports, _aureliaFramework, _helper, _userType, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Profile = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_helper.UserHelper, _userType.UserType), _dec(_class = function () {
        function Profile(UserHelper, UserType) {
            _classCallCheck(this, Profile);

            this.userHelper = UserHelper;
            this.userType = UserType;
        }

        Profile.prototype.activate = function activate() {
            var self = this;
            this.user = _session.Session.user;
            this.userType.getData(function (result) {
                self.selectType = JSON.parse(result || "");
            });
        };

        Profile.prototype.save = function save() {
            var _arr = ["'" + this.user.id + "'", "'" + this.user.firstname + "'", "'" + this.user.middlename + "'", "'" + this.user.lastname + "'", "'" + this.user.username + "'", "'" + this.user.type + "'", "'" + (this.user.pic || "") + "'"];
            this.user.name = [this.user.firstname, this.user.lastname].join(" ");
            var self = this;
            this.userHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                _session.Session.user = self.user;
                _session.Session.message(msg[0].output);
                $("#loadStack").click();
            });
        };

        Profile.prototype.upload = function upload() {
            var self = this;
            var input = $("#FileUploadImage")[0];
            this.userHelper.uploadProfile(input, "#imgPreview", function (result) {
                self.user.pic = result || "";
            });
        };

        return Profile;
    }()) || _class);
});
define('restock/view',["exports", "aurelia-framework", "../api/product/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.ProductHelper), _dec(_class = function () {
        function View(ProductHelper) {
            _classCallCheck(this, View);

            this.product = [];
            this.user = {};
            this.usertypeRights = true;

            this.productHelper = ProductHelper;
        }

        View.prototype.activate = function activate() {
            var self = this;
            self.user = _session.Session.user;
            if (self.user.type == 3) self.usertypeRights = false;
            self.productHelper.getStocks(function (result) {
                self.product = JSON.parse(result || '[]');
                console.log(self.product);
            });
        };

        View.prototype.removeProduct = function removeProduct(_id) {
            var self = this;
            var id = _id;
            if (confirm("Do you want to remove the product?")) {
                this.productHelper.deleteProduct(id, function (result) {
                    var msg = JSON.parse(result || "");
                    _session.Session.message(msg[0].output);
                    self.activate();
                    $("#loadStack").click();
                });
            }
        };

        View.prototype.validateItem = function validateItem(item) {
            var percentage = parseFloat(item.percentage);
            var limitPercentage = parseFloat("10.00%");

            if ((percentage <= limitPercentage || item.no_of_days <= 30) && ((item.discount + "").length == 0 || item.no_of_days <= 0) && (item.ref_id == '' || item.ref_id == null)) {
                console.log("View1: ", item);
                return true;
            } else if (item.no_of_days <= 2 && item.discount > 0) {
                    console.log("View2: ", item);
                    return true;
                }
            return false;
        };

        View.prototype.discounted = function discounted(item) {
            if (item.no_of_days <= 30 && item.no_of_days > 0 && (item.discount + "").length == 0) {
                return true;
            }
            return false;
        };

        View.prototype.restock = function restock(item) {
            var percentage = parseFloat(item.percentage);
            var limitPercentage = parseFloat("10.00%");
            if (percentage <= limitPercentage) {
                return true;
            }
            return false;
        };

        View.prototype.expired = function expired(item) {
            if (item.no_of_days <= 0) {
                return true;
            }
            return false;
        };

        View.prototype.toBeDeleted = function toBeDeleted(item) {
            if (item.no_of_days <= 2 && item.discount > 0) {
                return true;
            }
            return false;
        };

        return View;
    }()) || _class);
});
define('ui-helper/date-format',["exports", "../api/session"], function (exports, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DateFormatValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
        function DateFormatValueConverter() {
            _classCallCheck(this, DateFormatValueConverter);
        }

        DateFormatValueConverter.prototype.toView = function toView(value) {

            return _session.Session.getFormalDate(value || "");
        };

        return DateFormatValueConverter;
    }();
});
define('ui-helper/php-format',['exports', '../api/session'], function (exports, _session) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PhpFormatValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var PhpFormatValueConverter = exports.PhpFormatValueConverter = function () {
        function PhpFormatValueConverter() {
            _classCallCheck(this, PhpFormatValueConverter);
        }

        PhpFormatValueConverter.prototype.toView = function toView(value) {
            return _session.Session.phpFormat(value);
        };

        return PhpFormatValueConverter;
    }();
});
define('supplier/add-product',["exports", "aurelia-framework", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AddProduct = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var AddProduct = exports.AddProduct = (_dec = (0, _aureliaFramework.inject)(_helper.SupplierHelper), _dec(_class = function () {
        function AddProduct(SupplierHelper) {
            _classCallCheck(this, AddProduct);

            this.product = {};
            this.selectType = [];

            this.supplierHelper = SupplierHelper;
            var self = this;
            this.supplierHelper.getList(function (result) {
                var arr = JSON.parse(result || "");
                self.selectType = arr;
                console.log(self.selectType);
            });
        }

        AddProduct.prototype.activate = function activate() {};

        AddProduct.prototype.register_product = function register_product() {
            var _arr = ["'" + this.product.description + "'", "'" + this.product.pic + "'", "'" + this.product.supplier_id + "'"];
            var self = this;
            this.supplierHelper.registerProduct(_arr, function (result) {
                var msg = JSON.parse(result || "");
                self.clear();
                _session.Session.message(msg[0].output);
            });
        };

        AddProduct.prototype.clear = function clear() {
            this.product = {};
        };

        AddProduct.prototype.upload = function upload() {
            var self = this;
            var input = $("#productImage")[0];
            this.supplierHelper.uploadProfile(input, "#imgProductPreview", function (result) {
                self.product.pic = result || "";
            });
        };

        return AddProduct;
    }()) || _class);
});
define('supplier/add',["exports", "aurelia-framework", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Add = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Add = exports.Add = (_dec = (0, _aureliaFramework.inject)(_helper.SupplierHelper), _dec(_class = function () {
        function Add(SupplierHelper) {
            _classCallCheck(this, Add);

            this.supplier = {};

            this.supplierHelper = SupplierHelper;
        }

        Add.prototype.activate = function activate() {};

        Add.prototype.register = function register() {
            var _arr = ["'" + this.supplier.company + "'", "'" + this.supplier.contact_name + "'", "'" + this.supplier.address + "'", "'" + this.supplier.phone + "'"];
            var self = this;
            this.supplierHelper.create(_arr, function (result) {
                var msg = JSON.parse(result || "");
                self.clear();
                _session.Session.message(msg[0].output);
            });
        };

        Add.prototype.clear = function clear() {
            this.supplier = {};
        };

        return Add;
    }()) || _class);
});
define('supplier/edit',["exports", "aurelia-framework", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.SupplierHelper), _dec(_class = function () {
        function View(SupplierHelper) {
            _classCallCheck(this, View);

            this.supplier = {};

            this.supplierHelper = SupplierHelper;

            var self = this;
            this.supplier.id = window.chedings.supplier_id;
            this.supplierHelper.getInfo(this.supplier.id, function (result) {
                var _supplier = JSON.parse(result || "");
                if (_supplier.length > 0) {
                    self.supplier = _supplier[0];
                }
            });
        }

        View.prototype.save = function save() {
            var _arr = ["'" + this.supplier.id + "'", "'" + this.supplier.company + "'", "'" + this.supplier.contact_name + "'", "'" + this.supplier.address + "'", "'" + this.supplier.phone + "'"];
            var self = this;
            this.supplierHelper.update(_arr, function (result) {
                var msg = JSON.parse(result || "");
                console.log(msg);
                _session.Session.message(msg[0].output);
            });
        };

        View.prototype.clear = function clear() {
            this.supplier = {};
        };

        return View;
    }()) || _class);
});
define('supplier/index',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Supplier = exports.Supplier = function () {
        function Supplier() {
            _classCallCheck(this, Supplier);

            this.id = "";

            this._url = this.route()[0]["module"];
        }

        Supplier.prototype.activate = function activate() {
            this._url = this.route()[0]["module"];
        };

        Supplier.prototype.addSupplier = function addSupplier() {
            this._url = this.route()[1]["module"];
        };

        Supplier.prototype.addProduct = function addProduct() {
            this._url = this.route()[3]["module"];
        };

        Supplier.prototype.editSupplier = function editSupplier(_id) {
            window.chedings.supplier_id = _id;
            this._url = this.route()[2]["module"];
        };

        Supplier.prototype.viewProduct = function viewProduct(_id) {
            window.chedings.supplier_id = _id;
            this._url = this.route()[4]["module"];
        };

        Supplier.prototype.route = function route() {
            return [{
                name: "View",
                module: "./view"
            }, {
                name: "Add",
                module: "./add"
            }, {
                name: "Edit",
                module: "./edit"
            }, {
                name: "Add Product",
                module: "./add-product"
            }, {
                name: "View Product",
                module: "./view-product"
            }];
        };

        Supplier.prototype.openCity = function openCity(evt, cityName) {
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
        };

        return Supplier;
    }();
});
define('supplier/view-product',["exports", "aurelia-framework", "../api/supplier/helper", "../api/product/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _helper2, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ViewProduct = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ViewProduct = exports.ViewProduct = (_dec = (0, _aureliaFramework.inject)(_helper.SupplierHelper, _helper2.ProductHelper), _dec(_class = function () {
        function ViewProduct(SupplierHelper, ProductHelper) {
            _classCallCheck(this, ViewProduct);

            this.product = {};
            this.productArr = [];
            this.edit_product = false;

            this.supplierHelper = SupplierHelper;
            this.productHelper = ProductHelper;
        }

        ViewProduct.prototype.activate = function activate() {
            var id = window.chedings.supplier_id;
            var self = this;
            this.supplierHelper.viewProduct(id, function (result) {
                var arr = JSON.parse(result || "");
                self.productArr = arr;
            });
        };

        ViewProduct.prototype.editProduct = function editProduct(i) {
            $(".show" + i).css("display", "block");
            $(".hide" + i).css("display", "none");
        };

        ViewProduct.prototype.revert = function revert(i) {
            $(".show" + i).css("display", "none");
            $(".hide" + i).css("display", "block");
        };

        ViewProduct.prototype.deleteProduct = function deleteProduct(item) {
            var id = item.id || 0;
            console.log("Deleted: ", item);
            this.supplierHelper.deleteProduct(id, function (result) {
                var msg = JSON.parse(result || "");
                this.activate();
                _session.Session.message(msg[0].output);
            }.bind(this));
        };

        ViewProduct.prototype.updateProduct = function updateProduct(id) {
            var self = this;
            var arr = this.productArr;
            for (var i = 0; i < arr.length; i++) {
                if (id == arr[i].id) {
                    self.revert(i);
                    console.log("Info: ", arr[i]);
                    var _arr = ["'" + arr[i].description + "'", "'" + arr[i].pic + "'", "'" + id + "'"];
                    self.supplierHelper.updateProduct(_arr, function (result) {
                        var msg = JSON.parse(result || "");
                        console.log(msg[0].output);
                    });
                }
            }
            _session.Session.message("Update Successfully");
        };

        ViewProduct.prototype.clear = function clear() {
            this.product = {};
        };

        ViewProduct.prototype.upload = function upload(i) {
            var self = this;
            var input = $("#productImage" + i)[0];
            this.supplierHelper.uploadProfile(input, "#imgProductPreview" + i, function (result) {
                self.productArr[i].pic = result || "";
            });
        };

        return ViewProduct;
    }()) || _class);
});
define('supplier/view',["exports", "aurelia-framework", "../api/supplier/helper", "../api/session"], function (exports, _aureliaFramework, _helper, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.View = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var View = exports.View = (_dec = (0, _aureliaFramework.inject)(_helper.SupplierHelper), _dec(_class = function () {
        function View(SupplierHelper) {
            _classCallCheck(this, View);

            this.supplier = [];

            this.supplierHelper = SupplierHelper;
        }

        View.prototype.activate = function activate() {
            console.log("View activated");
            var self = this;
            this.supplierHelper.getList(function (result) {
                self.supplier = JSON.parse(result || "");
            });
        };

        View.prototype.deleteSupplier = function deleteSupplier(_id) {
            var self = this;
            this.supplierHelper.delete(_id, function (result) {
                var msg = JSON.parse(result || "");
                self.activate();
                _session.Session.message(msg[0].output);
            });
        };

        return View;
    }()) || _class);
});
define('api/product/helper',["exports", "aurelia-framework", "../index", "../session"], function (exports, _aureliaFramework, _index, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ProductHelper = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ProductHelper = exports.ProductHelper = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function ProductHelper(Api) {
            _classCallCheck(this, ProductHelper);

            this.api = Api;
        }

        ProductHelper.prototype.create = function create(item, callback) {
            var stmt = "call product_add(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.update = function update(user, callback) {
            var stmt = "call product_update(" + user.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.restock = function restock(item, callback) {
            var stmt = "call product_restock(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.getList = function getList(callback) {
            var stmt = "call product_list();";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.getStocks = function getStocks(callback) {
            var stmt = "call stocks();";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.getInfo = function getInfo(id, callback) {
            var stmt = "call product_info('" + (id || "") + "');";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.deleteProduct = function deleteProduct(id, callback) {
            var arr = [id, JSON.stringify(_session.Session.getDate())].join(",");
            var stmt = "call product_delete(" + arr + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ProductHelper.prototype.uploadProfile = function uploadProfile(input, id, callback) {
            var self = this;
            this.api.uploadPicture(input, id, function (result) {
                callback(result);
            });
        };

        return ProductHelper;
    }()) || _class);
});
define('api/order/helper',["exports", "aurelia-framework", "../index"], function (exports, _aureliaFramework, _index) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OrderHelper = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var OrderHelper = exports.OrderHelper = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function OrderHelper(Api) {
            _classCallCheck(this, OrderHelper);

            this.api = Api;
        }

        OrderHelper.prototype.create = function create(item, callback) {
            var stmt = "call order_create(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        OrderHelper.prototype.createTransaction = function createTransaction(item, callback) {
            var stmt = "call order_createtransaction(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        OrderHelper.prototype.getReceipt = function getReceipt(id, callback) {
            var stmt = "call order_receipt(" + id + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        return OrderHelper;
    }()) || _class);
});
define('api/reports/helper',["exports", "aurelia-framework", "../index", "../session"], function (exports, _aureliaFramework, _index, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ReportsHelper = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ReportsHelper = exports.ReportsHelper = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function ReportsHelper(Api) {
            _classCallCheck(this, ReportsHelper);

            this.api = Api;
        }

        ReportsHelper.prototype.deleted = function deleted(arr, callback) {
            var stmt = "call reports_for_deleted(" + arr.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        ReportsHelper.prototype.sales = function sales(arr, callback) {
            var stmt = "call report_sales(" + arr.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        return ReportsHelper;
    }()) || _class);
});
define('api/supplier/helper',["exports", "aurelia-framework", "../index", "../session"], function (exports, _aureliaFramework, _index, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SupplierHelper = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SupplierHelper = exports.SupplierHelper = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function SupplierHelper(Api) {
            _classCallCheck(this, SupplierHelper);

            this.api = Api;
        }

        SupplierHelper.prototype.create = function create(item, callback) {
            var stmt = "call supplier_add(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.update = function update(arr, callback) {
            var stmt = "call supplier_update(" + arr.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.delete = function _delete(id, callback) {
            var arr = [id, JSON.stringify(_session.Session.getDate())].join(",");
            var stmt = "call supplier_delete(" + arr + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.getList = function getList(callback) {
            var stmt = "call supplier_list();";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.getInfo = function getInfo(id, callback) {
            var stmt = "call supplier_info('" + (id || "") + "');";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.registerProduct = function registerProduct(item, callback) {
            var stmt = "call supplier_add_product(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.updateProduct = function updateProduct(item, callback) {
            var stmt = "call supplier_update_product(" + item.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.viewProduct = function viewProduct(id, callback) {
            var stmt = "call supplier_view_product('" + (id || "") + "');";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.deleteProduct = function deleteProduct(id, callback) {
            var arr = [id, JSON.stringify(_session.Session.getDate())].join(",");
            var stmt = "call supplier_product_delete(" + arr + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        SupplierHelper.prototype.uploadProfile = function uploadProfile(input, id, callback) {
            var self = this;
            this.api.uploadPicture(input, id, function (result) {
                callback(result);
            });
        };

        return SupplierHelper;
    }()) || _class);
});
define('api/user/helper',["exports", "aurelia-framework", "../index", "../session"], function (exports, _aureliaFramework, _index, _session) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserHelper = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserHelper = exports.UserHelper = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function UserHelper(Api) {
            _classCallCheck(this, UserHelper);

            this.api = Api;
        }

        UserHelper.prototype.create = function create(user, callback) {
            var stmt = "call create_user(" + user.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        UserHelper.prototype.update = function update(user, callback) {
            var stmt = "call user_update(" + user.join(",") + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        UserHelper.prototype.getList = function getList(callback) {
            var stmt = "call user_list();";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        UserHelper.prototype.getInfo = function getInfo(id, callback) {
            var stmt = "call user_info('" + (id || "") + "');";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        UserHelper.prototype.deleteInfo = function deleteInfo(id, callback) {
            var arr = [id, JSON.stringify(_session.Session.getDate())].join(",");
            var stmt = "call user_delete(" + arr + ");";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        UserHelper.prototype.uploadProfile = function uploadProfile(input, id, callback) {
            var self = this;
            this.api.uploadPicture(input, id, function (result) {
                callback(result);
            });
        };

        return UserHelper;
    }()) || _class);
});
define('api/user/user-type',["exports", "aurelia-framework", "../index"], function (exports, _aureliaFramework, _index) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserType = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserType = exports.UserType = (_dec = (0, _aureliaFramework.inject)(_index.Api), _dec(_class = function () {
        function UserType(Api) {
            _classCallCheck(this, UserType);

            this.api = Api;
        }

        UserType.prototype.getData = function getData(callback) {
            var stmt = "call usertype();";
            this.api.post(stmt).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.log(err);
            });
        };

        return UserType;
    }()) || _class);
});
define('resources/js/index',[], function () {
  "use strict";

  $(document).ready(function () {
    $("body").on("click", "#close", function () {
      $("#notificationbar").toggleClass("show");
    });
  });
});
define([], function () {
	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	(function (factory) {
		if (typeof define === "function" && define.amd) {
			define(["jquery"], factory);
		} else {
			factory(jQuery);
		}
	})(function ($) {

		$.ui = $.ui || {};

		var version = $.ui.version = "1.12.1";

		var widgetUuid = 0;
		var widgetSlice = Array.prototype.slice;

		$.cleanData = function (orig) {
			return function (elems) {
				var events, elem, i;
				for (i = 0; (elem = elems[i]) != null; i++) {
					try {
						events = $._data(elem, "events");
						if (events && events.remove) {
							$(elem).triggerHandler("remove");
						}
					} catch (e) {}
				}
				orig(elems);
			};
		}($.cleanData);

		$.widget = function (name, base, prototype) {
			var existingConstructor, constructor, basePrototype;

			var proxiedPrototype = {};

			var namespace = name.split(".")[0];
			name = name.split(".")[1];
			var fullName = namespace + "-" + name;

			if (!prototype) {
				prototype = base;
				base = $.Widget;
			}

			if ($.isArray(prototype)) {
				prototype = $.extend.apply(null, [{}].concat(prototype));
			}

			$.expr[":"][fullName.toLowerCase()] = function (elem) {
				return !!$.data(elem, fullName);
			};

			$[namespace] = $[namespace] || {};
			existingConstructor = $[namespace][name];
			constructor = $[namespace][name] = function (options, element) {
				if (!this._createWidget) {
					return new constructor(options, element);
				}

				if (arguments.length) {
					this._createWidget(options, element);
				}
			};

			$.extend(constructor, existingConstructor, {
				version: prototype.version,

				_proto: $.extend({}, prototype),

				_childConstructors: []
			});

			basePrototype = new base();

			basePrototype.options = $.widget.extend({}, basePrototype.options);
			$.each(prototype, function (prop, value) {
				if (!$.isFunction(value)) {
					proxiedPrototype[prop] = value;
					return;
				}
				proxiedPrototype[prop] = function () {
					function _super() {
						return base.prototype[prop].apply(this, arguments);
					}

					function _superApply(args) {
						return base.prototype[prop].apply(this, args);
					}

					return function () {
						var __super = this._super;
						var __superApply = this._superApply;
						var returnValue;

						this._super = _super;
						this._superApply = _superApply;

						returnValue = value.apply(this, arguments);

						this._super = __super;
						this._superApply = __superApply;

						return returnValue;
					};
				}();
			});
			constructor.prototype = $.widget.extend(basePrototype, {
				widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
			}, proxiedPrototype, {
				constructor: constructor,
				namespace: namespace,
				widgetName: name,
				widgetFullName: fullName
			});

			if (existingConstructor) {
				$.each(existingConstructor._childConstructors, function (i, child) {
					var childPrototype = child.prototype;

					$.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
				});

				delete existingConstructor._childConstructors;
			} else {
				base._childConstructors.push(constructor);
			}

			$.widget.bridge(name, constructor);

			return constructor;
		};

		$.widget.extend = function (target) {
			var input = widgetSlice.call(arguments, 1);
			var inputIndex = 0;
			var inputLength = input.length;
			var key;
			var value;

			for (; inputIndex < inputLength; inputIndex++) {
				for (key in input[inputIndex]) {
					value = input[inputIndex][key];
					if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
						if ($.isPlainObject(value)) {
							target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value);
						} else {
							target[key] = value;
						}
					}
				}
			}
			return target;
		};

		$.widget.bridge = function (name, object) {
			var fullName = object.prototype.widgetFullName || name;
			$.fn[name] = function (options) {
				var isMethodCall = typeof options === "string";
				var args = widgetSlice.call(arguments, 1);
				var returnValue = this;

				if (isMethodCall) {
					if (!this.length && options === "instance") {
						returnValue = undefined;
					} else {
						this.each(function () {
							var methodValue;
							var instance = $.data(this, fullName);

							if (options === "instance") {
								returnValue = instance;
								return false;
							}

							if (!instance) {
								return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
							}

							if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
								return $.error("no such method '" + options + "' for " + name + " widget instance");
							}

							methodValue = instance[options].apply(instance, args);

							if (methodValue !== instance && methodValue !== undefined) {
								returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
								return false;
							}
						});
					}
				} else {
					if (args.length) {
						options = $.widget.extend.apply(null, [options].concat(args));
					}

					this.each(function () {
						var instance = $.data(this, fullName);
						if (instance) {
							instance.option(options || {});
							if (instance._init) {
								instance._init();
							}
						} else {
							$.data(this, fullName, new object(options, this));
						}
					});
				}

				return returnValue;
			};
		};

		$.Widget = function () {};
		$.Widget._childConstructors = [];

		$.Widget.prototype = {
			widgetName: "widget",
			widgetEventPrefix: "",
			defaultElement: "<div>",

			options: {
				classes: {},
				disabled: false,

				create: null
			},

			_createWidget: function _createWidget(options, element) {
				element = $(element || this.defaultElement || this)[0];
				this.element = $(element);
				this.uuid = widgetUuid++;
				this.eventNamespace = "." + this.widgetName + this.uuid;

				this.bindings = $();
				this.hoverable = $();
				this.focusable = $();
				this.classesElementLookup = {};

				if (element !== this) {
					$.data(element, this.widgetFullName, this);
					this._on(true, this.element, {
						remove: function remove(event) {
							if (event.target === element) {
								this.destroy();
							}
						}
					});
					this.document = $(element.style ? element.ownerDocument : element.document || element);
					this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
				}

				this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);

				this._create();

				if (this.options.disabled) {
					this._setOptionDisabled(this.options.disabled);
				}

				this._trigger("create", null, this._getCreateEventData());
				this._init();
			},

			_getCreateOptions: function _getCreateOptions() {
				return {};
			},

			_getCreateEventData: $.noop,

			_create: $.noop,

			_init: $.noop,

			destroy: function destroy() {
				var that = this;

				this._destroy();
				$.each(this.classesElementLookup, function (key, value) {
					that._removeClass(value, key);
				});

				this.element.off(this.eventNamespace).removeData(this.widgetFullName);
				this.widget().off(this.eventNamespace).removeAttr("aria-disabled");

				this.bindings.off(this.eventNamespace);
			},

			_destroy: $.noop,

			widget: function widget() {
				return this.element;
			},

			option: function option(key, value) {
				var options = key;
				var parts;
				var curOption;
				var i;

				if (arguments.length === 0) {
					return $.widget.extend({}, this.options);
				}

				if (typeof key === "string") {
					options = {};
					parts = key.split(".");
					key = parts.shift();
					if (parts.length) {
						curOption = options[key] = $.widget.extend({}, this.options[key]);
						for (i = 0; i < parts.length - 1; i++) {
							curOption[parts[i]] = curOption[parts[i]] || {};
							curOption = curOption[parts[i]];
						}
						key = parts.pop();
						if (arguments.length === 1) {
							return curOption[key] === undefined ? null : curOption[key];
						}
						curOption[key] = value;
					} else {
						if (arguments.length === 1) {
							return this.options[key] === undefined ? null : this.options[key];
						}
						options[key] = value;
					}
				}

				this._setOptions(options);

				return this;
			},

			_setOptions: function _setOptions(options) {
				var key;

				for (key in options) {
					this._setOption(key, options[key]);
				}

				return this;
			},

			_setOption: function _setOption(key, value) {
				if (key === "classes") {
					this._setOptionClasses(value);
				}

				this.options[key] = value;

				if (key === "disabled") {
					this._setOptionDisabled(value);
				}

				return this;
			},

			_setOptionClasses: function _setOptionClasses(value) {
				var classKey, elements, currentElements;

				for (classKey in value) {
					currentElements = this.classesElementLookup[classKey];
					if (value[classKey] === this.options.classes[classKey] || !currentElements || !currentElements.length) {
						continue;
					}

					elements = $(currentElements.get());
					this._removeClass(currentElements, classKey);

					elements.addClass(this._classes({
						element: elements,
						keys: classKey,
						classes: value,
						add: true
					}));
				}
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!value);

				if (value) {
					this._removeClass(this.hoverable, null, "ui-state-hover");
					this._removeClass(this.focusable, null, "ui-state-focus");
				}
			},

			enable: function enable() {
				return this._setOptions({ disabled: false });
			},

			disable: function disable() {
				return this._setOptions({ disabled: true });
			},

			_classes: function _classes(options) {
				var full = [];
				var that = this;

				options = $.extend({
					element: this.element,
					classes: this.options.classes || {}
				}, options);

				function processClassString(classes, checkOption) {
					var current, i;
					for (i = 0; i < classes.length; i++) {
						current = that.classesElementLookup[classes[i]] || $();
						if (options.add) {
							current = $($.unique(current.get().concat(options.element.get())));
						} else {
							current = $(current.not(options.element).get());
						}
						that.classesElementLookup[classes[i]] = current;
						full.push(classes[i]);
						if (checkOption && options.classes[classes[i]]) {
							full.push(options.classes[classes[i]]);
						}
					}
				}

				this._on(options.element, {
					"remove": "_untrackClassesElement"
				});

				if (options.keys) {
					processClassString(options.keys.match(/\S+/g) || [], true);
				}
				if (options.extra) {
					processClassString(options.extra.match(/\S+/g) || []);
				}

				return full.join(" ");
			},

			_untrackClassesElement: function _untrackClassesElement(event) {
				var that = this;
				$.each(that.classesElementLookup, function (key, value) {
					if ($.inArray(event.target, value) !== -1) {
						that.classesElementLookup[key] = $(value.not(event.target).get());
					}
				});
			},

			_removeClass: function _removeClass(element, keys, extra) {
				return this._toggleClass(element, keys, extra, false);
			},

			_addClass: function _addClass(element, keys, extra) {
				return this._toggleClass(element, keys, extra, true);
			},

			_toggleClass: function _toggleClass(element, keys, extra, add) {
				add = typeof add === "boolean" ? add : extra;
				var shift = typeof element === "string" || element === null,
				    options = {
					extra: shift ? keys : extra,
					keys: shift ? element : keys,
					element: shift ? this.element : element,
					add: add
				};
				options.element.toggleClass(this._classes(options), add);
				return this;
			},

			_on: function _on(suppressDisabledCheck, element, handlers) {
				var delegateElement;
				var instance = this;

				if (typeof suppressDisabledCheck !== "boolean") {
					handlers = element;
					element = suppressDisabledCheck;
					suppressDisabledCheck = false;
				}

				if (!handlers) {
					handlers = element;
					element = this.element;
					delegateElement = this.widget();
				} else {
					element = delegateElement = $(element);
					this.bindings = this.bindings.add(element);
				}

				$.each(handlers, function (event, handler) {
					function handlerProxy() {
						if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
							return;
						}
						return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
					}

					if (typeof handler !== "string") {
						handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
					}

					var match = event.match(/^([\w:-]*)\s*(.*)$/);
					var eventName = match[1] + instance.eventNamespace;
					var selector = match[2];

					if (selector) {
						delegateElement.on(eventName, selector, handlerProxy);
					} else {
						element.on(eventName, handlerProxy);
					}
				});
			},

			_off: function _off(element, eventName) {
				eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
				element.off(eventName).off(eventName);

				this.bindings = $(this.bindings.not(element).get());
				this.focusable = $(this.focusable.not(element).get());
				this.hoverable = $(this.hoverable.not(element).get());
			},

			_delay: function _delay(handler, delay) {
				function handlerProxy() {
					return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
				}
				var instance = this;
				return setTimeout(handlerProxy, delay || 0);
			},

			_hoverable: function _hoverable(element) {
				this.hoverable = this.hoverable.add(element);
				this._on(element, {
					mouseenter: function mouseenter(event) {
						this._addClass($(event.currentTarget), null, "ui-state-hover");
					},
					mouseleave: function mouseleave(event) {
						this._removeClass($(event.currentTarget), null, "ui-state-hover");
					}
				});
			},

			_focusable: function _focusable(element) {
				this.focusable = this.focusable.add(element);
				this._on(element, {
					focusin: function focusin(event) {
						this._addClass($(event.currentTarget), null, "ui-state-focus");
					},
					focusout: function focusout(event) {
						this._removeClass($(event.currentTarget), null, "ui-state-focus");
					}
				});
			},

			_trigger: function _trigger(type, event, data) {
				var prop, orig;
				var callback = this.options[type];

				data = data || {};
				event = $.Event(event);
				event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();

				event.target = this.element[0];

				orig = event.originalEvent;
				if (orig) {
					for (prop in orig) {
						if (!(prop in event)) {
							event[prop] = orig[prop];
						}
					}
				}

				this.element.trigger(event, data);
				return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
			}
		};

		$.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
			$.Widget.prototype["_" + method] = function (element, options, callback) {
				if (typeof options === "string") {
					options = { effect: options };
				}

				var hasOptions;
				var effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;

				options = options || {};
				if (typeof options === "number") {
					options = { duration: options };
				}

				hasOptions = !$.isEmptyObject(options);
				options.complete = callback;

				if (options.delay) {
					element.delay(options.delay);
				}

				if (hasOptions && $.effects && $.effects.effect[effectName]) {
					element[method](options);
				} else if (effectName !== method && element[effectName]) {
					element[effectName](options.duration, options.easing, callback);
				} else {
					element.queue(function (next) {
						$(this)[method]();
						if (callback) {
							callback.call(element[0]);
						}
						next();
					});
				}
			};
		});

		var widget = $.widget;

		(function () {
			var cachedScrollbarWidth,
			    max = Math.max,
			    abs = Math.abs,
			    rhorizontal = /left|center|right/,
			    rvertical = /top|center|bottom/,
			    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
			    rposition = /^\w+/,
			    rpercent = /%$/,
			    _position = $.fn.position;

			function getOffsets(offsets, width, height) {
				return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
			}

			function parseCss(element, property) {
				return parseInt($.css(element, property), 10) || 0;
			}

			function getDimensions(elem) {
				var raw = elem[0];
				if (raw.nodeType === 9) {
					return {
						width: elem.width(),
						height: elem.height(),
						offset: { top: 0, left: 0 }
					};
				}
				if ($.isWindow(raw)) {
					return {
						width: elem.width(),
						height: elem.height(),
						offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
					};
				}
				if (raw.preventDefault) {
					return {
						width: 0,
						height: 0,
						offset: { top: raw.pageY, left: raw.pageX }
					};
				}
				return {
					width: elem.outerWidth(),
					height: elem.outerHeight(),
					offset: elem.offset()
				};
			}

			$.position = {
				scrollbarWidth: function scrollbarWidth() {
					if (cachedScrollbarWidth !== undefined) {
						return cachedScrollbarWidth;
					}
					var w1,
					    w2,
					    div = $("<div " + "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" + "<div style='height:100px;width:auto;'></div></div>"),
					    innerDiv = div.children()[0];

					$("body").append(div);
					w1 = innerDiv.offsetWidth;
					div.css("overflow", "scroll");

					w2 = innerDiv.offsetWidth;

					if (w1 === w2) {
						w2 = div[0].clientWidth;
					}

					div.remove();

					return cachedScrollbarWidth = w1 - w2;
				},
				getScrollInfo: function getScrollInfo(within) {
					var overflowX = within.isWindow || within.isDocument ? "" : within.element.css("overflow-x"),
					    overflowY = within.isWindow || within.isDocument ? "" : within.element.css("overflow-y"),
					    hasOverflowX = overflowX === "scroll" || overflowX === "auto" && within.width < within.element[0].scrollWidth,
					    hasOverflowY = overflowY === "scroll" || overflowY === "auto" && within.height < within.element[0].scrollHeight;
					return {
						width: hasOverflowY ? $.position.scrollbarWidth() : 0,
						height: hasOverflowX ? $.position.scrollbarWidth() : 0
					};
				},
				getWithinInfo: function getWithinInfo(element) {
					var withinElement = $(element || window),
					    isWindow = $.isWindow(withinElement[0]),
					    isDocument = !!withinElement[0] && withinElement[0].nodeType === 9,
					    hasOffset = !isWindow && !isDocument;
					return {
						element: withinElement,
						isWindow: isWindow,
						isDocument: isDocument,
						offset: hasOffset ? $(element).offset() : { left: 0, top: 0 },
						scrollLeft: withinElement.scrollLeft(),
						scrollTop: withinElement.scrollTop(),
						width: withinElement.outerWidth(),
						height: withinElement.outerHeight()
					};
				}
			};

			$.fn.position = function (options) {
				if (!options || !options.of) {
					return _position.apply(this, arguments);
				}

				options = $.extend({}, options);

				var atOffset,
				    targetWidth,
				    targetHeight,
				    targetOffset,
				    basePosition,
				    dimensions,
				    target = $(options.of),
				    within = $.position.getWithinInfo(options.within),
				    scrollInfo = $.position.getScrollInfo(within),
				    collision = (options.collision || "flip").split(" "),
				    offsets = {};

				dimensions = getDimensions(target);
				if (target[0].preventDefault) {
					options.at = "left top";
				}
				targetWidth = dimensions.width;
				targetHeight = dimensions.height;
				targetOffset = dimensions.offset;

				basePosition = $.extend({}, targetOffset);

				$.each(["my", "at"], function () {
					var pos = (options[this] || "").split(" "),
					    horizontalOffset,
					    verticalOffset;

					if (pos.length === 1) {
						pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"];
					}
					pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
					pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";

					horizontalOffset = roffset.exec(pos[0]);
					verticalOffset = roffset.exec(pos[1]);
					offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];

					options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]];
				});

				if (collision.length === 1) {
					collision[1] = collision[0];
				}

				if (options.at[0] === "right") {
					basePosition.left += targetWidth;
				} else if (options.at[0] === "center") {
					basePosition.left += targetWidth / 2;
				}

				if (options.at[1] === "bottom") {
					basePosition.top += targetHeight;
				} else if (options.at[1] === "center") {
					basePosition.top += targetHeight / 2;
				}

				atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
				basePosition.left += atOffset[0];
				basePosition.top += atOffset[1];

				return this.each(function () {
					var collisionPosition,
					    using,
					    elem = $(this),
					    elemWidth = elem.outerWidth(),
					    elemHeight = elem.outerHeight(),
					    marginLeft = parseCss(this, "marginLeft"),
					    marginTop = parseCss(this, "marginTop"),
					    collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
					    collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
					    position = $.extend({}, basePosition),
					    myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

					if (options.my[0] === "right") {
						position.left -= elemWidth;
					} else if (options.my[0] === "center") {
						position.left -= elemWidth / 2;
					}

					if (options.my[1] === "bottom") {
						position.top -= elemHeight;
					} else if (options.my[1] === "center") {
						position.top -= elemHeight / 2;
					}

					position.left += myOffset[0];
					position.top += myOffset[1];

					collisionPosition = {
						marginLeft: marginLeft,
						marginTop: marginTop
					};

					$.each(["left", "top"], function (i, dir) {
						if ($.ui.position[collision[i]]) {
							$.ui.position[collision[i]][dir](position, {
								targetWidth: targetWidth,
								targetHeight: targetHeight,
								elemWidth: elemWidth,
								elemHeight: elemHeight,
								collisionPosition: collisionPosition,
								collisionWidth: collisionWidth,
								collisionHeight: collisionHeight,
								offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
								my: options.my,
								at: options.at,
								within: within,
								elem: elem
							});
						}
					});

					if (options.using) {
						using = function using(props) {
							var left = targetOffset.left - position.left,
							    right = left + targetWidth - elemWidth,
							    top = targetOffset.top - position.top,
							    bottom = top + targetHeight - elemHeight,
							    feedback = {
								target: {
									element: target,
									left: targetOffset.left,
									top: targetOffset.top,
									width: targetWidth,
									height: targetHeight
								},
								element: {
									element: elem,
									left: position.left,
									top: position.top,
									width: elemWidth,
									height: elemHeight
								},
								horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
								vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
							};
							if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
								feedback.horizontal = "center";
							}
							if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
								feedback.vertical = "middle";
							}
							if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
								feedback.important = "horizontal";
							} else {
								feedback.important = "vertical";
							}
							options.using.call(this, props, feedback);
						};
					}

					elem.offset($.extend(position, { using: using }));
				});
			};

			$.ui.position = {
				fit: {
					left: function left(position, data) {
						var within = data.within,
						    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
						    outerWidth = within.width,
						    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
						    overLeft = withinOffset - collisionPosLeft,
						    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
						    newOverRight;

						if (data.collisionWidth > outerWidth) {
							if (overLeft > 0 && overRight <= 0) {
								newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
								position.left += overLeft - newOverRight;
							} else if (overRight > 0 && overLeft <= 0) {
								position.left = withinOffset;
							} else {
								if (overLeft > overRight) {
									position.left = withinOffset + outerWidth - data.collisionWidth;
								} else {
									position.left = withinOffset;
								}
							}
						} else if (overLeft > 0) {
							position.left += overLeft;
						} else if (overRight > 0) {
							position.left -= overRight;
						} else {
							position.left = max(position.left - collisionPosLeft, position.left);
						}
					},
					top: function top(position, data) {
						var within = data.within,
						    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
						    outerHeight = data.within.height,
						    collisionPosTop = position.top - data.collisionPosition.marginTop,
						    overTop = withinOffset - collisionPosTop,
						    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
						    newOverBottom;

						if (data.collisionHeight > outerHeight) {
							if (overTop > 0 && overBottom <= 0) {
								newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
								position.top += overTop - newOverBottom;
							} else if (overBottom > 0 && overTop <= 0) {
								position.top = withinOffset;
							} else {
								if (overTop > overBottom) {
									position.top = withinOffset + outerHeight - data.collisionHeight;
								} else {
									position.top = withinOffset;
								}
							}
						} else if (overTop > 0) {
							position.top += overTop;
						} else if (overBottom > 0) {
							position.top -= overBottom;
						} else {
							position.top = max(position.top - collisionPosTop, position.top);
						}
					}
				},
				flip: {
					left: function left(position, data) {
						var within = data.within,
						    withinOffset = within.offset.left + within.scrollLeft,
						    outerWidth = within.width,
						    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
						    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
						    overLeft = collisionPosLeft - offsetLeft,
						    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
						    myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
						    atOffset = data.at[0] === "left" ? data.targetWidth : data.at[0] === "right" ? -data.targetWidth : 0,
						    offset = -2 * data.offset[0],
						    newOverRight,
						    newOverLeft;

						if (overLeft < 0) {
							newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
							if (newOverRight < 0 || newOverRight < abs(overLeft)) {
								position.left += myOffset + atOffset + offset;
							}
						} else if (overRight > 0) {
							newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
							if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
								position.left += myOffset + atOffset + offset;
							}
						}
					},
					top: function top(position, data) {
						var within = data.within,
						    withinOffset = within.offset.top + within.scrollTop,
						    outerHeight = within.height,
						    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
						    collisionPosTop = position.top - data.collisionPosition.marginTop,
						    overTop = collisionPosTop - offsetTop,
						    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
						    top = data.my[1] === "top",
						    myOffset = top ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
						    atOffset = data.at[1] === "top" ? data.targetHeight : data.at[1] === "bottom" ? -data.targetHeight : 0,
						    offset = -2 * data.offset[1],
						    newOverTop,
						    newOverBottom;
						if (overTop < 0) {
							newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
							if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
								position.top += myOffset + atOffset + offset;
							}
						} else if (overBottom > 0) {
							newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
							if (newOverTop > 0 || abs(newOverTop) < overBottom) {
								position.top += myOffset + atOffset + offset;
							}
						}
					}
				},
				flipfit: {
					left: function left() {
						$.ui.position.flip.left.apply(this, arguments);
						$.ui.position.fit.left.apply(this, arguments);
					},
					top: function top() {
						$.ui.position.flip.top.apply(this, arguments);
						$.ui.position.fit.top.apply(this, arguments);
					}
				}
			};
		})();

		var position = $.ui.position;

		var data = $.extend($.expr[":"], {
			data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
				return function (elem) {
					return !!$.data(elem, dataName);
				};
			}) : function (elem, i, match) {
				return !!$.data(elem, match[3]);
			}
		});

		var disableSelection = $.fn.extend({
			disableSelection: function () {
				var eventType = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";

				return function () {
					return this.on(eventType + ".ui-disableSelection", function (event) {
						event.preventDefault();
					});
				};
			}(),

			enableSelection: function enableSelection() {
				return this.off(".ui-disableSelection");
			}
		});

		var dataSpace = "ui-effects-",
		    dataSpaceStyle = "ui-effects-style",
		    dataSpaceAnimated = "ui-effects-animated",
		    jQuery = $;

		$.effects = {
			effect: {}
		};

		(function (jQuery, undefined) {

			var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor " + "borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
			    rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
			    stringParsers = [{
				re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				parse: function parse(execResult) {
					return [execResult[1], execResult[2], execResult[3], execResult[4]];
				}
			}, {
				re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				parse: function parse(execResult) {
					return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
				}
			}, {
				re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
				parse: function parse(execResult) {
					return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
				}
			}, {
				re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
				parse: function parse(execResult) {
					return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
				}
			}, {
				re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
				space: "hsla",
				parse: function parse(execResult) {
					return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
				}
			}],
			    color = jQuery.Color = function (color, green, blue, alpha) {
				return new jQuery.Color.fn.parse(color, green, blue, alpha);
			},
			    spaces = {
				rgba: {
					props: {
						red: {
							idx: 0,
							type: "byte"
						},
						green: {
							idx: 1,
							type: "byte"
						},
						blue: {
							idx: 2,
							type: "byte"
						}
					}
				},

				hsla: {
					props: {
						hue: {
							idx: 0,
							type: "degrees"
						},
						saturation: {
							idx: 1,
							type: "percent"
						},
						lightness: {
							idx: 2,
							type: "percent"
						}
					}
				}
			},
			    propTypes = {
				"byte": {
					floor: true,
					max: 255
				},
				"percent": {
					max: 1
				},
				"degrees": {
					mod: 360,
					floor: true
				}
			},
			    support = color.support = {},
			    supportElem = jQuery("<p>")[0],
			    colors,
			    each = jQuery.each;

			supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
			support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;

			each(spaces, function (spaceName, space) {
				space.cache = "_" + spaceName;
				space.props.alpha = {
					idx: 3,
					type: "percent",
					def: 1
				};
			});

			function clamp(value, prop, allowEmpty) {
				var type = propTypes[prop.type] || {};

				if (value == null) {
					return allowEmpty || !prop.def ? null : prop.def;
				}

				value = type.floor ? ~~value : parseFloat(value);

				if (isNaN(value)) {
					return prop.def;
				}

				if (type.mod) {
					return (value + type.mod) % type.mod;
				}

				return 0 > value ? 0 : type.max < value ? type.max : value;
			}

			function stringParse(string) {
				var inst = color(),
				    rgba = inst._rgba = [];

				string = string.toLowerCase();

				each(stringParsers, function (i, parser) {
					var parsed,
					    match = parser.re.exec(string),
					    values = match && parser.parse(match),
					    spaceName = parser.space || "rgba";

					if (values) {
						parsed = inst[spaceName](values);

						inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
						rgba = inst._rgba = parsed._rgba;

						return false;
					}
				});

				if (rgba.length) {
					if (rgba.join() === "0,0,0,0") {
						jQuery.extend(rgba, colors.transparent);
					}
					return inst;
				}

				return colors[string];
			}

			color.fn = jQuery.extend(color.prototype, {
				parse: function parse(red, green, blue, alpha) {
					if (red === undefined) {
						this._rgba = [null, null, null, null];
						return this;
					}
					if (red.jquery || red.nodeType) {
						red = jQuery(red).css(green);
						green = undefined;
					}

					var inst = this,
					    type = jQuery.type(red),
					    rgba = this._rgba = [];

					if (green !== undefined) {
						red = [red, green, blue, alpha];
						type = "array";
					}

					if (type === "string") {
						return this.parse(stringParse(red) || colors._default);
					}

					if (type === "array") {
						each(spaces.rgba.props, function (key, prop) {
							rgba[prop.idx] = clamp(red[prop.idx], prop);
						});
						return this;
					}

					if (type === "object") {
						if (red instanceof color) {
							each(spaces, function (spaceName, space) {
								if (red[space.cache]) {
									inst[space.cache] = red[space.cache].slice();
								}
							});
						} else {
							each(spaces, function (spaceName, space) {
								var cache = space.cache;
								each(space.props, function (key, prop) {
									if (!inst[cache] && space.to) {
										if (key === "alpha" || red[key] == null) {
											return;
										}
										inst[cache] = space.to(inst._rgba);
									}

									inst[cache][prop.idx] = clamp(red[key], prop, true);
								});

								if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
									inst[cache][3] = 1;
									if (space.from) {
										inst._rgba = space.from(inst[cache]);
									}
								}
							});
						}
						return this;
					}
				},
				is: function is(compare) {
					var is = color(compare),
					    same = true,
					    inst = this;

					each(spaces, function (_, space) {
						var localCache,
						    isCache = is[space.cache];
						if (isCache) {
							localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
							each(space.props, function (_, prop) {
								if (isCache[prop.idx] != null) {
									same = isCache[prop.idx] === localCache[prop.idx];
									return same;
								}
							});
						}
						return same;
					});
					return same;
				},
				_space: function _space() {
					var used = [],
					    inst = this;
					each(spaces, function (spaceName, space) {
						if (inst[space.cache]) {
							used.push(spaceName);
						}
					});
					return used.pop();
				},
				transition: function transition(other, distance) {
					var end = color(other),
					    spaceName = end._space(),
					    space = spaces[spaceName],
					    startColor = this.alpha() === 0 ? color("transparent") : this,
					    start = startColor[space.cache] || space.to(startColor._rgba),
					    result = start.slice();

					end = end[space.cache];
					each(space.props, function (key, prop) {
						var index = prop.idx,
						    startValue = start[index],
						    endValue = end[index],
						    type = propTypes[prop.type] || {};

						if (endValue === null) {
							return;
						}

						if (startValue === null) {
							result[index] = endValue;
						} else {
							if (type.mod) {
								if (endValue - startValue > type.mod / 2) {
									startValue += type.mod;
								} else if (startValue - endValue > type.mod / 2) {
									startValue -= type.mod;
								}
							}
							result[index] = clamp((endValue - startValue) * distance + startValue, prop);
						}
					});
					return this[spaceName](result);
				},
				blend: function blend(opaque) {
					if (this._rgba[3] === 1) {
						return this;
					}

					var rgb = this._rgba.slice(),
					    a = rgb.pop(),
					    blend = color(opaque)._rgba;

					return color(jQuery.map(rgb, function (v, i) {
						return (1 - a) * blend[i] + a * v;
					}));
				},
				toRgbaString: function toRgbaString() {
					var prefix = "rgba(",
					    rgba = jQuery.map(this._rgba, function (v, i) {
						return v == null ? i > 2 ? 1 : 0 : v;
					});

					if (rgba[3] === 1) {
						rgba.pop();
						prefix = "rgb(";
					}

					return prefix + rgba.join() + ")";
				},
				toHslaString: function toHslaString() {
					var prefix = "hsla(",
					    hsla = jQuery.map(this.hsla(), function (v, i) {
						if (v == null) {
							v = i > 2 ? 1 : 0;
						}

						if (i && i < 3) {
							v = Math.round(v * 100) + "%";
						}
						return v;
					});

					if (hsla[3] === 1) {
						hsla.pop();
						prefix = "hsl(";
					}
					return prefix + hsla.join() + ")";
				},
				toHexString: function toHexString(includeAlpha) {
					var rgba = this._rgba.slice(),
					    alpha = rgba.pop();

					if (includeAlpha) {
						rgba.push(~~(alpha * 255));
					}

					return "#" + jQuery.map(rgba, function (v) {
						v = (v || 0).toString(16);
						return v.length === 1 ? "0" + v : v;
					}).join("");
				},
				toString: function toString() {
					return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
				}
			});
			color.fn.parse.prototype = color.fn;

			function hue2rgb(p, q, h) {
				h = (h + 1) % 1;
				if (h * 6 < 1) {
					return p + (q - p) * h * 6;
				}
				if (h * 2 < 1) {
					return q;
				}
				if (h * 3 < 2) {
					return p + (q - p) * (2 / 3 - h) * 6;
				}
				return p;
			}

			spaces.hsla.to = function (rgba) {
				if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
					return [null, null, null, rgba[3]];
				}
				var r = rgba[0] / 255,
				    g = rgba[1] / 255,
				    b = rgba[2] / 255,
				    a = rgba[3],
				    max = Math.max(r, g, b),
				    min = Math.min(r, g, b),
				    diff = max - min,
				    add = max + min,
				    l = add * 0.5,
				    h,
				    s;

				if (min === max) {
					h = 0;
				} else if (r === max) {
					h = 60 * (g - b) / diff + 360;
				} else if (g === max) {
					h = 60 * (b - r) / diff + 120;
				} else {
					h = 60 * (r - g) / diff + 240;
				}

				if (diff === 0) {
					s = 0;
				} else if (l <= 0.5) {
					s = diff / add;
				} else {
					s = diff / (2 - add);
				}
				return [Math.round(h) % 360, s, l, a == null ? 1 : a];
			};

			spaces.hsla.from = function (hsla) {
				if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
					return [null, null, null, hsla[3]];
				}
				var h = hsla[0] / 360,
				    s = hsla[1],
				    l = hsla[2],
				    a = hsla[3],
				    q = l <= 0.5 ? l * (1 + s) : l + s - l * s,
				    p = 2 * l - q;

				return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255), a];
			};

			each(spaces, function (spaceName, space) {
				var props = space.props,
				    cache = space.cache,
				    to = space.to,
				    from = space.from;

				color.fn[spaceName] = function (value) {
					if (to && !this[cache]) {
						this[cache] = to(this._rgba);
					}
					if (value === undefined) {
						return this[cache].slice();
					}

					var ret,
					    type = jQuery.type(value),
					    arr = type === "array" || type === "object" ? value : arguments,
					    local = this[cache].slice();

					each(props, function (key, prop) {
						var val = arr[type === "object" ? key : prop.idx];
						if (val == null) {
							val = local[prop.idx];
						}
						local[prop.idx] = clamp(val, prop);
					});

					if (from) {
						ret = color(from(local));
						ret[cache] = local;
						return ret;
					} else {
						return color(local);
					}
				};

				each(props, function (key, prop) {
					if (color.fn[key]) {
						return;
					}
					color.fn[key] = function (value) {
						var vtype = jQuery.type(value),
						    fn = key === "alpha" ? this._hsla ? "hsla" : "rgba" : spaceName,
						    local = this[fn](),
						    cur = local[prop.idx],
						    match;

						if (vtype === "undefined") {
							return cur;
						}

						if (vtype === "function") {
							value = value.call(this, cur);
							vtype = jQuery.type(value);
						}
						if (value == null && prop.empty) {
							return this;
						}
						if (vtype === "string") {
							match = rplusequals.exec(value);
							if (match) {
								value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
							}
						}
						local[prop.idx] = value;
						return this[fn](local);
					};
				});
			});

			color.hook = function (hook) {
				var hooks = hook.split(" ");
				each(hooks, function (i, hook) {
					jQuery.cssHooks[hook] = {
						set: function set(elem, value) {
							var parsed,
							    curElem,
							    backgroundColor = "";

							if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
								value = color(parsed || value);
								if (!support.rgba && value._rgba[3] !== 1) {
									curElem = hook === "backgroundColor" ? elem.parentNode : elem;
									while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
										try {
											backgroundColor = jQuery.css(curElem, "backgroundColor");
											curElem = curElem.parentNode;
										} catch (e) {}
									}

									value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
								}

								value = value.toRgbaString();
							}
							try {
								elem.style[hook] = value;
							} catch (e) {}
						}
					};
					jQuery.fx.step[hook] = function (fx) {
						if (!fx.colorInit) {
							fx.start = color(fx.elem, hook);
							fx.end = color(fx.end);
							fx.colorInit = true;
						}
						jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
					};
				});
			};

			color.hook(stepHooks);

			jQuery.cssHooks.borderColor = {
				expand: function expand(value) {
					var expanded = {};

					each(["Top", "Right", "Bottom", "Left"], function (i, part) {
						expanded["border" + part + "Color"] = value;
					});
					return expanded;
				}
			};

			colors = jQuery.Color.names = {
				aqua: "#00ffff",
				black: "#000000",
				blue: "#0000ff",
				fuchsia: "#ff00ff",
				gray: "#808080",
				green: "#008000",
				lime: "#00ff00",
				maroon: "#800000",
				navy: "#000080",
				olive: "#808000",
				purple: "#800080",
				red: "#ff0000",
				silver: "#c0c0c0",
				teal: "#008080",
				white: "#ffffff",
				yellow: "#ffff00",

				transparent: [null, null, null, 0],

				_default: "#ffffff"
			};
		})(jQuery);

		(function () {

			var classAnimationActions = ["add", "remove", "toggle"],
			    shorthandStyles = {
				border: 1,
				borderBottom: 1,
				borderColor: 1,
				borderLeft: 1,
				borderRight: 1,
				borderTop: 1,
				borderWidth: 1,
				margin: 1,
				padding: 1
			};

			$.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (_, prop) {
				$.fx.step[prop] = function (fx) {
					if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
						jQuery.style(fx.elem, prop, fx.end);
						fx.setAttr = true;
					}
				};
			});

			function getElementStyles(elem) {
				var key,
				    len,
				    style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle,
				    styles = {};

				if (style && style.length && style[0] && style[style[0]]) {
					len = style.length;
					while (len--) {
						key = style[len];
						if (typeof style[key] === "string") {
							styles[$.camelCase(key)] = style[key];
						}
					}
				} else {
					for (key in style) {
						if (typeof style[key] === "string") {
							styles[key] = style[key];
						}
					}
				}

				return styles;
			}

			function styleDifference(oldStyle, newStyle) {
				var diff = {},
				    name,
				    value;

				for (name in newStyle) {
					value = newStyle[name];
					if (oldStyle[name] !== value) {
						if (!shorthandStyles[name]) {
							if ($.fx.step[name] || !isNaN(parseFloat(value))) {
								diff[name] = value;
							}
						}
					}
				}

				return diff;
			}

			if (!$.fn.addBack) {
				$.fn.addBack = function (selector) {
					return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
				};
			}

			$.effects.animateClass = function (value, duration, easing, callback) {
				var o = $.speed(duration, easing, callback);

				return this.queue(function () {
					var animated = $(this),
					    baseClass = animated.attr("class") || "",
					    applyClassChange,
					    allAnimations = o.children ? animated.find("*").addBack() : animated;

					allAnimations = allAnimations.map(function () {
						var el = $(this);
						return {
							el: el,
							start: getElementStyles(this)
						};
					});

					applyClassChange = function applyClassChange() {
						$.each(classAnimationActions, function (i, action) {
							if (value[action]) {
								animated[action + "Class"](value[action]);
							}
						});
					};
					applyClassChange();

					allAnimations = allAnimations.map(function () {
						this.end = getElementStyles(this.el[0]);
						this.diff = styleDifference(this.start, this.end);
						return this;
					});

					animated.attr("class", baseClass);

					allAnimations = allAnimations.map(function () {
						var styleInfo = this,
						    dfd = $.Deferred(),
						    opts = $.extend({}, o, {
							queue: false,
							complete: function complete() {
								dfd.resolve(styleInfo);
							}
						});

						this.el.animate(this.diff, opts);
						return dfd.promise();
					});

					$.when.apply($, allAnimations.get()).done(function () {
						applyClassChange();

						$.each(arguments, function () {
							var el = this.el;
							$.each(this.diff, function (key) {
								el.css(key, "");
							});
						});

						o.complete.call(animated[0]);
					});
				});
			};

			$.fn.extend({
				addClass: function (orig) {
					return function (classNames, speed, easing, callback) {
						return speed ? $.effects.animateClass.call(this, { add: classNames }, speed, easing, callback) : orig.apply(this, arguments);
					};
				}($.fn.addClass),

				removeClass: function (orig) {
					return function (classNames, speed, easing, callback) {
						return arguments.length > 1 ? $.effects.animateClass.call(this, { remove: classNames }, speed, easing, callback) : orig.apply(this, arguments);
					};
				}($.fn.removeClass),

				toggleClass: function (orig) {
					return function (classNames, force, speed, easing, callback) {
						if (typeof force === "boolean" || force === undefined) {
							if (!speed) {
								return orig.apply(this, arguments);
							} else {
								return $.effects.animateClass.call(this, force ? { add: classNames } : { remove: classNames }, speed, easing, callback);
							}
						} else {
							return $.effects.animateClass.call(this, { toggle: classNames }, force, speed, easing);
						}
					};
				}($.fn.toggleClass),

				switchClass: function switchClass(remove, add, speed, easing, callback) {
					return $.effects.animateClass.call(this, {
						add: add,
						remove: remove
					}, speed, easing, callback);
				}
			});
		})();

		(function () {

			if ($.expr && $.expr.filters && $.expr.filters.animated) {
				$.expr.filters.animated = function (orig) {
					return function (elem) {
						return !!$(elem).data(dataSpaceAnimated) || orig(elem);
					};
				}($.expr.filters.animated);
			}

			if ($.uiBackCompat !== false) {
				$.extend($.effects, {
					save: function save(element, set) {
						var i = 0,
						    length = set.length;
						for (; i < length; i++) {
							if (set[i] !== null) {
								element.data(dataSpace + set[i], element[0].style[set[i]]);
							}
						}
					},

					restore: function restore(element, set) {
						var val,
						    i = 0,
						    length = set.length;
						for (; i < length; i++) {
							if (set[i] !== null) {
								val = element.data(dataSpace + set[i]);
								element.css(set[i], val);
							}
						}
					},

					setMode: function setMode(el, mode) {
						if (mode === "toggle") {
							mode = el.is(":hidden") ? "show" : "hide";
						}
						return mode;
					},

					createWrapper: function createWrapper(element) {
						if (element.parent().is(".ui-effects-wrapper")) {
							return element.parent();
						}

						var props = {
							width: element.outerWidth(true),
							height: element.outerHeight(true),
							"float": element.css("float")
						},
						    wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
							fontSize: "100%",
							background: "transparent",
							border: "none",
							margin: 0,
							padding: 0
						}),
						    size = {
							width: element.width(),
							height: element.height()
						},
						    active = document.activeElement;

						try {
							active.id;
						} catch (e) {
							active = document.body;
						}

						element.wrap(wrapper);

						if (element[0] === active || $.contains(element[0], active)) {
							$(active).trigger("focus");
						}

						wrapper = element.parent();

						if (element.css("position") === "static") {
							wrapper.css({ position: "relative" });
							element.css({ position: "relative" });
						} else {
							$.extend(props, {
								position: element.css("position"),
								zIndex: element.css("z-index")
							});
							$.each(["top", "left", "bottom", "right"], function (i, pos) {
								props[pos] = element.css(pos);
								if (isNaN(parseInt(props[pos], 10))) {
									props[pos] = "auto";
								}
							});
							element.css({
								position: "relative",
								top: 0,
								left: 0,
								right: "auto",
								bottom: "auto"
							});
						}
						element.css(size);

						return wrapper.css(props).show();
					},

					removeWrapper: function removeWrapper(element) {
						var active = document.activeElement;

						if (element.parent().is(".ui-effects-wrapper")) {
							element.parent().replaceWith(element);

							if (element[0] === active || $.contains(element[0], active)) {
								$(active).trigger("focus");
							}
						}

						return element;
					}
				});
			}

			$.extend($.effects, {
				version: "1.12.1",

				define: function define(name, mode, effect) {
					if (!effect) {
						effect = mode;
						mode = "effect";
					}

					$.effects.effect[name] = effect;
					$.effects.effect[name].mode = mode;

					return effect;
				},

				scaledDimensions: function scaledDimensions(element, percent, direction) {
					if (percent === 0) {
						return {
							height: 0,
							width: 0,
							outerHeight: 0,
							outerWidth: 0
						};
					}

					var x = direction !== "horizontal" ? (percent || 100) / 100 : 1,
					    y = direction !== "vertical" ? (percent || 100) / 100 : 1;

					return {
						height: element.height() * y,
						width: element.width() * x,
						outerHeight: element.outerHeight() * y,
						outerWidth: element.outerWidth() * x
					};
				},

				clipToBox: function clipToBox(animation) {
					return {
						width: animation.clip.right - animation.clip.left,
						height: animation.clip.bottom - animation.clip.top,
						left: animation.clip.left,
						top: animation.clip.top
					};
				},

				unshift: function unshift(element, queueLength, count) {
					var queue = element.queue();

					if (queueLength > 1) {
						queue.splice.apply(queue, [1, 0].concat(queue.splice(queueLength, count)));
					}
					element.dequeue();
				},

				saveStyle: function saveStyle(element) {
					element.data(dataSpaceStyle, element[0].style.cssText);
				},

				restoreStyle: function restoreStyle(element) {
					element[0].style.cssText = element.data(dataSpaceStyle) || "";
					element.removeData(dataSpaceStyle);
				},

				mode: function mode(element, _mode) {
					var hidden = element.is(":hidden");

					if (_mode === "toggle") {
						_mode = hidden ? "show" : "hide";
					}
					if (hidden ? _mode === "hide" : _mode === "show") {
						_mode = "none";
					}
					return _mode;
				},

				getBaseline: function getBaseline(origin, original) {
					var y, x;

					switch (origin[0]) {
						case "top":
							y = 0;
							break;
						case "middle":
							y = 0.5;
							break;
						case "bottom":
							y = 1;
							break;
						default:
							y = origin[0] / original.height;
					}

					switch (origin[1]) {
						case "left":
							x = 0;
							break;
						case "center":
							x = 0.5;
							break;
						case "right":
							x = 1;
							break;
						default:
							x = origin[1] / original.width;
					}

					return {
						x: x,
						y: y
					};
				},

				createPlaceholder: function createPlaceholder(element) {
					var placeholder,
					    cssPosition = element.css("position"),
					    position = element.position();

					element.css({
						marginTop: element.css("marginTop"),
						marginBottom: element.css("marginBottom"),
						marginLeft: element.css("marginLeft"),
						marginRight: element.css("marginRight")
					}).outerWidth(element.outerWidth()).outerHeight(element.outerHeight());

					if (/^(static|relative)/.test(cssPosition)) {
						cssPosition = "absolute";

						placeholder = $("<" + element[0].nodeName + ">").insertAfter(element).css({
							display: /^(inline|ruby)/.test(element.css("display")) ? "inline-block" : "block",
							visibility: "hidden",

							marginTop: element.css("marginTop"),
							marginBottom: element.css("marginBottom"),
							marginLeft: element.css("marginLeft"),
							marginRight: element.css("marginRight"),
							"float": element.css("float")
						}).outerWidth(element.outerWidth()).outerHeight(element.outerHeight()).addClass("ui-effects-placeholder");

						element.data(dataSpace + "placeholder", placeholder);
					}

					element.css({
						position: cssPosition,
						left: position.left,
						top: position.top
					});

					return placeholder;
				},

				removePlaceholder: function removePlaceholder(element) {
					var dataKey = dataSpace + "placeholder",
					    placeholder = element.data(dataKey);

					if (placeholder) {
						placeholder.remove();
						element.removeData(dataKey);
					}
				},

				cleanUp: function cleanUp(element) {
					$.effects.restoreStyle(element);
					$.effects.removePlaceholder(element);
				},

				setTransition: function setTransition(element, list, factor, value) {
					value = value || {};
					$.each(list, function (i, x) {
						var unit = element.cssUnit(x);
						if (unit[0] > 0) {
							value[x] = unit[0] * factor + unit[1];
						}
					});
					return value;
				}
			});

			function _normalizeArguments(effect, options, speed, callback) {
				if ($.isPlainObject(effect)) {
					options = effect;
					effect = effect.effect;
				}

				effect = { effect: effect };

				if (options == null) {
					options = {};
				}

				if ($.isFunction(options)) {
					callback = options;
					speed = null;
					options = {};
				}

				if (typeof options === "number" || $.fx.speeds[options]) {
					callback = speed;
					speed = options;
					options = {};
				}

				if ($.isFunction(speed)) {
					callback = speed;
					speed = null;
				}

				if (options) {
					$.extend(effect, options);
				}

				speed = speed || options.duration;
				effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

				effect.complete = callback || options.complete;

				return effect;
			}

			function standardAnimationOption(option) {
				if (!option || typeof option === "number" || $.fx.speeds[option]) {
					return true;
				}

				if (typeof option === "string" && !$.effects.effect[option]) {
					return true;
				}

				if ($.isFunction(option)) {
					return true;
				}

				if ((typeof option === "undefined" ? "undefined" : _typeof(option)) === "object" && !option.effect) {
					return true;
				}

				return false;
			}

			$.fn.extend({
				effect: function effect() {
					var args = _normalizeArguments.apply(this, arguments),
					    effectMethod = $.effects.effect[args.effect],
					    defaultMode = effectMethod.mode,
					    queue = args.queue,
					    queueName = queue || "fx",
					    complete = args.complete,
					    mode = args.mode,
					    modes = [],
					    prefilter = function prefilter(next) {
						var el = $(this),
						    normalizedMode = $.effects.mode(el, mode) || defaultMode;

						el.data(dataSpaceAnimated, true);

						modes.push(normalizedMode);

						if (defaultMode && (normalizedMode === "show" || normalizedMode === defaultMode && normalizedMode === "hide")) {
							el.show();
						}

						if (!defaultMode || normalizedMode !== "none") {
							$.effects.saveStyle(el);
						}

						if ($.isFunction(next)) {
							next();
						}
					};

					if ($.fx.off || !effectMethod) {
						if (mode) {
							return this[mode](args.duration, complete);
						} else {
							return this.each(function () {
								if (complete) {
									complete.call(this);
								}
							});
						}
					}

					function run(next) {
						var elem = $(this);

						function cleanup() {
							elem.removeData(dataSpaceAnimated);

							$.effects.cleanUp(elem);

							if (args.mode === "hide") {
								elem.hide();
							}

							done();
						}

						function done() {
							if ($.isFunction(complete)) {
								complete.call(elem[0]);
							}

							if ($.isFunction(next)) {
								next();
							}
						}

						args.mode = modes.shift();

						if ($.uiBackCompat !== false && !defaultMode) {
							if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
								elem[mode]();
								done();
							} else {
								effectMethod.call(elem[0], args, done);
							}
						} else {
							if (args.mode === "none") {
								elem[mode]();
								done();
							} else {
								effectMethod.call(elem[0], args, cleanup);
							}
						}
					}

					return queue === false ? this.each(prefilter).each(run) : this.queue(queueName, prefilter).queue(queueName, run);
				},

				show: function (orig) {
					return function (option) {
						if (standardAnimationOption(option)) {
							return orig.apply(this, arguments);
						} else {
							var args = _normalizeArguments.apply(this, arguments);
							args.mode = "show";
							return this.effect.call(this, args);
						}
					};
				}($.fn.show),

				hide: function (orig) {
					return function (option) {
						if (standardAnimationOption(option)) {
							return orig.apply(this, arguments);
						} else {
							var args = _normalizeArguments.apply(this, arguments);
							args.mode = "hide";
							return this.effect.call(this, args);
						}
					};
				}($.fn.hide),

				toggle: function (orig) {
					return function (option) {
						if (standardAnimationOption(option) || typeof option === "boolean") {
							return orig.apply(this, arguments);
						} else {
							var args = _normalizeArguments.apply(this, arguments);
							args.mode = "toggle";
							return this.effect.call(this, args);
						}
					};
				}($.fn.toggle),

				cssUnit: function cssUnit(key) {
					var style = this.css(key),
					    val = [];

					$.each(["em", "px", "%", "pt"], function (i, unit) {
						if (style.indexOf(unit) > 0) {
							val = [parseFloat(style), unit];
						}
					});
					return val;
				},

				cssClip: function cssClip(clipObj) {
					if (clipObj) {
						return this.css("clip", "rect(" + clipObj.top + "px " + clipObj.right + "px " + clipObj.bottom + "px " + clipObj.left + "px)");
					}
					return parseClip(this.css("clip"), this);
				},

				transfer: function transfer(options, done) {
					var element = $(this),
					    target = $(options.to),
					    targetFixed = target.css("position") === "fixed",
					    body = $("body"),
					    fixTop = targetFixed ? body.scrollTop() : 0,
					    fixLeft = targetFixed ? body.scrollLeft() : 0,
					    endPosition = target.offset(),
					    animation = {
						top: endPosition.top - fixTop,
						left: endPosition.left - fixLeft,
						height: target.innerHeight(),
						width: target.innerWidth()
					},
					    startPosition = element.offset(),
					    transfer = $("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(options.className).css({
						top: startPosition.top - fixTop,
						left: startPosition.left - fixLeft,
						height: element.innerHeight(),
						width: element.innerWidth(),
						position: targetFixed ? "fixed" : "absolute"
					}).animate(animation, options.duration, options.easing, function () {
						transfer.remove();
						if ($.isFunction(done)) {
							done();
						}
					});
				}
			});

			function parseClip(str, element) {
				var outerWidth = element.outerWidth(),
				    outerHeight = element.outerHeight(),
				    clipRegex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
				    values = clipRegex.exec(str) || ["", 0, outerWidth, outerHeight, 0];

				return {
					top: parseFloat(values[1]) || 0,
					right: values[2] === "auto" ? outerWidth : parseFloat(values[2]),
					bottom: values[3] === "auto" ? outerHeight : parseFloat(values[3]),
					left: parseFloat(values[4]) || 0
				};
			}

			$.fx.step.clip = function (fx) {
				if (!fx.clipInit) {
					fx.start = $(fx.elem).cssClip();
					if (typeof fx.end === "string") {
						fx.end = parseClip(fx.end, fx.elem);
					}
					fx.clipInit = true;
				}

				$(fx.elem).cssClip({
					top: fx.pos * (fx.end.top - fx.start.top) + fx.start.top,
					right: fx.pos * (fx.end.right - fx.start.right) + fx.start.right,
					bottom: fx.pos * (fx.end.bottom - fx.start.bottom) + fx.start.bottom,
					left: fx.pos * (fx.end.left - fx.start.left) + fx.start.left
				});
			};
		})();

		(function () {

			var baseEasings = {};

			$.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, name) {
				baseEasings[name] = function (p) {
					return Math.pow(p, i + 2);
				};
			});

			$.extend(baseEasings, {
				Sine: function Sine(p) {
					return 1 - Math.cos(p * Math.PI / 2);
				},
				Circ: function Circ(p) {
					return 1 - Math.sqrt(1 - p * p);
				},
				Elastic: function Elastic(p) {
					return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
				},
				Back: function Back(p) {
					return p * p * (3 * p - 2);
				},
				Bounce: function Bounce(p) {
					var pow2,
					    bounce = 4;

					while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
					return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
				}
			});

			$.each(baseEasings, function (name, easeIn) {
				$.easing["easeIn" + name] = easeIn;
				$.easing["easeOut" + name] = function (p) {
					return 1 - easeIn(1 - p);
				};
				$.easing["easeInOut" + name] = function (p) {
					return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
				};
			});
		})();

		var effect = $.effects;

		var effectsEffectBlind = $.effects.define("blind", "hide", function (options, done) {
			var map = {
				up: ["bottom", "top"],
				vertical: ["bottom", "top"],
				down: ["top", "bottom"],
				left: ["right", "left"],
				horizontal: ["right", "left"],
				right: ["left", "right"]
			},
			    element = $(this),
			    direction = options.direction || "up",
			    start = element.cssClip(),
			    animate = { clip: $.extend({}, start) },
			    placeholder = $.effects.createPlaceholder(element);

			animate.clip[map[direction][0]] = animate.clip[map[direction][1]];

			if (options.mode === "show") {
				element.cssClip(animate.clip);
				if (placeholder) {
					placeholder.css($.effects.clipToBox(animate));
				}

				animate.clip = start;
			}

			if (placeholder) {
				placeholder.animate($.effects.clipToBox(animate), options.duration, options.easing);
			}

			element.animate(animate, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effectsEffectBounce = $.effects.define("bounce", function (options, done) {
			var upAnim,
			    downAnim,
			    refValue,
			    element = $(this),
			    mode = options.mode,
			    hide = mode === "hide",
			    show = mode === "show",
			    direction = options.direction || "up",
			    distance = options.distance,
			    times = options.times || 5,
			    anims = times * 2 + (show || hide ? 1 : 0),
			    speed = options.duration / anims,
			    easing = options.easing,
			    ref = direction === "up" || direction === "down" ? "top" : "left",
			    motion = direction === "up" || direction === "left",
			    i = 0,
			    queuelen = element.queue().length;

			$.effects.createPlaceholder(element);

			refValue = element.css(ref);

			if (!distance) {
				distance = element[ref === "top" ? "outerHeight" : "outerWidth"]() / 3;
			}

			if (show) {
				downAnim = { opacity: 1 };
				downAnim[ref] = refValue;

				element.css("opacity", 0).css(ref, motion ? -distance * 2 : distance * 2).animate(downAnim, speed, easing);
			}

			if (hide) {
				distance = distance / Math.pow(2, times - 1);
			}

			downAnim = {};
			downAnim[ref] = refValue;

			for (; i < times; i++) {
				upAnim = {};
				upAnim[ref] = (motion ? "-=" : "+=") + distance;

				element.animate(upAnim, speed, easing).animate(downAnim, speed, easing);

				distance = hide ? distance * 2 : distance / 2;
			}

			if (hide) {
				upAnim = { opacity: 0 };
				upAnim[ref] = (motion ? "-=" : "+=") + distance;

				element.animate(upAnim, speed, easing);
			}

			element.queue(done);

			$.effects.unshift(element, queuelen, anims + 1);
		});

		var effectsEffectClip = $.effects.define("clip", "hide", function (options, done) {
			var start,
			    animate = {},
			    element = $(this),
			    direction = options.direction || "vertical",
			    both = direction === "both",
			    horizontal = both || direction === "horizontal",
			    vertical = both || direction === "vertical";

			start = element.cssClip();
			animate.clip = {
				top: vertical ? (start.bottom - start.top) / 2 : start.top,
				right: horizontal ? (start.right - start.left) / 2 : start.right,
				bottom: vertical ? (start.bottom - start.top) / 2 : start.bottom,
				left: horizontal ? (start.right - start.left) / 2 : start.left
			};

			$.effects.createPlaceholder(element);

			if (options.mode === "show") {
				element.cssClip(animate.clip);
				animate.clip = start;
			}

			element.animate(animate, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effectsEffectDrop = $.effects.define("drop", "hide", function (options, done) {

			var distance,
			    element = $(this),
			    mode = options.mode,
			    show = mode === "show",
			    direction = options.direction || "left",
			    ref = direction === "up" || direction === "down" ? "top" : "left",
			    motion = direction === "up" || direction === "left" ? "-=" : "+=",
			    oppositeMotion = motion === "+=" ? "-=" : "+=",
			    animation = {
				opacity: 0
			};

			$.effects.createPlaceholder(element);

			distance = options.distance || element[ref === "top" ? "outerHeight" : "outerWidth"](true) / 2;

			animation[ref] = motion + distance;

			if (show) {
				element.css(animation);

				animation[ref] = oppositeMotion + distance;
				animation.opacity = 1;
			}

			element.animate(animation, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effectsEffectExplode = $.effects.define("explode", "hide", function (options, done) {

			var i,
			    j,
			    left,
			    top,
			    mx,
			    my,
			    rows = options.pieces ? Math.round(Math.sqrt(options.pieces)) : 3,
			    cells = rows,
			    element = $(this),
			    mode = options.mode,
			    show = mode === "show",
			    offset = element.show().css("visibility", "hidden").offset(),
			    width = Math.ceil(element.outerWidth() / cells),
			    height = Math.ceil(element.outerHeight() / rows),
			    pieces = [];

			function childComplete() {
				pieces.push(this);
				if (pieces.length === rows * cells) {
					animComplete();
				}
			}

			for (i = 0; i < rows; i++) {
				top = offset.top + i * height;
				my = i - (rows - 1) / 2;

				for (j = 0; j < cells; j++) {
					left = offset.left + j * width;
					mx = j - (cells - 1) / 2;

					element.clone().appendTo("body").wrap("<div></div>").css({
						position: "absolute",
						visibility: "visible",
						left: -j * width,
						top: -i * height
					}).parent().addClass("ui-effects-explode").css({
						position: "absolute",
						overflow: "hidden",
						width: width,
						height: height,
						left: left + (show ? mx * width : 0),
						top: top + (show ? my * height : 0),
						opacity: show ? 0 : 1
					}).animate({
						left: left + (show ? 0 : mx * width),
						top: top + (show ? 0 : my * height),
						opacity: show ? 1 : 0
					}, options.duration || 500, options.easing, childComplete);
				}
			}

			function animComplete() {
				element.css({
					visibility: "visible"
				});
				$(pieces).remove();
				done();
			}
		});

		var effectsEffectFade = $.effects.define("fade", "toggle", function (options, done) {
			var show = options.mode === "show";

			$(this).css("opacity", show ? 0 : 1).animate({
				opacity: show ? 1 : 0
			}, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effectsEffectFold = $.effects.define("fold", "hide", function (options, done) {
			var element = $(this),
			    mode = options.mode,
			    show = mode === "show",
			    hide = mode === "hide",
			    size = options.size || 15,
			    percent = /([0-9]+)%/.exec(size),
			    horizFirst = !!options.horizFirst,
			    ref = horizFirst ? ["right", "bottom"] : ["bottom", "right"],
			    duration = options.duration / 2,
			    placeholder = $.effects.createPlaceholder(element),
			    start = element.cssClip(),
			    animation1 = { clip: $.extend({}, start) },
			    animation2 = { clip: $.extend({}, start) },
			    distance = [start[ref[0]], start[ref[1]]],
			    queuelen = element.queue().length;

			if (percent) {
				size = parseInt(percent[1], 10) / 100 * distance[hide ? 0 : 1];
			}
			animation1.clip[ref[0]] = size;
			animation2.clip[ref[0]] = size;
			animation2.clip[ref[1]] = 0;

			if (show) {
				element.cssClip(animation2.clip);
				if (placeholder) {
					placeholder.css($.effects.clipToBox(animation2));
				}

				animation2.clip = start;
			}

			element.queue(function (next) {
				if (placeholder) {
					placeholder.animate($.effects.clipToBox(animation1), duration, options.easing).animate($.effects.clipToBox(animation2), duration, options.easing);
				}

				next();
			}).animate(animation1, duration, options.easing).animate(animation2, duration, options.easing).queue(done);

			$.effects.unshift(element, queuelen, 4);
		});

		var effectsEffectHighlight = $.effects.define("highlight", "show", function (options, done) {
			var element = $(this),
			    animation = {
				backgroundColor: element.css("backgroundColor")
			};

			if (options.mode === "hide") {
				animation.opacity = 0;
			}

			$.effects.saveStyle(element);

			element.css({
				backgroundImage: "none",
				backgroundColor: options.color || "#ffff99"
			}).animate(animation, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effectsEffectSize = $.effects.define("size", function (options, done) {
			var baseline,
			    factor,
			    temp,
			    element = $(this),
			    cProps = ["fontSize"],
			    vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
			    hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
			    mode = options.mode,
			    restore = mode !== "effect",
			    scale = options.scale || "both",
			    origin = options.origin || ["middle", "center"],
			    position = element.css("position"),
			    pos = element.position(),
			    original = $.effects.scaledDimensions(element),
			    from = options.from || original,
			    to = options.to || $.effects.scaledDimensions(element, 0);

			$.effects.createPlaceholder(element);

			if (mode === "show") {
				temp = from;
				from = to;
				to = temp;
			}

			factor = {
				from: {
					y: from.height / original.height,
					x: from.width / original.width
				},
				to: {
					y: to.height / original.height,
					x: to.width / original.width
				}
			};

			if (scale === "box" || scale === "both") {
				if (factor.from.y !== factor.to.y) {
					from = $.effects.setTransition(element, vProps, factor.from.y, from);
					to = $.effects.setTransition(element, vProps, factor.to.y, to);
				}

				if (factor.from.x !== factor.to.x) {
					from = $.effects.setTransition(element, hProps, factor.from.x, from);
					to = $.effects.setTransition(element, hProps, factor.to.x, to);
				}
			}

			if (scale === "content" || scale === "both") {
				if (factor.from.y !== factor.to.y) {
					from = $.effects.setTransition(element, cProps, factor.from.y, from);
					to = $.effects.setTransition(element, cProps, factor.to.y, to);
				}
			}

			if (origin) {
				baseline = $.effects.getBaseline(origin, original);
				from.top = (original.outerHeight - from.outerHeight) * baseline.y + pos.top;
				from.left = (original.outerWidth - from.outerWidth) * baseline.x + pos.left;
				to.top = (original.outerHeight - to.outerHeight) * baseline.y + pos.top;
				to.left = (original.outerWidth - to.outerWidth) * baseline.x + pos.left;
			}
			element.css(from);

			if (scale === "content" || scale === "both") {

				vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
				hProps = hProps.concat(["marginLeft", "marginRight"]);

				element.find("*[width]").each(function () {
					var child = $(this),
					    childOriginal = $.effects.scaledDimensions(child),
					    childFrom = {
						height: childOriginal.height * factor.from.y,
						width: childOriginal.width * factor.from.x,
						outerHeight: childOriginal.outerHeight * factor.from.y,
						outerWidth: childOriginal.outerWidth * factor.from.x
					},
					    childTo = {
						height: childOriginal.height * factor.to.y,
						width: childOriginal.width * factor.to.x,
						outerHeight: childOriginal.height * factor.to.y,
						outerWidth: childOriginal.width * factor.to.x
					};

					if (factor.from.y !== factor.to.y) {
						childFrom = $.effects.setTransition(child, vProps, factor.from.y, childFrom);
						childTo = $.effects.setTransition(child, vProps, factor.to.y, childTo);
					}

					if (factor.from.x !== factor.to.x) {
						childFrom = $.effects.setTransition(child, hProps, factor.from.x, childFrom);
						childTo = $.effects.setTransition(child, hProps, factor.to.x, childTo);
					}

					if (restore) {
						$.effects.saveStyle(child);
					}

					child.css(childFrom);
					child.animate(childTo, options.duration, options.easing, function () {
						if (restore) {
							$.effects.restoreStyle(child);
						}
					});
				});
			}

			element.animate(to, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: function complete() {

					var offset = element.offset();

					if (to.opacity === 0) {
						element.css("opacity", from.opacity);
					}

					if (!restore) {
						element.css("position", position === "static" ? "relative" : position).offset(offset);

						$.effects.saveStyle(element);
					}

					done();
				}
			});
		});

		var effectsEffectScale = $.effects.define("scale", function (options, done) {
			var el = $(this),
			    mode = options.mode,
			    percent = parseInt(options.percent, 10) || (parseInt(options.percent, 10) === 0 ? 0 : mode !== "effect" ? 0 : 100),
			    newOptions = $.extend(true, {
				from: $.effects.scaledDimensions(el),
				to: $.effects.scaledDimensions(el, percent, options.direction || "both"),
				origin: options.origin || ["middle", "center"]
			}, options);

			if (options.fade) {
				newOptions.from.opacity = 1;
				newOptions.to.opacity = 0;
			}

			$.effects.effect.size.call(this, newOptions, done);
		});

		var effectsEffectPuff = $.effects.define("puff", "hide", function (options, done) {
			var newOptions = $.extend(true, {}, options, {
				fade: true,
				percent: parseInt(options.percent, 10) || 150
			});

			$.effects.effect.scale.call(this, newOptions, done);
		});

		var effectsEffectPulsate = $.effects.define("pulsate", "show", function (options, done) {
			var element = $(this),
			    mode = options.mode,
			    show = mode === "show",
			    hide = mode === "hide",
			    showhide = show || hide,
			    anims = (options.times || 5) * 2 + (showhide ? 1 : 0),
			    duration = options.duration / anims,
			    animateTo = 0,
			    i = 1,
			    queuelen = element.queue().length;

			if (show || !element.is(":visible")) {
				element.css("opacity", 0).show();
				animateTo = 1;
			}

			for (; i < anims; i++) {
				element.animate({ opacity: animateTo }, duration, options.easing);
				animateTo = 1 - animateTo;
			}

			element.animate({ opacity: animateTo }, duration, options.easing);

			element.queue(done);

			$.effects.unshift(element, queuelen, anims + 1);
		});

		var effectsEffectShake = $.effects.define("shake", function (options, done) {

			var i = 1,
			    element = $(this),
			    direction = options.direction || "left",
			    distance = options.distance || 20,
			    times = options.times || 3,
			    anims = times * 2 + 1,
			    speed = Math.round(options.duration / anims),
			    ref = direction === "up" || direction === "down" ? "top" : "left",
			    positiveMotion = direction === "up" || direction === "left",
			    animation = {},
			    animation1 = {},
			    animation2 = {},
			    queuelen = element.queue().length;

			$.effects.createPlaceholder(element);

			animation[ref] = (positiveMotion ? "-=" : "+=") + distance;
			animation1[ref] = (positiveMotion ? "+=" : "-=") + distance * 2;
			animation2[ref] = (positiveMotion ? "-=" : "+=") + distance * 2;

			element.animate(animation, speed, options.easing);

			for (; i < times; i++) {
				element.animate(animation1, speed, options.easing).animate(animation2, speed, options.easing);
			}

			element.animate(animation1, speed, options.easing).animate(animation, speed / 2, options.easing).queue(done);

			$.effects.unshift(element, queuelen, anims + 1);
		});

		var effectsEffectSlide = $.effects.define("slide", "show", function (options, done) {
			var startClip,
			    startRef,
			    element = $(this),
			    map = {
				up: ["bottom", "top"],
				down: ["top", "bottom"],
				left: ["right", "left"],
				right: ["left", "right"]
			},
			    mode = options.mode,
			    direction = options.direction || "left",
			    ref = direction === "up" || direction === "down" ? "top" : "left",
			    positiveMotion = direction === "up" || direction === "left",
			    distance = options.distance || element[ref === "top" ? "outerHeight" : "outerWidth"](true),
			    animation = {};

			$.effects.createPlaceholder(element);

			startClip = element.cssClip();
			startRef = element.position()[ref];

			animation[ref] = (positiveMotion ? -1 : 1) * distance + startRef;
			animation.clip = element.cssClip();
			animation.clip[map[direction][1]] = animation.clip[map[direction][0]];

			if (mode === "show") {
				element.cssClip(animation.clip);
				element.css(ref, animation[ref]);
				animation.clip = startClip;
				animation[ref] = startRef;
			}

			element.animate(animation, {
				queue: false,
				duration: options.duration,
				easing: options.easing,
				complete: done
			});
		});

		var effect;
		if ($.uiBackCompat !== false) {
			effect = $.effects.define("transfer", function (options, done) {
				$(this).transfer(options, done);
			});
		}
		var effectsEffectTransfer = effect;

		$.ui.focusable = function (element, hasTabindex) {
			var map,
			    mapName,
			    img,
			    focusableIfVisible,
			    fieldset,
			    nodeName = element.nodeName.toLowerCase();

			if ("area" === nodeName) {
				map = element.parentNode;
				mapName = map.name;
				if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
					return false;
				}
				img = $("img[usemap='#" + mapName + "']");
				return img.length > 0 && img.is(":visible");
			}

			if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
				focusableIfVisible = !element.disabled;

				if (focusableIfVisible) {
					fieldset = $(element).closest("fieldset")[0];
					if (fieldset) {
						focusableIfVisible = !fieldset.disabled;
					}
				}
			} else if ("a" === nodeName) {
				focusableIfVisible = element.href || hasTabindex;
			} else {
				focusableIfVisible = hasTabindex;
			}

			return focusableIfVisible && $(element).is(":visible") && visible($(element));
		};

		function visible(element) {
			var visibility = element.css("visibility");
			while (visibility === "inherit") {
				element = element.parent();
				visibility = element.css("visibility");
			}
			return visibility !== "hidden";
		}

		$.extend($.expr[":"], {
			focusable: function focusable(element) {
				return $.ui.focusable(element, $.attr(element, "tabindex") != null);
			}
		});

		var focusable = $.ui.focusable;

		var form = $.fn.form = function () {
			return typeof this[0].form === "string" ? this.closest("form") : $(this[0].form);
		};

		var formResetMixin = $.ui.formResetMixin = {
			_formResetHandler: function _formResetHandler() {
				var form = $(this);

				setTimeout(function () {
					var instances = form.data("ui-form-reset-instances");
					$.each(instances, function () {
						this.refresh();
					});
				});
			},

			_bindFormResetHandler: function _bindFormResetHandler() {
				this.form = this.element.form();
				if (!this.form.length) {
					return;
				}

				var instances = this.form.data("ui-form-reset-instances") || [];
				if (!instances.length) {
					this.form.on("reset.ui-form-reset", this._formResetHandler);
				}
				instances.push(this);
				this.form.data("ui-form-reset-instances", instances);
			},

			_unbindFormResetHandler: function _unbindFormResetHandler() {
				if (!this.form.length) {
					return;
				}

				var instances = this.form.data("ui-form-reset-instances");
				instances.splice($.inArray(this, instances), 1);
				if (instances.length) {
					this.form.data("ui-form-reset-instances", instances);
				} else {
					this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset");
				}
			}
		};

		if ($.fn.jquery.substring(0, 3) === "1.7") {
			$.each(["Width", "Height"], function (i, name) {
				var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
				    type = name.toLowerCase(),
				    orig = {
					innerWidth: $.fn.innerWidth,
					innerHeight: $.fn.innerHeight,
					outerWidth: $.fn.outerWidth,
					outerHeight: $.fn.outerHeight
				};

				function reduce(elem, size, border, margin) {
					$.each(side, function () {
						size -= parseFloat($.css(elem, "padding" + this)) || 0;
						if (border) {
							size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
						}
						if (margin) {
							size -= parseFloat($.css(elem, "margin" + this)) || 0;
						}
					});
					return size;
				}

				$.fn["inner" + name] = function (size) {
					if (size === undefined) {
						return orig["inner" + name].call(this);
					}

					return this.each(function () {
						$(this).css(type, reduce(this, size) + "px");
					});
				};

				$.fn["outer" + name] = function (size, margin) {
					if (typeof size !== "number") {
						return orig["outer" + name].call(this, size);
					}

					return this.each(function () {
						$(this).css(type, reduce(this, size, true, margin) + "px");
					});
				};
			});

			$.fn.addBack = function (selector) {
				return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
			};
		}

		;


		var keycode = $.ui.keyCode = {
			BACKSPACE: 8,
			COMMA: 188,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			LEFT: 37,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SPACE: 32,
			TAB: 9,
			UP: 38
		};

		var escapeSelector = $.ui.escapeSelector = function () {
			var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
			return function (selector) {
				return selector.replace(selectorEscape, "\\$1");
			};
		}();

		var labels = $.fn.labels = function () {
			var ancestor, selector, id, labels, ancestors;

			if (this[0].labels && this[0].labels.length) {
				return this.pushStack(this[0].labels);
			}

			labels = this.eq(0).parents("label");

			id = this.attr("id");
			if (id) {
				ancestor = this.eq(0).parents().last();

				ancestors = ancestor.add(ancestor.length ? ancestor.siblings() : this.siblings());

				selector = "label[for='" + $.ui.escapeSelector(id) + "']";

				labels = labels.add(ancestors.find(selector).addBack(selector));
			}

			return this.pushStack(labels);
		};

		var scrollParent = $.fn.scrollParent = function (includeHidden) {
			var position = this.css("position"),
			    excludeStaticParent = position === "absolute",
			    overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			    scrollParent = this.parents().filter(function () {
				var parent = $(this);
				if (excludeStaticParent && parent.css("position") === "static") {
					return false;
				}
				return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
			}).eq(0);

			return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
		};

		var tabbable = $.extend($.expr[":"], {
			tabbable: function tabbable(element) {
				var tabIndex = $.attr(element, "tabindex"),
				    hasTabindex = tabIndex != null;
				return (!hasTabindex || tabIndex >= 0) && $.ui.focusable(element, hasTabindex);
			}
		});

		var uniqueId = $.fn.extend({
			uniqueId: function () {
				var uuid = 0;

				return function () {
					return this.each(function () {
						if (!this.id) {
							this.id = "ui-id-" + ++uuid;
						}
					});
				};
			}(),

			removeUniqueId: function removeUniqueId() {
				return this.each(function () {
					if (/^ui-id-\d+$/.test(this.id)) {
						$(this).removeAttr("id");
					}
				});
			}
		});

		var widgetsAccordion = $.widget("ui.accordion", {
			version: "1.12.1",
			options: {
				active: 0,
				animate: {},
				classes: {
					"ui-accordion-header": "ui-corner-top",
					"ui-accordion-header-collapsed": "ui-corner-all",
					"ui-accordion-content": "ui-corner-bottom"
				},
				collapsible: false,
				event: "click",
				header: "> li > :first-child, > :not(li):even",
				heightStyle: "auto",
				icons: {
					activeHeader: "ui-icon-triangle-1-s",
					header: "ui-icon-triangle-1-e"
				},

				activate: null,
				beforeActivate: null
			},

			hideProps: {
				borderTopWidth: "hide",
				borderBottomWidth: "hide",
				paddingTop: "hide",
				paddingBottom: "hide",
				height: "hide"
			},

			showProps: {
				borderTopWidth: "show",
				borderBottomWidth: "show",
				paddingTop: "show",
				paddingBottom: "show",
				height: "show"
			},

			_create: function _create() {
				var options = this.options;

				this.prevShow = this.prevHide = $();
				this._addClass("ui-accordion", "ui-widget ui-helper-reset");
				this.element.attr("role", "tablist");

				if (!options.collapsible && (options.active === false || options.active == null)) {
					options.active = 0;
				}

				this._processPanels();

				if (options.active < 0) {
					options.active += this.headers.length;
				}
				this._refresh();
			},

			_getCreateEventData: function _getCreateEventData() {
				return {
					header: this.active,
					panel: !this.active.length ? $() : this.active.next()
				};
			},

			_createIcons: function _createIcons() {
				var icon,
				    children,
				    icons = this.options.icons;

				if (icons) {
					icon = $("<span>");
					this._addClass(icon, "ui-accordion-header-icon", "ui-icon " + icons.header);
					icon.prependTo(this.headers);
					children = this.active.children(".ui-accordion-header-icon");
					this._removeClass(children, icons.header)._addClass(children, null, icons.activeHeader)._addClass(this.headers, "ui-accordion-icons");
				}
			},

			_destroyIcons: function _destroyIcons() {
				this._removeClass(this.headers, "ui-accordion-icons");
				this.headers.children(".ui-accordion-header-icon").remove();
			},

			_destroy: function _destroy() {
				var contents;

				this.element.removeAttr("role");

				this.headers.removeAttr("role aria-expanded aria-selected aria-controls tabIndex").removeUniqueId();

				this._destroyIcons();

				contents = this.headers.next().css("display", "").removeAttr("role aria-hidden aria-labelledby").removeUniqueId();

				if (this.options.heightStyle !== "content") {
					contents.css("height", "");
				}
			},

			_setOption: function _setOption(key, value) {
				if (key === "active") {
					this._activate(value);
					return;
				}

				if (key === "event") {
					if (this.options.event) {
						this._off(this.headers, this.options.event);
					}
					this._setupEvents(value);
				}

				this._super(key, value);

				if (key === "collapsible" && !value && this.options.active === false) {
					this._activate(0);
				}

				if (key === "icons") {
					this._destroyIcons();
					if (value) {
						this._createIcons();
					}
				}
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this.element.attr("aria-disabled", value);

				this._toggleClass(null, "ui-state-disabled", !!value);
				this._toggleClass(this.headers.add(this.headers.next()), null, "ui-state-disabled", !!value);
			},

			_keydown: function _keydown(event) {
				if (event.altKey || event.ctrlKey) {
					return;
				}

				var keyCode = $.ui.keyCode,
				    length = this.headers.length,
				    currentIndex = this.headers.index(event.target),
				    toFocus = false;

				switch (event.keyCode) {
					case keyCode.RIGHT:
					case keyCode.DOWN:
						toFocus = this.headers[(currentIndex + 1) % length];
						break;
					case keyCode.LEFT:
					case keyCode.UP:
						toFocus = this.headers[(currentIndex - 1 + length) % length];
						break;
					case keyCode.SPACE:
					case keyCode.ENTER:
						this._eventHandler(event);
						break;
					case keyCode.HOME:
						toFocus = this.headers[0];
						break;
					case keyCode.END:
						toFocus = this.headers[length - 1];
						break;
				}

				if (toFocus) {
					$(event.target).attr("tabIndex", -1);
					$(toFocus).attr("tabIndex", 0);
					$(toFocus).trigger("focus");
					event.preventDefault();
				}
			},

			_panelKeyDown: function _panelKeyDown(event) {
				if (event.keyCode === $.ui.keyCode.UP && event.ctrlKey) {
					$(event.currentTarget).prev().trigger("focus");
				}
			},

			refresh: function refresh() {
				var options = this.options;
				this._processPanels();

				if (options.active === false && options.collapsible === true || !this.headers.length) {
					options.active = false;
					this.active = $();
				} else if (options.active === false) {
					this._activate(0);
				} else if (this.active.length && !$.contains(this.element[0], this.active[0])) {
					if (this.headers.length === this.headers.find(".ui-state-disabled").length) {
						options.active = false;
						this.active = $();
					} else {
						this._activate(Math.max(0, options.active - 1));
					}
				} else {
					options.active = this.headers.index(this.active);
				}

				this._destroyIcons();

				this._refresh();
			},

			_processPanels: function _processPanels() {
				var prevHeaders = this.headers,
				    prevPanels = this.panels;

				this.headers = this.element.find(this.options.header);
				this._addClass(this.headers, "ui-accordion-header ui-accordion-header-collapsed", "ui-state-default");

				this.panels = this.headers.next().filter(":not(.ui-accordion-content-active)").hide();
				this._addClass(this.panels, "ui-accordion-content", "ui-helper-reset ui-widget-content");

				if (prevPanels) {
					this._off(prevHeaders.not(this.headers));
					this._off(prevPanels.not(this.panels));
				}
			},

			_refresh: function _refresh() {
				var maxHeight,
				    options = this.options,
				    heightStyle = options.heightStyle,
				    parent = this.element.parent();

				this.active = this._findActive(options.active);
				this._addClass(this.active, "ui-accordion-header-active", "ui-state-active")._removeClass(this.active, "ui-accordion-header-collapsed");
				this._addClass(this.active.next(), "ui-accordion-content-active");
				this.active.next().show();

				this.headers.attr("role", "tab").each(function () {
					var header = $(this),
					    headerId = header.uniqueId().attr("id"),
					    panel = header.next(),
					    panelId = panel.uniqueId().attr("id");
					header.attr("aria-controls", panelId);
					panel.attr("aria-labelledby", headerId);
				}).next().attr("role", "tabpanel");

				this.headers.not(this.active).attr({
					"aria-selected": "false",
					"aria-expanded": "false",
					tabIndex: -1
				}).next().attr({
					"aria-hidden": "true"
				}).hide();

				if (!this.active.length) {
					this.headers.eq(0).attr("tabIndex", 0);
				} else {
					this.active.attr({
						"aria-selected": "true",
						"aria-expanded": "true",
						tabIndex: 0
					}).next().attr({
						"aria-hidden": "false"
					});
				}

				this._createIcons();

				this._setupEvents(options.event);

				if (heightStyle === "fill") {
					maxHeight = parent.height();
					this.element.siblings(":visible").each(function () {
						var elem = $(this),
						    position = elem.css("position");

						if (position === "absolute" || position === "fixed") {
							return;
						}
						maxHeight -= elem.outerHeight(true);
					});

					this.headers.each(function () {
						maxHeight -= $(this).outerHeight(true);
					});

					this.headers.next().each(function () {
						$(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
					}).css("overflow", "auto");
				} else if (heightStyle === "auto") {
					maxHeight = 0;
					this.headers.next().each(function () {
						var isVisible = $(this).is(":visible");
						if (!isVisible) {
							$(this).show();
						}
						maxHeight = Math.max(maxHeight, $(this).css("height", "").height());
						if (!isVisible) {
							$(this).hide();
						}
					}).height(maxHeight);
				}
			},

			_activate: function _activate(index) {
				var active = this._findActive(index)[0];

				if (active === this.active[0]) {
					return;
				}

				active = active || this.active[0];

				this._eventHandler({
					target: active,
					currentTarget: active,
					preventDefault: $.noop
				});
			},

			_findActive: function _findActive(selector) {
				return typeof selector === "number" ? this.headers.eq(selector) : $();
			},

			_setupEvents: function _setupEvents(event) {
				var events = {
					keydown: "_keydown"
				};
				if (event) {
					$.each(event.split(" "), function (index, eventName) {
						events[eventName] = "_eventHandler";
					});
				}

				this._off(this.headers.add(this.headers.next()));
				this._on(this.headers, events);
				this._on(this.headers.next(), { keydown: "_panelKeyDown" });
				this._hoverable(this.headers);
				this._focusable(this.headers);
			},

			_eventHandler: function _eventHandler(event) {
				var activeChildren,
				    clickedChildren,
				    options = this.options,
				    active = this.active,
				    clicked = $(event.currentTarget),
				    clickedIsActive = clicked[0] === active[0],
				    collapsing = clickedIsActive && options.collapsible,
				    toShow = collapsing ? $() : clicked.next(),
				    toHide = active.next(),
				    eventData = {
					oldHeader: active,
					oldPanel: toHide,
					newHeader: collapsing ? $() : clicked,
					newPanel: toShow
				};

				event.preventDefault();

				if (clickedIsActive && !options.collapsible || this._trigger("beforeActivate", event, eventData) === false) {
					return;
				}

				options.active = collapsing ? false : this.headers.index(clicked);

				this.active = clickedIsActive ? $() : clicked;
				this._toggle(eventData);

				this._removeClass(active, "ui-accordion-header-active", "ui-state-active");
				if (options.icons) {
					activeChildren = active.children(".ui-accordion-header-icon");
					this._removeClass(activeChildren, null, options.icons.activeHeader)._addClass(activeChildren, null, options.icons.header);
				}

				if (!clickedIsActive) {
					this._removeClass(clicked, "ui-accordion-header-collapsed")._addClass(clicked, "ui-accordion-header-active", "ui-state-active");
					if (options.icons) {
						clickedChildren = clicked.children(".ui-accordion-header-icon");
						this._removeClass(clickedChildren, null, options.icons.header)._addClass(clickedChildren, null, options.icons.activeHeader);
					}

					this._addClass(clicked.next(), "ui-accordion-content-active");
				}
			},

			_toggle: function _toggle(data) {
				var toShow = data.newPanel,
				    toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

				this.prevShow.add(this.prevHide).stop(true, true);
				this.prevShow = toShow;
				this.prevHide = toHide;

				if (this.options.animate) {
					this._animate(toShow, toHide, data);
				} else {
					toHide.hide();
					toShow.show();
					this._toggleComplete(data);
				}

				toHide.attr({
					"aria-hidden": "true"
				});
				toHide.prev().attr({
					"aria-selected": "false",
					"aria-expanded": "false"
				});

				if (toShow.length && toHide.length) {
					toHide.prev().attr({
						"tabIndex": -1,
						"aria-expanded": "false"
					});
				} else if (toShow.length) {
					this.headers.filter(function () {
						return parseInt($(this).attr("tabIndex"), 10) === 0;
					}).attr("tabIndex", -1);
				}

				toShow.attr("aria-hidden", "false").prev().attr({
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				});
			},

			_animate: function _animate(toShow, toHide, data) {
				var total,
				    easing,
				    duration,
				    that = this,
				    adjust = 0,
				    boxSizing = toShow.css("box-sizing"),
				    down = toShow.length && (!toHide.length || toShow.index() < toHide.index()),
				    animate = this.options.animate || {},
				    options = down && animate.down || animate,
				    complete = function complete() {
					that._toggleComplete(data);
				};

				if (typeof options === "number") {
					duration = options;
				}
				if (typeof options === "string") {
					easing = options;
				}

				easing = easing || options.easing || animate.easing;
				duration = duration || options.duration || animate.duration;

				if (!toHide.length) {
					return toShow.animate(this.showProps, duration, easing, complete);
				}
				if (!toShow.length) {
					return toHide.animate(this.hideProps, duration, easing, complete);
				}

				total = toShow.show().outerHeight();
				toHide.animate(this.hideProps, {
					duration: duration,
					easing: easing,
					step: function step(now, fx) {
						fx.now = Math.round(now);
					}
				});
				toShow.hide().animate(this.showProps, {
					duration: duration,
					easing: easing,
					complete: complete,
					step: function step(now, fx) {
						fx.now = Math.round(now);
						if (fx.prop !== "height") {
							if (boxSizing === "content-box") {
								adjust += fx.now;
							}
						} else if (that.options.heightStyle !== "content") {
							fx.now = Math.round(total - toHide.outerHeight() - adjust);
							adjust = 0;
						}
					}
				});
			},

			_toggleComplete: function _toggleComplete(data) {
				var toHide = data.oldPanel,
				    prev = toHide.prev();

				this._removeClass(toHide, "ui-accordion-content-active");
				this._removeClass(prev, "ui-accordion-header-active")._addClass(prev, "ui-accordion-header-collapsed");

				if (toHide.length) {
					toHide.parent()[0].className = toHide.parent()[0].className;
				}
				this._trigger("activate", null, data);
			}
		});

		var safeActiveElement = $.ui.safeActiveElement = function (document) {
			var activeElement;

			try {
				activeElement = document.activeElement;
			} catch (error) {
				activeElement = document.body;
			}

			if (!activeElement) {
				activeElement = document.body;
			}

			if (!activeElement.nodeName) {
				activeElement = document.body;
			}

			return activeElement;
		};

		var widgetsMenu = $.widget("ui.menu", {
			version: "1.12.1",
			defaultElement: "<ul>",
			delay: 300,
			options: {
				icons: {
					submenu: "ui-icon-caret-1-e"
				},
				items: "> *",
				menus: "ul",
				position: {
					my: "left top",
					at: "right top"
				},
				role: "menu",

				blur: null,
				focus: null,
				select: null
			},

			_create: function _create() {
				this.activeMenu = this.element;

				this.mouseHandled = false;
				this.element.uniqueId().attr({
					role: this.options.role,
					tabIndex: 0
				});

				this._addClass("ui-menu", "ui-widget ui-widget-content");
				this._on({
					"mousedown .ui-menu-item": function mousedownUiMenuItem(event) {
						event.preventDefault();
					},
					"click .ui-menu-item": function clickUiMenuItem(event) {
						var target = $(event.target);
						var active = $($.ui.safeActiveElement(this.document[0]));
						if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
							this.select(event);

							if (!event.isPropagationStopped()) {
								this.mouseHandled = true;
							}

							if (target.has(".ui-menu").length) {
								this.expand(event);
							} else if (!this.element.is(":focus") && active.closest(".ui-menu").length) {
								this.element.trigger("focus", [true]);

								if (this.active && this.active.parents(".ui-menu").length === 1) {
									clearTimeout(this.timer);
								}
							}
						}
					},
					"mouseenter .ui-menu-item": function mouseenterUiMenuItem(event) {
						if (this.previousFilter) {
							return;
						}

						var actualTarget = $(event.target).closest(".ui-menu-item"),
						    target = $(event.currentTarget);

						if (actualTarget[0] !== target[0]) {
							return;
						}

						this._removeClass(target.siblings().children(".ui-state-active"), null, "ui-state-active");
						this.focus(event, target);
					},
					mouseleave: "collapseAll",
					"mouseleave .ui-menu": "collapseAll",
					focus: function focus(event, keepActiveItem) {
						var item = this.active || this.element.find(this.options.items).eq(0);

						if (!keepActiveItem) {
							this.focus(event, item);
						}
					},
					blur: function blur(event) {
						this._delay(function () {
							var notContained = !$.contains(this.element[0], $.ui.safeActiveElement(this.document[0]));
							if (notContained) {
								this.collapseAll(event);
							}
						});
					},
					keydown: "_keydown"
				});

				this.refresh();

				this._on(this.document, {
					click: function click(event) {
						if (this._closeOnDocumentClick(event)) {
							this.collapseAll(event);
						}

						this.mouseHandled = false;
					}
				});
			},

			_destroy: function _destroy() {
				var items = this.element.find(".ui-menu-item").removeAttr("role aria-disabled"),
				    submenus = items.children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");

				this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled " + "tabIndex").removeUniqueId().show();

				submenus.children().each(function () {
					var elem = $(this);
					if (elem.data("ui-menu-submenu-caret")) {
						elem.remove();
					}
				});
			},

			_keydown: function _keydown(event) {
				var match,
				    prev,
				    character,
				    skip,
				    preventDefault = true;

				switch (event.keyCode) {
					case $.ui.keyCode.PAGE_UP:
						this.previousPage(event);
						break;
					case $.ui.keyCode.PAGE_DOWN:
						this.nextPage(event);
						break;
					case $.ui.keyCode.HOME:
						this._move("first", "first", event);
						break;
					case $.ui.keyCode.END:
						this._move("last", "last", event);
						break;
					case $.ui.keyCode.UP:
						this.previous(event);
						break;
					case $.ui.keyCode.DOWN:
						this.next(event);
						break;
					case $.ui.keyCode.LEFT:
						this.collapse(event);
						break;
					case $.ui.keyCode.RIGHT:
						if (this.active && !this.active.is(".ui-state-disabled")) {
							this.expand(event);
						}
						break;
					case $.ui.keyCode.ENTER:
					case $.ui.keyCode.SPACE:
						this._activate(event);
						break;
					case $.ui.keyCode.ESCAPE:
						this.collapse(event);
						break;
					default:
						preventDefault = false;
						prev = this.previousFilter || "";
						skip = false;

						character = event.keyCode >= 96 && event.keyCode <= 105 ? (event.keyCode - 96).toString() : String.fromCharCode(event.keyCode);

						clearTimeout(this.filterTimer);

						if (character === prev) {
							skip = true;
						} else {
							character = prev + character;
						}

						match = this._filterMenuItems(character);
						match = skip && match.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : match;

						if (!match.length) {
							character = String.fromCharCode(event.keyCode);
							match = this._filterMenuItems(character);
						}

						if (match.length) {
							this.focus(event, match);
							this.previousFilter = character;
							this.filterTimer = this._delay(function () {
								delete this.previousFilter;
							}, 1000);
						} else {
							delete this.previousFilter;
						}
				}

				if (preventDefault) {
					event.preventDefault();
				}
			},

			_activate: function _activate(event) {
				if (this.active && !this.active.is(".ui-state-disabled")) {
					if (this.active.children("[aria-haspopup='true']").length) {
						this.expand(event);
					} else {
						this.select(event);
					}
				}
			},

			refresh: function refresh() {
				var menus,
				    items,
				    newSubmenus,
				    newItems,
				    newWrappers,
				    that = this,
				    icon = this.options.icons.submenu,
				    submenus = this.element.find(this.options.menus);

				this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length);

				newSubmenus = submenus.filter(":not(.ui-menu)").hide().attr({
					role: this.options.role,
					"aria-hidden": "true",
					"aria-expanded": "false"
				}).each(function () {
					var menu = $(this),
					    item = menu.prev(),
					    submenuCaret = $("<span>").data("ui-menu-submenu-caret", true);

					that._addClass(submenuCaret, "ui-menu-icon", "ui-icon " + icon);
					item.attr("aria-haspopup", "true").prepend(submenuCaret);
					menu.attr("aria-labelledby", item.attr("id"));
				});

				this._addClass(newSubmenus, "ui-menu", "ui-widget ui-widget-content ui-front");

				menus = submenus.add(this.element);
				items = menus.find(this.options.items);

				items.not(".ui-menu-item").each(function () {
					var item = $(this);
					if (that._isDivider(item)) {
						that._addClass(item, "ui-menu-divider", "ui-widget-content");
					}
				});

				newItems = items.not(".ui-menu-item, .ui-menu-divider");
				newWrappers = newItems.children().not(".ui-menu").uniqueId().attr({
					tabIndex: -1,
					role: this._itemRole()
				});
				this._addClass(newItems, "ui-menu-item")._addClass(newWrappers, "ui-menu-item-wrapper");

				items.filter(".ui-state-disabled").attr("aria-disabled", "true");

				if (this.active && !$.contains(this.element[0], this.active[0])) {
					this.blur();
				}
			},

			_itemRole: function _itemRole() {
				return {
					menu: "menuitem",
					listbox: "option"
				}[this.options.role];
			},

			_setOption: function _setOption(key, value) {
				if (key === "icons") {
					var icons = this.element.find(".ui-menu-icon");
					this._removeClass(icons, null, this.options.icons.submenu)._addClass(icons, null, value.submenu);
				}
				this._super(key, value);
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this.element.attr("aria-disabled", String(value));
				this._toggleClass(null, "ui-state-disabled", !!value);
			},

			focus: function focus(event, item) {
				var nested, focused, activeParent;
				this.blur(event, event && event.type === "focus");

				this._scrollIntoView(item);

				this.active = item.first();

				focused = this.active.children(".ui-menu-item-wrapper");
				this._addClass(focused, null, "ui-state-active");

				if (this.options.role) {
					this.element.attr("aria-activedescendant", focused.attr("id"));
				}

				activeParent = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper");
				this._addClass(activeParent, null, "ui-state-active");

				if (event && event.type === "keydown") {
					this._close();
				} else {
					this.timer = this._delay(function () {
						this._close();
					}, this.delay);
				}

				nested = item.children(".ui-menu");
				if (nested.length && event && /^mouse/.test(event.type)) {
					this._startOpening(nested);
				}
				this.activeMenu = item.parent();

				this._trigger("focus", event, { item: item });
			},

			_scrollIntoView: function _scrollIntoView(item) {
				var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
				if (this._hasScroll()) {
					borderTop = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
					paddingTop = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
					offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
					scroll = this.activeMenu.scrollTop();
					elementHeight = this.activeMenu.height();
					itemHeight = item.outerHeight();

					if (offset < 0) {
						this.activeMenu.scrollTop(scroll + offset);
					} else if (offset + itemHeight > elementHeight) {
						this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight);
					}
				}
			},

			blur: function blur(event, fromFocus) {
				if (!fromFocus) {
					clearTimeout(this.timer);
				}

				if (!this.active) {
					return;
				}

				this._removeClass(this.active.children(".ui-menu-item-wrapper"), null, "ui-state-active");

				this._trigger("blur", event, { item: this.active });
				this.active = null;
			},

			_startOpening: function _startOpening(submenu) {
				clearTimeout(this.timer);

				if (submenu.attr("aria-hidden") !== "true") {
					return;
				}

				this.timer = this._delay(function () {
					this._close();
					this._open(submenu);
				}, this.delay);
			},

			_open: function _open(submenu) {
				var position = $.extend({
					of: this.active
				}, this.options.position);

				clearTimeout(this.timer);
				this.element.find(".ui-menu").not(submenu.parents(".ui-menu")).hide().attr("aria-hidden", "true");

				submenu.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(position);
			},

			collapseAll: function collapseAll(event, all) {
				clearTimeout(this.timer);
				this.timer = this._delay(function () {
					var currentMenu = all ? this.element : $(event && event.target).closest(this.element.find(".ui-menu"));

					if (!currentMenu.length) {
						currentMenu = this.element;
					}

					this._close(currentMenu);

					this.blur(event);

					this._removeClass(currentMenu.find(".ui-state-active"), null, "ui-state-active");

					this.activeMenu = currentMenu;
				}, this.delay);
			},

			_close: function _close(startMenu) {
				if (!startMenu) {
					startMenu = this.active ? this.active.parent() : this.element;
				}

				startMenu.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false");
			},

			_closeOnDocumentClick: function _closeOnDocumentClick(event) {
				return !$(event.target).closest(".ui-menu").length;
			},

			_isDivider: function _isDivider(item) {
				return !/[^\-\u2014\u2013\s]/.test(item.text());
			},

			collapse: function collapse(event) {
				var newItem = this.active && this.active.parent().closest(".ui-menu-item", this.element);
				if (newItem && newItem.length) {
					this._close();
					this.focus(event, newItem);
				}
			},

			expand: function expand(event) {
				var newItem = this.active && this.active.children(".ui-menu ").find(this.options.items).first();

				if (newItem && newItem.length) {
					this._open(newItem.parent());

					this._delay(function () {
						this.focus(event, newItem);
					});
				}
			},

			next: function next(event) {
				this._move("next", "first", event);
			},

			previous: function previous(event) {
				this._move("prev", "last", event);
			},

			isFirstItem: function isFirstItem() {
				return this.active && !this.active.prevAll(".ui-menu-item").length;
			},

			isLastItem: function isLastItem() {
				return this.active && !this.active.nextAll(".ui-menu-item").length;
			},

			_move: function _move(direction, filter, event) {
				var next;
				if (this.active) {
					if (direction === "first" || direction === "last") {
						next = this.active[direction === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1);
					} else {
						next = this.active[direction + "All"](".ui-menu-item").eq(0);
					}
				}
				if (!next || !next.length || !this.active) {
					next = this.activeMenu.find(this.options.items)[filter]();
				}

				this.focus(event, next);
			},

			nextPage: function nextPage(event) {
				var item, base, height;

				if (!this.active) {
					this.next(event);
					return;
				}
				if (this.isLastItem()) {
					return;
				}
				if (this._hasScroll()) {
					base = this.active.offset().top;
					height = this.element.height();
					this.active.nextAll(".ui-menu-item").each(function () {
						item = $(this);
						return item.offset().top - base - height < 0;
					});

					this.focus(event, item);
				} else {
					this.focus(event, this.activeMenu.find(this.options.items)[!this.active ? "first" : "last"]());
				}
			},

			previousPage: function previousPage(event) {
				var item, base, height;
				if (!this.active) {
					this.next(event);
					return;
				}
				if (this.isFirstItem()) {
					return;
				}
				if (this._hasScroll()) {
					base = this.active.offset().top;
					height = this.element.height();
					this.active.prevAll(".ui-menu-item").each(function () {
						item = $(this);
						return item.offset().top - base + height > 0;
					});

					this.focus(event, item);
				} else {
					this.focus(event, this.activeMenu.find(this.options.items).first());
				}
			},

			_hasScroll: function _hasScroll() {
				return this.element.outerHeight() < this.element.prop("scrollHeight");
			},

			select: function select(event) {
				this.active = this.active || $(event.target).closest(".ui-menu-item");
				var ui = { item: this.active };
				if (!this.active.has(".ui-menu").length) {
					this.collapseAll(event, true);
				}
				this._trigger("select", event, ui);
			},

			_filterMenuItems: function _filterMenuItems(character) {
				var escapedCharacter = character.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
				    regex = new RegExp("^" + escapedCharacter, "i");

				return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function () {
					return regex.test($.trim($(this).children(".ui-menu-item-wrapper").text()));
				});
			}
		});

		$.widget("ui.autocomplete", {
			version: "1.12.1",
			defaultElement: "<input>",
			options: {
				appendTo: null,
				autoFocus: false,
				delay: 300,
				minLength: 1,
				position: {
					my: "left top",
					at: "left bottom",
					collision: "none"
				},
				source: null,

				change: null,
				close: null,
				focus: null,
				open: null,
				response: null,
				search: null,
				select: null
			},

			requestIndex: 0,
			pending: 0,

			_create: function _create() {
				var suppressKeyPress,
				    suppressKeyPressRepeat,
				    suppressInput,
				    nodeName = this.element[0].nodeName.toLowerCase(),
				    isTextarea = nodeName === "textarea",
				    isInput = nodeName === "input";

				this.isMultiLine = isTextarea || !isInput && this._isContentEditable(this.element);

				this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"];
				this.isNewMenu = true;

				this._addClass("ui-autocomplete-input");
				this.element.attr("autocomplete", "off");

				this._on(this.element, {
					keydown: function keydown(event) {
						if (this.element.prop("readOnly")) {
							suppressKeyPress = true;
							suppressInput = true;
							suppressKeyPressRepeat = true;
							return;
						}

						suppressKeyPress = false;
						suppressInput = false;
						suppressKeyPressRepeat = false;
						var keyCode = $.ui.keyCode;
						switch (event.keyCode) {
							case keyCode.PAGE_UP:
								suppressKeyPress = true;
								this._move("previousPage", event);
								break;
							case keyCode.PAGE_DOWN:
								suppressKeyPress = true;
								this._move("nextPage", event);
								break;
							case keyCode.UP:
								suppressKeyPress = true;
								this._keyEvent("previous", event);
								break;
							case keyCode.DOWN:
								suppressKeyPress = true;
								this._keyEvent("next", event);
								break;
							case keyCode.ENTER:
								if (this.menu.active) {
									suppressKeyPress = true;
									event.preventDefault();
									this.menu.select(event);
								}
								break;
							case keyCode.TAB:
								if (this.menu.active) {
									this.menu.select(event);
								}
								break;
							case keyCode.ESCAPE:
								if (this.menu.element.is(":visible")) {
									if (!this.isMultiLine) {
										this._value(this.term);
									}
									this.close(event);

									event.preventDefault();
								}
								break;
							default:
								suppressKeyPressRepeat = true;

								this._searchTimeout(event);
								break;
						}
					},
					keypress: function keypress(event) {
						if (suppressKeyPress) {
							suppressKeyPress = false;
							if (!this.isMultiLine || this.menu.element.is(":visible")) {
								event.preventDefault();
							}
							return;
						}
						if (suppressKeyPressRepeat) {
							return;
						}

						var keyCode = $.ui.keyCode;
						switch (event.keyCode) {
							case keyCode.PAGE_UP:
								this._move("previousPage", event);
								break;
							case keyCode.PAGE_DOWN:
								this._move("nextPage", event);
								break;
							case keyCode.UP:
								this._keyEvent("previous", event);
								break;
							case keyCode.DOWN:
								this._keyEvent("next", event);
								break;
						}
					},
					input: function input(event) {
						if (suppressInput) {
							suppressInput = false;
							event.preventDefault();
							return;
						}
						this._searchTimeout(event);
					},
					focus: function focus() {
						this.selectedItem = null;
						this.previous = this._value();
					},
					blur: function blur(event) {
						if (this.cancelBlur) {
							delete this.cancelBlur;
							return;
						}

						clearTimeout(this.searching);
						this.close(event);
						this._change(event);
					}
				});

				this._initSource();
				this.menu = $("<ul>").appendTo(this._appendTo()).menu({
					role: null
				}).hide().menu("instance");

				this._addClass(this.menu.element, "ui-autocomplete", "ui-front");
				this._on(this.menu.element, {
					mousedown: function mousedown(event) {
						event.preventDefault();

						this.cancelBlur = true;
						this._delay(function () {
							delete this.cancelBlur;

							if (this.element[0] !== $.ui.safeActiveElement(this.document[0])) {
								this.element.trigger("focus");
							}
						});
					},
					menufocus: function menufocus(event, ui) {
						var label, item;

						if (this.isNewMenu) {
							this.isNewMenu = false;
							if (event.originalEvent && /^mouse/.test(event.originalEvent.type)) {
								this.menu.blur();

								this.document.one("mousemove", function () {
									$(event.target).trigger(event.originalEvent);
								});

								return;
							}
						}

						item = ui.item.data("ui-autocomplete-item");
						if (false !== this._trigger("focus", event, { item: item })) {
							if (event.originalEvent && /^key/.test(event.originalEvent.type)) {
								this._value(item.value);
							}
						}

						label = ui.item.attr("aria-label") || item.value;
						if (label && $.trim(label).length) {
							this.liveRegion.children().hide();
							$("<div>").text(label).appendTo(this.liveRegion);
						}
					},
					menuselect: function menuselect(event, ui) {
						var item = ui.item.data("ui-autocomplete-item"),
						    previous = this.previous;

						if (this.element[0] !== $.ui.safeActiveElement(this.document[0])) {
							this.element.trigger("focus");
							this.previous = previous;

							this._delay(function () {
								this.previous = previous;
								this.selectedItem = item;
							});
						}

						if (false !== this._trigger("select", event, { item: item })) {
							this._value(item.value);
						}

						this.term = this._value();

						this.close(event);
						this.selectedItem = item;
					}
				});

				this.liveRegion = $("<div>", {
					role: "status",
					"aria-live": "assertive",
					"aria-relevant": "additions"
				}).appendTo(this.document[0].body);

				this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible");

				this._on(this.window, {
					beforeunload: function beforeunload() {
						this.element.removeAttr("autocomplete");
					}
				});
			},

			_destroy: function _destroy() {
				clearTimeout(this.searching);
				this.element.removeAttr("autocomplete");
				this.menu.element.remove();
				this.liveRegion.remove();
			},

			_setOption: function _setOption(key, value) {
				this._super(key, value);
				if (key === "source") {
					this._initSource();
				}
				if (key === "appendTo") {
					this.menu.element.appendTo(this._appendTo());
				}
				if (key === "disabled" && value && this.xhr) {
					this.xhr.abort();
				}
			},

			_isEventTargetInWidget: function _isEventTargetInWidget(event) {
				var menuElement = this.menu.element[0];

				return event.target === this.element[0] || event.target === menuElement || $.contains(menuElement, event.target);
			},

			_closeOnClickOutside: function _closeOnClickOutside(event) {
				if (!this._isEventTargetInWidget(event)) {
					this.close();
				}
			},

			_appendTo: function _appendTo() {
				var element = this.options.appendTo;

				if (element) {
					element = element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0);
				}

				if (!element || !element[0]) {
					element = this.element.closest(".ui-front, dialog");
				}

				if (!element.length) {
					element = this.document[0].body;
				}

				return element;
			},

			_initSource: function _initSource() {
				var array,
				    url,
				    that = this;
				if ($.isArray(this.options.source)) {
					array = this.options.source;
					this.source = function (request, response) {
						response($.ui.autocomplete.filter(array, request.term));
					};
				} else if (typeof this.options.source === "string") {
					url = this.options.source;
					this.source = function (request, response) {
						if (that.xhr) {
							that.xhr.abort();
						}
						that.xhr = $.ajax({
							url: url,
							data: request,
							dataType: "json",
							success: function success(data) {
								response(data);
							},
							error: function error() {
								response([]);
							}
						});
					};
				} else {
					this.source = this.options.source;
				}
			},

			_searchTimeout: function _searchTimeout(event) {
				clearTimeout(this.searching);
				this.searching = this._delay(function () {
					var equalValues = this.term === this._value(),
					    menuVisible = this.menu.element.is(":visible"),
					    modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

					if (!equalValues || equalValues && !menuVisible && !modifierKey) {
						this.selectedItem = null;
						this.search(null, event);
					}
				}, this.options.delay);
			},

			search: function search(value, event) {
				value = value != null ? value : this._value();

				this.term = this._value();

				if (value.length < this.options.minLength) {
					return this.close(event);
				}

				if (this._trigger("search", event) === false) {
					return;
				}

				return this._search(value);
			},

			_search: function _search(value) {
				this.pending++;
				this._addClass("ui-autocomplete-loading");
				this.cancelSearch = false;

				this.source({ term: value }, this._response());
			},

			_response: function _response() {
				var index = ++this.requestIndex;

				return $.proxy(function (content) {
					if (index === this.requestIndex) {
						this.__response(content);
					}

					this.pending--;
					if (!this.pending) {
						this._removeClass("ui-autocomplete-loading");
					}
				}, this);
			},

			__response: function __response(content) {
				if (content) {
					content = this._normalize(content);
				}
				this._trigger("response", null, { content: content });
				if (!this.options.disabled && content && content.length && !this.cancelSearch) {
					this._suggest(content);
					this._trigger("open");
				} else {
					this._close();
				}
			},

			close: function close(event) {
				this.cancelSearch = true;
				this._close(event);
			},

			_close: function _close(event) {
				this._off(this.document, "mousedown");

				if (this.menu.element.is(":visible")) {
					this.menu.element.hide();
					this.menu.blur();
					this.isNewMenu = true;
					this._trigger("close", event);
				}
			},

			_change: function _change(event) {
				if (this.previous !== this._value()) {
					this._trigger("change", event, { item: this.selectedItem });
				}
			},

			_normalize: function _normalize(items) {
				if (items.length && items[0].label && items[0].value) {
					return items;
				}
				return $.map(items, function (item) {
					if (typeof item === "string") {
						return {
							label: item,
							value: item
						};
					}
					return $.extend({}, item, {
						label: item.label || item.value,
						value: item.value || item.label
					});
				});
			},

			_suggest: function _suggest(items) {
				var ul = this.menu.element.empty();
				this._renderMenu(ul, items);
				this.isNewMenu = true;
				this.menu.refresh();

				ul.show();
				this._resizeMenu();
				ul.position($.extend({
					of: this.element
				}, this.options.position));

				if (this.options.autoFocus) {
					this.menu.next();
				}

				this._on(this.document, {
					mousedown: "_closeOnClickOutside"
				});
			},

			_resizeMenu: function _resizeMenu() {
				var ul = this.menu.element;
				ul.outerWidth(Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth()));
			},

			_renderMenu: function _renderMenu(ul, items) {
				var that = this;
				$.each(items, function (index, item) {
					that._renderItemData(ul, item);
				});
			},

			_renderItemData: function _renderItemData(ul, item) {
				return this._renderItem(ul, item).data("ui-autocomplete-item", item);
			},

			_renderItem: function _renderItem(ul, item) {
				return $("<li>").append($("<div>").text(item.label)).appendTo(ul);
			},

			_move: function _move(direction, event) {
				if (!this.menu.element.is(":visible")) {
					this.search(null, event);
					return;
				}
				if (this.menu.isFirstItem() && /^previous/.test(direction) || this.menu.isLastItem() && /^next/.test(direction)) {

					if (!this.isMultiLine) {
						this._value(this.term);
					}

					this.menu.blur();
					return;
				}
				this.menu[direction](event);
			},

			widget: function widget() {
				return this.menu.element;
			},

			_value: function _value() {
				return this.valueMethod.apply(this.element, arguments);
			},

			_keyEvent: function _keyEvent(keyEvent, event) {
				if (!this.isMultiLine || this.menu.element.is(":visible")) {
					this._move(keyEvent, event);

					event.preventDefault();
				}
			},

			_isContentEditable: function _isContentEditable(element) {
				if (!element.length) {
					return false;
				}

				var editable = element.prop("contentEditable");

				if (editable === "inherit") {
					return this._isContentEditable(element.parent());
				}

				return editable === "true";
			}
		});

		$.extend($.ui.autocomplete, {
			escapeRegex: function escapeRegex(value) {
				return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
			},
			filter: function filter(array, term) {
				var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
				return $.grep(array, function (value) {
					return matcher.test(value.label || value.value || value);
				});
			}
		});

		$.widget("ui.autocomplete", $.ui.autocomplete, {
			options: {
				messages: {
					noResults: "No search results.",
					results: function results(amount) {
						return amount + (amount > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
					}
				}
			},

			__response: function __response(content) {
				var message;
				this._superApply(arguments);
				if (this.options.disabled || this.cancelSearch) {
					return;
				}
				if (content && content.length) {
					message = this.options.messages.results(content.length);
				} else {
					message = this.options.messages.noResults;
				}
				this.liveRegion.children().hide();
				$("<div>").text(message).appendTo(this.liveRegion);
			}
		});

		var widgetsAutocomplete = $.ui.autocomplete;

		var controlgroupCornerRegex = /ui-corner-([a-z]){2,6}/g;

		var widgetsControlgroup = $.widget("ui.controlgroup", {
			version: "1.12.1",
			defaultElement: "<div>",
			options: {
				direction: "horizontal",
				disabled: null,
				onlyVisible: true,
				items: {
					"button": "input[type=button], input[type=submit], input[type=reset], button, a",
					"controlgroupLabel": ".ui-controlgroup-label",
					"checkboxradio": "input[type='checkbox'], input[type='radio']",
					"selectmenu": "select",
					"spinner": ".ui-spinner-input"
				}
			},

			_create: function _create() {
				this._enhance();
			},

			_enhance: function _enhance() {
				this.element.attr("role", "toolbar");
				this.refresh();
			},

			_destroy: function _destroy() {
				this._callChildMethod("destroy");
				this.childWidgets.removeData("ui-controlgroup-data");
				this.element.removeAttr("role");
				if (this.options.items.controlgroupLabel) {
					this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap();
				}
			},

			_initWidgets: function _initWidgets() {
				var that = this,
				    childWidgets = [];

				$.each(this.options.items, function (widget, selector) {
					var labels;
					var options = {};

					if (!selector) {
						return;
					}

					if (widget === "controlgroupLabel") {
						labels = that.element.find(selector);
						labels.each(function () {
							var element = $(this);

							if (element.children(".ui-controlgroup-label-contents").length) {
								return;
							}
							element.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>");
						});
						that._addClass(labels, null, "ui-widget ui-widget-content ui-state-default");
						childWidgets = childWidgets.concat(labels.get());
						return;
					}

					if (!$.fn[widget]) {
						return;
					}

					if (that["_" + widget + "Options"]) {
						options = that["_" + widget + "Options"]("middle");
					} else {
						options = { classes: {} };
					}

					that.element.find(selector).each(function () {
						var element = $(this);
						var instance = element[widget]("instance");

						var instanceOptions = $.widget.extend({}, options);

						if (widget === "button" && element.parent(".ui-spinner").length) {
							return;
						}

						if (!instance) {
							instance = element[widget]()[widget]("instance");
						}
						if (instance) {
							instanceOptions.classes = that._resolveClassesValues(instanceOptions.classes, instance);
						}
						element[widget](instanceOptions);

						var widgetElement = element[widget]("widget");
						$.data(widgetElement[0], "ui-controlgroup-data", instance ? instance : element[widget]("instance"));

						childWidgets.push(widgetElement[0]);
					});
				});

				this.childWidgets = $($.unique(childWidgets));
				this._addClass(this.childWidgets, "ui-controlgroup-item");
			},

			_callChildMethod: function _callChildMethod(method) {
				this.childWidgets.each(function () {
					var element = $(this),
					    data = element.data("ui-controlgroup-data");
					if (data && data[method]) {
						data[method]();
					}
				});
			},

			_updateCornerClass: function _updateCornerClass(element, position) {
				var remove = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all";
				var add = this._buildSimpleOptions(position, "label").classes.label;

				this._removeClass(element, null, remove);
				this._addClass(element, null, add);
			},

			_buildSimpleOptions: function _buildSimpleOptions(position, key) {
				var direction = this.options.direction === "vertical";
				var result = {
					classes: {}
				};
				result.classes[key] = {
					"middle": "",
					"first": "ui-corner-" + (direction ? "top" : "left"),
					"last": "ui-corner-" + (direction ? "bottom" : "right"),
					"only": "ui-corner-all"
				}[position];

				return result;
			},

			_spinnerOptions: function _spinnerOptions(position) {
				var options = this._buildSimpleOptions(position, "ui-spinner");

				options.classes["ui-spinner-up"] = "";
				options.classes["ui-spinner-down"] = "";

				return options;
			},

			_buttonOptions: function _buttonOptions(position) {
				return this._buildSimpleOptions(position, "ui-button");
			},

			_checkboxradioOptions: function _checkboxradioOptions(position) {
				return this._buildSimpleOptions(position, "ui-checkboxradio-label");
			},

			_selectmenuOptions: function _selectmenuOptions(position) {
				var direction = this.options.direction === "vertical";
				return {
					width: direction ? "auto" : false,
					classes: {
						middle: {
							"ui-selectmenu-button-open": "",
							"ui-selectmenu-button-closed": ""
						},
						first: {
							"ui-selectmenu-button-open": "ui-corner-" + (direction ? "top" : "tl"),
							"ui-selectmenu-button-closed": "ui-corner-" + (direction ? "top" : "left")
						},
						last: {
							"ui-selectmenu-button-open": direction ? "" : "ui-corner-tr",
							"ui-selectmenu-button-closed": "ui-corner-" + (direction ? "bottom" : "right")
						},
						only: {
							"ui-selectmenu-button-open": "ui-corner-top",
							"ui-selectmenu-button-closed": "ui-corner-all"
						}

					}[position]
				};
			},

			_resolveClassesValues: function _resolveClassesValues(classes, instance) {
				var result = {};
				$.each(classes, function (key) {
					var current = instance.options.classes[key] || "";
					current = $.trim(current.replace(controlgroupCornerRegex, ""));
					result[key] = (current + " " + classes[key]).replace(/\s+/g, " ");
				});
				return result;
			},

			_setOption: function _setOption(key, value) {
				if (key === "direction") {
					this._removeClass("ui-controlgroup-" + this.options.direction);
				}

				this._super(key, value);
				if (key === "disabled") {
					this._callChildMethod(value ? "disable" : "enable");
					return;
				}

				this.refresh();
			},

			refresh: function refresh() {
				var children,
				    that = this;

				this._addClass("ui-controlgroup ui-controlgroup-" + this.options.direction);

				if (this.options.direction === "horizontal") {
					this._addClass(null, "ui-helper-clearfix");
				}
				this._initWidgets();

				children = this.childWidgets;

				if (this.options.onlyVisible) {
					children = children.filter(":visible");
				}

				if (children.length) {
					$.each(["first", "last"], function (index, value) {
						var instance = children[value]().data("ui-controlgroup-data");

						if (instance && that["_" + instance.widgetName + "Options"]) {
							var options = that["_" + instance.widgetName + "Options"](children.length === 1 ? "only" : value);
							options.classes = that._resolveClassesValues(options.classes, instance);
							instance.element[instance.widgetName](options);
						} else {
							that._updateCornerClass(children[value](), value);
						}
					});

					this._callChildMethod("refresh");
				}
			}
		});

		$.widget("ui.checkboxradio", [$.ui.formResetMixin, {
			version: "1.12.1",
			options: {
				disabled: null,
				label: null,
				icon: true,
				classes: {
					"ui-checkboxradio-label": "ui-corner-all",
					"ui-checkboxradio-icon": "ui-corner-all"
				}
			},

			_getCreateOptions: function _getCreateOptions() {
				var disabled, labels;
				var that = this;
				var options = this._super() || {};

				this._readType();

				labels = this.element.labels();

				this.label = $(labels[labels.length - 1]);
				if (!this.label.length) {
					$.error("No label found for checkboxradio widget");
				}

				this.originalLabel = "";

				this.label.contents().not(this.element[0]).each(function () {
					that.originalLabel += this.nodeType === 3 ? $(this).text() : this.outerHTML;
				});

				if (this.originalLabel) {
					options.label = this.originalLabel;
				}

				disabled = this.element[0].disabled;
				if (disabled != null) {
					options.disabled = disabled;
				}
				return options;
			},

			_create: function _create() {
				var checked = this.element[0].checked;

				this._bindFormResetHandler();

				if (this.options.disabled == null) {
					this.options.disabled = this.element[0].disabled;
				}

				this._setOption("disabled", this.options.disabled);
				this._addClass("ui-checkboxradio", "ui-helper-hidden-accessible");
				this._addClass(this.label, "ui-checkboxradio-label", "ui-button ui-widget");

				if (this.type === "radio") {
					this._addClass(this.label, "ui-checkboxradio-radio-label");
				}

				if (this.options.label && this.options.label !== this.originalLabel) {
					this._updateLabel();
				} else if (this.originalLabel) {
					this.options.label = this.originalLabel;
				}

				this._enhance();

				if (checked) {
					this._addClass(this.label, "ui-checkboxradio-checked", "ui-state-active");
					if (this.icon) {
						this._addClass(this.icon, null, "ui-state-hover");
					}
				}

				this._on({
					change: "_toggleClasses",
					focus: function focus() {
						this._addClass(this.label, null, "ui-state-focus ui-visual-focus");
					},
					blur: function blur() {
						this._removeClass(this.label, null, "ui-state-focus ui-visual-focus");
					}
				});
			},

			_readType: function _readType() {
				var nodeName = this.element[0].nodeName.toLowerCase();
				this.type = this.element[0].type;
				if (nodeName !== "input" || !/radio|checkbox/.test(this.type)) {
					$.error("Can't create checkboxradio on element.nodeName=" + nodeName + " and element.type=" + this.type);
				}
			},

			_enhance: function _enhance() {
				this._updateIcon(this.element[0].checked);
			},

			widget: function widget() {
				return this.label;
			},

			_getRadioGroup: function _getRadioGroup() {
				var group;
				var name = this.element[0].name;
				var nameSelector = "input[name='" + $.ui.escapeSelector(name) + "']";

				if (!name) {
					return $([]);
				}

				if (this.form.length) {
					group = $(this.form[0].elements).filter(nameSelector);
				} else {
					group = $(nameSelector).filter(function () {
						return $(this).form().length === 0;
					});
				}

				return group.not(this.element);
			},

			_toggleClasses: function _toggleClasses() {
				var checked = this.element[0].checked;
				this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", checked);

				if (this.options.icon && this.type === "checkbox") {
					this._toggleClass(this.icon, null, "ui-icon-check ui-state-checked", checked)._toggleClass(this.icon, null, "ui-icon-blank", !checked);
				}

				if (this.type === "radio") {
					this._getRadioGroup().each(function () {
						var instance = $(this).checkboxradio("instance");

						if (instance) {
							instance._removeClass(instance.label, "ui-checkboxradio-checked", "ui-state-active");
						}
					});
				}
			},

			_destroy: function _destroy() {
				this._unbindFormResetHandler();

				if (this.icon) {
					this.icon.remove();
					this.iconSpace.remove();
				}
			},

			_setOption: function _setOption(key, value) {
				if (key === "label" && !value) {
					return;
				}

				this._super(key, value);

				if (key === "disabled") {
					this._toggleClass(this.label, null, "ui-state-disabled", value);
					this.element[0].disabled = value;

					return;
				}
				this.refresh();
			},

			_updateIcon: function _updateIcon(checked) {
				var toAdd = "ui-icon ui-icon-background ";

				if (this.options.icon) {
					if (!this.icon) {
						this.icon = $("<span>");
						this.iconSpace = $("<span> </span>");
						this._addClass(this.iconSpace, "ui-checkboxradio-icon-space");
					}

					if (this.type === "checkbox") {
						toAdd += checked ? "ui-icon-check ui-state-checked" : "ui-icon-blank";
						this._removeClass(this.icon, null, checked ? "ui-icon-blank" : "ui-icon-check");
					} else {
						toAdd += "ui-icon-blank";
					}
					this._addClass(this.icon, "ui-checkboxradio-icon", toAdd);
					if (!checked) {
						this._removeClass(this.icon, null, "ui-icon-check ui-state-checked");
					}
					this.icon.prependTo(this.label).after(this.iconSpace);
				} else if (this.icon !== undefined) {
					this.icon.remove();
					this.iconSpace.remove();
					delete this.icon;
				}
			},

			_updateLabel: function _updateLabel() {
				var contents = this.label.contents().not(this.element[0]);
				if (this.icon) {
					contents = contents.not(this.icon[0]);
				}
				if (this.iconSpace) {
					contents = contents.not(this.iconSpace[0]);
				}
				contents.remove();

				this.label.append(this.options.label);
			},

			refresh: function refresh() {
				var checked = this.element[0].checked,
				    isDisabled = this.element[0].disabled;

				this._updateIcon(checked);
				this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", checked);
				if (this.options.label !== null) {
					this._updateLabel();
				}

				if (isDisabled !== this.options.disabled) {
					this._setOptions({ "disabled": isDisabled });
				}
			}

		}]);

		var widgetsCheckboxradio = $.ui.checkboxradio;

		$.widget("ui.button", {
			version: "1.12.1",
			defaultElement: "<button>",
			options: {
				classes: {
					"ui-button": "ui-corner-all"
				},
				disabled: null,
				icon: null,
				iconPosition: "beginning",
				label: null,
				showLabel: true
			},

			_getCreateOptions: function _getCreateOptions() {
				var disabled,
				    options = this._super() || {};

				this.isInput = this.element.is("input");

				disabled = this.element[0].disabled;
				if (disabled != null) {
					options.disabled = disabled;
				}

				this.originalLabel = this.isInput ? this.element.val() : this.element.html();
				if (this.originalLabel) {
					options.label = this.originalLabel;
				}

				return options;
			},

			_create: function _create() {
				if (!this.option.showLabel & !this.options.icon) {
					this.options.showLabel = true;
				}

				if (this.options.disabled == null) {
					this.options.disabled = this.element[0].disabled || false;
				}

				this.hasTitle = !!this.element.attr("title");

				if (this.options.label && this.options.label !== this.originalLabel) {
					if (this.isInput) {
						this.element.val(this.options.label);
					} else {
						this.element.html(this.options.label);
					}
				}
				this._addClass("ui-button", "ui-widget");
				this._setOption("disabled", this.options.disabled);
				this._enhance();

				if (this.element.is("a")) {
					this._on({
						"keyup": function keyup(event) {
							if (event.keyCode === $.ui.keyCode.SPACE) {
								event.preventDefault();

								if (this.element[0].click) {
									this.element[0].click();
								} else {
									this.element.trigger("click");
								}
							}
						}
					});
				}
			},

			_enhance: function _enhance() {
				if (!this.element.is("button")) {
					this.element.attr("role", "button");
				}

				if (this.options.icon) {
					this._updateIcon("icon", this.options.icon);
					this._updateTooltip();
				}
			},

			_updateTooltip: function _updateTooltip() {
				this.title = this.element.attr("title");

				if (!this.options.showLabel && !this.title) {
					this.element.attr("title", this.options.label);
				}
			},

			_updateIcon: function _updateIcon(option, value) {
				var icon = option !== "iconPosition",
				    position = icon ? this.options.iconPosition : value,
				    displayBlock = position === "top" || position === "bottom";

				if (!this.icon) {
					this.icon = $("<span>");

					this._addClass(this.icon, "ui-button-icon", "ui-icon");

					if (!this.options.showLabel) {
						this._addClass("ui-button-icon-only");
					}
				} else if (icon) {
					this._removeClass(this.icon, null, this.options.icon);
				}

				if (icon) {
					this._addClass(this.icon, null, value);
				}

				this._attachIcon(position);

				if (displayBlock) {
					this._addClass(this.icon, null, "ui-widget-icon-block");
					if (this.iconSpace) {
						this.iconSpace.remove();
					}
				} else {
					if (!this.iconSpace) {
						this.iconSpace = $("<span> </span>");
						this._addClass(this.iconSpace, "ui-button-icon-space");
					}
					this._removeClass(this.icon, null, "ui-wiget-icon-block");
					this._attachIconSpace(position);
				}
			},

			_destroy: function _destroy() {
				this.element.removeAttr("role");

				if (this.icon) {
					this.icon.remove();
				}
				if (this.iconSpace) {
					this.iconSpace.remove();
				}
				if (!this.hasTitle) {
					this.element.removeAttr("title");
				}
			},

			_attachIconSpace: function _attachIconSpace(iconPosition) {
				this.icon[/^(?:end|bottom)/.test(iconPosition) ? "before" : "after"](this.iconSpace);
			},

			_attachIcon: function _attachIcon(iconPosition) {
				this.element[/^(?:end|bottom)/.test(iconPosition) ? "append" : "prepend"](this.icon);
			},

			_setOptions: function _setOptions(options) {
				var newShowLabel = options.showLabel === undefined ? this.options.showLabel : options.showLabel,
				    newIcon = options.icon === undefined ? this.options.icon : options.icon;

				if (!newShowLabel && !newIcon) {
					options.showLabel = true;
				}
				this._super(options);
			},

			_setOption: function _setOption(key, value) {
				if (key === "icon") {
					if (value) {
						this._updateIcon(key, value);
					} else if (this.icon) {
						this.icon.remove();
						if (this.iconSpace) {
							this.iconSpace.remove();
						}
					}
				}

				if (key === "iconPosition") {
					this._updateIcon(key, value);
				}

				if (key === "showLabel") {
					this._toggleClass("ui-button-icon-only", null, !value);
					this._updateTooltip();
				}

				if (key === "label") {
					if (this.isInput) {
						this.element.val(value);
					} else {
						this.element.html(value);
						if (this.icon) {
							this._attachIcon(this.options.iconPosition);
							this._attachIconSpace(this.options.iconPosition);
						}
					}
				}

				this._super(key, value);

				if (key === "disabled") {
					this._toggleClass(null, "ui-state-disabled", value);
					this.element[0].disabled = value;
					if (value) {
						this.element.blur();
					}
				}
			},

			refresh: function refresh() {
				var isDisabled = this.element.is("input, button") ? this.element[0].disabled : this.element.hasClass("ui-button-disabled");

				if (isDisabled !== this.options.disabled) {
					this._setOptions({ disabled: isDisabled });
				}

				this._updateTooltip();
			}
		});

		if ($.uiBackCompat !== false) {
			$.widget("ui.button", $.ui.button, {
				options: {
					text: true,
					icons: {
						primary: null,
						secondary: null
					}
				},

				_create: function _create() {
					if (this.options.showLabel && !this.options.text) {
						this.options.showLabel = this.options.text;
					}
					if (!this.options.showLabel && this.options.text) {
						this.options.text = this.options.showLabel;
					}
					if (!this.options.icon && (this.options.icons.primary || this.options.icons.secondary)) {
						if (this.options.icons.primary) {
							this.options.icon = this.options.icons.primary;
						} else {
							this.options.icon = this.options.icons.secondary;
							this.options.iconPosition = "end";
						}
					} else if (this.options.icon) {
						this.options.icons.primary = this.options.icon;
					}
					this._super();
				},

				_setOption: function _setOption(key, value) {
					if (key === "text") {
						this._super("showLabel", value);
						return;
					}
					if (key === "showLabel") {
						this.options.text = value;
					}
					if (key === "icon") {
						this.options.icons.primary = value;
					}
					if (key === "icons") {
						if (value.primary) {
							this._super("icon", value.primary);
							this._super("iconPosition", "beginning");
						} else if (value.secondary) {
							this._super("icon", value.secondary);
							this._super("iconPosition", "end");
						}
					}
					this._superApply(arguments);
				}
			});

			$.fn.button = function (orig) {
				return function () {
					if (!this.length || this.length && this[0].tagName !== "INPUT" || this.length && this[0].tagName === "INPUT" && this.attr("type") !== "checkbox" && this.attr("type") !== "radio") {
						return orig.apply(this, arguments);
					}
					if (!$.ui.checkboxradio) {
						$.error("Checkboxradio widget missing");
					}
					if (arguments.length === 0) {
						return this.checkboxradio({
							"icon": false
						});
					}
					return this.checkboxradio.apply(this, arguments);
				};
			}($.fn.button);

			$.fn.buttonset = function () {
				if (!$.ui.controlgroup) {
					$.error("Controlgroup widget missing");
				}
				if (arguments[0] === "option" && arguments[1] === "items" && arguments[2]) {
					return this.controlgroup.apply(this, [arguments[0], "items.button", arguments[2]]);
				}
				if (arguments[0] === "option" && arguments[1] === "items") {
					return this.controlgroup.apply(this, [arguments[0], "items.button"]);
				}
				if (_typeof(arguments[0]) === "object" && arguments[0].items) {
					arguments[0].items = {
						button: arguments[0].items
					};
				}
				return this.controlgroup.apply(this, arguments);
			};
		}

		var widgetsButton = $.ui.button;

		$.extend($.ui, { datepicker: { version: "1.12.1" } });

		var datepicker_instActive;

		function datepicker_getZindex(elem) {
			var position, value;
			while (elem.length && elem[0] !== document) {
				position = elem.css("position");
				if (position === "absolute" || position === "relative" || position === "fixed") {
					value = parseInt(elem.css("zIndex"), 10);
					if (!isNaN(value) && value !== 0) {
						return value;
					}
				}
				elem = elem.parent();
			}

			return 0;
		}


		function Datepicker() {
			this._curInst = null;
			this._keyEvent = false;
			this._disabledInputs = [];
			this._datepickerShowing = false;
			this._inDialog = false;
			this._mainDivId = "ui-datepicker-div";
			this._inlineClass = "ui-datepicker-inline";
			this._appendClass = "ui-datepicker-append";
			this._triggerClass = "ui-datepicker-trigger";
			this._dialogClass = "ui-datepicker-dialog";
			this._disableClass = "ui-datepicker-disabled";
			this._unselectableClass = "ui-datepicker-unselectable";
			this._currentClass = "ui-datepicker-current-day";
			this._dayOverClass = "ui-datepicker-days-cell-over";
			this.regional = [];
			this.regional[""] = {
				closeText: "Done",
				prevText: "Prev",
				nextText: "Next",
				currentText: "Today",
				monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				weekHeader: "Wk",
				dateFormat: "mm/dd/yy",
				firstDay: 0,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: "" };
			this._defaults = {
				showOn: "focus",
				showAnim: "fadeIn",
				showOptions: {},
				defaultDate: null,
				appendText: "",
				buttonText: "...",
				buttonImage: "",
				buttonImageOnly: false,
				hideIfNoPrevNext: false,
				navigationAsDateFormat: false,
				gotoCurrent: false,
				changeMonth: false,
				changeYear: false,
				yearRange: "c-10:c+10",
				showOtherMonths: false,
				selectOtherMonths: false,
				showWeek: false,
				calculateWeek: this.iso8601Week,
				shortYearCutoff: "+10",
				minDate: null,
				maxDate: null,
				duration: "fast",
				beforeShowDay: null,
				beforeShow: null,
				onSelect: null,
				onChangeMonthYear: null,
				onClose: null,
				numberOfMonths: 1,
				showCurrentAtPos: 0,
				stepMonths: 1,
				stepBigMonths: 12,
				altField: "",
				altFormat: "",
				constrainInput: true,
				showButtonPanel: false,
				autoSize: false,
				disabled: false };
			$.extend(this._defaults, this.regional[""]);
			this.regional.en = $.extend(true, {}, this.regional[""]);
			this.regional["en-US"] = $.extend(true, {}, this.regional.en);
			this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
		}

		$.extend(Datepicker.prototype, {
			markerClassName: "hasDatepicker",

			maxRows: 4,

			_widgetDatepicker: function _widgetDatepicker() {
				return this.dpDiv;
			},

			setDefaults: function setDefaults(settings) {
				datepicker_extendRemove(this._defaults, settings || {});
				return this;
			},

			_attachDatepicker: function _attachDatepicker(target, settings) {
				var nodeName, inline, inst;
				nodeName = target.nodeName.toLowerCase();
				inline = nodeName === "div" || nodeName === "span";
				if (!target.id) {
					this.uuid += 1;
					target.id = "dp" + this.uuid;
				}
				inst = this._newInst($(target), inline);
				inst.settings = $.extend({}, settings || {});
				if (nodeName === "input") {
					this._connectDatepicker(target, inst);
				} else if (inline) {
					this._inlineDatepicker(target, inst);
				}
			},

			_newInst: function _newInst(target, inline) {
				var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
				return { id: id, input: target,
					selectedDay: 0, selectedMonth: 0, selectedYear: 0,
					drawMonth: 0, drawYear: 0,
					inline: inline,
					dpDiv: !inline ? this.dpDiv : datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) };
			},

			_connectDatepicker: function _connectDatepicker(target, inst) {
				var input = $(target);
				inst.append = $([]);
				inst.trigger = $([]);
				if (input.hasClass(this.markerClassName)) {
					return;
				}
				this._attachments(input, inst);
				input.addClass(this.markerClassName).on("keydown", this._doKeyDown).on("keypress", this._doKeyPress).on("keyup", this._doKeyUp);
				this._autoSize(inst);
				$.data(target, "datepicker", inst);

				if (inst.settings.disabled) {
					this._disableDatepicker(target);
				}
			},

			_attachments: function _attachments(input, inst) {
				var showOn,
				    buttonText,
				    buttonImage,
				    appendText = this._get(inst, "appendText"),
				    isRTL = this._get(inst, "isRTL");

				if (inst.append) {
					inst.append.remove();
				}
				if (appendText) {
					inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
					input[isRTL ? "before" : "after"](inst.append);
				}

				input.off("focus", this._showDatepicker);

				if (inst.trigger) {
					inst.trigger.remove();
				}

				showOn = this._get(inst, "showOn");
				if (showOn === "focus" || showOn === "both") {
					input.on("focus", this._showDatepicker);
				}
				if (showOn === "button" || showOn === "both") {
					buttonText = this._get(inst, "buttonText");
					buttonImage = this._get(inst, "buttonImage");
					inst.trigger = $(this._get(inst, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({ src: buttonImage, alt: buttonText, title: buttonText }) : $("<button type='button'></button>").addClass(this._triggerClass).html(!buttonImage ? buttonText : $("<img/>").attr({ src: buttonImage, alt: buttonText, title: buttonText })));
					input[isRTL ? "before" : "after"](inst.trigger);
					inst.trigger.on("click", function () {
						if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
							$.datepicker._hideDatepicker();
						} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
							$.datepicker._hideDatepicker();
							$.datepicker._showDatepicker(input[0]);
						} else {
							$.datepicker._showDatepicker(input[0]);
						}
						return false;
					});
				}
			},

			_autoSize: function _autoSize(inst) {
				if (this._get(inst, "autoSize") && !inst.inline) {
					var findMax,
					    max,
					    maxI,
					    i,
					    date = new Date(2009, 12 - 1, 20),
					    dateFormat = this._get(inst, "dateFormat");

					if (dateFormat.match(/[DM]/)) {
						findMax = function findMax(names) {
							max = 0;
							maxI = 0;
							for (i = 0; i < names.length; i++) {
								if (names[i].length > max) {
									max = names[i].length;
									maxI = i;
								}
							}
							return maxI;
						};
						date.setMonth(findMax(this._get(inst, dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort")));
						date.setDate(findMax(this._get(inst, dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - date.getDay());
					}
					inst.input.attr("size", this._formatDate(inst, date).length);
				}
			},

			_inlineDatepicker: function _inlineDatepicker(target, inst) {
				var divSpan = $(target);
				if (divSpan.hasClass(this.markerClassName)) {
					return;
				}
				divSpan.addClass(this.markerClassName).append(inst.dpDiv);
				$.data(target, "datepicker", inst);
				this._setDate(inst, this._getDefaultDate(inst), true);
				this._updateDatepicker(inst);
				this._updateAlternate(inst);

				if (inst.settings.disabled) {
					this._disableDatepicker(target);
				}

				inst.dpDiv.css("display", "block");
			},

			_dialogDatepicker: function _dialogDatepicker(input, date, onSelect, settings, pos) {
				var id,
				    browserWidth,
				    browserHeight,
				    scrollX,
				    scrollY,
				    inst = this._dialogInst;

				if (!inst) {
					this.uuid += 1;
					id = "dp" + this.uuid;
					this._dialogInput = $("<input type='text' id='" + id + "' style='position: absolute; top: -100px; width: 0px;'/>");
					this._dialogInput.on("keydown", this._doKeyDown);
					$("body").append(this._dialogInput);
					inst = this._dialogInst = this._newInst(this._dialogInput, false);
					inst.settings = {};
					$.data(this._dialogInput[0], "datepicker", inst);
				}
				datepicker_extendRemove(inst.settings, settings || {});
				date = date && date.constructor === Date ? this._formatDate(inst, date) : date;
				this._dialogInput.val(date);

				this._pos = pos ? pos.length ? pos : [pos.pageX, pos.pageY] : null;
				if (!this._pos) {
					browserWidth = document.documentElement.clientWidth;
					browserHeight = document.documentElement.clientHeight;
					scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
					scrollY = document.documentElement.scrollTop || document.body.scrollTop;
					this._pos = [browserWidth / 2 - 100 + scrollX, browserHeight / 2 - 150 + scrollY];
				}

				this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px");
				inst.settings.onSelect = onSelect;
				this._inDialog = true;
				this.dpDiv.addClass(this._dialogClass);
				this._showDatepicker(this._dialogInput[0]);
				if ($.blockUI) {
					$.blockUI(this.dpDiv);
				}
				$.data(this._dialogInput[0], "datepicker", inst);
				return this;
			},

			_destroyDatepicker: function _destroyDatepicker(target) {
				var nodeName,
				    $target = $(target),
				    inst = $.data(target, "datepicker");

				if (!$target.hasClass(this.markerClassName)) {
					return;
				}

				nodeName = target.nodeName.toLowerCase();
				$.removeData(target, "datepicker");
				if (nodeName === "input") {
					inst.append.remove();
					inst.trigger.remove();
					$target.removeClass(this.markerClassName).off("focus", this._showDatepicker).off("keydown", this._doKeyDown).off("keypress", this._doKeyPress).off("keyup", this._doKeyUp);
				} else if (nodeName === "div" || nodeName === "span") {
					$target.removeClass(this.markerClassName).empty();
				}

				if (datepicker_instActive === inst) {
					datepicker_instActive = null;
				}
			},

			_enableDatepicker: function _enableDatepicker(target) {
				var nodeName,
				    inline,
				    $target = $(target),
				    inst = $.data(target, "datepicker");

				if (!$target.hasClass(this.markerClassName)) {
					return;
				}

				nodeName = target.nodeName.toLowerCase();
				if (nodeName === "input") {
					target.disabled = false;
					inst.trigger.filter("button").each(function () {
						this.disabled = false;
					}).end().filter("img").css({ opacity: "1.0", cursor: "" });
				} else if (nodeName === "div" || nodeName === "span") {
					inline = $target.children("." + this._inlineClass);
					inline.children().removeClass("ui-state-disabled");
					inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", false);
				}
				this._disabledInputs = $.map(this._disabledInputs, function (value) {
					return value === target ? null : value;
				});
			},

			_disableDatepicker: function _disableDatepicker(target) {
				var nodeName,
				    inline,
				    $target = $(target),
				    inst = $.data(target, "datepicker");

				if (!$target.hasClass(this.markerClassName)) {
					return;
				}

				nodeName = target.nodeName.toLowerCase();
				if (nodeName === "input") {
					target.disabled = true;
					inst.trigger.filter("button").each(function () {
						this.disabled = true;
					}).end().filter("img").css({ opacity: "0.5", cursor: "default" });
				} else if (nodeName === "div" || nodeName === "span") {
					inline = $target.children("." + this._inlineClass);
					inline.children().addClass("ui-state-disabled");
					inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", true);
				}
				this._disabledInputs = $.map(this._disabledInputs, function (value) {
					return value === target ? null : value;
				});
				this._disabledInputs[this._disabledInputs.length] = target;
			},

			_isDisabledDatepicker: function _isDisabledDatepicker(target) {
				if (!target) {
					return false;
				}
				for (var i = 0; i < this._disabledInputs.length; i++) {
					if (this._disabledInputs[i] === target) {
						return true;
					}
				}
				return false;
			},

			_getInst: function _getInst(target) {
				try {
					return $.data(target, "datepicker");
				} catch (err) {
					throw "Missing instance data for this datepicker";
				}
			},

			_optionDatepicker: function _optionDatepicker(target, name, value) {
				var settings,
				    date,
				    minDate,
				    maxDate,
				    inst = this._getInst(target);

				if (arguments.length === 2 && typeof name === "string") {
					return name === "defaults" ? $.extend({}, $.datepicker._defaults) : inst ? name === "all" ? $.extend({}, inst.settings) : this._get(inst, name) : null;
				}

				settings = name || {};
				if (typeof name === "string") {
					settings = {};
					settings[name] = value;
				}

				if (inst) {
					if (this._curInst === inst) {
						this._hideDatepicker();
					}

					date = this._getDateDatepicker(target, true);
					minDate = this._getMinMaxDate(inst, "min");
					maxDate = this._getMinMaxDate(inst, "max");
					datepicker_extendRemove(inst.settings, settings);

					if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
						inst.settings.minDate = this._formatDate(inst, minDate);
					}
					if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
						inst.settings.maxDate = this._formatDate(inst, maxDate);
					}
					if ("disabled" in settings) {
						if (settings.disabled) {
							this._disableDatepicker(target);
						} else {
							this._enableDatepicker(target);
						}
					}
					this._attachments($(target), inst);
					this._autoSize(inst);
					this._setDate(inst, date);
					this._updateAlternate(inst);
					this._updateDatepicker(inst);
				}
			},

			_changeDatepicker: function _changeDatepicker(target, name, value) {
				this._optionDatepicker(target, name, value);
			},

			_refreshDatepicker: function _refreshDatepicker(target) {
				var inst = this._getInst(target);
				if (inst) {
					this._updateDatepicker(inst);
				}
			},

			_setDateDatepicker: function _setDateDatepicker(target, date) {
				var inst = this._getInst(target);
				if (inst) {
					this._setDate(inst, date);
					this._updateDatepicker(inst);
					this._updateAlternate(inst);
				}
			},

			_getDateDatepicker: function _getDateDatepicker(target, noDefault) {
				var inst = this._getInst(target);
				if (inst && !inst.inline) {
					this._setDateFromField(inst, noDefault);
				}
				return inst ? this._getDate(inst) : null;
			},

			_doKeyDown: function _doKeyDown(event) {
				var onSelect,
				    dateStr,
				    sel,
				    inst = $.datepicker._getInst(event.target),
				    handled = true,
				    isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

				inst._keyEvent = true;
				if ($.datepicker._datepickerShowing) {
					switch (event.keyCode) {
						case 9:
							$.datepicker._hideDatepicker();
							handled = false;
							break;
						case 13:
							sel = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", inst.dpDiv);
							if (sel[0]) {
								$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
							}

							onSelect = $.datepicker._get(inst, "onSelect");
							if (onSelect) {
								dateStr = $.datepicker._formatDate(inst);

								onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst]);
							} else {
								$.datepicker._hideDatepicker();
							}

							return false;
						case 27:
							$.datepicker._hideDatepicker();
							break;
						case 33:
							$.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
							break;
						case 34:
							$.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
							break;
						case 35:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._clearDate(event.target);
							}
							handled = event.ctrlKey || event.metaKey;
							break;
						case 36:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._gotoToday(event.target);
							}
							handled = event.ctrlKey || event.metaKey;
							break;
						case 37:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._adjustDate(event.target, isRTL ? +1 : -1, "D");
							}
							handled = event.ctrlKey || event.metaKey;

							if (event.originalEvent.altKey) {
								$.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
							}

							break;
						case 38:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._adjustDate(event.target, -7, "D");
							}
							handled = event.ctrlKey || event.metaKey;
							break;
						case 39:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._adjustDate(event.target, isRTL ? -1 : +1, "D");
							}
							handled = event.ctrlKey || event.metaKey;

							if (event.originalEvent.altKey) {
								$.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
							}

							break;
						case 40:
							if (event.ctrlKey || event.metaKey) {
								$.datepicker._adjustDate(event.target, +7, "D");
							}
							handled = event.ctrlKey || event.metaKey;
							break;
						default:
							handled = false;
					}
				} else if (event.keyCode === 36 && event.ctrlKey) {
					$.datepicker._showDatepicker(this);
				} else {
					handled = false;
				}

				if (handled) {
					event.preventDefault();
					event.stopPropagation();
				}
			},

			_doKeyPress: function _doKeyPress(event) {
				var chars,
				    chr,
				    inst = $.datepicker._getInst(event.target);

				if ($.datepicker._get(inst, "constrainInput")) {
					chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
					chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
					return event.ctrlKey || event.metaKey || chr < " " || !chars || chars.indexOf(chr) > -1;
				}
			},

			_doKeyUp: function _doKeyUp(event) {
				var date,
				    inst = $.datepicker._getInst(event.target);

				if (inst.input.val() !== inst.lastVal) {
					try {
						date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input ? inst.input.val() : null, $.datepicker._getFormatConfig(inst));

						if (date) {
							$.datepicker._setDateFromField(inst);
							$.datepicker._updateAlternate(inst);
							$.datepicker._updateDatepicker(inst);
						}
					} catch (err) {}
				}
				return true;
			},

			_showDatepicker: function _showDatepicker(input) {
				input = input.target || input;
				if (input.nodeName.toLowerCase() !== "input") {
					input = $("input", input.parentNode)[0];
				}

				if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) {
					return;
				}

				var inst, beforeShow, beforeShowSettings, isFixed, offset, showAnim, duration;

				inst = $.datepicker._getInst(input);
				if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
					$.datepicker._curInst.dpDiv.stop(true, true);
					if (inst && $.datepicker._datepickerShowing) {
						$.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
					}
				}

				beforeShow = $.datepicker._get(inst, "beforeShow");
				beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
				if (beforeShowSettings === false) {
					return;
				}
				datepicker_extendRemove(inst.settings, beforeShowSettings);

				inst.lastVal = null;
				$.datepicker._lastInput = input;
				$.datepicker._setDateFromField(inst);

				if ($.datepicker._inDialog) {
					input.value = "";
				}
				if (!$.datepicker._pos) {
					$.datepicker._pos = $.datepicker._findPos(input);
					$.datepicker._pos[1] += input.offsetHeight;
				}

				isFixed = false;
				$(input).parents().each(function () {
					isFixed |= $(this).css("position") === "fixed";
					return !isFixed;
				});

				offset = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] };
				$.datepicker._pos = null;

				inst.dpDiv.empty();

				inst.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" });
				$.datepicker._updateDatepicker(inst);

				offset = $.datepicker._checkOffset(inst, offset, isFixed);
				inst.dpDiv.css({ position: $.datepicker._inDialog && $.blockUI ? "static" : isFixed ? "fixed" : "absolute", display: "none",
					left: offset.left + "px", top: offset.top + "px" });

				if (!inst.inline) {
					showAnim = $.datepicker._get(inst, "showAnim");
					duration = $.datepicker._get(inst, "duration");
					inst.dpDiv.css("z-index", datepicker_getZindex($(input)) + 1);
					$.datepicker._datepickerShowing = true;

					if ($.effects && $.effects.effect[showAnim]) {
						inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
					} else {
						inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
					}

					if ($.datepicker._shouldFocusInput(inst)) {
						inst.input.trigger("focus");
					}

					$.datepicker._curInst = inst;
				}
			},

			_updateDatepicker: function _updateDatepicker(inst) {
				this.maxRows = 4;
				datepicker_instActive = inst;
				inst.dpDiv.empty().append(this._generateHTML(inst));
				this._attachHandlers(inst);

				var origyearshtml,
				    numMonths = this._getNumberOfMonths(inst),
				    cols = numMonths[1],
				    width = 17,
				    activeCell = inst.dpDiv.find("." + this._dayOverClass + " a");

				if (activeCell.length > 0) {
					datepicker_handleMouseover.apply(activeCell.get(0));
				}

				inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
				if (cols > 1) {
					inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", width * cols + "em");
				}
				inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi");
				inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");

				if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst)) {
					inst.input.trigger("focus");
				}

				if (inst.yearshtml) {
					origyearshtml = inst.yearshtml;
					setTimeout(function () {
						if (origyearshtml === inst.yearshtml && inst.yearshtml) {
							inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
						}
						origyearshtml = inst.yearshtml = null;
					}, 0);
				}
			},

			_shouldFocusInput: function _shouldFocusInput(inst) {
				return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
			},

			_checkOffset: function _checkOffset(inst, offset, isFixed) {
				var dpWidth = inst.dpDiv.outerWidth(),
				    dpHeight = inst.dpDiv.outerHeight(),
				    inputWidth = inst.input ? inst.input.outerWidth() : 0,
				    inputHeight = inst.input ? inst.input.outerHeight() : 0,
				    viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
				    viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

				offset.left -= this._get(inst, "isRTL") ? dpWidth - inputWidth : 0;
				offset.left -= isFixed && offset.left === inst.input.offset().left ? $(document).scrollLeft() : 0;
				offset.top -= isFixed && offset.top === inst.input.offset().top + inputHeight ? $(document).scrollTop() : 0;

				offset.left -= Math.min(offset.left, offset.left + dpWidth > viewWidth && viewWidth > dpWidth ? Math.abs(offset.left + dpWidth - viewWidth) : 0);
				offset.top -= Math.min(offset.top, offset.top + dpHeight > viewHeight && viewHeight > dpHeight ? Math.abs(dpHeight + inputHeight) : 0);

				return offset;
			},

			_findPos: function _findPos(obj) {
				var position,
				    inst = this._getInst(obj),
				    isRTL = this._get(inst, "isRTL");

				while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
					obj = obj[isRTL ? "previousSibling" : "nextSibling"];
				}

				position = $(obj).offset();
				return [position.left, position.top];
			},

			_hideDatepicker: function _hideDatepicker(input) {
				var showAnim,
				    duration,
				    postProcess,
				    onClose,
				    inst = this._curInst;

				if (!inst || input && inst !== $.data(input, "datepicker")) {
					return;
				}

				if (this._datepickerShowing) {
					showAnim = this._get(inst, "showAnim");
					duration = this._get(inst, "duration");
					postProcess = function postProcess() {
						$.datepicker._tidyDialog(inst);
					};

					if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
						inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
					} else {
						inst.dpDiv[showAnim === "slideDown" ? "slideUp" : showAnim === "fadeIn" ? "fadeOut" : "hide"](showAnim ? duration : null, postProcess);
					}

					if (!showAnim) {
						postProcess();
					}
					this._datepickerShowing = false;

					onClose = this._get(inst, "onClose");
					if (onClose) {
						onClose.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : "", inst]);
					}

					this._lastInput = null;
					if (this._inDialog) {
						this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
						if ($.blockUI) {
							$.unblockUI();
							$("body").append(this.dpDiv);
						}
					}
					this._inDialog = false;
				}
			},

			_tidyDialog: function _tidyDialog(inst) {
				inst.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
			},

			_checkExternalClick: function _checkExternalClick(event) {
				if (!$.datepicker._curInst) {
					return;
				}

				var $target = $(event.target),
				    inst = $.datepicker._getInst($target[0]);

				if ($target[0].id !== $.datepicker._mainDivId && $target.parents("#" + $.datepicker._mainDivId).length === 0 && !$target.hasClass($.datepicker.markerClassName) && !$target.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) || $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst) {
					$.datepicker._hideDatepicker();
				}
			},

			_adjustDate: function _adjustDate(id, offset, period) {
				var target = $(id),
				    inst = this._getInst(target[0]);

				if (this._isDisabledDatepicker(target[0])) {
					return;
				}
				this._adjustInstDate(inst, offset + (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), period);
				this._updateDatepicker(inst);
			},

			_gotoToday: function _gotoToday(id) {
				var date,
				    target = $(id),
				    inst = this._getInst(target[0]);

				if (this._get(inst, "gotoCurrent") && inst.currentDay) {
					inst.selectedDay = inst.currentDay;
					inst.drawMonth = inst.selectedMonth = inst.currentMonth;
					inst.drawYear = inst.selectedYear = inst.currentYear;
				} else {
					date = new Date();
					inst.selectedDay = date.getDate();
					inst.drawMonth = inst.selectedMonth = date.getMonth();
					inst.drawYear = inst.selectedYear = date.getFullYear();
				}
				this._notifyChange(inst);
				this._adjustDate(target);
			},

			_selectMonthYear: function _selectMonthYear(id, select, period) {
				var target = $(id),
				    inst = this._getInst(target[0]);

				inst["selected" + (period === "M" ? "Month" : "Year")] = inst["draw" + (period === "M" ? "Month" : "Year")] = parseInt(select.options[select.selectedIndex].value, 10);

				this._notifyChange(inst);
				this._adjustDate(target);
			},

			_selectDay: function _selectDay(id, month, year, td) {
				var inst,
				    target = $(id);

				if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
					return;
				}

				inst = this._getInst(target[0]);
				inst.selectedDay = inst.currentDay = $("a", td).html();
				inst.selectedMonth = inst.currentMonth = month;
				inst.selectedYear = inst.currentYear = year;
				this._selectDate(id, this._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear));
			},

			_clearDate: function _clearDate(id) {
				var target = $(id);
				this._selectDate(target, "");
			},

			_selectDate: function _selectDate(id, dateStr) {
				var onSelect,
				    target = $(id),
				    inst = this._getInst(target[0]);

				dateStr = dateStr != null ? dateStr : this._formatDate(inst);
				if (inst.input) {
					inst.input.val(dateStr);
				}
				this._updateAlternate(inst);

				onSelect = this._get(inst, "onSelect");
				if (onSelect) {
					onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst]);
				} else if (inst.input) {
					inst.input.trigger("change");
				}

				if (inst.inline) {
					this._updateDatepicker(inst);
				} else {
					this._hideDatepicker();
					this._lastInput = inst.input[0];
					if (_typeof(inst.input[0]) !== "object") {
						inst.input.trigger("focus");
					}
					this._lastInput = null;
				}
			},

			_updateAlternate: function _updateAlternate(inst) {
				var altFormat,
				    date,
				    dateStr,
				    altField = this._get(inst, "altField");

				if (altField) {
					altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
					date = this._getDate(inst);
					dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
					$(altField).val(dateStr);
				}
			},

			noWeekends: function noWeekends(date) {
				var day = date.getDay();
				return [day > 0 && day < 6, ""];
			},

			iso8601Week: function iso8601Week(date) {
				var time,
				    checkDate = new Date(date.getTime());

				checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

				time = checkDate.getTime();
				checkDate.setMonth(0);
				checkDate.setDate(1);
				return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
			},

			parseDate: function parseDate(format, value, settings) {
				if (format == null || value == null) {
					throw "Invalid arguments";
				}

				value = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" ? value.toString() : value + "";
				if (value === "") {
					return null;
				}

				var iFormat,
				    dim,
				    extra,
				    iValue = 0,
				    shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
				    shortYearCutoff = typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp : new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10),
				    dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				    dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				    monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				    monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
				    year = -1,
				    month = -1,
				    day = -1,
				    doy = -1,
				    literal = false,
				    date,
				    lookAhead = function lookAhead(match) {
					var matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				    getNumber = function getNumber(match) {
					var isDoubled = lookAhead(match),
					    size = match === "@" ? 14 : match === "!" ? 20 : match === "y" && isDoubled ? 4 : match === "o" ? 3 : 2,
					    minSize = match === "y" ? size : 1,
					    digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
					    num = value.substring(iValue).match(digits);
					if (!num) {
						throw "Missing number at position " + iValue;
					}
					iValue += num[0].length;
					return parseInt(num[0], 10);
				},
				    getName = function getName(match, shortNames, longNames) {
					var index = -1,
					    names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
						return [[k, v]];
					}).sort(function (a, b) {
						return -(a[1].length - b[1].length);
					});

					$.each(names, function (i, pair) {
						var name = pair[1];
						if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
							index = pair[0];
							iValue += name.length;
							return false;
						}
					});
					if (index !== -1) {
						return index + 1;
					} else {
						throw "Unknown name at position " + iValue;
					}
				},
				    checkLiteral = function checkLiteral() {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw "Unexpected literal at position " + iValue;
					}
					iValue++;
				};

				for (iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
							literal = false;
						} else {
							checkLiteral();
						}
					} else {
						switch (format.charAt(iFormat)) {
							case "d":
								day = getNumber("d");
								break;
							case "D":
								getName("D", dayNamesShort, dayNames);
								break;
							case "o":
								doy = getNumber("o");
								break;
							case "m":
								month = getNumber("m");
								break;
							case "M":
								month = getName("M", monthNamesShort, monthNames);
								break;
							case "y":
								year = getNumber("y");
								break;
							case "@":
								date = new Date(getNumber("@"));
								year = date.getFullYear();
								month = date.getMonth() + 1;
								day = date.getDate();
								break;
							case "!":
								date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
								year = date.getFullYear();
								month = date.getMonth() + 1;
								day = date.getDate();
								break;
							case "'":
								if (lookAhead("'")) {
									checkLiteral();
								} else {
									literal = true;
								}
								break;
							default:
								checkLiteral();
						}
					}
				}

				if (iValue < value.length) {
					extra = value.substr(iValue);
					if (!/^\s+/.test(extra)) {
						throw "Extra/unparsed characters found in date: " + extra;
					}
				}

				if (year === -1) {
					year = new Date().getFullYear();
				} else if (year < 100) {
					year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
				}

				if (doy > -1) {
					month = 1;
					day = doy;
					do {
						dim = this._getDaysInMonth(year, month - 1);
						if (day <= dim) {
							break;
						}
						month++;
						day -= dim;
					} while (true);
				}

				date = this._daylightSavingAdjust(new Date(year, month - 1, day));
				if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
					throw "Invalid date";
				}
				return date;
			},

			ATOM: "yy-mm-dd",
			COOKIE: "D, dd M yy",
			ISO_8601: "yy-mm-dd",
			RFC_822: "D, d M y",
			RFC_850: "DD, dd-M-y",
			RFC_1036: "D, d M y",
			RFC_1123: "D, d M yy",
			RFC_2822: "D, d M yy",
			RSS: "D, d M y",
			TICKS: "!",
			TIMESTAMP: "@",
			W3C: "yy-mm-dd",

			_ticksTo1970: ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000,

			formatDate: function formatDate(format, date, settings) {
				if (!date) {
					return "";
				}

				var iFormat,
				    dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				    dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				    monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				    monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
				    lookAhead = function lookAhead(match) {
					var matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				    formatNumber = function formatNumber(match, value, len) {
					var num = "" + value;
					if (lookAhead(match)) {
						while (num.length < len) {
							num = "0" + num;
						}
					}
					return num;
				},
				    formatName = function formatName(match, value, shortNames, longNames) {
					return lookAhead(match) ? longNames[value] : shortNames[value];
				},
				    output = "",
				    literal = false;

				if (date) {
					for (iFormat = 0; iFormat < format.length; iFormat++) {
						if (literal) {
							if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
								literal = false;
							} else {
								output += format.charAt(iFormat);
							}
						} else {
							switch (format.charAt(iFormat)) {
								case "d":
									output += formatNumber("d", date.getDate(), 2);
									break;
								case "D":
									output += formatName("D", date.getDay(), dayNamesShort, dayNames);
									break;
								case "o":
									output += formatNumber("o", Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
									break;
								case "m":
									output += formatNumber("m", date.getMonth() + 1, 2);
									break;
								case "M":
									output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
									break;
								case "y":
									output += lookAhead("y") ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100;
									break;
								case "@":
									output += date.getTime();
									break;
								case "!":
									output += date.getTime() * 10000 + this._ticksTo1970;
									break;
								case "'":
									if (lookAhead("'")) {
										output += "'";
									} else {
										literal = true;
									}
									break;
								default:
									output += format.charAt(iFormat);
							}
						}
					}
				}
				return output;
			},

			_possibleChars: function _possibleChars(format) {
				var iFormat,
				    chars = "",
				    literal = false,
				    lookAhead = function lookAhead(match) {
					var matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
					if (matches) {
						iFormat++;
					}
					return matches;
				};

				for (iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
							literal = false;
						} else {
							chars += format.charAt(iFormat);
						}
					} else {
						switch (format.charAt(iFormat)) {
							case "d":case "m":case "y":case "@":
								chars += "0123456789";
								break;
							case "D":case "M":
								return null;
							case "'":
								if (lookAhead("'")) {
									chars += "'";
								} else {
									literal = true;
								}
								break;
							default:
								chars += format.charAt(iFormat);
						}
					}
				}
				return chars;
			},

			_get: function _get(inst, name) {
				return inst.settings[name] !== undefined ? inst.settings[name] : this._defaults[name];
			},

			_setDateFromField: function _setDateFromField(inst, noDefault) {
				if (inst.input.val() === inst.lastVal) {
					return;
				}

				var dateFormat = this._get(inst, "dateFormat"),
				    dates = inst.lastVal = inst.input ? inst.input.val() : null,
				    defaultDate = this._getDefaultDate(inst),
				    date = defaultDate,
				    settings = this._getFormatConfig(inst);

				try {
					date = this.parseDate(dateFormat, dates, settings) || defaultDate;
				} catch (event) {
					dates = noDefault ? "" : dates;
				}
				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
				inst.currentDay = dates ? date.getDate() : 0;
				inst.currentMonth = dates ? date.getMonth() : 0;
				inst.currentYear = dates ? date.getFullYear() : 0;
				this._adjustInstDate(inst);
			},

			_getDefaultDate: function _getDefaultDate(inst) {
				return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
			},

			_determineDate: function _determineDate(inst, date, defaultDate) {
				var offsetNumeric = function offsetNumeric(offset) {
					var date = new Date();
					date.setDate(date.getDate() + offset);
					return date;
				},
				    offsetString = function offsetString(offset) {
					try {
						return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), offset, $.datepicker._getFormatConfig(inst));
					} catch (e) {}

					var date = (offset.toLowerCase().match(/^c/) ? $.datepicker._getDate(inst) : null) || new Date(),
					    year = date.getFullYear(),
					    month = date.getMonth(),
					    day = date.getDate(),
					    pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					    matches = pattern.exec(offset);

					while (matches) {
						switch (matches[2] || "d") {
							case "d":case "D":
								day += parseInt(matches[1], 10);break;
							case "w":case "W":
								day += parseInt(matches[1], 10) * 7;break;
							case "m":case "M":
								month += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
							case "y":case "Y":
								year += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
						}
						matches = pattern.exec(offset);
					}
					return new Date(year, month, day);
				},
				    newDate = date == null || date === "" ? defaultDate : typeof date === "string" ? offsetString(date) : typeof date === "number" ? isNaN(date) ? defaultDate : offsetNumeric(date) : new Date(date.getTime());

				newDate = newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate;
				if (newDate) {
					newDate.setHours(0);
					newDate.setMinutes(0);
					newDate.setSeconds(0);
					newDate.setMilliseconds(0);
				}
				return this._daylightSavingAdjust(newDate);
			},

			_daylightSavingAdjust: function _daylightSavingAdjust(date) {
				if (!date) {
					return null;
				}
				date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
				return date;
			},

			_setDate: function _setDate(inst, date, noChange) {
				var clear = !date,
				    origMonth = inst.selectedMonth,
				    origYear = inst.selectedYear,
				    newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

				inst.selectedDay = inst.currentDay = newDate.getDate();
				inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
				inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
				if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
					this._notifyChange(inst);
				}
				this._adjustInstDate(inst);
				if (inst.input) {
					inst.input.val(clear ? "" : this._formatDate(inst));
				}
			},

			_getDate: function _getDate(inst) {
				var startDate = !inst.currentYear || inst.input && inst.input.val() === "" ? null : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
				return startDate;
			},

			_attachHandlers: function _attachHandlers(inst) {
				var stepMonths = this._get(inst, "stepMonths"),
				    id = "#" + inst.id.replace(/\\\\/g, "\\");
				inst.dpDiv.find("[data-handler]").map(function () {
					var handler = {
						prev: function prev() {
							$.datepicker._adjustDate(id, -stepMonths, "M");
						},
						next: function next() {
							$.datepicker._adjustDate(id, +stepMonths, "M");
						},
						hide: function hide() {
							$.datepicker._hideDatepicker();
						},
						today: function today() {
							$.datepicker._gotoToday(id);
						},
						selectDay: function selectDay() {
							$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
							return false;
						},
						selectMonth: function selectMonth() {
							$.datepicker._selectMonthYear(id, this, "M");
							return false;
						},
						selectYear: function selectYear() {
							$.datepicker._selectMonthYear(id, this, "Y");
							return false;
						}
					};
					$(this).on(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
				});
			},

			_generateHTML: function _generateHTML(inst) {
				var maxDraw,
				    prevText,
				    prev,
				    nextText,
				    next,
				    currentText,
				    gotoDate,
				    controls,
				    buttonPanel,
				    firstDay,
				    showWeek,
				    dayNames,
				    dayNamesMin,
				    monthNames,
				    monthNamesShort,
				    beforeShowDay,
				    showOtherMonths,
				    selectOtherMonths,
				    defaultDate,
				    html,
				    dow,
				    row,
				    group,
				    col,
				    selectedDate,
				    cornerClass,
				    calender,
				    thead,
				    day,
				    daysInMonth,
				    leadDays,
				    curRows,
				    numRows,
				    printDate,
				    dRow,
				    tbody,
				    daySettings,
				    otherMonth,
				    unselectable,
				    tempDate = new Date(),
				    today = this._daylightSavingAdjust(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())),
				    isRTL = this._get(inst, "isRTL"),
				    showButtonPanel = this._get(inst, "showButtonPanel"),
				    hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
				    navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
				    numMonths = this._getNumberOfMonths(inst),
				    showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
				    stepMonths = this._get(inst, "stepMonths"),
				    isMultiMonth = numMonths[0] !== 1 || numMonths[1] !== 1,
				    currentDate = this._daylightSavingAdjust(!inst.currentDay ? new Date(9999, 9, 9) : new Date(inst.currentYear, inst.currentMonth, inst.currentDay)),
				    minDate = this._getMinMaxDate(inst, "min"),
				    maxDate = this._getMinMaxDate(inst, "max"),
				    drawMonth = inst.drawMonth - showCurrentAtPos,
				    drawYear = inst.drawYear;

				if (drawMonth < 0) {
					drawMonth += 12;
					drawYear--;
				}
				if (maxDate) {
					maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - numMonths[0] * numMonths[1] + 1, maxDate.getDate()));
					maxDraw = minDate && maxDraw < minDate ? minDate : maxDraw;
					while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
						drawMonth--;
						if (drawMonth < 0) {
							drawMonth = 11;
							drawYear--;
						}
					}
				}
				inst.drawMonth = drawMonth;
				inst.drawYear = drawYear;

				prevText = this._get(inst, "prevText");
				prevText = !navigationAsDateFormat ? prevText : this.formatDate(prevText, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst));

				prev = this._canAdjustMonth(inst, -1, drawYear, drawMonth) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" + " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" : hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>";

				nextText = this._get(inst, "nextText");
				nextText = !navigationAsDateFormat ? nextText : this.formatDate(nextText, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst));

				next = this._canAdjustMonth(inst, +1, drawYear, drawMonth) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" + " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" : hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>";

				currentText = this._get(inst, "currentText");
				gotoDate = this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today;
				currentText = !navigationAsDateFormat ? currentText : this.formatDate(currentText, gotoDate, this._getFormatConfig(inst));

				controls = !inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(inst, "closeText") + "</button>" : "";

				buttonPanel = showButtonPanel ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") + (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" + ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

				firstDay = parseInt(this._get(inst, "firstDay"), 10);
				firstDay = isNaN(firstDay) ? 0 : firstDay;

				showWeek = this._get(inst, "showWeek");
				dayNames = this._get(inst, "dayNames");
				dayNamesMin = this._get(inst, "dayNamesMin");
				monthNames = this._get(inst, "monthNames");
				monthNamesShort = this._get(inst, "monthNamesShort");
				beforeShowDay = this._get(inst, "beforeShowDay");
				showOtherMonths = this._get(inst, "showOtherMonths");
				selectOtherMonths = this._get(inst, "selectOtherMonths");
				defaultDate = this._getDefaultDate(inst);
				html = "";

				for (row = 0; row < numMonths[0]; row++) {
					group = "";
					this.maxRows = 4;
					for (col = 0; col < numMonths[1]; col++) {
						selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
						cornerClass = " ui-corner-all";
						calender = "";
						if (isMultiMonth) {
							calender += "<div class='ui-datepicker-group";
							if (numMonths[1] > 1) {
								switch (col) {
									case 0:
										calender += " ui-datepicker-group-first";
										cornerClass = " ui-corner-" + (isRTL ? "right" : "left");break;
									case numMonths[1] - 1:
										calender += " ui-datepicker-group-last";
										cornerClass = " ui-corner-" + (isRTL ? "left" : "right");break;
									default:
										calender += " ui-datepicker-group-middle";cornerClass = "";break;
								}
							}
							calender += "'>";
						}
						calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" + (/all|left/.test(cornerClass) && row === 0 ? isRTL ? next : prev : "") + (/all|right/.test(cornerClass) && row === 0 ? isRTL ? prev : next : "") + this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, row > 0 || col > 0, monthNames, monthNamesShort) + "</div><table class='ui-datepicker-calendar'><thead>" + "<tr>";
						thead = showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "";
						for (dow = 0; dow < 7; dow++) {
							day = (dow + firstDay) % 7;
							thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" + "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
						}
						calender += thead + "</tr></thead><tbody>";
						daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
						if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
							inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
						}
						leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
						curRows = Math.ceil((leadDays + daysInMonth) / 7);
						numRows = isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows;
						this.maxRows = numRows;
						printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
						for (dRow = 0; dRow < numRows; dRow++) {
							calender += "<tr>";
							tbody = !showWeek ? "" : "<td class='ui-datepicker-week-col'>" + this._get(inst, "calculateWeek")(printDate) + "</td>";
							for (dow = 0; dow < 7; dow++) {
								daySettings = beforeShowDay ? beforeShowDay.apply(inst.input ? inst.input[0] : null, [printDate]) : [true, ""];
								otherMonth = printDate.getMonth() !== drawMonth;
								unselectable = otherMonth && !selectOtherMonths || !daySettings[0] || minDate && printDate < minDate || maxDate && printDate > maxDate;
								tbody += "<td class='" + ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (otherMonth ? " ui-datepicker-other-month" : "") + (printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent || defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime() ? " " + this._dayOverClass : "") + (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") + (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + (otherMonth && !showOtherMonths ? "&#xa0;" : unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + (otherMonth ? " ui-priority-secondary" : "") + "' href='#'>" + printDate.getDate() + "</a>") + "</td>";
								printDate.setDate(printDate.getDate() + 1);
								printDate = this._daylightSavingAdjust(printDate);
							}
							calender += tbody + "</tr>";
						}
						drawMonth++;
						if (drawMonth > 11) {
							drawMonth = 0;
							drawYear++;
						}
						calender += "</tbody></table>" + (isMultiMonth ? "</div>" + (numMonths[0] > 0 && col === numMonths[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
						group += calender;
					}
					html += group;
				}
				html += buttonPanel;
				inst._keyEvent = false;
				return html;
			},

			_generateMonthYearHeader: function _generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort) {

				var inMinYear,
				    inMaxYear,
				    month,
				    years,
				    thisYear,
				    determineYear,
				    year,
				    endYear,
				    changeMonth = this._get(inst, "changeMonth"),
				    changeYear = this._get(inst, "changeYear"),
				    showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
				    html = "<div class='ui-datepicker-title'>",
				    monthHtml = "";

				if (secondary || !changeMonth) {
					monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
				} else {
					inMinYear = minDate && minDate.getFullYear() === drawYear;
					inMaxYear = maxDate && maxDate.getFullYear() === drawYear;
					monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
					for (month = 0; month < 12; month++) {
						if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
							monthHtml += "<option value='" + month + "'" + (month === drawMonth ? " selected='selected'" : "") + ">" + monthNamesShort[month] + "</option>";
						}
					}
					monthHtml += "</select>";
				}

				if (!showMonthAfterYear) {
					html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
				}

				if (!inst.yearshtml) {
					inst.yearshtml = "";
					if (secondary || !changeYear) {
						html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
					} else {
						years = this._get(inst, "yearRange").split(":");
						thisYear = new Date().getFullYear();
						determineYear = function determineYear(value) {
							var year = value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) : value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) : parseInt(value, 10);
							return isNaN(year) ? thisYear : year;
						};
						year = determineYear(years[0]);
						endYear = Math.max(year, determineYear(years[1] || ""));
						year = minDate ? Math.max(year, minDate.getFullYear()) : year;
						endYear = maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear;
						inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
						for (; year <= endYear; year++) {
							inst.yearshtml += "<option value='" + year + "'" + (year === drawYear ? " selected='selected'" : "") + ">" + year + "</option>";
						}
						inst.yearshtml += "</select>";

						html += inst.yearshtml;
						inst.yearshtml = null;
					}
				}

				html += this._get(inst, "yearSuffix");
				if (showMonthAfterYear) {
					html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
				}
				html += "</div>";
				return html;
			},

			_adjustInstDate: function _adjustInstDate(inst, offset, period) {
				var year = inst.selectedYear + (period === "Y" ? offset : 0),
				    month = inst.selectedMonth + (period === "M" ? offset : 0),
				    day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
				    date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
				if (period === "M" || period === "Y") {
					this._notifyChange(inst);
				}
			},

			_restrictMinMax: function _restrictMinMax(inst, date) {
				var minDate = this._getMinMaxDate(inst, "min"),
				    maxDate = this._getMinMaxDate(inst, "max"),
				    newDate = minDate && date < minDate ? minDate : date;
				return maxDate && newDate > maxDate ? maxDate : newDate;
			},

			_notifyChange: function _notifyChange(inst) {
				var onChange = this._get(inst, "onChangeMonthYear");
				if (onChange) {
					onChange.apply(inst.input ? inst.input[0] : null, [inst.selectedYear, inst.selectedMonth + 1, inst]);
				}
			},

			_getNumberOfMonths: function _getNumberOfMonths(inst) {
				var numMonths = this._get(inst, "numberOfMonths");
				return numMonths == null ? [1, 1] : typeof numMonths === "number" ? [1, numMonths] : numMonths;
			},

			_getMinMaxDate: function _getMinMaxDate(inst, minMax) {
				return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
			},

			_getDaysInMonth: function _getDaysInMonth(year, month) {
				return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
			},

			_getFirstDayOfMonth: function _getFirstDayOfMonth(year, month) {
				return new Date(year, month, 1).getDay();
			},

			_canAdjustMonth: function _canAdjustMonth(inst, offset, curYear, curMonth) {
				var numMonths = this._getNumberOfMonths(inst),
				    date = this._daylightSavingAdjust(new Date(curYear, curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

				if (offset < 0) {
					date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
				}
				return this._isInRange(inst, date);
			},

			_isInRange: function _isInRange(inst, date) {
				var yearSplit,
				    currentYear,
				    minDate = this._getMinMaxDate(inst, "min"),
				    maxDate = this._getMinMaxDate(inst, "max"),
				    minYear = null,
				    maxYear = null,
				    years = this._get(inst, "yearRange");
				if (years) {
					yearSplit = years.split(":");
					currentYear = new Date().getFullYear();
					minYear = parseInt(yearSplit[0], 10);
					maxYear = parseInt(yearSplit[1], 10);
					if (yearSplit[0].match(/[+\-].*/)) {
						minYear += currentYear;
					}
					if (yearSplit[1].match(/[+\-].*/)) {
						maxYear += currentYear;
					}
				}

				return (!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime()) && (!minYear || date.getFullYear() >= minYear) && (!maxYear || date.getFullYear() <= maxYear);
			},

			_getFormatConfig: function _getFormatConfig(inst) {
				var shortYearCutoff = this._get(inst, "shortYearCutoff");
				shortYearCutoff = typeof shortYearCutoff !== "string" ? shortYearCutoff : new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10);
				return { shortYearCutoff: shortYearCutoff,
					dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
					monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames") };
			},

			_formatDate: function _formatDate(inst, day, month, year) {
				if (!day) {
					inst.currentDay = inst.selectedDay;
					inst.currentMonth = inst.selectedMonth;
					inst.currentYear = inst.selectedYear;
				}
				var date = day ? (typeof day === "undefined" ? "undefined" : _typeof(day)) === "object" ? day : this._daylightSavingAdjust(new Date(year, month, day)) : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
				return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
			}
		});

		function datepicker_bindHover(dpDiv) {
			var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
			return dpDiv.on("mouseout", selector, function () {
				$(this).removeClass("ui-state-hover");
				if (this.className.indexOf("ui-datepicker-prev") !== -1) {
					$(this).removeClass("ui-datepicker-prev-hover");
				}
				if (this.className.indexOf("ui-datepicker-next") !== -1) {
					$(this).removeClass("ui-datepicker-next-hover");
				}
			}).on("mouseover", selector, datepicker_handleMouseover);
		}

		function datepicker_handleMouseover() {
			if (!$.datepicker._isDisabledDatepicker(datepicker_instActive.inline ? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
				$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
				$(this).addClass("ui-state-hover");
				if (this.className.indexOf("ui-datepicker-prev") !== -1) {
					$(this).addClass("ui-datepicker-prev-hover");
				}
				if (this.className.indexOf("ui-datepicker-next") !== -1) {
					$(this).addClass("ui-datepicker-next-hover");
				}
			}
		}

		function datepicker_extendRemove(target, props) {
			$.extend(target, props);
			for (var name in props) {
				if (props[name] == null) {
					target[name] = props[name];
				}
			}
			return target;
		}

		$.fn.datepicker = function (options) {
			if (!this.length) {
				return this;
			}

			if (!$.datepicker.initialized) {
				$(document).on("mousedown", $.datepicker._checkExternalClick);
				$.datepicker.initialized = true;
			}

			if ($("#" + $.datepicker._mainDivId).length === 0) {
				$("body").append($.datepicker.dpDiv);
			}

			var otherArgs = Array.prototype.slice.call(arguments, 1);
			if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
				return $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(otherArgs));
			}
			if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
				return $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(otherArgs));
			}
			return this.each(function () {
				typeof options === "string" ? $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this].concat(otherArgs)) : $.datepicker._attachDatepicker(this, options);
			});
		};

		$.datepicker = new Datepicker();
		$.datepicker.initialized = false;
		$.datepicker.uuid = new Date().getTime();
		$.datepicker.version = "1.12.1";

		var widgetsDatepicker = $.datepicker;

		var ie = $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

		var mouseHandled = false;
		$(document).on("mouseup", function () {
			mouseHandled = false;
		});

		var widgetsMouse = $.widget("ui.mouse", {
			version: "1.12.1",
			options: {
				cancel: "input, textarea, button, select, option",
				distance: 1,
				delay: 0
			},
			_mouseInit: function _mouseInit() {
				var that = this;

				this.element.on("mousedown." + this.widgetName, function (event) {
					return that._mouseDown(event);
				}).on("click." + this.widgetName, function (event) {
					if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
						$.removeData(event.target, that.widgetName + ".preventClickEvent");
						event.stopImmediatePropagation();
						return false;
					}
				});

				this.started = false;
			},

			_mouseDestroy: function _mouseDestroy() {
				this.element.off("." + this.widgetName);
				if (this._mouseMoveDelegate) {
					this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);
				}
			},

			_mouseDown: function _mouseDown(event) {
				if (mouseHandled) {
					return;
				}

				this._mouseMoved = false;

				this._mouseStarted && this._mouseUp(event);

				this._mouseDownEvent = event;

				var that = this,
				    btnIsLeft = event.which === 1,
				    elIsCancel = typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false;
				if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
					return true;
				}

				this.mouseDelayMet = !this.options.delay;
				if (!this.mouseDelayMet) {
					this._mouseDelayTimer = setTimeout(function () {
						that.mouseDelayMet = true;
					}, this.options.delay);
				}

				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted = this._mouseStart(event) !== false;
					if (!this._mouseStarted) {
						event.preventDefault();
						return true;
					}
				}

				if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, this.widgetName + ".preventClickEvent");
				}

				this._mouseMoveDelegate = function (event) {
					return that._mouseMove(event);
				};
				this._mouseUpDelegate = function (event) {
					return that._mouseUp(event);
				};

				this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate);

				event.preventDefault();

				mouseHandled = true;
				return true;
			},

			_mouseMove: function _mouseMove(event) {
				if (this._mouseMoved) {
					if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
						return this._mouseUp(event);
					} else if (!event.which) {
						if (event.originalEvent.altKey || event.originalEvent.ctrlKey || event.originalEvent.metaKey || event.originalEvent.shiftKey) {
							this.ignoreMissingWhich = true;
						} else if (!this.ignoreMissingWhich) {
							return this._mouseUp(event);
						}
					}
				}

				if (event.which || event.button) {
					this._mouseMoved = true;
				}

				if (this._mouseStarted) {
					this._mouseDrag(event);
					return event.preventDefault();
				}

				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted = this._mouseStart(this._mouseDownEvent, event) !== false;
					this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
				}

				return !this._mouseStarted;
			},

			_mouseUp: function _mouseUp(event) {
				this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);

				if (this._mouseStarted) {
					this._mouseStarted = false;

					if (event.target === this._mouseDownEvent.target) {
						$.data(event.target, this.widgetName + ".preventClickEvent", true);
					}

					this._mouseStop(event);
				}

				if (this._mouseDelayTimer) {
					clearTimeout(this._mouseDelayTimer);
					delete this._mouseDelayTimer;
				}

				this.ignoreMissingWhich = false;
				mouseHandled = false;
				event.preventDefault();
			},

			_mouseDistanceMet: function _mouseDistanceMet(event) {
				return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
			},

			_mouseDelayMet: function _mouseDelayMet() {
				return this.mouseDelayMet;
			},

			_mouseStart: function _mouseStart() {},
			_mouseDrag: function _mouseDrag() {},
			_mouseStop: function _mouseStop() {},
			_mouseCapture: function _mouseCapture() {
				return true;
			}
		});

		var plugin = $.ui.plugin = {
			add: function add(module, option, set) {
				var i,
				    proto = $.ui[module].prototype;
				for (i in set) {
					proto.plugins[i] = proto.plugins[i] || [];
					proto.plugins[i].push([option, set[i]]);
				}
			},
			call: function call(instance, name, args, allowDisconnected) {
				var i,
				    set = instance.plugins[name];

				if (!set) {
					return;
				}

				if (!allowDisconnected && (!instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11)) {
					return;
				}

				for (i = 0; i < set.length; i++) {
					if (instance.options[set[i][0]]) {
						set[i][1].apply(instance.element, args);
					}
				}
			}
		};

		var safeBlur = $.ui.safeBlur = function (element) {
			if (element && element.nodeName.toLowerCase() !== "body") {
				$(element).trigger("blur");
			}
		};

		$.widget("ui.draggable", $.ui.mouse, {
			version: "1.12.1",
			widgetEventPrefix: "drag",
			options: {
				addClasses: true,
				appendTo: "parent",
				axis: false,
				connectToSortable: false,
				containment: false,
				cursor: "auto",
				cursorAt: false,
				grid: false,
				handle: false,
				helper: "original",
				iframeFix: false,
				opacity: false,
				refreshPositions: false,
				revert: false,
				revertDuration: 500,
				scope: "default",
				scroll: true,
				scrollSensitivity: 20,
				scrollSpeed: 20,
				snap: false,
				snapMode: "both",
				snapTolerance: 20,
				stack: false,
				zIndex: false,

				drag: null,
				start: null,
				stop: null
			},
			_create: function _create() {

				if (this.options.helper === "original") {
					this._setPositionRelative();
				}
				if (this.options.addClasses) {
					this._addClass("ui-draggable");
				}
				this._setHandleClassName();

				this._mouseInit();
			},

			_setOption: function _setOption(key, value) {
				this._super(key, value);
				if (key === "handle") {
					this._removeHandleClassName();
					this._setHandleClassName();
				}
			},

			_destroy: function _destroy() {
				if ((this.helper || this.element).is(".ui-draggable-dragging")) {
					this.destroyOnClear = true;
					return;
				}
				this._removeHandleClassName();
				this._mouseDestroy();
			},

			_mouseCapture: function _mouseCapture(event) {
				var o = this.options;

				if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
					return false;
				}

				this.handle = this._getHandle(event);
				if (!this.handle) {
					return false;
				}

				this._blurActiveElement(event);

				this._blockFrames(o.iframeFix === true ? "iframe" : o.iframeFix);

				return true;
			},

			_blockFrames: function _blockFrames(selector) {
				this.iframeBlocks = this.document.find(selector).map(function () {
					var iframe = $(this);

					return $("<div>").css("position", "absolute").appendTo(iframe.parent()).outerWidth(iframe.outerWidth()).outerHeight(iframe.outerHeight()).offset(iframe.offset())[0];
				});
			},

			_unblockFrames: function _unblockFrames() {
				if (this.iframeBlocks) {
					this.iframeBlocks.remove();
					delete this.iframeBlocks;
				}
			},

			_blurActiveElement: function _blurActiveElement(event) {
				var activeElement = $.ui.safeActiveElement(this.document[0]),
				    target = $(event.target);

				if (target.closest(activeElement).length) {
					return;
				}

				$.ui.safeBlur(activeElement);
			},

			_mouseStart: function _mouseStart(event) {

				var o = this.options;

				this.helper = this._createHelper(event);

				this._addClass(this.helper, "ui-draggable-dragging");

				this._cacheHelperProportions();

				if ($.ui.ddmanager) {
					$.ui.ddmanager.current = this;
				}

				this._cacheMargins();

				this.cssPosition = this.helper.css("position");
				this.scrollParent = this.helper.scrollParent(true);
				this.offsetParent = this.helper.offsetParent();
				this.hasFixedAncestor = this.helper.parents().filter(function () {
					return $(this).css("position") === "fixed";
				}).length > 0;

				this.positionAbs = this.element.offset();
				this._refreshOffsets(event);

				this.originalPosition = this.position = this._generatePosition(event, false);
				this.originalPageX = event.pageX;
				this.originalPageY = event.pageY;

				o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);

				this._setContainment();

				if (this._trigger("start", event) === false) {
					this._clear();
					return false;
				}

				this._cacheHelperProportions();

				if ($.ui.ddmanager && !o.dropBehaviour) {
					$.ui.ddmanager.prepareOffsets(this, event);
				}

				this._mouseDrag(event, true);

				if ($.ui.ddmanager) {
					$.ui.ddmanager.dragStart(this, event);
				}

				return true;
			},

			_refreshOffsets: function _refreshOffsets(event) {
				this.offset = {
					top: this.positionAbs.top - this.margins.top,
					left: this.positionAbs.left - this.margins.left,
					scroll: false,
					parent: this._getParentOffset(),
					relative: this._getRelativeOffset()
				};

				this.offset.click = {
					left: event.pageX - this.offset.left,
					top: event.pageY - this.offset.top
				};
			},

			_mouseDrag: function _mouseDrag(event, noPropagation) {
				if (this.hasFixedAncestor) {
					this.offset.parent = this._getParentOffset();
				}

				this.position = this._generatePosition(event, true);
				this.positionAbs = this._convertPositionTo("absolute");

				if (!noPropagation) {
					var ui = this._uiHash();
					if (this._trigger("drag", event, ui) === false) {
						this._mouseUp(new $.Event("mouseup", event));
						return false;
					}
					this.position = ui.position;
				}

				this.helper[0].style.left = this.position.left + "px";
				this.helper[0].style.top = this.position.top + "px";

				if ($.ui.ddmanager) {
					$.ui.ddmanager.drag(this, event);
				}

				return false;
			},

			_mouseStop: function _mouseStop(event) {
				var that = this,
				    dropped = false;
				if ($.ui.ddmanager && !this.options.dropBehaviour) {
					dropped = $.ui.ddmanager.drop(this, event);
				}

				if (this.dropped) {
					dropped = this.dropped;
					this.dropped = false;
				}

				if (this.options.revert === "invalid" && !dropped || this.options.revert === "valid" && dropped || this.options.revert === true || $.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped)) {
					$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
						if (that._trigger("stop", event) !== false) {
							that._clear();
						}
					});
				} else {
					if (this._trigger("stop", event) !== false) {
						this._clear();
					}
				}

				return false;
			},

			_mouseUp: function _mouseUp(event) {
				this._unblockFrames();

				if ($.ui.ddmanager) {
					$.ui.ddmanager.dragStop(this, event);
				}

				if (this.handleElement.is(event.target)) {
					this.element.trigger("focus");
				}

				return $.ui.mouse.prototype._mouseUp.call(this, event);
			},

			cancel: function cancel() {

				if (this.helper.is(".ui-draggable-dragging")) {
					this._mouseUp(new $.Event("mouseup", { target: this.element[0] }));
				} else {
					this._clear();
				}

				return this;
			},

			_getHandle: function _getHandle(event) {
				return this.options.handle ? !!$(event.target).closest(this.element.find(this.options.handle)).length : true;
			},

			_setHandleClassName: function _setHandleClassName() {
				this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element;
				this._addClass(this.handleElement, "ui-draggable-handle");
			},

			_removeHandleClassName: function _removeHandleClassName() {
				this._removeClass(this.handleElement, "ui-draggable-handle");
			},

			_createHelper: function _createHelper(event) {

				var o = this.options,
				    helperIsFunction = $.isFunction(o.helper),
				    helper = helperIsFunction ? $(o.helper.apply(this.element[0], [event])) : o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element;

				if (!helper.parents("body").length) {
					helper.appendTo(o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo);
				}

				if (helperIsFunction && helper[0] === this.element[0]) {
					this._setPositionRelative();
				}

				if (helper[0] !== this.element[0] && !/(fixed|absolute)/.test(helper.css("position"))) {
					helper.css("position", "absolute");
				}

				return helper;
			},

			_setPositionRelative: function _setPositionRelative() {
				if (!/^(?:r|a|f)/.test(this.element.css("position"))) {
					this.element[0].style.position = "relative";
				}
			},

			_adjustOffsetFromHelper: function _adjustOffsetFromHelper(obj) {
				if (typeof obj === "string") {
					obj = obj.split(" ");
				}
				if ($.isArray(obj)) {
					obj = { left: +obj[0], top: +obj[1] || 0 };
				}
				if ("left" in obj) {
					this.offset.click.left = obj.left + this.margins.left;
				}
				if ("right" in obj) {
					this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
				}
				if ("top" in obj) {
					this.offset.click.top = obj.top + this.margins.top;
				}
				if ("bottom" in obj) {
					this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
				}
			},

			_isRootNode: function _isRootNode(element) {
				return (/(html|body)/i.test(element.tagName) || element === this.document[0]
				);
			},

			_getParentOffset: function _getParentOffset() {
				var po = this.offsetParent.offset(),
				    document = this.document[0];

				if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
					po.left += this.scrollParent.scrollLeft();
					po.top += this.scrollParent.scrollTop();
				}

				if (this._isRootNode(this.offsetParent[0])) {
					po = { top: 0, left: 0 };
				}

				return {
					top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
					left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
				};
			},

			_getRelativeOffset: function _getRelativeOffset() {
				if (this.cssPosition !== "relative") {
					return { top: 0, left: 0 };
				}

				var p = this.element.position(),
				    scrollIsRootNode = this._isRootNode(this.scrollParent[0]);

				return {
					top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + (!scrollIsRootNode ? this.scrollParent.scrollTop() : 0),
					left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + (!scrollIsRootNode ? this.scrollParent.scrollLeft() : 0)
				};
			},

			_cacheMargins: function _cacheMargins() {
				this.margins = {
					left: parseInt(this.element.css("marginLeft"), 10) || 0,
					top: parseInt(this.element.css("marginTop"), 10) || 0,
					right: parseInt(this.element.css("marginRight"), 10) || 0,
					bottom: parseInt(this.element.css("marginBottom"), 10) || 0
				};
			},

			_cacheHelperProportions: function _cacheHelperProportions() {
				this.helperProportions = {
					width: this.helper.outerWidth(),
					height: this.helper.outerHeight()
				};
			},

			_setContainment: function _setContainment() {

				var isUserScrollable,
				    c,
				    ce,
				    o = this.options,
				    document = this.document[0];

				this.relativeContainer = null;

				if (!o.containment) {
					this.containment = null;
					return;
				}

				if (o.containment === "window") {
					this.containment = [$(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, $(window).scrollLeft() + $(window).width() - this.helperProportions.width - this.margins.left, $(window).scrollTop() + ($(window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
					return;
				}

				if (o.containment === "document") {
					this.containment = [0, 0, $(document).width() - this.helperProportions.width - this.margins.left, ($(document).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
					return;
				}

				if (o.containment.constructor === Array) {
					this.containment = o.containment;
					return;
				}

				if (o.containment === "parent") {
					o.containment = this.helper[0].parentNode;
				}

				c = $(o.containment);
				ce = c[0];

				if (!ce) {
					return;
				}

				isUserScrollable = /(scroll|auto)/.test(c.css("overflow"));

				this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (isUserScrollable ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (isUserScrollable ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
				this.relativeContainer = c;
			},

			_convertPositionTo: function _convertPositionTo(d, pos) {

				if (!pos) {
					pos = this.position;
				}

				var mod = d === "absolute" ? 1 : -1,
				    scrollIsRootNode = this._isRootNode(this.scrollParent[0]);

				return {
					top: pos.top + this.offset.relative.top * mod + this.offset.parent.top * mod - (this.cssPosition === "fixed" ? -this.offset.scroll.top : scrollIsRootNode ? 0 : this.offset.scroll.top) * mod,
					left: pos.left + this.offset.relative.left * mod + this.offset.parent.left * mod - (this.cssPosition === "fixed" ? -this.offset.scroll.left : scrollIsRootNode ? 0 : this.offset.scroll.left) * mod
				};
			},

			_generatePosition: function _generatePosition(event, constrainPosition) {

				var containment,
				    co,
				    top,
				    left,
				    o = this.options,
				    scrollIsRootNode = this._isRootNode(this.scrollParent[0]),
				    pageX = event.pageX,
				    pageY = event.pageY;

				if (!scrollIsRootNode || !this.offset.scroll) {
					this.offset.scroll = {
						top: this.scrollParent.scrollTop(),
						left: this.scrollParent.scrollLeft()
					};
				}

				if (constrainPosition) {
					if (this.containment) {
						if (this.relativeContainer) {
							co = this.relativeContainer.offset();
							containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top];
						} else {
							containment = this.containment;
						}

						if (event.pageX - this.offset.click.left < containment[0]) {
							pageX = containment[0] + this.offset.click.left;
						}
						if (event.pageY - this.offset.click.top < containment[1]) {
							pageY = containment[1] + this.offset.click.top;
						}
						if (event.pageX - this.offset.click.left > containment[2]) {
							pageX = containment[2] + this.offset.click.left;
						}
						if (event.pageY - this.offset.click.top > containment[3]) {
							pageY = containment[3] + this.offset.click.top;
						}
					}

					if (o.grid) {
						top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
						pageY = containment ? top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3] ? top : top - this.offset.click.top >= containment[1] ? top - o.grid[1] : top + o.grid[1] : top;

						left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
						pageX = containment ? left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2] ? left : left - this.offset.click.left >= containment[0] ? left - o.grid[0] : left + o.grid[0] : left;
					}

					if (o.axis === "y") {
						pageX = this.originalPageX;
					}

					if (o.axis === "x") {
						pageY = this.originalPageY;
					}
				}

				return {
					top: pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition === "fixed" ? -this.offset.scroll.top : scrollIsRootNode ? 0 : this.offset.scroll.top),
					left: pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition === "fixed" ? -this.offset.scroll.left : scrollIsRootNode ? 0 : this.offset.scroll.left)
				};
			},

			_clear: function _clear() {
				this._removeClass(this.helper, "ui-draggable-dragging");
				if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
					this.helper.remove();
				}
				this.helper = null;
				this.cancelHelperRemoval = false;
				if (this.destroyOnClear) {
					this.destroy();
				}
			},

			_trigger: function _trigger(type, event, ui) {
				ui = ui || this._uiHash();
				$.ui.plugin.call(this, type, [event, ui, this], true);

				if (/^(drag|start|stop)/.test(type)) {
					this.positionAbs = this._convertPositionTo("absolute");
					ui.offset = this.positionAbs;
				}
				return $.Widget.prototype._trigger.call(this, type, event, ui);
			},

			plugins: {},

			_uiHash: function _uiHash() {
				return {
					helper: this.helper,
					position: this.position,
					originalPosition: this.originalPosition,
					offset: this.positionAbs
				};
			}

		});

		$.ui.plugin.add("draggable", "connectToSortable", {
			start: function start(event, ui, draggable) {
				var uiSortable = $.extend({}, ui, {
					item: draggable.element
				});

				draggable.sortables = [];
				$(draggable.options.connectToSortable).each(function () {
					var sortable = $(this).sortable("instance");

					if (sortable && !sortable.options.disabled) {
						draggable.sortables.push(sortable);

						sortable.refreshPositions();
						sortable._trigger("activate", event, uiSortable);
					}
				});
			},
			stop: function stop(event, ui, draggable) {
				var uiSortable = $.extend({}, ui, {
					item: draggable.element
				});

				draggable.cancelHelperRemoval = false;

				$.each(draggable.sortables, function () {
					var sortable = this;

					if (sortable.isOver) {
						sortable.isOver = 0;

						draggable.cancelHelperRemoval = true;
						sortable.cancelHelperRemoval = false;

						sortable._storedCSS = {
							position: sortable.placeholder.css("position"),
							top: sortable.placeholder.css("top"),
							left: sortable.placeholder.css("left")
						};

						sortable._mouseStop(event);

						sortable.options.helper = sortable.options._helper;
					} else {
						sortable.cancelHelperRemoval = true;

						sortable._trigger("deactivate", event, uiSortable);
					}
				});
			},
			drag: function drag(event, ui, draggable) {
				$.each(draggable.sortables, function () {
					var innermostIntersecting = false,
					    sortable = this;

					sortable.positionAbs = draggable.positionAbs;
					sortable.helperProportions = draggable.helperProportions;
					sortable.offset.click = draggable.offset.click;

					if (sortable._intersectsWith(sortable.containerCache)) {
						innermostIntersecting = true;

						$.each(draggable.sortables, function () {
							this.positionAbs = draggable.positionAbs;
							this.helperProportions = draggable.helperProportions;
							this.offset.click = draggable.offset.click;

							if (this !== sortable && this._intersectsWith(this.containerCache) && $.contains(sortable.element[0], this.element[0])) {
								innermostIntersecting = false;
							}

							return innermostIntersecting;
						});
					}

					if (innermostIntersecting) {
						if (!sortable.isOver) {
							sortable.isOver = 1;

							draggable._parent = ui.helper.parent();

							sortable.currentItem = ui.helper.appendTo(sortable.element).data("ui-sortable-item", true);

							sortable.options._helper = sortable.options.helper;

							sortable.options.helper = function () {
								return ui.helper[0];
							};

							event.target = sortable.currentItem[0];
							sortable._mouseCapture(event, true);
							sortable._mouseStart(event, true, true);

							sortable.offset.click.top = draggable.offset.click.top;
							sortable.offset.click.left = draggable.offset.click.left;
							sortable.offset.parent.left -= draggable.offset.parent.left - sortable.offset.parent.left;
							sortable.offset.parent.top -= draggable.offset.parent.top - sortable.offset.parent.top;

							draggable._trigger("toSortable", event);

							draggable.dropped = sortable.element;

							$.each(draggable.sortables, function () {
								this.refreshPositions();
							});

							draggable.currentItem = draggable.element;
							sortable.fromOutside = draggable;
						}

						if (sortable.currentItem) {
							sortable._mouseDrag(event);

							ui.position = sortable.position;
						}
					} else {
						if (sortable.isOver) {

							sortable.isOver = 0;
							sortable.cancelHelperRemoval = true;

							sortable.options._revert = sortable.options.revert;
							sortable.options.revert = false;

							sortable._trigger("out", event, sortable._uiHash(sortable));
							sortable._mouseStop(event, true);

							sortable.options.revert = sortable.options._revert;
							sortable.options.helper = sortable.options._helper;

							if (sortable.placeholder) {
								sortable.placeholder.remove();
							}

							ui.helper.appendTo(draggable._parent);
							draggable._refreshOffsets(event);
							ui.position = draggable._generatePosition(event, true);

							draggable._trigger("fromSortable", event);

							draggable.dropped = false;

							$.each(draggable.sortables, function () {
								this.refreshPositions();
							});
						}
					}
				});
			}
		});

		$.ui.plugin.add("draggable", "cursor", {
			start: function start(event, ui, instance) {
				var t = $("body"),
				    o = instance.options;

				if (t.css("cursor")) {
					o._cursor = t.css("cursor");
				}
				t.css("cursor", o.cursor);
			},
			stop: function stop(event, ui, instance) {
				var o = instance.options;
				if (o._cursor) {
					$("body").css("cursor", o._cursor);
				}
			}
		});

		$.ui.plugin.add("draggable", "opacity", {
			start: function start(event, ui, instance) {
				var t = $(ui.helper),
				    o = instance.options;
				if (t.css("opacity")) {
					o._opacity = t.css("opacity");
				}
				t.css("opacity", o.opacity);
			},
			stop: function stop(event, ui, instance) {
				var o = instance.options;
				if (o._opacity) {
					$(ui.helper).css("opacity", o._opacity);
				}
			}
		});

		$.ui.plugin.add("draggable", "scroll", {
			start: function start(event, ui, i) {
				if (!i.scrollParentNotHidden) {
					i.scrollParentNotHidden = i.helper.scrollParent(false);
				}

				if (i.scrollParentNotHidden[0] !== i.document[0] && i.scrollParentNotHidden[0].tagName !== "HTML") {
					i.overflowOffset = i.scrollParentNotHidden.offset();
				}
			},
			drag: function drag(event, ui, i) {

				var o = i.options,
				    scrolled = false,
				    scrollParent = i.scrollParentNotHidden[0],
				    document = i.document[0];

				if (scrollParent !== document && scrollParent.tagName !== "HTML") {
					if (!o.axis || o.axis !== "x") {
						if (i.overflowOffset.top + scrollParent.offsetHeight - event.pageY < o.scrollSensitivity) {
							scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
						} else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
							scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
						}
					}

					if (!o.axis || o.axis !== "y") {
						if (i.overflowOffset.left + scrollParent.offsetWidth - event.pageX < o.scrollSensitivity) {
							scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
						} else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
							scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
						}
					}
				} else {

					if (!o.axis || o.axis !== "x") {
						if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
							scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
						} else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
							scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
						}
					}

					if (!o.axis || o.axis !== "y") {
						if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
							scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
						} else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
							scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
						}
					}
				}

				if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
					$.ui.ddmanager.prepareOffsets(i, event);
				}
			}
		});

		$.ui.plugin.add("draggable", "snap", {
			start: function start(event, ui, i) {

				var o = i.options;

				i.snapElements = [];

				$(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each(function () {
					var $t = $(this),
					    $o = $t.offset();
					if (this !== i.element[0]) {
						i.snapElements.push({
							item: this,
							width: $t.outerWidth(), height: $t.outerHeight(),
							top: $o.top, left: $o.left
						});
					}
				});
			},
			drag: function drag(event, ui, inst) {

				var ts,
				    bs,
				    ls,
				    rs,
				    l,
				    r,
				    t,
				    b,
				    i,
				    first,
				    o = inst.options,
				    d = o.snapTolerance,
				    x1 = ui.offset.left,
				    x2 = x1 + inst.helperProportions.width,
				    y1 = ui.offset.top,
				    y2 = y1 + inst.helperProportions.height;

				for (i = inst.snapElements.length - 1; i >= 0; i--) {

					l = inst.snapElements[i].left - inst.margins.left;
					r = l + inst.snapElements[i].width;
					t = inst.snapElements[i].top - inst.margins.top;
					b = t + inst.snapElements[i].height;

					if (x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains(inst.snapElements[i].item.ownerDocument, inst.snapElements[i].item)) {
						if (inst.snapElements[i].snapping) {
							inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item }));
						}
						inst.snapElements[i].snapping = false;
						continue;
					}

					if (o.snapMode !== "inner") {
						ts = Math.abs(t - y2) <= d;
						bs = Math.abs(b - y1) <= d;
						ls = Math.abs(l - x2) <= d;
						rs = Math.abs(r - x1) <= d;
						if (ts) {
							ui.position.top = inst._convertPositionTo("relative", {
								top: t - inst.helperProportions.height,
								left: 0
							}).top;
						}
						if (bs) {
							ui.position.top = inst._convertPositionTo("relative", {
								top: b,
								left: 0
							}).top;
						}
						if (ls) {
							ui.position.left = inst._convertPositionTo("relative", {
								top: 0,
								left: l - inst.helperProportions.width
							}).left;
						}
						if (rs) {
							ui.position.left = inst._convertPositionTo("relative", {
								top: 0,
								left: r
							}).left;
						}
					}

					first = ts || bs || ls || rs;

					if (o.snapMode !== "outer") {
						ts = Math.abs(t - y1) <= d;
						bs = Math.abs(b - y2) <= d;
						ls = Math.abs(l - x1) <= d;
						rs = Math.abs(r - x2) <= d;
						if (ts) {
							ui.position.top = inst._convertPositionTo("relative", {
								top: t,
								left: 0
							}).top;
						}
						if (bs) {
							ui.position.top = inst._convertPositionTo("relative", {
								top: b - inst.helperProportions.height,
								left: 0
							}).top;
						}
						if (ls) {
							ui.position.left = inst._convertPositionTo("relative", {
								top: 0,
								left: l
							}).left;
						}
						if (rs) {
							ui.position.left = inst._convertPositionTo("relative", {
								top: 0,
								left: r - inst.helperProportions.width
							}).left;
						}
					}

					if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
						inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
							snapItem: inst.snapElements[i].item
						}));
					}
					inst.snapElements[i].snapping = ts || bs || ls || rs || first;
				}
			}
		});

		$.ui.plugin.add("draggable", "stack", {
			start: function start(event, ui, instance) {
				var min,
				    o = instance.options,
				    group = $.makeArray($(o.stack)).sort(function (a, b) {
					return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
				});

				if (!group.length) {
					return;
				}

				min = parseInt($(group[0]).css("zIndex"), 10) || 0;
				$(group).each(function (i) {
					$(this).css("zIndex", min + i);
				});
				this.css("zIndex", min + group.length);
			}
		});

		$.ui.plugin.add("draggable", "zIndex", {
			start: function start(event, ui, instance) {
				var t = $(ui.helper),
				    o = instance.options;

				if (t.css("zIndex")) {
					o._zIndex = t.css("zIndex");
				}
				t.css("zIndex", o.zIndex);
			},
			stop: function stop(event, ui, instance) {
				var o = instance.options;

				if (o._zIndex) {
					$(ui.helper).css("zIndex", o._zIndex);
				}
			}
		});

		var widgetsDraggable = $.ui.draggable;

		$.widget("ui.resizable", $.ui.mouse, {
			version: "1.12.1",
			widgetEventPrefix: "resize",
			options: {
				alsoResize: false,
				animate: false,
				animateDuration: "slow",
				animateEasing: "swing",
				aspectRatio: false,
				autoHide: false,
				classes: {
					"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
				},
				containment: false,
				ghost: false,
				grid: false,
				handles: "e,s,se",
				helper: false,
				maxHeight: null,
				maxWidth: null,
				minHeight: 10,
				minWidth: 10,

				zIndex: 90,

				resize: null,
				start: null,
				stop: null
			},

			_num: function _num(value) {
				return parseFloat(value) || 0;
			},

			_isNumber: function _isNumber(value) {
				return !isNaN(parseFloat(value));
			},

			_hasScroll: function _hasScroll(el, a) {

				if ($(el).css("overflow") === "hidden") {
					return false;
				}

				var scroll = a && a === "left" ? "scrollLeft" : "scrollTop",
				    has = false;

				if (el[scroll] > 0) {
					return true;
				}

				el[scroll] = 1;
				has = el[scroll] > 0;
				el[scroll] = 0;
				return has;
			},

			_create: function _create() {

				var margins,
				    o = this.options,
				    that = this;
				this._addClass("ui-resizable");

				$.extend(this, {
					_aspectRatio: !!o.aspectRatio,
					aspectRatio: o.aspectRatio,
					originalElement: this.element,
					_proportionallyResizeElements: [],
					_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
				});

				if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {

					this.element.wrap($("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
						position: this.element.css("position"),
						width: this.element.outerWidth(),
						height: this.element.outerHeight(),
						top: this.element.css("top"),
						left: this.element.css("left")
					}));

					this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance"));

					this.elementIsWrapper = true;

					margins = {
						marginTop: this.originalElement.css("marginTop"),
						marginRight: this.originalElement.css("marginRight"),
						marginBottom: this.originalElement.css("marginBottom"),
						marginLeft: this.originalElement.css("marginLeft")
					};

					this.element.css(margins);
					this.originalElement.css("margin", 0);

					this.originalResizeStyle = this.originalElement.css("resize");
					this.originalElement.css("resize", "none");

					this._proportionallyResizeElements.push(this.originalElement.css({
						position: "static",
						zoom: 1,
						display: "block"
					}));

					this.originalElement.css(margins);

					this._proportionallyResize();
				}

				this._setupHandles();

				if (o.autoHide) {
					$(this.element).on("mouseenter", function () {
						if (o.disabled) {
							return;
						}
						that._removeClass("ui-resizable-autohide");
						that._handles.show();
					}).on("mouseleave", function () {
						if (o.disabled) {
							return;
						}
						if (!that.resizing) {
							that._addClass("ui-resizable-autohide");
							that._handles.hide();
						}
					});
				}

				this._mouseInit();
			},

			_destroy: function _destroy() {

				this._mouseDestroy();

				var wrapper,
				    _destroy = function _destroy(exp) {
					$(exp).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove();
				};

				if (this.elementIsWrapper) {
					_destroy(this.element);
					wrapper = this.element;
					this.originalElement.css({
						position: wrapper.css("position"),
						width: wrapper.outerWidth(),
						height: wrapper.outerHeight(),
						top: wrapper.css("top"),
						left: wrapper.css("left")
					}).insertAfter(wrapper);
					wrapper.remove();
				}

				this.originalElement.css("resize", this.originalResizeStyle);
				_destroy(this.originalElement);

				return this;
			},

			_setOption: function _setOption(key, value) {
				this._super(key, value);

				switch (key) {
					case "handles":
						this._removeHandles();
						this._setupHandles();
						break;
					default:
						break;
				}
			},

			_setupHandles: function _setupHandles() {
				var o = this.options,
				    handle,
				    i,
				    n,
				    hname,
				    axis,
				    that = this;
				this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				});

				this._handles = $();
				if (this.handles.constructor === String) {

					if (this.handles === "all") {
						this.handles = "n,e,s,w,se,sw,ne,nw";
					}

					n = this.handles.split(",");
					this.handles = {};

					for (i = 0; i < n.length; i++) {

						handle = $.trim(n[i]);
						hname = "ui-resizable-" + handle;
						axis = $("<div>");
						this._addClass(axis, "ui-resizable-handle " + hname);

						axis.css({ zIndex: o.zIndex });

						this.handles[handle] = ".ui-resizable-" + handle;
						this.element.append(axis);
					}
				}

				this._renderAxis = function (target) {

					var i, axis, padPos, padWrapper;

					target = target || this.element;

					for (i in this.handles) {

						if (this.handles[i].constructor === String) {
							this.handles[i] = this.element.children(this.handles[i]).first().show();
						} else if (this.handles[i].jquery || this.handles[i].nodeType) {
							this.handles[i] = $(this.handles[i]);
							this._on(this.handles[i], { "mousedown": that._mouseDown });
						}

						if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {
							axis = $(this.handles[i], this.element);

							padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

							padPos = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");

							target.css(padPos, padWrapper);

							this._proportionallyResize();
						}

						this._handles = this._handles.add(this.handles[i]);
					}
				};

				this._renderAxis(this.element);

				this._handles = this._handles.add(this.element.find(".ui-resizable-handle"));
				this._handles.disableSelection();

				this._handles.on("mouseover", function () {
					if (!that.resizing) {
						if (this.className) {
							axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
						}
						that.axis = axis && axis[1] ? axis[1] : "se";
					}
				});

				if (o.autoHide) {
					this._handles.hide();
					this._addClass("ui-resizable-autohide");
				}
			},

			_removeHandles: function _removeHandles() {
				this._handles.remove();
			},

			_mouseCapture: function _mouseCapture(event) {
				var i,
				    handle,
				    capture = false;

				for (i in this.handles) {
					handle = $(this.handles[i])[0];
					if (handle === event.target || $.contains(handle, event.target)) {
						capture = true;
					}
				}

				return !this.options.disabled && capture;
			},

			_mouseStart: function _mouseStart(event) {

				var curleft,
				    curtop,
				    cursor,
				    o = this.options,
				    el = this.element;

				this.resizing = true;

				this._renderProxy();

				curleft = this._num(this.helper.css("left"));
				curtop = this._num(this.helper.css("top"));

				if (o.containment) {
					curleft += $(o.containment).scrollLeft() || 0;
					curtop += $(o.containment).scrollTop() || 0;
				}

				this.offset = this.helper.offset();
				this.position = { left: curleft, top: curtop };

				this.size = this._helper ? {
					width: this.helper.width(),
					height: this.helper.height()
				} : {
					width: el.width(),
					height: el.height()
				};

				this.originalSize = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};

				this.sizeDiff = {
					width: el.outerWidth() - el.width(),
					height: el.outerHeight() - el.height()
				};

				this.originalPosition = { left: curleft, top: curtop };
				this.originalMousePosition = { left: event.pageX, top: event.pageY };

				this.aspectRatio = typeof o.aspectRatio === "number" ? o.aspectRatio : this.originalSize.width / this.originalSize.height || 1;

				cursor = $(".ui-resizable-" + this.axis).css("cursor");
				$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

				this._addClass("ui-resizable-resizing");
				this._propagate("start", event);
				return true;
			},

			_mouseDrag: function _mouseDrag(event) {

				var data,
				    props,
				    smp = this.originalMousePosition,
				    a = this.axis,
				    dx = event.pageX - smp.left || 0,
				    dy = event.pageY - smp.top || 0,
				    trigger = this._change[a];

				this._updatePrevProperties();

				if (!trigger) {
					return false;
				}

				data = trigger.apply(this, [event, dx, dy]);

				this._updateVirtualBoundaries(event.shiftKey);
				if (this._aspectRatio || event.shiftKey) {
					data = this._updateRatio(data, event);
				}

				data = this._respectSize(data, event);

				this._updateCache(data);

				this._propagate("resize", event);

				props = this._applyChanges();

				if (!this._helper && this._proportionallyResizeElements.length) {
					this._proportionallyResize();
				}

				if (!$.isEmptyObject(props)) {
					this._updatePrevProperties();
					this._trigger("resize", event, this.ui());
					this._applyChanges();
				}

				return false;
			},

			_mouseStop: function _mouseStop(event) {

				this.resizing = false;
				var pr,
				    ista,
				    soffseth,
				    soffsetw,
				    s,
				    left,
				    top,
				    o = this.options,
				    that = this;

				if (this._helper) {

					pr = this._proportionallyResizeElements;
					ista = pr.length && /textarea/i.test(pr[0].nodeName);
					soffseth = ista && this._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
					soffsetw = ista ? 0 : that.sizeDiff.width;

					s = {
						width: that.helper.width() - soffsetw,
						height: that.helper.height() - soffseth
					};
					left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null;
					top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;

					if (!o.animate) {
						this.element.css($.extend(s, { top: top, left: left }));
					}

					that.helper.height(that.size.height);
					that.helper.width(that.size.width);

					if (this._helper && !o.animate) {
						this._proportionallyResize();
					}
				}

				$("body").css("cursor", "auto");

				this._removeClass("ui-resizable-resizing");

				this._propagate("stop", event);

				if (this._helper) {
					this.helper.remove();
				}

				return false;
			},

			_updatePrevProperties: function _updatePrevProperties() {
				this.prevPosition = {
					top: this.position.top,
					left: this.position.left
				};
				this.prevSize = {
					width: this.size.width,
					height: this.size.height
				};
			},

			_applyChanges: function _applyChanges() {
				var props = {};

				if (this.position.top !== this.prevPosition.top) {
					props.top = this.position.top + "px";
				}
				if (this.position.left !== this.prevPosition.left) {
					props.left = this.position.left + "px";
				}
				if (this.size.width !== this.prevSize.width) {
					props.width = this.size.width + "px";
				}
				if (this.size.height !== this.prevSize.height) {
					props.height = this.size.height + "px";
				}

				this.helper.css(props);

				return props;
			},

			_updateVirtualBoundaries: function _updateVirtualBoundaries(forceAspectRatio) {
				var pMinWidth,
				    pMaxWidth,
				    pMinHeight,
				    pMaxHeight,
				    b,
				    o = this.options;

				b = {
					minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
					maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
					minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
					maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity
				};

				if (this._aspectRatio || forceAspectRatio) {
					pMinWidth = b.minHeight * this.aspectRatio;
					pMinHeight = b.minWidth / this.aspectRatio;
					pMaxWidth = b.maxHeight * this.aspectRatio;
					pMaxHeight = b.maxWidth / this.aspectRatio;

					if (pMinWidth > b.minWidth) {
						b.minWidth = pMinWidth;
					}
					if (pMinHeight > b.minHeight) {
						b.minHeight = pMinHeight;
					}
					if (pMaxWidth < b.maxWidth) {
						b.maxWidth = pMaxWidth;
					}
					if (pMaxHeight < b.maxHeight) {
						b.maxHeight = pMaxHeight;
					}
				}
				this._vBoundaries = b;
			},

			_updateCache: function _updateCache(data) {
				this.offset = this.helper.offset();
				if (this._isNumber(data.left)) {
					this.position.left = data.left;
				}
				if (this._isNumber(data.top)) {
					this.position.top = data.top;
				}
				if (this._isNumber(data.height)) {
					this.size.height = data.height;
				}
				if (this._isNumber(data.width)) {
					this.size.width = data.width;
				}
			},

			_updateRatio: function _updateRatio(data) {

				var cpos = this.position,
				    csize = this.size,
				    a = this.axis;

				if (this._isNumber(data.height)) {
					data.width = data.height * this.aspectRatio;
				} else if (this._isNumber(data.width)) {
					data.height = data.width / this.aspectRatio;
				}

				if (a === "sw") {
					data.left = cpos.left + (csize.width - data.width);
					data.top = null;
				}
				if (a === "nw") {
					data.top = cpos.top + (csize.height - data.height);
					data.left = cpos.left + (csize.width - data.width);
				}

				return data;
			},

			_respectSize: function _respectSize(data) {

				var o = this._vBoundaries,
				    a = this.axis,
				    ismaxw = this._isNumber(data.width) && o.maxWidth && o.maxWidth < data.width,
				    ismaxh = this._isNumber(data.height) && o.maxHeight && o.maxHeight < data.height,
				    isminw = this._isNumber(data.width) && o.minWidth && o.minWidth > data.width,
				    isminh = this._isNumber(data.height) && o.minHeight && o.minHeight > data.height,
				    dw = this.originalPosition.left + this.originalSize.width,
				    dh = this.originalPosition.top + this.originalSize.height,
				    cw = /sw|nw|w/.test(a),
				    ch = /nw|ne|n/.test(a);
				if (isminw) {
					data.width = o.minWidth;
				}
				if (isminh) {
					data.height = o.minHeight;
				}
				if (ismaxw) {
					data.width = o.maxWidth;
				}
				if (ismaxh) {
					data.height = o.maxHeight;
				}

				if (isminw && cw) {
					data.left = dw - o.minWidth;
				}
				if (ismaxw && cw) {
					data.left = dw - o.maxWidth;
				}
				if (isminh && ch) {
					data.top = dh - o.minHeight;
				}
				if (ismaxh && ch) {
					data.top = dh - o.maxHeight;
				}

				if (!data.width && !data.height && !data.left && data.top) {
					data.top = null;
				} else if (!data.width && !data.height && !data.top && data.left) {
					data.left = null;
				}

				return data;
			},

			_getPaddingPlusBorderDimensions: function _getPaddingPlusBorderDimensions(element) {
				var i = 0,
				    widths = [],
				    borders = [element.css("borderTopWidth"), element.css("borderRightWidth"), element.css("borderBottomWidth"), element.css("borderLeftWidth")],
				    paddings = [element.css("paddingTop"), element.css("paddingRight"), element.css("paddingBottom"), element.css("paddingLeft")];

				for (; i < 4; i++) {
					widths[i] = parseFloat(borders[i]) || 0;
					widths[i] += parseFloat(paddings[i]) || 0;
				}

				return {
					height: widths[0] + widths[2],
					width: widths[1] + widths[3]
				};
			},

			_proportionallyResize: function _proportionallyResize() {

				if (!this._proportionallyResizeElements.length) {
					return;
				}

				var prel,
				    i = 0,
				    element = this.helper || this.element;

				for (; i < this._proportionallyResizeElements.length; i++) {

					prel = this._proportionallyResizeElements[i];

					if (!this.outerDimensions) {
						this.outerDimensions = this._getPaddingPlusBorderDimensions(prel);
					}

					prel.css({
						height: element.height() - this.outerDimensions.height || 0,
						width: element.width() - this.outerDimensions.width || 0
					});
				}
			},

			_renderProxy: function _renderProxy() {

				var el = this.element,
				    o = this.options;
				this.elementOffset = el.offset();

				if (this._helper) {

					this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

					this._addClass(this.helper, this._helper);
					this.helper.css({
						width: this.element.outerWidth(),
						height: this.element.outerHeight(),
						position: "absolute",
						left: this.elementOffset.left + "px",
						top: this.elementOffset.top + "px",
						zIndex: ++o.zIndex });

					this.helper.appendTo("body").disableSelection();
				} else {
					this.helper = this.element;
				}
			},

			_change: {
				e: function e(event, dx) {
					return { width: this.originalSize.width + dx };
				},
				w: function w(event, dx) {
					var cs = this.originalSize,
					    sp = this.originalPosition;
					return { left: sp.left + dx, width: cs.width - dx };
				},
				n: function n(event, dx, dy) {
					var cs = this.originalSize,
					    sp = this.originalPosition;
					return { top: sp.top + dy, height: cs.height - dy };
				},
				s: function s(event, dx, dy) {
					return { height: this.originalSize.height + dy };
				},
				se: function se(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				sw: function sw(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				},
				ne: function ne(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				nw: function nw(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				}
			},

			_propagate: function _propagate(n, event) {
				$.ui.plugin.call(this, n, [event, this.ui()]);
				n !== "resize" && this._trigger(n, event, this.ui());
			},

			plugins: {},

			ui: function ui() {
				return {
					originalElement: this.originalElement,
					element: this.element,
					helper: this.helper,
					position: this.position,
					size: this.size,
					originalSize: this.originalSize,
					originalPosition: this.originalPosition
				};
			}

		});

		$.ui.plugin.add("resizable", "animate", {

			stop: function stop(event) {
				var that = $(this).resizable("instance"),
				    o = that.options,
				    pr = that._proportionallyResizeElements,
				    ista = pr.length && /textarea/i.test(pr[0].nodeName),
				    soffseth = ista && that._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
				    soffsetw = ista ? 0 : that.sizeDiff.width,
				    style = {
					width: that.size.width - soffsetw,
					height: that.size.height - soffseth
				},
				    left = parseFloat(that.element.css("left")) + (that.position.left - that.originalPosition.left) || null,
				    top = parseFloat(that.element.css("top")) + (that.position.top - that.originalPosition.top) || null;

				that.element.animate($.extend(style, top && left ? { top: top, left: left } : {}), {
					duration: o.animateDuration,
					easing: o.animateEasing,
					step: function step() {

						var data = {
							width: parseFloat(that.element.css("width")),
							height: parseFloat(that.element.css("height")),
							top: parseFloat(that.element.css("top")),
							left: parseFloat(that.element.css("left"))
						};

						if (pr && pr.length) {
							$(pr[0]).css({ width: data.width, height: data.height });
						}

						that._updateCache(data);
						that._propagate("resize", event);
					}
				});
			}

		});

		$.ui.plugin.add("resizable", "containment", {

			start: function start() {
				var element,
				    p,
				    co,
				    ch,
				    cw,
				    width,
				    height,
				    that = $(this).resizable("instance"),
				    o = that.options,
				    el = that.element,
				    oc = o.containment,
				    ce = oc instanceof $ ? oc.get(0) : /parent/.test(oc) ? el.parent().get(0) : oc;

				if (!ce) {
					return;
				}

				that.containerElement = $(ce);

				if (/document/.test(oc) || oc === document) {
					that.containerOffset = {
						left: 0,
						top: 0
					};
					that.containerPosition = {
						left: 0,
						top: 0
					};

					that.parentData = {
						element: $(document),
						left: 0,
						top: 0,
						width: $(document).width(),
						height: $(document).height() || document.body.parentNode.scrollHeight
					};
				} else {
					element = $(ce);
					p = [];
					$(["Top", "Right", "Left", "Bottom"]).each(function (i, name) {
						p[i] = that._num(element.css("padding" + name));
					});

					that.containerOffset = element.offset();
					that.containerPosition = element.position();
					that.containerSize = {
						height: element.innerHeight() - p[3],
						width: element.innerWidth() - p[1]
					};

					co = that.containerOffset;
					ch = that.containerSize.height;
					cw = that.containerSize.width;
					width = that._hasScroll(ce, "left") ? ce.scrollWidth : cw;
					height = that._hasScroll(ce) ? ce.scrollHeight : ch;

					that.parentData = {
						element: ce,
						left: co.left,
						top: co.top,
						width: width,
						height: height
					};
				}
			},

			resize: function resize(event) {
				var woset,
				    hoset,
				    isParent,
				    isOffsetRelative,
				    that = $(this).resizable("instance"),
				    o = that.options,
				    co = that.containerOffset,
				    cp = that.position,
				    pRatio = that._aspectRatio || event.shiftKey,
				    cop = {
					top: 0,
					left: 0
				},
				    ce = that.containerElement,
				    continueResize = true;

				if (ce[0] !== document && /static/.test(ce.css("position"))) {
					cop = co;
				}

				if (cp.left < (that._helper ? co.left : 0)) {
					that.size.width = that.size.width + (that._helper ? that.position.left - co.left : that.position.left - cop.left);

					if (pRatio) {
						that.size.height = that.size.width / that.aspectRatio;
						continueResize = false;
					}
					that.position.left = o.helper ? co.left : 0;
				}

				if (cp.top < (that._helper ? co.top : 0)) {
					that.size.height = that.size.height + (that._helper ? that.position.top - co.top : that.position.top);

					if (pRatio) {
						that.size.width = that.size.height * that.aspectRatio;
						continueResize = false;
					}
					that.position.top = that._helper ? co.top : 0;
				}

				isParent = that.containerElement.get(0) === that.element.parent().get(0);
				isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

				if (isParent && isOffsetRelative) {
					that.offset.left = that.parentData.left + that.position.left;
					that.offset.top = that.parentData.top + that.position.top;
				} else {
					that.offset.left = that.element.offset().left;
					that.offset.top = that.element.offset().top;
				}

				woset = Math.abs(that.sizeDiff.width + (that._helper ? that.offset.left - cop.left : that.offset.left - co.left));

				hoset = Math.abs(that.sizeDiff.height + (that._helper ? that.offset.top - cop.top : that.offset.top - co.top));

				if (woset + that.size.width >= that.parentData.width) {
					that.size.width = that.parentData.width - woset;
					if (pRatio) {
						that.size.height = that.size.width / that.aspectRatio;
						continueResize = false;
					}
				}

				if (hoset + that.size.height >= that.parentData.height) {
					that.size.height = that.parentData.height - hoset;
					if (pRatio) {
						that.size.width = that.size.height * that.aspectRatio;
						continueResize = false;
					}
				}

				if (!continueResize) {
					that.position.left = that.prevPosition.left;
					that.position.top = that.prevPosition.top;
					that.size.width = that.prevSize.width;
					that.size.height = that.prevSize.height;
				}
			},

			stop: function stop() {
				var that = $(this).resizable("instance"),
				    o = that.options,
				    co = that.containerOffset,
				    cop = that.containerPosition,
				    ce = that.containerElement,
				    helper = $(that.helper),
				    ho = helper.offset(),
				    w = helper.outerWidth() - that.sizeDiff.width,
				    h = helper.outerHeight() - that.sizeDiff.height;

				if (that._helper && !o.animate && /relative/.test(ce.css("position"))) {
					$(this).css({
						left: ho.left - cop.left - co.left,
						width: w,
						height: h
					});
				}

				if (that._helper && !o.animate && /static/.test(ce.css("position"))) {
					$(this).css({
						left: ho.left - cop.left - co.left,
						width: w,
						height: h
					});
				}
			}
		});

		$.ui.plugin.add("resizable", "alsoResize", {

			start: function start() {
				var that = $(this).resizable("instance"),
				    o = that.options;

				$(o.alsoResize).each(function () {
					var el = $(this);
					el.data("ui-resizable-alsoresize", {
						width: parseFloat(el.width()), height: parseFloat(el.height()),
						left: parseFloat(el.css("left")), top: parseFloat(el.css("top"))
					});
				});
			},

			resize: function resize(event, ui) {
				var that = $(this).resizable("instance"),
				    o = that.options,
				    os = that.originalSize,
				    op = that.originalPosition,
				    delta = {
					height: that.size.height - os.height || 0,
					width: that.size.width - os.width || 0,
					top: that.position.top - op.top || 0,
					left: that.position.left - op.left || 0
				};

				$(o.alsoResize).each(function () {
					var el = $(this),
					    start = $(this).data("ui-resizable-alsoresize"),
					    style = {},
					    css = el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

					$.each(css, function (i, prop) {
						var sum = (start[prop] || 0) + (delta[prop] || 0);
						if (sum && sum >= 0) {
							style[prop] = sum || null;
						}
					});

					el.css(style);
				});
			},

			stop: function stop() {
				$(this).removeData("ui-resizable-alsoresize");
			}
		});

		$.ui.plugin.add("resizable", "ghost", {

			start: function start() {

				var that = $(this).resizable("instance"),
				    cs = that.size;

				that.ghost = that.originalElement.clone();
				that.ghost.css({
					opacity: 0.25,
					display: "block",
					position: "relative",
					height: cs.height,
					width: cs.width,
					margin: 0,
					left: 0,
					top: 0
				});

				that._addClass(that.ghost, "ui-resizable-ghost");

				if ($.uiBackCompat !== false && typeof that.options.ghost === "string") {
					that.ghost.addClass(this.options.ghost);
				}

				that.ghost.appendTo(that.helper);
			},

			resize: function resize() {
				var that = $(this).resizable("instance");
				if (that.ghost) {
					that.ghost.css({
						position: "relative",
						height: that.size.height,
						width: that.size.width
					});
				}
			},

			stop: function stop() {
				var that = $(this).resizable("instance");
				if (that.ghost && that.helper) {
					that.helper.get(0).removeChild(that.ghost.get(0));
				}
			}

		});

		$.ui.plugin.add("resizable", "grid", {

			resize: function resize() {
				var outerDimensions,
				    that = $(this).resizable("instance"),
				    o = that.options,
				    cs = that.size,
				    os = that.originalSize,
				    op = that.originalPosition,
				    a = that.axis,
				    grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
				    gridX = grid[0] || 1,
				    gridY = grid[1] || 1,
				    ox = Math.round((cs.width - os.width) / gridX) * gridX,
				    oy = Math.round((cs.height - os.height) / gridY) * gridY,
				    newWidth = os.width + ox,
				    newHeight = os.height + oy,
				    isMaxWidth = o.maxWidth && o.maxWidth < newWidth,
				    isMaxHeight = o.maxHeight && o.maxHeight < newHeight,
				    isMinWidth = o.minWidth && o.minWidth > newWidth,
				    isMinHeight = o.minHeight && o.minHeight > newHeight;

				o.grid = grid;

				if (isMinWidth) {
					newWidth += gridX;
				}
				if (isMinHeight) {
					newHeight += gridY;
				}
				if (isMaxWidth) {
					newWidth -= gridX;
				}
				if (isMaxHeight) {
					newHeight -= gridY;
				}

				if (/^(se|s|e)$/.test(a)) {
					that.size.width = newWidth;
					that.size.height = newHeight;
				} else if (/^(ne)$/.test(a)) {
					that.size.width = newWidth;
					that.size.height = newHeight;
					that.position.top = op.top - oy;
				} else if (/^(sw)$/.test(a)) {
					that.size.width = newWidth;
					that.size.height = newHeight;
					that.position.left = op.left - ox;
				} else {
					if (newHeight - gridY <= 0 || newWidth - gridX <= 0) {
						outerDimensions = that._getPaddingPlusBorderDimensions(this);
					}

					if (newHeight - gridY > 0) {
						that.size.height = newHeight;
						that.position.top = op.top - oy;
					} else {
						newHeight = gridY - outerDimensions.height;
						that.size.height = newHeight;
						that.position.top = op.top + os.height - newHeight;
					}
					if (newWidth - gridX > 0) {
						that.size.width = newWidth;
						that.position.left = op.left - ox;
					} else {
						newWidth = gridX - outerDimensions.width;
						that.size.width = newWidth;
						that.position.left = op.left + os.width - newWidth;
					}
				}
			}

		});

		var widgetsResizable = $.ui.resizable;

		$.widget("ui.dialog", {
			version: "1.12.1",
			options: {
				appendTo: "body",
				autoOpen: true,
				buttons: [],
				classes: {
					"ui-dialog": "ui-corner-all",
					"ui-dialog-titlebar": "ui-corner-all"
				},
				closeOnEscape: true,
				closeText: "Close",
				draggable: true,
				hide: null,
				height: "auto",
				maxHeight: null,
				maxWidth: null,
				minHeight: 150,
				minWidth: 150,
				modal: false,
				position: {
					my: "center",
					at: "center",
					of: window,
					collision: "fit",

					using: function using(pos) {
						var topOffset = $(this).css(pos).offset().top;
						if (topOffset < 0) {
							$(this).css("top", pos.top - topOffset);
						}
					}
				},
				resizable: true,
				show: null,
				title: null,
				width: 300,

				beforeClose: null,
				close: null,
				drag: null,
				dragStart: null,
				dragStop: null,
				focus: null,
				open: null,
				resize: null,
				resizeStart: null,
				resizeStop: null
			},

			sizeRelatedOptions: {
				buttons: true,
				height: true,
				maxHeight: true,
				maxWidth: true,
				minHeight: true,
				minWidth: true,
				width: true
			},

			resizableRelatedOptions: {
				maxHeight: true,
				maxWidth: true,
				minHeight: true,
				minWidth: true
			},

			_create: function _create() {
				this.originalCss = {
					display: this.element[0].style.display,
					width: this.element[0].style.width,
					minHeight: this.element[0].style.minHeight,
					maxHeight: this.element[0].style.maxHeight,
					height: this.element[0].style.height
				};
				this.originalPosition = {
					parent: this.element.parent(),
					index: this.element.parent().children().index(this.element)
				};
				this.originalTitle = this.element.attr("title");
				if (this.options.title == null && this.originalTitle != null) {
					this.options.title = this.originalTitle;
				}

				if (this.options.disabled) {
					this.options.disabled = false;
				}

				this._createWrapper();

				this.element.show().removeAttr("title").appendTo(this.uiDialog);

				this._addClass("ui-dialog-content", "ui-widget-content");

				this._createTitlebar();
				this._createButtonPane();

				if (this.options.draggable && $.fn.draggable) {
					this._makeDraggable();
				}
				if (this.options.resizable && $.fn.resizable) {
					this._makeResizable();
				}

				this._isOpen = false;

				this._trackFocus();
			},

			_init: function _init() {
				if (this.options.autoOpen) {
					this.open();
				}
			},

			_appendTo: function _appendTo() {
				var element = this.options.appendTo;
				if (element && (element.jquery || element.nodeType)) {
					return $(element);
				}
				return this.document.find(element || "body").eq(0);
			},

			_destroy: function _destroy() {
				var next,
				    originalPosition = this.originalPosition;

				this._untrackInstance();
				this._destroyOverlay();

				this.element.removeUniqueId().css(this.originalCss).detach();

				this.uiDialog.remove();

				if (this.originalTitle) {
					this.element.attr("title", this.originalTitle);
				}

				next = originalPosition.parent.children().eq(originalPosition.index);

				if (next.length && next[0] !== this.element[0]) {
					next.before(this.element);
				} else {
					originalPosition.parent.append(this.element);
				}
			},

			widget: function widget() {
				return this.uiDialog;
			},

			disable: $.noop,
			enable: $.noop,

			close: function close(event) {
				var that = this;

				if (!this._isOpen || this._trigger("beforeClose", event) === false) {
					return;
				}

				this._isOpen = false;
				this._focusedElement = null;
				this._destroyOverlay();
				this._untrackInstance();

				if (!this.opener.filter(":focusable").trigger("focus").length) {
					$.ui.safeBlur($.ui.safeActiveElement(this.document[0]));
				}

				this._hide(this.uiDialog, this.options.hide, function () {
					that._trigger("close", event);
				});
			},

			isOpen: function isOpen() {
				return this._isOpen;
			},

			moveToTop: function moveToTop() {
				this._moveToTop();
			},

			_moveToTop: function _moveToTop(event, silent) {
				var moved = false,
				    zIndices = this.uiDialog.siblings(".ui-front:visible").map(function () {
					return +$(this).css("z-index");
				}).get(),
				    zIndexMax = Math.max.apply(null, zIndices);

				if (zIndexMax >= +this.uiDialog.css("z-index")) {
					this.uiDialog.css("z-index", zIndexMax + 1);
					moved = true;
				}

				if (moved && !silent) {
					this._trigger("focus", event);
				}
				return moved;
			},

			open: function open() {
				var that = this;
				if (this._isOpen) {
					if (this._moveToTop()) {
						this._focusTabbable();
					}
					return;
				}

				this._isOpen = true;
				this.opener = $($.ui.safeActiveElement(this.document[0]));

				this._size();
				this._position();
				this._createOverlay();
				this._moveToTop(null, true);

				if (this.overlay) {
					this.overlay.css("z-index", this.uiDialog.css("z-index") - 1);
				}

				this._show(this.uiDialog, this.options.show, function () {
					that._focusTabbable();
					that._trigger("focus");
				});

				this._makeFocusTarget();

				this._trigger("open");
			},

			_focusTabbable: function _focusTabbable() {
				var hasFocus = this._focusedElement;
				if (!hasFocus) {
					hasFocus = this.element.find("[autofocus]");
				}
				if (!hasFocus.length) {
					hasFocus = this.element.find(":tabbable");
				}
				if (!hasFocus.length) {
					hasFocus = this.uiDialogButtonPane.find(":tabbable");
				}
				if (!hasFocus.length) {
					hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
				}
				if (!hasFocus.length) {
					hasFocus = this.uiDialog;
				}
				hasFocus.eq(0).trigger("focus");
			},

			_keepFocus: function _keepFocus(event) {
				function checkFocus() {
					var activeElement = $.ui.safeActiveElement(this.document[0]),
					    isActive = this.uiDialog[0] === activeElement || $.contains(this.uiDialog[0], activeElement);
					if (!isActive) {
						this._focusTabbable();
					}
				}
				event.preventDefault();
				checkFocus.call(this);

				this._delay(checkFocus);
			},

			_createWrapper: function _createWrapper() {
				this.uiDialog = $("<div>").hide().attr({
					tabIndex: -1,
					role: "dialog"
				}).appendTo(this._appendTo());

				this._addClass(this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front");
				this._on(this.uiDialog, {
					keydown: function keydown(event) {
						if (this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
							event.preventDefault();
							this.close(event);
							return;
						}

						if (event.keyCode !== $.ui.keyCode.TAB || event.isDefaultPrevented()) {
							return;
						}
						var tabbables = this.uiDialog.find(":tabbable"),
						    first = tabbables.filter(":first"),
						    last = tabbables.filter(":last");

						if ((event.target === last[0] || event.target === this.uiDialog[0]) && !event.shiftKey) {
							this._delay(function () {
								first.trigger("focus");
							});
							event.preventDefault();
						} else if ((event.target === first[0] || event.target === this.uiDialog[0]) && event.shiftKey) {
							this._delay(function () {
								last.trigger("focus");
							});
							event.preventDefault();
						}
					},
					mousedown: function mousedown(event) {
						if (this._moveToTop(event)) {
							this._focusTabbable();
						}
					}
				});

				if (!this.element.find("[aria-describedby]").length) {
					this.uiDialog.attr({
						"aria-describedby": this.element.uniqueId().attr("id")
					});
				}
			},

			_createTitlebar: function _createTitlebar() {
				var uiDialogTitle;

				this.uiDialogTitlebar = $("<div>");
				this._addClass(this.uiDialogTitlebar, "ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix");
				this._on(this.uiDialogTitlebar, {
					mousedown: function mousedown(event) {
						if (!$(event.target).closest(".ui-dialog-titlebar-close")) {
							this.uiDialog.trigger("focus");
						}
					}
				});

				this.uiDialogTitlebarClose = $("<button type='button'></button>").button({
					label: $("<a>").text(this.options.closeText).html(),
					icon: "ui-icon-closethick",
					showLabel: false
				}).appendTo(this.uiDialogTitlebar);

				this._addClass(this.uiDialogTitlebarClose, "ui-dialog-titlebar-close");
				this._on(this.uiDialogTitlebarClose, {
					click: function click(event) {
						event.preventDefault();
						this.close(event);
					}
				});

				uiDialogTitle = $("<span>").uniqueId().prependTo(this.uiDialogTitlebar);
				this._addClass(uiDialogTitle, "ui-dialog-title");
				this._title(uiDialogTitle);

				this.uiDialogTitlebar.prependTo(this.uiDialog);

				this.uiDialog.attr({
					"aria-labelledby": uiDialogTitle.attr("id")
				});
			},

			_title: function _title(title) {
				if (this.options.title) {
					title.text(this.options.title);
				} else {
					title.html("&#160;");
				}
			},

			_createButtonPane: function _createButtonPane() {
				this.uiDialogButtonPane = $("<div>");
				this._addClass(this.uiDialogButtonPane, "ui-dialog-buttonpane", "ui-widget-content ui-helper-clearfix");

				this.uiButtonSet = $("<div>").appendTo(this.uiDialogButtonPane);
				this._addClass(this.uiButtonSet, "ui-dialog-buttonset");

				this._createButtons();
			},

			_createButtons: function _createButtons() {
				var that = this,
				    buttons = this.options.buttons;

				this.uiDialogButtonPane.remove();
				this.uiButtonSet.empty();

				if ($.isEmptyObject(buttons) || $.isArray(buttons) && !buttons.length) {
					this._removeClass(this.uiDialog, "ui-dialog-buttons");
					return;
				}

				$.each(buttons, function (name, props) {
					var click, buttonOptions;
					props = $.isFunction(props) ? { click: props, text: name } : props;

					props = $.extend({ type: "button" }, props);

					click = props.click;
					buttonOptions = {
						icon: props.icon,
						iconPosition: props.iconPosition,
						showLabel: props.showLabel,

						icons: props.icons,
						text: props.text
					};

					delete props.click;
					delete props.icon;
					delete props.iconPosition;
					delete props.showLabel;

					delete props.icons;
					if (typeof props.text === "boolean") {
						delete props.text;
					}

					$("<button></button>", props).button(buttonOptions).appendTo(that.uiButtonSet).on("click", function () {
						click.apply(that.element[0], arguments);
					});
				});
				this._addClass(this.uiDialog, "ui-dialog-buttons");
				this.uiDialogButtonPane.appendTo(this.uiDialog);
			},

			_makeDraggable: function _makeDraggable() {
				var that = this,
				    options = this.options;

				function filteredUi(ui) {
					return {
						position: ui.position,
						offset: ui.offset
					};
				}

				this.uiDialog.draggable({
					cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
					handle: ".ui-dialog-titlebar",
					containment: "document",
					start: function start(event, ui) {
						that._addClass($(this), "ui-dialog-dragging");
						that._blockFrames();
						that._trigger("dragStart", event, filteredUi(ui));
					},
					drag: function drag(event, ui) {
						that._trigger("drag", event, filteredUi(ui));
					},
					stop: function stop(event, ui) {
						var left = ui.offset.left - that.document.scrollLeft(),
						    top = ui.offset.top - that.document.scrollTop();

						options.position = {
							my: "left top",
							at: "left" + (left >= 0 ? "+" : "") + left + " " + "top" + (top >= 0 ? "+" : "") + top,
							of: that.window
						};
						that._removeClass($(this), "ui-dialog-dragging");
						that._unblockFrames();
						that._trigger("dragStop", event, filteredUi(ui));
					}
				});
			},

			_makeResizable: function _makeResizable() {
				var that = this,
				    options = this.options,
				    handles = options.resizable,
				    position = this.uiDialog.css("position"),
				    resizeHandles = typeof handles === "string" ? handles : "n,e,s,w,se,sw,ne,nw";

				function filteredUi(ui) {
					return {
						originalPosition: ui.originalPosition,
						originalSize: ui.originalSize,
						position: ui.position,
						size: ui.size
					};
				}

				this.uiDialog.resizable({
					cancel: ".ui-dialog-content",
					containment: "document",
					alsoResize: this.element,
					maxWidth: options.maxWidth,
					maxHeight: options.maxHeight,
					minWidth: options.minWidth,
					minHeight: this._minHeight(),
					handles: resizeHandles,
					start: function start(event, ui) {
						that._addClass($(this), "ui-dialog-resizing");
						that._blockFrames();
						that._trigger("resizeStart", event, filteredUi(ui));
					},
					resize: function resize(event, ui) {
						that._trigger("resize", event, filteredUi(ui));
					},
					stop: function stop(event, ui) {
						var offset = that.uiDialog.offset(),
						    left = offset.left - that.document.scrollLeft(),
						    top = offset.top - that.document.scrollTop();

						options.height = that.uiDialog.height();
						options.width = that.uiDialog.width();
						options.position = {
							my: "left top",
							at: "left" + (left >= 0 ? "+" : "") + left + " " + "top" + (top >= 0 ? "+" : "") + top,
							of: that.window
						};
						that._removeClass($(this), "ui-dialog-resizing");
						that._unblockFrames();
						that._trigger("resizeStop", event, filteredUi(ui));
					}
				}).css("position", position);
			},

			_trackFocus: function _trackFocus() {
				this._on(this.widget(), {
					focusin: function focusin(event) {
						this._makeFocusTarget();
						this._focusedElement = $(event.target);
					}
				});
			},

			_makeFocusTarget: function _makeFocusTarget() {
				this._untrackInstance();
				this._trackingInstances().unshift(this);
			},

			_untrackInstance: function _untrackInstance() {
				var instances = this._trackingInstances(),
				    exists = $.inArray(this, instances);
				if (exists !== -1) {
					instances.splice(exists, 1);
				}
			},

			_trackingInstances: function _trackingInstances() {
				var instances = this.document.data("ui-dialog-instances");
				if (!instances) {
					instances = [];
					this.document.data("ui-dialog-instances", instances);
				}
				return instances;
			},

			_minHeight: function _minHeight() {
				var options = this.options;

				return options.height === "auto" ? options.minHeight : Math.min(options.minHeight, options.height);
			},

			_position: function _position() {
				var isVisible = this.uiDialog.is(":visible");
				if (!isVisible) {
					this.uiDialog.show();
				}
				this.uiDialog.position(this.options.position);
				if (!isVisible) {
					this.uiDialog.hide();
				}
			},

			_setOptions: function _setOptions(options) {
				var that = this,
				    resize = false,
				    resizableOptions = {};

				$.each(options, function (key, value) {
					that._setOption(key, value);

					if (key in that.sizeRelatedOptions) {
						resize = true;
					}
					if (key in that.resizableRelatedOptions) {
						resizableOptions[key] = value;
					}
				});

				if (resize) {
					this._size();
					this._position();
				}
				if (this.uiDialog.is(":data(ui-resizable)")) {
					this.uiDialog.resizable("option", resizableOptions);
				}
			},

			_setOption: function _setOption(key, value) {
				var isDraggable,
				    isResizable,
				    uiDialog = this.uiDialog;

				if (key === "disabled") {
					return;
				}

				this._super(key, value);

				if (key === "appendTo") {
					this.uiDialog.appendTo(this._appendTo());
				}

				if (key === "buttons") {
					this._createButtons();
				}

				if (key === "closeText") {
					this.uiDialogTitlebarClose.button({
						label: $("<a>").text("" + this.options.closeText).html()
					});
				}

				if (key === "draggable") {
					isDraggable = uiDialog.is(":data(ui-draggable)");
					if (isDraggable && !value) {
						uiDialog.draggable("destroy");
					}

					if (!isDraggable && value) {
						this._makeDraggable();
					}
				}

				if (key === "position") {
					this._position();
				}

				if (key === "resizable") {
					isResizable = uiDialog.is(":data(ui-resizable)");
					if (isResizable && !value) {
						uiDialog.resizable("destroy");
					}

					if (isResizable && typeof value === "string") {
						uiDialog.resizable("option", "handles", value);
					}

					if (!isResizable && value !== false) {
						this._makeResizable();
					}
				}

				if (key === "title") {
					this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
				}
			},

			_size: function _size() {
				var nonContentHeight,
				    minContentHeight,
				    maxContentHeight,
				    options = this.options;

				this.element.show().css({
					width: "auto",
					minHeight: 0,
					maxHeight: "none",
					height: 0
				});

				if (options.minWidth > options.width) {
					options.width = options.minWidth;
				}

				nonContentHeight = this.uiDialog.css({
					height: "auto",
					width: options.width
				}).outerHeight();
				minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
				maxContentHeight = typeof options.maxHeight === "number" ? Math.max(0, options.maxHeight - nonContentHeight) : "none";

				if (options.height === "auto") {
					this.element.css({
						minHeight: minContentHeight,
						maxHeight: maxContentHeight,
						height: "auto"
					});
				} else {
					this.element.height(Math.max(0, options.height - nonContentHeight));
				}

				if (this.uiDialog.is(":data(ui-resizable)")) {
					this.uiDialog.resizable("option", "minHeight", this._minHeight());
				}
			},

			_blockFrames: function _blockFrames() {
				this.iframeBlocks = this.document.find("iframe").map(function () {
					var iframe = $(this);

					return $("<div>").css({
						position: "absolute",
						width: iframe.outerWidth(),
						height: iframe.outerHeight()
					}).appendTo(iframe.parent()).offset(iframe.offset())[0];
				});
			},

			_unblockFrames: function _unblockFrames() {
				if (this.iframeBlocks) {
					this.iframeBlocks.remove();
					delete this.iframeBlocks;
				}
			},

			_allowInteraction: function _allowInteraction(event) {
				if ($(event.target).closest(".ui-dialog").length) {
					return true;
				}

				return !!$(event.target).closest(".ui-datepicker").length;
			},

			_createOverlay: function _createOverlay() {
				if (!this.options.modal) {
					return;
				}

				var isOpening = true;
				this._delay(function () {
					isOpening = false;
				});

				if (!this.document.data("ui-dialog-overlays")) {
					this._on(this.document, {
						focusin: function focusin(event) {
							if (isOpening) {
								return;
							}

							if (!this._allowInteraction(event)) {
								event.preventDefault();
								this._trackingInstances()[0]._focusTabbable();
							}
						}
					});
				}

				this.overlay = $("<div>").appendTo(this._appendTo());

				this._addClass(this.overlay, null, "ui-widget-overlay ui-front");
				this._on(this.overlay, {
					mousedown: "_keepFocus"
				});
				this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1);
			},

			_destroyOverlay: function _destroyOverlay() {
				if (!this.options.modal) {
					return;
				}

				if (this.overlay) {
					var overlays = this.document.data("ui-dialog-overlays") - 1;

					if (!overlays) {
						this._off(this.document, "focusin");
						this.document.removeData("ui-dialog-overlays");
					} else {
						this.document.data("ui-dialog-overlays", overlays);
					}

					this.overlay.remove();
					this.overlay = null;
				}
			}
		});

		if ($.uiBackCompat !== false) {
			$.widget("ui.dialog", $.ui.dialog, {
				options: {
					dialogClass: ""
				},
				_createWrapper: function _createWrapper() {
					this._super();
					this.uiDialog.addClass(this.options.dialogClass);
				},
				_setOption: function _setOption(key, value) {
					if (key === "dialogClass") {
						this.uiDialog.removeClass(this.options.dialogClass).addClass(value);
					}
					this._superApply(arguments);
				}
			});
		}

		var widgetsDialog = $.ui.dialog;

		$.widget("ui.droppable", {
			version: "1.12.1",
			widgetEventPrefix: "drop",
			options: {
				accept: "*",
				addClasses: true,
				greedy: false,
				scope: "default",
				tolerance: "intersect",

				activate: null,
				deactivate: null,
				drop: null,
				out: null,
				over: null
			},
			_create: function _create() {

				var proportions,
				    o = this.options,
				    accept = o.accept;

				this.isover = false;
				this.isout = true;

				this.accept = $.isFunction(accept) ? accept : function (d) {
					return d.is(accept);
				};

				this.proportions = function () {
					if (arguments.length) {
						proportions = arguments[0];
					} else {
						return proportions ? proportions : proportions = {
							width: this.element[0].offsetWidth,
							height: this.element[0].offsetHeight
						};
					}
				};

				this._addToManager(o.scope);

				o.addClasses && this._addClass("ui-droppable");
			},

			_addToManager: function _addToManager(scope) {
				$.ui.ddmanager.droppables[scope] = $.ui.ddmanager.droppables[scope] || [];
				$.ui.ddmanager.droppables[scope].push(this);
			},

			_splice: function _splice(drop) {
				var i = 0;
				for (; i < drop.length; i++) {
					if (drop[i] === this) {
						drop.splice(i, 1);
					}
				}
			},

			_destroy: function _destroy() {
				var drop = $.ui.ddmanager.droppables[this.options.scope];

				this._splice(drop);
			},

			_setOption: function _setOption(key, value) {

				if (key === "accept") {
					this.accept = $.isFunction(value) ? value : function (d) {
						return d.is(value);
					};
				} else if (key === "scope") {
					var drop = $.ui.ddmanager.droppables[this.options.scope];

					this._splice(drop);
					this._addToManager(value);
				}

				this._super(key, value);
			},

			_activate: function _activate(event) {
				var draggable = $.ui.ddmanager.current;

				this._addActiveClass();
				if (draggable) {
					this._trigger("activate", event, this.ui(draggable));
				}
			},

			_deactivate: function _deactivate(event) {
				var draggable = $.ui.ddmanager.current;

				this._removeActiveClass();
				if (draggable) {
					this._trigger("deactivate", event, this.ui(draggable));
				}
			},

			_over: function _over(event) {

				var draggable = $.ui.ddmanager.current;

				if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
					return;
				}

				if (this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
					this._addHoverClass();
					this._trigger("over", event, this.ui(draggable));
				}
			},

			_out: function _out(event) {

				var draggable = $.ui.ddmanager.current;

				if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
					return;
				}

				if (this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
					this._removeHoverClass();
					this._trigger("out", event, this.ui(draggable));
				}
			},

			_drop: function _drop(event, custom) {

				var draggable = custom || $.ui.ddmanager.current,
				    childrenIntersection = false;

				if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
					return false;
				}

				this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
					var inst = $(this).droppable("instance");
					if (inst.options.greedy && !inst.options.disabled && inst.options.scope === draggable.options.scope && inst.accept.call(inst.element[0], draggable.currentItem || draggable.element) && intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance, event)) {
						childrenIntersection = true;
						return false;
					}
				});
				if (childrenIntersection) {
					return false;
				}

				if (this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
					this._removeActiveClass();
					this._removeHoverClass();

					this._trigger("drop", event, this.ui(draggable));
					return this.element;
				}

				return false;
			},

			ui: function ui(c) {
				return {
					draggable: c.currentItem || c.element,
					helper: c.helper,
					position: c.position,
					offset: c.positionAbs
				};
			},

			_addHoverClass: function _addHoverClass() {
				this._addClass("ui-droppable-hover");
			},

			_removeHoverClass: function _removeHoverClass() {
				this._removeClass("ui-droppable-hover");
			},

			_addActiveClass: function _addActiveClass() {
				this._addClass("ui-droppable-active");
			},

			_removeActiveClass: function _removeActiveClass() {
				this._removeClass("ui-droppable-active");
			}
		});

		var intersect = $.ui.intersect = function () {
			function isOverAxis(x, reference, size) {
				return x >= reference && x < reference + size;
			}

			return function (draggable, droppable, toleranceMode, event) {

				if (!droppable.offset) {
					return false;
				}

				var x1 = (draggable.positionAbs || draggable.position.absolute).left + draggable.margins.left,
				    y1 = (draggable.positionAbs || draggable.position.absolute).top + draggable.margins.top,
				    x2 = x1 + draggable.helperProportions.width,
				    y2 = y1 + draggable.helperProportions.height,
				    l = droppable.offset.left,
				    t = droppable.offset.top,
				    r = l + droppable.proportions().width,
				    b = t + droppable.proportions().height;

				switch (toleranceMode) {
					case "fit":
						return l <= x1 && x2 <= r && t <= y1 && y2 <= b;
					case "intersect":
						return l < x1 + draggable.helperProportions.width / 2 && x2 - draggable.helperProportions.width / 2 < r && t < y1 + draggable.helperProportions.height / 2 && y2 - draggable.helperProportions.height / 2 < b;
					case "pointer":
						return isOverAxis(event.pageY, t, droppable.proportions().height) && isOverAxis(event.pageX, l, droppable.proportions().width);
					case "touch":
						return (y1 >= t && y1 <= b || y2 >= t && y2 <= b || y1 < t && y2 > b) && (x1 >= l && x1 <= r || x2 >= l && x2 <= r || x1 < l && x2 > r);
					default:
						return false;
				}
			};
		}();

		$.ui.ddmanager = {
			current: null,
			droppables: { "default": [] },
			prepareOffsets: function prepareOffsets(t, event) {

				var i,
				    j,
				    m = $.ui.ddmanager.droppables[t.options.scope] || [],
				    type = event ? event.type : null,
				    list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

				droppablesLoop: for (i = 0; i < m.length; i++) {
					if (m[i].options.disabled || t && !m[i].accept.call(m[i].element[0], t.currentItem || t.element)) {
						continue;
					}

					for (j = 0; j < list.length; j++) {
						if (list[j] === m[i].element[0]) {
							m[i].proportions().height = 0;
							continue droppablesLoop;
						}
					}

					m[i].visible = m[i].element.css("display") !== "none";
					if (!m[i].visible) {
						continue;
					}

					if (type === "mousedown") {
						m[i]._activate.call(m[i], event);
					}

					m[i].offset = m[i].element.offset();
					m[i].proportions({
						width: m[i].element[0].offsetWidth,
						height: m[i].element[0].offsetHeight
					});
				}
			},
			drop: function drop(draggable, event) {

				var dropped = false;

				$.each(($.ui.ddmanager.droppables[draggable.options.scope] || []).slice(), function () {

					if (!this.options) {
						return;
					}
					if (!this.options.disabled && this.visible && intersect(draggable, this, this.options.tolerance, event)) {
						dropped = this._drop.call(this, event) || dropped;
					}

					if (!this.options.disabled && this.visible && this.accept.call(this.element[0], draggable.currentItem || draggable.element)) {
						this.isout = true;
						this.isover = false;
						this._deactivate.call(this, event);
					}
				});
				return dropped;
			},
			dragStart: function dragStart(draggable, event) {
				draggable.element.parentsUntil("body").on("scroll.droppable", function () {
					if (!draggable.options.refreshPositions) {
						$.ui.ddmanager.prepareOffsets(draggable, event);
					}
				});
			},
			drag: function drag(draggable, event) {
				if (draggable.options.refreshPositions) {
					$.ui.ddmanager.prepareOffsets(draggable, event);
				}

				$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function () {

					if (this.options.disabled || this.greedyChild || !this.visible) {
						return;
					}

					var parentInstance,
					    scope,
					    parent,
					    intersects = intersect(draggable, this, this.options.tolerance, event),
					    c = !intersects && this.isover ? "isout" : intersects && !this.isover ? "isover" : null;
					if (!c) {
						return;
					}

					if (this.options.greedy) {
						scope = this.options.scope;
						parent = this.element.parents(":data(ui-droppable)").filter(function () {
							return $(this).droppable("instance").options.scope === scope;
						});

						if (parent.length) {
							parentInstance = $(parent[0]).droppable("instance");
							parentInstance.greedyChild = c === "isover";
						}
					}

					if (parentInstance && c === "isover") {
						parentInstance.isover = false;
						parentInstance.isout = true;
						parentInstance._out.call(parentInstance, event);
					}

					this[c] = true;
					this[c === "isout" ? "isover" : "isout"] = false;
					this[c === "isover" ? "_over" : "_out"].call(this, event);

					if (parentInstance && c === "isout") {
						parentInstance.isout = false;
						parentInstance.isover = true;
						parentInstance._over.call(parentInstance, event);
					}
				});
			},
			dragStop: function dragStop(draggable, event) {
				draggable.element.parentsUntil("body").off("scroll.droppable");

				if (!draggable.options.refreshPositions) {
					$.ui.ddmanager.prepareOffsets(draggable, event);
				}
			}
		};

		if ($.uiBackCompat !== false) {
			$.widget("ui.droppable", $.ui.droppable, {
				options: {
					hoverClass: false,
					activeClass: false
				},
				_addActiveClass: function _addActiveClass() {
					this._super();
					if (this.options.activeClass) {
						this.element.addClass(this.options.activeClass);
					}
				},
				_removeActiveClass: function _removeActiveClass() {
					this._super();
					if (this.options.activeClass) {
						this.element.removeClass(this.options.activeClass);
					}
				},
				_addHoverClass: function _addHoverClass() {
					this._super();
					if (this.options.hoverClass) {
						this.element.addClass(this.options.hoverClass);
					}
				},
				_removeHoverClass: function _removeHoverClass() {
					this._super();
					if (this.options.hoverClass) {
						this.element.removeClass(this.options.hoverClass);
					}
				}
			});
		}

		var widgetsDroppable = $.ui.droppable;

		var widgetsProgressbar = $.widget("ui.progressbar", {
			version: "1.12.1",
			options: {
				classes: {
					"ui-progressbar": "ui-corner-all",
					"ui-progressbar-value": "ui-corner-left",
					"ui-progressbar-complete": "ui-corner-right"
				},
				max: 100,
				value: 0,

				change: null,
				complete: null
			},

			min: 0,

			_create: function _create() {
				this.oldValue = this.options.value = this._constrainedValue();

				this.element.attr({
					role: "progressbar",
					"aria-valuemin": this.min
				});
				this._addClass("ui-progressbar", "ui-widget ui-widget-content");

				this.valueDiv = $("<div>").appendTo(this.element);
				this._addClass(this.valueDiv, "ui-progressbar-value", "ui-widget-header");
				this._refreshValue();
			},

			_destroy: function _destroy() {
				this.element.removeAttr("role aria-valuemin aria-valuemax aria-valuenow");

				this.valueDiv.remove();
			},

			value: function value(newValue) {
				if (newValue === undefined) {
					return this.options.value;
				}

				this.options.value = this._constrainedValue(newValue);
				this._refreshValue();
			},

			_constrainedValue: function _constrainedValue(newValue) {
				if (newValue === undefined) {
					newValue = this.options.value;
				}

				this.indeterminate = newValue === false;

				if (typeof newValue !== "number") {
					newValue = 0;
				}

				return this.indeterminate ? false : Math.min(this.options.max, Math.max(this.min, newValue));
			},

			_setOptions: function _setOptions(options) {
				var value = options.value;
				delete options.value;

				this._super(options);

				this.options.value = this._constrainedValue(value);
				this._refreshValue();
			},

			_setOption: function _setOption(key, value) {
				if (key === "max") {
					value = Math.max(this.min, value);
				}
				this._super(key, value);
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this.element.attr("aria-disabled", value);
				this._toggleClass(null, "ui-state-disabled", !!value);
			},

			_percentage: function _percentage() {
				return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min);
			},

			_refreshValue: function _refreshValue() {
				var value = this.options.value,
				    percentage = this._percentage();

				this.valueDiv.toggle(this.indeterminate || value > this.min).width(percentage.toFixed(0) + "%");

				this._toggleClass(this.valueDiv, "ui-progressbar-complete", null, value === this.options.max)._toggleClass("ui-progressbar-indeterminate", null, this.indeterminate);

				if (this.indeterminate) {
					this.element.removeAttr("aria-valuenow");
					if (!this.overlayDiv) {
						this.overlayDiv = $("<div>").appendTo(this.valueDiv);
						this._addClass(this.overlayDiv, "ui-progressbar-overlay");
					}
				} else {
					this.element.attr({
						"aria-valuemax": this.options.max,
						"aria-valuenow": value
					});
					if (this.overlayDiv) {
						this.overlayDiv.remove();
						this.overlayDiv = null;
					}
				}

				if (this.oldValue !== value) {
					this.oldValue = value;
					this._trigger("change");
				}
				if (value === this.options.max) {
					this._trigger("complete");
				}
			}
		});

		var widgetsSelectable = $.widget("ui.selectable", $.ui.mouse, {
			version: "1.12.1",
			options: {
				appendTo: "body",
				autoRefresh: true,
				distance: 0,
				filter: "*",
				tolerance: "touch",

				selected: null,
				selecting: null,
				start: null,
				stop: null,
				unselected: null,
				unselecting: null
			},
			_create: function _create() {
				var that = this;

				this._addClass("ui-selectable");

				this.dragged = false;

				this.refresh = function () {
					that.elementPos = $(that.element[0]).offset();
					that.selectees = $(that.options.filter, that.element[0]);
					that._addClass(that.selectees, "ui-selectee");
					that.selectees.each(function () {
						var $this = $(this),
						    selecteeOffset = $this.offset(),
						    pos = {
							left: selecteeOffset.left - that.elementPos.left,
							top: selecteeOffset.top - that.elementPos.top
						};
						$.data(this, "selectable-item", {
							element: this,
							$element: $this,
							left: pos.left,
							top: pos.top,
							right: pos.left + $this.outerWidth(),
							bottom: pos.top + $this.outerHeight(),
							startselected: false,
							selected: $this.hasClass("ui-selected"),
							selecting: $this.hasClass("ui-selecting"),
							unselecting: $this.hasClass("ui-unselecting")
						});
					});
				};
				this.refresh();

				this._mouseInit();

				this.helper = $("<div>");
				this._addClass(this.helper, "ui-selectable-helper");
			},

			_destroy: function _destroy() {
				this.selectees.removeData("selectable-item");
				this._mouseDestroy();
			},

			_mouseStart: function _mouseStart(event) {
				var that = this,
				    options = this.options;

				this.opos = [event.pageX, event.pageY];
				this.elementPos = $(this.element[0]).offset();

				if (this.options.disabled) {
					return;
				}

				this.selectees = $(options.filter, this.element[0]);

				this._trigger("start", event);

				$(options.appendTo).append(this.helper);

				this.helper.css({
					"left": event.pageX,
					"top": event.pageY,
					"width": 0,
					"height": 0
				});

				if (options.autoRefresh) {
					this.refresh();
				}

				this.selectees.filter(".ui-selected").each(function () {
					var selectee = $.data(this, "selectable-item");
					selectee.startselected = true;
					if (!event.metaKey && !event.ctrlKey) {
						that._removeClass(selectee.$element, "ui-selected");
						selectee.selected = false;
						that._addClass(selectee.$element, "ui-unselecting");
						selectee.unselecting = true;

						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				});

				$(event.target).parents().addBack().each(function () {
					var doSelect,
					    selectee = $.data(this, "selectable-item");
					if (selectee) {
						doSelect = !event.metaKey && !event.ctrlKey || !selectee.$element.hasClass("ui-selected");
						that._removeClass(selectee.$element, doSelect ? "ui-unselecting" : "ui-selected")._addClass(selectee.$element, doSelect ? "ui-selecting" : "ui-unselecting");
						selectee.unselecting = !doSelect;
						selectee.selecting = doSelect;
						selectee.selected = doSelect;

						if (doSelect) {
							that._trigger("selecting", event, {
								selecting: selectee.element
							});
						} else {
							that._trigger("unselecting", event, {
								unselecting: selectee.element
							});
						}
						return false;
					}
				});
			},

			_mouseDrag: function _mouseDrag(event) {

				this.dragged = true;

				if (this.options.disabled) {
					return;
				}

				var tmp,
				    that = this,
				    options = this.options,
				    x1 = this.opos[0],
				    y1 = this.opos[1],
				    x2 = event.pageX,
				    y2 = event.pageY;

				if (x1 > x2) {
					tmp = x2;x2 = x1;x1 = tmp;
				}
				if (y1 > y2) {
					tmp = y2;y2 = y1;y1 = tmp;
				}
				this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });

				this.selectees.each(function () {
					var selectee = $.data(this, "selectable-item"),
					    hit = false,
					    offset = {};

					if (!selectee || selectee.element === that.element[0]) {
						return;
					}

					offset.left = selectee.left + that.elementPos.left;
					offset.right = selectee.right + that.elementPos.left;
					offset.top = selectee.top + that.elementPos.top;
					offset.bottom = selectee.bottom + that.elementPos.top;

					if (options.tolerance === "touch") {
						hit = !(offset.left > x2 || offset.right < x1 || offset.top > y2 || offset.bottom < y1);
					} else if (options.tolerance === "fit") {
						hit = offset.left > x1 && offset.right < x2 && offset.top > y1 && offset.bottom < y2;
					}

					if (hit) {
						if (selectee.selected) {
							that._removeClass(selectee.$element, "ui-selected");
							selectee.selected = false;
						}
						if (selectee.unselecting) {
							that._removeClass(selectee.$element, "ui-unselecting");
							selectee.unselecting = false;
						}
						if (!selectee.selecting) {
							that._addClass(selectee.$element, "ui-selecting");
							selectee.selecting = true;

							that._trigger("selecting", event, {
								selecting: selectee.element
							});
						}
					} else {
						if (selectee.selecting) {
							if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
								that._removeClass(selectee.$element, "ui-selecting");
								selectee.selecting = false;
								that._addClass(selectee.$element, "ui-selected");
								selectee.selected = true;
							} else {
								that._removeClass(selectee.$element, "ui-selecting");
								selectee.selecting = false;
								if (selectee.startselected) {
									that._addClass(selectee.$element, "ui-unselecting");
									selectee.unselecting = true;
								}

								that._trigger("unselecting", event, {
									unselecting: selectee.element
								});
							}
						}
						if (selectee.selected) {
							if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
								that._removeClass(selectee.$element, "ui-selected");
								selectee.selected = false;

								that._addClass(selectee.$element, "ui-unselecting");
								selectee.unselecting = true;

								that._trigger("unselecting", event, {
									unselecting: selectee.element
								});
							}
						}
					}
				});

				return false;
			},

			_mouseStop: function _mouseStop(event) {
				var that = this;

				this.dragged = false;

				$(".ui-unselecting", this.element[0]).each(function () {
					var selectee = $.data(this, "selectable-item");
					that._removeClass(selectee.$element, "ui-unselecting");
					selectee.unselecting = false;
					selectee.startselected = false;
					that._trigger("unselected", event, {
						unselected: selectee.element
					});
				});
				$(".ui-selecting", this.element[0]).each(function () {
					var selectee = $.data(this, "selectable-item");
					that._removeClass(selectee.$element, "ui-selecting")._addClass(selectee.$element, "ui-selected");
					selectee.selecting = false;
					selectee.selected = true;
					selectee.startselected = true;
					that._trigger("selected", event, {
						selected: selectee.element
					});
				});
				this._trigger("stop", event);

				this.helper.remove();

				return false;
			}

		});

		var widgetsSelectmenu = $.widget("ui.selectmenu", [$.ui.formResetMixin, {
			version: "1.12.1",
			defaultElement: "<select>",
			options: {
				appendTo: null,
				classes: {
					"ui-selectmenu-button-open": "ui-corner-top",
					"ui-selectmenu-button-closed": "ui-corner-all"
				},
				disabled: null,
				icons: {
					button: "ui-icon-triangle-1-s"
				},
				position: {
					my: "left top",
					at: "left bottom",
					collision: "none"
				},
				width: false,

				change: null,
				close: null,
				focus: null,
				open: null,
				select: null
			},

			_create: function _create() {
				var selectmenuId = this.element.uniqueId().attr("id");
				this.ids = {
					element: selectmenuId,
					button: selectmenuId + "-button",
					menu: selectmenuId + "-menu"
				};

				this._drawButton();
				this._drawMenu();
				this._bindFormResetHandler();

				this._rendered = false;
				this.menuItems = $();
			},

			_drawButton: function _drawButton() {
				var icon,
				    that = this,
				    item = this._parseOption(this.element.find("option:selected"), this.element[0].selectedIndex);

				this.labels = this.element.labels().attr("for", this.ids.button);
				this._on(this.labels, {
					click: function click(event) {
						this.button.focus();
						event.preventDefault();
					}
				});

				this.element.hide();

				this.button = $("<span>", {
					tabindex: this.options.disabled ? -1 : 0,
					id: this.ids.button,
					role: "combobox",
					"aria-expanded": "false",
					"aria-autocomplete": "list",
					"aria-owns": this.ids.menu,
					"aria-haspopup": "true",
					title: this.element.attr("title")
				}).insertAfter(this.element);

				this._addClass(this.button, "ui-selectmenu-button ui-selectmenu-button-closed", "ui-button ui-widget");

				icon = $("<span>").appendTo(this.button);
				this._addClass(icon, "ui-selectmenu-icon", "ui-icon " + this.options.icons.button);
				this.buttonItem = this._renderButtonItem(item).appendTo(this.button);

				if (this.options.width !== false) {
					this._resizeButton();
				}

				this._on(this.button, this._buttonEvents);
				this.button.one("focusin", function () {
					if (!that._rendered) {
						that._refreshMenu();
					}
				});
			},

			_drawMenu: function _drawMenu() {
				var that = this;

				this.menu = $("<ul>", {
					"aria-hidden": "true",
					"aria-labelledby": this.ids.button,
					id: this.ids.menu
				});

				this.menuWrap = $("<div>").append(this.menu);
				this._addClass(this.menuWrap, "ui-selectmenu-menu", "ui-front");
				this.menuWrap.appendTo(this._appendTo());

				this.menuInstance = this.menu.menu({
					classes: {
						"ui-menu": "ui-corner-bottom"
					},
					role: "listbox",
					select: function select(event, ui) {
						event.preventDefault();

						that._setSelection();

						that._select(ui.item.data("ui-selectmenu-item"), event);
					},
					focus: function focus(event, ui) {
						var item = ui.item.data("ui-selectmenu-item");

						if (that.focusIndex != null && item.index !== that.focusIndex) {
							that._trigger("focus", event, { item: item });
							if (!that.isOpen) {
								that._select(item, event);
							}
						}
						that.focusIndex = item.index;

						that.button.attr("aria-activedescendant", that.menuItems.eq(item.index).attr("id"));
					}
				}).menu("instance");

				this.menuInstance._off(this.menu, "mouseleave");

				this.menuInstance._closeOnDocumentClick = function () {
					return false;
				};

				this.menuInstance._isDivider = function () {
					return false;
				};
			},

			refresh: function refresh() {
				this._refreshMenu();
				this.buttonItem.replaceWith(this.buttonItem = this._renderButtonItem(this._getSelectedItem().data("ui-selectmenu-item") || {}));
				if (this.options.width === null) {
					this._resizeButton();
				}
			},

			_refreshMenu: function _refreshMenu() {
				var item,
				    options = this.element.find("option");

				this.menu.empty();

				this._parseOptions(options);
				this._renderMenu(this.menu, this.items);

				this.menuInstance.refresh();
				this.menuItems = this.menu.find("li").not(".ui-selectmenu-optgroup").find(".ui-menu-item-wrapper");

				this._rendered = true;

				if (!options.length) {
					return;
				}

				item = this._getSelectedItem();

				this.menuInstance.focus(null, item);
				this._setAria(item.data("ui-selectmenu-item"));

				this._setOption("disabled", this.element.prop("disabled"));
			},

			open: function open(event) {
				if (this.options.disabled) {
					return;
				}

				if (!this._rendered) {
					this._refreshMenu();
				} else {
					this._removeClass(this.menu.find(".ui-state-active"), null, "ui-state-active");
					this.menuInstance.focus(null, this._getSelectedItem());
				}

				if (!this.menuItems.length) {
					return;
				}

				this.isOpen = true;
				this._toggleAttr();
				this._resizeMenu();
				this._position();

				this._on(this.document, this._documentClick);

				this._trigger("open", event);
			},

			_position: function _position() {
				this.menuWrap.position($.extend({ of: this.button }, this.options.position));
			},

			close: function close(event) {
				if (!this.isOpen) {
					return;
				}

				this.isOpen = false;
				this._toggleAttr();

				this.range = null;
				this._off(this.document);

				this._trigger("close", event);
			},

			widget: function widget() {
				return this.button;
			},

			menuWidget: function menuWidget() {
				return this.menu;
			},

			_renderButtonItem: function _renderButtonItem(item) {
				var buttonItem = $("<span>");

				this._setText(buttonItem, item.label);
				this._addClass(buttonItem, "ui-selectmenu-text");

				return buttonItem;
			},

			_renderMenu: function _renderMenu(ul, items) {
				var that = this,
				    currentOptgroup = "";

				$.each(items, function (index, item) {
					var li;

					if (item.optgroup !== currentOptgroup) {
						li = $("<li>", {
							text: item.optgroup
						});
						that._addClass(li, "ui-selectmenu-optgroup", "ui-menu-divider" + (item.element.parent("optgroup").prop("disabled") ? " ui-state-disabled" : ""));

						li.appendTo(ul);

						currentOptgroup = item.optgroup;
					}

					that._renderItemData(ul, item);
				});
			},

			_renderItemData: function _renderItemData(ul, item) {
				return this._renderItem(ul, item).data("ui-selectmenu-item", item);
			},

			_renderItem: function _renderItem(ul, item) {
				var li = $("<li>"),
				    wrapper = $("<div>", {
					title: item.element.attr("title")
				});

				if (item.disabled) {
					this._addClass(li, null, "ui-state-disabled");
				}
				this._setText(wrapper, item.label);

				return li.append(wrapper).appendTo(ul);
			},

			_setText: function _setText(element, value) {
				if (value) {
					element.text(value);
				} else {
					element.html("&#160;");
				}
			},

			_move: function _move(direction, event) {
				var item,
				    next,
				    filter = ".ui-menu-item";

				if (this.isOpen) {
					item = this.menuItems.eq(this.focusIndex).parent("li");
				} else {
					item = this.menuItems.eq(this.element[0].selectedIndex).parent("li");
					filter += ":not(.ui-state-disabled)";
				}

				if (direction === "first" || direction === "last") {
					next = item[direction === "first" ? "prevAll" : "nextAll"](filter).eq(-1);
				} else {
					next = item[direction + "All"](filter).eq(0);
				}

				if (next.length) {
					this.menuInstance.focus(event, next);
				}
			},

			_getSelectedItem: function _getSelectedItem() {
				return this.menuItems.eq(this.element[0].selectedIndex).parent("li");
			},

			_toggle: function _toggle(event) {
				this[this.isOpen ? "close" : "open"](event);
			},

			_setSelection: function _setSelection() {
				var selection;

				if (!this.range) {
					return;
				}

				if (window.getSelection) {
					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(this.range);
				} else {
					this.range.select();
				}

				this.button.focus();
			},

			_documentClick: {
				mousedown: function mousedown(event) {
					if (!this.isOpen) {
						return;
					}

					if (!$(event.target).closest(".ui-selectmenu-menu, #" + $.ui.escapeSelector(this.ids.button)).length) {
						this.close(event);
					}
				}
			},

			_buttonEvents: {
				mousedown: function mousedown() {
					var selection;

					if (window.getSelection) {
						selection = window.getSelection();
						if (selection.rangeCount) {
							this.range = selection.getRangeAt(0);
						}
					} else {
						this.range = document.selection.createRange();
					}
				},

				click: function click(event) {
					this._setSelection();
					this._toggle(event);
				},

				keydown: function keydown(event) {
					var preventDefault = true;
					switch (event.keyCode) {
						case $.ui.keyCode.TAB:
						case $.ui.keyCode.ESCAPE:
							this.close(event);
							preventDefault = false;
							break;
						case $.ui.keyCode.ENTER:
							if (this.isOpen) {
								this._selectFocusedItem(event);
							}
							break;
						case $.ui.keyCode.UP:
							if (event.altKey) {
								this._toggle(event);
							} else {
								this._move("prev", event);
							}
							break;
						case $.ui.keyCode.DOWN:
							if (event.altKey) {
								this._toggle(event);
							} else {
								this._move("next", event);
							}
							break;
						case $.ui.keyCode.SPACE:
							if (this.isOpen) {
								this._selectFocusedItem(event);
							} else {
								this._toggle(event);
							}
							break;
						case $.ui.keyCode.LEFT:
							this._move("prev", event);
							break;
						case $.ui.keyCode.RIGHT:
							this._move("next", event);
							break;
						case $.ui.keyCode.HOME:
						case $.ui.keyCode.PAGE_UP:
							this._move("first", event);
							break;
						case $.ui.keyCode.END:
						case $.ui.keyCode.PAGE_DOWN:
							this._move("last", event);
							break;
						default:
							this.menu.trigger(event);
							preventDefault = false;
					}

					if (preventDefault) {
						event.preventDefault();
					}
				}
			},

			_selectFocusedItem: function _selectFocusedItem(event) {
				var item = this.menuItems.eq(this.focusIndex).parent("li");
				if (!item.hasClass("ui-state-disabled")) {
					this._select(item.data("ui-selectmenu-item"), event);
				}
			},

			_select: function _select(item, event) {
				var oldIndex = this.element[0].selectedIndex;

				this.element[0].selectedIndex = item.index;
				this.buttonItem.replaceWith(this.buttonItem = this._renderButtonItem(item));
				this._setAria(item);
				this._trigger("select", event, { item: item });

				if (item.index !== oldIndex) {
					this._trigger("change", event, { item: item });
				}

				this.close(event);
			},

			_setAria: function _setAria(item) {
				var id = this.menuItems.eq(item.index).attr("id");

				this.button.attr({
					"aria-labelledby": id,
					"aria-activedescendant": id
				});
				this.menu.attr("aria-activedescendant", id);
			},

			_setOption: function _setOption(key, value) {
				if (key === "icons") {
					var icon = this.button.find("span.ui-icon");
					this._removeClass(icon, null, this.options.icons.button)._addClass(icon, null, value.button);
				}

				this._super(key, value);

				if (key === "appendTo") {
					this.menuWrap.appendTo(this._appendTo());
				}

				if (key === "width") {
					this._resizeButton();
				}
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this.menuInstance.option("disabled", value);
				this.button.attr("aria-disabled", value);
				this._toggleClass(this.button, null, "ui-state-disabled", value);

				this.element.prop("disabled", value);
				if (value) {
					this.button.attr("tabindex", -1);
					this.close();
				} else {
					this.button.attr("tabindex", 0);
				}
			},

			_appendTo: function _appendTo() {
				var element = this.options.appendTo;

				if (element) {
					element = element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0);
				}

				if (!element || !element[0]) {
					element = this.element.closest(".ui-front, dialog");
				}

				if (!element.length) {
					element = this.document[0].body;
				}

				return element;
			},

			_toggleAttr: function _toggleAttr() {
				this.button.attr("aria-expanded", this.isOpen);

				this._removeClass(this.button, "ui-selectmenu-button-" + (this.isOpen ? "closed" : "open"))._addClass(this.button, "ui-selectmenu-button-" + (this.isOpen ? "open" : "closed"))._toggleClass(this.menuWrap, "ui-selectmenu-open", null, this.isOpen);

				this.menu.attr("aria-hidden", !this.isOpen);
			},

			_resizeButton: function _resizeButton() {
				var width = this.options.width;

				if (width === false) {
					this.button.css("width", "");
					return;
				}

				if (width === null) {
					width = this.element.show().outerWidth();
					this.element.hide();
				}

				this.button.outerWidth(width);
			},

			_resizeMenu: function _resizeMenu() {
				this.menu.outerWidth(Math.max(this.button.outerWidth(), this.menu.width("").outerWidth() + 1));
			},

			_getCreateOptions: function _getCreateOptions() {
				var options = this._super();

				options.disabled = this.element.prop("disabled");

				return options;
			},

			_parseOptions: function _parseOptions(options) {
				var that = this,
				    data = [];
				options.each(function (index, item) {
					data.push(that._parseOption($(item), index));
				});
				this.items = data;
			},

			_parseOption: function _parseOption(option, index) {
				var optgroup = option.parent("optgroup");

				return {
					element: option,
					index: index,
					value: option.val(),
					label: option.text(),
					optgroup: optgroup.attr("label") || "",
					disabled: optgroup.prop("disabled") || option.prop("disabled")
				};
			},

			_destroy: function _destroy() {
				this._unbindFormResetHandler();
				this.menuWrap.remove();
				this.button.remove();
				this.element.show();
				this.element.removeUniqueId();
				this.labels.attr("for", this.ids.element);
			}
		}]);

		var widgetsSlider = $.widget("ui.slider", $.ui.mouse, {
			version: "1.12.1",
			widgetEventPrefix: "slide",

			options: {
				animate: false,
				classes: {
					"ui-slider": "ui-corner-all",
					"ui-slider-handle": "ui-corner-all",

					"ui-slider-range": "ui-corner-all ui-widget-header"
				},
				distance: 0,
				max: 100,
				min: 0,
				orientation: "horizontal",
				range: false,
				step: 1,
				value: 0,
				values: null,

				change: null,
				slide: null,
				start: null,
				stop: null
			},

			numPages: 5,

			_create: function _create() {
				this._keySliding = false;
				this._mouseSliding = false;
				this._animateOff = true;
				this._handleIndex = null;
				this._detectOrientation();
				this._mouseInit();
				this._calculateNewMax();

				this._addClass("ui-slider ui-slider-" + this.orientation, "ui-widget ui-widget-content");

				this._refresh();

				this._animateOff = false;
			},

			_refresh: function _refresh() {
				this._createRange();
				this._createHandles();
				this._setupEvents();
				this._refreshValue();
			},

			_createHandles: function _createHandles() {
				var i,
				    handleCount,
				    options = this.options,
				    existingHandles = this.element.find(".ui-slider-handle"),
				    handle = "<span tabindex='0'></span>",
				    handles = [];

				handleCount = options.values && options.values.length || 1;

				if (existingHandles.length > handleCount) {
					existingHandles.slice(handleCount).remove();
					existingHandles = existingHandles.slice(0, handleCount);
				}

				for (i = existingHandles.length; i < handleCount; i++) {
					handles.push(handle);
				}

				this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

				this._addClass(this.handles, "ui-slider-handle", "ui-state-default");

				this.handle = this.handles.eq(0);

				this.handles.each(function (i) {
					$(this).data("ui-slider-handle-index", i).attr("tabIndex", 0);
				});
			},

			_createRange: function _createRange() {
				var options = this.options;

				if (options.range) {
					if (options.range === true) {
						if (!options.values) {
							options.values = [this._valueMin(), this._valueMin()];
						} else if (options.values.length && options.values.length !== 2) {
							options.values = [options.values[0], options.values[0]];
						} else if ($.isArray(options.values)) {
							options.values = options.values.slice(0);
						}
					}

					if (!this.range || !this.range.length) {
						this.range = $("<div>").appendTo(this.element);

						this._addClass(this.range, "ui-slider-range");
					} else {
						this._removeClass(this.range, "ui-slider-range-min ui-slider-range-max");

						this.range.css({
							"left": "",
							"bottom": ""
						});
					}
					if (options.range === "min" || options.range === "max") {
						this._addClass(this.range, "ui-slider-range-" + options.range);
					}
				} else {
					if (this.range) {
						this.range.remove();
					}
					this.range = null;
				}
			},

			_setupEvents: function _setupEvents() {
				this._off(this.handles);
				this._on(this.handles, this._handleEvents);
				this._hoverable(this.handles);
				this._focusable(this.handles);
			},

			_destroy: function _destroy() {
				this.handles.remove();
				if (this.range) {
					this.range.remove();
				}

				this._mouseDestroy();
			},

			_mouseCapture: function _mouseCapture(event) {
				var position,
				    normValue,
				    distance,
				    closestHandle,
				    index,
				    allowed,
				    offset,
				    mouseOverHandle,
				    that = this,
				    o = this.options;

				if (o.disabled) {
					return false;
				}

				this.elementSize = {
					width: this.element.outerWidth(),
					height: this.element.outerHeight()
				};
				this.elementOffset = this.element.offset();

				position = { x: event.pageX, y: event.pageY };
				normValue = this._normValueFromMouse(position);
				distance = this._valueMax() - this._valueMin() + 1;
				this.handles.each(function (i) {
					var thisDistance = Math.abs(normValue - that.values(i));
					if (distance > thisDistance || distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min)) {
						distance = thisDistance;
						closestHandle = $(this);
						index = i;
					}
				});

				allowed = this._start(event, index);
				if (allowed === false) {
					return false;
				}
				this._mouseSliding = true;

				this._handleIndex = index;

				this._addClass(closestHandle, null, "ui-state-active");
				closestHandle.trigger("focus");

				offset = closestHandle.offset();
				mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
				this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
					left: event.pageX - offset.left - closestHandle.width() / 2,
					top: event.pageY - offset.top - closestHandle.height() / 2 - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
				};

				if (!this.handles.hasClass("ui-state-hover")) {
					this._slide(event, index, normValue);
				}
				this._animateOff = true;
				return true;
			},

			_mouseStart: function _mouseStart() {
				return true;
			},

			_mouseDrag: function _mouseDrag(event) {
				var position = { x: event.pageX, y: event.pageY },
				    normValue = this._normValueFromMouse(position);

				this._slide(event, this._handleIndex, normValue);

				return false;
			},

			_mouseStop: function _mouseStop(event) {
				this._removeClass(this.handles, null, "ui-state-active");
				this._mouseSliding = false;

				this._stop(event, this._handleIndex);
				this._change(event, this._handleIndex);

				this._handleIndex = null;
				this._clickOffset = null;
				this._animateOff = false;

				return false;
			},

			_detectOrientation: function _detectOrientation() {
				this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal";
			},

			_normValueFromMouse: function _normValueFromMouse(position) {
				var pixelTotal, pixelMouse, percentMouse, valueTotal, valueMouse;

				if (this.orientation === "horizontal") {
					pixelTotal = this.elementSize.width;
					pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
				} else {
					pixelTotal = this.elementSize.height;
					pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
				}

				percentMouse = pixelMouse / pixelTotal;
				if (percentMouse > 1) {
					percentMouse = 1;
				}
				if (percentMouse < 0) {
					percentMouse = 0;
				}
				if (this.orientation === "vertical") {
					percentMouse = 1 - percentMouse;
				}

				valueTotal = this._valueMax() - this._valueMin();
				valueMouse = this._valueMin() + percentMouse * valueTotal;

				return this._trimAlignValue(valueMouse);
			},

			_uiHash: function _uiHash(index, value, values) {
				var uiHash = {
					handle: this.handles[index],
					handleIndex: index,
					value: value !== undefined ? value : this.value()
				};

				if (this._hasMultipleValues()) {
					uiHash.value = value !== undefined ? value : this.values(index);
					uiHash.values = values || this.values();
				}

				return uiHash;
			},

			_hasMultipleValues: function _hasMultipleValues() {
				return this.options.values && this.options.values.length;
			},

			_start: function _start(event, index) {
				return this._trigger("start", event, this._uiHash(index));
			},

			_slide: function _slide(event, index, newVal) {
				var allowed,
				    otherVal,
				    currentValue = this.value(),
				    newValues = this.values();

				if (this._hasMultipleValues()) {
					otherVal = this.values(index ? 0 : 1);
					currentValue = this.values(index);

					if (this.options.values.length === 2 && this.options.range === true) {
						newVal = index === 0 ? Math.min(otherVal, newVal) : Math.max(otherVal, newVal);
					}

					newValues[index] = newVal;
				}

				if (newVal === currentValue) {
					return;
				}

				allowed = this._trigger("slide", event, this._uiHash(index, newVal, newValues));

				if (allowed === false) {
					return;
				}

				if (this._hasMultipleValues()) {
					this.values(index, newVal);
				} else {
					this.value(newVal);
				}
			},

			_stop: function _stop(event, index) {
				this._trigger("stop", event, this._uiHash(index));
			},

			_change: function _change(event, index) {
				if (!this._keySliding && !this._mouseSliding) {
					this._lastChangedValue = index;
					this._trigger("change", event, this._uiHash(index));
				}
			},

			value: function value(newValue) {
				if (arguments.length) {
					this.options.value = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, 0);
					return;
				}

				return this._value();
			},

			values: function values(index, newValue) {
				var vals, newValues, i;

				if (arguments.length > 1) {
					this.options.values[index] = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, index);
					return;
				}

				if (arguments.length) {
					if ($.isArray(arguments[0])) {
						vals = this.options.values;
						newValues = arguments[0];
						for (i = 0; i < vals.length; i += 1) {
							vals[i] = this._trimAlignValue(newValues[i]);
							this._change(null, i);
						}
						this._refreshValue();
					} else {
						if (this._hasMultipleValues()) {
							return this._values(index);
						} else {
							return this.value();
						}
					}
				} else {
					return this._values();
				}
			},

			_setOption: function _setOption(key, value) {
				var i,
				    valsLength = 0;

				if (key === "range" && this.options.range === true) {
					if (value === "min") {
						this.options.value = this._values(0);
						this.options.values = null;
					} else if (value === "max") {
						this.options.value = this._values(this.options.values.length - 1);
						this.options.values = null;
					}
				}

				if ($.isArray(this.options.values)) {
					valsLength = this.options.values.length;
				}

				this._super(key, value);

				switch (key) {
					case "orientation":
						this._detectOrientation();
						this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-" + this.orientation);
						this._refreshValue();
						if (this.options.range) {
							this._refreshRange(value);
						}

						this.handles.css(value === "horizontal" ? "bottom" : "left", "");
						break;
					case "value":
						this._animateOff = true;
						this._refreshValue();
						this._change(null, 0);
						this._animateOff = false;
						break;
					case "values":
						this._animateOff = true;
						this._refreshValue();

						for (i = valsLength - 1; i >= 0; i--) {
							this._change(null, i);
						}
						this._animateOff = false;
						break;
					case "step":
					case "min":
					case "max":
						this._animateOff = true;
						this._calculateNewMax();
						this._refreshValue();
						this._animateOff = false;
						break;
					case "range":
						this._animateOff = true;
						this._refresh();
						this._animateOff = false;
						break;
				}
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this._toggleClass(null, "ui-state-disabled", !!value);
			},

			_value: function _value() {
				var val = this.options.value;
				val = this._trimAlignValue(val);

				return val;
			},

			_values: function _values(index) {
				var val, vals, i;

				if (arguments.length) {
					val = this.options.values[index];
					val = this._trimAlignValue(val);

					return val;
				} else if (this._hasMultipleValues()) {
					vals = this.options.values.slice();
					for (i = 0; i < vals.length; i += 1) {
						vals[i] = this._trimAlignValue(vals[i]);
					}

					return vals;
				} else {
					return [];
				}
			},

			_trimAlignValue: function _trimAlignValue(val) {
				if (val <= this._valueMin()) {
					return this._valueMin();
				}
				if (val >= this._valueMax()) {
					return this._valueMax();
				}
				var step = this.options.step > 0 ? this.options.step : 1,
				    valModStep = (val - this._valueMin()) % step,
				    alignValue = val - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += valModStep > 0 ? step : -step;
				}

				return parseFloat(alignValue.toFixed(5));
			},

			_calculateNewMax: function _calculateNewMax() {
				var max = this.options.max,
				    min = this._valueMin(),
				    step = this.options.step,
				    aboveMin = Math.round((max - min) / step) * step;
				max = aboveMin + min;
				if (max > this.options.max) {
					max -= step;
				}
				this.max = parseFloat(max.toFixed(this._precision()));
			},

			_precision: function _precision() {
				var precision = this._precisionOf(this.options.step);
				if (this.options.min !== null) {
					precision = Math.max(precision, this._precisionOf(this.options.min));
				}
				return precision;
			},

			_precisionOf: function _precisionOf(num) {
				var str = num.toString(),
				    decimal = str.indexOf(".");
				return decimal === -1 ? 0 : str.length - decimal - 1;
			},

			_valueMin: function _valueMin() {
				return this.options.min;
			},

			_valueMax: function _valueMax() {
				return this.max;
			},

			_refreshRange: function _refreshRange(orientation) {
				if (orientation === "vertical") {
					this.range.css({ "width": "", "left": "" });
				}
				if (orientation === "horizontal") {
					this.range.css({ "height": "", "bottom": "" });
				}
			},

			_refreshValue: function _refreshValue() {
				var lastValPercent,
				    valPercent,
				    value,
				    valueMin,
				    valueMax,
				    oRange = this.options.range,
				    o = this.options,
				    that = this,
				    animate = !this._animateOff ? o.animate : false,
				    _set = {};

				if (this._hasMultipleValues()) {
					this.handles.each(function (i) {
						valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
						_set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
						$(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
						if (that.options.range === true) {
							if (that.orientation === "horizontal") {
								if (i === 0) {
									that.range.stop(1, 1)[animate ? "animate" : "css"]({
										left: valPercent + "%"
									}, o.animate);
								}
								if (i === 1) {
									that.range[animate ? "animate" : "css"]({
										width: valPercent - lastValPercent + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							} else {
								if (i === 0) {
									that.range.stop(1, 1)[animate ? "animate" : "css"]({
										bottom: valPercent + "%"
									}, o.animate);
								}
								if (i === 1) {
									that.range[animate ? "animate" : "css"]({
										height: valPercent - lastValPercent + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							}
						}
						lastValPercent = valPercent;
					});
				} else {
					value = this.value();
					valueMin = this._valueMin();
					valueMax = this._valueMax();
					valPercent = valueMax !== valueMin ? (value - valueMin) / (valueMax - valueMin) * 100 : 0;
					_set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
					this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);

					if (oRange === "min" && this.orientation === "horizontal") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							width: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "horizontal") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							width: 100 - valPercent + "%"
						}, o.animate);
					}
					if (oRange === "min" && this.orientation === "vertical") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							height: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "vertical") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							height: 100 - valPercent + "%"
						}, o.animate);
					}
				}
			},

			_handleEvents: {
				keydown: function keydown(event) {
					var allowed,
					    curVal,
					    newVal,
					    step,
					    index = $(event.target).data("ui-slider-handle-index");

					switch (event.keyCode) {
						case $.ui.keyCode.HOME:
						case $.ui.keyCode.END:
						case $.ui.keyCode.PAGE_UP:
						case $.ui.keyCode.PAGE_DOWN:
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							event.preventDefault();
							if (!this._keySliding) {
								this._keySliding = true;
								this._addClass($(event.target), null, "ui-state-active");
								allowed = this._start(event, index);
								if (allowed === false) {
									return;
								}
							}
							break;
					}

					step = this.options.step;
					if (this._hasMultipleValues()) {
						curVal = newVal = this.values(index);
					} else {
						curVal = newVal = this.value();
					}

					switch (event.keyCode) {
						case $.ui.keyCode.HOME:
							newVal = this._valueMin();
							break;
						case $.ui.keyCode.END:
							newVal = this._valueMax();
							break;
						case $.ui.keyCode.PAGE_UP:
							newVal = this._trimAlignValue(curVal + (this._valueMax() - this._valueMin()) / this.numPages);
							break;
						case $.ui.keyCode.PAGE_DOWN:
							newVal = this._trimAlignValue(curVal - (this._valueMax() - this._valueMin()) / this.numPages);
							break;
						case $.ui.keyCode.UP:
						case $.ui.keyCode.RIGHT:
							if (curVal === this._valueMax()) {
								return;
							}
							newVal = this._trimAlignValue(curVal + step);
							break;
						case $.ui.keyCode.DOWN:
						case $.ui.keyCode.LEFT:
							if (curVal === this._valueMin()) {
								return;
							}
							newVal = this._trimAlignValue(curVal - step);
							break;
					}

					this._slide(event, index, newVal);
				},
				keyup: function keyup(event) {
					var index = $(event.target).data("ui-slider-handle-index");

					if (this._keySliding) {
						this._keySliding = false;
						this._stop(event, index);
						this._change(event, index);
						this._removeClass($(event.target), null, "ui-state-active");
					}
				}
			}
		});

		var widgetsSortable = $.widget("ui.sortable", $.ui.mouse, {
			version: "1.12.1",
			widgetEventPrefix: "sort",
			ready: false,
			options: {
				appendTo: "parent",
				axis: false,
				connectWith: false,
				containment: false,
				cursor: "auto",
				cursorAt: false,
				dropOnEmpty: true,
				forcePlaceholderSize: false,
				forceHelperSize: false,
				grid: false,
				handle: false,
				helper: "original",
				items: "> *",
				opacity: false,
				placeholder: false,
				revert: false,
				scroll: true,
				scrollSensitivity: 20,
				scrollSpeed: 20,
				scope: "default",
				tolerance: "intersect",
				zIndex: 1000,

				activate: null,
				beforeStop: null,
				change: null,
				deactivate: null,
				out: null,
				over: null,
				receive: null,
				remove: null,
				sort: null,
				start: null,
				stop: null,
				update: null
			},

			_isOverAxis: function _isOverAxis(x, reference, size) {
				return x >= reference && x < reference + size;
			},

			_isFloating: function _isFloating(item) {
				return (/left|right/.test(item.css("float")) || /inline|table-cell/.test(item.css("display"))
				);
			},

			_create: function _create() {
				this.containerCache = {};
				this._addClass("ui-sortable");

				this.refresh();

				this.offset = this.element.offset();

				this._mouseInit();

				this._setHandleClassName();

				this.ready = true;
			},

			_setOption: function _setOption(key, value) {
				this._super(key, value);

				if (key === "handle") {
					this._setHandleClassName();
				}
			},

			_setHandleClassName: function _setHandleClassName() {
				var that = this;
				this._removeClass(this.element.find(".ui-sortable-handle"), "ui-sortable-handle");
				$.each(this.items, function () {
					that._addClass(this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item, "ui-sortable-handle");
				});
			},

			_destroy: function _destroy() {
				this._mouseDestroy();

				for (var i = this.items.length - 1; i >= 0; i--) {
					this.items[i].item.removeData(this.widgetName + "-item");
				}

				return this;
			},

			_mouseCapture: function _mouseCapture(event, overrideHandle) {
				var currentItem = null,
				    validHandle = false,
				    that = this;

				if (this.reverting) {
					return false;
				}

				if (this.options.disabled || this.options.type === "static") {
					return false;
				}

				this._refreshItems(event);

				$(event.target).parents().each(function () {
					if ($.data(this, that.widgetName + "-item") === that) {
						currentItem = $(this);
						return false;
					}
				});
				if ($.data(event.target, that.widgetName + "-item") === that) {
					currentItem = $(event.target);
				}

				if (!currentItem) {
					return false;
				}
				if (this.options.handle && !overrideHandle) {
					$(this.options.handle, currentItem).find("*").addBack().each(function () {
						if (this === event.target) {
							validHandle = true;
						}
					});
					if (!validHandle) {
						return false;
					}
				}

				this.currentItem = currentItem;
				this._removeCurrentsFromItems();
				return true;
			},

			_mouseStart: function _mouseStart(event, overrideHandle, noActivation) {

				var i,
				    body,
				    o = this.options;

				this.currentContainer = this;

				this.refreshPositions();

				this.helper = this._createHelper(event);

				this._cacheHelperProportions();

				this._cacheMargins();

				this.scrollParent = this.helper.scrollParent();

				this.offset = this.currentItem.offset();
				this.offset = {
					top: this.offset.top - this.margins.top,
					left: this.offset.left - this.margins.left
				};

				$.extend(this.offset, {
					click: {
						left: event.pageX - this.offset.left,
						top: event.pageY - this.offset.top
					},
					parent: this._getParentOffset(),

					relative: this._getRelativeOffset()
				});

				this.helper.css("position", "absolute");
				this.cssPosition = this.helper.css("position");

				this.originalPosition = this._generatePosition(event);
				this.originalPageX = event.pageX;
				this.originalPageY = event.pageY;

				o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);

				this.domPosition = {
					prev: this.currentItem.prev()[0],
					parent: this.currentItem.parent()[0]
				};

				if (this.helper[0] !== this.currentItem[0]) {
					this.currentItem.hide();
				}

				this._createPlaceholder();

				if (o.containment) {
					this._setContainment();
				}

				if (o.cursor && o.cursor !== "auto") {
					body = this.document.find("body");

					this.storedCursor = body.css("cursor");
					body.css("cursor", o.cursor);

					this.storedStylesheet = $("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(body);
				}

				if (o.opacity) {
					if (this.helper.css("opacity")) {
						this._storedOpacity = this.helper.css("opacity");
					}
					this.helper.css("opacity", o.opacity);
				}

				if (o.zIndex) {
					if (this.helper.css("zIndex")) {
						this._storedZIndex = this.helper.css("zIndex");
					}
					this.helper.css("zIndex", o.zIndex);
				}

				if (this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
					this.overflowOffset = this.scrollParent.offset();
				}

				this._trigger("start", event, this._uiHash());

				if (!this._preserveHelperProportions) {
					this._cacheHelperProportions();
				}

				if (!noActivation) {
					for (i = this.containers.length - 1; i >= 0; i--) {
						this.containers[i]._trigger("activate", event, this._uiHash(this));
					}
				}

				if ($.ui.ddmanager) {
					$.ui.ddmanager.current = this;
				}

				if ($.ui.ddmanager && !o.dropBehaviour) {
					$.ui.ddmanager.prepareOffsets(this, event);
				}

				this.dragging = true;

				this._addClass(this.helper, "ui-sortable-helper");

				this._mouseDrag(event);
				return true;
			},

			_mouseDrag: function _mouseDrag(event) {
				var i,
				    item,
				    itemElement,
				    intersection,
				    o = this.options,
				    scrolled = false;

				this.position = this._generatePosition(event);
				this.positionAbs = this._convertPositionTo("absolute");

				if (!this.lastPositionAbs) {
					this.lastPositionAbs = this.positionAbs;
				}

				if (this.options.scroll) {
					if (this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {

						if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) {
							this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
						} else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
							this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
						}

						if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) {
							this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
						} else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
							this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
						}
					} else {

						if (event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
							scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
						} else if (this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
							scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
						}

						if (event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
							scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
						} else if (this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
							scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
						}
					}

					if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
						$.ui.ddmanager.prepareOffsets(this, event);
					}
				}

				this.positionAbs = this._convertPositionTo("absolute");

				if (!this.options.axis || this.options.axis !== "y") {
					this.helper[0].style.left = this.position.left + "px";
				}
				if (!this.options.axis || this.options.axis !== "x") {
					this.helper[0].style.top = this.position.top + "px";
				}

				for (i = this.items.length - 1; i >= 0; i--) {
					item = this.items[i];
					itemElement = item.item[0];
					intersection = this._intersectsWithPointer(item);
					if (!intersection) {
						continue;
					}

					if (item.instance !== this.currentContainer) {
						continue;
					}

					if (itemElement !== this.currentItem[0] && this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement && !$.contains(this.placeholder[0], itemElement) && (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)) {

						this.direction = intersection === 1 ? "down" : "up";

						if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
							this._rearrange(event, item);
						} else {
							break;
						}

						this._trigger("change", event, this._uiHash());
						break;
					}
				}

				this._contactContainers(event);

				if ($.ui.ddmanager) {
					$.ui.ddmanager.drag(this, event);
				}

				this._trigger("sort", event, this._uiHash());

				this.lastPositionAbs = this.positionAbs;
				return false;
			},

			_mouseStop: function _mouseStop(event, noPropagation) {

				if (!event) {
					return;
				}

				if ($.ui.ddmanager && !this.options.dropBehaviour) {
					$.ui.ddmanager.drop(this, event);
				}

				if (this.options.revert) {
					var that = this,
					    cur = this.placeholder.offset(),
					    axis = this.options.axis,
					    animation = {};

					if (!axis || axis === "x") {
						animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
					}
					if (!axis || axis === "y") {
						animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
					}
					this.reverting = true;
					$(this.helper).animate(animation, parseInt(this.options.revert, 10) || 500, function () {
						that._clear(event);
					});
				} else {
					this._clear(event, noPropagation);
				}

				return false;
			},

			cancel: function cancel() {

				if (this.dragging) {

					this._mouseUp(new $.Event("mouseup", { target: null }));

					if (this.options.helper === "original") {
						this.currentItem.css(this._storedCSS);
						this._removeClass(this.currentItem, "ui-sortable-helper");
					} else {
						this.currentItem.show();
					}

					for (var i = this.containers.length - 1; i >= 0; i--) {
						this.containers[i]._trigger("deactivate", null, this._uiHash(this));
						if (this.containers[i].containerCache.over) {
							this.containers[i]._trigger("out", null, this._uiHash(this));
							this.containers[i].containerCache.over = 0;
						}
					}
				}

				if (this.placeholder) {
					if (this.placeholder[0].parentNode) {
						this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
					}
					if (this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
						this.helper.remove();
					}

					$.extend(this, {
						helper: null,
						dragging: false,
						reverting: false,
						_noFinalSort: null
					});

					if (this.domPosition.prev) {
						$(this.domPosition.prev).after(this.currentItem);
					} else {
						$(this.domPosition.parent).prepend(this.currentItem);
					}
				}

				return this;
			},

			serialize: function serialize(o) {

				var items = this._getItemsAsjQuery(o && o.connected),
				    str = [];
				o = o || {};

				$(items).each(function () {
					var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || /(.+)[\-=_](.+)/);
					if (res) {
						str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
					}
				});

				if (!str.length && o.key) {
					str.push(o.key + "=");
				}

				return str.join("&");
			},

			toArray: function toArray(o) {

				var items = this._getItemsAsjQuery(o && o.connected),
				    ret = [];

				o = o || {};

				items.each(function () {
					ret.push($(o.item || this).attr(o.attribute || "id") || "");
				});
				return ret;
			},

			_intersectsWith: function _intersectsWith(item) {

				var x1 = this.positionAbs.left,
				    x2 = x1 + this.helperProportions.width,
				    y1 = this.positionAbs.top,
				    y2 = y1 + this.helperProportions.height,
				    l = item.left,
				    r = l + item.width,
				    t = item.top,
				    b = t + item.height,
				    dyClick = this.offset.click.top,
				    dxClick = this.offset.click.left,
				    isOverElementHeight = this.options.axis === "x" || y1 + dyClick > t && y1 + dyClick < b,
				    isOverElementWidth = this.options.axis === "y" || x1 + dxClick > l && x1 + dxClick < r,
				    isOverElement = isOverElementHeight && isOverElementWidth;

				if (this.options.tolerance === "pointer" || this.options.forcePointerForContainers || this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"]) {
					return isOverElement;
				} else {

					return l < x1 + this.helperProportions.width / 2 && x2 - this.helperProportions.width / 2 < r && t < y1 + this.helperProportions.height / 2 && y2 - this.helperProportions.height / 2 < b;
				}
			},

			_intersectsWithPointer: function _intersectsWithPointer(item) {
				var verticalDirection,
				    horizontalDirection,
				    isOverElementHeight = this.options.axis === "x" || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
				    isOverElementWidth = this.options.axis === "y" || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
				    isOverElement = isOverElementHeight && isOverElementWidth;

				if (!isOverElement) {
					return false;
				}

				verticalDirection = this._getDragVerticalDirection();
				horizontalDirection = this._getDragHorizontalDirection();

				return this.floating ? horizontalDirection === "right" || verticalDirection === "down" ? 2 : 1 : verticalDirection && (verticalDirection === "down" ? 2 : 1);
			},

			_intersectsWithSides: function _intersectsWithSides(item) {

				var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + item.height / 2, item.height),
				    isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + item.width / 2, item.width),
				    verticalDirection = this._getDragVerticalDirection(),
				    horizontalDirection = this._getDragHorizontalDirection();

				if (this.floating && horizontalDirection) {
					return horizontalDirection === "right" && isOverRightHalf || horizontalDirection === "left" && !isOverRightHalf;
				} else {
					return verticalDirection && (verticalDirection === "down" && isOverBottomHalf || verticalDirection === "up" && !isOverBottomHalf);
				}
			},

			_getDragVerticalDirection: function _getDragVerticalDirection() {
				var delta = this.positionAbs.top - this.lastPositionAbs.top;
				return delta !== 0 && (delta > 0 ? "down" : "up");
			},

			_getDragHorizontalDirection: function _getDragHorizontalDirection() {
				var delta = this.positionAbs.left - this.lastPositionAbs.left;
				return delta !== 0 && (delta > 0 ? "right" : "left");
			},

			refresh: function refresh(event) {
				this._refreshItems(event);
				this._setHandleClassName();
				this.refreshPositions();
				return this;
			},

			_connectWith: function _connectWith() {
				var options = this.options;
				return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
			},

			_getItemsAsjQuery: function _getItemsAsjQuery(connected) {

				var i,
				    j,
				    cur,
				    inst,
				    items = [],
				    queries = [],
				    connectWith = this._connectWith();

				if (connectWith && connected) {
					for (i = connectWith.length - 1; i >= 0; i--) {
						cur = $(connectWith[i], this.document[0]);
						for (j = cur.length - 1; j >= 0; j--) {
							inst = $.data(cur[j], this.widgetFullName);
							if (inst && inst !== this && !inst.options.disabled) {
								queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
							}
						}
					}
				}

				queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

				function addItems() {
					items.push(this);
				}
				for (i = queries.length - 1; i >= 0; i--) {
					queries[i][0].each(addItems);
				}

				return $(items);
			},

			_removeCurrentsFromItems: function _removeCurrentsFromItems() {

				var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

				this.items = $.grep(this.items, function (item) {
					for (var j = 0; j < list.length; j++) {
						if (list[j] === item.item[0]) {
							return false;
						}
					}
					return true;
				});
			},

			_refreshItems: function _refreshItems(event) {

				this.items = [];
				this.containers = [this];

				var i,
				    j,
				    cur,
				    inst,
				    targetData,
				    _queries,
				    item,
				    queriesLength,
				    items = this.items,
				    queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
				    connectWith = this._connectWith();

				if (connectWith && this.ready) {
					for (i = connectWith.length - 1; i >= 0; i--) {
						cur = $(connectWith[i], this.document[0]);
						for (j = cur.length - 1; j >= 0; j--) {
							inst = $.data(cur[j], this.widgetFullName);
							if (inst && inst !== this && !inst.options.disabled) {
								queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
								this.containers.push(inst);
							}
						}
					}
				}

				for (i = queries.length - 1; i >= 0; i--) {
					targetData = queries[i][1];
					_queries = queries[i][0];

					for (j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
						item = $(_queries[j]);

						item.data(this.widgetName + "-item", targetData);

						items.push({
							item: item,
							instance: targetData,
							width: 0, height: 0,
							left: 0, top: 0
						});
					}
				}
			},

			refreshPositions: function refreshPositions(fast) {
				this.floating = this.items.length ? this.options.axis === "x" || this._isFloating(this.items[0].item) : false;

				if (this.offsetParent && this.helper) {
					this.offset.parent = this._getParentOffset();
				}

				var i, item, t, p;

				for (i = this.items.length - 1; i >= 0; i--) {
					item = this.items[i];

					if (item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
						continue;
					}

					t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

					if (!fast) {
						item.width = t.outerWidth();
						item.height = t.outerHeight();
					}

					p = t.offset();
					item.left = p.left;
					item.top = p.top;
				}

				if (this.options.custom && this.options.custom.refreshContainers) {
					this.options.custom.refreshContainers.call(this);
				} else {
					for (i = this.containers.length - 1; i >= 0; i--) {
						p = this.containers[i].element.offset();
						this.containers[i].containerCache.left = p.left;
						this.containers[i].containerCache.top = p.top;
						this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
						this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
					}
				}

				return this;
			},

			_createPlaceholder: function _createPlaceholder(that) {
				that = that || this;
				var className,
				    o = that.options;

				if (!o.placeholder || o.placeholder.constructor === String) {
					className = o.placeholder;
					o.placeholder = {
						element: function element() {

							var nodeName = that.currentItem[0].nodeName.toLowerCase(),
							    element = $("<" + nodeName + ">", that.document[0]);

							that._addClass(element, "ui-sortable-placeholder", className || that.currentItem[0].className)._removeClass(element, "ui-sortable-helper");

							if (nodeName === "tbody") {
								that._createTrPlaceholder(that.currentItem.find("tr").eq(0), $("<tr>", that.document[0]).appendTo(element));
							} else if (nodeName === "tr") {
								that._createTrPlaceholder(that.currentItem, element);
							} else if (nodeName === "img") {
								element.attr("src", that.currentItem.attr("src"));
							}

							if (!className) {
								element.css("visibility", "hidden");
							}

							return element;
						},
						update: function update(container, p) {
							if (className && !o.forcePlaceholderSize) {
								return;
							}

							if (!p.height()) {
								p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
							}
							if (!p.width()) {
								p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
							}
						}
					};
				}

				that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

				that.currentItem.after(that.placeholder);

				o.placeholder.update(that, that.placeholder);
			},

			_createTrPlaceholder: function _createTrPlaceholder(sourceTr, targetTr) {
				var that = this;

				sourceTr.children().each(function () {
					$("<td>&#160;</td>", that.document[0]).attr("colspan", $(this).attr("colspan") || 1).appendTo(targetTr);
				});
			},

			_contactContainers: function _contactContainers(event) {
				var i,
				    j,
				    dist,
				    itemWithLeastDistance,
				    posProperty,
				    sizeProperty,
				    cur,
				    nearBottom,
				    floating,
				    axis,
				    innermostContainer = null,
				    innermostIndex = null;

				for (i = this.containers.length - 1; i >= 0; i--) {
					if ($.contains(this.currentItem[0], this.containers[i].element[0])) {
						continue;
					}

					if (this._intersectsWith(this.containers[i].containerCache)) {
						if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
							continue;
						}

						innermostContainer = this.containers[i];
						innermostIndex = i;
					} else {
						if (this.containers[i].containerCache.over) {
							this.containers[i]._trigger("out", event, this._uiHash(this));
							this.containers[i].containerCache.over = 0;
						}
					}
				}

				if (!innermostContainer) {
					return;
				}

				if (this.containers.length === 1) {
					if (!this.containers[innermostIndex].containerCache.over) {
						this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
						this.containers[innermostIndex].containerCache.over = 1;
					}
				} else {
					dist = 10000;
					itemWithLeastDistance = null;
					floating = innermostContainer.floating || this._isFloating(this.currentItem);
					posProperty = floating ? "left" : "top";
					sizeProperty = floating ? "width" : "height";
					axis = floating ? "pageX" : "pageY";

					for (j = this.items.length - 1; j >= 0; j--) {
						if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
							continue;
						}
						if (this.items[j].item[0] === this.currentItem[0]) {
							continue;
						}

						cur = this.items[j].item.offset()[posProperty];
						nearBottom = false;
						if (event[axis] - cur > this.items[j][sizeProperty] / 2) {
							nearBottom = true;
						}

						if (Math.abs(event[axis] - cur) < dist) {
							dist = Math.abs(event[axis] - cur);
							itemWithLeastDistance = this.items[j];
							this.direction = nearBottom ? "up" : "down";
						}
					}

					if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
						return;
					}

					if (this.currentContainer === this.containers[innermostIndex]) {
						if (!this.currentContainer.containerCache.over) {
							this.containers[innermostIndex]._trigger("over", event, this._uiHash());
							this.currentContainer.containerCache.over = 1;
						}
						return;
					}

					itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
					this._trigger("change", event, this._uiHash());
					this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
					this.currentContainer = this.containers[innermostIndex];

					this.options.placeholder.update(this.currentContainer, this.placeholder);

					this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
					this.containers[innermostIndex].containerCache.over = 1;
				}
			},

			_createHelper: function _createHelper(event) {

				var o = this.options,
				    helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : o.helper === "clone" ? this.currentItem.clone() : this.currentItem;

				if (!helper.parents("body").length) {
					$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
				}

				if (helper[0] === this.currentItem[0]) {
					this._storedCSS = {
						width: this.currentItem[0].style.width,
						height: this.currentItem[0].style.height,
						position: this.currentItem.css("position"),
						top: this.currentItem.css("top"),
						left: this.currentItem.css("left")
					};
				}

				if (!helper[0].style.width || o.forceHelperSize) {
					helper.width(this.currentItem.width());
				}
				if (!helper[0].style.height || o.forceHelperSize) {
					helper.height(this.currentItem.height());
				}

				return helper;
			},

			_adjustOffsetFromHelper: function _adjustOffsetFromHelper(obj) {
				if (typeof obj === "string") {
					obj = obj.split(" ");
				}
				if ($.isArray(obj)) {
					obj = { left: +obj[0], top: +obj[1] || 0 };
				}
				if ("left" in obj) {
					this.offset.click.left = obj.left + this.margins.left;
				}
				if ("right" in obj) {
					this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
				}
				if ("top" in obj) {
					this.offset.click.top = obj.top + this.margins.top;
				}
				if ("bottom" in obj) {
					this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
				}
			},

			_getParentOffset: function _getParentOffset() {
				this.offsetParent = this.helper.offsetParent();
				var po = this.offsetParent.offset();

				if (this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
					po.left += this.scrollParent.scrollLeft();
					po.top += this.scrollParent.scrollTop();
				}

				if (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie) {
					po = { top: 0, left: 0 };
				}

				return {
					top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
					left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
				};
			},

			_getRelativeOffset: function _getRelativeOffset() {

				if (this.cssPosition === "relative") {
					var p = this.currentItem.position();
					return {
						top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
						left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
					};
				} else {
					return { top: 0, left: 0 };
				}
			},

			_cacheMargins: function _cacheMargins() {
				this.margins = {
					left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
					top: parseInt(this.currentItem.css("marginTop"), 10) || 0
				};
			},

			_cacheHelperProportions: function _cacheHelperProportions() {
				this.helperProportions = {
					width: this.helper.outerWidth(),
					height: this.helper.outerHeight()
				};
			},

			_setContainment: function _setContainment() {

				var ce,
				    co,
				    over,
				    o = this.options;
				if (o.containment === "parent") {
					o.containment = this.helper[0].parentNode;
				}
				if (o.containment === "document" || o.containment === "window") {
					this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, (o.containment === "document" ? this.document.height() || document.body.parentNode.scrollHeight : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
				}

				if (!/^(document|window|parent)$/.test(o.containment)) {
					ce = $(o.containment)[0];
					co = $(o.containment).offset();
					over = $(ce).css("overflow") !== "hidden";

					this.containment = [co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
				}
			},

			_convertPositionTo: function _convertPositionTo(d, pos) {

				if (!pos) {
					pos = this.position;
				}
				var mod = d === "absolute" ? 1 : -1,
				    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
				    scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);

				return {
					top: pos.top + this.offset.relative.top * mod + this.offset.parent.top * mod - (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()) * mod,
					left: pos.left + this.offset.relative.left * mod + this.offset.parent.left * mod - (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod
				};
			},

			_generatePosition: function _generatePosition(event) {

				var top,
				    left,
				    o = this.options,
				    pageX = event.pageX,
				    pageY = event.pageY,
				    scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
				    scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);

				if (this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
					this.offset.relative = this._getRelativeOffset();
				}

				if (this.originalPosition) {

					if (this.containment) {
						if (event.pageX - this.offset.click.left < this.containment[0]) {
							pageX = this.containment[0] + this.offset.click.left;
						}
						if (event.pageY - this.offset.click.top < this.containment[1]) {
							pageY = this.containment[1] + this.offset.click.top;
						}
						if (event.pageX - this.offset.click.left > this.containment[2]) {
							pageX = this.containment[2] + this.offset.click.left;
						}
						if (event.pageY - this.offset.click.top > this.containment[3]) {
							pageY = this.containment[3] + this.offset.click.top;
						}
					}

					if (o.grid) {
						top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
						pageY = this.containment ? top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3] ? top : top - this.offset.click.top >= this.containment[1] ? top - o.grid[1] : top + o.grid[1] : top;

						left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
						pageX = this.containment ? left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2] ? left : left - this.offset.click.left >= this.containment[0] ? left - o.grid[0] : left + o.grid[0] : left;
					}
				}

				return {
					top: pageY - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()),
					left: pageX - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())
				};
			},

			_rearrange: function _rearrange(event, i, a, hardRefresh) {

				a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], this.direction === "down" ? i.item[0] : i.item[0].nextSibling);

				this.counter = this.counter ? ++this.counter : 1;
				var counter = this.counter;

				this._delay(function () {
					if (counter === this.counter) {
						this.refreshPositions(!hardRefresh);
					}
				});
			},

			_clear: function _clear(event, noPropagation) {

				this.reverting = false;

				var i,
				    delayedTriggers = [];

				if (!this._noFinalSort && this.currentItem.parent().length) {
					this.placeholder.before(this.currentItem);
				}
				this._noFinalSort = null;

				if (this.helper[0] === this.currentItem[0]) {
					for (i in this._storedCSS) {
						if (this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
							this._storedCSS[i] = "";
						}
					}
					this.currentItem.css(this._storedCSS);
					this._removeClass(this.currentItem, "ui-sortable-helper");
				} else {
					this.currentItem.show();
				}

				if (this.fromOutside && !noPropagation) {
					delayedTriggers.push(function (event) {
						this._trigger("receive", event, this._uiHash(this.fromOutside));
					});
				}
				if ((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
					delayedTriggers.push(function (event) {
						this._trigger("update", event, this._uiHash());
					});
				}

				if (this !== this.currentContainer) {
					if (!noPropagation) {
						delayedTriggers.push(function (event) {
							this._trigger("remove", event, this._uiHash());
						});
						delayedTriggers.push(function (c) {
							return function (event) {
								c._trigger("receive", event, this._uiHash(this));
							};
						}.call(this, this.currentContainer));
						delayedTriggers.push(function (c) {
							return function (event) {
								c._trigger("update", event, this._uiHash(this));
							};
						}.call(this, this.currentContainer));
					}
				}

				function delayEvent(type, instance, container) {
					return function (event) {
						container._trigger(type, event, instance._uiHash(instance));
					};
				}
				for (i = this.containers.length - 1; i >= 0; i--) {
					if (!noPropagation) {
						delayedTriggers.push(delayEvent("deactivate", this, this.containers[i]));
					}
					if (this.containers[i].containerCache.over) {
						delayedTriggers.push(delayEvent("out", this, this.containers[i]));
						this.containers[i].containerCache.over = 0;
					}
				}

				if (this.storedCursor) {
					this.document.find("body").css("cursor", this.storedCursor);
					this.storedStylesheet.remove();
				}
				if (this._storedOpacity) {
					this.helper.css("opacity", this._storedOpacity);
				}
				if (this._storedZIndex) {
					this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
				}

				this.dragging = false;

				if (!noPropagation) {
					this._trigger("beforeStop", event, this._uiHash());
				}

				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

				if (!this.cancelHelperRemoval) {
					if (this.helper[0] !== this.currentItem[0]) {
						this.helper.remove();
					}
					this.helper = null;
				}

				if (!noPropagation) {
					for (i = 0; i < delayedTriggers.length; i++) {
						delayedTriggers[i].call(this, event);
					}
					this._trigger("stop", event, this._uiHash());
				}

				this.fromOutside = false;
				return !this.cancelHelperRemoval;
			},

			_trigger: function _trigger() {
				if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
					this.cancel();
				}
			},

			_uiHash: function _uiHash(_inst) {
				var inst = _inst || this;
				return {
					helper: inst.helper,
					placeholder: inst.placeholder || $([]),
					position: inst.position,
					originalPosition: inst.originalPosition,
					offset: inst.positionAbs,
					item: inst.currentItem,
					sender: _inst ? _inst.element : null
				};
			}

		});

		function spinnerModifer(fn) {
			return function () {
				var previous = this.element.val();
				fn.apply(this, arguments);
				this._refresh();
				if (previous !== this.element.val()) {
					this._trigger("change");
				}
			};
		}

		$.widget("ui.spinner", {
			version: "1.12.1",
			defaultElement: "<input>",
			widgetEventPrefix: "spin",
			options: {
				classes: {
					"ui-spinner": "ui-corner-all",
					"ui-spinner-down": "ui-corner-br",
					"ui-spinner-up": "ui-corner-tr"
				},
				culture: null,
				icons: {
					down: "ui-icon-triangle-1-s",
					up: "ui-icon-triangle-1-n"
				},
				incremental: true,
				max: null,
				min: null,
				numberFormat: null,
				page: 10,
				step: 1,

				change: null,
				spin: null,
				start: null,
				stop: null
			},

			_create: function _create() {
				this._setOption("max", this.options.max);
				this._setOption("min", this.options.min);
				this._setOption("step", this.options.step);

				if (this.value() !== "") {
					this._value(this.element.val(), true);
				}

				this._draw();
				this._on(this._events);
				this._refresh();

				this._on(this.window, {
					beforeunload: function beforeunload() {
						this.element.removeAttr("autocomplete");
					}
				});
			},

			_getCreateOptions: function _getCreateOptions() {
				var options = this._super();
				var element = this.element;

				$.each(["min", "max", "step"], function (i, option) {
					var value = element.attr(option);
					if (value != null && value.length) {
						options[option] = value;
					}
				});

				return options;
			},

			_events: {
				keydown: function keydown(event) {
					if (this._start(event) && this._keydown(event)) {
						event.preventDefault();
					}
				},
				keyup: "_stop",
				focus: function focus() {
					this.previous = this.element.val();
				},
				blur: function blur(event) {
					if (this.cancelBlur) {
						delete this.cancelBlur;
						return;
					}

					this._stop();
					this._refresh();
					if (this.previous !== this.element.val()) {
						this._trigger("change", event);
					}
				},
				mousewheel: function mousewheel(event, delta) {
					if (!delta) {
						return;
					}
					if (!this.spinning && !this._start(event)) {
						return false;
					}

					this._spin((delta > 0 ? 1 : -1) * this.options.step, event);
					clearTimeout(this.mousewheelTimer);
					this.mousewheelTimer = this._delay(function () {
						if (this.spinning) {
							this._stop(event);
						}
					}, 100);
					event.preventDefault();
				},
				"mousedown .ui-spinner-button": function mousedownUiSpinnerButton(event) {
					var previous;

					previous = this.element[0] === $.ui.safeActiveElement(this.document[0]) ? this.previous : this.element.val();
					function checkFocus() {
						var isActive = this.element[0] === $.ui.safeActiveElement(this.document[0]);
						if (!isActive) {
							this.element.trigger("focus");
							this.previous = previous;

							this._delay(function () {
								this.previous = previous;
							});
						}
					}

					event.preventDefault();
					checkFocus.call(this);

					this.cancelBlur = true;
					this._delay(function () {
						delete this.cancelBlur;
						checkFocus.call(this);
					});

					if (this._start(event) === false) {
						return;
					}

					this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event);
				},
				"mouseup .ui-spinner-button": "_stop",
				"mouseenter .ui-spinner-button": function mouseenterUiSpinnerButton(event) {
					if (!$(event.currentTarget).hasClass("ui-state-active")) {
						return;
					}

					if (this._start(event) === false) {
						return false;
					}
					this._repeat(null, $(event.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, event);
				},

				"mouseleave .ui-spinner-button": "_stop"
			},

			_enhance: function _enhance() {
				this.uiSpinner = this.element.attr("autocomplete", "off").wrap("<span>").parent().append("<a></a><a></a>");
			},

			_draw: function _draw() {
				this._enhance();

				this._addClass(this.uiSpinner, "ui-spinner", "ui-widget ui-widget-content");
				this._addClass("ui-spinner-input");

				this.element.attr("role", "spinbutton");

				this.buttons = this.uiSpinner.children("a").attr("tabIndex", -1).attr("aria-hidden", true).button({
					classes: {
						"ui-button": ""
					}
				});

				this._removeClass(this.buttons, "ui-corner-all");

				this._addClass(this.buttons.first(), "ui-spinner-button ui-spinner-up");
				this._addClass(this.buttons.last(), "ui-spinner-button ui-spinner-down");
				this.buttons.first().button({
					"icon": this.options.icons.up,
					"showLabel": false
				});
				this.buttons.last().button({
					"icon": this.options.icons.down,
					"showLabel": false
				});

				if (this.buttons.height() > Math.ceil(this.uiSpinner.height() * 0.5) && this.uiSpinner.height() > 0) {
					this.uiSpinner.height(this.uiSpinner.height());
				}
			},

			_keydown: function _keydown(event) {
				var options = this.options,
				    keyCode = $.ui.keyCode;

				switch (event.keyCode) {
					case keyCode.UP:
						this._repeat(null, 1, event);
						return true;
					case keyCode.DOWN:
						this._repeat(null, -1, event);
						return true;
					case keyCode.PAGE_UP:
						this._repeat(null, options.page, event);
						return true;
					case keyCode.PAGE_DOWN:
						this._repeat(null, -options.page, event);
						return true;
				}

				return false;
			},

			_start: function _start(event) {
				if (!this.spinning && this._trigger("start", event) === false) {
					return false;
				}

				if (!this.counter) {
					this.counter = 1;
				}
				this.spinning = true;
				return true;
			},

			_repeat: function _repeat(i, steps, event) {
				i = i || 500;

				clearTimeout(this.timer);
				this.timer = this._delay(function () {
					this._repeat(40, steps, event);
				}, i);

				this._spin(steps * this.options.step, event);
			},

			_spin: function _spin(step, event) {
				var value = this.value() || 0;

				if (!this.counter) {
					this.counter = 1;
				}

				value = this._adjustValue(value + step * this._increment(this.counter));

				if (!this.spinning || this._trigger("spin", event, { value: value }) !== false) {
					this._value(value);
					this.counter++;
				}
			},

			_increment: function _increment(i) {
				var incremental = this.options.incremental;

				if (incremental) {
					return $.isFunction(incremental) ? incremental(i) : Math.floor(i * i * i / 50000 - i * i / 500 + 17 * i / 200 + 1);
				}

				return 1;
			},

			_precision: function _precision() {
				var precision = this._precisionOf(this.options.step);
				if (this.options.min !== null) {
					precision = Math.max(precision, this._precisionOf(this.options.min));
				}
				return precision;
			},

			_precisionOf: function _precisionOf(num) {
				var str = num.toString(),
				    decimal = str.indexOf(".");
				return decimal === -1 ? 0 : str.length - decimal - 1;
			},

			_adjustValue: function _adjustValue(value) {
				var base,
				    aboveMin,
				    options = this.options;

				base = options.min !== null ? options.min : 0;
				aboveMin = value - base;

				aboveMin = Math.round(aboveMin / options.step) * options.step;

				value = base + aboveMin;

				value = parseFloat(value.toFixed(this._precision()));

				if (options.max !== null && value > options.max) {
					return options.max;
				}
				if (options.min !== null && value < options.min) {
					return options.min;
				}

				return value;
			},

			_stop: function _stop(event) {
				if (!this.spinning) {
					return;
				}

				clearTimeout(this.timer);
				clearTimeout(this.mousewheelTimer);
				this.counter = 0;
				this.spinning = false;
				this._trigger("stop", event);
			},

			_setOption: function _setOption(key, value) {
				var prevValue, first, last;

				if (key === "culture" || key === "numberFormat") {
					prevValue = this._parse(this.element.val());
					this.options[key] = value;
					this.element.val(this._format(prevValue));
					return;
				}

				if (key === "max" || key === "min" || key === "step") {
					if (typeof value === "string") {
						value = this._parse(value);
					}
				}
				if (key === "icons") {
					first = this.buttons.first().find(".ui-icon");
					this._removeClass(first, null, this.options.icons.up);
					this._addClass(first, null, value.up);
					last = this.buttons.last().find(".ui-icon");
					this._removeClass(last, null, this.options.icons.down);
					this._addClass(last, null, value.down);
				}

				this._super(key, value);
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this._super(value);

				this._toggleClass(this.uiSpinner, null, "ui-state-disabled", !!value);
				this.element.prop("disabled", !!value);
				this.buttons.button(value ? "disable" : "enable");
			},

			_setOptions: spinnerModifer(function (options) {
				this._super(options);
			}),

			_parse: function _parse(val) {
				if (typeof val === "string" && val !== "") {
					val = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(val, 10, this.options.culture) : +val;
				}
				return val === "" || isNaN(val) ? null : val;
			},

			_format: function _format(value) {
				if (value === "") {
					return "";
				}
				return window.Globalize && this.options.numberFormat ? Globalize.format(value, this.options.numberFormat, this.options.culture) : value;
			},

			_refresh: function _refresh() {
				this.element.attr({
					"aria-valuemin": this.options.min,
					"aria-valuemax": this.options.max,

					"aria-valuenow": this._parse(this.element.val())
				});
			},

			isValid: function isValid() {
				var value = this.value();

				if (value === null) {
					return false;
				}

				return value === this._adjustValue(value);
			},

			_value: function _value(value, allowAny) {
				var parsed;
				if (value !== "") {
					parsed = this._parse(value);
					if (parsed !== null) {
						if (!allowAny) {
							parsed = this._adjustValue(parsed);
						}
						value = this._format(parsed);
					}
				}
				this.element.val(value);
				this._refresh();
			},

			_destroy: function _destroy() {
				this.element.prop("disabled", false).removeAttr("autocomplete role aria-valuemin aria-valuemax aria-valuenow");

				this.uiSpinner.replaceWith(this.element);
			},

			stepUp: spinnerModifer(function (steps) {
				this._stepUp(steps);
			}),
			_stepUp: function _stepUp(steps) {
				if (this._start()) {
					this._spin((steps || 1) * this.options.step);
					this._stop();
				}
			},

			stepDown: spinnerModifer(function (steps) {
				this._stepDown(steps);
			}),
			_stepDown: function _stepDown(steps) {
				if (this._start()) {
					this._spin((steps || 1) * -this.options.step);
					this._stop();
				}
			},

			pageUp: spinnerModifer(function (pages) {
				this._stepUp((pages || 1) * this.options.page);
			}),

			pageDown: spinnerModifer(function (pages) {
				this._stepDown((pages || 1) * this.options.page);
			}),

			value: function value(newVal) {
				if (!arguments.length) {
					return this._parse(this.element.val());
				}
				spinnerModifer(this._value).call(this, newVal);
			},

			widget: function widget() {
				return this.uiSpinner;
			}
		});

		if ($.uiBackCompat !== false) {
			$.widget("ui.spinner", $.ui.spinner, {
				_enhance: function _enhance() {
					this.uiSpinner = this.element.attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
				},
				_uiSpinnerHtml: function _uiSpinnerHtml() {
					return "<span>";
				},

				_buttonHtml: function _buttonHtml() {
					return "<a></a><a></a>";
				}
			});
		}

		var widgetsSpinner = $.ui.spinner;

		$.widget("ui.tabs", {
			version: "1.12.1",
			delay: 300,
			options: {
				active: null,
				classes: {
					"ui-tabs": "ui-corner-all",
					"ui-tabs-nav": "ui-corner-all",
					"ui-tabs-panel": "ui-corner-bottom",
					"ui-tabs-tab": "ui-corner-top"
				},
				collapsible: false,
				event: "click",
				heightStyle: "content",
				hide: null,
				show: null,

				activate: null,
				beforeActivate: null,
				beforeLoad: null,
				load: null
			},

			_isLocal: function () {
				var rhash = /#.*$/;

				return function (anchor) {
					var anchorUrl, locationUrl;

					anchorUrl = anchor.href.replace(rhash, "");
					locationUrl = location.href.replace(rhash, "");

					try {
						anchorUrl = decodeURIComponent(anchorUrl);
					} catch (error) {}
					try {
						locationUrl = decodeURIComponent(locationUrl);
					} catch (error) {}

					return anchor.hash.length > 1 && anchorUrl === locationUrl;
				};
			}(),

			_create: function _create() {
				var that = this,
				    options = this.options;

				this.running = false;

				this._addClass("ui-tabs", "ui-widget ui-widget-content");
				this._toggleClass("ui-tabs-collapsible", null, options.collapsible);

				this._processTabs();
				options.active = this._initialActive();

				if ($.isArray(options.disabled)) {
					options.disabled = $.unique(options.disabled.concat($.map(this.tabs.filter(".ui-state-disabled"), function (li) {
						return that.tabs.index(li);
					}))).sort();
				}

				if (this.options.active !== false && this.anchors.length) {
					this.active = this._findActive(options.active);
				} else {
					this.active = $();
				}

				this._refresh();

				if (this.active.length) {
					this.load(options.active);
				}
			},

			_initialActive: function _initialActive() {
				var active = this.options.active,
				    collapsible = this.options.collapsible,
				    locationHash = location.hash.substring(1);

				if (active === null) {
					if (locationHash) {
						this.tabs.each(function (i, tab) {
							if ($(tab).attr("aria-controls") === locationHash) {
								active = i;
								return false;
							}
						});
					}

					if (active === null) {
						active = this.tabs.index(this.tabs.filter(".ui-tabs-active"));
					}

					if (active === null || active === -1) {
						active = this.tabs.length ? 0 : false;
					}
				}

				if (active !== false) {
					active = this.tabs.index(this.tabs.eq(active));
					if (active === -1) {
						active = collapsible ? false : 0;
					}
				}

				if (!collapsible && active === false && this.anchors.length) {
					active = 0;
				}

				return active;
			},

			_getCreateEventData: function _getCreateEventData() {
				return {
					tab: this.active,
					panel: !this.active.length ? $() : this._getPanelForTab(this.active)
				};
			},

			_tabKeydown: function _tabKeydown(event) {
				var focusedTab = $($.ui.safeActiveElement(this.document[0])).closest("li"),
				    selectedIndex = this.tabs.index(focusedTab),
				    goingForward = true;

				if (this._handlePageNav(event)) {
					return;
				}

				switch (event.keyCode) {
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
						selectedIndex++;
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.LEFT:
						goingForward = false;
						selectedIndex--;
						break;
					case $.ui.keyCode.END:
						selectedIndex = this.anchors.length - 1;
						break;
					case $.ui.keyCode.HOME:
						selectedIndex = 0;
						break;
					case $.ui.keyCode.SPACE:
						event.preventDefault();
						clearTimeout(this.activating);
						this._activate(selectedIndex);
						return;
					case $.ui.keyCode.ENTER:
						event.preventDefault();
						clearTimeout(this.activating);

						this._activate(selectedIndex === this.options.active ? false : selectedIndex);
						return;
					default:
						return;
				}

				event.preventDefault();
				clearTimeout(this.activating);
				selectedIndex = this._focusNextTab(selectedIndex, goingForward);

				if (!event.ctrlKey && !event.metaKey) {
					focusedTab.attr("aria-selected", "false");
					this.tabs.eq(selectedIndex).attr("aria-selected", "true");

					this.activating = this._delay(function () {
						this.option("active", selectedIndex);
					}, this.delay);
				}
			},

			_panelKeydown: function _panelKeydown(event) {
				if (this._handlePageNav(event)) {
					return;
				}

				if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
					event.preventDefault();
					this.active.trigger("focus");
				}
			},

			_handlePageNav: function _handlePageNav(event) {
				if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP) {
					this._activate(this._focusNextTab(this.options.active - 1, false));
					return true;
				}
				if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN) {
					this._activate(this._focusNextTab(this.options.active + 1, true));
					return true;
				}
			},

			_findNextTab: function _findNextTab(index, goingForward) {
				var lastTabIndex = this.tabs.length - 1;

				function constrain() {
					if (index > lastTabIndex) {
						index = 0;
					}
					if (index < 0) {
						index = lastTabIndex;
					}
					return index;
				}

				while ($.inArray(constrain(), this.options.disabled) !== -1) {
					index = goingForward ? index + 1 : index - 1;
				}

				return index;
			},

			_focusNextTab: function _focusNextTab(index, goingForward) {
				index = this._findNextTab(index, goingForward);
				this.tabs.eq(index).trigger("focus");
				return index;
			},

			_setOption: function _setOption(key, value) {
				if (key === "active") {
					this._activate(value);
					return;
				}

				this._super(key, value);

				if (key === "collapsible") {
					this._toggleClass("ui-tabs-collapsible", null, value);

					if (!value && this.options.active === false) {
						this._activate(0);
					}
				}

				if (key === "event") {
					this._setupEvents(value);
				}

				if (key === "heightStyle") {
					this._setupHeightStyle(value);
				}
			},

			_sanitizeSelector: function _sanitizeSelector(hash) {
				return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
			},

			refresh: function refresh() {
				var options = this.options,
				    lis = this.tablist.children(":has(a[href])");

				options.disabled = $.map(lis.filter(".ui-state-disabled"), function (tab) {
					return lis.index(tab);
				});

				this._processTabs();

				if (options.active === false || !this.anchors.length) {
					options.active = false;
					this.active = $();
				} else if (this.active.length && !$.contains(this.tablist[0], this.active[0])) {
					if (this.tabs.length === options.disabled.length) {
						options.active = false;
						this.active = $();
					} else {
						this._activate(this._findNextTab(Math.max(0, options.active - 1), false));
					}
				} else {
					options.active = this.tabs.index(this.active);
				}

				this._refresh();
			},

			_refresh: function _refresh() {
				this._setOptionDisabled(this.options.disabled);
				this._setupEvents(this.options.event);
				this._setupHeightStyle(this.options.heightStyle);

				this.tabs.not(this.active).attr({
					"aria-selected": "false",
					"aria-expanded": "false",
					tabIndex: -1
				});
				this.panels.not(this._getPanelForTab(this.active)).hide().attr({
					"aria-hidden": "true"
				});

				if (!this.active.length) {
					this.tabs.eq(0).attr("tabIndex", 0);
				} else {
					this.active.attr({
						"aria-selected": "true",
						"aria-expanded": "true",
						tabIndex: 0
					});
					this._addClass(this.active, "ui-tabs-active", "ui-state-active");
					this._getPanelForTab(this.active).show().attr({
						"aria-hidden": "false"
					});
				}
			},

			_processTabs: function _processTabs() {
				var that = this,
				    prevTabs = this.tabs,
				    prevAnchors = this.anchors,
				    prevPanels = this.panels;

				this.tablist = this._getList().attr("role", "tablist");
				this._addClass(this.tablist, "ui-tabs-nav", "ui-helper-reset ui-helper-clearfix ui-widget-header");

				this.tablist.on("mousedown" + this.eventNamespace, "> li", function (event) {
					if ($(this).is(".ui-state-disabled")) {
						event.preventDefault();
					}
				}).on("focus" + this.eventNamespace, ".ui-tabs-anchor", function () {
					if ($(this).closest("li").is(".ui-state-disabled")) {
						this.blur();
					}
				});

				this.tabs = this.tablist.find("> li:has(a[href])").attr({
					role: "tab",
					tabIndex: -1
				});
				this._addClass(this.tabs, "ui-tabs-tab", "ui-state-default");

				this.anchors = this.tabs.map(function () {
					return $("a", this)[0];
				}).attr({
					role: "presentation",
					tabIndex: -1
				});
				this._addClass(this.anchors, "ui-tabs-anchor");

				this.panels = $();

				this.anchors.each(function (i, anchor) {
					var selector,
					    panel,
					    panelId,
					    anchorId = $(anchor).uniqueId().attr("id"),
					    tab = $(anchor).closest("li"),
					    originalAriaControls = tab.attr("aria-controls");

					if (that._isLocal(anchor)) {
						selector = anchor.hash;
						panelId = selector.substring(1);
						panel = that.element.find(that._sanitizeSelector(selector));
					} else {
						panelId = tab.attr("aria-controls") || $({}).uniqueId()[0].id;
						selector = "#" + panelId;
						panel = that.element.find(selector);
						if (!panel.length) {
							panel = that._createPanel(panelId);
							panel.insertAfter(that.panels[i - 1] || that.tablist);
						}
						panel.attr("aria-live", "polite");
					}

					if (panel.length) {
						that.panels = that.panels.add(panel);
					}
					if (originalAriaControls) {
						tab.data("ui-tabs-aria-controls", originalAriaControls);
					}
					tab.attr({
						"aria-controls": panelId,
						"aria-labelledby": anchorId
					});
					panel.attr("aria-labelledby", anchorId);
				});

				this.panels.attr("role", "tabpanel");
				this._addClass(this.panels, "ui-tabs-panel", "ui-widget-content");

				if (prevTabs) {
					this._off(prevTabs.not(this.tabs));
					this._off(prevAnchors.not(this.anchors));
					this._off(prevPanels.not(this.panels));
				}
			},

			_getList: function _getList() {
				return this.tablist || this.element.find("ol, ul").eq(0);
			},

			_createPanel: function _createPanel(id) {
				return $("<div>").attr("id", id).data("ui-tabs-destroy", true);
			},

			_setOptionDisabled: function _setOptionDisabled(disabled) {
				var currentItem, li, i;

				if ($.isArray(disabled)) {
					if (!disabled.length) {
						disabled = false;
					} else if (disabled.length === this.anchors.length) {
						disabled = true;
					}
				}

				for (i = 0; li = this.tabs[i]; i++) {
					currentItem = $(li);
					if (disabled === true || $.inArray(i, disabled) !== -1) {
						currentItem.attr("aria-disabled", "true");
						this._addClass(currentItem, null, "ui-state-disabled");
					} else {
						currentItem.removeAttr("aria-disabled");
						this._removeClass(currentItem, null, "ui-state-disabled");
					}
				}

				this.options.disabled = disabled;

				this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, disabled === true);
			},

			_setupEvents: function _setupEvents(event) {
				var events = {};
				if (event) {
					$.each(event.split(" "), function (index, eventName) {
						events[eventName] = "_eventHandler";
					});
				}

				this._off(this.anchors.add(this.tabs).add(this.panels));

				this._on(true, this.anchors, {
					click: function click(event) {
						event.preventDefault();
					}
				});
				this._on(this.anchors, events);
				this._on(this.tabs, { keydown: "_tabKeydown" });
				this._on(this.panels, { keydown: "_panelKeydown" });

				this._focusable(this.tabs);
				this._hoverable(this.tabs);
			},

			_setupHeightStyle: function _setupHeightStyle(heightStyle) {
				var maxHeight,
				    parent = this.element.parent();

				if (heightStyle === "fill") {
					maxHeight = parent.height();
					maxHeight -= this.element.outerHeight() - this.element.height();

					this.element.siblings(":visible").each(function () {
						var elem = $(this),
						    position = elem.css("position");

						if (position === "absolute" || position === "fixed") {
							return;
						}
						maxHeight -= elem.outerHeight(true);
					});

					this.element.children().not(this.panels).each(function () {
						maxHeight -= $(this).outerHeight(true);
					});

					this.panels.each(function () {
						$(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
					}).css("overflow", "auto");
				} else if (heightStyle === "auto") {
					maxHeight = 0;
					this.panels.each(function () {
						maxHeight = Math.max(maxHeight, $(this).height("").height());
					}).height(maxHeight);
				}
			},

			_eventHandler: function _eventHandler(event) {
				var options = this.options,
				    active = this.active,
				    anchor = $(event.currentTarget),
				    tab = anchor.closest("li"),
				    clickedIsActive = tab[0] === active[0],
				    collapsing = clickedIsActive && options.collapsible,
				    toShow = collapsing ? $() : this._getPanelForTab(tab),
				    toHide = !active.length ? $() : this._getPanelForTab(active),
				    eventData = {
					oldTab: active,
					oldPanel: toHide,
					newTab: collapsing ? $() : tab,
					newPanel: toShow
				};

				event.preventDefault();

				if (tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading") || this.running || clickedIsActive && !options.collapsible || this._trigger("beforeActivate", event, eventData) === false) {
					return;
				}

				options.active = collapsing ? false : this.tabs.index(tab);

				this.active = clickedIsActive ? $() : tab;
				if (this.xhr) {
					this.xhr.abort();
				}

				if (!toHide.length && !toShow.length) {
					$.error("jQuery UI Tabs: Mismatching fragment identifier.");
				}

				if (toShow.length) {
					this.load(this.tabs.index(tab), event);
				}
				this._toggle(event, eventData);
			},

			_toggle: function _toggle(event, eventData) {
				var that = this,
				    toShow = eventData.newPanel,
				    toHide = eventData.oldPanel;

				this.running = true;

				function complete() {
					that.running = false;
					that._trigger("activate", event, eventData);
				}

				function show() {
					that._addClass(eventData.newTab.closest("li"), "ui-tabs-active", "ui-state-active");

					if (toShow.length && that.options.show) {
						that._show(toShow, that.options.show, complete);
					} else {
						toShow.show();
						complete();
					}
				}

				if (toHide.length && this.options.hide) {
					this._hide(toHide, this.options.hide, function () {
						that._removeClass(eventData.oldTab.closest("li"), "ui-tabs-active", "ui-state-active");
						show();
					});
				} else {
					this._removeClass(eventData.oldTab.closest("li"), "ui-tabs-active", "ui-state-active");
					toHide.hide();
					show();
				}

				toHide.attr("aria-hidden", "true");
				eventData.oldTab.attr({
					"aria-selected": "false",
					"aria-expanded": "false"
				});

				if (toShow.length && toHide.length) {
					eventData.oldTab.attr("tabIndex", -1);
				} else if (toShow.length) {
					this.tabs.filter(function () {
						return $(this).attr("tabIndex") === 0;
					}).attr("tabIndex", -1);
				}

				toShow.attr("aria-hidden", "false");
				eventData.newTab.attr({
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				});
			},

			_activate: function _activate(index) {
				var anchor,
				    active = this._findActive(index);

				if (active[0] === this.active[0]) {
					return;
				}

				if (!active.length) {
					active = this.active;
				}

				anchor = active.find(".ui-tabs-anchor")[0];
				this._eventHandler({
					target: anchor,
					currentTarget: anchor,
					preventDefault: $.noop
				});
			},

			_findActive: function _findActive(index) {
				return index === false ? $() : this.tabs.eq(index);
			},

			_getIndex: function _getIndex(index) {
				if (typeof index === "string") {
					index = this.anchors.index(this.anchors.filter("[href$='" + $.ui.escapeSelector(index) + "']"));
				}

				return index;
			},

			_destroy: function _destroy() {
				if (this.xhr) {
					this.xhr.abort();
				}

				this.tablist.removeAttr("role").off(this.eventNamespace);

				this.anchors.removeAttr("role tabIndex").removeUniqueId();

				this.tabs.add(this.panels).each(function () {
					if ($.data(this, "ui-tabs-destroy")) {
						$(this).remove();
					} else {
						$(this).removeAttr("role tabIndex " + "aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded");
					}
				});

				this.tabs.each(function () {
					var li = $(this),
					    prev = li.data("ui-tabs-aria-controls");
					if (prev) {
						li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls");
					} else {
						li.removeAttr("aria-controls");
					}
				});

				this.panels.show();

				if (this.options.heightStyle !== "content") {
					this.panels.css("height", "");
				}
			},

			enable: function enable(index) {
				var disabled = this.options.disabled;
				if (disabled === false) {
					return;
				}

				if (index === undefined) {
					disabled = false;
				} else {
					index = this._getIndex(index);
					if ($.isArray(disabled)) {
						disabled = $.map(disabled, function (num) {
							return num !== index ? num : null;
						});
					} else {
						disabled = $.map(this.tabs, function (li, num) {
							return num !== index ? num : null;
						});
					}
				}
				this._setOptionDisabled(disabled);
			},

			disable: function disable(index) {
				var disabled = this.options.disabled;
				if (disabled === true) {
					return;
				}

				if (index === undefined) {
					disabled = true;
				} else {
					index = this._getIndex(index);
					if ($.inArray(index, disabled) !== -1) {
						return;
					}
					if ($.isArray(disabled)) {
						disabled = $.merge([index], disabled).sort();
					} else {
						disabled = [index];
					}
				}
				this._setOptionDisabled(disabled);
			},

			load: function load(index, event) {
				index = this._getIndex(index);
				var that = this,
				    tab = this.tabs.eq(index),
				    anchor = tab.find(".ui-tabs-anchor"),
				    panel = this._getPanelForTab(tab),
				    eventData = {
					tab: tab,
					panel: panel
				},
				    complete = function complete(jqXHR, status) {
					if (status === "abort") {
						that.panels.stop(false, true);
					}

					that._removeClass(tab, "ui-tabs-loading");
					panel.removeAttr("aria-busy");

					if (jqXHR === that.xhr) {
						delete that.xhr;
					}
				};

				if (this._isLocal(anchor[0])) {
					return;
				}

				this.xhr = $.ajax(this._ajaxSettings(anchor, event, eventData));

				if (this.xhr && this.xhr.statusText !== "canceled") {
					this._addClass(tab, "ui-tabs-loading");
					panel.attr("aria-busy", "true");

					this.xhr.done(function (response, status, jqXHR) {
						setTimeout(function () {
							panel.html(response);
							that._trigger("load", event, eventData);

							complete(jqXHR, status);
						}, 1);
					}).fail(function (jqXHR, status) {
						setTimeout(function () {
							complete(jqXHR, status);
						}, 1);
					});
				}
			},

			_ajaxSettings: function _ajaxSettings(anchor, event, eventData) {
				var that = this;
				return {
					url: anchor.attr("href").replace(/#.*$/, ""),
					beforeSend: function beforeSend(jqXHR, settings) {
						return that._trigger("beforeLoad", event, $.extend({ jqXHR: jqXHR, ajaxSettings: settings }, eventData));
					}
				};
			},

			_getPanelForTab: function _getPanelForTab(tab) {
				var id = $(tab).attr("aria-controls");
				return this.element.find(this._sanitizeSelector("#" + id));
			}
		});

		if ($.uiBackCompat !== false) {
			$.widget("ui.tabs", $.ui.tabs, {
				_processTabs: function _processTabs() {
					this._superApply(arguments);
					this._addClass(this.tabs, "ui-tab");
				}
			});
		}

		var widgetsTabs = $.ui.tabs;

		$.widget("ui.tooltip", {
			version: "1.12.1",
			options: {
				classes: {
					"ui-tooltip": "ui-corner-all ui-widget-shadow"
				},
				content: function content() {
					var title = $(this).attr("title") || "";

					return $("<a>").text(title).html();
				},
				hide: true,

				items: "[title]:not([disabled])",
				position: {
					my: "left top+15",
					at: "left bottom",
					collision: "flipfit flip"
				},
				show: true,
				track: false,

				close: null,
				open: null
			},

			_addDescribedBy: function _addDescribedBy(elem, id) {
				var describedby = (elem.attr("aria-describedby") || "").split(/\s+/);
				describedby.push(id);
				elem.data("ui-tooltip-id", id).attr("aria-describedby", $.trim(describedby.join(" ")));
			},

			_removeDescribedBy: function _removeDescribedBy(elem) {
				var id = elem.data("ui-tooltip-id"),
				    describedby = (elem.attr("aria-describedby") || "").split(/\s+/),
				    index = $.inArray(id, describedby);

				if (index !== -1) {
					describedby.splice(index, 1);
				}

				elem.removeData("ui-tooltip-id");
				describedby = $.trim(describedby.join(" "));
				if (describedby) {
					elem.attr("aria-describedby", describedby);
				} else {
					elem.removeAttr("aria-describedby");
				}
			},

			_create: function _create() {
				this._on({
					mouseover: "open",
					focusin: "open"
				});

				this.tooltips = {};

				this.parents = {};

				this.liveRegion = $("<div>").attr({
					role: "log",
					"aria-live": "assertive",
					"aria-relevant": "additions"
				}).appendTo(this.document[0].body);
				this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible");

				this.disabledTitles = $([]);
			},

			_setOption: function _setOption(key, value) {
				var that = this;

				this._super(key, value);

				if (key === "content") {
					$.each(this.tooltips, function (id, tooltipData) {
						that._updateContent(tooltipData.element);
					});
				}
			},

			_setOptionDisabled: function _setOptionDisabled(value) {
				this[value ? "_disable" : "_enable"]();
			},

			_disable: function _disable() {
				var that = this;

				$.each(this.tooltips, function (id, tooltipData) {
					var event = $.Event("blur");
					event.target = event.currentTarget = tooltipData.element[0];
					that.close(event, true);
				});

				this.disabledTitles = this.disabledTitles.add(this.element.find(this.options.items).addBack().filter(function () {
					var element = $(this);
					if (element.is("[title]")) {
						return element.data("ui-tooltip-title", element.attr("title")).removeAttr("title");
					}
				}));
			},

			_enable: function _enable() {
				this.disabledTitles.each(function () {
					var element = $(this);
					if (element.data("ui-tooltip-title")) {
						element.attr("title", element.data("ui-tooltip-title"));
					}
				});
				this.disabledTitles = $([]);
			},

			open: function open(event) {
				var that = this,
				    target = $(event ? event.target : this.element).closest(this.options.items);

				if (!target.length || target.data("ui-tooltip-id")) {
					return;
				}

				if (target.attr("title")) {
					target.data("ui-tooltip-title", target.attr("title"));
				}

				target.data("ui-tooltip-open", true);

				if (event && event.type === "mouseover") {
					target.parents().each(function () {
						var parent = $(this),
						    blurEvent;
						if (parent.data("ui-tooltip-open")) {
							blurEvent = $.Event("blur");
							blurEvent.target = blurEvent.currentTarget = this;
							that.close(blurEvent, true);
						}
						if (parent.attr("title")) {
							parent.uniqueId();
							that.parents[this.id] = {
								element: this,
								title: parent.attr("title")
							};
							parent.attr("title", "");
						}
					});
				}

				this._registerCloseHandlers(event, target);
				this._updateContent(target, event);
			},

			_updateContent: function _updateContent(target, event) {
				var content,
				    contentOption = this.options.content,
				    that = this,
				    eventType = event ? event.type : null;

				if (typeof contentOption === "string" || contentOption.nodeType || contentOption.jquery) {
					return this._open(event, target, contentOption);
				}

				content = contentOption.call(target[0], function (response) {
					that._delay(function () {
						if (!target.data("ui-tooltip-open")) {
							return;
						}

						if (event) {
							event.type = eventType;
						}
						this._open(event, target, response);
					});
				});
				if (content) {
					this._open(event, target, content);
				}
			},

			_open: function _open(event, target, content) {
				var tooltipData,
				    tooltip,
				    delayedShow,
				    a11yContent,
				    positionOption = $.extend({}, this.options.position);

				if (!content) {
					return;
				}

				tooltipData = this._find(target);
				if (tooltipData) {
					tooltipData.tooltip.find(".ui-tooltip-content").html(content);
					return;
				}

				if (target.is("[title]")) {
					if (event && event.type === "mouseover") {
						target.attr("title", "");
					} else {
						target.removeAttr("title");
					}
				}

				tooltipData = this._tooltip(target);
				tooltip = tooltipData.tooltip;
				this._addDescribedBy(target, tooltip.attr("id"));
				tooltip.find(".ui-tooltip-content").html(content);

				this.liveRegion.children().hide();
				a11yContent = $("<div>").html(tooltip.find(".ui-tooltip-content").html());
				a11yContent.removeAttr("name").find("[name]").removeAttr("name");
				a11yContent.removeAttr("id").find("[id]").removeAttr("id");
				a11yContent.appendTo(this.liveRegion);

				function position(event) {
					positionOption.of = event;
					if (tooltip.is(":hidden")) {
						return;
					}
					tooltip.position(positionOption);
				}
				if (this.options.track && event && /^mouse/.test(event.type)) {
					this._on(this.document, {
						mousemove: position
					});

					position(event);
				} else {
					tooltip.position($.extend({
						of: target
					}, this.options.position));
				}

				tooltip.hide();

				this._show(tooltip, this.options.show);

				if (this.options.track && this.options.show && this.options.show.delay) {
					delayedShow = this.delayedShow = setInterval(function () {
						if (tooltip.is(":visible")) {
							position(positionOption.of);
							clearInterval(delayedShow);
						}
					}, $.fx.interval);
				}

				this._trigger("open", event, { tooltip: tooltip });
			},

			_registerCloseHandlers: function _registerCloseHandlers(event, target) {
				var events = {
					keyup: function keyup(event) {
						if (event.keyCode === $.ui.keyCode.ESCAPE) {
							var fakeEvent = $.Event(event);
							fakeEvent.currentTarget = target[0];
							this.close(fakeEvent, true);
						}
					}
				};

				if (target[0] !== this.element[0]) {
					events.remove = function () {
						this._removeTooltip(this._find(target).tooltip);
					};
				}

				if (!event || event.type === "mouseover") {
					events.mouseleave = "close";
				}
				if (!event || event.type === "focusin") {
					events.focusout = "close";
				}
				this._on(true, target, events);
			},

			close: function close(event) {
				var tooltip,
				    that = this,
				    target = $(event ? event.currentTarget : this.element),
				    tooltipData = this._find(target);

				if (!tooltipData) {
					target.removeData("ui-tooltip-open");
					return;
				}

				tooltip = tooltipData.tooltip;

				if (tooltipData.closing) {
					return;
				}

				clearInterval(this.delayedShow);

				if (target.data("ui-tooltip-title") && !target.attr("title")) {
					target.attr("title", target.data("ui-tooltip-title"));
				}

				this._removeDescribedBy(target);

				tooltipData.hiding = true;
				tooltip.stop(true);
				this._hide(tooltip, this.options.hide, function () {
					that._removeTooltip($(this));
				});

				target.removeData("ui-tooltip-open");
				this._off(target, "mouseleave focusout keyup");

				if (target[0] !== this.element[0]) {
					this._off(target, "remove");
				}
				this._off(this.document, "mousemove");

				if (event && event.type === "mouseleave") {
					$.each(this.parents, function (id, parent) {
						$(parent.element).attr("title", parent.title);
						delete that.parents[id];
					});
				}

				tooltipData.closing = true;
				this._trigger("close", event, { tooltip: tooltip });
				if (!tooltipData.hiding) {
					tooltipData.closing = false;
				}
			},

			_tooltip: function _tooltip(element) {
				var tooltip = $("<div>").attr("role", "tooltip"),
				    content = $("<div>").appendTo(tooltip),
				    id = tooltip.uniqueId().attr("id");

				this._addClass(content, "ui-tooltip-content");
				this._addClass(tooltip, "ui-tooltip", "ui-widget ui-widget-content");

				tooltip.appendTo(this._appendTo(element));

				return this.tooltips[id] = {
					element: element,
					tooltip: tooltip
				};
			},

			_find: function _find(target) {
				var id = target.data("ui-tooltip-id");
				return id ? this.tooltips[id] : null;
			},

			_removeTooltip: function _removeTooltip(tooltip) {
				tooltip.remove();
				delete this.tooltips[tooltip.attr("id")];
			},

			_appendTo: function _appendTo(target) {
				var element = target.closest(".ui-front, dialog");

				if (!element.length) {
					element = this.document[0].body;
				}

				return element;
			},

			_destroy: function _destroy() {
				var that = this;

				$.each(this.tooltips, function (id, tooltipData) {
					var event = $.Event("blur"),
					    element = tooltipData.element;
					event.target = event.currentTarget = element[0];
					that.close(event, true);

					$("#" + id).remove();

					if (element.data("ui-tooltip-title")) {
						if (!element.attr("title")) {
							element.attr("title", element.data("ui-tooltip-title"));
						}
						element.removeData("ui-tooltip-title");
					}
				});
				this.liveRegion.remove();
			}
		});

		if ($.uiBackCompat !== false) {
			$.widget("ui.tooltip", $.ui.tooltip, {
				options: {
					tooltipClass: null
				},
				_tooltip: function _tooltip() {
					var tooltipData = this._superApply(arguments);
					if (this.options.tooltipClass) {
						tooltipData.tooltip.addClass(this.options.tooltipClass);
					}
					return tooltipData;
				}
			});
		}

		var widgetsTooltip = $.ui.tooltip;
	});
});
define("resources/js/jquery-ui", function(){});

define('resources/js/jquery.min',["module"], function (module) {
  "use strict";

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  !function (a, b) {
    "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = a.document ? b(a, !0) : function (a) {
      if (!a.document) throw new Error("jQuery requires a window with a document");return b(a);
    } : b(a);
  }("undefined" != typeof window ? window : undefined, function (a, b) {
    var c = [],
        d = c.slice,
        e = c.concat,
        f = c.push,
        g = c.indexOf,
        h = {},
        i = h.toString,
        j = h.hasOwnProperty,
        k = {},
        l = a.document,
        m = "2.1.3",
        n = function n(a, b) {
      return new n.fn.init(a, b);
    },
        o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        p = /^-ms-/,
        q = /-([\da-z])/gi,
        r = function r(a, b) {
      return b.toUpperCase();
    };n.fn = n.prototype = { jquery: m, constructor: n, selector: "", length: 0, toArray: function toArray() {
        return d.call(this);
      }, get: function get(a) {
        return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this);
      }, pushStack: function pushStack(a) {
        var b = n.merge(this.constructor(), a);return b.prevObject = this, b.context = this.context, b;
      }, each: function each(a, b) {
        return n.each(this, a, b);
      }, map: function map(a) {
        return this.pushStack(n.map(this, function (b, c) {
          return a.call(b, c, b);
        }));
      }, slice: function slice() {
        return this.pushStack(d.apply(this, arguments));
      }, first: function first() {
        return this.eq(0);
      }, last: function last() {
        return this.eq(-1);
      }, eq: function eq(a) {
        var b = this.length,
            c = +a + (0 > a ? b : 0);return this.pushStack(c >= 0 && b > c ? [this[c]] : []);
      }, end: function end() {
        return this.prevObject || this.constructor(null);
      }, push: f, sort: c.sort, splice: c.splice }, n.extend = n.fn.extend = function () {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = arguments[0] || {},
          h = 1,
          i = arguments.length,
          j = !1;for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == (typeof g === "undefined" ? "undefined" : _typeof(g)) || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) {
        if (null != (a = arguments[h])) for (b in a) {
          c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d));
        }
      }return g;
    }, n.extend({ expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""), isReady: !0, error: function error(a) {
        throw new Error(a);
      }, noop: function noop() {}, isFunction: function isFunction(a) {
        return "function" === n.type(a);
      }, isArray: Array.isArray, isWindow: function isWindow(a) {
        return null != a && a === a.window;
      }, isNumeric: function isNumeric(a) {
        return !n.isArray(a) && a - parseFloat(a) + 1 >= 0;
      }, isPlainObject: function isPlainObject(a) {
        return "object" !== n.type(a) || a.nodeType || n.isWindow(a) ? !1 : a.constructor && !j.call(a.constructor.prototype, "isPrototypeOf") ? !1 : !0;
      }, isEmptyObject: function isEmptyObject(a) {
        var b;for (b in a) {
          return !1;
        }return !0;
      }, type: function type(a) {
        return null == a ? a + "" : "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) || "function" == typeof a ? h[i.call(a)] || "object" : typeof a === "undefined" ? "undefined" : _typeof(a);
      }, globalEval: function globalEval(a) {
        var b,
            c = eval;a = n.trim(a), a && (1 === a.indexOf("use strict") ? (b = l.createElement("script"), b.text = a, l.head.appendChild(b).parentNode.removeChild(b)) : c(a));
      }, camelCase: function camelCase(a) {
        return a.replace(p, "ms-").replace(q, r);
      }, nodeName: function nodeName(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
      }, each: function each(a, b, c) {
        var d,
            e = 0,
            f = a.length,
            g = s(a);if (c) {
          if (g) {
            for (; f > e; e++) {
              if (d = b.apply(a[e], c), d === !1) break;
            }
          } else for (e in a) {
            if (d = b.apply(a[e], c), d === !1) break;
          }
        } else if (g) {
          for (; f > e; e++) {
            if (d = b.call(a[e], e, a[e]), d === !1) break;
          }
        } else for (e in a) {
          if (d = b.call(a[e], e, a[e]), d === !1) break;
        }return a;
      }, trim: function trim(a) {
        return null == a ? "" : (a + "").replace(o, "");
      }, makeArray: function makeArray(a, b) {
        var c = b || [];return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c;
      }, inArray: function inArray(a, b, c) {
        return null == b ? -1 : g.call(b, a, c);
      }, merge: function merge(a, b) {
        for (var c = +b.length, d = 0, e = a.length; c > d; d++) {
          a[e++] = b[d];
        }return a.length = e, a;
      }, grep: function grep(a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) {
          d = !b(a[f], f), d !== h && e.push(a[f]);
        }return e;
      }, map: function map(a, b, c) {
        var d,
            f = 0,
            g = a.length,
            h = s(a),
            i = [];if (h) for (; g > f; f++) {
          d = b(a[f], f, c), null != d && i.push(d);
        } else for (f in a) {
          d = b(a[f], f, c), null != d && i.push(d);
        }return e.apply([], i);
      }, guid: 1, proxy: function proxy(a, b) {
        var c, e, f;return "string" == typeof b && (c = a[b], b = a, a = c), n.isFunction(a) ? (e = d.call(arguments, 2), f = function f() {
          return a.apply(b || this, e.concat(d.call(arguments)));
        }, f.guid = a.guid = a.guid || n.guid++, f) : void 0;
      }, now: Date.now, support: k }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
      h["[object " + b + "]"] = b.toLowerCase();
    });function s(a) {
      var b = a.length,
          c = n.type(a);return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a;
    }var t = function (a) {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u = "sizzle" + 1 * new Date(),
          v = a.document,
          w = 0,
          x = 0,
          y = hb(),
          z = hb(),
          A = hb(),
          B = function B(a, b) {
        return a === b && (l = !0), 0;
      },
          C = 1 << 31,
          D = {}.hasOwnProperty,
          E = [],
          F = E.pop,
          G = E.push,
          H = E.push,
          I = E.slice,
          J = function J(a, b) {
        for (var c = 0, d = a.length; d > c; c++) {
          if (a[c] === b) return c;
        }return -1;
      },
          K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
          L = "[\\x20\\t\\r\\n\\f]",
          M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
          N = M.replace("w", "w#"),
          O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]",
          P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)",
          Q = new RegExp(L + "+", "g"),
          R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g"),
          S = new RegExp("^" + L + "*," + L + "*"),
          T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"),
          U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"),
          V = new RegExp(P),
          W = new RegExp("^" + N + "$"),
          X = { ID: new RegExp("^#(" + M + ")"), CLASS: new RegExp("^\\.(" + M + ")"), TAG: new RegExp("^(" + M.replace("w", "w*") + ")"), ATTR: new RegExp("^" + O), PSEUDO: new RegExp("^" + P), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"), bool: new RegExp("^(?:" + K + ")$", "i"), needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i") },
          Y = /^(?:input|select|textarea|button)$/i,
          Z = /^h\d$/i,
          $ = /^[^{]+\{\s*\[native \w/,
          _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
          ab = /[+~]/,
          bb = /'|\\/g,
          cb = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)", "ig"),
          db = function db(a, b, c) {
        var d = "0x" + b - 65536;return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
      },
          eb = function eb() {
        m();
      };try {
        H.apply(E = I.call(v.childNodes), v.childNodes), E[v.childNodes.length].nodeType;
      } catch (fb) {
        H = { apply: E.length ? function (a, b) {
            G.apply(a, I.call(b));
          } : function (a, b) {
            var c = a.length,
                d = 0;while (a[c++] = b[d++]) {}a.length = c - 1;
          } };
      }function gb(a, b, d, e) {
        var f, h, j, k, l, o, r, s, w, x;if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], k = b.nodeType, "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k) return d;if (!e && p) {
          if (11 !== k && (f = _.exec(a))) if (j = f[1]) {
            if (9 === k) {
              if (h = b.getElementById(j), !h || !h.parentNode) return d;if (h.id === j) return d.push(h), d;
            } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) return d.push(h), d;
          } else {
            if (f[2]) return H.apply(d, b.getElementsByTagName(a)), d;if ((j = f[3]) && c.getElementsByClassName) return H.apply(d, b.getElementsByClassName(j)), d;
          }if (c.qsa && (!q || !q.test(a))) {
            if (s = r = u, w = b, x = 1 !== k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
              o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;while (l--) {
                o[l] = s + rb(o[l]);
              }w = ab.test(a) && pb(b.parentNode) || b, x = o.join(",");
            }if (x) try {
              return H.apply(d, w.querySelectorAll(x)), d;
            } catch (y) {} finally {
              r || b.removeAttribute("id");
            }
          }
        }return i(a.replace(R, "$1"), b, d, e);
      }function hb() {
        var a = [];function b(c, e) {
          return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e;
        }return b;
      }function ib(a) {
        return a[u] = !0, a;
      }function jb(a) {
        var b = n.createElement("div");try {
          return !!a(b);
        } catch (c) {
          return !1;
        } finally {
          b.parentNode && b.parentNode.removeChild(b), b = null;
        }
      }function kb(a, b) {
        var c = a.split("|"),
            e = a.length;while (e--) {
          d.attrHandle[c[e]] = b;
        }
      }function lb(a, b) {
        var c = b && a,
            d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);if (d) return d;if (c) while (c = c.nextSibling) {
          if (c === b) return -1;
        }return a ? 1 : -1;
      }function mb(a) {
        return function (b) {
          var c = b.nodeName.toLowerCase();return "input" === c && b.type === a;
        };
      }function nb(a) {
        return function (b) {
          var c = b.nodeName.toLowerCase();return ("input" === c || "button" === c) && b.type === a;
        };
      }function ob(a) {
        return ib(function (b) {
          return b = +b, ib(function (c, d) {
            var e,
                f = a([], c.length, b),
                g = f.length;while (g--) {
              c[e = f[g]] && (c[e] = !(d[e] = c[e]));
            }
          });
        });
      }function pb(a) {
        return a && "undefined" != typeof a.getElementsByTagName && a;
      }c = gb.support = {}, f = gb.isXML = function (a) {
        var b = a && (a.ownerDocument || a).documentElement;return b ? "HTML" !== b.nodeName : !1;
      }, m = gb.setDocument = function (a) {
        var b,
            e,
            g = a ? a.ownerDocument || a : v;return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = g.documentElement, e = g.defaultView, e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", eb, !1) : e.attachEvent && e.attachEvent("onunload", eb)), p = !f(g), c.attributes = jb(function (a) {
          return a.className = "i", !a.getAttribute("className");
        }), c.getElementsByTagName = jb(function (a) {
          return a.appendChild(g.createComment("")), !a.getElementsByTagName("*").length;
        }), c.getElementsByClassName = $.test(g.getElementsByClassName), c.getById = jb(function (a) {
          return o.appendChild(a).id = u, !g.getElementsByName || !g.getElementsByName(u).length;
        }), c.getById ? (d.find.ID = function (a, b) {
          if ("undefined" != typeof b.getElementById && p) {
            var c = b.getElementById(a);return c && c.parentNode ? [c] : [];
          }
        }, d.filter.ID = function (a) {
          var b = a.replace(cb, db);return function (a) {
            return a.getAttribute("id") === b;
          };
        }) : (delete d.find.ID, d.filter.ID = function (a) {
          var b = a.replace(cb, db);return function (a) {
            var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");return c && c.value === b;
          };
        }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
          return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0;
        } : function (a, b) {
          var c,
              d = [],
              e = 0,
              f = b.getElementsByTagName(a);if ("*" === a) {
            while (c = f[e++]) {
              1 === c.nodeType && d.push(c);
            }return d;
          }return f;
        }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
          return p ? b.getElementsByClassName(a) : void 0;
        }, r = [], q = [], (c.qsa = $.test(g.querySelectorAll)) && (jb(function (a) {
          o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]");
        }), jb(function (a) {
          var b = g.createElement("input");b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:");
        })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && jb(function (a) {
          c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", P);
        }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) {
          var c = 9 === a.nodeType ? a.documentElement : a,
              d = b && b.parentNode;return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
        } : function (a, b) {
          if (b) while (b = b.parentNode) {
            if (b === a) return !0;
          }return !1;
        }, B = b ? function (a, b) {
          if (a === b) return l = !0, 0;var d = !a.compareDocumentPosition - !b.compareDocumentPosition;return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1);
        } : function (a, b) {
          if (a === b) return l = !0, 0;var c,
              d = 0,
              e = a.parentNode,
              f = b.parentNode,
              h = [a],
              i = [b];if (!e || !f) return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;if (e === f) return lb(a, b);c = a;while (c = c.parentNode) {
            h.unshift(c);
          }c = b;while (c = c.parentNode) {
            i.unshift(c);
          }while (h[d] === i[d]) {
            d++;
          }return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0;
        }, g) : n;
      }, gb.matches = function (a, b) {
        return gb(a, null, null, b);
      }, gb.matchesSelector = function (a, b) {
        if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) try {
          var d = s.call(a, b);if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
        } catch (e) {}return gb(b, n, null, [a]).length > 0;
      }, gb.contains = function (a, b) {
        return (a.ownerDocument || a) !== n && m(a), t(a, b);
      }, gb.attr = function (a, b) {
        (a.ownerDocument || a) !== n && m(a);var e = d.attrHandle[b.toLowerCase()],
            f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
      }, gb.error = function (a) {
        throw new Error("Syntax error, unrecognized expression: " + a);
      }, gb.uniqueSort = function (a) {
        var b,
            d = [],
            e = 0,
            f = 0;if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
          while (b = a[f++]) {
            b === a[f] && (e = d.push(f));
          }while (e--) {
            a.splice(d[e], 1);
          }
        }return k = null, a;
      }, e = gb.getText = function (a) {
        var b,
            c = "",
            d = 0,
            f = a.nodeType;if (f) {
          if (1 === f || 9 === f || 11 === f) {
            if ("string" == typeof a.textContent) return a.textContent;for (a = a.firstChild; a; a = a.nextSibling) {
              c += e(a);
            }
          } else if (3 === f || 4 === f) return a.nodeValue;
        } else while (b = a[d++]) {
          c += e(b);
        }return c;
      }, d = gb.selectors = { cacheLength: 50, createPseudo: ib, match: X, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function ATTR(a) {
            return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
          }, CHILD: function CHILD(a) {
            return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || gb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && gb.error(a[0]), a;
          }, PSEUDO: function PSEUDO(a) {
            var b,
                c = !a[6] && a[2];return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3));
          } }, filter: { TAG: function TAG(a) {
            var b = a.replace(cb, db).toLowerCase();return "*" === a ? function () {
              return !0;
            } : function (a) {
              return a.nodeName && a.nodeName.toLowerCase() === b;
            };
          }, CLASS: function CLASS(a) {
            var b = y[a + " "];return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function (a) {
              return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "");
            });
          }, ATTR: function ATTR(a, b, c) {
            return function (d) {
              var e = gb.attr(d, a);return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0;
            };
          }, CHILD: function CHILD(a, b, c, d, e) {
            var f = "nth" !== a.slice(0, 3),
                g = "last" !== a.slice(-4),
                h = "of-type" === b;return 1 === d && 0 === e ? function (a) {
              return !!a.parentNode;
            } : function (b, c, i) {
              var j,
                  k,
                  l,
                  m,
                  n,
                  o,
                  p = f !== g ? "nextSibling" : "previousSibling",
                  q = b.parentNode,
                  r = h && b.nodeName.toLowerCase(),
                  s = !i && !h;if (q) {
                if (f) {
                  while (p) {
                    l = b;while (l = l[p]) {
                      if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                    }o = p = "only" === a && !o && "nextSibling";
                  }return !0;
                }if (o = [g ? q.firstChild : q.lastChild], g && s) {
                  k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                    if (1 === l.nodeType && ++m && l === b) {
                      k[a] = [w, n, m];break;
                    }
                  }
                } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1];else while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                  if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) break;
                }return m -= e, m === d || m % d === 0 && m / d >= 0;
              }
            };
          }, PSEUDO: function PSEUDO(a, b) {
            var c,
                e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || gb.error("unsupported pseudo: " + a);return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ib(function (a, c) {
              var d,
                  f = e(a, b),
                  g = f.length;while (g--) {
                d = J(a, f[g]), a[d] = !(c[d] = f[g]);
              }
            }) : function (a) {
              return e(a, 0, c);
            }) : e;
          } }, pseudos: { not: ib(function (a) {
            var b = [],
                c = [],
                d = h(a.replace(R, "$1"));return d[u] ? ib(function (a, b, c, e) {
              var f,
                  g = d(a, null, e, []),
                  h = a.length;while (h--) {
                (f = g[h]) && (a[h] = !(b[h] = f));
              }
            }) : function (a, e, f) {
              return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop();
            };
          }), has: ib(function (a) {
            return function (b) {
              return gb(a, b).length > 0;
            };
          }), contains: ib(function (a) {
            return a = a.replace(cb, db), function (b) {
              return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
            };
          }), lang: ib(function (a) {
            return W.test(a || "") || gb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(), function (b) {
              var c;do {
                if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
              } while ((b = b.parentNode) && 1 === b.nodeType);return !1;
            };
          }), target: function target(b) {
            var c = a.location && a.location.hash;return c && c.slice(1) === b.id;
          }, root: function root(a) {
            return a === o;
          }, focus: function focus(a) {
            return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
          }, enabled: function enabled(a) {
            return a.disabled === !1;
          }, disabled: function disabled(a) {
            return a.disabled === !0;
          }, checked: function checked(a) {
            var b = a.nodeName.toLowerCase();return "input" === b && !!a.checked || "option" === b && !!a.selected;
          }, selected: function selected(a) {
            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
          }, empty: function empty(a) {
            for (a = a.firstChild; a; a = a.nextSibling) {
              if (a.nodeType < 6) return !1;
            }return !0;
          }, parent: function parent(a) {
            return !d.pseudos.empty(a);
          }, header: function header(a) {
            return Z.test(a.nodeName);
          }, input: function input(a) {
            return Y.test(a.nodeName);
          }, button: function button(a) {
            var b = a.nodeName.toLowerCase();return "input" === b && "button" === a.type || "button" === b;
          }, text: function text(a) {
            var b;return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
          }, first: ob(function () {
            return [0];
          }), last: ob(function (a, b) {
            return [b - 1];
          }), eq: ob(function (a, b, c) {
            return [0 > c ? c + b : c];
          }), even: ob(function (a, b) {
            for (var c = 0; b > c; c += 2) {
              a.push(c);
            }return a;
          }), odd: ob(function (a, b) {
            for (var c = 1; b > c; c += 2) {
              a.push(c);
            }return a;
          }), lt: ob(function (a, b, c) {
            for (var d = 0 > c ? c + b : c; --d >= 0;) {
              a.push(d);
            }return a;
          }), gt: ob(function (a, b, c) {
            for (var d = 0 > c ? c + b : c; ++d < b;) {
              a.push(d);
            }return a;
          }) } }, d.pseudos.nth = d.pseudos.eq;for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) {
        d.pseudos[b] = mb(b);
      }for (b in { submit: !0, reset: !0 }) {
        d.pseudos[b] = nb(b);
      }function qb() {}qb.prototype = d.filters = d.pseudos, d.setFilters = new qb(), g = gb.tokenize = function (a, b) {
        var c,
            e,
            f,
            g,
            h,
            i,
            j,
            k = z[a + " "];if (k) return b ? 0 : k.slice(0);h = a, i = [], j = d.preFilter;while (h) {
          (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({ value: c, type: e[0].replace(R, " ") }), h = h.slice(c.length));for (g in d.filter) {
            !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({ value: c, type: g, matches: e }), h = h.slice(c.length));
          }if (!c) break;
        }return b ? h.length : h ? gb.error(a) : z(a, i).slice(0);
      };function rb(a) {
        for (var b = 0, c = a.length, d = ""; c > b; b++) {
          d += a[b].value;
        }return d;
      }function sb(a, b, c) {
        var d = b.dir,
            e = c && "parentNode" === d,
            f = x++;return b.first ? function (b, c, f) {
          while (b = b[d]) {
            if (1 === b.nodeType || e) return a(b, c, f);
          }
        } : function (b, c, g) {
          var h,
              i,
              j = [w, f];if (g) {
            while (b = b[d]) {
              if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
            }
          } else while (b = b[d]) {
            if (1 === b.nodeType || e) {
              if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) return j[2] = h[2];if (i[d] = j, j[2] = a(b, c, g)) return !0;
            }
          }
        };
      }function tb(a) {
        return a.length > 1 ? function (b, c, d) {
          var e = a.length;while (e--) {
            if (!a[e](b, c, d)) return !1;
          }return !0;
        } : a[0];
      }function ub(a, b, c) {
        for (var d = 0, e = b.length; e > d; d++) {
          gb(a, b[d], c);
        }return c;
      }function vb(a, b, c, d, e) {
        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) {
          (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
        }return g;
      }function wb(a, b, c, d, e, f) {
        return d && !d[u] && (d = wb(d)), e && !e[u] && (e = wb(e, f)), ib(function (f, g, h, i) {
          var j,
              k,
              l,
              m = [],
              n = [],
              o = g.length,
              p = f || ub(b || "*", h.nodeType ? [h] : h, []),
              q = !a || !f && b ? p : vb(p, m, a, h, i),
              r = c ? e || (f ? a : o || d) ? [] : g : q;if (c && c(q, r, h, i), d) {
            j = vb(r, n), d(j, [], h, i), k = j.length;while (k--) {
              (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
            }
          }if (f) {
            if (e || a) {
              if (e) {
                j = [], k = r.length;while (k--) {
                  (l = r[k]) && j.push(q[k] = l);
                }e(null, r = [], j, i);
              }k = r.length;while (k--) {
                (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
              }
            }
          } else r = vb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : H.apply(g, r);
        });
      }function xb(a) {
        for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sb(function (a) {
          return a === b;
        }, h, !0), l = sb(function (a) {
          return J(b, a) > -1;
        }, h, !0), m = [function (a, c, d) {
          var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));return b = null, e;
        }]; f > i; i++) {
          if (c = d.relative[a[i].type]) m = [sb(tb(m), c)];else {
            if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
              for (e = ++i; f > e; e++) {
                if (d.relative[a[e].type]) break;
              }return wb(i > 1 && tb(m), i > 1 && rb(a.slice(0, i - 1).concat({ value: " " === a[i - 2].type ? "*" : "" })).replace(R, "$1"), c, e > i && xb(a.slice(i, e)), f > e && xb(a = a.slice(e)), f > e && rb(a));
            }m.push(c);
          }
        }return tb(m);
      }function yb(a, b) {
        var c = b.length > 0,
            e = a.length > 0,
            f = function f(_f, g, h, i, k) {
          var l,
              m,
              o,
              p = 0,
              q = "0",
              r = _f && [],
              s = [],
              t = j,
              u = _f || e && d.find.TAG("*", k),
              v = w += null == t ? 1 : Math.random() || .1,
              x = u.length;for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
            if (e && l) {
              m = 0;while (o = a[m++]) {
                if (o(l, g, h)) {
                  i.push(l);break;
                }
              }k && (w = v);
            }c && ((l = !o && l) && p--, _f && r.push(l));
          }if (p += q, c && q !== p) {
            m = 0;while (o = b[m++]) {
              o(r, s, g, h);
            }if (_f) {
              if (p > 0) while (q--) {
                r[q] || s[q] || (s[q] = F.call(i));
              }s = vb(s);
            }H.apply(i, s), k && !_f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i);
          }return k && (w = v, j = t), r;
        };return c ? ib(f) : f;
      }return h = gb.compile = function (a, b) {
        var c,
            d = [],
            e = [],
            f = A[a + " "];if (!f) {
          b || (b = g(a)), c = b.length;while (c--) {
            f = xb(b[c]), f[u] ? d.push(f) : e.push(f);
          }f = A(a, yb(e, d)), f.selector = a;
        }return f;
      }, i = gb.select = function (a, b, e, f) {
        var i,
            j,
            k,
            l,
            m,
            n = "function" == typeof a && a,
            o = !f && g(a = n.selector || a);if (e = e || [], 1 === o.length) {
          if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
            if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) return e;n && (b = b.parentNode), a = a.slice(j.shift().value.length);
          }i = X.needsContext.test(a) ? 0 : j.length;while (i--) {
            if (k = j[i], d.relative[l = k.type]) break;if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && pb(b.parentNode) || b))) {
              if (j.splice(i, 1), a = f.length && rb(j), !a) return H.apply(e, f), e;break;
            }
          }
        }return (n || h(a, o))(f, b, !p, e, ab.test(a) && pb(b.parentNode) || b), e;
      }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = jb(function (a) {
        return 1 & a.compareDocumentPosition(n.createElement("div"));
      }), jb(function (a) {
        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
      }) || kb("type|href|height|width", function (a, b, c) {
        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
      }), c.attributes && jb(function (a) {
        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
      }) || kb("value", function (a, b, c) {
        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
      }), jb(function (a) {
        return null == a.getAttribute("disabled");
      }) || kb(K, function (a, b, c) {
        var d;return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
      }), gb;
    }(a);n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;var u = n.expr.match.needsContext,
        v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        w = /^.[^:#\[\.,]*$/;function x(a, b, c) {
      if (n.isFunction(b)) return n.grep(a, function (a, d) {
        return !!b.call(a, d, a) !== c;
      });if (b.nodeType) return n.grep(a, function (a) {
        return a === b !== c;
      });if ("string" == typeof b) {
        if (w.test(b)) return n.filter(b, a, c);b = n.filter(b, a);
      }return n.grep(a, function (a) {
        return g.call(b, a) >= 0 !== c;
      });
    }n.filter = function (a, b, c) {
      var d = b[0];return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) {
        return 1 === a.nodeType;
      }));
    }, n.fn.extend({ find: function find(a) {
        var b,
            c = this.length,
            d = [],
            e = this;if ("string" != typeof a) return this.pushStack(n(a).filter(function () {
          for (b = 0; c > b; b++) {
            if (n.contains(e[b], this)) return !0;
          }
        }));for (b = 0; c > b; b++) {
          n.find(a, e[b], d);
        }return d = this.pushStack(c > 1 ? n.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d;
      }, filter: function filter(a) {
        return this.pushStack(x(this, a || [], !1));
      }, not: function not(a) {
        return this.pushStack(x(this, a || [], !0));
      }, is: function is(a) {
        return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length;
      } });var y,
        z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        A = n.fn.init = function (a, b) {
      var c, d;if (!a) return this;if ("string" == typeof a) {
        if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);if (c[1]) {
          if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : l, !0)), v.test(c[1]) && n.isPlainObject(b)) for (c in b) {
            n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
          }return this;
        }return d = l.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = l, this.selector = a, this;
      }return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this));
    };A.prototype = n.fn, y = n(l);var B = /^(?:parents|prev(?:Until|All))/,
        C = { children: !0, contents: !0, next: !0, prev: !0 };n.extend({ dir: function dir(a, b, c) {
        var d = [],
            e = void 0 !== c;while ((a = a[b]) && 9 !== a.nodeType) {
          if (1 === a.nodeType) {
            if (e && n(a).is(c)) break;d.push(a);
          }
        }return d;
      }, sibling: function sibling(a, b) {
        for (var c = []; a; a = a.nextSibling) {
          1 === a.nodeType && a !== b && c.push(a);
        }return c;
      } }), n.fn.extend({ has: function has(a) {
        var b = n(a, this),
            c = b.length;return this.filter(function () {
          for (var a = 0; c > a; a++) {
            if (n.contains(this, b[a])) return !0;
          }
        });
      }, closest: function closest(a, b) {
        for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++) {
          for (c = this[d]; c && c !== b; c = c.parentNode) {
            if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
              f.push(c);break;
            }
          }
        }return this.pushStack(f.length > 1 ? n.unique(f) : f);
      }, index: function index(a) {
        return a ? "string" == typeof a ? g.call(n(a), this[0]) : g.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      }, add: function add(a, b) {
        return this.pushStack(n.unique(n.merge(this.get(), n(a, b))));
      }, addBack: function addBack(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
      } });function D(a, b) {
      while ((a = a[b]) && 1 !== a.nodeType) {}return a;
    }n.each({ parent: function parent(a) {
        var b = a.parentNode;return b && 11 !== b.nodeType ? b : null;
      }, parents: function parents(a) {
        return n.dir(a, "parentNode");
      }, parentsUntil: function parentsUntil(a, b, c) {
        return n.dir(a, "parentNode", c);
      }, next: function next(a) {
        return D(a, "nextSibling");
      }, prev: function prev(a) {
        return D(a, "previousSibling");
      }, nextAll: function nextAll(a) {
        return n.dir(a, "nextSibling");
      }, prevAll: function prevAll(a) {
        return n.dir(a, "previousSibling");
      }, nextUntil: function nextUntil(a, b, c) {
        return n.dir(a, "nextSibling", c);
      }, prevUntil: function prevUntil(a, b, c) {
        return n.dir(a, "previousSibling", c);
      }, siblings: function siblings(a) {
        return n.sibling((a.parentNode || {}).firstChild, a);
      }, children: function children(a) {
        return n.sibling(a.firstChild);
      }, contents: function contents(a) {
        return a.contentDocument || n.merge([], a.childNodes);
      } }, function (a, b) {
      n.fn[a] = function (c, d) {
        var e = n.map(this, b, c);return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (C[a] || n.unique(e), B.test(a) && e.reverse()), this.pushStack(e);
      };
    });var E = /\S+/g,
        F = {};function G(a) {
      var b = F[a] = {};return n.each(a.match(E) || [], function (a, c) {
        b[c] = !0;
      }), b;
    }n.Callbacks = function (a) {
      a = "string" == typeof a ? F[a] || G(a) : n.extend({}, a);var b,
          c,
          d,
          e,
          f,
          g,
          h = [],
          i = !a.once && [],
          j = function j(l) {
        for (b = a.memory && l, c = !0, g = e || 0, e = 0, f = h.length, d = !0; h && f > g; g++) {
          if (h[g].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
            b = !1;break;
          }
        }d = !1, h && (i ? i.length && j(i.shift()) : b ? h = [] : k.disable());
      },
          k = { add: function add() {
          if (h) {
            var c = h.length;!function g(b) {
              n.each(b, function (b, c) {
                var d = n.type(c);"function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && g(c);
              });
            }(arguments), d ? f = h.length : b && (e = c, j(b));
          }return this;
        }, remove: function remove() {
          return h && n.each(arguments, function (a, b) {
            var c;while ((c = n.inArray(b, h, c)) > -1) {
              h.splice(c, 1), d && (f >= c && f--, g >= c && g--);
            }
          }), this;
        }, has: function has(a) {
          return a ? n.inArray(a, h) > -1 : !(!h || !h.length);
        }, empty: function empty() {
          return h = [], f = 0, this;
        }, disable: function disable() {
          return h = i = b = void 0, this;
        }, disabled: function disabled() {
          return !h;
        }, lock: function lock() {
          return i = void 0, b || k.disable(), this;
        }, locked: function locked() {
          return !i;
        }, fireWith: function fireWith(a, b) {
          return !h || c && !i || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? i.push(b) : j(b)), this;
        }, fire: function fire() {
          return k.fireWith(this, arguments), this;
        }, fired: function fired() {
          return !!c;
        } };return k;
    }, n.extend({ Deferred: function Deferred(a) {
        var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]],
            c = "pending",
            d = { state: function state() {
            return c;
          }, always: function always() {
            return e.done(arguments).fail(arguments), this;
          }, then: function then() {
            var a = arguments;return n.Deferred(function (c) {
              n.each(b, function (b, f) {
                var g = n.isFunction(a[b]) && a[b];e[f[1]](function () {
                  var a = g && g.apply(this, arguments);a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments);
                });
              }), a = null;
            }).promise();
          }, promise: function promise(a) {
            return null != a ? n.extend(a, d) : d;
          } },
            e = {};return d.pipe = d.then, n.each(b, function (a, f) {
          var g = f[2],
              h = f[3];d[f[1]] = g.add, h && g.add(function () {
            c = h;
          }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
            return e[f[0] + "With"](this === e ? d : this, arguments), this;
          }, e[f[0] + "With"] = g.fireWith;
        }), d.promise(e), a && a.call(e, e), e;
      }, when: function when(a) {
        var b = 0,
            c = d.call(arguments),
            e = c.length,
            f = 1 !== e || a && n.isFunction(a.promise) ? e : 0,
            g = 1 === f ? a : n.Deferred(),
            h = function h(a, b, c) {
          return function (e) {
            b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c);
          };
        },
            i,
            j,
            k;if (e > 1) for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) {
          c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
        }return f || g.resolveWith(k, c), g.promise();
      } });var H;n.fn.ready = function (a) {
      return n.ready.promise().done(a), this;
    }, n.extend({ isReady: !1, readyWait: 1, holdReady: function holdReady(a) {
        a ? n.readyWait++ : n.ready(!0);
      }, ready: function ready(a) {
        (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, a !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready"))));
      } });function I() {
      l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready();
    }n.ready.promise = function (b) {
      return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(b);
    }, n.ready.promise();var J = n.access = function (a, b, c, d, e, f, g) {
      var h = 0,
          i = a.length,
          j = null == c;if ("object" === n.type(c)) {
        e = !0;for (h in c) {
          n.access(a, b, h, c[h], !0, f, g);
        }
      } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function b(a, _b2, c) {
        return j.call(n(a), c);
      })), b)) for (; i > h; h++) {
        b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
      }return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    };n.acceptData = function (a) {
      return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType;
    };function K() {
      Object.defineProperty(this.cache = {}, 0, { get: function get() {
          return {};
        } }), this.expando = n.expando + K.uid++;
    }K.uid = 1, K.accepts = n.acceptData, K.prototype = { key: function key(a) {
        if (!K.accepts(a)) return 0;var b = {},
            c = a[this.expando];if (!c) {
          c = K.uid++;try {
            b[this.expando] = { value: c }, Object.defineProperties(a, b);
          } catch (d) {
            b[this.expando] = c, n.extend(a, b);
          }
        }return this.cache[c] || (this.cache[c] = {}), c;
      }, set: function set(a, b, c) {
        var d,
            e = this.key(a),
            f = this.cache[e];if ("string" == typeof b) f[b] = c;else if (n.isEmptyObject(f)) n.extend(this.cache[e], b);else for (d in b) {
          f[d] = b[d];
        }return f;
      }, get: function get(a, b) {
        var c = this.cache[this.key(a)];return void 0 === b ? c : c[b];
      }, access: function access(a, b, c) {
        var d;return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, n.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b);
      }, remove: function remove(a, b) {
        var c,
            d,
            e,
            f = this.key(a),
            g = this.cache[f];if (void 0 === b) this.cache[f] = {};else {
          n.isArray(b) ? d = b.concat(b.map(n.camelCase)) : (e = n.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(E) || [])), c = d.length;while (c--) {
            delete g[d[c]];
          }
        }
      }, hasData: function hasData(a) {
        return !n.isEmptyObject(this.cache[a[this.expando]] || {});
      }, discard: function discard(a) {
        a[this.expando] && delete this.cache[a[this.expando]];
      } };var L = new K(),
        M = new K(),
        N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        O = /([A-Z])/g;function P(a, b, c) {
      var d;if (void 0 === c && 1 === a.nodeType) if (d = "data-" + b.replace(O, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
        try {
          c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c;
        } catch (e) {}M.set(a, b, c);
      } else c = void 0;return c;
    }n.extend({ hasData: function hasData(a) {
        return M.hasData(a) || L.hasData(a);
      }, data: function data(a, b, c) {
        return M.access(a, b, c);
      }, removeData: function removeData(a, b) {
        M.remove(a, b);
      }, _data: function _data(a, b, c) {
        return L.access(a, b, c);
      }, _removeData: function _removeData(a, b) {
        L.remove(a, b);
      } }), n.fn.extend({ data: function data(a, b) {
        var c,
            d,
            e,
            f = this[0],
            g = f && f.attributes;if (void 0 === a) {
          if (this.length && (e = M.get(f), 1 === f.nodeType && !L.get(f, "hasDataAttrs"))) {
            c = g.length;while (c--) {
              g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d])));
            }L.set(f, "hasDataAttrs", !0);
          }return e;
        }return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? this.each(function () {
          M.set(this, a);
        }) : J(this, function (b) {
          var c,
              d = n.camelCase(a);if (f && void 0 === b) {
            if (c = M.get(f, a), void 0 !== c) return c;if (c = M.get(f, d), void 0 !== c) return c;if (c = P(f, d, void 0), void 0 !== c) return c;
          } else this.each(function () {
            var c = M.get(this, d);M.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && M.set(this, a, b);
          });
        }, null, b, arguments.length > 1, null, !0);
      }, removeData: function removeData(a) {
        return this.each(function () {
          M.remove(this, a);
        });
      } }), n.extend({ queue: function queue(a, b, c) {
        var d;return a ? (b = (b || "fx") + "queue", d = L.get(a, b), c && (!d || n.isArray(c) ? d = L.access(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0;
      }, dequeue: function dequeue(a, b) {
        b = b || "fx";var c = n.queue(a, b),
            d = c.length,
            e = c.shift(),
            f = n._queueHooks(a, b),
            g = function g() {
          n.dequeue(a, b);
        };"inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
      }, _queueHooks: function _queueHooks(a, b) {
        var c = b + "queueHooks";return L.get(a, c) || L.access(a, c, { empty: n.Callbacks("once memory").add(function () {
            L.remove(a, [b + "queue", c]);
          }) });
      } }), n.fn.extend({ queue: function queue(a, b) {
        var c = 2;return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () {
          var c = n.queue(this, a, b);n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a);
        });
      }, dequeue: function dequeue(a) {
        return this.each(function () {
          n.dequeue(this, a);
        });
      }, clearQueue: function clearQueue(a) {
        return this.queue(a || "fx", []);
      }, promise: function promise(a, b) {
        var c,
            d = 1,
            e = n.Deferred(),
            f = this,
            g = this.length,
            h = function h() {
          --d || e.resolveWith(f, [f]);
        };"string" != typeof a && (b = a, a = void 0), a = a || "fx";while (g--) {
          c = L.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
        }return h(), e.promise(b);
      } });var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        R = ["Top", "Right", "Bottom", "Left"],
        S = function S(a, b) {
      return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a);
    },
        T = /^(?:checkbox|radio)$/i;!function () {
      var a = l.createDocumentFragment(),
          b = a.appendChild(l.createElement("div")),
          c = l.createElement("input");c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue;
    }();var U = "undefined";k.focusinBubbles = "onfocusin" in a;var V = /^key/,
        W = /^(?:mouse|pointer|contextmenu)|click/,
        X = /^(?:focusinfocus|focusoutblur)$/,
        Y = /^([^.]*)(?:\.(.+)|)$/;function Z() {
      return !0;
    }function $() {
      return !1;
    }function _() {
      try {
        return l.activeElement;
      } catch (a) {}
    }n.event = { global: {}, add: function add(a, b, c, d, e) {
        var f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            o,
            p,
            q,
            r = L.get(a);if (r) {
          c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = n.guid++), (i = r.events) || (i = r.events = {}), (g = r.handle) || (g = r.handle = function (b) {
            return (typeof n === "undefined" ? "undefined" : _typeof(n)) !== U && n.event.triggered !== b.type ? n.event.dispatch.apply(a, arguments) : void 0;
          }), b = (b || "").match(E) || [""], j = b.length;while (j--) {
            h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o && (l = n.event.special[o] || {}, o = (e ? l.delegateType : l.bindType) || o, l = n.event.special[o] || {}, k = n.extend({ type: o, origType: q, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && n.expr.match.needsContext.test(e), namespace: p.join(".") }, f), (m = i[o]) || (m = i[o] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, p, g) !== !1 || a.addEventListener && a.addEventListener(o, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), n.event.global[o] = !0);
          }
        }
      }, remove: function remove(a, b, c, d, e) {
        var f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            o,
            p,
            q,
            r = L.hasData(a) && L.get(a);if (r && (i = r.events)) {
          b = (b || "").match(E) || [""], j = b.length;while (j--) {
            if (h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
              l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = i[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;while (f--) {
                k = m[f], !e && q !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
              }g && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete i[o]);
            } else for (o in i) {
              n.event.remove(a, o + b[j], c, d, !0);
            }
          }n.isEmptyObject(i) && (delete r.handle, L.remove(a, "events"));
        }
      }, trigger: function trigger(b, c, d, e) {
        var f,
            g,
            h,
            i,
            k,
            m,
            o,
            p = [d || l],
            q = j.call(b, "type") ? b.type : b,
            r = j.call(b, "namespace") ? b.namespace.split(".") : [];if (g = h = d = d || l, 3 !== d.nodeType && 8 !== d.nodeType && !X.test(q + n.event.triggered) && (q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), k = q.indexOf(":") < 0 && "on" + q, b = b[n.expando] ? b : new n.Event(q, "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && b), b.isTrigger = e ? 2 : 3, b.namespace = r.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), o = n.event.special[q] || {}, e || !o.trigger || o.trigger.apply(d, c) !== !1)) {
          if (!e && !o.noBubble && !n.isWindow(d)) {
            for (i = o.delegateType || q, X.test(i + q) || (g = g.parentNode); g; g = g.parentNode) {
              p.push(g), h = g;
            }h === (d.ownerDocument || l) && p.push(h.defaultView || h.parentWindow || a);
          }f = 0;while ((g = p[f++]) && !b.isPropagationStopped()) {
            b.type = f > 1 ? i : o.bindType || q, m = (L.get(g, "events") || {})[b.type] && L.get(g, "handle"), m && m.apply(g, c), m = k && g[k], m && m.apply && n.acceptData(g) && (b.result = m.apply(g, c), b.result === !1 && b.preventDefault());
          }return b.type = q, e || b.isDefaultPrevented() || o._default && o._default.apply(p.pop(), c) !== !1 || !n.acceptData(d) || k && n.isFunction(d[q]) && !n.isWindow(d) && (h = d[k], h && (d[k] = null), n.event.triggered = q, d[q](), n.event.triggered = void 0, h && (d[k] = h)), b.result;
        }
      }, dispatch: function dispatch(a) {
        a = n.event.fix(a);var b,
            c,
            e,
            f,
            g,
            h = [],
            i = d.call(arguments),
            j = (L.get(this, "events") || {})[a.type] || [],
            k = n.event.special[a.type] || {};if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
          h = n.event.handlers.call(this, a, j), b = 0;while ((f = h[b++]) && !a.isPropagationStopped()) {
            a.currentTarget = f.elem, c = 0;while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped()) {
              (!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation()));
            }
          }return k.postDispatch && k.postDispatch.call(this, a), a.result;
        }
      }, handlers: function handlers(a, b) {
        var c,
            d,
            e,
            f,
            g = [],
            h = b.delegateCount,
            i = a.target;if (h && i.nodeType && (!a.button || "click" !== a.type)) for (; i !== this; i = i.parentNode || this) {
          if (i.disabled !== !0 || "click" !== a.type) {
            for (d = [], c = 0; h > c; c++) {
              f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) >= 0 : n.find(e, this, null, [i]).length), d[e] && d.push(f);
            }d.length && g.push({ elem: i, handlers: d });
          }
        }return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g;
      }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function filter(a, b) {
          return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a;
        } }, mouseHooks: { props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function filter(a, b) {
          var c,
              d,
              e,
              f = b.button;return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || l, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a;
        } }, fix: function fix(a) {
        if (a[n.expando]) return a;var b,
            c,
            d,
            e = a.type,
            f = a,
            g = this.fixHooks[e];g || (this.fixHooks[e] = g = W.test(e) ? this.mouseHooks : V.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length;while (b--) {
          c = d[b], a[c] = f[c];
        }return a.target || (a.target = l), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a;
      }, special: { load: { noBubble: !0 }, focus: { trigger: function trigger() {
            return this !== _() && this.focus ? (this.focus(), !1) : void 0;
          }, delegateType: "focusin" }, blur: { trigger: function trigger() {
            return this === _() && this.blur ? (this.blur(), !1) : void 0;
          }, delegateType: "focusout" }, click: { trigger: function trigger() {
            return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0;
          }, _default: function _default(a) {
            return n.nodeName(a.target, "a");
          } }, beforeunload: { postDispatch: function postDispatch(a) {
            void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
          } } }, simulate: function simulate(a, b, c, d) {
        var e = n.extend(new n.Event(), c, { type: a, isSimulated: !0, originalEvent: {} });d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
      } }, n.removeEvent = function (a, b, c) {
      a.removeEventListener && a.removeEventListener(b, c, !1);
    }, n.Event = function (a, b) {
      return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? Z : $) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void (this[n.expando] = !0)) : new n.Event(a, b);
    }, n.Event.prototype = { isDefaultPrevented: $, isPropagationStopped: $, isImmediatePropagationStopped: $, preventDefault: function preventDefault() {
        var a = this.originalEvent;this.isDefaultPrevented = Z, a && a.preventDefault && a.preventDefault();
      }, stopPropagation: function stopPropagation() {
        var a = this.originalEvent;this.isPropagationStopped = Z, a && a.stopPropagation && a.stopPropagation();
      }, stopImmediatePropagation: function stopImmediatePropagation() {
        var a = this.originalEvent;this.isImmediatePropagationStopped = Z, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation();
      } }, n.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function (a, b) {
      n.event.special[a] = { delegateType: b, bindType: b, handle: function handle(a) {
          var c,
              d = this,
              e = a.relatedTarget,
              f = a.handleObj;return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c;
        } };
    }), k.focusinBubbles || n.each({ focus: "focusin", blur: "focusout" }, function (a, b) {
      var c = function c(a) {
        n.event.simulate(b, a.target, n.event.fix(a), !0);
      };n.event.special[b] = { setup: function setup() {
          var d = this.ownerDocument || this,
              e = L.access(d, b);e || d.addEventListener(a, c, !0), L.access(d, b, (e || 0) + 1);
        }, teardown: function teardown() {
          var d = this.ownerDocument || this,
              e = L.access(d, b) - 1;e ? L.access(d, b, e) : (d.removeEventListener(a, c, !0), L.remove(d, b));
        } };
    }), n.fn.extend({ on: function on(a, b, c, d, e) {
        var f, g;if ("object" == (typeof a === "undefined" ? "undefined" : _typeof(a))) {
          "string" != typeof b && (c = c || b, b = void 0);for (g in a) {
            this.on(g, b, c, a[g], e);
          }return this;
        }if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = $;else if (!d) return this;return 1 === e && (f = d, d = function d(a) {
          return n().off(a), f.apply(this, arguments);
        }, d.guid = f.guid || (f.guid = n.guid++)), this.each(function () {
          n.event.add(this, a, d, c, b);
        });
      }, one: function one(a, b, c, d) {
        return this.on(a, b, c, d, 1);
      }, off: function off(a, b, c) {
        var d, e;if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;if ("object" == (typeof a === "undefined" ? "undefined" : _typeof(a))) {
          for (e in a) {
            this.off(e, b, a[e]);
          }return this;
        }return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = $), this.each(function () {
          n.event.remove(this, a, c, b);
        });
      }, trigger: function trigger(a, b) {
        return this.each(function () {
          n.event.trigger(a, b, this);
        });
      }, triggerHandler: function triggerHandler(a, b) {
        var c = this[0];return c ? n.event.trigger(a, b, c, !0) : void 0;
      } });var ab = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        bb = /<([\w:]+)/,
        cb = /<|&#?\w+;/,
        db = /<(?:script|style|link)/i,
        eb = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fb = /^$|\/(?:java|ecma)script/i,
        gb = /^true\/(.*)/,
        hb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        ib = { option: [1, "<select multiple='multiple'>", "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] };ib.optgroup = ib.option, ib.tbody = ib.tfoot = ib.colgroup = ib.caption = ib.thead, ib.th = ib.td;function jb(a, b) {
      return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
    }function kb(a) {
      return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a;
    }function lb(a) {
      var b = gb.exec(a.type);return b ? a.type = b[1] : a.removeAttribute("type"), a;
    }function mb(a, b) {
      for (var c = 0, d = a.length; d > c; c++) {
        L.set(a[c], "globalEval", !b || L.get(b[c], "globalEval"));
      }
    }function nb(a, b) {
      var c, d, e, f, g, h, i, j;if (1 === b.nodeType) {
        if (L.hasData(a) && (f = L.access(a), g = L.set(b, f), j = f.events)) {
          delete g.handle, g.events = {};for (e in j) {
            for (c = 0, d = j[e].length; d > c; c++) {
              n.event.add(b, e, j[e][c]);
            }
          }
        }M.hasData(a) && (h = M.access(a), i = n.extend({}, h), M.set(b, i));
      }
    }function ob(a, b) {
      var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : [];return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], c) : c;
    }function pb(a, b) {
      var c = b.nodeName.toLowerCase();"input" === c && T.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue);
    }n.extend({ clone: function clone(a, b, c) {
        var d,
            e,
            f,
            g,
            h = a.cloneNode(!0),
            i = n.contains(a.ownerDocument, a);if (!(k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a))) for (g = ob(h), f = ob(a), d = 0, e = f.length; e > d; d++) {
          pb(f[d], g[d]);
        }if (b) if (c) for (f = f || ob(a), g = g || ob(h), d = 0, e = f.length; e > d; d++) {
          nb(f[d], g[d]);
        } else nb(a, h);return g = ob(h, "script"), g.length > 0 && mb(g, !i && ob(a, "script")), h;
      }, buildFragment: function buildFragment(a, b, c, d) {
        for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, o = a.length; o > m; m++) {
          if (e = a[m], e || 0 === e) if ("object" === n.type(e)) n.merge(l, e.nodeType ? [e] : e);else if (cb.test(e)) {
            f = f || k.appendChild(b.createElement("div")), g = (bb.exec(e) || ["", ""])[1].toLowerCase(), h = ib[g] || ib._default, f.innerHTML = h[1] + e.replace(ab, "<$1></$2>") + h[2], j = h[0];while (j--) {
              f = f.lastChild;
            }n.merge(l, f.childNodes), f = k.firstChild, f.textContent = "";
          } else l.push(b.createTextNode(e));
        }k.textContent = "", m = 0;while (e = l[m++]) {
          if ((!d || -1 === n.inArray(e, d)) && (i = n.contains(e.ownerDocument, e), f = ob(k.appendChild(e), "script"), i && mb(f), c)) {
            j = 0;while (e = f[j++]) {
              fb.test(e.type || "") && c.push(e);
            }
          }
        }return k;
      }, cleanData: function cleanData(a) {
        for (var b, c, d, e, f = n.event.special, g = 0; void 0 !== (c = a[g]); g++) {
          if (n.acceptData(c) && (e = c[L.expando], e && (b = L.cache[e]))) {
            if (b.events) for (d in b.events) {
              f[d] ? n.event.remove(c, d) : n.removeEvent(c, d, b.handle);
            }L.cache[e] && delete L.cache[e];
          }delete M.cache[c[M.expando]];
        }
      } }), n.fn.extend({ text: function text(a) {
        return J(this, function (a) {
          return void 0 === a ? n.text(this) : this.empty().each(function () {
            (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a);
          });
        }, null, a, arguments.length);
      }, append: function append() {
        return this.domManip(arguments, function (a) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var b = jb(this, a);b.appendChild(a);
          }
        });
      }, prepend: function prepend() {
        return this.domManip(arguments, function (a) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var b = jb(this, a);b.insertBefore(a, b.firstChild);
          }
        });
      }, before: function before() {
        return this.domManip(arguments, function (a) {
          this.parentNode && this.parentNode.insertBefore(a, this);
        });
      }, after: function after() {
        return this.domManip(arguments, function (a) {
          this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
        });
      }, remove: function remove(a, b) {
        for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) {
          b || 1 !== c.nodeType || n.cleanData(ob(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && mb(ob(c, "script")), c.parentNode.removeChild(c));
        }return this;
      }, empty: function empty() {
        for (var a, b = 0; null != (a = this[b]); b++) {
          1 === a.nodeType && (n.cleanData(ob(a, !1)), a.textContent = "");
        }return this;
      }, clone: function clone(a, b) {
        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
          return n.clone(this, a, b);
        });
      }, html: function html(a) {
        return J(this, function (a) {
          var b = this[0] || {},
              c = 0,
              d = this.length;if (void 0 === a && 1 === b.nodeType) return b.innerHTML;if ("string" == typeof a && !db.test(a) && !ib[(bb.exec(a) || ["", ""])[1].toLowerCase()]) {
            a = a.replace(ab, "<$1></$2>");try {
              for (; d > c; c++) {
                b = this[c] || {}, 1 === b.nodeType && (n.cleanData(ob(b, !1)), b.innerHTML = a);
              }b = 0;
            } catch (e) {}
          }b && this.empty().append(a);
        }, null, a, arguments.length);
      }, replaceWith: function replaceWith() {
        var a = arguments[0];return this.domManip(arguments, function (b) {
          a = this.parentNode, n.cleanData(ob(this)), a && a.replaceChild(b, this);
        }), a && (a.length || a.nodeType) ? this : this.remove();
      }, detach: function detach(a) {
        return this.remove(a, !0);
      }, domManip: function domManip(a, b) {
        a = e.apply([], a);var c,
            d,
            f,
            g,
            h,
            i,
            j = 0,
            l = this.length,
            m = this,
            o = l - 1,
            p = a[0],
            q = n.isFunction(p);if (q || l > 1 && "string" == typeof p && !k.checkClone && eb.test(p)) return this.each(function (c) {
          var d = m.eq(c);q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b);
        });if (l && (c = n.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) {
          for (f = n.map(ob(c, "script"), kb), g = f.length; l > j; j++) {
            h = c, j !== o && (h = n.clone(h, !0, !0), g && n.merge(f, ob(h, "script"))), b.call(this[j], h, j);
          }if (g) for (i = f[f.length - 1].ownerDocument, n.map(f, lb), j = 0; g > j; j++) {
            h = f[j], fb.test(h.type || "") && !L.access(h, "globalEval") && n.contains(i, h) && (h.src ? n._evalUrl && n._evalUrl(h.src) : n.globalEval(h.textContent.replace(hb, "")));
          }
        }return this;
      } }), n.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) {
      n.fn[a] = function (a) {
        for (var c, d = [], e = n(a), g = e.length - 1, h = 0; g >= h; h++) {
          c = h === g ? this : this.clone(!0), n(e[h])[b](c), f.apply(d, c.get());
        }return this.pushStack(d);
      };
    });var qb,
        rb = {};function sb(b, c) {
      var d,
          e = n(c.createElement(b)).appendTo(c.body),
          f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : n.css(e[0], "display");return e.detach(), f;
    }function tb(a) {
      var b = l,
          c = rb[a];return c || (c = sb(a, b), "none" !== c && c || (qb = (qb || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = qb[0].contentDocument, b.write(), b.close(), c = sb(a, b), qb.detach()), rb[a] = c), c;
    }var ub = /^margin/,
        vb = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"),
        wb = function wb(b) {
      return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null);
    };function xb(a, b, c) {
      var d,
          e,
          f,
          g,
          h = a.style;return c = c || wb(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), vb.test(g) && ub.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g;
    }function yb(a, b) {
      return { get: function get() {
          return a() ? void delete this.get : (this.get = b).apply(this, arguments);
        } };
    }!function () {
      var b,
          c,
          d = l.documentElement,
          e = l.createElement("div"),
          f = l.createElement("div");if (f.style) {
        var _g = function _g() {
          f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f.innerHTML = "", d.appendChild(e);var g = a.getComputedStyle(f, null);b = "1%" !== g.top, c = "4px" === g.width, d.removeChild(e);
        };

        f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === f.style.backgroundClip, e.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", e.appendChild(f);a.getComputedStyle && n.extend(k, { pixelPosition: function pixelPosition() {
            return _g(), b;
          }, boxSizingReliable: function boxSizingReliable() {
            return null == c && _g(), c;
          }, reliableMarginRight: function reliableMarginRight() {
            var b,
                c = f.appendChild(l.createElement("div"));return c.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", c.style.marginRight = c.style.width = "0", f.style.width = "1px", d.appendChild(e), b = !parseFloat(a.getComputedStyle(c, null).marginRight), d.removeChild(e), f.removeChild(c), b;
          } });
      }
    }(), n.swap = function (a, b, c, d) {
      var e,
          f,
          g = {};for (f in b) {
        g[f] = a.style[f], a.style[f] = b[f];
      }e = c.apply(a, d || []);for (f in b) {
        a.style[f] = g[f];
      }return e;
    };var zb = /^(none|table(?!-c[ea]).+)/,
        Ab = new RegExp("^(" + Q + ")(.*)$", "i"),
        Bb = new RegExp("^([+-])=(" + Q + ")", "i"),
        Cb = { position: "absolute", visibility: "hidden", display: "block" },
        Db = { letterSpacing: "0", fontWeight: "400" },
        Eb = ["Webkit", "O", "Moz", "ms"];function Fb(a, b) {
      if (b in a) return b;var c = b[0].toUpperCase() + b.slice(1),
          d = b,
          e = Eb.length;while (e--) {
        if (b = Eb[e] + c, b in a) return b;
      }return d;
    }function Gb(a, b, c) {
      var d = Ab.exec(b);return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
    }function Hb(a, b, c, d, e) {
      for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) {
        "margin" === c && (g += n.css(a, c + R[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + R[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + R[f] + "Width", !0, e))) : (g += n.css(a, "padding" + R[f], !0, e), "padding" !== c && (g += n.css(a, "border" + R[f] + "Width", !0, e)));
      }return g;
    }function Ib(a, b, c) {
      var d = !0,
          e = "width" === b ? a.offsetWidth : a.offsetHeight,
          f = wb(a),
          g = "border-box" === n.css(a, "boxSizing", !1, f);if (0 >= e || null == e) {
        if (e = xb(a, b, f), (0 > e || null == e) && (e = a.style[b]), vb.test(e)) return e;d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0;
      }return e + Hb(a, b, c || (g ? "border" : "content"), d, f) + "px";
    }function Jb(a, b) {
      for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) {
        d = a[g], d.style && (f[g] = L.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && S(d) && (f[g] = L.access(d, "olddisplay", tb(d.nodeName)))) : (e = S(d), "none" === c && e || L.set(d, "olddisplay", e ? c : n.css(d, "display"))));
      }for (g = 0; h > g; g++) {
        d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
      }return a;
    }n.extend({ cssHooks: { opacity: { get: function get(a, b) {
            if (b) {
              var c = xb(a, "opacity");return "" === c ? "1" : c;
            }
          } } }, cssNumber: { columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": "cssFloat" }, style: function style(a, b, c, d) {
        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
          var e,
              f,
              g,
              h = n.camelCase(b),
              i = a.style;return b = n.cssProps[h] || (n.cssProps[h] = Fb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c === "undefined" ? "undefined" : _typeof(c), "string" === f && (e = Bb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0);
        }
      }, css: function css(a, b, c, d) {
        var e,
            f,
            g,
            h = n.camelCase(b);return b = n.cssProps[h] || (n.cssProps[h] = Fb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = xb(a, b, d)), "normal" === e && b in Db && (e = Db[b]), "" === c || c ? (f = parseFloat(e), c === !0 || n.isNumeric(f) ? f || 0 : e) : e;
      } }), n.each(["height", "width"], function (a, b) {
      n.cssHooks[b] = { get: function get(a, c, d) {
          return c ? zb.test(n.css(a, "display")) && 0 === a.offsetWidth ? n.swap(a, Cb, function () {
            return Ib(a, b, d);
          }) : Ib(a, b, d) : void 0;
        }, set: function set(a, c, d) {
          var e = d && wb(a);return Gb(a, c, d ? Hb(a, b, d, "border-box" === n.css(a, "boxSizing", !1, e), e) : 0);
        } };
    }), n.cssHooks.marginRight = yb(k.reliableMarginRight, function (a, b) {
      return b ? n.swap(a, { display: "inline-block" }, xb, [a, "marginRight"]) : void 0;
    }), n.each({ margin: "", padding: "", border: "Width" }, function (a, b) {
      n.cssHooks[a + b] = { expand: function expand(c) {
          for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) {
            e[a + R[d] + b] = f[d] || f[d - 2] || f[0];
          }return e;
        } }, ub.test(a) || (n.cssHooks[a + b].set = Gb);
    }), n.fn.extend({ css: function css(a, b) {
        return J(this, function (a, b, c) {
          var d,
              e,
              f = {},
              g = 0;if (n.isArray(b)) {
            for (d = wb(a), e = b.length; e > g; g++) {
              f[b[g]] = n.css(a, b[g], !1, d);
            }return f;
          }return void 0 !== c ? n.style(a, b, c) : n.css(a, b);
        }, a, b, arguments.length > 1);
      }, show: function show() {
        return Jb(this, !0);
      }, hide: function hide() {
        return Jb(this);
      }, toggle: function toggle(a) {
        return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
          S(this) ? n(this).show() : n(this).hide();
        });
      } });function Kb(a, b, c, d, e) {
      return new Kb.prototype.init(a, b, c, d, e);
    }n.Tween = Kb, Kb.prototype = { constructor: Kb, init: function init(a, b, c, d, e, f) {
        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px");
      }, cur: function cur() {
        var a = Kb.propHooks[this.prop];return a && a.get ? a.get(this) : Kb.propHooks._default.get(this);
      }, run: function run(a) {
        var b,
            c = Kb.propHooks[this.prop];return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Kb.propHooks._default.set(this), this;
      } }, Kb.prototype.init.prototype = Kb.prototype, Kb.propHooks = { _default: { get: function get(a) {
          var b;return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop];
        }, set: function set(a) {
          n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
        } } }, Kb.propHooks.scrollTop = Kb.propHooks.scrollLeft = { set: function set(a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
      } }, n.easing = { linear: function linear(a) {
        return a;
      }, swing: function swing(a) {
        return .5 - Math.cos(a * Math.PI) / 2;
      } }, n.fx = Kb.prototype.init, n.fx.step = {};var Lb,
        Mb,
        Nb = /^(?:toggle|show|hide)$/,
        Ob = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"),
        Pb = /queueHooks$/,
        Qb = [Vb],
        Rb = { "*": [function (a, b) {
        var c = this.createTween(a, b),
            d = c.cur(),
            e = Ob.exec(b),
            f = e && e[3] || (n.cssNumber[a] ? "" : "px"),
            g = (n.cssNumber[a] || "px" !== f && +d) && Ob.exec(n.css(c.elem, a)),
            h = 1,
            i = 20;if (g && g[3] !== f) {
          f = f || g[3], e = e || [], g = +d || 1;do {
            h = h || ".5", g /= h, n.style(c.elem, a, g + f);
          } while (h !== (h = c.cur() / d) && 1 !== h && --i);
        }return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c;
      }] };function Sb() {
      return setTimeout(function () {
        Lb = void 0;
      }), Lb = n.now();
    }function Tb(a, b) {
      var c,
          d = 0,
          e = { height: a };for (b = b ? 1 : 0; 4 > d; d += 2 - b) {
        c = R[d], e["margin" + c] = e["padding" + c] = a;
      }return b && (e.opacity = e.width = a), e;
    }function Ub(a, b, c) {
      for (var d, e = (Rb[b] || []).concat(Rb["*"]), f = 0, g = e.length; g > f; f++) {
        if (d = e[f].call(c, b, a)) return d;
      }
    }function Vb(a, b, c) {
      var d,
          e,
          f,
          g,
          h,
          i,
          j,
          k,
          l = this,
          m = {},
          o = a.style,
          p = a.nodeType && S(a),
          q = L.get(a, "fxshow");c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
        h.unqueued || i();
      }), h.unqueued++, l.always(function () {
        l.always(function () {
          h.unqueued--, n.queue(a, "fx").length || h.empty.fire();
        });
      })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = n.css(a, "display"), k = "none" === j ? L.get(a, "olddisplay") || tb(a.nodeName) : j, "inline" === k && "none" === n.css(a, "float") && (o.display = "inline-block")), c.overflow && (o.overflow = "hidden", l.always(function () {
        o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2];
      }));for (d in b) {
        if (e = b[d], Nb.exec(e)) {
          if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) {
            if ("show" !== e || !q || void 0 === q[d]) continue;p = !0;
          }m[d] = q && q[d] || n.style(a, d);
        } else j = void 0;
      }if (n.isEmptyObject(m)) "inline" === ("none" === j ? tb(a.nodeName) : j) && (o.display = j);else {
        q ? "hidden" in q && (p = q.hidden) : q = L.access(a, "fxshow", {}), f && (q.hidden = !p), p ? n(a).show() : l.done(function () {
          n(a).hide();
        }), l.done(function () {
          var b;L.remove(a, "fxshow");for (b in m) {
            n.style(a, b, m[b]);
          }
        });for (d in m) {
          g = Ub(p ? q[d] : 0, d, l), d in q || (q[d] = g.start, p && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0));
        }
      }
    }function Wb(a, b) {
      var c, d, e, f, g;for (c in a) {
        if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
          f = g.expand(f), delete a[d];for (c in f) {
            c in a || (a[c] = f[c], b[c] = e);
          }
        } else b[d] = e;
      }
    }function Xb(a, b, c) {
      var d,
          e,
          f = 0,
          g = Qb.length,
          h = n.Deferred().always(function () {
        delete i.elem;
      }),
          i = function i() {
        if (e) return !1;for (var b = Lb || Sb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) {
          j.tweens[g].run(f);
        }return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1);
      },
          j = h.promise({ elem: a, props: n.extend({}, b), opts: n.extend(!0, { specialEasing: {} }, c), originalProperties: b, originalOptions: c, startTime: Lb || Sb(), duration: c.duration, tweens: [], createTween: function createTween(b, c) {
          var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);return j.tweens.push(d), d;
        }, stop: function stop(b) {
          var c = 0,
              d = b ? j.tweens.length : 0;if (e) return this;for (e = !0; d > c; c++) {
            j.tweens[c].run(1);
          }return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this;
        } }),
          k = j.props;for (Wb(k, j.opts.specialEasing); g > f; f++) {
        if (d = Qb[f].call(j, a, k, j.opts)) return d;
      }return n.map(k, Ub, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, { elem: a, anim: j, queue: j.opts.queue })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
    }n.Animation = n.extend(Xb, { tweener: function tweener(a, b) {
        n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");for (var c, d = 0, e = a.length; e > d; d++) {
          c = a[d], Rb[c] = Rb[c] || [], Rb[c].unshift(b);
        }
      }, prefilter: function prefilter(a, b) {
        b ? Qb.unshift(a) : Qb.push(a);
      } }), n.speed = function (a, b, c) {
      var d = a && "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? n.extend({}, a) : { complete: c || !c && b || n.isFunction(a) && a, duration: a, easing: c && b || b && !n.isFunction(b) && b };return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
        n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue);
      }, d;
    }, n.fn.extend({ fadeTo: function fadeTo(a, b, c, d) {
        return this.filter(S).css("opacity", 0).show().end().animate({ opacity: b }, a, c, d);
      }, animate: function animate(a, b, c, d) {
        var e = n.isEmptyObject(a),
            f = n.speed(b, c, d),
            g = function g() {
          var b = Xb(this, n.extend({}, a), f);(e || L.get(this, "finish")) && b.stop(!0);
        };return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
      }, stop: function stop(a, b, c) {
        var d = function d(a) {
          var b = a.stop;delete a.stop, b(c);
        };return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
          var b = !0,
              e = null != a && a + "queueHooks",
              f = n.timers,
              g = L.get(this);if (e) g[e] && g[e].stop && d(g[e]);else for (e in g) {
            g[e] && g[e].stop && Pb.test(e) && d(g[e]);
          }for (e = f.length; e--;) {
            f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
          }(b || !c) && n.dequeue(this, a);
        });
      }, finish: function finish(a) {
        return a !== !1 && (a = a || "fx"), this.each(function () {
          var b,
              c = L.get(this),
              d = c[a + "queue"],
              e = c[a + "queueHooks"],
              f = n.timers,
              g = d ? d.length : 0;for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) {
            f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
          }for (b = 0; g > b; b++) {
            d[b] && d[b].finish && d[b].finish.call(this);
          }delete c.finish;
        });
      } }), n.each(["toggle", "show", "hide"], function (a, b) {
      var c = n.fn[b];n.fn[b] = function (a, d, e) {
        return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(Tb(b, !0), a, d, e);
      };
    }), n.each({ slideDown: Tb("show"), slideUp: Tb("hide"), slideToggle: Tb("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) {
      n.fn[a] = function (a, c, d) {
        return this.animate(b, a, c, d);
      };
    }), n.timers = [], n.fx.tick = function () {
      var a,
          b = 0,
          c = n.timers;for (Lb = n.now(); b < c.length; b++) {
        a = c[b], a() || c[b] !== a || c.splice(b--, 1);
      }c.length || n.fx.stop(), Lb = void 0;
    }, n.fx.timer = function (a) {
      n.timers.push(a), a() ? n.fx.start() : n.timers.pop();
    }, n.fx.interval = 13, n.fx.start = function () {
      Mb || (Mb = setInterval(n.fx.tick, n.fx.interval));
    }, n.fx.stop = function () {
      clearInterval(Mb), Mb = null;
    }, n.fx.speeds = { slow: 600, fast: 200, _default: 400 }, n.fn.delay = function (a, b) {
      return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
        var d = setTimeout(b, a);c.stop = function () {
          clearTimeout(d);
        };
      });
    }, function () {
      var a = l.createElement("input"),
          b = l.createElement("select"),
          c = b.appendChild(l.createElement("option"));a.type = "checkbox", k.checkOn = "" !== a.value, k.optSelected = c.selected, b.disabled = !0, k.optDisabled = !c.disabled, a = l.createElement("input"), a.value = "t", a.type = "radio", k.radioValue = "t" === a.value;
    }();var Yb,
        Zb,
        $b = n.expr.attrHandle;n.fn.extend({ attr: function attr(a, b) {
        return J(this, n.attr, a, b, arguments.length > 1);
      }, removeAttr: function removeAttr(a) {
        return this.each(function () {
          n.removeAttr(this, a);
        });
      } }), n.extend({ attr: function attr(a, b, c) {
        var d,
            e,
            f = a.nodeType;if (a && 3 !== f && 8 !== f && 2 !== f) return _typeof(a.getAttribute) === U ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? Zb : Yb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b));
      }, removeAttr: function removeAttr(a, b) {
        var c,
            d,
            e = 0,
            f = b && b.match(E);if (f && 1 === a.nodeType) while (c = f[e++]) {
          d = n.propFix[c] || c, n.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c);
        }
      }, attrHooks: { type: { set: function set(a, b) {
            if (!k.radioValue && "radio" === b && n.nodeName(a, "input")) {
              var c = a.value;return a.setAttribute("type", b), c && (a.value = c), b;
            }
          } } } }), Zb = { set: function set(a, b, c) {
        return b === !1 ? n.removeAttr(a, c) : a.setAttribute(c, c), c;
      } }, n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) {
      var c = $b[b] || n.find.attr;$b[b] = function (a, b, d) {
        var e, f;return d || (f = $b[b], $b[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, $b[b] = f), e;
      };
    });var _b = /^(?:input|select|textarea|button)$/i;n.fn.extend({ prop: function prop(a, b) {
        return J(this, n.prop, a, b, arguments.length > 1);
      }, removeProp: function removeProp(a) {
        return this.each(function () {
          delete this[n.propFix[a] || a];
        });
      } }), n.extend({ propFix: { "for": "htmlFor", "class": "className" }, prop: function prop(a, b, c) {
        var d,
            e,
            f,
            g = a.nodeType;if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b];
      }, propHooks: { tabIndex: { get: function get(a) {
            return a.hasAttribute("tabindex") || _b.test(a.nodeName) || a.href ? a.tabIndex : -1;
          } } } }), k.optSelected || (n.propHooks.selected = { get: function get(a) {
        var b = a.parentNode;return b && b.parentNode && b.parentNode.selectedIndex, null;
      } }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
      n.propFix[this.toLowerCase()] = this;
    });var ac = /[\t\r\n\f]/g;n.fn.extend({ addClass: function addClass(a) {
        var b,
            c,
            d,
            e,
            f,
            g,
            h = "string" == typeof a && a,
            i = 0,
            j = this.length;if (n.isFunction(a)) return this.each(function (b) {
          n(this).addClass(a.call(this, b, this.className));
        });if (h) for (b = (a || "").match(E) || []; j > i; i++) {
          if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : " ")) {
            f = 0;while (e = b[f++]) {
              d.indexOf(" " + e + " ") < 0 && (d += e + " ");
            }g = n.trim(d), c.className !== g && (c.className = g);
          }
        }return this;
      }, removeClass: function removeClass(a) {
        var b,
            c,
            d,
            e,
            f,
            g,
            h = 0 === arguments.length || "string" == typeof a && a,
            i = 0,
            j = this.length;if (n.isFunction(a)) return this.each(function (b) {
          n(this).removeClass(a.call(this, b, this.className));
        });if (h) for (b = (a || "").match(E) || []; j > i; i++) {
          if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ac, " ") : "")) {
            f = 0;while (e = b[f++]) {
              while (d.indexOf(" " + e + " ") >= 0) {
                d = d.replace(" " + e + " ", " ");
              }
            }g = a ? n.trim(d) : "", c.className !== g && (c.className = g);
          }
        }return this;
      }, toggleClass: function toggleClass(a, b) {
        var c = typeof a === "undefined" ? "undefined" : _typeof(a);return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) {
          n(this).toggleClass(a.call(this, c, this.className, b), b);
        } : function () {
          if ("string" === c) {
            var b,
                d = 0,
                e = n(this),
                f = a.match(E) || [];while (b = f[d++]) {
              e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
            }
          } else (c === U || "boolean" === c) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : L.get(this, "__className__") || "");
        });
      }, hasClass: function hasClass(a) {
        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) {
          if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ac, " ").indexOf(b) >= 0) return !0;
        }return !1;
      } });var bc = /\r/g;n.fn.extend({ val: function val(a) {
        var b,
            c,
            d,
            e = this[0];{
          if (arguments.length) return d = n.isFunction(a), this.each(function (c) {
            var e;1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) {
              return null == a ? "" : a + "";
            })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
          });if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(bc, "") : null == c ? "" : c);
        }
      } }), n.extend({ valHooks: { option: { get: function get(a) {
            var b = n.find.attr(a, "value");return null != b ? b : n.trim(n.text(a));
          } }, select: { get: function get(a) {
            for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) {
              if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
                if (b = n(c).val(), f) return b;g.push(b);
              }
            }return g;
          }, set: function set(a, b) {
            var c,
                d,
                e = a.options,
                f = n.makeArray(b),
                g = e.length;while (g--) {
              d = e[g], (d.selected = n.inArray(d.value, f) >= 0) && (c = !0);
            }return c || (a.selectedIndex = -1), f;
          } } } }), n.each(["radio", "checkbox"], function () {
      n.valHooks[this] = { set: function set(a, b) {
          return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0;
        } }, k.checkOn || (n.valHooks[this].get = function (a) {
        return null === a.getAttribute("value") ? "on" : a.value;
      });
    }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
      n.fn[b] = function (a, c) {
        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
      };
    }), n.fn.extend({ hover: function hover(a, b) {
        return this.mouseenter(a).mouseleave(b || a);
      }, bind: function bind(a, b, c) {
        return this.on(a, null, b, c);
      }, unbind: function unbind(a, b) {
        return this.off(a, null, b);
      }, delegate: function delegate(a, b, c, d) {
        return this.on(b, a, c, d);
      }, undelegate: function undelegate(a, b, c) {
        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
      } });var cc = n.now(),
        dc = /\?/;n.parseJSON = function (a) {
      return JSON.parse(a + "");
    }, n.parseXML = function (a) {
      var b, c;if (!a || "string" != typeof a) return null;try {
        c = new DOMParser(), b = c.parseFromString(a, "text/xml");
      } catch (d) {
        b = void 0;
      }return (!b || b.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + a), b;
    };var ec = /#.*$/,
        fc = /([?&])_=[^&]*/,
        gc = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        hc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        ic = /^(?:GET|HEAD)$/,
        jc = /^\/\//,
        kc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        lc = {},
        mc = {},
        nc = "*/".concat("*"),
        oc = a.location.href,
        pc = kc.exec(oc.toLowerCase()) || [];function qc(a) {
      return function (b, c) {
        "string" != typeof b && (c = b, b = "*");var d,
            e = 0,
            f = b.toLowerCase().match(E) || [];if (n.isFunction(c)) while (d = f[e++]) {
          "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
        }
      };
    }function rc(a, b, c, d) {
      var e = {},
          f = a === mc;function g(h) {
        var i;return e[h] = !0, n.each(a[h] || [], function (a, h) {
          var j = h(b, c, d);return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1);
        }), i;
      }return g(b.dataTypes[0]) || !e["*"] && g("*");
    }function sc(a, b) {
      var c,
          d,
          e = n.ajaxSettings.flatOptions || {};for (c in b) {
        void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]);
      }return d && n.extend(!0, a, d), a;
    }function tc(a, b, c) {
      var d,
          e,
          f,
          g,
          h = a.contents,
          i = a.dataTypes;while ("*" === i[0]) {
        i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type"));
      }if (d) for (e in h) {
        if (h[e] && h[e].test(d)) {
          i.unshift(e);break;
        }
      }if (i[0] in c) f = i[0];else {
        for (e in c) {
          if (!i[0] || a.converters[e + " " + i[0]]) {
            f = e;break;
          }g || (g = e);
        }f = f || g;
      }return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
    }function uc(a, b, c, d) {
      var e,
          f,
          g,
          h,
          i,
          j = {},
          k = a.dataTypes.slice();if (k[1]) for (g in a.converters) {
        j[g.toLowerCase()] = a.converters[g];
      }f = k.shift();while (f) {
        if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i;else if ("*" !== i && i !== f) {
          if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) {
            if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
              g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));break;
            }
          }if (g !== !0) if (g && a["throws"]) b = g(b);else try {
            b = g(b);
          } catch (l) {
            return { state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f };
          }
        }
      }return { state: "success", data: b };
    }n.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: oc, type: "GET", isLocal: hc.test(pc[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": nc, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": n.parseJSON, "text xml": n.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function ajaxSetup(a, b) {
        return b ? sc(sc(a, n.ajaxSettings), b) : sc(n.ajaxSettings, a);
      }, ajaxPrefilter: qc(lc), ajaxTransport: qc(mc), ajax: function ajax(a, b) {
        "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) && (b = a, a = void 0), b = b || {};var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k = n.ajaxSetup({}, b),
            l = k.context || k,
            m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event,
            o = n.Deferred(),
            p = n.Callbacks("once memory"),
            q = k.statusCode || {},
            r = {},
            s = {},
            t = 0,
            u = "canceled",
            v = { readyState: 0, getResponseHeader: function getResponseHeader(a) {
            var b;if (2 === t) {
              if (!f) {
                f = {};while (b = gc.exec(e)) {
                  f[b[1].toLowerCase()] = b[2];
                }
              }b = f[a.toLowerCase()];
            }return null == b ? null : b;
          }, getAllResponseHeaders: function getAllResponseHeaders() {
            return 2 === t ? e : null;
          }, setRequestHeader: function setRequestHeader(a, b) {
            var c = a.toLowerCase();return t || (a = s[c] = s[c] || a, r[a] = b), this;
          }, overrideMimeType: function overrideMimeType(a) {
            return t || (k.mimeType = a), this;
          }, statusCode: function statusCode(a) {
            var b;if (a) if (2 > t) for (b in a) {
              q[b] = [q[b], a[b]];
            } else v.always(a[v.status]);return this;
          }, abort: function abort(a) {
            var b = a || u;return c && c.abort(b), x(0, b), this;
          } };if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || oc) + "").replace(ec, "").replace(jc, pc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (h = kc.exec(k.url.toLowerCase()), k.crossDomain = !(!h || h[1] === pc[1] && h[2] === pc[2] && (h[3] || ("http:" === h[1] ? "80" : "443")) === (pc[3] || ("http:" === pc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), rc(lc, k, b, v), 2 === t) return v;i = n.event && k.global, i && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !ic.test(k.type), d = k.url, k.hasContent || (k.data && (d = k.url += (dc.test(d) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = fc.test(d) ? d.replace(fc, "$1_=" + cc++) : d + (dc.test(d) ? "&" : "?") + "_=" + cc++)), k.ifModified && (n.lastModified[d] && v.setRequestHeader("If-Modified-Since", n.lastModified[d]), n.etag[d] && v.setRequestHeader("If-None-Match", n.etag[d])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + nc + "; q=0.01" : "") : k.accepts["*"]);for (j in k.headers) {
          v.setRequestHeader(j, k.headers[j]);
        }if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();u = "abort";for (j in { success: 1, error: 1, complete: 1 }) {
          v[j](k[j]);
        }if (c = rc(mc, k, b, v)) {
          v.readyState = 1, i && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () {
            v.abort("timeout");
          }, k.timeout));try {
            t = 1, c.send(r, x);
          } catch (w) {
            if (!(2 > t)) throw w;x(-1, w);
          }
        } else x(-1, "No Transport");function x(a, b, f, h) {
          var j,
              r,
              s,
              u,
              w,
              x = b;2 !== t && (t = 2, g && clearTimeout(g), c = void 0, e = h || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, f && (u = tc(k, v, f)), u = uc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[d] = w), w = v.getResponseHeader("etag"), w && (n.etag[d] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, i && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), i && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")));
        }return v;
      }, getJSON: function getJSON(a, b, c) {
        return n.get(a, b, c, "json");
      }, getScript: function getScript(a, b) {
        return n.get(a, void 0, b, "script");
      } }), n.each(["get", "post"], function (a, b) {
      n[b] = function (a, c, d, e) {
        return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({ url: a, type: b, dataType: e, data: c, success: d });
      };
    }), n._evalUrl = function (a) {
      return n.ajax({ url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 });
    }, n.fn.extend({ wrapAll: function wrapAll(a) {
        var b;return n.isFunction(a) ? this.each(function (b) {
          n(this).wrapAll(a.call(this, b));
        }) : (this[0] && (b = n(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
          var a = this;while (a.firstElementChild) {
            a = a.firstElementChild;
          }return a;
        }).append(this)), this);
      }, wrapInner: function wrapInner(a) {
        return this.each(n.isFunction(a) ? function (b) {
          n(this).wrapInner(a.call(this, b));
        } : function () {
          var b = n(this),
              c = b.contents();c.length ? c.wrapAll(a) : b.append(a);
        });
      }, wrap: function wrap(a) {
        var b = n.isFunction(a);return this.each(function (c) {
          n(this).wrapAll(b ? a.call(this, c) : a);
        });
      }, unwrap: function unwrap() {
        return this.parent().each(function () {
          n.nodeName(this, "body") || n(this).replaceWith(this.childNodes);
        }).end();
      } }), n.expr.filters.hidden = function (a) {
      return a.offsetWidth <= 0 && a.offsetHeight <= 0;
    }, n.expr.filters.visible = function (a) {
      return !n.expr.filters.hidden(a);
    };var vc = /%20/g,
        wc = /\[\]$/,
        xc = /\r?\n/g,
        yc = /^(?:submit|button|image|reset|file)$/i,
        zc = /^(?:input|select|textarea|keygen)/i;function Ac(a, b, c, d) {
      var e;if (n.isArray(b)) n.each(b, function (b, e) {
        c || wc.test(a) ? d(a, e) : Ac(a + "[" + ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? b : "") + "]", e, c, d);
      });else if (c || "object" !== n.type(b)) d(a, b);else for (e in b) {
        Ac(a + "[" + e + "]", b[e], c, d);
      }
    }n.param = function (a, b) {
      var c,
          d = [],
          e = function e(a, b) {
        b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
      };if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function () {
        e(this.name, this.value);
      });else for (c in a) {
        Ac(c, a[c], b, e);
      }return d.join("&").replace(vc, "+");
    }, n.fn.extend({ serialize: function serialize() {
        return n.param(this.serializeArray());
      }, serializeArray: function serializeArray() {
        return this.map(function () {
          var a = n.prop(this, "elements");return a ? n.makeArray(a) : this;
        }).filter(function () {
          var a = this.type;return this.name && !n(this).is(":disabled") && zc.test(this.nodeName) && !yc.test(a) && (this.checked || !T.test(a));
        }).map(function (a, b) {
          var c = n(this).val();return null == c ? null : n.isArray(c) ? n.map(c, function (a) {
            return { name: b.name, value: a.replace(xc, "\r\n") };
          }) : { name: b.name, value: c.replace(xc, "\r\n") };
        }).get();
      } }), n.ajaxSettings.xhr = function () {
      try {
        return new XMLHttpRequest();
      } catch (a) {}
    };var Bc = 0,
        Cc = {},
        Dc = { 0: 200, 1223: 204 },
        Ec = n.ajaxSettings.xhr();a.attachEvent && a.attachEvent("onunload", function () {
      for (var a in Cc) {
        Cc[a]();
      }
    }), k.cors = !!Ec && "withCredentials" in Ec, k.ajax = Ec = !!Ec, n.ajaxTransport(function (a) {
      var _b3;return k.cors || Ec && !a.crossDomain ? { send: function send(c, d) {
          var e,
              f = a.xhr(),
              g = ++Bc;if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) for (e in a.xhrFields) {
            f[e] = a.xhrFields[e];
          }a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");for (e in c) {
            f.setRequestHeader(e, c[e]);
          }_b3 = function b(a) {
            return function () {
              _b3 && (delete Cc[g], _b3 = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Dc[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? { text: f.responseText } : void 0, f.getAllResponseHeaders()));
            };
          }, f.onload = _b3(), f.onerror = _b3("error"), _b3 = Cc[g] = _b3("abort");try {
            f.send(a.hasContent && a.data || null);
          } catch (h) {
            if (_b3) throw h;
          }
        }, abort: function abort() {
          _b3 && _b3();
        } } : void 0;
    }), n.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /(?:java|ecma)script/ }, converters: { "text script": function textScript(a) {
          return n.globalEval(a), a;
        } } }), n.ajaxPrefilter("script", function (a) {
      void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET");
    }), n.ajaxTransport("script", function (a) {
      if (a.crossDomain) {
        var b, _c;return { send: function send(d, e) {
            b = n("<script>").prop({ async: !0, charset: a.scriptCharset, src: a.url }).on("load error", _c = function c(a) {
              b.remove(), _c = null, a && e("error" === a.type ? 404 : 200, a.type);
            }), l.head.appendChild(b[0]);
          }, abort: function abort() {
            _c && _c();
          } };
      }
    });var Fc = [],
        Gc = /(=)\?(?=&|$)|\?\?/;n.ajaxSetup({ jsonp: "callback", jsonpCallback: function jsonpCallback() {
        var a = Fc.pop() || n.expando + "_" + cc++;return this[a] = !0, a;
      } }), n.ajaxPrefilter("json jsonp", function (b, c, d) {
      var e,
          f,
          g,
          h = b.jsonp !== !1 && (Gc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Gc.test(b.data) && "data");return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Gc, "$1" + e) : b.jsonp !== !1 && (b.url += (dc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
        return g || n.error(e + " was not called"), g[0];
      }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
        g = arguments;
      }, d.always(function () {
        a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Fc.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0;
      }), "script") : void 0;
    }), n.parseHTML = function (a, b, c) {
      if (!a || "string" != typeof a) return null;"boolean" == typeof b && (c = b, b = !1), b = b || l;var d = v.exec(a),
          e = !c && [];return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes));
    };var Hc = n.fn.load;n.fn.load = function (a, b, c) {
      if ("string" != typeof a && Hc) return Hc.apply(this, arguments);var d,
          e,
          f,
          g = this,
          h = a.indexOf(" ");return h >= 0 && (d = n.trim(a.slice(h)), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && (e = "POST"), g.length > 0 && n.ajax({ url: a, type: e, dataType: "html", data: b }).done(function (a) {
        f = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a);
      }).complete(c && function (a, b) {
        g.each(c, f || [a.responseText, b, a]);
      }), this;
    }, n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
      n.fn[b] = function (a) {
        return this.on(b, a);
      };
    }), n.expr.filters.animated = function (a) {
      return n.grep(n.timers, function (b) {
        return a === b.elem;
      }).length;
    };var Ic = a.document.documentElement;function Jc(a) {
      return n.isWindow(a) ? a : 9 === a.nodeType && a.defaultView;
    }n.offset = { setOffset: function setOffset(a, b, c) {
        var d,
            e,
            f,
            g,
            h,
            i,
            j,
            k = n.css(a, "position"),
            l = n(a),
            m = {};"static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
      } }, n.fn.extend({ offset: function offset(a) {
        if (arguments.length) return void 0 === a ? this : this.each(function (b) {
          n.offset.setOffset(this, a, b);
        });var b,
            c,
            d = this[0],
            e = { top: 0, left: 0 },
            f = d && d.ownerDocument;if (f) return b = f.documentElement, n.contains(b, d) ? (_typeof(d.getBoundingClientRect) !== U && (e = d.getBoundingClientRect()), c = Jc(f), { top: e.top + c.pageYOffset - b.clientTop, left: e.left + c.pageXOffset - b.clientLeft }) : e;
      }, position: function position() {
        if (this[0]) {
          var a,
              b,
              c = this[0],
              d = { top: 0, left: 0 };return "fixed" === n.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (d = a.offset()), d.top += n.css(a[0], "borderTopWidth", !0), d.left += n.css(a[0], "borderLeftWidth", !0)), { top: b.top - d.top - n.css(c, "marginTop", !0), left: b.left - d.left - n.css(c, "marginLeft", !0) };
        }
      }, offsetParent: function offsetParent() {
        return this.map(function () {
          var a = this.offsetParent || Ic;while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) {
            a = a.offsetParent;
          }return a || Ic;
        });
      } }), n.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (b, c) {
      var d = "pageYOffset" === c;n.fn[b] = function (e) {
        return J(this, function (b, e, f) {
          var g = Jc(b);return void 0 === f ? g ? g[c] : b[e] : void (g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f);
        }, b, e, arguments.length, null);
      };
    }), n.each(["top", "left"], function (a, b) {
      n.cssHooks[b] = yb(k.pixelPosition, function (a, c) {
        return c ? (c = xb(a, b), vb.test(c) ? n(a).position()[b] + "px" : c) : void 0;
      });
    }), n.each({ Height: "height", Width: "width" }, function (a, b) {
      n.each({ padding: "inner" + a, content: b, "": "outer" + a }, function (c, d) {
        n.fn[d] = function (d, e) {
          var f = arguments.length && (c || "boolean" != typeof d),
              g = c || (d === !0 || e === !0 ? "margin" : "border");return J(this, function (b, c, d) {
            var e;return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g);
          }, b, f ? d : void 0, f, null);
        };
      });
    }), n.fn.size = function () {
      return this.length;
    }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
      return n;
    });var Kc = a.jQuery,
        Lc = a.$;return n.noConflict = function (b) {
      return a.$ === n && (a.$ = Lc), b && a.jQuery === n && (a.jQuery = Kc), n;
    }, (typeof b === "undefined" ? "undefined" : _typeof(b)) === U && (a.jQuery = a.$ = n), n;
  });
});
define('resources/js/main',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Main = exports.Main = function () {
        function Main() {
            _classCallCheck(this, Main);
        }

        Main.initializeJS = function initializeJS() {
            $('#username').closest("div").find("label").addClass('active highlight');
        };

        Main.loginJS = function loginJS() {
            $('.form').find('input, textarea').on('keyup blur focus', function (e) {

                var $this = $(this),
                    label = $this.prev('label');

                if (e.type === 'keyup') {
                    if ($this.val() === '') {
                        label.removeClass('active highlight');
                    } else {
                        label.addClass('active highlight');
                    }
                } else if (e.type === 'blur') {
                    if ($this.val() === '') {
                        label.removeClass('active highlight');
                    } else {
                        label.removeClass('highlight');
                    }
                } else if (e.type === 'focus') {

                    if ($this.val() === '') {
                        label.removeClass('highlight');
                    } else if ($this.val() !== '') {
                        label.addClass('highlight');
                    }
                }
            });

            $('.tab a').on('click', function (e) {

                e.preventDefault();

                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');

                target = $(this).attr('href');

                $('.tab-content > div').not(target).hide();

                $(target).fadeIn(600);
            });
        };

        return Main;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><div id=\"notificationbar\"><span id=\"value\">You smell good.</span>&nbsp;<a id=\"close\">[x]</a></div><router-view></router-view></template>"; });
define('text!resources/css/font-awesome.min.css', ['module'], function(module) { module.exports = "/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}.fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-lg{font-size:1.33333333em;line-height:.75em;vertical-align:-15%}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-fw{width:1.28571429em;text-align:center}.fa-ul{padding-left:0;margin-left:2.14285714em;list-style-type:none}.fa-ul>li{position:relative}.fa-li{position:absolute;left:-2.14285714em;width:2.14285714em;top:.14285714em;text-align:center}.fa-li.fa-lg{left:-1.85714286em}.fa-border{padding:.2em .25em .15em;border:solid .08em #eee;border-radius:.1em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left{margin-right:.3em}.fa.fa-pull-right{margin-left:.3em}.pull-right{float:right}.pull-left{float:left}.fa.pull-left{margin-right:.3em}.fa.pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.fa-rotate-90{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";-webkit-transform:scale(-1, 1);-ms-transform:scale(-1, 1);transform:scale(-1, 1)}.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(1, -1);-ms-transform:scale(1, -1);transform:scale(1, -1)}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical{filter:none}.fa-stack{position:relative;display:inline-block;width:2em;height:2em;line-height:2em;vertical-align:middle}.fa-stack-1x,.fa-stack-2x{position:absolute;left:0;width:100%;text-align:center}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:#fff}.fa-glass:before{content:\"\\f000\"}.fa-music:before{content:\"\\f001\"}.fa-search:before{content:\"\\f002\"}.fa-envelope-o:before{content:\"\\f003\"}.fa-heart:before{content:\"\\f004\"}.fa-star:before{content:\"\\f005\"}.fa-star-o:before{content:\"\\f006\"}.fa-user:before{content:\"\\f007\"}.fa-film:before{content:\"\\f008\"}.fa-th-large:before{content:\"\\f009\"}.fa-th:before{content:\"\\f00a\"}.fa-th-list:before{content:\"\\f00b\"}.fa-check:before{content:\"\\f00c\"}.fa-remove:before,.fa-close:before,.fa-times:before{content:\"\\f00d\"}.fa-search-plus:before{content:\"\\f00e\"}.fa-search-minus:before{content:\"\\f010\"}.fa-power-off:before{content:\"\\f011\"}.fa-signal:before{content:\"\\f012\"}.fa-gear:before,.fa-cog:before{content:\"\\f013\"}.fa-trash-o:before{content:\"\\f014\"}.fa-home:before{content:\"\\f015\"}.fa-file-o:before{content:\"\\f016\"}.fa-clock-o:before{content:\"\\f017\"}.fa-road:before{content:\"\\f018\"}.fa-download:before{content:\"\\f019\"}.fa-arrow-circle-o-down:before{content:\"\\f01a\"}.fa-arrow-circle-o-up:before{content:\"\\f01b\"}.fa-inbox:before{content:\"\\f01c\"}.fa-play-circle-o:before{content:\"\\f01d\"}.fa-rotate-right:before,.fa-repeat:before{content:\"\\f01e\"}.fa-refresh:before{content:\"\\f021\"}.fa-list-alt:before{content:\"\\f022\"}.fa-lock:before{content:\"\\f023\"}.fa-flag:before{content:\"\\f024\"}.fa-headphones:before{content:\"\\f025\"}.fa-volume-off:before{content:\"\\f026\"}.fa-volume-down:before{content:\"\\f027\"}.fa-volume-up:before{content:\"\\f028\"}.fa-qrcode:before{content:\"\\f029\"}.fa-barcode:before{content:\"\\f02a\"}.fa-tag:before{content:\"\\f02b\"}.fa-tags:before{content:\"\\f02c\"}.fa-book:before{content:\"\\f02d\"}.fa-bookmark:before{content:\"\\f02e\"}.fa-print:before{content:\"\\f02f\"}.fa-camera:before{content:\"\\f030\"}.fa-font:before{content:\"\\f031\"}.fa-bold:before{content:\"\\f032\"}.fa-italic:before{content:\"\\f033\"}.fa-text-height:before{content:\"\\f034\"}.fa-text-width:before{content:\"\\f035\"}.fa-align-left:before{content:\"\\f036\"}.fa-align-center:before{content:\"\\f037\"}.fa-align-right:before{content:\"\\f038\"}.fa-align-justify:before{content:\"\\f039\"}.fa-list:before{content:\"\\f03a\"}.fa-dedent:before,.fa-outdent:before{content:\"\\f03b\"}.fa-indent:before{content:\"\\f03c\"}.fa-video-camera:before{content:\"\\f03d\"}.fa-photo:before,.fa-image:before,.fa-picture-o:before{content:\"\\f03e\"}.fa-pencil:before{content:\"\\f040\"}.fa-map-marker:before{content:\"\\f041\"}.fa-adjust:before{content:\"\\f042\"}.fa-tint:before{content:\"\\f043\"}.fa-edit:before,.fa-pencil-square-o:before{content:\"\\f044\"}.fa-share-square-o:before{content:\"\\f045\"}.fa-check-square-o:before{content:\"\\f046\"}.fa-arrows:before{content:\"\\f047\"}.fa-step-backward:before{content:\"\\f048\"}.fa-fast-backward:before{content:\"\\f049\"}.fa-backward:before{content:\"\\f04a\"}.fa-play:before{content:\"\\f04b\"}.fa-pause:before{content:\"\\f04c\"}.fa-stop:before{content:\"\\f04d\"}.fa-forward:before{content:\"\\f04e\"}.fa-fast-forward:before{content:\"\\f050\"}.fa-step-forward:before{content:\"\\f051\"}.fa-eject:before{content:\"\\f052\"}.fa-chevron-left:before{content:\"\\f053\"}.fa-chevron-right:before{content:\"\\f054\"}.fa-plus-circle:before{content:\"\\f055\"}.fa-minus-circle:before{content:\"\\f056\"}.fa-times-circle:before{content:\"\\f057\"}.fa-check-circle:before{content:\"\\f058\"}.fa-question-circle:before{content:\"\\f059\"}.fa-info-circle:before{content:\"\\f05a\"}.fa-crosshairs:before{content:\"\\f05b\"}.fa-times-circle-o:before{content:\"\\f05c\"}.fa-check-circle-o:before{content:\"\\f05d\"}.fa-ban:before{content:\"\\f05e\"}.fa-arrow-left:before{content:\"\\f060\"}.fa-arrow-right:before{content:\"\\f061\"}.fa-arrow-up:before{content:\"\\f062\"}.fa-arrow-down:before{content:\"\\f063\"}.fa-mail-forward:before,.fa-share:before{content:\"\\f064\"}.fa-expand:before{content:\"\\f065\"}.fa-compress:before{content:\"\\f066\"}.fa-plus:before{content:\"\\f067\"}.fa-minus:before{content:\"\\f068\"}.fa-asterisk:before{content:\"\\f069\"}.fa-exclamation-circle:before{content:\"\\f06a\"}.fa-gift:before{content:\"\\f06b\"}.fa-leaf:before{content:\"\\f06c\"}.fa-fire:before{content:\"\\f06d\"}.fa-eye:before{content:\"\\f06e\"}.fa-eye-slash:before{content:\"\\f070\"}.fa-warning:before,.fa-exclamation-triangle:before{content:\"\\f071\"}.fa-plane:before{content:\"\\f072\"}.fa-calendar:before{content:\"\\f073\"}.fa-random:before{content:\"\\f074\"}.fa-comment:before{content:\"\\f075\"}.fa-magnet:before{content:\"\\f076\"}.fa-chevron-up:before{content:\"\\f077\"}.fa-chevron-down:before{content:\"\\f078\"}.fa-retweet:before{content:\"\\f079\"}.fa-shopping-cart:before{content:\"\\f07a\"}.fa-folder:before{content:\"\\f07b\"}.fa-folder-open:before{content:\"\\f07c\"}.fa-arrows-v:before{content:\"\\f07d\"}.fa-arrows-h:before{content:\"\\f07e\"}.fa-bar-chart-o:before,.fa-bar-chart:before{content:\"\\f080\"}.fa-twitter-square:before{content:\"\\f081\"}.fa-facebook-square:before{content:\"\\f082\"}.fa-camera-retro:before{content:\"\\f083\"}.fa-key:before{content:\"\\f084\"}.fa-gears:before,.fa-cogs:before{content:\"\\f085\"}.fa-comments:before{content:\"\\f086\"}.fa-thumbs-o-up:before{content:\"\\f087\"}.fa-thumbs-o-down:before{content:\"\\f088\"}.fa-star-half:before{content:\"\\f089\"}.fa-heart-o:before{content:\"\\f08a\"}.fa-sign-out:before{content:\"\\f08b\"}.fa-linkedin-square:before{content:\"\\f08c\"}.fa-thumb-tack:before{content:\"\\f08d\"}.fa-external-link:before{content:\"\\f08e\"}.fa-sign-in:before{content:\"\\f090\"}.fa-trophy:before{content:\"\\f091\"}.fa-github-square:before{content:\"\\f092\"}.fa-upload:before{content:\"\\f093\"}.fa-lemon-o:before{content:\"\\f094\"}.fa-phone:before{content:\"\\f095\"}.fa-square-o:before{content:\"\\f096\"}.fa-bookmark-o:before{content:\"\\f097\"}.fa-phone-square:before{content:\"\\f098\"}.fa-twitter:before{content:\"\\f099\"}.fa-facebook-f:before,.fa-facebook:before{content:\"\\f09a\"}.fa-github:before{content:\"\\f09b\"}.fa-unlock:before{content:\"\\f09c\"}.fa-credit-card:before{content:\"\\f09d\"}.fa-feed:before,.fa-rss:before{content:\"\\f09e\"}.fa-hdd-o:before{content:\"\\f0a0\"}.fa-bullhorn:before{content:\"\\f0a1\"}.fa-bell:before{content:\"\\f0f3\"}.fa-certificate:before{content:\"\\f0a3\"}.fa-hand-o-right:before{content:\"\\f0a4\"}.fa-hand-o-left:before{content:\"\\f0a5\"}.fa-hand-o-up:before{content:\"\\f0a6\"}.fa-hand-o-down:before{content:\"\\f0a7\"}.fa-arrow-circle-left:before{content:\"\\f0a8\"}.fa-arrow-circle-right:before{content:\"\\f0a9\"}.fa-arrow-circle-up:before{content:\"\\f0aa\"}.fa-arrow-circle-down:before{content:\"\\f0ab\"}.fa-globe:before{content:\"\\f0ac\"}.fa-wrench:before{content:\"\\f0ad\"}.fa-tasks:before{content:\"\\f0ae\"}.fa-filter:before{content:\"\\f0b0\"}.fa-briefcase:before{content:\"\\f0b1\"}.fa-arrows-alt:before{content:\"\\f0b2\"}.fa-group:before,.fa-users:before{content:\"\\f0c0\"}.fa-chain:before,.fa-link:before{content:\"\\f0c1\"}.fa-cloud:before{content:\"\\f0c2\"}.fa-flask:before{content:\"\\f0c3\"}.fa-cut:before,.fa-scissors:before{content:\"\\f0c4\"}.fa-copy:before,.fa-files-o:before{content:\"\\f0c5\"}.fa-paperclip:before{content:\"\\f0c6\"}.fa-save:before,.fa-floppy-o:before{content:\"\\f0c7\"}.fa-square:before{content:\"\\f0c8\"}.fa-navicon:before,.fa-reorder:before,.fa-bars:before{content:\"\\f0c9\"}.fa-list-ul:before{content:\"\\f0ca\"}.fa-list-ol:before{content:\"\\f0cb\"}.fa-strikethrough:before{content:\"\\f0cc\"}.fa-underline:before{content:\"\\f0cd\"}.fa-table:before{content:\"\\f0ce\"}.fa-magic:before{content:\"\\f0d0\"}.fa-truck:before{content:\"\\f0d1\"}.fa-pinterest:before{content:\"\\f0d2\"}.fa-pinterest-square:before{content:\"\\f0d3\"}.fa-google-plus-square:before{content:\"\\f0d4\"}.fa-google-plus:before{content:\"\\f0d5\"}.fa-money:before{content:\"\\f0d6\"}.fa-caret-down:before{content:\"\\f0d7\"}.fa-caret-up:before{content:\"\\f0d8\"}.fa-caret-left:before{content:\"\\f0d9\"}.fa-caret-right:before{content:\"\\f0da\"}.fa-columns:before{content:\"\\f0db\"}.fa-unsorted:before,.fa-sort:before{content:\"\\f0dc\"}.fa-sort-down:before,.fa-sort-desc:before{content:\"\\f0dd\"}.fa-sort-up:before,.fa-sort-asc:before{content:\"\\f0de\"}.fa-envelope:before{content:\"\\f0e0\"}.fa-linkedin:before{content:\"\\f0e1\"}.fa-rotate-left:before,.fa-undo:before{content:\"\\f0e2\"}.fa-legal:before,.fa-gavel:before{content:\"\\f0e3\"}.fa-dashboard:before,.fa-tachometer:before{content:\"\\f0e4\"}.fa-comment-o:before{content:\"\\f0e5\"}.fa-comments-o:before{content:\"\\f0e6\"}.fa-flash:before,.fa-bolt:before{content:\"\\f0e7\"}.fa-sitemap:before{content:\"\\f0e8\"}.fa-umbrella:before{content:\"\\f0e9\"}.fa-paste:before,.fa-clipboard:before{content:\"\\f0ea\"}.fa-lightbulb-o:before{content:\"\\f0eb\"}.fa-exchange:before{content:\"\\f0ec\"}.fa-cloud-download:before{content:\"\\f0ed\"}.fa-cloud-upload:before{content:\"\\f0ee\"}.fa-user-md:before{content:\"\\f0f0\"}.fa-stethoscope:before{content:\"\\f0f1\"}.fa-suitcase:before{content:\"\\f0f2\"}.fa-bell-o:before{content:\"\\f0a2\"}.fa-coffee:before{content:\"\\f0f4\"}.fa-cutlery:before{content:\"\\f0f5\"}.fa-file-text-o:before{content:\"\\f0f6\"}.fa-building-o:before{content:\"\\f0f7\"}.fa-hospital-o:before{content:\"\\f0f8\"}.fa-ambulance:before{content:\"\\f0f9\"}.fa-medkit:before{content:\"\\f0fa\"}.fa-fighter-jet:before{content:\"\\f0fb\"}.fa-beer:before{content:\"\\f0fc\"}.fa-h-square:before{content:\"\\f0fd\"}.fa-plus-square:before{content:\"\\f0fe\"}.fa-angle-double-left:before{content:\"\\f100\"}.fa-angle-double-right:before{content:\"\\f101\"}.fa-angle-double-up:before{content:\"\\f102\"}.fa-angle-double-down:before{content:\"\\f103\"}.fa-angle-left:before{content:\"\\f104\"}.fa-angle-right:before{content:\"\\f105\"}.fa-angle-up:before{content:\"\\f106\"}.fa-angle-down:before{content:\"\\f107\"}.fa-desktop:before{content:\"\\f108\"}.fa-laptop:before{content:\"\\f109\"}.fa-tablet:before{content:\"\\f10a\"}.fa-mobile-phone:before,.fa-mobile:before{content:\"\\f10b\"}.fa-circle-o:before{content:\"\\f10c\"}.fa-quote-left:before{content:\"\\f10d\"}.fa-quote-right:before{content:\"\\f10e\"}.fa-spinner:before{content:\"\\f110\"}.fa-circle:before{content:\"\\f111\"}.fa-mail-reply:before,.fa-reply:before{content:\"\\f112\"}.fa-github-alt:before{content:\"\\f113\"}.fa-folder-o:before{content:\"\\f114\"}.fa-folder-open-o:before{content:\"\\f115\"}.fa-smile-o:before{content:\"\\f118\"}.fa-frown-o:before{content:\"\\f119\"}.fa-meh-o:before{content:\"\\f11a\"}.fa-gamepad:before{content:\"\\f11b\"}.fa-keyboard-o:before{content:\"\\f11c\"}.fa-flag-o:before{content:\"\\f11d\"}.fa-flag-checkered:before{content:\"\\f11e\"}.fa-terminal:before{content:\"\\f120\"}.fa-code:before{content:\"\\f121\"}.fa-mail-reply-all:before,.fa-reply-all:before{content:\"\\f122\"}.fa-star-half-empty:before,.fa-star-half-full:before,.fa-star-half-o:before{content:\"\\f123\"}.fa-location-arrow:before{content:\"\\f124\"}.fa-crop:before{content:\"\\f125\"}.fa-code-fork:before{content:\"\\f126\"}.fa-unlink:before,.fa-chain-broken:before{content:\"\\f127\"}.fa-question:before{content:\"\\f128\"}.fa-info:before{content:\"\\f129\"}.fa-exclamation:before{content:\"\\f12a\"}.fa-superscript:before{content:\"\\f12b\"}.fa-subscript:before{content:\"\\f12c\"}.fa-eraser:before{content:\"\\f12d\"}.fa-puzzle-piece:before{content:\"\\f12e\"}.fa-microphone:before{content:\"\\f130\"}.fa-microphone-slash:before{content:\"\\f131\"}.fa-shield:before{content:\"\\f132\"}.fa-calendar-o:before{content:\"\\f133\"}.fa-fire-extinguisher:before{content:\"\\f134\"}.fa-rocket:before{content:\"\\f135\"}.fa-maxcdn:before{content:\"\\f136\"}.fa-chevron-circle-left:before{content:\"\\f137\"}.fa-chevron-circle-right:before{content:\"\\f138\"}.fa-chevron-circle-up:before{content:\"\\f139\"}.fa-chevron-circle-down:before{content:\"\\f13a\"}.fa-html5:before{content:\"\\f13b\"}.fa-css3:before{content:\"\\f13c\"}.fa-anchor:before{content:\"\\f13d\"}.fa-unlock-alt:before{content:\"\\f13e\"}.fa-bullseye:before{content:\"\\f140\"}.fa-ellipsis-h:before{content:\"\\f141\"}.fa-ellipsis-v:before{content:\"\\f142\"}.fa-rss-square:before{content:\"\\f143\"}.fa-play-circle:before{content:\"\\f144\"}.fa-ticket:before{content:\"\\f145\"}.fa-minus-square:before{content:\"\\f146\"}.fa-minus-square-o:before{content:\"\\f147\"}.fa-level-up:before{content:\"\\f148\"}.fa-level-down:before{content:\"\\f149\"}.fa-check-square:before{content:\"\\f14a\"}.fa-pencil-square:before{content:\"\\f14b\"}.fa-external-link-square:before{content:\"\\f14c\"}.fa-share-square:before{content:\"\\f14d\"}.fa-compass:before{content:\"\\f14e\"}.fa-toggle-down:before,.fa-caret-square-o-down:before{content:\"\\f150\"}.fa-toggle-up:before,.fa-caret-square-o-up:before{content:\"\\f151\"}.fa-toggle-right:before,.fa-caret-square-o-right:before{content:\"\\f152\"}.fa-euro:before,.fa-eur:before{content:\"\\f153\"}.fa-gbp:before{content:\"\\f154\"}.fa-dollar:before,.fa-usd:before{content:\"\\f155\"}.fa-rupee:before,.fa-inr:before{content:\"\\f156\"}.fa-cny:before,.fa-rmb:before,.fa-yen:before,.fa-jpy:before{content:\"\\f157\"}.fa-ruble:before,.fa-rouble:before,.fa-rub:before{content:\"\\f158\"}.fa-won:before,.fa-krw:before{content:\"\\f159\"}.fa-bitcoin:before,.fa-btc:before{content:\"\\f15a\"}.fa-file:before{content:\"\\f15b\"}.fa-file-text:before{content:\"\\f15c\"}.fa-sort-alpha-asc:before{content:\"\\f15d\"}.fa-sort-alpha-desc:before{content:\"\\f15e\"}.fa-sort-amount-asc:before{content:\"\\f160\"}.fa-sort-amount-desc:before{content:\"\\f161\"}.fa-sort-numeric-asc:before{content:\"\\f162\"}.fa-sort-numeric-desc:before{content:\"\\f163\"}.fa-thumbs-up:before{content:\"\\f164\"}.fa-thumbs-down:before{content:\"\\f165\"}.fa-youtube-square:before{content:\"\\f166\"}.fa-youtube:before{content:\"\\f167\"}.fa-xing:before{content:\"\\f168\"}.fa-xing-square:before{content:\"\\f169\"}.fa-youtube-play:before{content:\"\\f16a\"}.fa-dropbox:before{content:\"\\f16b\"}.fa-stack-overflow:before{content:\"\\f16c\"}.fa-instagram:before{content:\"\\f16d\"}.fa-flickr:before{content:\"\\f16e\"}.fa-adn:before{content:\"\\f170\"}.fa-bitbucket:before{content:\"\\f171\"}.fa-bitbucket-square:before{content:\"\\f172\"}.fa-tumblr:before{content:\"\\f173\"}.fa-tumblr-square:before{content:\"\\f174\"}.fa-long-arrow-down:before{content:\"\\f175\"}.fa-long-arrow-up:before{content:\"\\f176\"}.fa-long-arrow-left:before{content:\"\\f177\"}.fa-long-arrow-right:before{content:\"\\f178\"}.fa-apple:before{content:\"\\f179\"}.fa-windows:before{content:\"\\f17a\"}.fa-android:before{content:\"\\f17b\"}.fa-linux:before{content:\"\\f17c\"}.fa-dribbble:before{content:\"\\f17d\"}.fa-skype:before{content:\"\\f17e\"}.fa-foursquare:before{content:\"\\f180\"}.fa-trello:before{content:\"\\f181\"}.fa-female:before{content:\"\\f182\"}.fa-male:before{content:\"\\f183\"}.fa-gittip:before,.fa-gratipay:before{content:\"\\f184\"}.fa-sun-o:before{content:\"\\f185\"}.fa-moon-o:before{content:\"\\f186\"}.fa-archive:before{content:\"\\f187\"}.fa-bug:before{content:\"\\f188\"}.fa-vk:before{content:\"\\f189\"}.fa-weibo:before{content:\"\\f18a\"}.fa-renren:before{content:\"\\f18b\"}.fa-pagelines:before{content:\"\\f18c\"}.fa-stack-exchange:before{content:\"\\f18d\"}.fa-arrow-circle-o-right:before{content:\"\\f18e\"}.fa-arrow-circle-o-left:before{content:\"\\f190\"}.fa-toggle-left:before,.fa-caret-square-o-left:before{content:\"\\f191\"}.fa-dot-circle-o:before{content:\"\\f192\"}.fa-wheelchair:before{content:\"\\f193\"}.fa-vimeo-square:before{content:\"\\f194\"}.fa-turkish-lira:before,.fa-try:before{content:\"\\f195\"}.fa-plus-square-o:before{content:\"\\f196\"}.fa-space-shuttle:before{content:\"\\f197\"}.fa-slack:before{content:\"\\f198\"}.fa-envelope-square:before{content:\"\\f199\"}.fa-wordpress:before{content:\"\\f19a\"}.fa-openid:before{content:\"\\f19b\"}.fa-institution:before,.fa-bank:before,.fa-university:before{content:\"\\f19c\"}.fa-mortar-board:before,.fa-graduation-cap:before{content:\"\\f19d\"}.fa-yahoo:before{content:\"\\f19e\"}.fa-google:before{content:\"\\f1a0\"}.fa-reddit:before{content:\"\\f1a1\"}.fa-reddit-square:before{content:\"\\f1a2\"}.fa-stumbleupon-circle:before{content:\"\\f1a3\"}.fa-stumbleupon:before{content:\"\\f1a4\"}.fa-delicious:before{content:\"\\f1a5\"}.fa-digg:before{content:\"\\f1a6\"}.fa-pied-piper-pp:before{content:\"\\f1a7\"}.fa-pied-piper-alt:before{content:\"\\f1a8\"}.fa-drupal:before{content:\"\\f1a9\"}.fa-joomla:before{content:\"\\f1aa\"}.fa-language:before{content:\"\\f1ab\"}.fa-fax:before{content:\"\\f1ac\"}.fa-building:before{content:\"\\f1ad\"}.fa-child:before{content:\"\\f1ae\"}.fa-paw:before{content:\"\\f1b0\"}.fa-spoon:before{content:\"\\f1b1\"}.fa-cube:before{content:\"\\f1b2\"}.fa-cubes:before{content:\"\\f1b3\"}.fa-behance:before{content:\"\\f1b4\"}.fa-behance-square:before{content:\"\\f1b5\"}.fa-steam:before{content:\"\\f1b6\"}.fa-steam-square:before{content:\"\\f1b7\"}.fa-recycle:before{content:\"\\f1b8\"}.fa-automobile:before,.fa-car:before{content:\"\\f1b9\"}.fa-cab:before,.fa-taxi:before{content:\"\\f1ba\"}.fa-tree:before{content:\"\\f1bb\"}.fa-spotify:before{content:\"\\f1bc\"}.fa-deviantart:before{content:\"\\f1bd\"}.fa-soundcloud:before{content:\"\\f1be\"}.fa-database:before{content:\"\\f1c0\"}.fa-file-pdf-o:before{content:\"\\f1c1\"}.fa-file-word-o:before{content:\"\\f1c2\"}.fa-file-excel-o:before{content:\"\\f1c3\"}.fa-file-powerpoint-o:before{content:\"\\f1c4\"}.fa-file-photo-o:before,.fa-file-picture-o:before,.fa-file-image-o:before{content:\"\\f1c5\"}.fa-file-zip-o:before,.fa-file-archive-o:before{content:\"\\f1c6\"}.fa-file-sound-o:before,.fa-file-audio-o:before{content:\"\\f1c7\"}.fa-file-movie-o:before,.fa-file-video-o:before{content:\"\\f1c8\"}.fa-file-code-o:before{content:\"\\f1c9\"}.fa-vine:before{content:\"\\f1ca\"}.fa-codepen:before{content:\"\\f1cb\"}.fa-jsfiddle:before{content:\"\\f1cc\"}.fa-life-bouy:before,.fa-life-buoy:before,.fa-life-saver:before,.fa-support:before,.fa-life-ring:before{content:\"\\f1cd\"}.fa-circle-o-notch:before{content:\"\\f1ce\"}.fa-ra:before,.fa-resistance:before,.fa-rebel:before{content:\"\\f1d0\"}.fa-ge:before,.fa-empire:before{content:\"\\f1d1\"}.fa-git-square:before{content:\"\\f1d2\"}.fa-git:before{content:\"\\f1d3\"}.fa-y-combinator-square:before,.fa-yc-square:before,.fa-hacker-news:before{content:\"\\f1d4\"}.fa-tencent-weibo:before{content:\"\\f1d5\"}.fa-qq:before{content:\"\\f1d6\"}.fa-wechat:before,.fa-weixin:before{content:\"\\f1d7\"}.fa-send:before,.fa-paper-plane:before{content:\"\\f1d8\"}.fa-send-o:before,.fa-paper-plane-o:before{content:\"\\f1d9\"}.fa-history:before{content:\"\\f1da\"}.fa-circle-thin:before{content:\"\\f1db\"}.fa-header:before{content:\"\\f1dc\"}.fa-paragraph:before{content:\"\\f1dd\"}.fa-sliders:before{content:\"\\f1de\"}.fa-share-alt:before{content:\"\\f1e0\"}.fa-share-alt-square:before{content:\"\\f1e1\"}.fa-bomb:before{content:\"\\f1e2\"}.fa-soccer-ball-o:before,.fa-futbol-o:before{content:\"\\f1e3\"}.fa-tty:before{content:\"\\f1e4\"}.fa-binoculars:before{content:\"\\f1e5\"}.fa-plug:before{content:\"\\f1e6\"}.fa-slideshare:before{content:\"\\f1e7\"}.fa-twitch:before{content:\"\\f1e8\"}.fa-yelp:before{content:\"\\f1e9\"}.fa-newspaper-o:before{content:\"\\f1ea\"}.fa-wifi:before{content:\"\\f1eb\"}.fa-calculator:before{content:\"\\f1ec\"}.fa-paypal:before{content:\"\\f1ed\"}.fa-google-wallet:before{content:\"\\f1ee\"}.fa-cc-visa:before{content:\"\\f1f0\"}.fa-cc-mastercard:before{content:\"\\f1f1\"}.fa-cc-discover:before{content:\"\\f1f2\"}.fa-cc-amex:before{content:\"\\f1f3\"}.fa-cc-paypal:before{content:\"\\f1f4\"}.fa-cc-stripe:before{content:\"\\f1f5\"}.fa-bell-slash:before{content:\"\\f1f6\"}.fa-bell-slash-o:before{content:\"\\f1f7\"}.fa-trash:before{content:\"\\f1f8\"}.fa-copyright:before{content:\"\\f1f9\"}.fa-at:before{content:\"\\f1fa\"}.fa-eyedropper:before{content:\"\\f1fb\"}.fa-paint-brush:before{content:\"\\f1fc\"}.fa-birthday-cake:before{content:\"\\f1fd\"}.fa-area-chart:before{content:\"\\f1fe\"}.fa-pie-chart:before{content:\"\\f200\"}.fa-line-chart:before{content:\"\\f201\"}.fa-lastfm:before{content:\"\\f202\"}.fa-lastfm-square:before{content:\"\\f203\"}.fa-toggle-off:before{content:\"\\f204\"}.fa-toggle-on:before{content:\"\\f205\"}.fa-bicycle:before{content:\"\\f206\"}.fa-bus:before{content:\"\\f207\"}.fa-ioxhost:before{content:\"\\f208\"}.fa-angellist:before{content:\"\\f209\"}.fa-cc:before{content:\"\\f20a\"}.fa-shekel:before,.fa-sheqel:before,.fa-ils:before{content:\"\\f20b\"}.fa-meanpath:before{content:\"\\f20c\"}.fa-buysellads:before{content:\"\\f20d\"}.fa-connectdevelop:before{content:\"\\f20e\"}.fa-dashcube:before{content:\"\\f210\"}.fa-forumbee:before{content:\"\\f211\"}.fa-leanpub:before{content:\"\\f212\"}.fa-sellsy:before{content:\"\\f213\"}.fa-shirtsinbulk:before{content:\"\\f214\"}.fa-simplybuilt:before{content:\"\\f215\"}.fa-skyatlas:before{content:\"\\f216\"}.fa-cart-plus:before{content:\"\\f217\"}.fa-cart-arrow-down:before{content:\"\\f218\"}.fa-diamond:before{content:\"\\f219\"}.fa-ship:before{content:\"\\f21a\"}.fa-user-secret:before{content:\"\\f21b\"}.fa-motorcycle:before{content:\"\\f21c\"}.fa-street-view:before{content:\"\\f21d\"}.fa-heartbeat:before{content:\"\\f21e\"}.fa-venus:before{content:\"\\f221\"}.fa-mars:before{content:\"\\f222\"}.fa-mercury:before{content:\"\\f223\"}.fa-intersex:before,.fa-transgender:before{content:\"\\f224\"}.fa-transgender-alt:before{content:\"\\f225\"}.fa-venus-double:before{content:\"\\f226\"}.fa-mars-double:before{content:\"\\f227\"}.fa-venus-mars:before{content:\"\\f228\"}.fa-mars-stroke:before{content:\"\\f229\"}.fa-mars-stroke-v:before{content:\"\\f22a\"}.fa-mars-stroke-h:before{content:\"\\f22b\"}.fa-neuter:before{content:\"\\f22c\"}.fa-genderless:before{content:\"\\f22d\"}.fa-facebook-official:before{content:\"\\f230\"}.fa-pinterest-p:before{content:\"\\f231\"}.fa-whatsapp:before{content:\"\\f232\"}.fa-server:before{content:\"\\f233\"}.fa-user-plus:before{content:\"\\f234\"}.fa-user-times:before{content:\"\\f235\"}.fa-hotel:before,.fa-bed:before{content:\"\\f236\"}.fa-viacoin:before{content:\"\\f237\"}.fa-train:before{content:\"\\f238\"}.fa-subway:before{content:\"\\f239\"}.fa-medium:before{content:\"\\f23a\"}.fa-yc:before,.fa-y-combinator:before{content:\"\\f23b\"}.fa-optin-monster:before{content:\"\\f23c\"}.fa-opencart:before{content:\"\\f23d\"}.fa-expeditedssl:before{content:\"\\f23e\"}.fa-battery-4:before,.fa-battery:before,.fa-battery-full:before{content:\"\\f240\"}.fa-battery-3:before,.fa-battery-three-quarters:before{content:\"\\f241\"}.fa-battery-2:before,.fa-battery-half:before{content:\"\\f242\"}.fa-battery-1:before,.fa-battery-quarter:before{content:\"\\f243\"}.fa-battery-0:before,.fa-battery-empty:before{content:\"\\f244\"}.fa-mouse-pointer:before{content:\"\\f245\"}.fa-i-cursor:before{content:\"\\f246\"}.fa-object-group:before{content:\"\\f247\"}.fa-object-ungroup:before{content:\"\\f248\"}.fa-sticky-note:before{content:\"\\f249\"}.fa-sticky-note-o:before{content:\"\\f24a\"}.fa-cc-jcb:before{content:\"\\f24b\"}.fa-cc-diners-club:before{content:\"\\f24c\"}.fa-clone:before{content:\"\\f24d\"}.fa-balance-scale:before{content:\"\\f24e\"}.fa-hourglass-o:before{content:\"\\f250\"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:\"\\f251\"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:\"\\f252\"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:\"\\f253\"}.fa-hourglass:before{content:\"\\f254\"}.fa-hand-grab-o:before,.fa-hand-rock-o:before{content:\"\\f255\"}.fa-hand-stop-o:before,.fa-hand-paper-o:before{content:\"\\f256\"}.fa-hand-scissors-o:before{content:\"\\f257\"}.fa-hand-lizard-o:before{content:\"\\f258\"}.fa-hand-spock-o:before{content:\"\\f259\"}.fa-hand-pointer-o:before{content:\"\\f25a\"}.fa-hand-peace-o:before{content:\"\\f25b\"}.fa-trademark:before{content:\"\\f25c\"}.fa-registered:before{content:\"\\f25d\"}.fa-creative-commons:before{content:\"\\f25e\"}.fa-gg:before{content:\"\\f260\"}.fa-gg-circle:before{content:\"\\f261\"}.fa-tripadvisor:before{content:\"\\f262\"}.fa-odnoklassniki:before{content:\"\\f263\"}.fa-odnoklassniki-square:before{content:\"\\f264\"}.fa-get-pocket:before{content:\"\\f265\"}.fa-wikipedia-w:before{content:\"\\f266\"}.fa-safari:before{content:\"\\f267\"}.fa-chrome:before{content:\"\\f268\"}.fa-firefox:before{content:\"\\f269\"}.fa-opera:before{content:\"\\f26a\"}.fa-internet-explorer:before{content:\"\\f26b\"}.fa-tv:before,.fa-television:before{content:\"\\f26c\"}.fa-contao:before{content:\"\\f26d\"}.fa-500px:before{content:\"\\f26e\"}.fa-amazon:before{content:\"\\f270\"}.fa-calendar-plus-o:before{content:\"\\f271\"}.fa-calendar-minus-o:before{content:\"\\f272\"}.fa-calendar-times-o:before{content:\"\\f273\"}.fa-calendar-check-o:before{content:\"\\f274\"}.fa-industry:before{content:\"\\f275\"}.fa-map-pin:before{content:\"\\f276\"}.fa-map-signs:before{content:\"\\f277\"}.fa-map-o:before{content:\"\\f278\"}.fa-map:before{content:\"\\f279\"}.fa-commenting:before{content:\"\\f27a\"}.fa-commenting-o:before{content:\"\\f27b\"}.fa-houzz:before{content:\"\\f27c\"}.fa-vimeo:before{content:\"\\f27d\"}.fa-black-tie:before{content:\"\\f27e\"}.fa-fonticons:before{content:\"\\f280\"}.fa-reddit-alien:before{content:\"\\f281\"}.fa-edge:before{content:\"\\f282\"}.fa-credit-card-alt:before{content:\"\\f283\"}.fa-codiepie:before{content:\"\\f284\"}.fa-modx:before{content:\"\\f285\"}.fa-fort-awesome:before{content:\"\\f286\"}.fa-usb:before{content:\"\\f287\"}.fa-product-hunt:before{content:\"\\f288\"}.fa-mixcloud:before{content:\"\\f289\"}.fa-scribd:before{content:\"\\f28a\"}.fa-pause-circle:before{content:\"\\f28b\"}.fa-pause-circle-o:before{content:\"\\f28c\"}.fa-stop-circle:before{content:\"\\f28d\"}.fa-stop-circle-o:before{content:\"\\f28e\"}.fa-shopping-bag:before{content:\"\\f290\"}.fa-shopping-basket:before{content:\"\\f291\"}.fa-hashtag:before{content:\"\\f292\"}.fa-bluetooth:before{content:\"\\f293\"}.fa-bluetooth-b:before{content:\"\\f294\"}.fa-percent:before{content:\"\\f295\"}.fa-gitlab:before{content:\"\\f296\"}.fa-wpbeginner:before{content:\"\\f297\"}.fa-wpforms:before{content:\"\\f298\"}.fa-envira:before{content:\"\\f299\"}.fa-universal-access:before{content:\"\\f29a\"}.fa-wheelchair-alt:before{content:\"\\f29b\"}.fa-question-circle-o:before{content:\"\\f29c\"}.fa-blind:before{content:\"\\f29d\"}.fa-audio-description:before{content:\"\\f29e\"}.fa-volume-control-phone:before{content:\"\\f2a0\"}.fa-braille:before{content:\"\\f2a1\"}.fa-assistive-listening-systems:before{content:\"\\f2a2\"}.fa-asl-interpreting:before,.fa-american-sign-language-interpreting:before{content:\"\\f2a3\"}.fa-deafness:before,.fa-hard-of-hearing:before,.fa-deaf:before{content:\"\\f2a4\"}.fa-glide:before{content:\"\\f2a5\"}.fa-glide-g:before{content:\"\\f2a6\"}.fa-signing:before,.fa-sign-language:before{content:\"\\f2a7\"}.fa-low-vision:before{content:\"\\f2a8\"}.fa-viadeo:before{content:\"\\f2a9\"}.fa-viadeo-square:before{content:\"\\f2aa\"}.fa-snapchat:before{content:\"\\f2ab\"}.fa-snapchat-ghost:before{content:\"\\f2ac\"}.fa-snapchat-square:before{content:\"\\f2ad\"}.fa-pied-piper:before{content:\"\\f2ae\"}.fa-first-order:before{content:\"\\f2b0\"}.fa-yoast:before{content:\"\\f2b1\"}.fa-themeisle:before{content:\"\\f2b2\"}.fa-google-plus-circle:before,.fa-google-plus-official:before{content:\"\\f2b3\"}.fa-fa:before,.fa-font-awesome:before{content:\"\\f2b4\"}.fa-handshake-o:before{content:\"\\f2b5\"}.fa-envelope-open:before{content:\"\\f2b6\"}.fa-envelope-open-o:before{content:\"\\f2b7\"}.fa-linode:before{content:\"\\f2b8\"}.fa-address-book:before{content:\"\\f2b9\"}.fa-address-book-o:before{content:\"\\f2ba\"}.fa-vcard:before,.fa-address-card:before{content:\"\\f2bb\"}.fa-vcard-o:before,.fa-address-card-o:before{content:\"\\f2bc\"}.fa-user-circle:before{content:\"\\f2bd\"}.fa-user-circle-o:before{content:\"\\f2be\"}.fa-user-o:before{content:\"\\f2c0\"}.fa-id-badge:before{content:\"\\f2c1\"}.fa-drivers-license:before,.fa-id-card:before{content:\"\\f2c2\"}.fa-drivers-license-o:before,.fa-id-card-o:before{content:\"\\f2c3\"}.fa-quora:before{content:\"\\f2c4\"}.fa-free-code-camp:before{content:\"\\f2c5\"}.fa-telegram:before{content:\"\\f2c6\"}.fa-thermometer-4:before,.fa-thermometer:before,.fa-thermometer-full:before{content:\"\\f2c7\"}.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:\"\\f2c8\"}.fa-thermometer-2:before,.fa-thermometer-half:before{content:\"\\f2c9\"}.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:\"\\f2ca\"}.fa-thermometer-0:before,.fa-thermometer-empty:before{content:\"\\f2cb\"}.fa-shower:before{content:\"\\f2cc\"}.fa-bathtub:before,.fa-s15:before,.fa-bath:before{content:\"\\f2cd\"}.fa-podcast:before{content:\"\\f2ce\"}.fa-window-maximize:before{content:\"\\f2d0\"}.fa-window-minimize:before{content:\"\\f2d1\"}.fa-window-restore:before{content:\"\\f2d2\"}.fa-times-rectangle:before,.fa-window-close:before{content:\"\\f2d3\"}.fa-times-rectangle-o:before,.fa-window-close-o:before{content:\"\\f2d4\"}.fa-bandcamp:before{content:\"\\f2d5\"}.fa-grav:before{content:\"\\f2d6\"}.fa-etsy:before{content:\"\\f2d7\"}.fa-imdb:before{content:\"\\f2d8\"}.fa-ravelry:before{content:\"\\f2d9\"}.fa-eercast:before{content:\"\\f2da\"}.fa-microchip:before{content:\"\\f2db\"}.fa-snowflake-o:before{content:\"\\f2dc\"}.fa-superpowers:before{content:\"\\f2dd\"}.fa-wpexplorer:before{content:\"\\f2de\"}.fa-meetup:before{content:\"\\f2e0\"}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}\n"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template><div class=\"background-login\"><div class=\"logo\" style=\"\"></div><div class=\"form\" style=\"margin-top:-100px\"><div class=\"\"><div id=\"\"><h1>Welcome ${greetname}</h1><form method=\"post\" submit.delegate=\"login()\"><div class=\"field-wrap\"><label class=\"login\">Username<span class=\"req\">*</span></label><input type=\"text\" required autocomplete=\"off\" value.bind=\"user.username\" id=\"username\"></div><div class=\"field-wrap\"><label class=\"login\">Password<span class=\"req\">*</span></label><input type=\"password\" required autocomplete=\"off\" value.bind=\"user.password\"></div><p class=\"forgot\"><a href=\"#\">Administrator?</a></p><button type=\"submit\" class=\"button button-block\">Log In</form></div></div></div></div></template>"; });
define('text!admin/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\" click.delegate=\"openUserInfo()\"><img src=\"${user.pic}\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-black\"><h2 style=\"color:red;text-shadow:0 0 15px #fff\">${user.name}</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-red\"></i>${user.description}</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-red\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-red\"></i>${user.username}</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-red\"></i>1224435534</p><p><a href click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-red\"></i>Logout</a></p><hr><p class=\"w3-large display-inline\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-red\"></i> Stocks<div class=\"container tooltip\" id=\"badge\" click.delegate=\"restock()\"><a class=\"entypo-bell\"></a> <span class=\"tooltiptext\">Out of stock! Click here to view.</span></div></b></p><div style=\"overflow-y:auto;height:300px\"><div repeat.for=\"item of stocks\" if.bind=\"item.percentage != '0.00%' && item.no_of_days > 0\"><p>${item.description}</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-red\" css.bind=\"{width: item.percentage}\">${item.percentage}</div></div></div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-red\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-red\"></i>Dashboard<i>( Press F1 to go to Order Page )</i></h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-red\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-red\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-red w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p><button click.delegate=\"loadStock()\" id=\"loadStack\" style=\"visibility:hidden\"></button></footer></template>"; });
define('text!resources/css/font.css', ['module'], function(module) { module.exports = "/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 300;\n  src: local('Titillium Web Light'), local('TitilliumWeb-Light'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr9INifKjd1RJ3NxxEi9Cy2w.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 300;\n  src: local('Titillium Web Light'), local('TitilliumWeb-Light'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr4-67659ICLY8bMrYhtePPA.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v5/7XUFZ5tgS-tD6QamInJTcSo_WB_cotcEMUw1LsIE8mM.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v5/7XUFZ5tgS-tD6QamInJTcZSnX671uNZIV63UdXh3Mg0.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 600;\n  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr_SNRT0fZ5CX-AqRkMYgJJo.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 600;\n  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr46gJz9aNFrmnwBdd69aqzY.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n"; });
define('text!admin/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgPreview\" alt=\"your image\" src=\"${user.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"FileUploadImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\" disabled=\"disabled\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!resources/css/main.css', ['module'], function(module) { module.exports = "body{\r\n    /*background: url(../img/background.jpg) !important;\r\n    background-size:cover!important;\r\n    transform: scale(0.88);*/\r\n    background-color:white;\r\n}\r\n.logo{\r\n    background: url(../img/custom-logo2.png) no-repeat;\r\n    background-size: contain;\r\n    height: 170px;\r\n    margin: 0 auto;\r\n    width: 200px\r\n}\r\n.background-login{\r\n    background: url(../img/peanut.png) !important;\r\n    background-size:cover!important;\r\n    height: 100vh;\r\n}\r\n.button-none{\r\n    background: none;\r\n    border: none;\r\n    cursor:pointer;\r\n}\r\n.frame-limit-50{\r\n    overflow-y: auto;\r\n    height: 50vh;\r\n}\r\n#ui-id-1{\r\n    background-color:white!important;\r\n    border:1px solid gray;\r\n    position:fixed!important;\r\n    list-style-type: none!important;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n#ui-id-1 li:hover{\r\n    background-color:gray!important;\r\n}\r\n.ui-helper-hidden-accessible{\r\n    display:none!important;\r\n}\r\n#notificationbar {\r\n    position: fixed;\r\n    z-index: 101;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    background: rgba(0, 0, 0, 0.8);\r\n    color:white;\r\n    text-align: center;\r\n    line-height: 3.5;\r\n    overflow: hidden; \r\n    box-shadow: 0 0 5px black;\r\n    display:none;\r\n}\r\n@keyframes slideDownNotification {\r\n    0%, 100% { transform: translateY(-60px); }\r\n    10%, 90% { transform: translateY(0px); }\r\n}\r\n.show{\r\n    display:block!important;\r\n    transform: translateY(-60px)!important;\r\n    animation: slideDownNotification 5.5s 0s 1 ease forwards;\r\n}\r\n.display-inline{\r\n    display: inline;\r\n}\r\n/* tooltip css */\r\n.tooltip {\r\n    position: relative;\r\n    display: inline-block;\r\n}\r\n\r\n.tooltip .tooltiptext {\r\n    visibility: hidden;\r\n    width: 120px;\r\n    background-color: black;\r\n    color: #fff;\r\n    text-align: center;\r\n    border-radius: 6px;\r\n    padding: 5px 0;\r\n    \r\n    /* Position the tooltip */\r\n    position: absolute;\r\n    z-index: 1;\r\n    top: -5px;\r\n    left: 105%;\r\n    font-size: 12px;\r\n}\r\n\r\n.tooltip .tooltiptext::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    top: 35%;\r\n    left: -8.5%;\r\n    border-width: 5px;\r\n    border-style: solid;\r\n    border-color:  transparent #555 transparent transparent;\r\n}\r\n\r\n.tooltip:hover .tooltiptext {\r\n    visibility: visible;\r\n    opacity: 1;\r\n}\r\n\r\n/* badge animation css */\r\n#badge{\r\n    display: inline-block;\r\n    cursor: pointer;\r\n}\r\n.badge-num {\r\n    box-sizing:border-box;\r\n    font-family: 'Trebuchet MS', sans-serif;\r\n    background: #ff0000;\r\n    cursor:default;\r\n    border-radius: 50%;\r\n    color: #fff;\r\n    font-weight:bold;\r\n    font-size: 1rem;\r\n    height: 2rem;\r\n    letter-spacing:-.1rem;\r\n    line-height:1.55;\r\n    margin-top:-1rem;\r\n    margin-left:.1rem;\r\n    border:.2rem solid #fff;\r\n    text-align: center;\r\n    display:inline-block;\r\n    width: 2rem;\r\n    box-shadow: 1px 1px 5px rgba(0,0,0, .2);\r\n    animation: pulse 1.5s 1;\r\n  }\r\n  .badge-num:after {\r\n    content: '';\r\n    position: absolute;\r\n    top:-.1rem;\r\n    left:-.1rem;\r\n    border:2px solid rgba(255,0,0,.5);\r\n    opacity:0;\r\n    border-radius: 50%;\r\n    width:100%;\r\n    height:100%;\r\n    animation: sonar 1.5s 1;\r\n  }\r\n  @keyframes sonar { \r\n    0% {transform: scale(.9); opacity:1;}\r\n    100% {transform: scale(2);opacity: 0;}\r\n  }\r\n  @keyframes pulse {\r\n    0% {transform: scale(1);}\r\n    20% {transform: scale(1.4); } \r\n    50% {transform: scale(.9);} \r\n    80% {transform: scale(1.2);} \r\n    100% {transform: scale(1);}\r\n  }\r\n  \r\n  \r\n/* reports css */\r\n@media print {\r\n    .report-page {page-break-after: always;}\r\n    .report-button{display: none;}\r\n}\r\n.report-month {\r\n    width: 100%;\r\n    max-width: 1200px;\r\n    margin: 0 auto;\r\n    height: 610px;\r\n}\r\n\r\n.report-month>thead.report-header {\r\n    text-align: center;\r\n}\r\n\r\n.report-month>tbody td {\r\n    border: 1px solid;\r\n    height: 50px;\r\n    padding: 10px;\r\n    width: 100px;\r\n}\r\n.report-normal {\r\n    width: 100%;\r\n    max-width: 1200px;\r\n    margin: 0 auto;\r\n}\r\n.report-normal>tbody td {\r\n    border: 1px solid;\r\n    height: 50px;\r\n    padding: 10px;\r\n    width: 100px;\r\n}"; });
define('text!resources/css/normalize.min.css', ['module'], function(module) { module.exports = "button,hr,input{overflow:visible}audio,canvas,progress,video{display:inline-block}progress,sub,sup{vertical-align:baseline}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0} menu,article,aside,details,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{}button,select{text-transform:none}[type=submit], [type=reset],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}/*# sourceMappingURL=normalize.min.css.map */"; });
define('text!employee/add.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"register()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.username\"></p><label class=\"w3-text-red\">Password</label><input class=\"w3-input w3-text-red\" type=\"password\" value.bind=\"user.password\"><p></p><label class=\"w3-text-red\">Re-type Password</label><input class=\"w3-input w3-text-red\" type=\"password\" value.bind=\"password\"><p></p><p><select class=\"w3-input w3-text-red\" value.bind=\"user.type\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Register</button></form></div></template>"; });
define('text!resources/css/roboto.css', ['module'], function(module) { module.exports = "/* cyrillic-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/ek4gzZ-GeXAPcSbHtCeQI_esZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+20B4, U+2DE0-2DFF, U+A640-A69F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/mErvLBYg_cXG3rLvUsKT_fesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/-2n2p-_Y08sg57CNWQfKNvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/u0TOpm082MNkS5K0Q4rhqvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0370-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/NdF9MtnOpLzo-noMoG0miPesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/CWB0XYA8bzo0kSThX0UTuA.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n"; });
define('text!employee/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\" click.delegate=\"openUserInfo()\"><img src=\"${user.pic}\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-pink\"><h2 style=\"text-shadow:0 0 15px #fff\">${user.name}</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.description}</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-pink\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.username}</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-pink\"></i>1224435534</p><p><a href click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-pink\"></i>Logout</a></p><hr><p class=\"w3-large\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-pink\"></i>Stocks</b></p><div style=\"overflow-y:auto;height:300px\"><div repeat.for=\"item of stocks\"><p>${item.description}</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" css.bind=\"{width: item.percentage}\">${item.percentage}</div></div></div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>Dashboard</h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-pink\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-pink\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-pink w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p></footer></template>"; });
define('text!resources/css/style.css', ['module'], function(module) { module.exports = "*, *:before, *:after {\n  box-sizing: border-box;\n}\n\nhtml {\n  overflow-y: scroll;\n}\n\nbody {\n  background: #c1bdba;\n  font-family: 'Titillium Web', sans-serif!important;\n}\n\na {\n  text-decoration: none;\n  color: rgba(219,42,44,1);\n  -webkit-transition: .5s ease;\n  transition: .5s ease;\n}\na:hover {\n  color: rgba(181,30,30,1);\n}\n\n.form {\n  background: rgba(19, 35, 47, 0.9);\n  padding: 40px;\n  max-width: 600px;\n  margin: 40px auto;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.3);\n  border: 4px solid rgba(220,42,43,1)!important;\n}\n\n.tab-group {\n  list-style: none;\n  padding: 0;\n  margin: 0 0 40px 0;\n}\n.tab-group:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.tab-group li a {\n  display: block;\n  text-decoration: none;\n  padding: 15px;\n  background: rgba(160, 179, 176, 0.25);\n  color: #a0b3b0;\n  font-size: 20px;\n  float: left;\n  width: 50%;\n  text-align: center;\n  cursor: pointer;\n  -webkit-transition: .5s ease;\n  transition: .5s ease;\n}\n.tab-group li a:hover {\n  background: rgba(219,42,44,1);;\n  color: #ffffff;\n}\n.tab-group .active a {\n  background: rgba(219,42,44,1);;\n  color: #ffffff;\n}\n\n.tab-content > div:last-child {\n  display: none;\n}\n\nh1 {\n  text-align: center;\n  color: #ffffff;\n  font-weight: 300;\n  margin: 0 0 40px;\n}\n\nlabel.login {\n  position: absolute;\n  -webkit-transform: translateY(6px);\n          transform: translateY(6px);\n  left: 13px;\n  color: rgba(255, 255, 255, 0.5);\n  -webkit-transition: all 0.25s ease;\n  transition: all 0.25s ease;\n  -webkit-backface-visibility: hidden;\n  pointer-events: none;\n  font-size: 22px;\n}\nlabel.login .req {\n  margin: 2px;\n  color: red;\n}\n\nlabel.login.active {\n  -webkit-transform: translateY(50px);\n          transform: translateY(50px);\n  left: 2px;\n  font-size: 14px;\n}\nlabel.login.active .req {\n  opacity: 0;\n}\n\nlabel.login.highlight {\n  color: #ffffff;\n}\n\ninput, textarea {\n  font-size: 22px;\n  display: block;\n  width: 100%;\n  height: 100%;\n  padding: 5px 10px;\n  background: none;\n  background-image: none;\n  border: 1px solid #a0b3b0;\n  color: #ffffff;\n  border-radius: 0;\n  -webkit-transition: border-color .25s ease, box-shadow .25s ease;\n  transition: border-color .25s ease, box-shadow .25s ease;\n}\ninput:focus, textarea:focus {\n  outline: 0;\n  border-color: rgba(219,42,44,1);;\n}\n\ntextarea {\n  border: 2px solid #a0b3b0;\n  resize: vertical;\n}\n\n.field-wrap {\n  position: relative;\n  margin-bottom: 40px;\n}\n\n.top-row:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.top-row > div {\n  float: left;\n  width: 48%;\n  margin-right: 4%;\n}\n.top-row > div:last-child {\n  margin: 0;\n}\n\n.button {\n  border: 0;\n  outline: none;\n  border-radius: 0;\n  padding: 15px 0;\n  font-size: 1.6rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: .1em;\n  background: rgba(219,42,44,1);\n  color: #ffffff;\n  -webkit-transition: all 0.5s ease;\n  transition: all 0.5s ease;\n  -webkit-appearance: none;\n}\n.button:hover, .button:focus {\n  background: rgba(181,30,30,1);\n}\n\n.button-block {\n  display: block;\n  width: 100%;\n}\n\n.forgot {\n  margin-top: -20px;\n  text-align: right;\n}\n"; });
define('text!employee/edit.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\" disabled=\"disabled\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\" disabled=\"disabled\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\" disabled=\"disabled\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!resources/css/w3.css', ['module'], function(module) { module.exports = "/* W3.CSS 4.04 Apr 2017 by Jan Egil and Borge Refsnes */\r\nhtml{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}\r\n/* Extract from normalize.css by Nicolas Gallagher and Jonathan Neal git.io/normalize */\r\nhtml{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}\r\narticle,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}\r\naudio,canvas,progress,video{display:inline-block}progress{vertical-align:baseline}\r\naudio:not([controls]){display:none;height:0}[hidden],template{display:none}\r\na{background-color:transparent;-webkit-text-decoration-skip:objects}\r\na:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}\r\ndfn{font-style:italic}mark{background:#ff0;color:#000}\r\nsmall{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}\r\nsub{bottom:-0.25em}sup{top:-0.5em}figure{margin:1em 40px}img{border-style:none}svg:not(:root){overflow:hidden}\r\ncode,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}hr{box-sizing:content-box;height:0;overflow:visible}\r\nbutton,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:bold}\r\nbutton,input{overflow:visible}button,select{text-transform:none}\r\nbutton,html [type=button],[type=reset],[type=submit]{-webkit-appearance:button}\r\nbutton::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner{border-style:none;padding:0}\r\nbutton:-moz-focusring, [type=button]:-moz-focusring, [type=reset]:-moz-focusring, [type=submit]:-moz-focusring{outline:1px dotted ButtonText}\r\nfieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}\r\nlegend{color:inherit;display:table;max-width:100%;padding:0;white-space:normal}textarea{overflow:auto}\r\n[type=checkbox],[type=radio]{padding:0}\r\n[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}\r\n[type=search]{-webkit-appearance:textfield;outline-offset:-2px}\r\n[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}\r\n::-webkit-input-placeholder{color:inherit;opacity:0.54}\r\n::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}\r\n/* End extract */\r\nhtml,body{font-family:Verdana,sans-serif;font-size:15px;line-height:1.5}html{overflow-x:hidden}\r\nh1{font-size:36px}h2{font-size:30px}h3{font-size:24px}h4{font-size:20px}h5{font-size:18px}h6{font-size:16px}.w3-serif{font-family:serif}\r\nh1,h2,h3,h4,h5,h6{font-family:\"Segoe UI\",Arial,sans-serif;font-weight:400;margin:10px 0}.w3-wide{letter-spacing:4px}\r\nhr{border:0;border-top:1px solid #eee;margin:20px 0}\r\n.w3-image{max-width:100%;height:auto}img{margin-bottom:-5px}a{color:inherit}\r\n.w3-table,.w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table}.w3-table-all{border:1px solid #ccc}\r\n.w3-bordered tr,.w3-table-all tr{border-bottom:1px solid #ddd}.w3-striped tbody tr:nth-child(even){background-color:#f1f1f1}\r\n.w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\r\n.w3-hoverable tbody tr:hover,.w3-ul.w3-hoverable li:hover{background-color:#ccc}.w3-centered tr th,.w3-centered tr td{text-align:center}\r\n.w3-table td,.w3-table th,.w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\r\n.w3-table th:first-child,.w3-table td:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\r\n.w3-btn,.w3-button{border:none;display:inline-block;outline:0;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap}\r\n.w3-btn:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)}\r\n.w3-btn,.w3-button{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}   \r\n.w3-disabled,.w3-btn:disabled,.w3-button:disabled{cursor:not-allowed;opacity:0.3}.w3-disabled *,:disabled *{pointer-events:none}\r\n.w3-btn.w3-disabled:hover,.w3-btn:disabled:hover{box-shadow:none}\r\n.w3-badge,.w3-tag{background-color:#000;color:#fff;display:inline-block;padding-left:8px;padding-right:8px;text-align:center}.w3-badge{border-radius:50%}\r\n.w3-ul{list-style-type:none;padding:0;margin:0}.w3-ul li{padding:8px 16px;border-bottom:1px solid #ddd}.w3-ul li:last-child{border-bottom:none}\r\n.w3-tooltip,.w3-display-container{position:relative}.w3-tooltip .w3-text{display:none}.w3-tooltip:hover .w3-text{display:inline-block}\r\n.w3-ripple:active{opacity:0.5}.w3-ripple{transition:opacity 0s}\r\n.w3-input{padding:8px;display:block;border:none;border-bottom:1px solid #ccc;width:100%}\r\n.w3-select{padding:9px 0;width:100%;border:none;border-bottom:1px solid #ccc}\r\n.w3-dropdown-click,.w3-dropdown-hover{position:relative;display:inline-block;cursor:pointer}\r\n.w3-dropdown-hover:hover .w3-dropdown-content{display:block;z-index:1}\r\n.w3-dropdown-hover:first-child,.w3-dropdown-click:hover{background-color:#ccc;color:#000}\r\n.w3-dropdown-hover:hover > .w3-button:first-child,.w3-dropdown-click:hover > .w3-button:first-child{background-color:#ccc;color:#000}\r\n.w3-dropdown-content{cursor:auto;color:#000;background-color:#fff;display:none;position:absolute;min-width:160px;margin:0;padding:0}\r\n.w3-check,.w3-radio{width:24px;height:24px;position:relative;top:6px}\r\n.w3-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:1;overflow:auto}\r\n.w3-bar-block .w3-dropdown-hover,.w3-bar-block .w3-dropdown-click{width:100%}\r\n.w3-bar-block .w3-dropdown-hover .w3-dropdown-content,.w3-bar-block .w3-dropdown-click .w3-dropdown-content{min-width:100%}\r\n.w3-bar-block .w3-dropdown-hover .w3-button,.w3-bar-block .w3-dropdown-click .w3-button{width:100%;text-align:left;padding:8px 16px}\r\n.w3-main,#main{transition:margin-left .4s}\r\n.w3-modal{z-index:3;display:none;padding-top:100px;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4)}\r\n.w3-modal-content{margin:auto;background-color:#fff;position:relative;padding:0;outline:0;width:600px}\r\n.w3-bar{width:100%;overflow:hidden}.w3-center .w3-bar{display:inline-block;width:auto}\r\n.w3-bar .w3-bar-item{padding:8px 16px;float:left;width:auto;border:none;outline:none;display:block}\r\n.w3-bar .w3-dropdown-hover,.w3-bar .w3-dropdown-click{position:static;float:left}\r\n.w3-bar .w3-button{white-space:normal}\r\n.w3-bar-block .w3-bar-item{width:100%;display:block;padding:8px 16px;text-align:left;border:none;outline:none;white-space:normal;float:none}\r\n.w3-bar-block.w3-center .w3-bar-item{text-align:center}.w3-block{display:block;width:100%}\r\n.w3-responsive{overflow-x:auto}\r\n.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before,\r\n.w3-cell-row:before,.w3-cell-row:after,.w3-clear:after,.w3-clear:before,.w3-bar:before,.w3-bar:after{content:\"\";display:table;clear:both}\r\n.w3-col,.w3-half,.w3-third,.w3-twothird,.w3-threequarter,.w3-quarter{float:left;width:100%}\r\n.w3-col.s1{width:8.33333%}.w3-col.s2{width:16.66666%}.w3-col.s3{width:24.99999%}.w3-col.s4{width:33.33333%}\r\n.w3-col.s5{width:41.66666%}.w3-col.s6{width:49.99999%}.w3-col.s7{width:58.33333%}.w3-col.s8{width:66.66666%}\r\n.w3-col.s9{width:74.99999%}.w3-col.s10{width:83.33333%}.w3-col.s11{width:91.66666%}.w3-col.s12{width:99.99999%}\r\n@media (min-width:601px){.w3-col.m1{width:8.33333%}.w3-col.m2{width:16.66666%}.w3-col.m3,.w3-quarter{width:24.99999%}.w3-col.m4,.w3-third{width:33.33333%}\r\n.w3-col.m5{width:41.66666%}.w3-col.m6,.w3-half{width:49.99999%}.w3-col.m7{width:58.33333%}.w3-col.m8,.w3-twothird{width:66.66666%}\r\n.w3-col.m9,.w3-threequarter{width:74.99999%}.w3-col.m10{width:83.33333%}.w3-col.m11{width:91.66666%}.w3-col.m12{width:99.99999%}}\r\n@media (min-width:993px){.w3-col.l1{width:8.33333%}.w3-col.l2{width:16.66666%}.w3-col.l3{width:24.99999%}.w3-col.l4{width:33.33333%}\r\n.w3-col.l5{width:41.66666%}.w3-col.l6{width:49.99999%}.w3-col.l7{width:58.33333%}.w3-col.l8{width:66.66666%}\r\n.w3-col.l9{width:74.99999%}.w3-col.l10{width:83.33333%}.w3-col.l11{width:91.66666%}.w3-col.l12{width:99.99999%}}\r\n.w3-content{max-width:980px;margin:auto}.w3-rest{overflow:hidden}\r\n.w3-cell-row{display:table;width:100%}.w3-cell{display:table-cell}\r\n.w3-cell-top{vertical-align:top}.w3-cell-middle{vertical-align:middle}.w3-cell-bottom{vertical-align:bottom}\r\n.w3-hide{display:none!important}.w3-show-block,.w3-show{display:block!important}.w3-show-inline-block{display:inline-block!important}\r\n@media (max-width:600px){.w3-modal-content{margin:0 10px;width:auto!important}.w3-modal{padding-top:30px}\r\n.w3-dropdown-hover.w3-mobile .w3-dropdown-content,.w3-dropdown-click.w3-mobile .w3-dropdown-content{position:relative}\t\r\n.w3-hide-small{display:none!important}.w3-mobile{display:block;width:100%!important}.w3-bar-item.w3-mobile,.w3-dropdown-hover.w3-mobile,.w3-dropdown-click.w3-mobile{text-align:center}\r\n.w3-dropdown-hover.w3-mobile,.w3-dropdown-hover.w3-mobile .w3-btn,.w3-dropdown-hover.w3-mobile .w3-button,.w3-dropdown-click.w3-mobile,.w3-dropdown-click.w3-mobile .w3-btn,.w3-dropdown-click.w3-mobile .w3-button{width:100%}}\r\n@media (max-width:768px){.w3-modal-content{width:500px}.w3-modal{padding-top:50px}}\r\n@media (min-width:993px){.w3-modal-content{width:900px}.w3-hide-large{display:none!important}.w3-sidebar.w3-collapse{display:block!important}}\r\n@media (max-width:992px) and (min-width:601px){.w3-hide-medium{display:none!important}}\r\n@media (max-width:992px){.w3-sidebar.w3-collapse{display:none}.w3-main{margin-left:0!important;margin-right:0!important}}\r\n.w3-top,.w3-bottom{position:fixed;width:100%;z-index:1}.w3-top{top:0}.w3-bottom{bottom:0}\r\n.w3-overlay{position:fixed;display:none;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:2}\r\n.w3-display-topleft{position:absolute;left:0;top:0}.w3-display-topright{position:absolute;right:0;top:0}\r\n.w3-display-bottomleft{position:absolute;left:0;bottom:0}.w3-display-bottomright{position:absolute;right:0;bottom:0}\r\n.w3-display-middle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%)}\r\n.w3-display-left{position:absolute;top:50%;left:0%;transform:translate(0%,-50%);-ms-transform:translate(-0%,-50%)}\r\n.w3-display-right{position:absolute;top:50%;right:0%;transform:translate(0%,-50%);-ms-transform:translate(0%,-50%)}\r\n.w3-display-topmiddle{position:absolute;left:50%;top:0;transform:translate(-50%,0%);-ms-transform:translate(-50%,0%)}\r\n.w3-display-bottommiddle{position:absolute;left:50%;bottom:0;transform:translate(-50%,0%);-ms-transform:translate(-50%,0%)}\r\n.w3-display-container:hover .w3-display-hover{display:block}.w3-display-container:hover span.w3-display-hover{display:inline-block}.w3-display-hover{display:none}\r\n.w3-display-position{position:absolute}\r\n.w3-circle{border-radius:50%}\r\n.w3-round-small{border-radius:2px}.w3-round,.w3-round-medium{border-radius:4px}.w3-round-large{border-radius:8px}.w3-round-xlarge{border-radius:16px}.w3-round-xxlarge{border-radius:32px}\r\n.w3-row-padding,.w3-row-padding>.w3-half,.w3-row-padding>.w3-third,.w3-row-padding>.w3-twothird,.w3-row-padding>.w3-threequarter,.w3-row-padding>.w3-quarter,.w3-row-padding>.w3-col{padding:0 8px}\r\n.w3-container,.w3-panel{padding:0.01em 16px}.w3-panel{margin-top:16px;margin-bottom:16px}\r\n.w3-code,.w3-codespan{font-family:Consolas,\"courier new\";font-size:16px}\r\n.w3-code{width:auto;background-color:#fff;padding:8px 12px;border-left:4px solid #4CAF50;word-wrap:break-word}\r\n.w3-codespan{color:crimson;background-color:#f1f1f1;padding-left:4px;padding-right:4px;font-size:110%}\r\n.w3-card,.w3-card-2{box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)}\r\n.w3-card-4,.w3-hover-shadow:hover{box-shadow:0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19)}\r\n.w3-spin{animation:w3-spin 2s infinite linear}@keyframes w3-spin{0%{transform:rotate(0deg)}100%{transform:rotate(359deg)}}\r\n.w3-animate-fading{animation:fading 10s infinite}@keyframes fading{0%{opacity:0}50%{opacity:1}100%{opacity:0}}\r\n.w3-animate-opacity{animation:opac 0.8s}@keyframes opac{from{opacity:0} to{opacity:1}}\r\n.w3-animate-top{position:relative;animation:animatetop 0.4s}@keyframes animatetop{from{top:-300px;opacity:0} to{top:0;opacity:1}}\r\n.w3-animate-left{position:relative;animation:animateleft 0.4s}@keyframes animateleft{from{left:-300px;opacity:0} to{left:0;opacity:1}}\r\n.w3-animate-right{position:relative;animation:animateright 0.4s}@keyframes animateright{from{right:-300px;opacity:0} to{right:0;opacity:1}}\r\n.w3-animate-bottom{position:relative;animation:animatebottom 0.4s}@keyframes animatebottom{from{bottom:-300px;opacity:0} to{bottom:0;opacity:1}}\r\n.w3-animate-zoom {animation:animatezoom 0.6s}@keyframes animatezoom{from{transform:scale(0)} to{transform:scale(1)}}\r\n.w3-animate-input{transition:width 0.4s ease-in-out}.w3-animate-input:focus{width:100%!important}\r\n.w3-opacity,.w3-hover-opacity:hover{opacity:0.60}.w3-opacity-off,.w3-hover-opacity-off:hover{opacity:1}\r\n.w3-opacity-max{opacity:0.25}.w3-opacity-min{opacity:0.75}\r\n.w3-greyscale-max,.w3-grayscale-max,.w3-hover-greyscale:hover,.w3-hover-grayscale:hover{filter:grayscale(100%)}\r\n.w3-greyscale,.w3-grayscale{filter:grayscale(75%)}.w3-greyscale-min,.w3-grayscale-min{filter:grayscale(50%)}\r\n.w3-sepia{filter:sepia(75%)}.w3-sepia-max,.w3-hover-sepia:hover{filter:sepia(100%)}.w3-sepia-min{filter:sepia(50%)}\r\n.w3-tiny{font-size:10px!important}.w3-small{font-size:12px!important}.w3-medium{font-size:15px!important}.w3-large{font-size:18px!important}\r\n.w3-xlarge{font-size:24px!important}.w3-xxlarge{font-size:36px!important}.w3-xxxlarge{font-size:48px!important}.w3-jumbo{font-size:64px!important}\r\n.w3-left-align{text-align:left!important}.w3-right-align{text-align:right!important}.w3-justify{text-align:justify!important}.w3-center{text-align:center!important}\r\n.w3-border-0{border:0!important}.w3-border{border:1px solid #ccc!important}\r\n.w3-border-top{border-top:1px solid #ccc!important}.w3-border-bottom{border-bottom:1px solid #ccc!important}\r\n.w3-border-left{border-left:1px solid #ccc!important}.w3-border-right{border-right:1px solid #ccc!important}\r\n.w3-topbar{border-top:6px solid #ccc!important}.w3-bottombar{border-bottom:6px solid #ccc!important}\r\n.w3-leftbar{border-left:6px solid #ccc!important}.w3-rightbar{border-right:6px solid #ccc!important}\r\n.w3-section,.w3-code{margin-top:16px!important;margin-bottom:16px!important}\r\n.w3-margin{margin:16px!important}.w3-margin-top{margin-top:16px!important}.w3-margin-bottom{margin-bottom:16px!important}\r\n.w3-margin-left{margin-left:16px!important}.w3-margin-right{margin-right:16px!important}\r\n.w3-padding-small{padding:4px 8px!important}.w3-padding{padding:8px 16px!important}.w3-padding-large{padding:12px 24px!important}\r\n.w3-padding-16{padding-top:16px!important;padding-bottom:16px!important}.w3-padding-24{padding-top:24px!important;padding-bottom:24px!important}\r\n.w3-padding-32{padding-top:32px!important;padding-bottom:32px!important}.w3-padding-48{padding-top:48px!important;padding-bottom:48px!important}\r\n.w3-padding-64{padding-top:64px!important;padding-bottom:64px!important}\r\n.w3-left{float:left!important}.w3-right{float:right!important}\r\n.w3-button:hover{color:#000!important;background-color:#ccc!important}\r\n.w3-transparent,.w3-hover-none:hover{background-color:transparent!important}\r\n.w3-hover-none:hover{box-shadow:none!important}\r\n/* Colors */\r\n.w3-amber,.w3-hover-amber:hover{color:#000!important;background-color:#ffc107!important}\r\n.w3-aqua,.w3-hover-aqua:hover{color:#000!important;background-color:#00ffff!important}\r\n.w3-blue,.w3-hover-blue:hover{color:#fff!important;background-color:#2196F3!important}\r\n.w3-light-blue,.w3-hover-light-blue:hover{color:#000!important;background-color:#87CEEB!important}\r\n.w3-brown,.w3-hover-brown:hover{color:#fff!important;background-color:#795548!important}\r\n.w3-cyan,.w3-hover-cyan:hover{color:#000!important;background-color:#00bcd4!important}\r\n.w3-blue-grey,.w3-hover-blue-grey:hover,.w3-blue-gray,.w3-hover-blue-gray:hover{color:#fff!important;background-color:#607d8b!important}\r\n.w3-green,.w3-hover-green:hover{color:#fff!important;background-color:#4CAF50!important}\r\n.w3-light-green,.w3-hover-light-green:hover{color:#000!important;background-color:#8bc34a!important}\r\n.w3-indigo,.w3-hover-indigo:hover{color:#fff!important;background-color:#3f51b5!important}\r\n.w3-khaki,.w3-hover-khaki:hover{color:#000!important;background-color:#f0e68c!important}\r\n.w3-lime,.w3-hover-lime:hover{color:#000!important;background-color:#cddc39!important}\r\n.w3-orange,.w3-hover-orange:hover{color:#000!important;background-color:#ff9800!important}\r\n.w3-deep-orange,.w3-hover-deep-orange:hover{color:#fff!important;background-color:#ff5722!important}\r\n.w3-pink,.w3-hover-pink:hover{color:#fff!important;background-color:#e91e63!important}\r\n.w3-purple,.w3-hover-purple:hover{color:#fff!important;background-color:#9c27b0!important}\r\n.w3-deep-purple,.w3-hover-deep-purple:hover{color:#fff!important;background-color:#673ab7!important}\r\n.w3-red,.w3-hover-red:hover{color:#fff!important;background-color:#f44336!important}\r\n.w3-sand,.w3-hover-sand:hover{color:#000!important;background-color:#fdf5e6!important}\r\n.w3-teal,.w3-hover-teal:hover{color:#fff!important;background-color:#009688!important}\r\n.w3-yellow,.w3-hover-yellow:hover{color:#000!important;background-color:#ffeb3b!important}\r\n.w3-white,.w3-hover-white:hover{color:#000!important;background-color:#fff!important}\r\n.w3-black,.w3-hover-black:hover{color:#fff!important;background-color:#000!important}\r\n.w3-grey,.w3-hover-grey:hover,.w3-gray,.w3-hover-gray:hover{color:#000!important;background-color:#bbb!important}\r\n.w3-light-grey,.w3-hover-light-grey:hover,.w3-light-gray,.w3-hover-light-gray:hover{color:#000!important;background-color:#f1f1f1!important}\r\n.w3-dark-grey,.w3-hover-dark-grey:hover,.w3-dark-gray,.w3-hover-dark-gray:hover{color:#fff!important;background-color:#616161!important}\r\n.w3-pale-red,.w3-hover-pale-red:hover{color:#000!important;background-color:#ffdddd!important}\r\n.w3-pale-green,.w3-hover-pale-green:hover{color:#000!important;background-color:#ddffdd!important}\r\n.w3-pale-yellow,.w3-hover-pale-yellow:hover{color:#000!important;background-color:#ffffcc!important}\r\n.w3-pale-blue,.w3-hover-pale-blue:hover{color:#000!important;background-color:#ddffff!important}\r\n.w3-text-red,.w3-hover-text-red:hover{color:#f44336!important}\r\n.w3-text-green,.w3-hover-text-green:hover{color:#4CAF50!important}\r\n.w3-text-blue,.w3-hover-text-blue:hover{color:#2196F3!important}\r\n.w3-text-yellow,.w3-hover-text-yellow:hover{color:#ffeb3b!important}\r\n.w3-text-white,.w3-hover-text-white:hover{color:#fff!important}\r\n.w3-text-black,.w3-hover-text-black:hover{color:#000!important}\r\n.w3-text-grey,.w3-hover-text-grey:hover,.w3-text-gray,.w3-hover-text-gray:hover{color:#757575!important}\r\n.w3-text-amber{color:#ffc107!important}\r\n.w3-text-aqua{color:#00ffff!important}\r\n.w3-text-light-blue{color:#87CEEB!important}\r\n.w3-text-brown{color:#795548!important}\r\n.w3-text-cyan{color:#00bcd4!important}\r\n.w3-text-blue-grey,.w3-text-blue-gray{color:#607d8b!important}\r\n.w3-text-light-green{color:#8bc34a!important}\r\n.w3-text-indigo{color:#3f51b5!important}\r\n.w3-text-khaki{color:#b4aa50!important}\r\n.w3-text-lime{color:#cddc39!important}\r\n.w3-text-orange{color:#ff9800!important}\r\n.w3-text-deep-orange{color:#ff5722!important}\r\n.w3-text-pink{color:#e91e63!important}\r\n.w3-text-purple{color:#9c27b0!important}\r\n.w3-text-deep-purple{color:#673ab7!important}\r\n.w3-text-sand{color:#fdf5e6!important}\r\n.w3-text-teal{color:#009688!important}\r\n.w3-text-light-grey,.w3-hover-text-light-grey:hover,.w3-text-light-gray,.w3-hover-text-light-gray:hover{color:#f1f1f1!important}\r\n.w3-text-dark-grey,.w3-hover-text-dark-grey:hover,.w3-text-dark-gray,.w3-hover-text-dark-gray:hover{color:#3a3a3a!important}\r\n.w3-border-red,.w3-hover-border-red:hover{border-color:#f44336!important}\r\n.w3-border-green,.w3-hover-border-green:hover{border-color:#4CAF50!important}\r\n.w3-border-blue,.w3-hover-border-blue:hover{border-color:#2196F3!important}\r\n.w3-border-yellow,.w3-hover-border-yellow:hover{border-color:#ffeb3b!important}\r\n.w3-border-white,.w3-hover-border-white:hover{border-color:#fff!important}\r\n.w3-border-black,.w3-hover-border-black:hover{border-color:#000!important}\r\n.w3-border-grey,.w3-hover-border-grey:hover,.w3-border-gray,.w3-hover-border-gray:hover{border-color:#bbb!important}"; });
define('text!employee/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><button click.delegate=\"activate()\" class=\"w3-large button-none\"><i class=\"fa fa-user\"></i>List</button> <button click.delegate=\"addEmployee()\" class=\"w3-large button-none\"><i class=\"fa fa-plus\"></i>Add Employee</button><compose view-model=\"${_url}\"></compose></div></template>"; });
define('text!employee/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgPreview\" alt=\"your image\" src=\"${user.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"FileUploadImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\" disabled=\"disabled\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!employee/view.html', ['module'], function(module) { module.exports = "<template><ul class=\"w3-ul w3-card-4 frame-limit-50\"><li class=\"w3-padding-16 w3-hover-red\" repeat.for=\"user of employee\"><span click.delegate=\"\" class=\"w3-right\"><button click.delegate=\"editEmployee(user.id)\">Edit</button> <button click.delegate=\"deleteEmployee(user.id)\">Delete</button> </span><img src=\"${checkProfileImage(user)}\" class=\"w3-left w3-margin-right\" style=\"width:50px;height:50px\"> <span class=\"w3-large\">${user.name}</span><br><span>${user.type}</span></li></ul></template>"; });
define('text!manager/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\" click.delegate=\"openUserInfo()\"><img src=\"${user.pic}\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-blue\"><h2 style=\"text-shadow:0 0 15px #fff\">${user.name}</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-blue\"></i>${user.description}</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-blue\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-blue\"></i>${user.username}</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-blue\"></i>1224435534</p><p><a href click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-blue\"></i>Logout</a></p><hr><p class=\"w3-large display-inline\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-blue\"></i> Stocks<div class=\"container tooltip\" id=\"badge\" click.delegate=\"restock()\"><a class=\"entypo-bell\"></a> <span class=\"tooltiptext\">Out of stock! Click here to view.</span></div></b></p><div style=\"overflow-y:auto;height:300px\"><div repeat.for=\"item of stocks\" if.bind=\"item.percentage != '0.00%' && item.no_of_days > 0\"><p>${item.description}</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-blue\" css.bind=\"{width: item.percentage}\">${item.percentage}</div></div></div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-blue\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-blue\"></i>Dashboard</h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-blue\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-blue\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-blue w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p><button click.delegate=\"loadStock()\" id=\"loadStack\" style=\"visibility:hidden\"></button></footer></template>"; });
define('text!manager/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgPreview\" alt=\"your image\" src=\"${user.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"FileUploadImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\" disabled=\"disabled\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!order/receipt.html', ['module'], function(module) { module.exports = "<template><div><require from=\"../ui-helper/php-format\"></require><style>.receipt .body{text-transform:uppercase;text-align:center;font-size:10px;font-family:monospace}.receipt .body img{margin:0 auto}.receipt .right{float:right}.receipt .left{width:50%;float:left}.receipt .center{text-align:center}.receipt table{margin:0;word-wrap:break-word}.receipt table tr{width:100%}.receipt table tr td{width:100%}.receipt .wide{width:100%}@page{margin:0;size:portrait}</style><div class=\"receipt\"><div class=\"body\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAiCAYAAAD8gp97AAAACXBIWXMAAAsTAAALEwEAmpwYAAA7pmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDYtMjFUMDY6NDY6MjUrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wNi0yMVQwODowMDoyMSswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMDYtMjFUMDg6MDA6MjErMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6MjNiMGM0ZTEtNDYwZS01NjQ5LTgyOTMtZjRlNTUwYmJhYjVmPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OGJmMzNkOTUtNTYxNC0xMWU3LWJkYzYtZDlkNjk1YWQ5MmJhPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MmE4MjdlNmQtYmE3OS00OTRiLWJiYjgtODI1MmY1NWFmYmFjPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjJhODI3ZTZkLWJhNzktNDk0Yi1iYmI4LTgyNTJmNTVhZmJhYzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wNi0yMVQwNjo0NjoyNSswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoxY2U3MWE5NS0zNWE0LTJkNGItYTUxNS0wNTQ3Y2VlOGI3MDY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTctMDYtMjFUMDc6MzQ6MzcrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MjNiMGM0ZTEtNDYwZS01NjQ5LTgyOTMtZjRlNTUwYmJhYjVmPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE3LTA2LTIxVDA4OjAwOjIxKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjcyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjM0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5plparAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABWQSURBVHjatJp5eBRltrjfWnpL0p1Od6qzmYSEPSxhFYZNNlfQURZFUVRGxA0Rl3H7jcp1HEVHcEbUEe/ouCAMIgiKC8KAbILsAWQJhJBAIJC1t/T+3T+6G4sWvXPvc3/1POf5qlJVqfreOud8Z2nJpWn8LzZJN8q6UQYUnagXEYPuXPI6Wfc/k1ssIVEgopNwQvTH0RQRiXtJ7Av+l5v6fwRGD8SgG/ViTDlWdffIKZBECpwkkFCKhHWjHlpUBzime3/x/xOQpBO9tqgpQIwJMelGk+7vRh0sVQdKTplIElBYByJ4EQkkxtBFYP2SRv2fAkrVmuRkkpMzpoAw68QEWHT7F4OlXsTMRIr2hHQwktKWEP2+HlwoBZSUgCT+J2an/g+1JmlKqZqShJCW2Lck9vXHFh1AU5qqmtoLkZarGMw2hMEci8lWk2owpVmUcEZGrLXJHWqKhUPHM6y+I/VnvbFYLKgD4deJTze2pYBLgkqC1msn9cePi5ySkl8H8CtO+pfMKQkmqSXpCRDpKZKh+7sFMGQoinKpIyuri2q0FZiN6Vp1Tbo1JqeZoiGjEomoiiKpstkkk24VUX8g7E83B1q7d/Mez8hoqfhhe9PGQFuTuy0QSUzcD3hTxJcY9cBSQUV1Puq/1aRfAvRrWmPSaUg6YE3AsOokIyGm0b16Zo91OotKj1XnZxw+nK2mpRmFBEqWA0NpOySHDcVqR023IUkKUZ+HcHMjos1HrKGZ8NFjRJsakWQVpagw1Dywf/1ue2bNB1+sOn6s1ZOE5EmIWzd6dbD8CVCpZvffQroYoFQ4SQds0plREowtIZn6sWP70owZZV3Kum3e2tHQ1GyNNjRg7NeXtGFDMPUqx9y7N6ZOnVENpl9VbwGEz56mraKCtr17CazfQNt3GxCBEHKmFe81V59cZDLu++izlbUJjWlNkSSwJKi2i2jTr0JKBfRrcCw6zUjCsANZidH+m0yb84kH7uuf8+mKEt/GDRg7dCD92jFk3nwz6f0HXBDoiGCQwMGDhE5WI1q8CH8IYgIMMlJmGqrmwtSpC4a8vAteONTUgHvZp3iXr8D75VfIlnQMjz7U8u6af2179+jREwkozUBLYkzC8uj8VeDfhZQKSNaJqjOppF9JgslKiANwOJ1O2+vDBw3K/8fizuGAH3OHDmQ9/hhZt92GarIAEPV5cX/+Ob6NGwjV1CCCATCaka1pSCYDkmxMfJsoIhxE+IJE23xIQqBmOTGXl2MbOxZL957nX9a7dyeNr7yKZ+EiZKBtcP+zz1ls63/YW3EOaEpIsw5YUqP+bUh6QHqHrPc3aTpzSoJxJuW+++7tMDUSHu59ZZ6q5Odgf/wxnNOmoyjxBdL95SqaPnifcM0JZC0bS89epA8YgLlnOYbCQmRJ/kUTC7c0EjxSSdvOnfh3bCdUWYmkqlhHjMR5z72omgsA377dnHtuNv5lKzH37cvGG8f98Ps/z9uTgNIINCRgtehML9Uv6SH9DFDStJIO2ajzN1ad1jiBbEAD7B9cPnRoh2Mnu/q2/YB9ymRyX3sNY1Y2AE3vv0vj2wtAlrBdcw2Zk2/FXPzzJVUIgSRdmGVEw2FkRUaSlQtzj0gY91eraFn0McEfD2Lp24+cZ57FVNwu/sxP/0n97+6BYIjW/r1O3lZbt9rt87UkAJ1LwEqC8vwCpAu0SHJpWqrf0ZtVRgKOQwfGZTIa7V/9de4YafykPGFQyf3gXZyTbgXAs24tZ554HKEa0GY9RNaEm34GxbN2Da2fLCVcfZzIwaMYLu1D7txXMBfGJ1pz3zRCO/ZS9NkyjPmXEGluJOJxYy76CXDwxHHOvvQi3jXfknnDePL+9BKSqhJqPMvJyZPxf7MG093T3NP2VnxxsKrqLHA2AUmvTe6LmNsFpianmFfSKZt1TtmuA+Ry2qzOlV07XS9NuCVPLetMyb49OCfdioiEqZ02ldrbp5B11zQ6bf7+PBz3d+s486fZxIJtALTt2k7T229DNIJxcF+8S5dyZubM85OP7K4gfOQwqHHNaln6T44Ul9L48YfnrzEVl1D41gJKvl5N4MB+Dvfoiue7dRidLkq+/pasZ54iuOAd25t1p8eV5+bkAK7EHByJj25NKIH5IhH9BU5Zrz2pK5ZNDyjNZMpaOn3atcqaddnGgX1pt/V70jqX0bavgiPlPYk0NtBpbwXZ06YjAM+WjZwYP47q4SPxfvUNQo2bjKl7D2TANnEixR8vIfO2yfhWfE7g2OG4KbW4MXXrjtFVEPcxq9fEnfD69QDUv/ISNVNvJ+J1Y27fkdJVX6M9+RQ1N07kzOxnkICC2S+Qs+BNYrU15teztd92zHFlJwA5E+7ClpijRZcbKinZwwWALrak631P1sKyzpeL3z+ZnT5qOMVr1mC02mn5YiVVI4djn3onJctWomY5ATjz/LNUDx5G+NgxSrZtomD5MoKH4wCMhYXIJhOBffsAsAwbTCwmiJ1pJEqMcGMDal4OAP79e2nbsAlVtSDaggQ9DbjfXEDb2nUIw08+yjnlTtpv20brp59SPXE8ANq0e8lb+D6RdevS/lJ1/Jo0s8memIsj8eGtukj/onnhxdIIiy4QTMY5zjdmPdjPvnptkal3TwpXLMeQZqX5ow84edttFLz3HjmP/P4CP2PpVoYEWIYPQ4Qi1PYewKlp0wAwlLRDcTqI1tTGNcbjS9iNimhpQTS2ohRdEvdXS5dBKIxx+EBizU00LVhAuPoEzscfxWBKv+CZ5nbt6bhrD1F3C8dGXYYAnLdMQZv/Gia/3/Hh0CEjdeGJPUWLTDotSgKS5BTzMqdojx1wTO7Wtbjnmwv6KAUFXPL5SgzpdpoXf8ypB2dS/Pnn2Mf+Ft+WTZycNYNwUyMA9nE3Yb1xAq1/eYO6SZOxTp1Cu6+/jtt1uhVjSSltm7ZSPWYMjY8+ibl/H9L6XYrv+y0EY2HMpR0RQOu7/yDtyivIeuRBQocr8bz+DmrHUjLGjIn7q4Cfhr8v4NSMB2j9chWyaqD9N2uRMzOpGnUZAK77Z+J48jEcHy8ueSHH1TMBKCsxx4wUX2RIBZTUHpMu+Twf96RZzLbf+XxDQidryf3oPcwFxXjW/4u6mTMo+mQJ1iHDAGheupiG1+ZzeuaDxEQUgMzJNxNDkHH1leTOfh7/hk0cKeuKZ/23mK8eDZkZRJuasM64l0s++QQAJdOKbfRwzEMH4926CV9tDdbrryNj6AhEJEbkxAnSR4/EXNyesKeZmuuv5/Rd02me/wY1Y8Zy+o//AUDJspUgK5y4cQIA+X96mbRrrmLw/kMDLyspytFlADadmZl0ZZy4s3ZpmtWlaTkuTWvv0rR+Lk270qVpt7s07UmXps1f9NCMHftB1D3ztBBCiODZM+LHkkJx7p23hBBChJobREwIERNC1N5/j9gHonrSTSK5VV11hTicnSMOd+goKkBUDrxUeHfvEDEhRDQUEr+2Rfx+0bRqpQi3NItoJCgOlRaLChDudWuEEEJUTxwn9oKoe/oJERNCnHn2/4ndIBo+ek8IIUQ02CYO9egqTj/7ByGEEG21x8WhvDyxZeDAGpemve3StOdcmna3S9Ouc2naIJemdXFpWr5L0+wuTTO7NE1V0tPTk+qVoYuWnYCrV6Y1787te0aZepXLhR8uRAKqb7gOS79+5D3zH3g2fcfxkSNQsh2klffGu2EDwc1bCO4/QFvVUew3jEPKSKNl4YdYhgyh4KMPyP3Dsxhz85FEjGDVMXy7d+LdvZO2A/sJ/Lgf/8H9BI9XEa47hZJhJaNPX2SzGUlWkFzZyNkOXA88hHfjes4+9gSO++4h99V5SLEYhtJ2tMyfj+rSsI25FklRSR8+nNOPPIy5Vznp5X3AmUnkzQWZmkvzbAmFWi9SjYzo4qGYqksrkpFzEpTtIUkuF26Pkv38s0jAuXl/JtrQyCVffxt3rrEIor6RhkefxL1sOaHN23HMeYFIbS2N8/8G0Sh57/yN9ocPYW7XPr4qVezBu+MHJIsZwyWXoOTlYGpXjGowgyQTjYYQoQDC68WzYyuRhnMY7FlYBw/FefOtOG+OB6SBQ4eIApm3TCLa0sjRsjIcsx6maMtGDOkZiSg9hqVrN7Ife4zTsx7Cumc/2XfchWfpp1y5o6L367J8NBiLZaaURpIZfwSIKOnp6Zk6v5PUHq3MZs2ZXFd/WcbN42XXQ48SaWzg1L3TyZs3D3OHTvFVo7iUtDFX4V64kNCuPWTcMpGCOa+ScfU1BHb8gJqXQ9ZvJ6DaHfj37KRh8UdgUMgYPgJLlzIIhgjv2U/gm7V4v1tLYON3hL7/Ac61omRlktazHHOf3iBLtK7+hsCRQ5hL2yMZjSh5OXgWfUxwVwWGS/sQ/mEHTX9/D/udt5PR51LaDv1IzaQbUTJtOG+/k5alSwhWHsY6cjRKQR6ed/7TnFda4tvo8TRfpFSbrEDGJJemtdOByQUKgMJ5lw0ZUL5sZb/ibZvJ6DeAk/fcTbSlmeLFn/w8ddi2mZPXjkMBXH9/G/u11xMNB5ENJggEOPv+AiSTmaxbb0d4fTTPfwPPoiWEjlQSi4VQi4tRJBUkGWFSCZ+sBX8IxZqOZchgnI89StrQYfh2b8e9aiWZV40lo98AvLt2cGriTYSqqlCQcLw4m9wn/oB//17OPPUErZ9/Tf5f55IzYxa+rVs4OW0qpWvXY3DlcuKG39K0d1/TVV7vUqAeOAmcTqQjTefTEJemdXJp2sCEo5ru0rTnXZr29u6ioubq666NO+YT1eJQzzLRduhHIYQQZ+a8KI4M6CvcWzacd6ieXdvFAZNZVMgIX+XB+H21NaJ29lPCvWtb/L4/vSD2I4sDFouo7NdHnJw1Q/iPHxNRIUTz4sXi7IK/iZgQIuRpFWfmzhFVV18uKnv3FntBHBs6VLRVxa899ecXRNOKpfFnNDWIs397Q5x9+63z71L7+4dF1fXXC+/ObRc4/eqbbxS1M+8XQgjRuuZrccBgEk8P6P+NS9PmujTtYZemTXJp2giXpvVwaVqhS9Mcsm55TwaIGeOLC/ONdaftmb+7E4DG1+ZhKS/H3LkrZ+e+Qv3jTxI714QxLz++xK/8FEvXMgq++AzXvFdJ69CF8OlT1L/zBtr9D2LKL+Zor96ce+pprDdNoH11Nc45f8TUswxLu9J4IKaoSAgkwJBhw1BciH3qHXTYtYu8BW8RrjzK0dL2NLw2l/xHniJ0tp6GRe9jzHKiTb8P7e57zmv0JXNepWT5cixde9Dw1ls0L1kcj6xnPoR/4wZiAT+2UVdiHtifK93eTik1dIs+P1PS09MLdRm7E8h+RMR65BUXu3Ln/hkJmfoXnsP1xNMYCouoHTMW24QbaL9+A6rdgWf7Fk6MuorIuXpcMx8mY8BviLQ0U//GXHJnPEy0/ixVPXoQra3DcsVIDKOGETl9Gv+XXxHYW4G/qhLP5k3xQlrlEXxVlXg2b6Ttu+8I7T9IsKmBmMUIsgRePy2LFhM+W0/+H2bj+X4j4bpTWDp3/SnRbW0hWFeDIctJzR230vjSy7iXforarojMsdfhXvkZMZ+PtP4DiHhbiX240LYnL7eyPhhqS2krhYCwepEWDvlub65l7BhkFFqWLUUymUkfNITwuXoIBIl5fcQSkZS1/yBsl1+Ob8VKYm8EkVUT5/6xgKwbJhJzezjWvSeW/v3ImDoFxWgia+o0RDBAs4gQqa0le+bDSEYD7r+/T6i1EeesWcjINP7nW+AP4LjjTiRVpcUfRpowntjpM5y6+z4kg0rBX16n7pUXMBXvIa1nLwDOzXkR95JPyH3nTcIbt+J4cAaGrp1omP0cjjumknXrFFoWLyL7vhmkjxyJZEmTx3XtVLx3285zKT07A2CQUzujl+Zo9vRQONsydGi8rLn2Wyzl8YcbtBxs99+D+7OVVPXrS/OKZbSuXU1wbwWWoYORVROtq7/EmFeAuXs5xwcPQc3Opnj9v7D2HQCBIAoSqsmCITsb1eHAYMlAVUwYHNmoDicG1YyiGlEdTlRnNqrRgiIbkE0m5Kgge9q9aE8/QcNf59P04T/Ivms6LatWxAttsRDufy7BUtYDU3lPJEcWSDEkg0KoupbAwX3YJkwk0tRIuO4Uad3KMffvS6+auqJf6Poq+lxM7mIy2gb527LlXBfpgwbHi+THq8gYOeq8Cue+/DLZs58hfOQotdePp3r0lZBlJfevr8fjnH27sY+bwJkZM4g2NlK0djVqmpVoawsYdH1KRQWDQdfCVJCMxguP9ecV9XyZL/+PL+KYciun7/gdwufD0rMHLau/QJGNGDu0RzIZIQYxXxvhY1XE2vxYJ96AuWt3ZIMRJduJd008lrP07kVmU2NuN2eWNaUmrwCyqv9VxW+Qnd09bS5j304Y8woI1ZxAhMOY+/T56T0llfxnZmO/ZTLedWshGsV6zVhMeZfQ8vkyLL36EDxaifudd7EMGYR/f0W8bbN9O7GmZs4pKpIkE9izi1hLMw0ooCgEtu4gFvARi0aQkGjb+j2Ew0RD8YZo28bNYFCINDSgZGYi2W0Qi3Hu+T+S8/JLNH7wLlwxFtecOZwYNgKPVkiMGBm3jCfngUeITn8AKTFVc1l3/Lt3kjXlDkz9+sJ776uXBSPaATiUUg+SVH0fvHNGms0h+WyGRKnBv3sHstWKMbfgZ7FPWodOpCUCxvMtmbpa7DfdQsNzzxOLhDD17oFaVAyhEIrTgQiHUYuLkCQZuaYKEY2gFBUhqSrK4aPgV+LnkZEP/wjBEGpREUigVOxDGFUMJe1AkpEcNow9yvAuXYb21JOYO3XBs2UD1kHDKFixjNaPF2Lu1xfnnXfFP6yuB2fs2AHvV1/FKyydO4GkMCg/L79BEvlLTtWd1NWkJVWXe4RKAwGnLRLJNLaPTzxSdQI1N/ff+hVE4Hglxnal4A/iXb4SY9+emIf9BvuQ4XGLkVWCJ6rJGnVl/MlyjPCpU2SNvip+3hsk5HOTNeKKeJrgaUYKx7CPvDx+/ZlGsNvIHBk/H/U0oDiz8Lz6Nq3/XILtlkn4Nm2AQcPIHDGazBGjf/Fd08rKcS9fHtemTl2QrenkatmOgYUF2UtO1V3Q4VATIXUQ8Ft8AUWRkKOxAL6QJ+zdvxfZaMZ96jixhkZELPZTB0L8ZJxKph3P6q+QszIJrFpJrNWN8erLaDtRQ+uRA8hmC94D+wmfrMFQfQRJUvAeOED0dB3u44eRDAa8h38k4m5BrTmKJMn4Dh+GtgBK/34ggbfyEMJsQOrWCQkZ394KFJcLuWsnWpevQB7Qm0DtCVr27AAJJElGCAEipuuggGK1Ejp3irC3lcZN65AsJmSb1WDx++0dA/6c1H7Zfw0Aa0t678zGaVAAAAAASUVORK5CYII=\" id=\"logo-receipt\"><h2 style=\"margin-top:0;font-size:7px\">25-A Sabayle St., Iligan City, Philippines</h2><h2 style=\"margin-top:-4px;font-size:7px\">Tel#: 063-221-5164 | TeleFax#: 063-223-2224</h2><h2 style=\"margin-top:-4px;font-size:7px\">www.chedings.com</h2><h2 style=\"margin-top:-1px;font-size:9px;text-align:left\">Cashier: ${user.firstname +\" \"+ user.lastname}</h2><h2 style=\"margin-top:-1px;font-size:9px;text-align:left\">${receipt.date} | ${receipt.time}</h2><h2 style=\"margin-top:-1px;font-size:9px;text-align:left\">Receipt #: ${receipt.no}</h2><table style=\"font-size:9px;width:100%;font-weight:700\"><tr><td style=\"border-top:1px solid\"></td></tr><tr repeat.for=\"item of receiptorder\"><td><div class=\"left\">${item.description}<br>( ${item.cost | phpFormat} <span if.bind=\"item.discount.length > 0 \">- ${item.discount | phpFormat}</span>) ${\"x \"+item.quantity}</div><div class=\"right\">${((item.cost-item.discount)*item.quantity) | phpFormat}</div></td></tr><tr><td></td></tr><tr><td style=\"border-bottom:1px solid\"><div class=\"left\">VAT</div><div class=\"right\">${receipt.vat | phpFormat}</div></td></tr><tr style=\"font-size:12px\"><td style=\"padding-bottom:15px\"><div class=\"left\">Total</div><div class=\"right\">${receipt.total | phpFormat}</div></td></tr><tr style=\"font-size:12px\"><td style=\"border-bottom:1px solid\"><div class=\"left\">Cash</div><div class=\"right\">${receipt.cash | phpFormat}</div></td></tr><tr style=\"font-size:15px\"><td><div class=\"left\">Change</div><div class=\"right\">${receipt.change | phpFormat}</div></td></tr></table><center style=\"font-weight:700;font-size:5px\">This serves as official receipt</center></div></div></div></template>"; });
define('text!order/view.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><require from=\"../ui-helper/php-format\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-container\"><p class=\"w3-large\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-red\"></i>Transaction</b></p><p></p><div class=\"ui-widget\"><label class=\"w3-text-black\">Product No</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"order.productno\" id=\"productnocompleter\" change.delegate=\"loadProductInfo()\"></div><p></p><p><label class=\"w3-text-black\">Description</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.description\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Price</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.cost | phpFormat\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Quantity</label><input class=\"w3-input w3-text-black\" type=\"number\" value.bind=\"product.quantity\"></p><p><label class=\"w3-text-black\">Discount</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.discount | phpFormat\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Name of supplier</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.supplier_id\" disabled=\"disabled\"></p><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white\" style=\"height:350px\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-red\"></i>Items</h2><div class=\"w3-container w3-margin-bottom\" style=\"overflow-y:auto;height:235px\"><table class=\"w3-table w3-striped w3-border\"><thead><tr><th>Product #</th><th>Description</th><th>Quantity</th><th>Discount</th><th>Price</th><th>Action</th></tr></thead><tbody><tr repeat.for=\"items of order.purchase\"><td>${items.pin_number}</td><td>${items.description}</td><td>${items.quantity}</td><td>${items.discount | phpFormat}</td><td>${items.cost | phpFormat}</td><td><button class=\"w3-button w3-red w3-tiny\" click.delegate=\"removeOrder($index)\">x</button></td></tr></tbody></table><br></div></div><div class=\"w3-third w3-margin-top\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-container\"><h3>Total Amount</h3><h2 style=\"text-align:center\">${totalAmount | phpFormat}</h2><hr></div></div></div><div class=\"w3-third w3-margin-left w3-margin-top w3-margin-right\"><div class=\"w3-white w3-text-grey w3-card-4\" style=\"height:142px\"><div class=\"w3-container\"><p><b><i class=\"fa fa-money fa-fw w3-margin-right w3-text-red\"></i>Enter Cash</b></p><h3><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"order.cash\"></h3><p></p><br></div></div></div><div class=\"w3-rest w3-margin-left w3-margin-top\"><div class=\"w3-white w3-text-grey w3-card-4\" style=\"height:142px\"><div class=\"w3-container\"><p><button class=\"w3-button w3-block w3-teal\" click.delegate=\"cashIn()\">Confirm</button></p><p><button class=\"w3-button w3-block w3-red\" click.delegate=\"clear()\">Clear</button></p></div></div></div></div><div class=\"w3-row-padding\"></div><div style=\"display:none\"><compose view-model=\"./receipt\" id=\"receiptpage\"></compose></div><iframe id=\"receiptprint\" name=\"receiptiframe\" style=\"visibility:hidden;position:fixed;z-index:-1\"></iframe></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-red\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>Receipt</h3></header><div class=\"w3-container\"><h2>Change</h2><p>${order.change | phpFormat}</p></div></div></div><footer class=\"w3-container w3-red w3-center w3-margin-top\" style=\"width:100%;bottom:0;position:fixed\"><p>Find me on social media.</p><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p></footer></template>"; });
define('text!product/add.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"register()\"><p><select class=\"w3-input w3-text-black\" value.bind=\"selectedSupplier\" change.delegate=\"changeSupplier()\"><option>Choose a supplier</option><option value.bind=\"item.id\" repeat.for=\"item of selectSupplier\">${item.company}</option></select></p><p><select class=\"w3-input w3-text-black\" value.bind=\"selectedProduct\" change.delegate=\"chooseProduct()\"><option>Choose product</option><option value.bind=\"item.id\" repeat.for=\"item of selectProduct\">${item.description}</option></select></p><img id=\"imgProductPreview\" src=\"${product.pic}\" width=\"100\" height=\"100\"><p><label class=\"w3-text-black\">Cost</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.cost\"></p><p><label class=\"w3-text-black\">Quantity</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.quantity\"></p><p><label class=\"w3-text-black\">Expiration Date</label><input class=\"w3-input w3-text-black\" type=\"date\" value.bind=\"product.expire_date\"></p><button class=\"w3-btn w3-blue-grey\">Register</button></form></div></template>"; });
define('text!product/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\" click.delegate=\"openUserInfo()\"><img src=\"${user.pic}\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-black\"><h2 style=\"color:red;text-shadow:0 0 15px #fff\">${user.name}</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.description}</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-pink\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.username}</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-pink\"></i>1224435534</p><p><a href click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-pink\"></i>Logout</a></p><hr><p class=\"w3-large\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-pink\"></i>Stocks</b></p><p>Chedings 1/4 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:90%\">90%</div></div><p>Crispy Garlic Hot Peanut</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:80%\"><div class=\"w3-center w3-text-white\">80%</div></div></div><p>Chedings 1/2 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:75%\">75%</div></div><p>Peanut Butter</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:50%\">50%</div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>Dashboard</h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-pink\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-pink\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-pink w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p></footer></template>"; });
define('text!product/edit.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgProductPreview\" alt=\"product image\" src=\"${product.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"productImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-black\">Description</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.description\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Cost</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.cost | phpFormat\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Discount(optional)</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.discount\"></p><p><label class=\"w3-text-black\">Quantity</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.quantity\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Name of supplier</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.supplier_id\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Expiration Date</label><input class=\"w3-input w3-text-black\" type=\"date\" value.bind=\"product.expire_date\"></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!product/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><button click.delegate=\"activate()\" class=\"w3-large button-none\"><i class=\"fa fa-user\"></i>List</button> <button click.delegate=\"addProduct()\" class=\"w3-large button-none\" show.bind=\"usertypeRights\"><i class=\"fa fa-plus\"></i>Add Product</button><compose view-model=\"${_url}\"></compose></div></template>"; });
define('text!product/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgPreview\" alt=\"your image\" src=\"${user.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"FileUploadImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\" disabled=\"disabled\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!product/view.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><ul class=\"w3-ul w3-card-4 frame-limit-50\"><li class=\"w3-padding-16 w3-hover-gray\" repeat.for=\"items of product\"><span click.delegate=\"\" class=\"w3-right\" show.bind=\"usertypeRights\"><button click.delegate=\"editProduct(items.id)\">Edit</button> <button click.delegate=\"deleteProduct(items.id)\">Delete</button> </span><img src=\"${items.pic}\" class=\"w3-left w3-margin-right\" style=\"width:50px;height:50px\"> <span class=\"w3-large\">${items.description}</span><br><span>Pin #: ${items.pin_number} | Price: ${items.cost | phpFormat} | Quantity: ${items.left_quantity}</span></li></ul></template>"; });
define('text!reports/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><p><label class=\"w3-text-black\">Start Date</label><input class=\"w3-input w3-text-black\" type=\"date\" value.bind=\"startdate\"></p><p><label class=\"w3-text-black\">End Date</label><input class=\"w3-input w3-text-black\" type=\"date\" value.bind=\"enddate\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"selectedreports\"><option>Select a category to be printed</option><option value.bind=\"1\">Deleted Products</option><option value.bind=\"2\">Deleted Employee</option><option value.bind=\"3\">Sales Report</option></select></p><button click.delegate=\"print()\" class=\"w3-large\"><i class=\"fa fa-print\"></i>Print</button> <button click.delegate=\"viewReport()\" class=\"w3-large\"><i class=\"fa fa-print\"></i>View Report</button></div><div style=\"display:none\"><compose view-model=\"./print\" id=\"reportprintpage\"></compose></div><iframe id=\"reportprint\" name=\"reportprint\" style=\"visibility:hidden;position:fixed;z-index:-1\"></iframe></template>"; });
define('text!reports/print.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><require from=\"../ui-helper/date-format\"></require><style>.print{margin:0;text-align:center}.print table{width:100%;border-collapse:collapse}.print table thead td{text-align:center}.print table td{border:1px solid;padding:10px}.print table tr{margin:0}@page{size:landscape}</style><div class=\"print\"><h2>${reports.title} Report</h2><table if.bind=\"selectedreports == '1'\"><thead><tr><td>#</td><td>Pin #</td><td>Description</td><td>Price</td><td>Quantity</td><td>Expire Date</td><td>Date Added</td><td>Supplier</td><td>Date Deleted</td></tr></thead><tbody><tr repeat.for=\"items of reports.products\"><td>${($index+1)}</td><td>${items.pin_number}</td><td>${items.description}</td><td>${items.cost | phpFormat}</td><td>${items.quantity}</td><td>${items.expire_date}</td><td>${items.date_added}</td><td>${items.supplier_id}</td><td>${items.date_deleted}</td></tr><tr if.bind=\"reports.products.length==0\"><td colspan=\"9\" style=\"text-align:center\">No data</td></tr></tbody></table><table if.bind=\"selectedreports == '2'\"><thead><tr><td>#</td><td>Username</td><td>First Name</td><td>Middle Name</td><td>Last Name</td><td>Date Deleted</td></tr></thead><tbody><tr repeat.for=\"items of reports.products\"><td>${($index+1)}</td><td>${items.username}</td><td>${items.firstname}</td><td>${items.middlename}</td><td>${items.lastname}</td><td>${items.date_deleted}</td></tr><tr if.bind=\"reports.products.length==0\"><td colspan=\"9\" style=\"text-align:center\">No data</td></tr></tbody></table><table if.bind=\"selectedreports == '3'\"><thead><tr><td>#</td><td>Sale Date</td><td>Sales</td></tr></thead><tbody><tr repeat.for=\"items of reports.products\"><td>${($index+1)}</td><td>${items.saledate | dateFormat}</td><td>${items.sales | phpFormat}</td></tr><tr if.bind=\"reports.products.length==0\"><td colspan=\"9\" style=\"text-align:center\">No data</td></tr></tbody></table></div></template>"; });
define('text!reports/view.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><div class=\"report-button\"><button class=\"w3-large\" click.delegate=\"back()\">Back</button> <button class=\"w3-large\" onclick=\"window.print()\">Print</button></div><div class=\"report-page\" repeat.for=\"report of table.calendar\" if.bind=\"selectedreports == '3'\"><div style=\"text-align:center\"><h2>Sales Report For ${table.month[$index]}</h2></div><table class=\"report-month\"><thead class=\"report-header\"><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td><td>Total</td></tr></thead><tbody><tr repeat.for=\"tr of report\"><td repeat.for=\"td of tr\">${td}</td></tr><tr if.bind=\"report.length>0\"><td colspan=\"8\" style=\"text-align:center\">Grand Total: ${table.grandtotal[$index]}</td></tr><tr if.bind=\"report.length==0\"><td colspan=\"8\" style=\"text-align:center\">No Reports</td></tr></tbody></table></div><div class=\"report-page\" if.bind=\"selectedreports == '2'\"><div style=\"text-align:center\"><h2>Deleted Employees Report</h2></div><table class=\"report-normal\"><thead><tr><td>#</td><td>Username</td><td>First Name</td><td>Middle Name</td><td>Last Name</td><td>Date Deleted</td></tr></thead><tbody><tr repeat.for=\"items of reports.products\"><td>${($index+1)}</td><td>${items.username}</td><td>${items.firstname}</td><td>${items.middlename}</td><td>${items.lastname}</td><td>${items.date_deleted}</td></tr><tr if.bind=\"reports.products.length==0\"><td colspan=\"9\" style=\"text-align:center\">No data</td></tr></tbody></table></div><div class=\"report-page\" if.bind=\"selectedreports == '1'\"><div style=\"text-align:center\"><h2>Deleted Product Report</h2></div><table class=\"report-normal\"><thead><tr><td>#</td><td>Pin #</td><td>Description</td><td>Price</td><td>Quantity</td><td>Expire Date</td><td>Date Added</td><td>Supplier</td><td>Date Deleted</td></tr></thead><tbody><tr repeat.for=\"items of reports.products\"><td>${($index+1)}</td><td>${items.pin_number}</td><td>${items.description}</td><td>${items.cost | phpFormat}</td><td>${items.quantity}</td><td>${items.expire_date}</td><td>${items.date_added}</td><td>${items.supplier_id}</td><td>${items.date_deleted}</td></tr><tr if.bind=\"reports.products.length==0\"><td colspan=\"9\" style=\"text-align:center\">No data</td></tr></tbody></table></div></template>"; });
define('text!restock/add.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"register()\"><img id=\"imgProductPreview\" alt=\"product image\" src=\"${product.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"productImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-black\">Description</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.description\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Cost</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.cost | phpFormat\"></p><p><label class=\"w3-text-black\">Discount(optional)</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.discount\"></p><p><label class=\"w3-text-black\">Quantity</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.quantity\"></p><p><label class=\"w3-text-black\">Name of supplier</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.supplier_id\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Expiration Date</label><input class=\"w3-input w3-text-black\" type=\"date\" value.bind=\"product.expire_date\"></p><button class=\"w3-btn w3-blue-grey\">Restock</button></form></div></template>"; });
define('text!restock/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\" click.delegate=\"openUserInfo()\"><img src=\"${user.pic}\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-black\"><h2 style=\"color:red;text-shadow:0 0 15px #fff\">${user.name}</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.description}</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-pink\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-pink\"></i>${user.username}</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-pink\"></i>1224435534</p><p><a href click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-pink\"></i>Logout</a></p><hr><p class=\"w3-large\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-pink\"></i>Stocks</b></p><p>Chedings 1/4 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:90%\">90%</div></div><p>Crispy Garlic Hot Peanut</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:80%\"><div class=\"w3-center w3-text-white\">80%</div></div></div><p>Chedings 1/2 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:75%\">75%</div></div><p>Peanut Butter</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-pink\" style=\"width:50%\">50%</div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-pink\"></i>Dashboard</h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-pink\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-pink\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-pink w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p></footer></template>"; });
define('text!restock/edit.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgProductPreview\" alt=\"product image\" src=\"${product.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"productImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-black\">Description</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.description\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Cost</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.cost | phpFormat\" disabled=\"disabled\"></p><p><label class=\"w3-text-black\">Discount(optional)</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.discount\"></p><p><label class=\"w3-text-black\">Name of supplier</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.supplier_id\" disabled=\"disabled\"></p><button class=\"w3-btn w3-blue-grey\">Discount the product?</button></form></div></template>"; });
define('text!restock/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><button click.delegate=\"activate()\" class=\"w3-large button-none\"><i class=\"fa fa-user\"></i>List</button><compose view-model=\"${_url}\"></compose></div></template>"; });
define('text!restock/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><img id=\"imgPreview\" alt=\"your image\" src=\"${user.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"FileUploadImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Username</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"user.username\"></p><p><select class=\"w3-input w3-text-black\" value.bind=\"user.type\" disabled=\"disabled\"><option value.bind=\"item.type\" repeat.for=\"item of selectType\">${item.description}</option></select></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!restock/view.html', ['module'], function(module) { module.exports = "<template><require from=\"../ui-helper/php-format\"></require><ul class=\"w3-ul w3-card-4 frame-limit-50\"><li class=\"w3-padding-16 w3-hover-gray\" repeat.for=\"items of product\" if.bind=\"validateItem(items)\"><span click.delegate=\"\" class=\"w3-right\" show.bind=\"usertypeRights\"><button click.delegate=\"addProduct(items.id)\" if.bind=\"restock(items)\">Restock</button> <button click.delegate=\"editProduct(items.id)\" if.bind=\"discounted(items)\">${items.no_of_days} days left</button> <button click.delegate=\"removeProduct(items.id)\" if.bind=\"expired(items)\">Expired</button> <button click.delegate=\"removeProduct(items.id)\" if.bind=\"toBeDeleted(items)\">Delete? ${items.no_of_days} days left</button> </span><img src=\"${items.pic}\" class=\"w3-left w3-margin-right\" style=\"width:50px;height:50px\"> <span class=\"w3-large\">${items.description}</span><br><span>Pin #: ${items.pin_number} | Price: ${items.cost | phpFormat} | Stocks: ${items.quantity}/${items.totalquantity}</span></li></ul></template>"; });
define('text!supplier/add-product.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"register_product()\"><img id=\"imgProductPreview\" alt=\"product image\" src=\"${product.pic}\" width=\"100\" height=\"100\"> <input type=\"file\" id=\"productImage\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload()\"><p><label class=\"w3-text-black\">Name of supplier</label><select class=\"w3-input w3-text-black\" value.bind=\"product.supplier_id\"><option value.bind=\"item.id\" repeat.for=\"item of selectType\">${item.company}</option></select></p><p><label class=\"w3-text-black\">Description</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"product.description\"></p><button class=\"w3-btn w3-blue-grey\">Register</button></form></div></template>"; });
define('text!supplier/add.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"register()\"><p><label class=\"w3-text-black\">Company Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.company\"></p><p><label class=\"w3-text-black\">Contact Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.contact_name\"></p><p><label class=\"w3-text-black\">Address</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.address\"></p><p><label class=\"w3-text-black\">Phone #</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.phone\"></p><button class=\"w3-btn w3-blue-grey\">Add</button></form></div></template>"; });
define('text!supplier/edit.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><form class=\"w3-container\" submit.delegate=\"save()\"><p><label class=\"w3-text-black\">Company Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.company\"></p><p><label class=\"w3-text-black\">Contact Name</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.contact_name\"></p><p><label class=\"w3-text-black\">Address</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.address\"></p><p><label class=\"w3-text-black\">Phone #</label><input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"supplier.phone\"></p><button class=\"w3-btn w3-blue-grey\">Update</button></form></div></template>"; });
define('text!supplier/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><button click.delegate=\"activate()\" class=\"w3-large button-none\"><i class=\"fa fa-user\"></i>List</button> <button click.delegate=\"addSupplier()\" class=\"w3-large button-none\"><i class=\"fa fa-plus\"></i>Add Supplier</button> <button click.delegate=\"addProduct()\" class=\"w3-large button-none\"><i class=\"fa fa-plus\"></i>Add Product</button><compose view-model=\"${_url}\"></compose></div></template>"; });
define('text!supplier/view-product.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16 frame-limit-50\"><ul class=\"w3-ul w3-card-4 frame-limit-50\"><li class=\"w3-padding-16 w3-hover-gray\" repeat.for=\"items of productArr\"><span click.delegate=\"\" class=\"w3-right\"><button click.delegate=\"editProduct($index)\">Edit</button> <button click.delegate=\"deleteProduct(items)\">Delete</button> </span><img src=\"${items.pic}\" class=\"w3-left w3-margin-right\" id=\"imgProductPreview${$index}\" style=\"width:50px;height:50px\"> <span class=\"w3-large\"><span class=\"hide${$index}\">${items.description}<br><br></span><span class=\"show${$index}\" style=\"display:none;font-size:12px\"><input type=\"file\" id=\"productImage${$index}\" accept=\".png,.jpg,.jpeg\" style=\"border:none\" change.delegate=\"upload($index)\"> <input class=\"w3-input w3-text-black\" type=\"text\" value.bind=\"items.description\"> <button click.delegate=\"updateProduct(items.id)\">Update</button> <button click.delegate=\"revert($index)\">Back</button></span></span></li></ul></div></template>"; });
define('text!supplier/view.html', ['module'], function(module) { module.exports = "<template><ul class=\"w3-ul w3-card-4 frame-limit-50\"><li class=\"w3-padding-16 w3-hover-gray\" repeat.for=\"info of supplier\"><span click.delegate=\"\" class=\"w3-right\"><button click.delegate=\"editSupplier(info.id)\">Edit</button> <button click.delegate=\"viewProduct(info.id)\">Products</button> <button click.delegate=\"deleteSupplier(info.id)\">Delete</button> </span><span class=\"w3-large\">${info.company}</span><br><span>Address: ${info.address} | Phone #: ${info.phone}</span></li></ul></template>"; });
//# sourceMappingURL=app-bundle.js.map