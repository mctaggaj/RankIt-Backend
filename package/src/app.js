/// <reference path="../Typings/typings.d.ts" />
var App;
(function (App) {
    App.moduleId = "App";
    App.baseUrl = "/src/";
    /**
     * @param object the parent modules
     * @returns module ids of child modules
     */
    function getChildModuleIds(object, dep) {
        var dep = dep || [];
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property].hasOwnProperty("moduleId")) {
                dep.push(object[property].moduleId);
            }
        }
        return dep;
    }
    App.getChildModuleIds = getChildModuleIds;
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        Nav.moduleId = App.moduleId + ".Nav";
        Nav.baseUrl = App.baseUrl + "Nav/";
    })(Nav = App.Nav || (App.Nav = {}));
})(App || (App = {}));

/// <reference path="NavGlobals.ts" />
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        var NavService = (function () {
            function NavService() {
                var _this = this;
                this.navItems = [];
                this.addItem = function (item) {
                    _this.navItems.push(item);
                    _this.navItems.sort(function (a, b) {
                        return a.order - b.order;
                    });
                };
            }
            NavService.serviceId = "NavService";
            NavService.moduleId = Nav.moduleId + "." + NavService.serviceId;
            NavService.$inject = [];
            return NavService;
        })();
        Nav.NavService = NavService;
        angular.module(NavService.moduleId, []).service(NavService.serviceId, NavService);
    })(Nav = App.Nav || (App.Nav = {}));
})(App || (App = {}));

/// <reference path="NavGlobals.ts" />
/// <reference path="NavService.ts" />
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        /**
         * The list of child modules
         * @type {string[]}
         */
        var dep = App.getChildModuleIds(Nav);
        // Makes App.Nav module
        angular.module(Nav.moduleId, dep);
    })(Nav = App.Nav || (App.Nav = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Auth;
    (function (Auth) {
        Auth.moduleId = App.moduleId + ".Auth";
        Auth.baseUrl = App.baseUrl + "Auth/";
        Auth.LS_UserName = "RankIt.Auth.UserName";
        Auth.LS_UserId = "RankIt.Auth.UserId";
        Auth.LS_UserToken = "RankIt.Auth.UserToken";
    })(Auth = App.Auth || (App.Auth = {}));
})(App || (App = {}));

/// <reference path="AuthGlobals.ts" />
var App;
(function (App) {
    var Auth;
    (function (Auth) {
        /**
         * Handles user authentication and current user state
         */
        var AuthService = (function () {
            /**
             * Creates a new AuthService
             */
            function AuthService($http, $q, localStorageService, httpAuthService) {
                var _this = this;
                /**
                 * Logs in with the given username and password
                 * @param userName
                 * @param password
                 */
                this.login = function (userName, password) {
                    _this.clearAuthData();
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/authentication", { userName: userName, password: password }).then(function (response) {
                        _this.setAuthData(response.data.userName, response.data.userId, response.data.token);
                        defered.resolve({
                            reason: null
                        });
                        _this.$http.get("api/competitions");
                    }, function (response) {
                        defered.reject({
                            reason: response.data.msg
                        });
                    });
                    return defered.promise;
                };
                /**
                 * Registers a new user
                 * @Author Tim
                 * @param userName
                 * @param password
                 */
                this.register = function (userName, password) {
                    _this.clearAuthData();
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/users", { userName: userName, password: password }).then(function (response) {
                        _this.setAuthData(response.data.userName, response.data.userId, response.data.token);
                        defered.resolve({
                            reason: null
                        });
                    }, function (response) {
                        defered.reject({
                            reason: response.data.msg
                        });
                    });
                    return defered.promise;
                };
                /**
                 * Logs the current user out
                 */
                this.logout = function () {
                    _this.clearAuthData();
                };
                /**
                 * @returns {boolean} true if currently logged in false if logged out
                 */
                this.isLoggedIn = function () {
                    return (_this.getUserName() && _this.getUserId() && _this.getToken());
                };
                /**
                 * @returns {string} the user name of the current user
                 */
                this.getUserName = function () {
                    return _this.localStorageService.get(Auth.LS_UserName);
                };
                /**
                 * @returns {string} the user id of the current user
                 */
                this.getUserId = function () {
                    return _this.localStorageService.get(Auth.LS_UserId);
                };
                /**
                 * Sets the token, and reties failed requests
                 * @param token
                 */
                this.setToken = function (token) {
                    _this.localStorageService.set(Auth.LS_UserToken, token);
                    if (token) {
                        _this.$http.defaults.headers.common.token = token;
                        _this.httpAuthService.loginConfirmed();
                    }
                    else {
                        _this.$http.defaults.headers.common.token = undefined;
                        _this.httpAuthService.loginCancelled();
                    }
                };
                /**
                 * @returns {string} the auth token
                 */
                this.getToken = function () {
                    return _this.localStorageService.get(Auth.LS_UserToken);
                };
                /**
                 * Clears the authentication data
                 */
                this.clearAuthData = function () {
                    _this.localStorageService.remove(Auth.LS_UserName);
                    _this.localStorageService.remove(Auth.LS_UserId);
                    _this.localStorageService.remove(Auth.LS_UserToken);
                };
                /**
                 * Sets the authentication data
                 * @param userName The user name of the user
                 * @param userId the user id of the user
                 * @param userToken the session token
                 */
                this.setAuthData = function (userName, userId, userToken) {
                    _this.localStorageService.set(Auth.LS_UserName, userName);
                    _this.localStorageService.set(Auth.LS_UserId, userId);
                    _this.setToken(userToken);
                };
                this.$http = $http;
                this.$q = $q;
                this.localStorageService = localStorageService;
                this.httpAuthService = httpAuthService;
                if (this.isLoggedIn()) {
                    this.setToken(this.getToken());
                }
            }
            AuthService.serviceId = "AuthenticationService";
            AuthService.moduleId = App.moduleId + "." + AuthService.serviceId;
            AuthService.$inject = ["$http", "$q", "localStorageService", "authService"];
            return AuthService;
        })();
        Auth.AuthService = AuthService;
        /**
         * Angular and service registration
         */
        angular.module(AuthService.moduleId, ["LocalStorageModule", "http-auth-interceptor"]).service(AuthService.serviceId, AuthService);
    })(Auth = App.Auth || (App.Auth = {}));
})(App || (App = {}));

