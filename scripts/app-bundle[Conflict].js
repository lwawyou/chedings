define('app',["exports", "./resources/js/main"], function (exports, _main) {
  "use strict";

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
      config.title = 'Chedings';
      config.options.pushState = true;
      config.options.root = "/";
      config.map([{
        route: '/',
        moduleId: 'admin/login',
        title: 'Administrator'
      }, {
        route: 'admin/dashboard',
        moduleId: 'admin/dashboard',
        title: 'Dashboard'
      }]);

      this.router = router;
    };

    App.prototype.attached = function attached() {
      console.log("Initializing resources.");
      _main.Main.loginJS();
    };

    return App;
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
            return "http://localhost/GoogleDrive/Documents/Projects/Chedings/aurelia/server/query.php";
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
define('main',['exports', './environment'], function (exports, _environment) {
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
define('admin/dashboard',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Dashboard = exports.Dashboard = function () {
        function Dashboard() {
            _classCallCheck(this, Dashboard);

            this.dashboard = [];

            this.dashboard = this.config();
        }

        Dashboard.prototype.triggerDashboardButton = function triggerDashboardButton(data) {
            this.contentheader = data.name || "";
            this.contenturl = data.module || "";
            document.getElementById('id01').style.display = 'block';
        };

        Dashboard.prototype.openCity = function openCity(cityName) {
            var i;
            var x = document.getElementsByClassName("city");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            document.getElementById(cityName).style.display = "block";
        };

        Dashboard.prototype.config = function config() {
            return [{
                name: "Supplier",
                module: ""
            }, {
                name: "Reports",
                module: ""
            }, {
                name: "Products",
                module: ""
            }, {
                name: "Employee",
                module: "../employee/index"
            }];
        };

        return Dashboard;
    }();
});
define('admin/login',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', '../resources/js/main', '../api/index'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter, _main, _index) {
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
            localStorage.setItem('name', "Admin");
            localStorage.setItem('user', this.user.username);
            this.api.authLogin(this.user, function (data) {
                if (data.length > 0) self.router.navigate(data);else alert("Invalid");
            });
        };

        return Login;
    }()) || _class);
});
define('api/index',["exports", "../config"], function (exports, _config) {
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
                var type = _data[0]["type"];
                switch (type) {
                    case '1':
                        callback("admin/dashboard");
                        break;
                    case '2':
                        callback("manager/dashboard");
                        break;
                    case '3':
                        callback("employee/dashboard");
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

        return Api;
    }();
});
define('employee/add',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Add = exports.Add = function () {
        function Add() {
            _classCallCheck(this, Add);
        }

        Add.prototype.activate = function activate() {};

        return Add;
    }();
});
define('employee/edit',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Edit = exports.Edit = function () {
        function Edit() {
            _classCallCheck(this, Edit);

            this.employee = [];

            this.employee = this.loadEmployee();
        }

        Edit.prototype.loadEmployee = function loadEmployee() {
            return [{
                name: "Employee Name 1",
                type: "Administrator"
            }, {
                name: "Employee Name 2",
                type: "Employee"
            }, {
                name: "Employee Name 3",
                type: "Manager"
            }, {
                name: "Employee Name 4",
                type: "Employee"
            }];
        };

        return Edit;
    }();
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

            this._url = this.route()[0]["module"];
        }

        Employee.prototype.activate = function activate() {
            this._url = this.route()[0]["module"];
        };

        Employee.prototype.addEmployee = function addEmployee() {
            this._url = this.route()[1]["module"];
        };

        Employee.prototype.route = function route() {
            return [{
                name: "Edit",
                module: "./edit"
            }, {
                name: "Add",
                module: "./add"
            }];
        };

        return Employee;
    }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/js/index',[], function () {
  'use strict';

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
});
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
define('text!app.html', ['module'], function(module) { module.exports = "<template><router-view></router-view></template>"; });
define('text!admin/dashboard.html', ['module'], function(module) { module.exports = "<template><require from=\"../resources/css/w3.css\"></require><div class=\"w3-content w3-margin-top\" style=\"max-width:1400px\"><div class=\"w3-row-padding\"><div class=\"w3-third\"><div class=\"w3-white w3-text-grey w3-card-4\"><div class=\"w3-display-container\"><img src=\"../src/resources/img/avatar_hat.jpg\" style=\"width:100%\" alt=\"Avatar\"><div class=\"w3-display-bottomleft w3-container w3-text-black\"><h2>Jane Doe</h2></div></div><div class=\"w3-container\"><p><i class=\"fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-red\"></i>Administrator</p><p><i class=\"fa fa-home fa-fw w3-margin-right w3-large w3-text-red\"></i>Iligan City, Philippines</p><p><i class=\"fa fa-envelope fa-fw w3-margin-right w3-large w3-text-red\"></i>example@mail.com</p><p><i class=\"fa fa-phone fa-fw w3-margin-right w3-large w3-text-red\"></i>1224435534</p><p><i class=\"fa fa-sign-out fa-fw w3-margin-right w3-large w3-text-red\"></i>Logout</p><hr><p class=\"w3-large\"><b><i class=\"fa fa-shopping-basket fa-fw w3-margin-right w3-text-red\"></i>Stocks</b></p><p>Chedings 1/4 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-red\" style=\"width:90%\">90%</div></div><p>Crispy Garlic Hot Peanut</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-red\" style=\"width:80%\"><div class=\"w3-center w3-text-white\">80%</div></div></div><p>Chedings 1/2 Kg</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-red\" style=\"width:75%\">75%</div></div><p>Peanut Butter</p><div class=\"w3-light-grey w3-round-xlarge w3-small\"><div class=\"w3-container w3-center w3-round-xlarge w3-red\" style=\"width:50%\">50%</div></div><br><br></div></div><br></div><div class=\"w3-twothird\"><div class=\"w3-container w3-card-2 w3-white w3-margin-bottom\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-info fa-fw w3-margin-right w3-xxlarge w3-text-red\"></i>About</h2><div class=\"w3-container\"><h5 class=\"w3-opacity\"><b>CHEDING'S PEANUTS, INC. FOOD PROCESSING</b></h5><p>&nbsp;Cheding’s Peanuts store has been in Iligan City for decades. Tourists and travelers flock the store for its numerous delicacies to take home to family and friends. Cheding’s Peanuts peak season is on City Fiesta time (September), Christmas Season and the summer months. These packs come in different sizes, 1 kilo, ½ kilo, 370 grams, 50 grams, ¼ kilo and 200 grams foil pack. Cheding’s bestseller is ¼ kilo pack at P42.00.</p><p>&nbsp;For forty-seven (47) years, the business remains steadfast in producing quality peanut products for the Filipinos here and abroad as well as with the other nationalities who could taste the peanuts.</p><p>&nbsp;A pinch of love like salt, and keeping faith with tradition made for the success of Cheding's Peanuts, THE ORIGINAL ILIGAN' S PRIDE, \"NAG-IISANG PASALUBONG NG ILIGAN\".</p><hr></div></div><div class=\"w3-container w3-card-2 w3-white\"><h2 class=\"w3-text-grey w3-padding-16\"><i class=\"fa fa-bars fa-fw w3-margin-right w3-xxlarge w3-text-red\"></i>Dashboard</h2><div class=\"w3-container\"><div repeat.for=\"item of dashboard\" class=\"w3-panel w3-red\" click.delegate=\"triggerDashboardButton(item)\"><p>${item.name}</p></div></div></div></div></div></div><div id=\"id01\" class=\"w3-modal\"><div class=\"w3-modal-content w3-animate-top\"><header class=\"w3-container w3-red\"><span onclick='document.getElementById(\"id01\").style.display=\"none\"' class=\"w3-button w3-display-topright\">&times;</span><h3>${contentheader}</h3></header><div class=\"w3-container\"><compose view-model=\"${contenturl}\"></compose></div></div></div><footer class=\"w3-container w3-red w3-center w3-margin-top\"><p>Find me on social media.</p><i class=\"fa fa-facebook-official w3-hover-opacity\"></i> <i class=\"fa fa-instagram w3-hover-opacity\"></i> <i class=\"fa fa-snapchat w3-hover-opacity\"></i> <i class=\"fa fa-pinterest-p w3-hover-opacity\"></i> <i class=\"fa fa-twitter w3-hover-opacity\"></i> <i class=\"fa fa-linkedin w3-hover-opacity\"></i><p>Powered by <a href=\"http://chedings.com/\" target=\"_blank\">Chedings CO.</a></p></footer></template>"; });
define('text!resources/css/font-awesome.min.css', ['module'], function(module) { module.exports = "/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}.fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.fa-lg{font-size:1.33333333em;line-height:.75em;vertical-align:-15%}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-fw{width:1.28571429em;text-align:center}.fa-ul{padding-left:0;margin-left:2.14285714em;list-style-type:none}.fa-ul>li{position:relative}.fa-li{position:absolute;left:-2.14285714em;width:2.14285714em;top:.14285714em;text-align:center}.fa-li.fa-lg{left:-1.85714286em}.fa-border{padding:.2em .25em .15em;border:solid .08em #eee;border-radius:.1em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left{margin-right:.3em}.fa.fa-pull-right{margin-left:.3em}.pull-right{float:right}.pull-left{float:left}.fa.pull-left{margin-right:.3em}.fa.pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.fa-rotate-90{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";-webkit-transform:scale(-1, 1);-ms-transform:scale(-1, 1);transform:scale(-1, 1)}.fa-flip-vertical{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";-webkit-transform:scale(1, -1);-ms-transform:scale(1, -1);transform:scale(1, -1)}:root .fa-rotate-90,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-flip-horizontal,:root .fa-flip-vertical{filter:none}.fa-stack{position:relative;display:inline-block;width:2em;height:2em;line-height:2em;vertical-align:middle}.fa-stack-1x,.fa-stack-2x{position:absolute;left:0;width:100%;text-align:center}.fa-stack-1x{line-height:inherit}.fa-stack-2x{font-size:2em}.fa-inverse{color:#fff}.fa-glass:before{content:\"\\f000\"}.fa-music:before{content:\"\\f001\"}.fa-search:before{content:\"\\f002\"}.fa-envelope-o:before{content:\"\\f003\"}.fa-heart:before{content:\"\\f004\"}.fa-star:before{content:\"\\f005\"}.fa-star-o:before{content:\"\\f006\"}.fa-user:before{content:\"\\f007\"}.fa-film:before{content:\"\\f008\"}.fa-th-large:before{content:\"\\f009\"}.fa-th:before{content:\"\\f00a\"}.fa-th-list:before{content:\"\\f00b\"}.fa-check:before{content:\"\\f00c\"}.fa-remove:before,.fa-close:before,.fa-times:before{content:\"\\f00d\"}.fa-search-plus:before{content:\"\\f00e\"}.fa-search-minus:before{content:\"\\f010\"}.fa-power-off:before{content:\"\\f011\"}.fa-signal:before{content:\"\\f012\"}.fa-gear:before,.fa-cog:before{content:\"\\f013\"}.fa-trash-o:before{content:\"\\f014\"}.fa-home:before{content:\"\\f015\"}.fa-file-o:before{content:\"\\f016\"}.fa-clock-o:before{content:\"\\f017\"}.fa-road:before{content:\"\\f018\"}.fa-download:before{content:\"\\f019\"}.fa-arrow-circle-o-down:before{content:\"\\f01a\"}.fa-arrow-circle-o-up:before{content:\"\\f01b\"}.fa-inbox:before{content:\"\\f01c\"}.fa-play-circle-o:before{content:\"\\f01d\"}.fa-rotate-right:before,.fa-repeat:before{content:\"\\f01e\"}.fa-refresh:before{content:\"\\f021\"}.fa-list-alt:before{content:\"\\f022\"}.fa-lock:before{content:\"\\f023\"}.fa-flag:before{content:\"\\f024\"}.fa-headphones:before{content:\"\\f025\"}.fa-volume-off:before{content:\"\\f026\"}.fa-volume-down:before{content:\"\\f027\"}.fa-volume-up:before{content:\"\\f028\"}.fa-qrcode:before{content:\"\\f029\"}.fa-barcode:before{content:\"\\f02a\"}.fa-tag:before{content:\"\\f02b\"}.fa-tags:before{content:\"\\f02c\"}.fa-book:before{content:\"\\f02d\"}.fa-bookmark:before{content:\"\\f02e\"}.fa-print:before{content:\"\\f02f\"}.fa-camera:before{content:\"\\f030\"}.fa-font:before{content:\"\\f031\"}.fa-bold:before{content:\"\\f032\"}.fa-italic:before{content:\"\\f033\"}.fa-text-height:before{content:\"\\f034\"}.fa-text-width:before{content:\"\\f035\"}.fa-align-left:before{content:\"\\f036\"}.fa-align-center:before{content:\"\\f037\"}.fa-align-right:before{content:\"\\f038\"}.fa-align-justify:before{content:\"\\f039\"}.fa-list:before{content:\"\\f03a\"}.fa-dedent:before,.fa-outdent:before{content:\"\\f03b\"}.fa-indent:before{content:\"\\f03c\"}.fa-video-camera:before{content:\"\\f03d\"}.fa-photo:before,.fa-image:before,.fa-picture-o:before{content:\"\\f03e\"}.fa-pencil:before{content:\"\\f040\"}.fa-map-marker:before{content:\"\\f041\"}.fa-adjust:before{content:\"\\f042\"}.fa-tint:before{content:\"\\f043\"}.fa-edit:before,.fa-pencil-square-o:before{content:\"\\f044\"}.fa-share-square-o:before{content:\"\\f045\"}.fa-check-square-o:before{content:\"\\f046\"}.fa-arrows:before{content:\"\\f047\"}.fa-step-backward:before{content:\"\\f048\"}.fa-fast-backward:before{content:\"\\f049\"}.fa-backward:before{content:\"\\f04a\"}.fa-play:before{content:\"\\f04b\"}.fa-pause:before{content:\"\\f04c\"}.fa-stop:before{content:\"\\f04d\"}.fa-forward:before{content:\"\\f04e\"}.fa-fast-forward:before{content:\"\\f050\"}.fa-step-forward:before{content:\"\\f051\"}.fa-eject:before{content:\"\\f052\"}.fa-chevron-left:before{content:\"\\f053\"}.fa-chevron-right:before{content:\"\\f054\"}.fa-plus-circle:before{content:\"\\f055\"}.fa-minus-circle:before{content:\"\\f056\"}.fa-times-circle:before{content:\"\\f057\"}.fa-check-circle:before{content:\"\\f058\"}.fa-question-circle:before{content:\"\\f059\"}.fa-info-circle:before{content:\"\\f05a\"}.fa-crosshairs:before{content:\"\\f05b\"}.fa-times-circle-o:before{content:\"\\f05c\"}.fa-check-circle-o:before{content:\"\\f05d\"}.fa-ban:before{content:\"\\f05e\"}.fa-arrow-left:before{content:\"\\f060\"}.fa-arrow-right:before{content:\"\\f061\"}.fa-arrow-up:before{content:\"\\f062\"}.fa-arrow-down:before{content:\"\\f063\"}.fa-mail-forward:before,.fa-share:before{content:\"\\f064\"}.fa-expand:before{content:\"\\f065\"}.fa-compress:before{content:\"\\f066\"}.fa-plus:before{content:\"\\f067\"}.fa-minus:before{content:\"\\f068\"}.fa-asterisk:before{content:\"\\f069\"}.fa-exclamation-circle:before{content:\"\\f06a\"}.fa-gift:before{content:\"\\f06b\"}.fa-leaf:before{content:\"\\f06c\"}.fa-fire:before{content:\"\\f06d\"}.fa-eye:before{content:\"\\f06e\"}.fa-eye-slash:before{content:\"\\f070\"}.fa-warning:before,.fa-exclamation-triangle:before{content:\"\\f071\"}.fa-plane:before{content:\"\\f072\"}.fa-calendar:before{content:\"\\f073\"}.fa-random:before{content:\"\\f074\"}.fa-comment:before{content:\"\\f075\"}.fa-magnet:before{content:\"\\f076\"}.fa-chevron-up:before{content:\"\\f077\"}.fa-chevron-down:before{content:\"\\f078\"}.fa-retweet:before{content:\"\\f079\"}.fa-shopping-cart:before{content:\"\\f07a\"}.fa-folder:before{content:\"\\f07b\"}.fa-folder-open:before{content:\"\\f07c\"}.fa-arrows-v:before{content:\"\\f07d\"}.fa-arrows-h:before{content:\"\\f07e\"}.fa-bar-chart-o:before,.fa-bar-chart:before{content:\"\\f080\"}.fa-twitter-square:before{content:\"\\f081\"}.fa-facebook-square:before{content:\"\\f082\"}.fa-camera-retro:before{content:\"\\f083\"}.fa-key:before{content:\"\\f084\"}.fa-gears:before,.fa-cogs:before{content:\"\\f085\"}.fa-comments:before{content:\"\\f086\"}.fa-thumbs-o-up:before{content:\"\\f087\"}.fa-thumbs-o-down:before{content:\"\\f088\"}.fa-star-half:before{content:\"\\f089\"}.fa-heart-o:before{content:\"\\f08a\"}.fa-sign-out:before{content:\"\\f08b\"}.fa-linkedin-square:before{content:\"\\f08c\"}.fa-thumb-tack:before{content:\"\\f08d\"}.fa-external-link:before{content:\"\\f08e\"}.fa-sign-in:before{content:\"\\f090\"}.fa-trophy:before{content:\"\\f091\"}.fa-github-square:before{content:\"\\f092\"}.fa-upload:before{content:\"\\f093\"}.fa-lemon-o:before{content:\"\\f094\"}.fa-phone:before{content:\"\\f095\"}.fa-square-o:before{content:\"\\f096\"}.fa-bookmark-o:before{content:\"\\f097\"}.fa-phone-square:before{content:\"\\f098\"}.fa-twitter:before{content:\"\\f099\"}.fa-facebook-f:before,.fa-facebook:before{content:\"\\f09a\"}.fa-github:before{content:\"\\f09b\"}.fa-unlock:before{content:\"\\f09c\"}.fa-credit-card:before{content:\"\\f09d\"}.fa-feed:before,.fa-rss:before{content:\"\\f09e\"}.fa-hdd-o:before{content:\"\\f0a0\"}.fa-bullhorn:before{content:\"\\f0a1\"}.fa-bell:before{content:\"\\f0f3\"}.fa-certificate:before{content:\"\\f0a3\"}.fa-hand-o-right:before{content:\"\\f0a4\"}.fa-hand-o-left:before{content:\"\\f0a5\"}.fa-hand-o-up:before{content:\"\\f0a6\"}.fa-hand-o-down:before{content:\"\\f0a7\"}.fa-arrow-circle-left:before{content:\"\\f0a8\"}.fa-arrow-circle-right:before{content:\"\\f0a9\"}.fa-arrow-circle-up:before{content:\"\\f0aa\"}.fa-arrow-circle-down:before{content:\"\\f0ab\"}.fa-globe:before{content:\"\\f0ac\"}.fa-wrench:before{content:\"\\f0ad\"}.fa-tasks:before{content:\"\\f0ae\"}.fa-filter:before{content:\"\\f0b0\"}.fa-briefcase:before{content:\"\\f0b1\"}.fa-arrows-alt:before{content:\"\\f0b2\"}.fa-group:before,.fa-users:before{content:\"\\f0c0\"}.fa-chain:before,.fa-link:before{content:\"\\f0c1\"}.fa-cloud:before{content:\"\\f0c2\"}.fa-flask:before{content:\"\\f0c3\"}.fa-cut:before,.fa-scissors:before{content:\"\\f0c4\"}.fa-copy:before,.fa-files-o:before{content:\"\\f0c5\"}.fa-paperclip:before{content:\"\\f0c6\"}.fa-save:before,.fa-floppy-o:before{content:\"\\f0c7\"}.fa-square:before{content:\"\\f0c8\"}.fa-navicon:before,.fa-reorder:before,.fa-bars:before{content:\"\\f0c9\"}.fa-list-ul:before{content:\"\\f0ca\"}.fa-list-ol:before{content:\"\\f0cb\"}.fa-strikethrough:before{content:\"\\f0cc\"}.fa-underline:before{content:\"\\f0cd\"}.fa-table:before{content:\"\\f0ce\"}.fa-magic:before{content:\"\\f0d0\"}.fa-truck:before{content:\"\\f0d1\"}.fa-pinterest:before{content:\"\\f0d2\"}.fa-pinterest-square:before{content:\"\\f0d3\"}.fa-google-plus-square:before{content:\"\\f0d4\"}.fa-google-plus:before{content:\"\\f0d5\"}.fa-money:before{content:\"\\f0d6\"}.fa-caret-down:before{content:\"\\f0d7\"}.fa-caret-up:before{content:\"\\f0d8\"}.fa-caret-left:before{content:\"\\f0d9\"}.fa-caret-right:before{content:\"\\f0da\"}.fa-columns:before{content:\"\\f0db\"}.fa-unsorted:before,.fa-sort:before{content:\"\\f0dc\"}.fa-sort-down:before,.fa-sort-desc:before{content:\"\\f0dd\"}.fa-sort-up:before,.fa-sort-asc:before{content:\"\\f0de\"}.fa-envelope:before{content:\"\\f0e0\"}.fa-linkedin:before{content:\"\\f0e1\"}.fa-rotate-left:before,.fa-undo:before{content:\"\\f0e2\"}.fa-legal:before,.fa-gavel:before{content:\"\\f0e3\"}.fa-dashboard:before,.fa-tachometer:before{content:\"\\f0e4\"}.fa-comment-o:before{content:\"\\f0e5\"}.fa-comments-o:before{content:\"\\f0e6\"}.fa-flash:before,.fa-bolt:before{content:\"\\f0e7\"}.fa-sitemap:before{content:\"\\f0e8\"}.fa-umbrella:before{content:\"\\f0e9\"}.fa-paste:before,.fa-clipboard:before{content:\"\\f0ea\"}.fa-lightbulb-o:before{content:\"\\f0eb\"}.fa-exchange:before{content:\"\\f0ec\"}.fa-cloud-download:before{content:\"\\f0ed\"}.fa-cloud-upload:before{content:\"\\f0ee\"}.fa-user-md:before{content:\"\\f0f0\"}.fa-stethoscope:before{content:\"\\f0f1\"}.fa-suitcase:before{content:\"\\f0f2\"}.fa-bell-o:before{content:\"\\f0a2\"}.fa-coffee:before{content:\"\\f0f4\"}.fa-cutlery:before{content:\"\\f0f5\"}.fa-file-text-o:before{content:\"\\f0f6\"}.fa-building-o:before{content:\"\\f0f7\"}.fa-hospital-o:before{content:\"\\f0f8\"}.fa-ambulance:before{content:\"\\f0f9\"}.fa-medkit:before{content:\"\\f0fa\"}.fa-fighter-jet:before{content:\"\\f0fb\"}.fa-beer:before{content:\"\\f0fc\"}.fa-h-square:before{content:\"\\f0fd\"}.fa-plus-square:before{content:\"\\f0fe\"}.fa-angle-double-left:before{content:\"\\f100\"}.fa-angle-double-right:before{content:\"\\f101\"}.fa-angle-double-up:before{content:\"\\f102\"}.fa-angle-double-down:before{content:\"\\f103\"}.fa-angle-left:before{content:\"\\f104\"}.fa-angle-right:before{content:\"\\f105\"}.fa-angle-up:before{content:\"\\f106\"}.fa-angle-down:before{content:\"\\f107\"}.fa-desktop:before{content:\"\\f108\"}.fa-laptop:before{content:\"\\f109\"}.fa-tablet:before{content:\"\\f10a\"}.fa-mobile-phone:before,.fa-mobile:before{content:\"\\f10b\"}.fa-circle-o:before{content:\"\\f10c\"}.fa-quote-left:before{content:\"\\f10d\"}.fa-quote-right:before{content:\"\\f10e\"}.fa-spinner:before{content:\"\\f110\"}.fa-circle:before{content:\"\\f111\"}.fa-mail-reply:before,.fa-reply:before{content:\"\\f112\"}.fa-github-alt:before{content:\"\\f113\"}.fa-folder-o:before{content:\"\\f114\"}.fa-folder-open-o:before{content:\"\\f115\"}.fa-smile-o:before{content:\"\\f118\"}.fa-frown-o:before{content:\"\\f119\"}.fa-meh-o:before{content:\"\\f11a\"}.fa-gamepad:before{content:\"\\f11b\"}.fa-keyboard-o:before{content:\"\\f11c\"}.fa-flag-o:before{content:\"\\f11d\"}.fa-flag-checkered:before{content:\"\\f11e\"}.fa-terminal:before{content:\"\\f120\"}.fa-code:before{content:\"\\f121\"}.fa-mail-reply-all:before,.fa-reply-all:before{content:\"\\f122\"}.fa-star-half-empty:before,.fa-star-half-full:before,.fa-star-half-o:before{content:\"\\f123\"}.fa-location-arrow:before{content:\"\\f124\"}.fa-crop:before{content:\"\\f125\"}.fa-code-fork:before{content:\"\\f126\"}.fa-unlink:before,.fa-chain-broken:before{content:\"\\f127\"}.fa-question:before{content:\"\\f128\"}.fa-info:before{content:\"\\f129\"}.fa-exclamation:before{content:\"\\f12a\"}.fa-superscript:before{content:\"\\f12b\"}.fa-subscript:before{content:\"\\f12c\"}.fa-eraser:before{content:\"\\f12d\"}.fa-puzzle-piece:before{content:\"\\f12e\"}.fa-microphone:before{content:\"\\f130\"}.fa-microphone-slash:before{content:\"\\f131\"}.fa-shield:before{content:\"\\f132\"}.fa-calendar-o:before{content:\"\\f133\"}.fa-fire-extinguisher:before{content:\"\\f134\"}.fa-rocket:before{content:\"\\f135\"}.fa-maxcdn:before{content:\"\\f136\"}.fa-chevron-circle-left:before{content:\"\\f137\"}.fa-chevron-circle-right:before{content:\"\\f138\"}.fa-chevron-circle-up:before{content:\"\\f139\"}.fa-chevron-circle-down:before{content:\"\\f13a\"}.fa-html5:before{content:\"\\f13b\"}.fa-css3:before{content:\"\\f13c\"}.fa-anchor:before{content:\"\\f13d\"}.fa-unlock-alt:before{content:\"\\f13e\"}.fa-bullseye:before{content:\"\\f140\"}.fa-ellipsis-h:before{content:\"\\f141\"}.fa-ellipsis-v:before{content:\"\\f142\"}.fa-rss-square:before{content:\"\\f143\"}.fa-play-circle:before{content:\"\\f144\"}.fa-ticket:before{content:\"\\f145\"}.fa-minus-square:before{content:\"\\f146\"}.fa-minus-square-o:before{content:\"\\f147\"}.fa-level-up:before{content:\"\\f148\"}.fa-level-down:before{content:\"\\f149\"}.fa-check-square:before{content:\"\\f14a\"}.fa-pencil-square:before{content:\"\\f14b\"}.fa-external-link-square:before{content:\"\\f14c\"}.fa-share-square:before{content:\"\\f14d\"}.fa-compass:before{content:\"\\f14e\"}.fa-toggle-down:before,.fa-caret-square-o-down:before{content:\"\\f150\"}.fa-toggle-up:before,.fa-caret-square-o-up:before{content:\"\\f151\"}.fa-toggle-right:before,.fa-caret-square-o-right:before{content:\"\\f152\"}.fa-euro:before,.fa-eur:before{content:\"\\f153\"}.fa-gbp:before{content:\"\\f154\"}.fa-dollar:before,.fa-usd:before{content:\"\\f155\"}.fa-rupee:before,.fa-inr:before{content:\"\\f156\"}.fa-cny:before,.fa-rmb:before,.fa-yen:before,.fa-jpy:before{content:\"\\f157\"}.fa-ruble:before,.fa-rouble:before,.fa-rub:before{content:\"\\f158\"}.fa-won:before,.fa-krw:before{content:\"\\f159\"}.fa-bitcoin:before,.fa-btc:before{content:\"\\f15a\"}.fa-file:before{content:\"\\f15b\"}.fa-file-text:before{content:\"\\f15c\"}.fa-sort-alpha-asc:before{content:\"\\f15d\"}.fa-sort-alpha-desc:before{content:\"\\f15e\"}.fa-sort-amount-asc:before{content:\"\\f160\"}.fa-sort-amount-desc:before{content:\"\\f161\"}.fa-sort-numeric-asc:before{content:\"\\f162\"}.fa-sort-numeric-desc:before{content:\"\\f163\"}.fa-thumbs-up:before{content:\"\\f164\"}.fa-thumbs-down:before{content:\"\\f165\"}.fa-youtube-square:before{content:\"\\f166\"}.fa-youtube:before{content:\"\\f167\"}.fa-xing:before{content:\"\\f168\"}.fa-xing-square:before{content:\"\\f169\"}.fa-youtube-play:before{content:\"\\f16a\"}.fa-dropbox:before{content:\"\\f16b\"}.fa-stack-overflow:before{content:\"\\f16c\"}.fa-instagram:before{content:\"\\f16d\"}.fa-flickr:before{content:\"\\f16e\"}.fa-adn:before{content:\"\\f170\"}.fa-bitbucket:before{content:\"\\f171\"}.fa-bitbucket-square:before{content:\"\\f172\"}.fa-tumblr:before{content:\"\\f173\"}.fa-tumblr-square:before{content:\"\\f174\"}.fa-long-arrow-down:before{content:\"\\f175\"}.fa-long-arrow-up:before{content:\"\\f176\"}.fa-long-arrow-left:before{content:\"\\f177\"}.fa-long-arrow-right:before{content:\"\\f178\"}.fa-apple:before{content:\"\\f179\"}.fa-windows:before{content:\"\\f17a\"}.fa-android:before{content:\"\\f17b\"}.fa-linux:before{content:\"\\f17c\"}.fa-dribbble:before{content:\"\\f17d\"}.fa-skype:before{content:\"\\f17e\"}.fa-foursquare:before{content:\"\\f180\"}.fa-trello:before{content:\"\\f181\"}.fa-female:before{content:\"\\f182\"}.fa-male:before{content:\"\\f183\"}.fa-gittip:before,.fa-gratipay:before{content:\"\\f184\"}.fa-sun-o:before{content:\"\\f185\"}.fa-moon-o:before{content:\"\\f186\"}.fa-archive:before{content:\"\\f187\"}.fa-bug:before{content:\"\\f188\"}.fa-vk:before{content:\"\\f189\"}.fa-weibo:before{content:\"\\f18a\"}.fa-renren:before{content:\"\\f18b\"}.fa-pagelines:before{content:\"\\f18c\"}.fa-stack-exchange:before{content:\"\\f18d\"}.fa-arrow-circle-o-right:before{content:\"\\f18e\"}.fa-arrow-circle-o-left:before{content:\"\\f190\"}.fa-toggle-left:before,.fa-caret-square-o-left:before{content:\"\\f191\"}.fa-dot-circle-o:before{content:\"\\f192\"}.fa-wheelchair:before{content:\"\\f193\"}.fa-vimeo-square:before{content:\"\\f194\"}.fa-turkish-lira:before,.fa-try:before{content:\"\\f195\"}.fa-plus-square-o:before{content:\"\\f196\"}.fa-space-shuttle:before{content:\"\\f197\"}.fa-slack:before{content:\"\\f198\"}.fa-envelope-square:before{content:\"\\f199\"}.fa-wordpress:before{content:\"\\f19a\"}.fa-openid:before{content:\"\\f19b\"}.fa-institution:before,.fa-bank:before,.fa-university:before{content:\"\\f19c\"}.fa-mortar-board:before,.fa-graduation-cap:before{content:\"\\f19d\"}.fa-yahoo:before{content:\"\\f19e\"}.fa-google:before{content:\"\\f1a0\"}.fa-reddit:before{content:\"\\f1a1\"}.fa-reddit-square:before{content:\"\\f1a2\"}.fa-stumbleupon-circle:before{content:\"\\f1a3\"}.fa-stumbleupon:before{content:\"\\f1a4\"}.fa-delicious:before{content:\"\\f1a5\"}.fa-digg:before{content:\"\\f1a6\"}.fa-pied-piper-pp:before{content:\"\\f1a7\"}.fa-pied-piper-alt:before{content:\"\\f1a8\"}.fa-drupal:before{content:\"\\f1a9\"}.fa-joomla:before{content:\"\\f1aa\"}.fa-language:before{content:\"\\f1ab\"}.fa-fax:before{content:\"\\f1ac\"}.fa-building:before{content:\"\\f1ad\"}.fa-child:before{content:\"\\f1ae\"}.fa-paw:before{content:\"\\f1b0\"}.fa-spoon:before{content:\"\\f1b1\"}.fa-cube:before{content:\"\\f1b2\"}.fa-cubes:before{content:\"\\f1b3\"}.fa-behance:before{content:\"\\f1b4\"}.fa-behance-square:before{content:\"\\f1b5\"}.fa-steam:before{content:\"\\f1b6\"}.fa-steam-square:before{content:\"\\f1b7\"}.fa-recycle:before{content:\"\\f1b8\"}.fa-automobile:before,.fa-car:before{content:\"\\f1b9\"}.fa-cab:before,.fa-taxi:before{content:\"\\f1ba\"}.fa-tree:before{content:\"\\f1bb\"}.fa-spotify:before{content:\"\\f1bc\"}.fa-deviantart:before{content:\"\\f1bd\"}.fa-soundcloud:before{content:\"\\f1be\"}.fa-database:before{content:\"\\f1c0\"}.fa-file-pdf-o:before{content:\"\\f1c1\"}.fa-file-word-o:before{content:\"\\f1c2\"}.fa-file-excel-o:before{content:\"\\f1c3\"}.fa-file-powerpoint-o:before{content:\"\\f1c4\"}.fa-file-photo-o:before,.fa-file-picture-o:before,.fa-file-image-o:before{content:\"\\f1c5\"}.fa-file-zip-o:before,.fa-file-archive-o:before{content:\"\\f1c6\"}.fa-file-sound-o:before,.fa-file-audio-o:before{content:\"\\f1c7\"}.fa-file-movie-o:before,.fa-file-video-o:before{content:\"\\f1c8\"}.fa-file-code-o:before{content:\"\\f1c9\"}.fa-vine:before{content:\"\\f1ca\"}.fa-codepen:before{content:\"\\f1cb\"}.fa-jsfiddle:before{content:\"\\f1cc\"}.fa-life-bouy:before,.fa-life-buoy:before,.fa-life-saver:before,.fa-support:before,.fa-life-ring:before{content:\"\\f1cd\"}.fa-circle-o-notch:before{content:\"\\f1ce\"}.fa-ra:before,.fa-resistance:before,.fa-rebel:before{content:\"\\f1d0\"}.fa-ge:before,.fa-empire:before{content:\"\\f1d1\"}.fa-git-square:before{content:\"\\f1d2\"}.fa-git:before{content:\"\\f1d3\"}.fa-y-combinator-square:before,.fa-yc-square:before,.fa-hacker-news:before{content:\"\\f1d4\"}.fa-tencent-weibo:before{content:\"\\f1d5\"}.fa-qq:before{content:\"\\f1d6\"}.fa-wechat:before,.fa-weixin:before{content:\"\\f1d7\"}.fa-send:before,.fa-paper-plane:before{content:\"\\f1d8\"}.fa-send-o:before,.fa-paper-plane-o:before{content:\"\\f1d9\"}.fa-history:before{content:\"\\f1da\"}.fa-circle-thin:before{content:\"\\f1db\"}.fa-header:before{content:\"\\f1dc\"}.fa-paragraph:before{content:\"\\f1dd\"}.fa-sliders:before{content:\"\\f1de\"}.fa-share-alt:before{content:\"\\f1e0\"}.fa-share-alt-square:before{content:\"\\f1e1\"}.fa-bomb:before{content:\"\\f1e2\"}.fa-soccer-ball-o:before,.fa-futbol-o:before{content:\"\\f1e3\"}.fa-tty:before{content:\"\\f1e4\"}.fa-binoculars:before{content:\"\\f1e5\"}.fa-plug:before{content:\"\\f1e6\"}.fa-slideshare:before{content:\"\\f1e7\"}.fa-twitch:before{content:\"\\f1e8\"}.fa-yelp:before{content:\"\\f1e9\"}.fa-newspaper-o:before{content:\"\\f1ea\"}.fa-wifi:before{content:\"\\f1eb\"}.fa-calculator:before{content:\"\\f1ec\"}.fa-paypal:before{content:\"\\f1ed\"}.fa-google-wallet:before{content:\"\\f1ee\"}.fa-cc-visa:before{content:\"\\f1f0\"}.fa-cc-mastercard:before{content:\"\\f1f1\"}.fa-cc-discover:before{content:\"\\f1f2\"}.fa-cc-amex:before{content:\"\\f1f3\"}.fa-cc-paypal:before{content:\"\\f1f4\"}.fa-cc-stripe:before{content:\"\\f1f5\"}.fa-bell-slash:before{content:\"\\f1f6\"}.fa-bell-slash-o:before{content:\"\\f1f7\"}.fa-trash:before{content:\"\\f1f8\"}.fa-copyright:before{content:\"\\f1f9\"}.fa-at:before{content:\"\\f1fa\"}.fa-eyedropper:before{content:\"\\f1fb\"}.fa-paint-brush:before{content:\"\\f1fc\"}.fa-birthday-cake:before{content:\"\\f1fd\"}.fa-area-chart:before{content:\"\\f1fe\"}.fa-pie-chart:before{content:\"\\f200\"}.fa-line-chart:before{content:\"\\f201\"}.fa-lastfm:before{content:\"\\f202\"}.fa-lastfm-square:before{content:\"\\f203\"}.fa-toggle-off:before{content:\"\\f204\"}.fa-toggle-on:before{content:\"\\f205\"}.fa-bicycle:before{content:\"\\f206\"}.fa-bus:before{content:\"\\f207\"}.fa-ioxhost:before{content:\"\\f208\"}.fa-angellist:before{content:\"\\f209\"}.fa-cc:before{content:\"\\f20a\"}.fa-shekel:before,.fa-sheqel:before,.fa-ils:before{content:\"\\f20b\"}.fa-meanpath:before{content:\"\\f20c\"}.fa-buysellads:before{content:\"\\f20d\"}.fa-connectdevelop:before{content:\"\\f20e\"}.fa-dashcube:before{content:\"\\f210\"}.fa-forumbee:before{content:\"\\f211\"}.fa-leanpub:before{content:\"\\f212\"}.fa-sellsy:before{content:\"\\f213\"}.fa-shirtsinbulk:before{content:\"\\f214\"}.fa-simplybuilt:before{content:\"\\f215\"}.fa-skyatlas:before{content:\"\\f216\"}.fa-cart-plus:before{content:\"\\f217\"}.fa-cart-arrow-down:before{content:\"\\f218\"}.fa-diamond:before{content:\"\\f219\"}.fa-ship:before{content:\"\\f21a\"}.fa-user-secret:before{content:\"\\f21b\"}.fa-motorcycle:before{content:\"\\f21c\"}.fa-street-view:before{content:\"\\f21d\"}.fa-heartbeat:before{content:\"\\f21e\"}.fa-venus:before{content:\"\\f221\"}.fa-mars:before{content:\"\\f222\"}.fa-mercury:before{content:\"\\f223\"}.fa-intersex:before,.fa-transgender:before{content:\"\\f224\"}.fa-transgender-alt:before{content:\"\\f225\"}.fa-venus-double:before{content:\"\\f226\"}.fa-mars-double:before{content:\"\\f227\"}.fa-venus-mars:before{content:\"\\f228\"}.fa-mars-stroke:before{content:\"\\f229\"}.fa-mars-stroke-v:before{content:\"\\f22a\"}.fa-mars-stroke-h:before{content:\"\\f22b\"}.fa-neuter:before{content:\"\\f22c\"}.fa-genderless:before{content:\"\\f22d\"}.fa-facebook-official:before{content:\"\\f230\"}.fa-pinterest-p:before{content:\"\\f231\"}.fa-whatsapp:before{content:\"\\f232\"}.fa-server:before{content:\"\\f233\"}.fa-user-plus:before{content:\"\\f234\"}.fa-user-times:before{content:\"\\f235\"}.fa-hotel:before,.fa-bed:before{content:\"\\f236\"}.fa-viacoin:before{content:\"\\f237\"}.fa-train:before{content:\"\\f238\"}.fa-subway:before{content:\"\\f239\"}.fa-medium:before{content:\"\\f23a\"}.fa-yc:before,.fa-y-combinator:before{content:\"\\f23b\"}.fa-optin-monster:before{content:\"\\f23c\"}.fa-opencart:before{content:\"\\f23d\"}.fa-expeditedssl:before{content:\"\\f23e\"}.fa-battery-4:before,.fa-battery:before,.fa-battery-full:before{content:\"\\f240\"}.fa-battery-3:before,.fa-battery-three-quarters:before{content:\"\\f241\"}.fa-battery-2:before,.fa-battery-half:before{content:\"\\f242\"}.fa-battery-1:before,.fa-battery-quarter:before{content:\"\\f243\"}.fa-battery-0:before,.fa-battery-empty:before{content:\"\\f244\"}.fa-mouse-pointer:before{content:\"\\f245\"}.fa-i-cursor:before{content:\"\\f246\"}.fa-object-group:before{content:\"\\f247\"}.fa-object-ungroup:before{content:\"\\f248\"}.fa-sticky-note:before{content:\"\\f249\"}.fa-sticky-note-o:before{content:\"\\f24a\"}.fa-cc-jcb:before{content:\"\\f24b\"}.fa-cc-diners-club:before{content:\"\\f24c\"}.fa-clone:before{content:\"\\f24d\"}.fa-balance-scale:before{content:\"\\f24e\"}.fa-hourglass-o:before{content:\"\\f250\"}.fa-hourglass-1:before,.fa-hourglass-start:before{content:\"\\f251\"}.fa-hourglass-2:before,.fa-hourglass-half:before{content:\"\\f252\"}.fa-hourglass-3:before,.fa-hourglass-end:before{content:\"\\f253\"}.fa-hourglass:before{content:\"\\f254\"}.fa-hand-grab-o:before,.fa-hand-rock-o:before{content:\"\\f255\"}.fa-hand-stop-o:before,.fa-hand-paper-o:before{content:\"\\f256\"}.fa-hand-scissors-o:before{content:\"\\f257\"}.fa-hand-lizard-o:before{content:\"\\f258\"}.fa-hand-spock-o:before{content:\"\\f259\"}.fa-hand-pointer-o:before{content:\"\\f25a\"}.fa-hand-peace-o:before{content:\"\\f25b\"}.fa-trademark:before{content:\"\\f25c\"}.fa-registered:before{content:\"\\f25d\"}.fa-creative-commons:before{content:\"\\f25e\"}.fa-gg:before{content:\"\\f260\"}.fa-gg-circle:before{content:\"\\f261\"}.fa-tripadvisor:before{content:\"\\f262\"}.fa-odnoklassniki:before{content:\"\\f263\"}.fa-odnoklassniki-square:before{content:\"\\f264\"}.fa-get-pocket:before{content:\"\\f265\"}.fa-wikipedia-w:before{content:\"\\f266\"}.fa-safari:before{content:\"\\f267\"}.fa-chrome:before{content:\"\\f268\"}.fa-firefox:before{content:\"\\f269\"}.fa-opera:before{content:\"\\f26a\"}.fa-internet-explorer:before{content:\"\\f26b\"}.fa-tv:before,.fa-television:before{content:\"\\f26c\"}.fa-contao:before{content:\"\\f26d\"}.fa-500px:before{content:\"\\f26e\"}.fa-amazon:before{content:\"\\f270\"}.fa-calendar-plus-o:before{content:\"\\f271\"}.fa-calendar-minus-o:before{content:\"\\f272\"}.fa-calendar-times-o:before{content:\"\\f273\"}.fa-calendar-check-o:before{content:\"\\f274\"}.fa-industry:before{content:\"\\f275\"}.fa-map-pin:before{content:\"\\f276\"}.fa-map-signs:before{content:\"\\f277\"}.fa-map-o:before{content:\"\\f278\"}.fa-map:before{content:\"\\f279\"}.fa-commenting:before{content:\"\\f27a\"}.fa-commenting-o:before{content:\"\\f27b\"}.fa-houzz:before{content:\"\\f27c\"}.fa-vimeo:before{content:\"\\f27d\"}.fa-black-tie:before{content:\"\\f27e\"}.fa-fonticons:before{content:\"\\f280\"}.fa-reddit-alien:before{content:\"\\f281\"}.fa-edge:before{content:\"\\f282\"}.fa-credit-card-alt:before{content:\"\\f283\"}.fa-codiepie:before{content:\"\\f284\"}.fa-modx:before{content:\"\\f285\"}.fa-fort-awesome:before{content:\"\\f286\"}.fa-usb:before{content:\"\\f287\"}.fa-product-hunt:before{content:\"\\f288\"}.fa-mixcloud:before{content:\"\\f289\"}.fa-scribd:before{content:\"\\f28a\"}.fa-pause-circle:before{content:\"\\f28b\"}.fa-pause-circle-o:before{content:\"\\f28c\"}.fa-stop-circle:before{content:\"\\f28d\"}.fa-stop-circle-o:before{content:\"\\f28e\"}.fa-shopping-bag:before{content:\"\\f290\"}.fa-shopping-basket:before{content:\"\\f291\"}.fa-hashtag:before{content:\"\\f292\"}.fa-bluetooth:before{content:\"\\f293\"}.fa-bluetooth-b:before{content:\"\\f294\"}.fa-percent:before{content:\"\\f295\"}.fa-gitlab:before{content:\"\\f296\"}.fa-wpbeginner:before{content:\"\\f297\"}.fa-wpforms:before{content:\"\\f298\"}.fa-envira:before{content:\"\\f299\"}.fa-universal-access:before{content:\"\\f29a\"}.fa-wheelchair-alt:before{content:\"\\f29b\"}.fa-question-circle-o:before{content:\"\\f29c\"}.fa-blind:before{content:\"\\f29d\"}.fa-audio-description:before{content:\"\\f29e\"}.fa-volume-control-phone:before{content:\"\\f2a0\"}.fa-braille:before{content:\"\\f2a1\"}.fa-assistive-listening-systems:before{content:\"\\f2a2\"}.fa-asl-interpreting:before,.fa-american-sign-language-interpreting:before{content:\"\\f2a3\"}.fa-deafness:before,.fa-hard-of-hearing:before,.fa-deaf:before{content:\"\\f2a4\"}.fa-glide:before{content:\"\\f2a5\"}.fa-glide-g:before{content:\"\\f2a6\"}.fa-signing:before,.fa-sign-language:before{content:\"\\f2a7\"}.fa-low-vision:before{content:\"\\f2a8\"}.fa-viadeo:before{content:\"\\f2a9\"}.fa-viadeo-square:before{content:\"\\f2aa\"}.fa-snapchat:before{content:\"\\f2ab\"}.fa-snapchat-ghost:before{content:\"\\f2ac\"}.fa-snapchat-square:before{content:\"\\f2ad\"}.fa-pied-piper:before{content:\"\\f2ae\"}.fa-first-order:before{content:\"\\f2b0\"}.fa-yoast:before{content:\"\\f2b1\"}.fa-themeisle:before{content:\"\\f2b2\"}.fa-google-plus-circle:before,.fa-google-plus-official:before{content:\"\\f2b3\"}.fa-fa:before,.fa-font-awesome:before{content:\"\\f2b4\"}.fa-handshake-o:before{content:\"\\f2b5\"}.fa-envelope-open:before{content:\"\\f2b6\"}.fa-envelope-open-o:before{content:\"\\f2b7\"}.fa-linode:before{content:\"\\f2b8\"}.fa-address-book:before{content:\"\\f2b9\"}.fa-address-book-o:before{content:\"\\f2ba\"}.fa-vcard:before,.fa-address-card:before{content:\"\\f2bb\"}.fa-vcard-o:before,.fa-address-card-o:before{content:\"\\f2bc\"}.fa-user-circle:before{content:\"\\f2bd\"}.fa-user-circle-o:before{content:\"\\f2be\"}.fa-user-o:before{content:\"\\f2c0\"}.fa-id-badge:before{content:\"\\f2c1\"}.fa-drivers-license:before,.fa-id-card:before{content:\"\\f2c2\"}.fa-drivers-license-o:before,.fa-id-card-o:before{content:\"\\f2c3\"}.fa-quora:before{content:\"\\f2c4\"}.fa-free-code-camp:before{content:\"\\f2c5\"}.fa-telegram:before{content:\"\\f2c6\"}.fa-thermometer-4:before,.fa-thermometer:before,.fa-thermometer-full:before{content:\"\\f2c7\"}.fa-thermometer-3:before,.fa-thermometer-three-quarters:before{content:\"\\f2c8\"}.fa-thermometer-2:before,.fa-thermometer-half:before{content:\"\\f2c9\"}.fa-thermometer-1:before,.fa-thermometer-quarter:before{content:\"\\f2ca\"}.fa-thermometer-0:before,.fa-thermometer-empty:before{content:\"\\f2cb\"}.fa-shower:before{content:\"\\f2cc\"}.fa-bathtub:before,.fa-s15:before,.fa-bath:before{content:\"\\f2cd\"}.fa-podcast:before{content:\"\\f2ce\"}.fa-window-maximize:before{content:\"\\f2d0\"}.fa-window-minimize:before{content:\"\\f2d1\"}.fa-window-restore:before{content:\"\\f2d2\"}.fa-times-rectangle:before,.fa-window-close:before{content:\"\\f2d3\"}.fa-times-rectangle-o:before,.fa-window-close-o:before{content:\"\\f2d4\"}.fa-bandcamp:before{content:\"\\f2d5\"}.fa-grav:before{content:\"\\f2d6\"}.fa-etsy:before{content:\"\\f2d7\"}.fa-imdb:before{content:\"\\f2d8\"}.fa-ravelry:before{content:\"\\f2d9\"}.fa-eercast:before{content:\"\\f2da\"}.fa-microchip:before{content:\"\\f2db\"}.fa-snowflake-o:before{content:\"\\f2dc\"}.fa-superpowers:before{content:\"\\f2dd\"}.fa-wpexplorer:before{content:\"\\f2de\"}.fa-meetup:before{content:\"\\f2e0\"}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}\n"; });
define('text!admin/login.html', ['module'], function(module) { module.exports = "<template><div class=\"logo\" style=\"margin-top:1.5%\"></div><div class=\"form\" style=\"margin-top:-100px\"><div class=\"\"><div id=\"\"><h1>Welcome ${greetname}</h1><form method=\"post\" submit.delegate=\"login()\"><div class=\"field-wrap\"><label class=\"login\">Email Address<span class=\"req\">*</span></label><input type=\"email\" required autocomplete=\"off\" value.bind=\"user.username\" id=\"username\"></div><div class=\"field-wrap\"><label class=\"login\">Password<span class=\"req\">*</span></label><input type=\"password\" required autocomplete=\"off\" value.bind=\"user.password\"></div><p class=\"forgot\"><a href=\"#\">Administrator?</a></p><button type=\"submit\" class=\"button button-block\">Log In</form></div></div></div></template>"; });
define('text!resources/css/font.css', ['module'], function(module) { module.exports = "/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 300;\n  src: local('Titillium Web Light'), local('TitilliumWeb-Light'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr9INifKjd1RJ3NxxEi9Cy2w.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 300;\n  src: local('Titillium Web Light'), local('TitilliumWeb-Light'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr4-67659ICLY8bMrYhtePPA.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v5/7XUFZ5tgS-tD6QamInJTcSo_WB_cotcEMUw1LsIE8mM.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Titillium Web Regular'), local('TitilliumWeb-Regular'), url(https://fonts.gstatic.com/s/titilliumweb/v5/7XUFZ5tgS-tD6QamInJTcZSnX671uNZIV63UdXh3Mg0.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 600;\n  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr_SNRT0fZ5CX-AqRkMYgJJo.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Titillium Web';\n  font-style: normal;\n  font-weight: 600;\n  src: local('Titillium Web SemiBold'), local('TitilliumWeb-SemiBold'), url(https://fonts.gstatic.com/s/titilliumweb/v5/anMUvcNT0H1YN4FII8wpr46gJz9aNFrmnwBdd69aqzY.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n"; });
define('text!resources/css/main.css', ['module'], function(module) { module.exports = "body{\r\n    /*background: url(../img/background.jpg) !important;\r\n    background-size:cover!important;\r\n    transform: scale(0.88);*/\r\n    background-color:white;\r\n}\r\n.logo{\r\n    background: url(../img/custom-logo2.png) no-repeat;\r\n    background-size: contain;\r\n    height: 170px;\r\n    margin: 0 auto;\r\n    width: 200px\r\n}"; });
define('text!employee/add.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><form class=\"w3-container\"><p><label class=\"w3-text-red\">First Name</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.firstname\"></p><p><label class=\"w3-text-red\">Last Name</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.lastname\"></p><p><label class=\"w3-text-red\">Email</label><input class=\"w3-input w3-text-red\" type=\"text\" value.bind=\"user.username\"></p><p><input class=\"w3-radio\" type=\"radio\" name=\"type\" value=\"administrator\" checked=\"checked\"> <span class=\"w3-text-red\">Administrator</span> <input class=\"w3-radio\" type=\"radio\" name=\"type\" value=\"manager\"><label class=\"w3-text-red\">Manager</label><input class=\"w3-radio\" type=\"radio\" name=\"type\" value=\"employee\"><label class=\"w3-text-red\">Employee</label></p><button class=\"w3-btn w3-blue-grey\">Register</button></form></div></template>"; });
define('text!resources/css/normalize.min.css', ['module'], function(module) { module.exports = "button,hr,input{overflow:visible}audio,canvas,progress,video{display:inline-block}progress,sub,sup{vertical-align:baseline}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0} menu,article,aside,details,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{}button,select{text-transform:none}[type=submit], [type=reset],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}/*# sourceMappingURL=normalize.min.css.map */"; });
define('text!employee/edit.html', ['module'], function(module) { module.exports = "<template><ul class=\"w3-ul w3-card-4\"><li class=\"w3-padding-16 w3-hover-red\" repeat.for=\"user of employee\"><span click.delegate=\"\" class=\"w3-right\"><button>Edit</button> <button>Delete</button> </span><img src=\"../src/resources/img/img_avatar2.png\" class=\"w3-left w3-circle w3-margin-right\" style=\"width:50px\"> <span class=\"w3-large\">${user.name}</span><br><span>${user.type}</span></li></ul></template>"; });
define('text!resources/css/roboto.css', ['module'], function(module) { module.exports = "/* cyrillic-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/ek4gzZ-GeXAPcSbHtCeQI_esZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+20B4, U+2DE0-2DFF, U+A640-A69F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/mErvLBYg_cXG3rLvUsKT_fesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/-2n2p-_Y08sg57CNWQfKNvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/u0TOpm082MNkS5K0Q4rhqvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0370-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/NdF9MtnOpLzo-noMoG0miPesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v16/CWB0XYA8bzo0kSThX0UTuA.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n"; });
define('text!employee/index.html', ['module'], function(module) { module.exports = "<template><div class=\"w3-padding-16\"><button click.delegate=\"addEmployee()\">Add Employee</button><compose view-model=\"${_url}\"></compose></div></template>"; });
define('text!resources/css/style.css', ['module'], function(module) { module.exports = "*, *:before, *:after {\n  box-sizing: border-box;\n}\n\nhtml {\n  overflow-y: scroll;\n}\n\nbody {\n  background: #c1bdba;\n  font-family: 'Titillium Web', sans-serif;\n}\n\na {\n  text-decoration: none;\n  color: rgba(219,42,44,1);\n  -webkit-transition: .5s ease;\n  transition: .5s ease;\n}\na:hover {\n  color: rgba(181,30,30,1);\n}\n\n.form {\n  background: rgba(19, 35, 47, 0.9);\n  padding: 40px;\n  max-width: 600px;\n  margin: 40px auto;\n  border-radius: 4px;\n  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.3);\n  border: 4px solid rgba(220,42,43,1)!important;\n}\n\n.tab-group {\n  list-style: none;\n  padding: 0;\n  margin: 0 0 40px 0;\n}\n.tab-group:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.tab-group li a {\n  display: block;\n  text-decoration: none;\n  padding: 15px;\n  background: rgba(160, 179, 176, 0.25);\n  color: #a0b3b0;\n  font-size: 20px;\n  float: left;\n  width: 50%;\n  text-align: center;\n  cursor: pointer;\n  -webkit-transition: .5s ease;\n  transition: .5s ease;\n}\n.tab-group li a:hover {\n  background: rgba(219,42,44,1);;\n  color: #ffffff;\n}\n.tab-group .active a {\n  background: rgba(219,42,44,1);;\n  color: #ffffff;\n}\n\n.tab-content > div:last-child {\n  display: none;\n}\n\nh1 {\n  text-align: center;\n  color: #ffffff;\n  font-weight: 300;\n  margin: 0 0 40px;\n}\n\nlabel.login {\n  position: absolute;\n  -webkit-transform: translateY(6px);\n          transform: translateY(6px);\n  left: 13px;\n  color: rgba(255, 255, 255, 0.5);\n  -webkit-transition: all 0.25s ease;\n  transition: all 0.25s ease;\n  -webkit-backface-visibility: hidden;\n  pointer-events: none;\n  font-size: 22px;\n}\nlabel.login .req {\n  margin: 2px;\n  color: red;\n}\n\nlabel.login.active {\n  -webkit-transform: translateY(50px);\n          transform: translateY(50px);\n  left: 2px;\n  font-size: 14px;\n}\nlabel.login.active .req {\n  opacity: 0;\n}\n\nlabel.login.highlight {\n  color: #ffffff;\n}\n\ninput, textarea {\n  font-size: 22px;\n  display: block;\n  width: 100%;\n  height: 100%;\n  padding: 5px 10px;\n  background: none;\n  background-image: none;\n  border: 1px solid #a0b3b0;\n  color: #ffffff;\n  border-radius: 0;\n  -webkit-transition: border-color .25s ease, box-shadow .25s ease;\n  transition: border-color .25s ease, box-shadow .25s ease;\n}\ninput:focus, textarea:focus {\n  outline: 0;\n  border-color: rgba(219,42,44,1);;\n}\n\ntextarea {\n  border: 2px solid #a0b3b0;\n  resize: vertical;\n}\n\n.field-wrap {\n  position: relative;\n  margin-bottom: 40px;\n}\n\n.top-row:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.top-row > div {\n  float: left;\n  width: 48%;\n  margin-right: 4%;\n}\n.top-row > div:last-child {\n  margin: 0;\n}\n\n.button {\n  border: 0;\n  outline: none;\n  border-radius: 0;\n  padding: 15px 0;\n  font-size: 1.6rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: .1em;\n  background: rgba(219,42,44,1);\n  color: #ffffff;\n  -webkit-transition: all 0.5s ease;\n  transition: all 0.5s ease;\n  -webkit-appearance: none;\n}\n.button:hover, .button:focus {\n  background: rgba(181,30,30,1);\n}\n\n.button-block {\n  display: block;\n  width: 100%;\n}\n\n.forgot {\n  margin-top: -20px;\n  text-align: right;\n}\n"; });
define('text!resources/css/w3.css', ['module'], function(module) { module.exports = "/* W3.CSS 4.04 Apr 2017 by Jan Egil and Borge Refsnes */\r\nhtml{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}\r\n/* Extract from normalize.css by Nicolas Gallagher and Jonathan Neal git.io/normalize */\r\nhtml{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}\r\narticle,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}\r\naudio,canvas,progress,video{display:inline-block}progress{vertical-align:baseline}\r\naudio:not([controls]){display:none;height:0}[hidden],template{display:none}\r\na{background-color:transparent;-webkit-text-decoration-skip:objects}\r\na:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}\r\ndfn{font-style:italic}mark{background:#ff0;color:#000}\r\nsmall{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}\r\nsub{bottom:-0.25em}sup{top:-0.5em}figure{margin:1em 40px}img{border-style:none}svg:not(:root){overflow:hidden}\r\ncode,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}hr{box-sizing:content-box;height:0;overflow:visible}\r\nbutton,input,select,textarea{font:inherit;margin:0}optgroup{font-weight:bold}\r\nbutton,input{overflow:visible}button,select{text-transform:none}\r\nbutton,html [type=button],[type=reset],[type=submit]{-webkit-appearance:button}\r\nbutton::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner{border-style:none;padding:0}\r\nbutton:-moz-focusring, [type=button]:-moz-focusring, [type=reset]:-moz-focusring, [type=submit]:-moz-focusring{outline:1px dotted ButtonText}\r\nfieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}\r\nlegend{color:inherit;display:table;max-width:100%;padding:0;white-space:normal}textarea{overflow:auto}\r\n[type=checkbox],[type=radio]{padding:0}\r\n[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}\r\n[type=search]{-webkit-appearance:textfield;outline-offset:-2px}\r\n[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}\r\n::-webkit-input-placeholder{color:inherit;opacity:0.54}\r\n::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}\r\n/* End extract */\r\nhtml,body{font-family:Verdana,sans-serif;font-size:15px;line-height:1.5}html{overflow-x:hidden}\r\nh1{font-size:36px}h2{font-size:30px}h3{font-size:24px}h4{font-size:20px}h5{font-size:18px}h6{font-size:16px}.w3-serif{font-family:serif}\r\nh1,h2,h3,h4,h5,h6{font-family:\"Segoe UI\",Arial,sans-serif;font-weight:400;margin:10px 0}.w3-wide{letter-spacing:4px}\r\nhr{border:0;border-top:1px solid #eee;margin:20px 0}\r\n.w3-image{max-width:100%;height:auto}img{margin-bottom:-5px}a{color:inherit}\r\n.w3-table,.w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table}.w3-table-all{border:1px solid #ccc}\r\n.w3-bordered tr,.w3-table-all tr{border-bottom:1px solid #ddd}.w3-striped tbody tr:nth-child(even){background-color:#f1f1f1}\r\n.w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\r\n.w3-hoverable tbody tr:hover,.w3-ul.w3-hoverable li:hover{background-color:#ccc}.w3-centered tr th,.w3-centered tr td{text-align:center}\r\n.w3-table td,.w3-table th,.w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\r\n.w3-table th:first-child,.w3-table td:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\r\n.w3-btn,.w3-button{border:none;display:inline-block;outline:0;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap}\r\n.w3-btn:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)}\r\n.w3-btn,.w3-button{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}   \r\n.w3-disabled,.w3-btn:disabled,.w3-button:disabled{cursor:not-allowed;opacity:0.3}.w3-disabled *,:disabled *{pointer-events:none}\r\n.w3-btn.w3-disabled:hover,.w3-btn:disabled:hover{box-shadow:none}\r\n.w3-badge,.w3-tag{background-color:#000;color:#fff;display:inline-block;padding-left:8px;padding-right:8px;text-align:center}.w3-badge{border-radius:50%}\r\n.w3-ul{list-style-type:none;padding:0;margin:0}.w3-ul li{padding:8px 16px;border-bottom:1px solid #ddd}.w3-ul li:last-child{border-bottom:none}\r\n.w3-tooltip,.w3-display-container{position:relative}.w3-tooltip .w3-text{display:none}.w3-tooltip:hover .w3-text{display:inline-block}\r\n.w3-ripple:active{opacity:0.5}.w3-ripple{transition:opacity 0s}\r\n.w3-input{padding:8px;display:block;border:none;border-bottom:1px solid #ccc;width:100%}\r\n.w3-select{padding:9px 0;width:100%;border:none;border-bottom:1px solid #ccc}\r\n.w3-dropdown-click,.w3-dropdown-hover{position:relative;display:inline-block;cursor:pointer}\r\n.w3-dropdown-hover:hover .w3-dropdown-content{display:block;z-index:1}\r\n.w3-dropdown-hover:first-child,.w3-dropdown-click:hover{background-color:#ccc;color:#000}\r\n.w3-dropdown-hover:hover > .w3-button:first-child,.w3-dropdown-click:hover > .w3-button:first-child{background-color:#ccc;color:#000}\r\n.w3-dropdown-content{cursor:auto;color:#000;background-color:#fff;display:none;position:absolute;min-width:160px;margin:0;padding:0}\r\n.w3-check,.w3-radio{width:24px;height:24px;position:relative;top:6px}\r\n.w3-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:1;overflow:auto}\r\n.w3-bar-block .w3-dropdown-hover,.w3-bar-block .w3-dropdown-click{width:100%}\r\n.w3-bar-block .w3-dropdown-hover .w3-dropdown-content,.w3-bar-block .w3-dropdown-click .w3-dropdown-content{min-width:100%}\r\n.w3-bar-block .w3-dropdown-hover .w3-button,.w3-bar-block .w3-dropdown-click .w3-button{width:100%;text-align:left;padding:8px 16px}\r\n.w3-main,#main{transition:margin-left .4s}\r\n.w3-modal{z-index:3;display:none;padding-top:100px;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4)}\r\n.w3-modal-content{margin:auto;background-color:#fff;position:relative;padding:0;outline:0;width:600px}\r\n.w3-bar{width:100%;overflow:hidden}.w3-center .w3-bar{display:inline-block;width:auto}\r\n.w3-bar .w3-bar-item{padding:8px 16px;float:left;width:auto;border:none;outline:none;display:block}\r\n.w3-bar .w3-dropdown-hover,.w3-bar .w3-dropdown-click{position:static;float:left}\r\n.w3-bar .w3-button{white-space:normal}\r\n.w3-bar-block .w3-bar-item{width:100%;display:block;padding:8px 16px;text-align:left;border:none;outline:none;white-space:normal;float:none}\r\n.w3-bar-block.w3-center .w3-bar-item{text-align:center}.w3-block{display:block;width:100%}\r\n.w3-responsive{overflow-x:auto}\r\n.w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before,\r\n.w3-cell-row:before,.w3-cell-row:after,.w3-clear:after,.w3-clear:before,.w3-bar:before,.w3-bar:after{content:\"\";display:table;clear:both}\r\n.w3-col,.w3-half,.w3-third,.w3-twothird,.w3-threequarter,.w3-quarter{float:left;width:100%}\r\n.w3-col.s1{width:8.33333%}.w3-col.s2{width:16.66666%}.w3-col.s3{width:24.99999%}.w3-col.s4{width:33.33333%}\r\n.w3-col.s5{width:41.66666%}.w3-col.s6{width:49.99999%}.w3-col.s7{width:58.33333%}.w3-col.s8{width:66.66666%}\r\n.w3-col.s9{width:74.99999%}.w3-col.s10{width:83.33333%}.w3-col.s11{width:91.66666%}.w3-col.s12{width:99.99999%}\r\n@media (min-width:601px){.w3-col.m1{width:8.33333%}.w3-col.m2{width:16.66666%}.w3-col.m3,.w3-quarter{width:24.99999%}.w3-col.m4,.w3-third{width:33.33333%}\r\n.w3-col.m5{width:41.66666%}.w3-col.m6,.w3-half{width:49.99999%}.w3-col.m7{width:58.33333%}.w3-col.m8,.w3-twothird{width:66.66666%}\r\n.w3-col.m9,.w3-threequarter{width:74.99999%}.w3-col.m10{width:83.33333%}.w3-col.m11{width:91.66666%}.w3-col.m12{width:99.99999%}}\r\n@media (min-width:993px){.w3-col.l1{width:8.33333%}.w3-col.l2{width:16.66666%}.w3-col.l3{width:24.99999%}.w3-col.l4{width:33.33333%}\r\n.w3-col.l5{width:41.66666%}.w3-col.l6{width:49.99999%}.w3-col.l7{width:58.33333%}.w3-col.l8{width:66.66666%}\r\n.w3-col.l9{width:74.99999%}.w3-col.l10{width:83.33333%}.w3-col.l11{width:91.66666%}.w3-col.l12{width:99.99999%}}\r\n.w3-content{max-width:980px;margin:auto}.w3-rest{overflow:hidden}\r\n.w3-cell-row{display:table;width:100%}.w3-cell{display:table-cell}\r\n.w3-cell-top{vertical-align:top}.w3-cell-middle{vertical-align:middle}.w3-cell-bottom{vertical-align:bottom}\r\n.w3-hide{display:none!important}.w3-show-block,.w3-show{display:block!important}.w3-show-inline-block{display:inline-block!important}\r\n@media (max-width:600px){.w3-modal-content{margin:0 10px;width:auto!important}.w3-modal{padding-top:30px}\r\n.w3-dropdown-hover.w3-mobile .w3-dropdown-content,.w3-dropdown-click.w3-mobile .w3-dropdown-content{position:relative}\t\r\n.w3-hide-small{display:none!important}.w3-mobile{display:block;width:100%!important}.w3-bar-item.w3-mobile,.w3-dropdown-hover.w3-mobile,.w3-dropdown-click.w3-mobile{text-align:center}\r\n.w3-dropdown-hover.w3-mobile,.w3-dropdown-hover.w3-mobile .w3-btn,.w3-dropdown-hover.w3-mobile .w3-button,.w3-dropdown-click.w3-mobile,.w3-dropdown-click.w3-mobile .w3-btn,.w3-dropdown-click.w3-mobile .w3-button{width:100%}}\r\n@media (max-width:768px){.w3-modal-content{width:500px}.w3-modal{padding-top:50px}}\r\n@media (min-width:993px){.w3-modal-content{width:900px}.w3-hide-large{display:none!important}.w3-sidebar.w3-collapse{display:block!important}}\r\n@media (max-width:992px) and (min-width:601px){.w3-hide-medium{display:none!important}}\r\n@media (max-width:992px){.w3-sidebar.w3-collapse{display:none}.w3-main{margin-left:0!important;margin-right:0!important}}\r\n.w3-top,.w3-bottom{position:fixed;width:100%;z-index:1}.w3-top{top:0}.w3-bottom{bottom:0}\r\n.w3-overlay{position:fixed;display:none;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:2}\r\n.w3-display-topleft{position:absolute;left:0;top:0}.w3-display-topright{position:absolute;right:0;top:0}\r\n.w3-display-bottomleft{position:absolute;left:0;bottom:0}.w3-display-bottomright{position:absolute;right:0;bottom:0}\r\n.w3-display-middle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%)}\r\n.w3-display-left{position:absolute;top:50%;left:0%;transform:translate(0%,-50%);-ms-transform:translate(-0%,-50%)}\r\n.w3-display-right{position:absolute;top:50%;right:0%;transform:translate(0%,-50%);-ms-transform:translate(0%,-50%)}\r\n.w3-display-topmiddle{position:absolute;left:50%;top:0;transform:translate(-50%,0%);-ms-transform:translate(-50%,0%)}\r\n.w3-display-bottommiddle{position:absolute;left:50%;bottom:0;transform:translate(-50%,0%);-ms-transform:translate(-50%,0%)}\r\n.w3-display-container:hover .w3-display-hover{display:block}.w3-display-container:hover span.w3-display-hover{display:inline-block}.w3-display-hover{display:none}\r\n.w3-display-position{position:absolute}\r\n.w3-circle{border-radius:50%}\r\n.w3-round-small{border-radius:2px}.w3-round,.w3-round-medium{border-radius:4px}.w3-round-large{border-radius:8px}.w3-round-xlarge{border-radius:16px}.w3-round-xxlarge{border-radius:32px}\r\n.w3-row-padding,.w3-row-padding>.w3-half,.w3-row-padding>.w3-third,.w3-row-padding>.w3-twothird,.w3-row-padding>.w3-threequarter,.w3-row-padding>.w3-quarter,.w3-row-padding>.w3-col{padding:0 8px}\r\n.w3-container,.w3-panel{padding:0.01em 16px}.w3-panel{margin-top:16px;margin-bottom:16px}\r\n.w3-code,.w3-codespan{font-family:Consolas,\"courier new\";font-size:16px}\r\n.w3-code{width:auto;background-color:#fff;padding:8px 12px;border-left:4px solid #4CAF50;word-wrap:break-word}\r\n.w3-codespan{color:crimson;background-color:#f1f1f1;padding-left:4px;padding-right:4px;font-size:110%}\r\n.w3-card,.w3-card-2{box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)}\r\n.w3-card-4,.w3-hover-shadow:hover{box-shadow:0 4px 10px 0 rgba(0,0,0,0.2),0 4px 20px 0 rgba(0,0,0,0.19)}\r\n.w3-spin{animation:w3-spin 2s infinite linear}@keyframes w3-spin{0%{transform:rotate(0deg)}100%{transform:rotate(359deg)}}\r\n.w3-animate-fading{animation:fading 10s infinite}@keyframes fading{0%{opacity:0}50%{opacity:1}100%{opacity:0}}\r\n.w3-animate-opacity{animation:opac 0.8s}@keyframes opac{from{opacity:0} to{opacity:1}}\r\n.w3-animate-top{position:relative;animation:animatetop 0.4s}@keyframes animatetop{from{top:-300px;opacity:0} to{top:0;opacity:1}}\r\n.w3-animate-left{position:relative;animation:animateleft 0.4s}@keyframes animateleft{from{left:-300px;opacity:0} to{left:0;opacity:1}}\r\n.w3-animate-right{position:relative;animation:animateright 0.4s}@keyframes animateright{from{right:-300px;opacity:0} to{right:0;opacity:1}}\r\n.w3-animate-bottom{position:relative;animation:animatebottom 0.4s}@keyframes animatebottom{from{bottom:-300px;opacity:0} to{bottom:0;opacity:1}}\r\n.w3-animate-zoom {animation:animatezoom 0.6s}@keyframes animatezoom{from{transform:scale(0)} to{transform:scale(1)}}\r\n.w3-animate-input{transition:width 0.4s ease-in-out}.w3-animate-input:focus{width:100%!important}\r\n.w3-opacity,.w3-hover-opacity:hover{opacity:0.60}.w3-opacity-off,.w3-hover-opacity-off:hover{opacity:1}\r\n.w3-opacity-max{opacity:0.25}.w3-opacity-min{opacity:0.75}\r\n.w3-greyscale-max,.w3-grayscale-max,.w3-hover-greyscale:hover,.w3-hover-grayscale:hover{filter:grayscale(100%)}\r\n.w3-greyscale,.w3-grayscale{filter:grayscale(75%)}.w3-greyscale-min,.w3-grayscale-min{filter:grayscale(50%)}\r\n.w3-sepia{filter:sepia(75%)}.w3-sepia-max,.w3-hover-sepia:hover{filter:sepia(100%)}.w3-sepia-min{filter:sepia(50%)}\r\n.w3-tiny{font-size:10px!important}.w3-small{font-size:12px!important}.w3-medium{font-size:15px!important}.w3-large{font-size:18px!important}\r\n.w3-xlarge{font-size:24px!important}.w3-xxlarge{font-size:36px!important}.w3-xxxlarge{font-size:48px!important}.w3-jumbo{font-size:64px!important}\r\n.w3-left-align{text-align:left!important}.w3-right-align{text-align:right!important}.w3-justify{text-align:justify!important}.w3-center{text-align:center!important}\r\n.w3-border-0{border:0!important}.w3-border{border:1px solid #ccc!important}\r\n.w3-border-top{border-top:1px solid #ccc!important}.w3-border-bottom{border-bottom:1px solid #ccc!important}\r\n.w3-border-left{border-left:1px solid #ccc!important}.w3-border-right{border-right:1px solid #ccc!important}\r\n.w3-topbar{border-top:6px solid #ccc!important}.w3-bottombar{border-bottom:6px solid #ccc!important}\r\n.w3-leftbar{border-left:6px solid #ccc!important}.w3-rightbar{border-right:6px solid #ccc!important}\r\n.w3-section,.w3-code{margin-top:16px!important;margin-bottom:16px!important}\r\n.w3-margin{margin:16px!important}.w3-margin-top{margin-top:16px!important}.w3-margin-bottom{margin-bottom:16px!important}\r\n.w3-margin-left{margin-left:16px!important}.w3-margin-right{margin-right:16px!important}\r\n.w3-padding-small{padding:4px 8px!important}.w3-padding{padding:8px 16px!important}.w3-padding-large{padding:12px 24px!important}\r\n.w3-padding-16{padding-top:16px!important;padding-bottom:16px!important}.w3-padding-24{padding-top:24px!important;padding-bottom:24px!important}\r\n.w3-padding-32{padding-top:32px!important;padding-bottom:32px!important}.w3-padding-48{padding-top:48px!important;padding-bottom:48px!important}\r\n.w3-padding-64{padding-top:64px!important;padding-bottom:64px!important}\r\n.w3-left{float:left!important}.w3-right{float:right!important}\r\n.w3-button:hover{color:#000!important;background-color:#ccc!important}\r\n.w3-transparent,.w3-hover-none:hover{background-color:transparent!important}\r\n.w3-hover-none:hover{box-shadow:none!important}\r\n/* Colors */\r\n.w3-amber,.w3-hover-amber:hover{color:#000!important;background-color:#ffc107!important}\r\n.w3-aqua,.w3-hover-aqua:hover{color:#000!important;background-color:#00ffff!important}\r\n.w3-blue,.w3-hover-blue:hover{color:#fff!important;background-color:#2196F3!important}\r\n.w3-light-blue,.w3-hover-light-blue:hover{color:#000!important;background-color:#87CEEB!important}\r\n.w3-brown,.w3-hover-brown:hover{color:#fff!important;background-color:#795548!important}\r\n.w3-cyan,.w3-hover-cyan:hover{color:#000!important;background-color:#00bcd4!important}\r\n.w3-blue-grey,.w3-hover-blue-grey:hover,.w3-blue-gray,.w3-hover-blue-gray:hover{color:#fff!important;background-color:#607d8b!important}\r\n.w3-green,.w3-hover-green:hover{color:#fff!important;background-color:#4CAF50!important}\r\n.w3-light-green,.w3-hover-light-green:hover{color:#000!important;background-color:#8bc34a!important}\r\n.w3-indigo,.w3-hover-indigo:hover{color:#fff!important;background-color:#3f51b5!important}\r\n.w3-khaki,.w3-hover-khaki:hover{color:#000!important;background-color:#f0e68c!important}\r\n.w3-lime,.w3-hover-lime:hover{color:#000!important;background-color:#cddc39!important}\r\n.w3-orange,.w3-hover-orange:hover{color:#000!important;background-color:#ff9800!important}\r\n.w3-deep-orange,.w3-hover-deep-orange:hover{color:#fff!important;background-color:#ff5722!important}\r\n.w3-pink,.w3-hover-pink:hover{color:#fff!important;background-color:#e91e63!important}\r\n.w3-purple,.w3-hover-purple:hover{color:#fff!important;background-color:#9c27b0!important}\r\n.w3-deep-purple,.w3-hover-deep-purple:hover{color:#fff!important;background-color:#673ab7!important}\r\n.w3-red,.w3-hover-red:hover{color:#fff!important;background-color:#f44336!important}\r\n.w3-sand,.w3-hover-sand:hover{color:#000!important;background-color:#fdf5e6!important}\r\n.w3-teal,.w3-hover-teal:hover{color:#fff!important;background-color:#009688!important}\r\n.w3-yellow,.w3-hover-yellow:hover{color:#000!important;background-color:#ffeb3b!important}\r\n.w3-white,.w3-hover-white:hover{color:#000!important;background-color:#fff!important}\r\n.w3-black,.w3-hover-black:hover{color:#fff!important;background-color:#000!important}\r\n.w3-grey,.w3-hover-grey:hover,.w3-gray,.w3-hover-gray:hover{color:#000!important;background-color:#bbb!important}\r\n.w3-light-grey,.w3-hover-light-grey:hover,.w3-light-gray,.w3-hover-light-gray:hover{color:#000!important;background-color:#f1f1f1!important}\r\n.w3-dark-grey,.w3-hover-dark-grey:hover,.w3-dark-gray,.w3-hover-dark-gray:hover{color:#fff!important;background-color:#616161!important}\r\n.w3-pale-red,.w3-hover-pale-red:hover{color:#000!important;background-color:#ffdddd!important}\r\n.w3-pale-green,.w3-hover-pale-green:hover{color:#000!important;background-color:#ddffdd!important}\r\n.w3-pale-yellow,.w3-hover-pale-yellow:hover{color:#000!important;background-color:#ffffcc!important}\r\n.w3-pale-blue,.w3-hover-pale-blue:hover{color:#000!important;background-color:#ddffff!important}\r\n.w3-text-red,.w3-hover-text-red:hover{color:#f44336!important}\r\n.w3-text-green,.w3-hover-text-green:hover{color:#4CAF50!important}\r\n.w3-text-blue,.w3-hover-text-blue:hover{color:#2196F3!important}\r\n.w3-text-yellow,.w3-hover-text-yellow:hover{color:#ffeb3b!important}\r\n.w3-text-white,.w3-hover-text-white:hover{color:#fff!important}\r\n.w3-text-black,.w3-hover-text-black:hover{color:#000!important}\r\n.w3-text-grey,.w3-hover-text-grey:hover,.w3-text-gray,.w3-hover-text-gray:hover{color:#757575!important}\r\n.w3-text-amber{color:#ffc107!important}\r\n.w3-text-aqua{color:#00ffff!important}\r\n.w3-text-light-blue{color:#87CEEB!important}\r\n.w3-text-brown{color:#795548!important}\r\n.w3-text-cyan{color:#00bcd4!important}\r\n.w3-text-blue-grey,.w3-text-blue-gray{color:#607d8b!important}\r\n.w3-text-light-green{color:#8bc34a!important}\r\n.w3-text-indigo{color:#3f51b5!important}\r\n.w3-text-khaki{color:#b4aa50!important}\r\n.w3-text-lime{color:#cddc39!important}\r\n.w3-text-orange{color:#ff9800!important}\r\n.w3-text-deep-orange{color:#ff5722!important}\r\n.w3-text-pink{color:#e91e63!important}\r\n.w3-text-purple{color:#9c27b0!important}\r\n.w3-text-deep-purple{color:#673ab7!important}\r\n.w3-text-sand{color:#fdf5e6!important}\r\n.w3-text-teal{color:#009688!important}\r\n.w3-text-light-grey,.w3-hover-text-light-grey:hover,.w3-text-light-gray,.w3-hover-text-light-gray:hover{color:#f1f1f1!important}\r\n.w3-text-dark-grey,.w3-hover-text-dark-grey:hover,.w3-text-dark-gray,.w3-hover-text-dark-gray:hover{color:#3a3a3a!important}\r\n.w3-border-red,.w3-hover-border-red:hover{border-color:#f44336!important}\r\n.w3-border-green,.w3-hover-border-green:hover{border-color:#4CAF50!important}\r\n.w3-border-blue,.w3-hover-border-blue:hover{border-color:#2196F3!important}\r\n.w3-border-yellow,.w3-hover-border-yellow:hover{border-color:#ffeb3b!important}\r\n.w3-border-white,.w3-hover-border-white:hover{border-color:#fff!important}\r\n.w3-border-black,.w3-hover-border-black:hover{border-color:#000!important}\r\n.w3-border-grey,.w3-hover-border-grey:hover,.w3-border-gray,.w3-hover-border-gray:hover{border-color:#bbb!important}"; });
//# sourceMappingURL=app-bundle.js.map