/// <reference path="AuthGlobals.ts"/>
/// <reference path="AuthService.ts"/>
var App;
(function (App) {
    var Auth;
    (function (Auth) {
        /**
         * The list of child modules
         * @type {string[]}
         */
        var dep = App.getChildModuleIds(Auth);
        // Makes App.Auth module
        angular.module(Auth.moduleId, dep);
    })(Auth = App.Auth || (App.Auth = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Data;
    (function (Data) {
        Data.moduleId = App.moduleId + ".Data";
        Data.baseUrl = App.baseUrl + "Data/";
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));

/// <reference path="DataGlobals.ts" />
var App;
(function (App) {
    var Data;
    (function (Data) {
        /**
         * Handles user authentication and current user state
         */
        var DataService = (function () {
            /**
             * Creates a new DataService
             */
            function DataService($http, $q, $sce) {
                var _this = this;
                this.treatComp = function (comp) {
                    if (comp.hasOwnProperty("streamURL")) {
                        comp.streamURL = _this.$sce.trustAsResourceUrl(comp.streamURL);
                    }
                };
                this.getAllComps = function () {
                    var defered = _this.$q.defer();
                    _this.$http.get("/api/competitions").success(function (data, status, headers, config) {
                        data.competitions.push({
                            "competitionId": "c2",
                            "name": "3760 Meeting Event",
                            "subject": "Class!",
                            "description": "I hope Denis likes it!",
                            "location": "Denis' Office",
                            "public": true,
                            "results": "[]",
                            "state": "In Progress"
                        });
                        data.competitions.push({
                            "competitionId": "c3",
                            "name": "Test",
                            "subject": "Test",
                            "description": "Twitch Stream Test",
                            "location": "Test",
                            "public": true,
                            "results": "[]",
                            "state": "In Progress",
                            "streamURL": "http://www.twitch.tv/fragbitelive/embed"
                        });
                        for (var i = 0; i < data.competitions.length; i++) {
                            _this.treatComp(data.competitions[i]);
                        }
                        defered.resolve(data.competitions);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.$http = $http;
                this.$q = $q;
                this.$sce = $sce;
            }
            DataService.serviceId = "DataService";
            DataService.moduleId = App.moduleId + "." + DataService.serviceId;
            DataService.$inject = ["$http", "$q", "$sce"];
            return DataService;
        })();
        Data.DataService = DataService;
        /**
         * Angular and service registration
         */
        angular.module(DataService.moduleId, []).service(DataService.serviceId, DataService);
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));

/// <reference path="DataGlobals.ts"/>
/// <reference path="DataService.ts"/>
var App;
(function (App) {
    var Data;
    (function (Data) {
        /**
         * The list of child modules
         * @type {string[]}
         */
        var dep = App.getChildModuleIds(Data);
        // Makes App.Auth module
        angular.module(Data.moduleId, dep);
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Shell;
    (function (Shell) {
        Shell.moduleId = App.moduleId + ".Shell";
        Shell.baseUrl = App.baseUrl + "Shell/";
    })(Shell = App.Shell || (App.Shell = {}));
})(App || (App = {}));

/// <reference path="ShellGlobals.ts" />
var App;
(function (App) {
    var Shell;
    (function (Shell) {
        var ShellController = (function () {
            function ShellController($scope, navService, authService) {
                $scope.message = "Hello World!!";
                $scope.navService = navService;
                $scope.authService = authService;
            }
            ShellController.controllerName = "ShellController";
            ShellController.moduleId = Shell.moduleId + "." + ShellController.controllerName;
            ShellController.$inject = ["$scope", App.Nav.NavService.serviceId, App.Auth.AuthService.serviceId];
            return ShellController;
        })();
        Shell.ShellController = ShellController;
        angular.module(ShellController.moduleId, [App.Nav.NavService.moduleId]).controller(ShellController.controllerName, ShellController);
    })(Shell = App.Shell || (App.Shell = {}));
})(App || (App = {}));

/// <reference path="ShellGlobals.ts" />
/// <reference path="ShellController.ts" />
var App;
(function (App) {
    var Shell;
    (function (Shell) {
        angular.module(Shell.moduleId, [Shell.ShellController.moduleId]);
    })(Shell = App.Shell || (App.Shell = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        Home.moduleId = App.moduleId + ".Home";
        Home.baseUrl = App.baseUrl + "Home/";
        Home.state = "home";
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/// <reference path="HomeGlobals.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        var HomeController = (function () {
            function HomeController($scope, dataService) {
                $scope.message = "Hello World!!";
                $scope.competitions = [];
                dataService.getAllComps().then(function (data) {
                    $scope.competitions = data;
                }, function (failure) {
                });
            }
            HomeController.controllerId = "HomeController";
            HomeController.moduleId = Home.moduleId + "." + HomeController.controllerId;
            HomeController.$inject = ["$scope", App.Data.DataService.serviceId];
            return HomeController;
        })();
        Home.HomeController = HomeController;
        angular.module(HomeController.moduleId, [App.Nav.NavService.moduleId]).controller(HomeController.controllerId, HomeController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Home.state, {
                templateUrl: Home.baseUrl + 'home.html',
                controller: HomeController.controllerId,
                url: "/home"
            });
        }]).config(["$urlRouterProvider", function ($urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");
        }]).run([App.Nav.NavService.serviceId, function (navService) {
            navService.addItem({ state: Home.state, name: "Home", order: 0 });
        }]);
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/// <reference path="HomeGlobals.ts" />
/// <reference path="HomeController.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        angular.module(Home.moduleId, [Home.HomeController.moduleId]);
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Login;
    (function (Login) {
        Login.moduleId = App.moduleId + ".Login";
        Login.baseUrl = App.baseUrl + "Login/";
    })(Login = App.Login || (App.Login = {}));
})(App || (App = {}));

/// <reference path="LoginGlobals.ts" />
var App;
(function (App) {
    var Login;
    (function (Login) {
        var LoginController = (function () {
            function LoginController($scope, $state, authService) {
                var _this = this;
                this.info = {
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    password2: ""
                };
                this.loginMode = true;
                this.login = function () {
                    if (!_this.scope.loginMode) {
                        _this.scope.loginMode = true;
                        return;
                    }
                    _this.authService.login(_this.scope.info.email, _this.scope.info.password).then(function (response) {
                        // Sucess
                        _this.$state.go(App.Home.state);
                    }, function (response) {
                        // Failure
                        console.log(response);
                    });
                };
                this.register = function () {
                    if (_this.scope.loginMode) {
                        _this.scope.loginMode = false;
                        return;
                    }
                    _this.authService.register(_this.scope.info.email, _this.scope.info.password).then(function (response) {
                        // Sucess
                        _this.$state.go(App.Home.state);
                    }, function (response) {
                        // Failure
                        console.log(response);
                    });
                };
                this.authService = authService;
                this.$state = $state;
                $scope.loginMode = true;
                if ($state.current.url == '/register')
                    $scope.loginMode = false;
                this.scope = $scope;
                $scope.login = this.login;
                $scope.info = this.info;
                $scope.register = this.register;
            }
            LoginController.controllerId = "LoginController";
            LoginController.moduleId = Login.moduleId + "." + LoginController.controllerId;
            LoginController.$inject = ["$scope", "$state", App.Auth.AuthService.serviceId];
            return LoginController;
        })();
        Login.LoginController = LoginController;
        angular.module(LoginController.moduleId, [App.Nav.NavService.moduleId]).controller(LoginController.controllerId, LoginController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state("login", {
                templateUrl: Login.baseUrl + 'login.html',
                controller: LoginController.controllerId,
                url: "/login"
            }).state("register", {
                templateUrl: Login.baseUrl + 'login.html',
                controller: LoginController.controllerId,
                url: "/register"
            });
        }]);
    })(Login = App.Login || (App.Login = {}));
})(App || (App = {}));

/// <reference path="LoginGlobals.ts" />
/// <reference path="LoginController.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        angular.module(App.Login.moduleId, [App.Login.LoginController.moduleId]);
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var CompStruct;
    (function (CompStruct) {
        CompStruct.moduleId = App.moduleId + ".CompStruct";
        CompStruct.baseUrl = App.baseUrl + "CompStruct/";
    })(CompStruct = App.CompStruct || (App.CompStruct = {}));
})(App || (App = {}));

/// <reference path="CompStructGlobals.ts" />
var App;
(function (App) {
    var CompStruct;
    (function (CompStruct) {
        var CompStructDirective = (function () {
            function CompStructDirective($timeout) {
                var _this = this;
                this.$timeout = $timeout;
                this.$scope = {
                    comp: "="
                };
                this.restrict = "E";
                this.templateUrl = CompStruct.baseUrl + CompStructDirective.directiveId + ".html";
                this.compile = function () {
                    return {
                        "post": function (scope, elem, attrs) {
                            scope.show = true;
                            if (!scope.comp || !scope.comp.stages) {
                                scope.show = false;
                                return;
                            }
                            attrs.$observe('detail', function () {
                                scope.detail = scope.$eval(attrs.detail);
                                console.log(scope.detail);
                            });
                            for (var i = 0; i < scope.comp.stages.length; i++) {
                                if (!scope.comp.stages[i].event) {
                                    scope.show = false;
                                    return;
                                }
                                scope.comp.stages[i].eventStyle = {
                                    width: (100 / scope.comp.stages[i].event.length + "%")
                                };
                            }
                            var id = Math.floor((1 + Math.random()) * 0x1000000);
                            scope.id = id;
                            var connectors = [];
                            var canvas = elem.find('canvas')[0];
                            var ctx = canvas.getContext('2d');
                            ctx.lineWidth = 3;
                            _this.$timeout(function () {
                                var $canvas = $("canvas#" + id);
                                $canvas.attr('width', $canvas.parent().width());
                                $canvas.attr('height', $canvas.parent().height());
                                var stageHeight = 100 / scope.comp.stages.length;
                                scope.stageStyle = { height: stageHeight + "%" };
                                _this.$timeout(function () {
                                    for (var i = 1; i < scope.comp.stages.length; i++) {
                                        findConnections(scope.comp.stages[i - 1], scope.comp.stages[i]);
                                    }
                                    connect($canvas);
                                }, 0);
                            }, 0);
                            function findConnections(prevStage, nextStage) {
                                for (var i = 0; i < nextStage.event.length; i++) {
                                    var event = nextStage.event[i];
                                    for (var j = 0; j < event.seed.length; j++) {
                                        var seed = event.seed[j];
                                        for (var k = 0; k < prevStage.event.length; k++) {
                                            var fromEvent = prevStage.event[k];
                                            for (var ii = 0; ii < event.seed.length; ii++) {
                                                var fromSeed = event.seed[ii];
                                                if (seed == fromSeed) {
                                                    connectors.push({
                                                        from: $("#" + fromEvent.eventId + ">.event"),
                                                        to: $("#" + event.eventId + ">.event")
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            ;
                            function connect($canvas) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                for (var i = 0; i < connectors.length; i++) {
                                    var c = connectors[i];
                                    var origin = $canvas.offset();
                                    var eFrom = c.from;
                                    var eTo = c.to;
                                    var pos1 = eFrom.offset();
                                    var pos2 = eTo.offset();
                                    console.log("Origin: " + $canvas.width() + ", " + $canvas.height());
                                    console.log("Start: " + pos1.left + ", " + pos1.top);
                                    console.log("Fin: " + pos2.left + ", " + pos2.top);
                                    var startX = pos1.left + eFrom.width() / 2 - origin.left;
                                    var startY = pos1.top - origin.top;
                                    if (scope.detail) {
                                        startY += eFrom.height();
                                    }
                                    console.log(startX + ", " + startY);
                                    var finX = pos2.left + eTo.width() / 2 - origin.left;
                                    var finY = pos2.top - origin.top;
                                    if (!scope.detail) {
                                        finY += +eTo.height();
                                    }
                                    console.log(finX + ", " + finY);
                                    console.log("");
                                    ctx.beginPath();
                                    ctx.moveTo(startX, startY);
                                    ctx.lineTo(startX, (startY) + (finY - startY) / 2);
                                    ctx.lineTo(finX, (startY) + (finY - startY) / 2);
                                    ctx.lineTo(finX, finY);
                                    ctx.stroke();
                                }
                            }
                        }
                    };
                };
            }
            CompStructDirective.directiveId = "compStruct";
            CompStructDirective.moduleId = CompStruct.moduleId + "." + CompStructDirective.directiveId;
            CompStructDirective.$inject = ["$timeout"];
            CompStructDirective.factory = function ($timeout) {
                var comp = new CompStructDirective($timeout);
                return {
                    compile: comp.compile,
                    templateUrl: comp.templateUrl,
                    $scope: comp.$scope,
                    restrict: comp.restrict
                };
            };
            return CompStructDirective;
        })();
        CompStruct.CompStructDirective = CompStructDirective;
        angular.module(CompStructDirective.moduleId, []).directive(CompStructDirective.directiveId, ["$timeout", CompStructDirective.factory]);
    })(CompStruct = App.CompStruct || (App.CompStruct = {}));
})(App || (App = {}));

/// <reference path="CompStructGlobals.ts" />
/// <reference path="CompStructDirective.ts" />
var App;
(function (App) {
    var CompStruct;
    (function (CompStruct) {
        var dep = App.getChildModuleIds(CompStruct);
        angular.module(CompStruct.moduleId, dep);
    })(CompStruct = App.CompStruct || (App.CompStruct = {}));
})(App || (App = {}));

/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
/// <reference path="CompStruct/CompStructModule.ts"/>
var App;
(function (App) {
    var dep = App.getChildModuleIds(App, ["ui.bootstrap", "ui.router", "app-partials"]);
    angular.module(App.moduleId, dep);
})(App || (App = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvQXBwR2xvYmFscy50cyIsIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvTmF2L05hdkdsb2JhbHMudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL05hdi9OYXZTZXJ2aWNlLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9OYXYvTmF2TW9kdWxlLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9BdXRoL0F1dGhHbG9iYWxzLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9BdXRoL0F1dGhTZXJ2aWNlLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9BdXRoL0F1dGhNb2R1bGUudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL0RhdGEvRGF0YUdsb2JhbHMudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL0RhdGEvRGF0YVNlcnZpY2UudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL0RhdGEvRGF0YU1vZHVsZS50cyIsIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvU2hlbGwvU2hlbGxHbG9iYWxzLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9TaGVsbC9TaGVsbENvbnRyb2xsZXIudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL1NoZWxsL1NoZWxsTW9kdWxlLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9Ib21lL0hvbWVHbG9iYWxzLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9Ib21lL0hvbWVDb250cm9sbGVyLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9Ib21lL0hvbWVNb2R1bGUudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL0xvZ2luL0xvZ2luR2xvYmFscy50cyIsIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvTG9naW4vTG9naW5Db250cm9sbGVyLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9Mb2dpbi9Mb2dpbk1vZHVsZS50cyIsIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvQ29tcFN0cnVjdC9Db21wU3RydWN0R2xvYmFscy50cyIsIi9Vc2Vycy90aW0vRHJvcGJveC9zY2hvb2wvWTAzUzAyL0NJUzM3NjAvd2ViLWFwcGxpY2F0aW9uLWRldmVsb3AvQ29tcFN0cnVjdC9Db21wU3RydWN0RGlyZWN0aXZlLnRzIiwiL1VzZXJzL3RpbS9Ecm9wYm94L3NjaG9vbC9ZMDNTMDIvQ0lTMzc2MC93ZWItYXBwbGljYXRpb24tZGV2ZWxvcC9Db21wU3RydWN0L0NvbXBTdHJ1Y3RNb2R1bGUudHMiLCIvVXNlcnMvdGltL0Ryb3Bib3gvc2Nob29sL1kwM1MwMi9DSVMzNzYwL3dlYi1hcHBsaWNhdGlvbi1kZXZlbG9wL0FwcE1vZHVsZS50cyJdLCJuYW1lcyI6WyJBcHAiLCJBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMiLCJBcHAuTmF2IiwiQXBwLk5hdi5OYXZTZXJ2aWNlIiwiQXBwLk5hdi5OYXZTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLkF1dGgiLCJBcHAuQXV0aC5BdXRoU2VydmljZSIsIkFwcC5BdXRoLkF1dGhTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLkRhdGEiLCJBcHAuRGF0YS5EYXRhU2VydmljZSIsIkFwcC5EYXRhLkRhdGFTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLlNoZWxsIiwiQXBwLlNoZWxsLlNoZWxsQ29udHJvbGxlciIsIkFwcC5TaGVsbC5TaGVsbENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuSG9tZSIsIkFwcC5Ib21lLkhvbWVDb250cm9sbGVyIiwiQXBwLkhvbWUuSG9tZUNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuTG9naW4iLCJBcHAuTG9naW4uTG9naW5Db250cm9sbGVyIiwiQXBwLkxvZ2luLkxvZ2luQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5Db21wU3RydWN0IiwiQXBwLkNvbXBTdHJ1Y3QuQ29tcFN0cnVjdERpcmVjdGl2ZSIsIkFwcC5Db21wU3RydWN0LkNvbXBTdHJ1Y3REaXJlY3RpdmUuY29uc3RydWN0b3IiLCJBcHAuQ29tcFN0cnVjdC5Db21wU3RydWN0RGlyZWN0aXZlLmNvbnN0cnVjdG9yLmZpbmRDb25uZWN0aW9ucyIsIkFwcC5Db21wU3RydWN0LkNvbXBTdHJ1Y3REaXJlY3RpdmUuY29uc3RydWN0b3IuY29ubmVjdCJdLCJtYXBwaW5ncyI6IkFBQUEsZ0RBQWdEO0FBR2hELElBQU8sR0FBRyxDQWtDVDtBQWxDRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBaUJHQSxZQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNqQkEsV0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0E7SUFFN0JBLEFBSUFBOzs7T0FER0E7YUFDYUEsaUJBQWlCQSxDQUFDQSxNQUFlQSxFQUFFQSxHQUFjQTtRQUM3REMsSUFBSUEsR0FBR0EsR0FBYUEsR0FBR0EsSUFBRUEsRUFBRUEsQ0FBQ0E7UUFDNUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLElBQUlBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFFQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0VBLEdBQUdBLENBQUNBLElBQUlBLENBQVdBLE1BQU1BLENBQUNBLFFBQVFBLENBQUVBLENBQUNBLFFBQVFBLENBQUNBLENBQUFBO1lBQ2xEQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFBQTtJQUNkQSxDQUFDQTtJQVJlRCxxQkFBaUJBLEdBQWpCQSxpQkFRZkEsQ0FBQUE7QUFFTEEsQ0FBQ0EsRUFsQ00sR0FBRyxLQUFILEdBQUcsUUFrQ1Q7O0FDckNELEFBQ0EseUNBRHlDO0FBQ3pDLElBQU8sR0FBRyxDQUlUO0FBSkQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLEdBQUdBLENBSWJBO0lBSlVBLFdBQUFBLEdBQUdBLEVBQUNBLENBQUNBO1FBRURFLFlBQVFBLEdBQUdBLEdBQUdBLENBQUNBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO1FB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QUdBLEdBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO2dDQUM3Q0EsS0FBS0EsQ0FBQ0EsVUFBVUEsR0FBR0EsRUFBQ0EsTUFBTUEsRUFBRUEsV0FBV0EsR0FBQ0EsR0FBR0EsRUFBQ0EsQ0FBQ0E7Z0NBRTdDQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtvQ0FDVkEsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBR0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBR0EsQ0FBQ0EsRUFBR0EsRUFBRUEsQ0FBQ0E7d0NBQ2xEQSxlQUFlQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDbEVBLENBQUNBO29DQUNEQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtnQ0FDckJBLENBQUNBLEVBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNUQSxDQUFDQSxFQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFHTEEsU0FBU0EsZUFBZUEsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0E7Z0NBQ3pDQyxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQ0FDOUNBLElBQUlBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29DQUMvQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0NBQ3pDQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3Q0FDekJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBOzRDQUM5Q0EsSUFBSUEsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQUE7NENBQ2xDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQTtnREFDNUNBLElBQUlBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO2dEQUM5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0RBQ25CQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQTt3REFDWkEsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0EsT0FBT0EsR0FBR0EsU0FBU0EsQ0FBQ0E7d0RBQzVDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxHQUFHQSxTQUFTQSxDQUFDQTtxREFDekNBLENBQUNBLENBQUNBO2dEQUNQQSxDQUFDQTs0Q0FDTEEsQ0FBQ0E7d0NBQ0xBLENBQUNBO29DQUNMQSxDQUFDQTtnQ0FDTEEsQ0FBQ0E7NEJBQ0xBLENBQUNBOzRCQUFBRCxDQUFDQTs0QkFFRkEsU0FBU0EsT0FBT0EsQ0FBQ0EsT0FBT0E7Z0NBQ3BCRSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxNQUFNQSxDQUFDQSxLQUFLQSxFQUFFQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQ0FDakRBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29DQUN6Q0EsSUFBSUEsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBRXRCQSxJQUFJQSxNQUFNQSxHQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtvQ0FFNUJBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO29DQUNuQkEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7b0NBRWZBLElBQUlBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO29DQUMxQkEsSUFBSUEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7b0NBRXhCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFVQSxHQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFDQSxJQUFJQSxHQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxDQUFDQTtvQ0FDOURBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFNBQVNBLEdBQUNBLElBQUlBLENBQUNBLElBQUlBLEdBQUNBLElBQUlBLEdBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29DQUMvQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBQ0EsSUFBSUEsR0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0NBRTdDQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtvQ0FDekRBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO29DQUVuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0NBQ2ZBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUFBO29DQUM1QkEsQ0FBQ0E7b0NBRURBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLElBQUlBLEdBQUNBLE1BQU1BLENBQUNBLENBQUNBO29DQUVoQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FBRUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0NBQ3BEQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtvQ0FFakNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO3dDQUNoQkEsSUFBSUEsSUFBSUEsQ0FBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQUE7b0NBQzFCQSxDQUFDQTtvQ0FDREEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBQ0EsSUFBSUEsR0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0NBRzVCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtvQ0FFaEJBLEdBQUdBLENBQUNBLFNBQVNBLEVBQUVB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QSxDQUFDQSxpQkFBaUJBLENBQUNBLEdBQUdBLEVBQUNBLENBQUNBLGNBQWNBLEVBQUVBLFdBQVdBLEVBQUVBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO0lBQ25GQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtBQUN0Q0EsQ0FBQ0EsRUFITSxHQUFHLEtBQUgsR0FBRyxRQUdUIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9UeXBpbmdzL3R5cGluZ3MuZC50c1wiIC8+XG5cblxubW9kdWxlIEFwcCB7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhbmd1bGFyIG1vZHVsZVxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1vZHVsZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYW5ndWxhciBtb2R1bGVcbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZUlkOnN0cmluZztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGJhc2UgdXJsIGZvciBhbnkgdGVtcGxhdGVzXG4gICAgICAgICAqL1xuICAgICAgICBiYXNlVXJsPzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBcIkFwcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IFwiL3NyYy9cIjtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvYmplY3QgdGhlIHBhcmVudCBtb2R1bGVzXG4gICAgICogQHJldHVybnMgbW9kdWxlIGlkcyBvZiBjaGlsZCBtb2R1bGVzXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENoaWxkTW9kdWxlSWRzKG9iamVjdDogSU1vZHVsZSwgZGVwPzogc3RyaW5nW10pOnN0cmluZ1tdIHtcbiAgICAgICAgdmFyIGRlcDogc3RyaW5nW10gPSBkZXB8fFtdO1xuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpJiZvYmplY3RbcHJvcGVydHldLmhhc093blByb3BlcnR5KFwibW9kdWxlSWRcIikpIHtcbiAgICAgICAgICAgICAgICBkZXAucHVzaCgoPElNb2R1bGU+b2JqZWN0W3Byb3BlcnR5XSkubW9kdWxlSWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlcFxuICAgIH1cblxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuTmF2IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5OYXZcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiTmF2L1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuTmF2IHtcblxuICAgIGludGVyZmFjZSBJTmF2SXRlbSB7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgc3RhdGU6IHN0cmluZztcbiAgICAgICAgb3JkZXI6IG51bWJlcjtcbiAgICAgICAgaWNvbj86IHN0cmluZztcblxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBOYXZTZXJ2aWNlIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlSWQgPSBcIk5hdlNlcnZpY2VcIlxuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gTmF2Lm1vZHVsZUlkICsgXCIuXCIgKyBOYXZTZXJ2aWNlLnNlcnZpY2VJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIHB1YmxpYyBuYXZJdGVtczogSU5hdkl0ZW1bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRJdGVtID0gKGl0ZW06IElOYXZJdGVtKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5hdkl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB0aGlzLm5hdkl0ZW1zLnNvcnQoKGE6IElOYXZJdGVtLCBiOiBJTmF2SXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShOYXZTZXJ2aWNlLm1vZHVsZUlkLCBbXSlcbiAgICAgICAgLnNlcnZpY2UoTmF2U2VydmljZS5zZXJ2aWNlSWQsIE5hdlNlcnZpY2UpXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5hdkdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk5hdlNlcnZpY2UudHNcIiAvPlxubW9kdWxlIEFwcC5OYXYge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIGNoaWxkIG1vZHVsZXNcbiAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICovXG4gICAgdmFyIGRlcCA9IEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhOYXYpO1xuXG4gICAgLy8gTWFrZXMgQXBwLk5hdiBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShOYXYubW9kdWxlSWQsIGRlcCk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5BdXRoIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5BdXRoXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkF1dGgvXCI7XG5cbiAgICBleHBvcnQgdmFyIExTX1VzZXJOYW1lID0gXCJSYW5rSXQuQXV0aC5Vc2VyTmFtZVwiO1xuICAgIGV4cG9ydCB2YXIgTFNfVXNlcklkID0gXCJSYW5rSXQuQXV0aC5Vc2VySWRcIjtcbiAgICBleHBvcnQgdmFyIExTX1VzZXJUb2tlbiA9IFwiUmFua0l0LkF1dGguVXNlclRva2VuXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQXV0aCB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElMb2dpblJlc3BvbnNlIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlYXNvbiBmb3IgZmFpbHVyZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhc29uOiBzdHJpbmdcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2hhcGUgb2YgdGhlIGRhdGEgcmV0dXJuZWQgdXBvbiBzdWNjZXNzZnVsIGF1dGhlbnRpY2F0aW9uXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElIdHRwTG9naW5SZXNvbHZlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBhdXRoIG9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgLy8gYXV0aCA6IHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgdXNlcm5hbWVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXNlck5hbWU6IHN0cmluZztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgdXNlciBJZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1c2VySWQ6IHN0cmluZztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdG9rZW46IHN0cmluZztcbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBzaGFwZSBvZiB0aGUgcHJvbWlzZSByZXNvbHV0aW9uIG9iamVjdC5cbiAgICAgKi9cbiAgICBpbnRlcmZhY2UgSUh0dHBMb2dpbkVycm9yIHtcbiAgICAgICAgbXNnOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB1c2VyIGF1dGhlbnRpY2F0aW9uIGFuZCBjdXJyZW50IHVzZXIgc3RhdGVcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiQXV0aGVudGljYXRpb25TZXJ2aWNlXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5cIiArIEF1dGhTZXJ2aWNlLnNlcnZpY2VJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtcIiRodHRwXCIsIFwiJHFcIiwgXCJsb2NhbFN0b3JhZ2VTZXJ2aWNlXCIsIFwiYXV0aFNlcnZpY2VcIl07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGh0dHAgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvbWlzZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2NhbCBzdG9yYWdlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlU2VydmljZTogbmcubG9jYWxTdG9yYWdlLklMb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VydmljZSB0aGF0IGhhbmRsZXMgNDAxIGFuZCA0MDMgZXJyb3JzXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGh0dHBBdXRoU2VydmljZSA6IG5nLmh0dHBBdXRoLklBdXRoU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBBdXRoU2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UsIGxvY2FsU3RvcmFnZVNlcnZpY2U6IG5nLmxvY2FsU3RvcmFnZS5JTG9jYWxTdG9yYWdlU2VydmljZSwgaHR0cEF1dGhTZXJ2aWNlOiBuZy5odHRwQXV0aC5JQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAgPSAkaHR0cDtcbiAgICAgICAgICAgIHRoaXMuJHEgPSAkcTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IGxvY2FsU3RvcmFnZVNlcnZpY2U7XG4gICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZSA9IGh0dHBBdXRoU2VydmljZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWRJbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb2tlbih0aGlzLmdldFRva2VuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ3MgaW4gd2l0aCB0aGUgZ2l2ZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkXG4gICAgICAgICAqIEBwYXJhbSB1c2VyTmFtZVxuICAgICAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2dpbiA9ICh1c2VyTmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogbmcuSVByb21pc2U8SUxvZ2luUmVzcG9uc2U+ID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJBdXRoRGF0YSgpO1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL2F1dGhlbnRpY2F0aW9uXCIsIHt1c2VyTmFtZTogdXNlck5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlOiBuZy5JSHR0cFByb21pc2VDYWxsYmFja0FyZzxJSHR0cExvZ2luUmVzb2x2ZT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdXRoRGF0YShyZXNwb25zZS5kYXRhLnVzZXJOYW1lLCByZXNwb25zZS5kYXRhLnVzZXJJZCxyZXNwb25zZS5kYXRhLnRva2VuKVxuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRodHRwLmdldChcImFwaS9jb21wZXRpdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAocmVzcG9uc2U6IG5nLklIdHRwUHJvbWlzZUNhbGxiYWNrQXJnPElIdHRwTG9naW5FcnJvcj4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiByZXNwb25zZS5kYXRhLm1zZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXJzIGEgbmV3IHVzZXJcbiAgICAgICAgICogQEF1dGhvciBUaW1cbiAgICAgICAgICogQHBhcmFtIHVzZXJOYW1lXG4gICAgICAgICAqIEBwYXJhbSBwYXNzd29yZFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHJlZ2lzdGVyID0gKHVzZXJOYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxJTG9naW5SZXNwb25zZT4gPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhckF1dGhEYXRhKCk7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAucG9zdChcIi9hcGkvdXNlcnNcIiwge3VzZXJOYW1lOiB1c2VyTmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkfSlcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAocmVzcG9uc2U6IG5nLklIdHRwUHJvbWlzZUNhbGxiYWNrQXJnPElIdHRwTG9naW5SZXNvbHZlPikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF1dGhEYXRhKHJlc3BvbnNlLmRhdGEudXNlck5hbWUscmVzcG9uc2UuZGF0YS51c2VySWQscmVzcG9uc2UuZGF0YS50b2tlbilcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8SUh0dHBMb2dpbkVycm9yPikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IHJlc3BvbnNlLmRhdGEubXNnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2dzIHRoZSBjdXJyZW50IHVzZXIgb3V0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgbG9nb3V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhckF1dGhEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgY3VycmVudGx5IGxvZ2dlZCBpbiBmYWxzZSBpZiBsb2dnZWQgb3V0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgaXNMb2dnZWRJbiA9ICgpOiBhbnkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmdldFVzZXJOYW1lKClcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0VXNlcklkKClcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0VG9rZW4oKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHVzZXIgbmFtZSBvZiB0aGUgY3VycmVudCB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0VXNlck5hbWUgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KEF1dGguTFNfVXNlck5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB1c2VyIGlkIG9mIHRoZSBjdXJyZW50IHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRVc2VySWQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KEF1dGguTFNfVXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSB0b2tlbiwgYW5kIHJldGllcyBmYWlsZWQgcmVxdWVzdHNcbiAgICAgICAgICogQHBhcmFtIHRva2VuXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHNldFRva2VuID0gKHRva2VuIDogU3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KEF1dGguTFNfVXNlclRva2VuLCB0b2tlbik7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwQXV0aFNlcnZpY2UubG9naW5Db25maXJtZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb24udG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwQXV0aFNlcnZpY2UubG9naW5DYW5jZWxsZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgYXV0aCB0b2tlblxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldFRva2VuID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChBdXRoLkxTX1VzZXJUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYXJzIHRoZSBhdXRoZW50aWNhdGlvbiBkYXRhXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGNsZWFyQXV0aERhdGEgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKEF1dGguTFNfVXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZShBdXRoLkxTX1VzZXJJZCk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKEF1dGguTFNfVXNlclRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBhdXRoZW50aWNhdGlvbiBkYXRhXG4gICAgICAgICAqIEBwYXJhbSB1c2VyTmFtZSBUaGUgdXNlciBuYW1lIG9mIHRoZSB1c2VyXG4gICAgICAgICAqIEBwYXJhbSB1c2VySWQgdGhlIHVzZXIgaWQgb2YgdGhlIHVzZXJcbiAgICAgICAgICogQHBhcmFtIHVzZXJUb2tlbiB0aGUgc2Vzc2lvbiB0b2tlblxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBzZXRBdXRoRGF0YSA9ICh1c2VyTmFtZTogc3RyaW5nLCB1c2VySWQ6IHN0cmluZywgdXNlclRva2VuOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5zZXQoQXV0aC5MU19Vc2VyTmFtZSwgdXNlck5hbWUpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChBdXRoLkxTX1VzZXJJZCwgdXNlcklkKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VG9rZW4odXNlclRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5ndWxhciBhbmQgc2VydmljZSByZWdpc3RyYXRpb25cbiAgICAgKi9cbiAgICBhbmd1bGFyLm1vZHVsZShBdXRoU2VydmljZS5tb2R1bGVJZCwgW1wiTG9jYWxTdG9yYWdlTW9kdWxlXCIsIFwiaHR0cC1hdXRoLWludGVyY2VwdG9yXCJdKVxuICAgICAgICAuc2VydmljZShBdXRoU2VydmljZS5zZXJ2aWNlSWQsIEF1dGhTZXJ2aWNlKVxuXG5cblxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoR2xvYmFscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoU2VydmljZS50c1wiLz5cblxubW9kdWxlIEFwcC5BdXRoIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBjaGlsZCBtb2R1bGVzXG4gICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQXV0aCk7XG5cbiAgICAvLyBNYWtlcyBBcHAuQXV0aCBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShBdXRoLm1vZHVsZUlkLCBkZXApO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuRGF0YSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuRGF0YVwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJEYXRhL1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkRhdGEge1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB1c2VyIGF1dGhlbnRpY2F0aW9uIGFuZCBjdXJyZW50IHVzZXIgc3RhdGVcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgRGF0YVNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiRGF0YVNlcnZpY2VcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLlwiICsgRGF0YVNlcnZpY2Uuc2VydmljZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3Q6IHN0cmluZ1tdID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcIiRzY2VcIl07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGh0dHAgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvbWlzZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwcm9taXNlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgJHNjZTogbmcuSVNDRVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgRGF0YVNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlLCAkc2NlOiBuZy5JU0NFU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy4kaHR0cCA9ICRodHRwO1xuICAgICAgICAgICAgdGhpcy4kcSA9ICRxO1xuICAgICAgICAgICAgdGhpcy4kc2NlID0gJHNjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdHJlYXRDb21wID0gKGNvbXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbXAuaGFzT3duUHJvcGVydHkoXCJzdHJlYW1VUkxcIikpe1xuICAgICAgICAgICAgICAgIGNvbXAuc3RyZWFtVVJMID0gdGhpcy4kc2NlLnRydXN0QXNSZXNvdXJjZVVybChjb21wLnN0cmVhbVVSTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0QWxsQ29tcHMgPSAoKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUNvbXBldGl0aW9uW10+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuXG4gICAgICAgICAgICB0aGlzLiRodHRwLmdldChcIi9hcGkvY29tcGV0aXRpb25zXCIpLnN1Y2Nlc3MoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuY29tcGV0aXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBldGl0aW9uSWRcIjogXCJjMlwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCIzNzYwIE1lZXRpbmcgRXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiQ2xhc3MhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJIGhvcGUgRGVuaXMgbGlrZXMgaXQhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJEZW5pcycgT2ZmaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwicmVzdWx0c1wiOiBcIltdXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogXCJJbiBQcm9ncmVzc1wiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGF0YS5jb21wZXRpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcGV0aXRpb25JZFwiOiBcImMzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiVGVzdFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVHdpdGNoIFN0cmVhbSBUZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJUZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwicmVzdWx0c1wiOiBcIltdXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogXCJJbiBQcm9ncmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0cmVhbVVSTFwiOiBcImh0dHA6Ly93d3cudHdpdGNoLnR2L2ZyYWdiaXRlbGl2ZS9lbWJlZFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBkYXRhLmNvbXBldGl0aW9ucy5sZW5ndGggOyBpICsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlYXRDb21wKGRhdGEuY29tcGV0aXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YS5jb21wZXRpdGlvbnMpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmd1bGFyIGFuZCBzZXJ2aWNlIHJlZ2lzdHJhdGlvblxuICAgICAqL1xuICAgIGFuZ3VsYXIubW9kdWxlKERhdGFTZXJ2aWNlLm1vZHVsZUlkLCBbXSlcbiAgICAgICAgLnNlcnZpY2UoRGF0YVNlcnZpY2Uuc2VydmljZUlkLCBEYXRhU2VydmljZSlcblxuXG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YUdsb2JhbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YVNlcnZpY2UudHNcIi8+XG5cbm1vZHVsZSBBcHAuRGF0YSB7XG4gICAgLyoqXG4gICAgICogVGhlIGxpc3Qgb2YgY2hpbGQgbW9kdWxlc1xuICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgKi9cbiAgICB2YXIgZGVwID0gQXBwLmdldENoaWxkTW9kdWxlSWRzKERhdGEpO1xuXG4gICAgLy8gTWFrZXMgQXBwLkF1dGggbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoRGF0YS5tb2R1bGVJZCwgZGVwKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlNoZWxsIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5TaGVsbFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJTaGVsbC9cIjtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2hlbGxHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuU2hlbGwge1xuXG4gICAgaW50ZXJmYWNlIElTaGVsbENvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICBuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZTtcbiAgICAgICAgYXV0aFNlcnZpY2U6IEF1dGguQXV0aFNlcnZpY2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFNoZWxsQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlck5hbWUgPSBcIlNoZWxsQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gU2hlbGwubW9kdWxlSWQgKyBcIi5cIiArIFNoZWxsQ29udHJvbGxlci5jb250cm9sbGVyTmFtZTtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIE5hdi5OYXZTZXJ2aWNlLnNlcnZpY2VJZCwgQXV0aC5BdXRoU2VydmljZS5zZXJ2aWNlSWRdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgkc2NvcGU6IElTaGVsbENvbnRyb2xsZXJTaGVsbCwgbmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UsIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZT1cIkhlbGxvIFdvcmxkISFcIjtcbiAgICAgICAgICAgICRzY29wZS5uYXZTZXJ2aWNlPW5hdlNlcnZpY2U7XG4gICAgICAgICAgICAkc2NvcGUuYXV0aFNlcnZpY2U9YXV0aFNlcnZpY2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShTaGVsbENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKFNoZWxsQ29udHJvbGxlci5jb250cm9sbGVyTmFtZSwgU2hlbGxDb250cm9sbGVyKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2hlbGxHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaGVsbENvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5TaGVsbCB7XG4gICAgYW5ndWxhci5tb2R1bGUoU2hlbGwubW9kdWxlSWQsIFtTaGVsbC5TaGVsbENvbnRyb2xsZXIubW9kdWxlSWRdKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLkhvbWVcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiSG9tZS9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImhvbWVcIlxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuXG4gICAgaW50ZXJmYWNlIElIb21lQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIGNvbXBldGl0aW9uczpSYW5rSXQuSUNvbXBldGl0aW9uW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEhvbWVDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkhvbWVDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBIb21lLm1vZHVsZUlkICsgXCIuXCIgKyBIb21lQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAoJHNjb3BlOiBJSG9tZUNvbnRyb2xsZXJTaGVsbCwgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2U9XCJIZWxsbyBXb3JsZCEhXCI7XG4gICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb25zPVtdO1xuICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0QWxsQ29tcHMoKS50aGVuKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uW10pID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb25zID0gZGF0YTtcbiAgICAgICAgICAgIH0sIChmYWlsdXJlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShIb21lQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoSG9tZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLCBIb21lQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShIb21lLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEhvbWUuYmFzZVVybCsnaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBIb21lQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9ob21lXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuICAgICAgICAuY29uZmlnKFtcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCAoJHVybFJvdXRlclByb3ZpZGVyOiBuZy51aS5JVXJsUm91dGVyUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvaG9tZVwiKVxuICAgICAgICB9XSlcbiAgICAgICAgLnJ1bihbTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBmdW5jdGlvbiAobmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UpIHtcbiAgICAgICAgICAgIG5hdlNlcnZpY2UuYWRkSXRlbSh7c3RhdGU6SG9tZS5zdGF0ZSwgbmFtZTogXCJIb21lXCIsIG9yZGVyOiAwfSk7XG5cbiAgICAgICAgfV0pO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lR2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSG9tZUNvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5Ib21lIHtcbiAgICBhbmd1bGFyLm1vZHVsZShIb21lLm1vZHVsZUlkLCBbSG9tZS5Ib21lQ29udHJvbGxlci5tb2R1bGVJZF0pO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuTG9naW4ge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLkxvZ2luXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkxvZ2luL1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbkdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5Mb2dpbiB7XG5cbiAgICBpbnRlcmZhY2UgSUxvZ2luQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIGxvZ2luOiAoZGF0YTogYW55KSA9PiB2b2lkO1xuICAgICAgICByZWdpc3RlcjogKGRhdGE6IGFueSkgPT4gdm9pZDtcbiAgICAgICAgbG9naW5Nb2RlOiBib29sZWFuO1xuICAgICAgICBjaGFuZ2VWaWV3OiBhbnk7XG4gICAgICAgIGluZm86IHtcbiAgICAgICAgICAgIGZpcnN0TmFtZTogc3RyaW5nXG4gICAgICAgICAgICBsYXN0TmFtZTogc3RyaW5nXG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nXG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nXG4gICAgICAgICAgICBwYXNzd29yZDI6IHN0cmluZ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBMb2dpbkNvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiTG9naW5Db250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBMb2dpbi5tb2R1bGVJZCArIFwiLlwiICsgTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIEF1dGguQXV0aFNlcnZpY2Uuc2VydmljZUlkXTtcblxuICAgICAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlO1xuICAgICAgICBwcml2YXRlICRzdGF0ZTogbmcudWkuSVN0YXRlU2VydmljZTtcbiAgICAgICAgcHJpdmF0ZSBpbmZvID0ge1xuICAgICAgICAgICAgZmlyc3ROYW1lOiBcIlwiLFxuICAgICAgICAgICAgbGFzdE5hbWU6IFwiXCIsXG4gICAgICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgICAgICAgcGFzc3dvcmQyOiBcIlwiXG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBsb2dpbk1vZGUgPSB0cnVlO1xuICAgICAgICBwcml2YXRlIHNjb3BlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgkc2NvcGU6IElMb2dpbkNvbnRyb2xsZXJTaGVsbCwgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlLCBhdXRoU2VydmljZTogQXV0aC5BdXRoU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICAkc2NvcGUubG9naW5Nb2RlID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50LnVybCA9PSAnL3JlZ2lzdGVyJylcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9naW5Nb2RlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuc2NvcGUgPSAkc2NvcGVcblxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gdGhpcy5sb2dpblxuXG4gICAgICAgICAgICAkc2NvcGUuaW5mbyA9IHRoaXMuaW5mb1xuXG4gICAgICAgICAgICAkc2NvcGUucmVnaXN0ZXIgPSB0aGlzLnJlZ2lzdGVyXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2dpbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY29wZS5sb2dpbk1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmxvZ2luTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9naW4odGhpcy5zY29wZS5pbmZvLmVtYWlsLHRoaXMuc2NvcGUuaW5mby5wYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UgOiBBdXRoLklMb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Vzc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhIb21lLnN0YXRlKTtcbiAgICAgICAgICAgICAgICB9LCAocmVzcG9uc2UgOiBBdXRoLklMb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZhaWx1cmVcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJpdmF0ZSByZWdpc3RlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjb3BlLmxvZ2luTW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubG9naW5Nb2RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UucmVnaXN0ZXIodGhpcy5zY29wZS5pbmZvLmVtYWlsLCB0aGlzLnNjb3BlLmluZm8ucGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlIDogQXV0aC5JTG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWNlc3NcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oSG9tZS5zdGF0ZSk7XG4gICAgICAgICAgICAgICAgfSwgKHJlc3BvbnNlIDogQXV0aC5JTG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBGYWlsdXJlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKExvZ2luQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZCwgTG9naW5Db250cm9sbGVyKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsICgkcm91dGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLnN0YXRlKFwibG9naW5cIiwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBMb2dpbi5iYXNlVXJsKydsb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBMb2dpbkNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIlxuICAgICAgICAgICAgfSkuc3RhdGUoXCJyZWdpc3RlclwiLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IExvZ2luLmJhc2VVcmwrJ2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9yZWdpc3RlclwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luR2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTG9naW5Db250cm9sbGVyLnRzXCIgLz5cbm1vZHVsZSBBcHAuSG9tZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoTG9naW4ubW9kdWxlSWQsIFtMb2dpbi5Mb2dpbkNvbnRyb2xsZXIubW9kdWxlSWRdKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXBTdHJ1Y3Qge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLkNvbXBTdHJ1Y3RcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiQ29tcFN0cnVjdC9cIjtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tcFN0cnVjdEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5Db21wU3RydWN0IHtcblxuICAgIGludGVyZmFjZSBJU2hlbGxDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgbmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2U7XG4gICAgICAgIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb21wU3RydWN0RGlyZWN0aXZlIGltcGxlbWVudHMgbmcuSURpcmVjdGl2ZSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGlyZWN0aXZlSWQgPSBcImNvbXBTdHJ1Y3RcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IENvbXBTdHJ1Y3QubW9kdWxlSWQgKyBcIi5cIiArIENvbXBTdHJ1Y3REaXJlY3RpdmUuZGlyZWN0aXZlSWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiR0aW1lb3V0XCJdO1xuXG4gICAgICAgIHB1YmxpYyAkc2NvcGUgPSB7XG4gICAgICAgICAgICBjb21wOiBcIj1cIlxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlc3RyaWN0ID0gXCJFXCI7XG5cbiAgICAgICAgcHVibGljIHRlbXBsYXRlVXJsID0gQ29tcFN0cnVjdC5iYXNlVXJsK0NvbXBTdHJ1Y3REaXJlY3RpdmUuZGlyZWN0aXZlSWQrXCIuaHRtbFwiO1xuXG5cbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjb21waWxlID0gICgpID0+e1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBcInBvc3RcIjogIChzY29wZSwgZWxlbSwgYXR0cnMpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93PXRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2NvcGUuY29tcCB8fCAhc2NvcGUuY29tcC5zdGFnZXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvdz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdkZXRhaWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmRldGFpbCA9IHNjb3BlLiRldmFsKGF0dHJzLmRldGFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzY29wZS5kZXRhaWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjb3BlLmNvbXAuc3RhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLmNvbXAuc3RhZ2VzW2ldLmV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93PWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbXAuc3RhZ2VzW2ldLmV2ZW50U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICgxMDAgLyBzY29wZS5jb21wLnN0YWdlc1tpXS5ldmVudC5sZW5ndGggKyBcIiVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuaWQgPSBpZDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29ubmVjdG9ycyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBlbGVtLmZpbmQoJ2NhbnZhcycpWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoICgpID0+e1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkY2FudmFzPSAkKFwiY2FudmFzI1wiK2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignd2lkdGgnLCAkY2FudmFzLnBhcmVudCgpLndpZHRoKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNhbnZhcy5hdHRyKCdoZWlnaHQnLCAkY2FudmFzLnBhcmVudCgpLmhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFnZUhlaWdodD0xMDAvc2NvcGUuY29tcC5zdGFnZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc3RhZ2VTdHlsZSA9IHtoZWlnaHQ6IHN0YWdlSGVpZ2h0K1wiJVwifTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMSA7IGkgPCBzY29wZS5jb21wLnN0YWdlcy5sZW5ndGggOyBpICsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRDb25uZWN0aW9ucyhzY29wZS5jb21wLnN0YWdlc1tpLTFdLCBzY29wZS5jb21wLnN0YWdlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbm5lY3QoJGNhbnZhcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LDApO1xuICAgICAgICAgICAgICAgICAgICB9LDApO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZmluZENvbm5lY3Rpb25zKHByZXZTdGFnZSwgbmV4dFN0YWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHRTdGFnZS5ldmVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IG5leHRTdGFnZS5ldmVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGV2ZW50LnNlZWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlZWQgPSBldmVudC5zZWVkW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHByZXZTdGFnZS5ldmVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21FdmVudCA9IHByZXZTdGFnZS5ldmVudFtrXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGV2ZW50LnNlZWQubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21TZWVkID0gZXZlbnQuc2VlZFtpaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlZWQgPT0gZnJvbVNlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9ycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICQoXCIjXCIgKyBmcm9tRXZlbnQuZXZlbnRJZCArIFwiPi5ldmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAkKFwiI1wiICsgZXZlbnQuZXZlbnRJZCArIFwiPi5ldmVudFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY29ubmVjdCgkY2FudmFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbm5lY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGNvbm5lY3RvcnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luPSRjYW52YXMub2Zmc2V0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZUZyb20gPSBjLmZyb207XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVUbyA9IGMudG87XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zMSA9IGVGcm9tLm9mZnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MyID0gZVRvLm9mZnNldCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJPcmlnaW46IFwiKyRjYW52YXMud2lkdGgoKStcIiwgXCIrJGNhbnZhcy5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGFydDogXCIrcG9zMS5sZWZ0K1wiLCBcIitwb3MxLnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaW46IFwiK3BvczIubGVmdCtcIiwgXCIrcG9zMi50b3ApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0WCA9IHBvczEubGVmdCArIGVGcm9tLndpZHRoKCkgLyAyIC0gb3JpZ2luLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IHBvczEudG9wIC0gb3JpZ2luLnRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5kZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZICs9IGVGcm9tLmhlaWdodCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhcnRYK1wiLCBcIitzdGFydFkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpblggPSBwb3MyLmxlZnQgKyBlVG8ud2lkdGgoKSAvIDItIG9yaWdpbi5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaW5ZID0gcG9zMi50b3AgLSBvcmlnaW4udG9wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29wZS5kZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluWSArPSArIGVUby5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmaW5YK1wiLCBcIitmaW5ZKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhzdGFydFgsIChzdGFydFkpICsgKGZpblkgLSBzdGFydFkpIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhmaW5YLCAoc3RhcnRZKSArIChmaW5ZIC0gc3RhcnRZKSAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oZmluWCwgZmluWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBmYWN0b3J5ID0gZnVuY3Rpb24oJHRpbWVvdXQ6bmcuSVRpbWVvdXRTZXJ2aWNlKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IG5ldyBDb21wU3RydWN0RGlyZWN0aXZlKCR0aW1lb3V0KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29tcGlsZTogY29tcC5jb21waWxlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBjb21wLnRlbXBsYXRlVXJsLFxuICAgICAgICAgICAgICAgICRzY29wZTogY29tcC4kc2NvcGUsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6IGNvbXAucmVzdHJpY3RcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcFN0cnVjdERpcmVjdGl2ZS5tb2R1bGVJZCwgW10pLlxuICAgICAgICBkaXJlY3RpdmUoQ29tcFN0cnVjdERpcmVjdGl2ZS5kaXJlY3RpdmVJZCwgW1wiJHRpbWVvdXRcIiwgQ29tcFN0cnVjdERpcmVjdGl2ZS5mYWN0b3J5XSk7XG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tcFN0cnVjdEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBTdHJ1Y3REaXJlY3RpdmUudHNcIiAvPlxubW9kdWxlIEFwcC5Db21wU3RydWN0IHtcbiAgICB2YXIgZGVwID0gQXBwLmdldENoaWxkTW9kdWxlSWRzKENvbXBTdHJ1Y3QpO1xuICAgIGFuZ3VsYXIubW9kdWxlKENvbXBTdHJ1Y3QubW9kdWxlSWQsIGRlcCk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkFwcEdsb2JhbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2L05hdk1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoL0F1dGhNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YS9EYXRhTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsL1NoZWxsTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWUvSG9tZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbi9Mb2dpbk1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wU3RydWN0L0NvbXBTdHJ1Y3RNb2R1bGUudHNcIi8+XG5tb2R1bGUgQXBwIHtcbiAgICB2YXIgZGVwID0gQXBwLmdldENoaWxkTW9kdWxlSWRzKEFwcCxbXCJ1aS5ib290c3RyYXBcIiwgXCJ1aS5yb3V0ZXJcIiwgXCJhcHAtcGFydGlhbHNcIl0pO1xuICAgIGFuZ3VsYXIubW9kdWxlKEFwcC5tb2R1bGVJZCwgZGVwKTtcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=