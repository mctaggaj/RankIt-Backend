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
                        _this.setAuthData(response.data.auth.userName, response.data.auth.userId, response.data.auth.token);
                        defered.resolve({
                            reason: null
                        });
                        _this.$http.get("api/competitions");
                    }, function (response) {
                        defered.reject({
                            reason: response.data.description
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
                this.credentials = {
                    email: "",
                    password: ""
                };
                this.login = function () {
                    _this.authService.login(_this.credentials.email, _this.credentials.password).then(function (response) {
                        // Sucess
                        _this.$state.go(App.Home.state);
                    }, function (response) {
                        // Failure
                    });
                };
                this.authService = authService;
                this.$state = $state;
                $scope.credentials = this.credentials;
                $scope.login = this.login;
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
                templateUrl: Login.baseUrl + 'register.html',
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

/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
var App;
(function (App) {
    var dep = App.getChildModuleIds(App, ["ui.bootstrap", "ui.router", "app-partials"]);
    angular.module(App.moduleId, dep);
})(App || (App = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BcHBHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZTZXJ2aWNlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQXV0aC9BdXRoR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BdXRoL0F1dGhTZXJ2aWNlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0F1dGgvQXV0aE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9EYXRhL0RhdGFHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0RhdGEvRGF0YVNlcnZpY2UudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRGF0YS9EYXRhTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1NoZWxsL1NoZWxsR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TaGVsbC9TaGVsbENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU2hlbGwvU2hlbGxNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vSG9tZS9Ib21lR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Ib21lL0hvbWVDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0hvbWUvSG9tZU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Mb2dpbi9Mb2dpbkdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vTG9naW4vTG9naW5Db250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0xvZ2luL0xvZ2luTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0FwcE1vZHVsZS50cyJdLCJuYW1lcyI6WyJBcHAiLCJBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMiLCJBcHAuTmF2IiwiQXBwLk5hdi5OYXZTZXJ2aWNlIiwiQXBwLk5hdi5OYXZTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLkF1dGgiLCJBcHAuQXV0aC5BdXRoU2VydmljZSIsIkFwcC5BdXRoLkF1dGhTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLkRhdGEiLCJBcHAuRGF0YS5EYXRhU2VydmljZSIsIkFwcC5EYXRhLkRhdGFTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLlNoZWxsIiwiQXBwLlNoZWxsLlNoZWxsQ29udHJvbGxlciIsIkFwcC5TaGVsbC5TaGVsbENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuSG9tZSIsIkFwcC5Ib21lLkhvbWVDb250cm9sbGVyIiwiQXBwLkhvbWUuSG9tZUNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuTG9naW4iLCJBcHAuTG9naW4uTG9naW5Db250cm9sbGVyIiwiQXBwLkxvZ2luLkxvZ2luQ29udHJvbGxlci5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUEsZ0RBQWdEO0FBR2hELElBQU8sR0FBRyxDQWtDVDtBQWxDRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBaUJHQSxZQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNqQkEsV0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0E7SUFFN0JBLEFBSUFBOzs7T0FER0E7YUFDYUEsaUJBQWlCQSxDQUFDQSxNQUFlQSxFQUFFQSxHQUFjQTtRQUM3REMsSUFBSUEsR0FBR0EsR0FBYUEsR0FBR0EsSUFBRUEsRUFBRUEsQ0FBQ0E7UUFDNUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLElBQUlBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFFQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0VBLEdBQUdBLENBQUNBLElBQUlBLENB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Q1pBLENBQUNBLEVBL0RVakIsS0FBS0EsR0FBTEEsU0FBS0EsS0FBTEEsU0FBS0EsUUErRGZBO0FBQURBLENBQUNBLEVBL0RNLEdBQUcsS0FBSCxHQUFHLFFBK0RUOztBQ2hFRCxBQUVBLHdDQUZ3QztBQUN4QywyQ0FBMkM7QUFDM0MsSUFBTyxHQUFHLENBRVQ7QUFGRCxXQUFPLEdBQUc7SUFBQ0EsSUFBQUEsSUFBSUEsQ0FFZEE7SUFGVUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7UUFDYmMsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBS0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsU0FBS0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDckVBLENBQUNBLEVBRlVkLElBQUlBLEdBQUpBLFFBQUlBLEtBQUpBLFFBQUlBLFFBRWRBO0FBQURBLENBQUNBLEVBRk0sR0FBRyxLQUFILEdBQUcsUUFFVDs7QUNKRCxBQU9BLHFDQVBxQztBQUNyQyx3Q0FBd0M7QUFDeEMsMENBQTBDO0FBQzFDLDBDQUEwQztBQUMxQyw0Q0FBNEM7QUFDNUMsMENBQTBDO0FBQzFDLDRDQUE0QztBQUM1QyxJQUFPLEdBQUcsQ0FHVDtBQUhELFdBQU8sR0FBRyxFQUFDLENBQUM7SUFDUkEsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxHQUFHQSxFQUFDQSxDQUFDQSxjQUFjQSxFQUFFQSxXQUFXQSxFQUFFQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNuRkEsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDdENBLENBQUNBLEVBSE0sR0FBRyxLQUFILEdBQUcsUUFHVCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vVHlwaW5ncy90eXBpbmdzLmQudHNcIiAvPlxuXG5cbm1vZHVsZSBBcHAge1xuXG4gICAgLyoqXG4gICAgICogQW4gYW5ndWxhciBtb2R1bGVcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIElNb2R1bGUge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhlIGFuZ3VsYXIgbW9kdWxlXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGVJZDpzdHJpbmc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBiYXNlIHVybCBmb3IgYW55IHRlbXBsYXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgYmFzZVVybD86IHN0cmluZztcbiAgICB9XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gXCJBcHBcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBcIi9zcmMvXCI7XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JqZWN0IHRoZSBwYXJlbnQgbW9kdWxlc1xuICAgICAqIEByZXR1cm5zIG1vZHVsZSBpZHMgb2YgY2hpbGQgbW9kdWxlc1xuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDaGlsZE1vZHVsZUlkcyhvYmplY3Q6IElNb2R1bGUsIGRlcD86IHN0cmluZ1tdKTpzdHJpbmdbXSB7XG4gICAgICAgIHZhciBkZXA6IHN0cmluZ1tdID0gZGVwfHxbXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSYmb2JqZWN0W3Byb3BlcnR5XS5oYXNPd25Qcm9wZXJ0eShcIm1vZHVsZUlkXCIpKSB7XG4gICAgICAgICAgICAgICAgZGVwLnB1c2goKDxJTW9kdWxlPm9iamVjdFtwcm9wZXJ0eV0pLm1vZHVsZUlkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXBcbiAgICB9XG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLk5hdiB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuTmF2XCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIk5hdi9cIjtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLk5hdiB7XG5cbiAgICBpbnRlcmZhY2UgSU5hdkl0ZW0ge1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgIHN0YXRlOiBzdHJpbmc7XG4gICAgICAgIG9yZGVyOiBudW1iZXI7XG4gICAgICAgIGljb24/OiBzdHJpbmc7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTmF2U2VydmljZSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZUlkID0gXCJOYXZTZXJ2aWNlXCJcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IE5hdi5tb2R1bGVJZCArIFwiLlwiICsgTmF2U2VydmljZS5zZXJ2aWNlSWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdDogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICBwdWJsaWMgbmF2SXRlbXM6IElOYXZJdGVtW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYWRkSXRlbSA9IChpdGVtOiBJTmF2SXRlbSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uYXZJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgdGhpcy5uYXZJdGVtcy5zb3J0KChhOiBJTmF2SXRlbSwgYjogSU5hdkl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoTmF2U2VydmljZS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKE5hdlNlcnZpY2Uuc2VydmljZUlkLCBOYXZTZXJ2aWNlKVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZTZXJ2aWNlLnRzXCIgLz5cbm1vZHVsZSBBcHAuTmF2IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBjaGlsZCBtb2R1bGVzXG4gICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoTmF2KTtcblxuICAgIC8vIE1ha2VzIEFwcC5OYXYgbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoTmF2Lm1vZHVsZUlkLCBkZXApO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQXV0aCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuQXV0aFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJBdXRoL1wiO1xuXG4gICAgZXhwb3J0IHZhciBMU19Vc2VyTmFtZSA9IFwiUmFua0l0LkF1dGguVXNlck5hbWVcIjtcbiAgICBleHBvcnQgdmFyIExTX1VzZXJJZCA9IFwiUmFua0l0LkF1dGguVXNlcklkXCI7XG4gICAgZXhwb3J0IHZhciBMU19Vc2VyVG9rZW4gPSBcIlJhbmtJdC5BdXRoLlVzZXJUb2tlblwiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkF1dGgge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTG9naW5SZXNwb25zZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWFzb24gZm9yIGZhaWx1cmVcbiAgICAgICAgICovXG4gICAgICAgIHJlYXNvbjogc3RyaW5nXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHNoYXBlIG9mIHRoZSBkYXRhIHJldHVybmVkIHVwb24gc3VjY2Vzc2Z1bCBhdXRoZW50aWNhdGlvblxuICAgICAqL1xuICAgIGludGVyZmFjZSBJSHR0cExvZ2luUmVzb2x2ZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYXV0aCBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIGF1dGggOiB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIHVzZXJuYW1lXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIHVzZXIgSWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXNlcklkOiBzdHJpbmc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRva2VuOiBzdHJpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2hhcGUgb2YgdGhlIHByb21pc2UgcmVzb2x1dGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElIdHRwTG9naW5FcnJvciB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB1c2VyIGF1dGhlbnRpY2F0aW9uIGFuZCBjdXJyZW50IHVzZXIgc3RhdGVcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiQXV0aGVudGljYXRpb25TZXJ2aWNlXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5cIiArIEF1dGhTZXJ2aWNlLnNlcnZpY2VJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtcIiRodHRwXCIsIFwiJHFcIiwgXCJsb2NhbFN0b3JhZ2VTZXJ2aWNlXCIsIFwiYXV0aFNlcnZpY2VcIl07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGh0dHAgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvbWlzZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2NhbCBzdG9yYWdlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlU2VydmljZTogbmcubG9jYWxTdG9yYWdlLklMb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VydmljZSB0aGF0IGhhbmRsZXMgNDAxIGFuZCA0MDMgZXJyb3JzXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGh0dHBBdXRoU2VydmljZSA6IG5nLmh0dHBBdXRoLklBdXRoU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBBdXRoU2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UsIGxvY2FsU3RvcmFnZVNlcnZpY2U6IG5nLmxvY2FsU3RvcmFnZS5JTG9jYWxTdG9yYWdlU2VydmljZSwgaHR0cEF1dGhTZXJ2aWNlOiBuZy5odHRwQXV0aC5JQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAgPSAkaHR0cDtcbiAgICAgICAgICAgIHRoaXMuJHEgPSAkcTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IGxvY2FsU3RvcmFnZVNlcnZpY2U7XG4gICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZSA9IGh0dHBBdXRoU2VydmljZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWRJbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb2tlbih0aGlzLmdldFRva2VuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ3MgaW4gd2l0aCB0aGUgZ2l2ZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkXG4gICAgICAgICAqIEBwYXJhbSB1c2VyTmFtZVxuICAgICAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2dpbiA9ICh1c2VyTmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogbmcuSVByb21pc2U8SUxvZ2luUmVzcG9uc2U+ID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJBdXRoRGF0YSgpO1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL2F1dGhlbnRpY2F0aW9uXCIsIHt1c2VyTmFtZTogdXNlck5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlOiBuZy5JSHR0cFByb21pc2VDYWxsYmFja0FyZzxJSHR0cExvZ2luUmVzb2x2ZT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdXRoRGF0YShyZXNwb25zZS5kYXRhLmF1dGgudXNlck5hbWUscmVzcG9uc2UuZGF0YS5hdXRoLnVzZXJJZCxyZXNwb25zZS5kYXRhLmF1dGgudG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiYXBpL2NvbXBldGl0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8SUh0dHBMb2dpbkVycm9yPikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IHJlc3BvbnNlLmRhdGEuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ3MgdGhlIGN1cnJlbnQgdXNlciBvdXRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2dvdXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQXV0aERhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBjdXJyZW50bHkgbG9nZ2VkIGluIGZhbHNlIGlmIGxvZ2dlZCBvdXRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpc0xvZ2dlZEluID0gKCk6IGFueSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZ2V0VXNlck5hbWUoKVxuICAgICAgICAgICAgJiYgdGhpcy5nZXRVc2VySWQoKVxuICAgICAgICAgICAgJiYgdGhpcy5nZXRUb2tlbigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdXNlciBuYW1lIG9mIHRoZSBjdXJyZW50IHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRVc2VyTmFtZSA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXQoQXV0aC5MU19Vc2VyTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHVzZXIgaWQgb2YgdGhlIGN1cnJlbnQgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldFVzZXJJZCA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXQoQXV0aC5MU19Vc2VySWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHRva2VuLCBhbmQgcmV0aWVzIGZhaWxlZCByZXF1ZXN0c1xuICAgICAgICAgKiBAcGFyYW0gdG9rZW5cbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgc2V0VG9rZW4gPSAodG9rZW4gOiBTdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5zZXQoQXV0aC5MU19Vc2VyVG9rZW4sIHRva2VuKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb24udG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZS5sb2dpbkNvbmZpcm1lZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbi50b2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZS5sb2dpbkNhbmNlbGxlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBhdXRoIHRva2VuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0VG9rZW4gPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KEF1dGguTFNfVXNlclRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhcnMgdGhlIGF1dGhlbnRpY2F0aW9uIGRhdGFcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgY2xlYXJBdXRoRGF0YSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoQXV0aC5MU19Vc2VyTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKEF1dGguTFNfVXNlcklkKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoQXV0aC5MU19Vc2VyVG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGF1dGhlbnRpY2F0aW9uIGRhdGFcbiAgICAgICAgICogQHBhcmFtIHVzZXJOYW1lIFRoZSB1c2VyIG5hbWUgb2YgdGhlIHVzZXJcbiAgICAgICAgICogQHBhcmFtIHVzZXJJZCB0aGUgdXNlciBpZCBvZiB0aGUgdXNlclxuICAgICAgICAgKiBAcGFyYW0gdXNlclRva2VuIHRoZSBzZXNzaW9uIHRva2VuXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHNldEF1dGhEYXRhID0gKHVzZXJOYW1lOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nLCB1c2VyVG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChBdXRoLkxTX1VzZXJOYW1lLCB1c2VyTmFtZSk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KEF1dGguTFNfVXNlcklkLCB1c2VySWQpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlbih1c2VyVG9rZW4pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmd1bGFyIGFuZCBzZXJ2aWNlIHJlZ2lzdHJhdGlvblxuICAgICAqL1xuICAgIGFuZ3VsYXIubW9kdWxlKEF1dGhTZXJ2aWNlLm1vZHVsZUlkLCBbXCJMb2NhbFN0b3JhZ2VNb2R1bGVcIiwgXCJodHRwLWF1dGgtaW50ZXJjZXB0b3JcIl0pXG4gICAgICAgIC5zZXJ2aWNlKEF1dGhTZXJ2aWNlLnNlcnZpY2VJZCwgQXV0aFNlcnZpY2UpXG5cblxuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhHbG9iYWxzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhTZXJ2aWNlLnRzXCIvPlxuXG5tb2R1bGUgQXBwLkF1dGgge1xuICAgIC8qKlxuICAgICAqIFRoZSBsaXN0IG9mIGNoaWxkIG1vZHVsZXNcbiAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICovXG4gICAgdmFyIGRlcCA9IEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhBdXRoKTtcblxuICAgIC8vIE1ha2VzIEFwcC5BdXRoIG1vZHVsZVxuICAgIGFuZ3VsYXIubW9kdWxlKEF1dGgubW9kdWxlSWQsIGRlcCk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5EYXRhIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5EYXRhXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkRhdGEvXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuRGF0YSB7XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHVzZXIgYXV0aGVudGljYXRpb24gYW5kIGN1cnJlbnQgdXNlciBzdGF0ZVxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBEYXRhU2VydmljZSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZUlkID0gXCJEYXRhU2VydmljZVwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuXCIgKyBEYXRhU2VydmljZS5zZXJ2aWNlSWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdDogc3RyaW5nW10gPSBbXCIkaHR0cFwiLCBcIiRxXCIsIFwiJHNjZVwiXTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaHR0cCBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwcm9taXNlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgJHE6IG5nLklRU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByb21pc2Ugc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkc2NlOiBuZy5JU0NFU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBEYXRhU2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UsICRzY2U6IG5nLklTQ0VTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLiRodHRwID0gJGh0dHA7XG4gICAgICAgICAgICB0aGlzLiRxID0gJHE7XG4gICAgICAgICAgICB0aGlzLiRzY2UgPSAkc2NlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB0cmVhdENvbXAgPSAoY29tcDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcC5oYXNPd25Qcm9wZXJ0eShcInN0cmVhbVVSTFwiKSl7XG4gICAgICAgICAgICAgICAgY29tcC5zdHJlYW1VUkwgPSB0aGlzLiRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGNvbXAuc3RyZWFtVVJMKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRBbGxDb21wcyA9ICgpOm5nLklQcm9taXNlPFJhbmtJdC5JQ29tcGV0aXRpb25bXT4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiL2FwaS9jb21wZXRpdGlvbnNcIikuc3VjY2VzcygoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YS5jb21wZXRpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcGV0aXRpb25JZFwiOiBcImMyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIjM3NjAgTWVldGluZyBFdmVudFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1YmplY3RcIjogXCJDbGFzcyFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkkgaG9wZSBEZW5pcyBsaWtlcyBpdCFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkRlbmlzJyBPZmZpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJyZXN1bHRzXCI6IFwiW11cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBcIkluIFByb2dyZXNzXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkYXRhLmNvbXBldGl0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wZXRpdGlvbklkXCI6IFwiYzNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiVGVzdFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1YmplY3RcIjogXCJUZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJUd2l0Y2ggU3RyZWFtIFRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJsb2NhdGlvblwiOiBcIlRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJyZXN1bHRzXCI6IFwiW11cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0ZVwiOiBcIkluIFByb2dyZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RyZWFtVVJMXCI6IFwiaHR0cDovL3d3dy50d2l0Y2gudHYvZnJhZ2JpdGVsaXZlL2VtYmVkXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IGRhdGEuY29tcGV0aXRpb25zLmxlbmd0aCA7IGkgKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVhdENvbXAoZGF0YS5jb21wZXRpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhLmNvbXBldGl0aW9ucyk7XG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuZ3VsYXIgYW5kIHNlcnZpY2UgcmVnaXN0cmF0aW9uXG4gICAgICovXG4gICAgYW5ndWxhci5tb2R1bGUoRGF0YVNlcnZpY2UubW9kdWxlSWQsIFtdKVxuICAgICAgICAuc2VydmljZShEYXRhU2VydmljZS5zZXJ2aWNlSWQsIERhdGFTZXJ2aWNlKVxuXG5cblxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhR2xvYmFscy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhU2VydmljZS50c1wiLz5cblxubW9kdWxlIEFwcC5EYXRhIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBjaGlsZCBtb2R1bGVzXG4gICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRGF0YSk7XG5cbiAgICAvLyBNYWtlcyBBcHAuQXV0aCBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShEYXRhLm1vZHVsZUlkLCBkZXApO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuU2hlbGwge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLlNoZWxsXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIlNoZWxsL1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaGVsbEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TaGVsbCB7XG5cbiAgICBpbnRlcmZhY2UgSVNoZWxsQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIG5hdlNlcnZpY2U6IE5hdi5OYXZTZXJ2aWNlO1xuICAgICAgICBhdXRoU2VydmljZTogQXV0aC5BdXRoU2VydmljZTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU2hlbGxDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVyTmFtZSA9IFwiU2hlbGxDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBTaGVsbC5tb2R1bGVJZCArIFwiLlwiICsgU2hlbGxDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBBdXRoLkF1dGhTZXJ2aWNlLnNlcnZpY2VJZF07XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSVNoZWxsQ29udHJvbGxlclNoZWxsLCBuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSwgYXV0aFNlcnZpY2U6IEF1dGguQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlPVwiSGVsbG8gV29ybGQhIVwiO1xuICAgICAgICAgICAgJHNjb3BlLm5hdlNlcnZpY2U9bmF2U2VydmljZTtcbiAgICAgICAgICAgICRzY29wZS5hdXRoU2VydmljZT1hdXRoU2VydmljZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKFNoZWxsQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoU2hlbGxDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lLCBTaGVsbENvbnRyb2xsZXIpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaGVsbEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLlNoZWxsIHtcbiAgICBhbmd1bGFyLm1vZHVsZShTaGVsbC5tb2R1bGVJZCwgW1NoZWxsLlNoZWxsQ29udHJvbGxlci5tb2R1bGVJZF0pO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuSG9tZSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuSG9tZVwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJIb21lL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiaG9tZVwiXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWVHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuSG9tZSB7XG5cbiAgICBpbnRlcmZhY2UgSUhvbWVDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgY29tcGV0aXRpb25zOlJhbmtJdC5JQ29tcGV0aXRpb25bXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSG9tZUNvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiSG9tZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEhvbWUubW9kdWxlSWQgKyBcIi5cIiArIEhvbWVDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yICgkc2NvcGU6IElIb21lQ29udHJvbGxlclNoZWxsLCBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZT1cIkhlbGxvIFdvcmxkISFcIjtcbiAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbnM9W107XG4gICAgICAgICAgICBkYXRhU2VydmljZS5nZXRBbGxDb21wcygpLnRoZW4oKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb25bXSkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbnMgPSBkYXRhO1xuICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKEhvbWVDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihIb21lQ29udHJvbGxlci5jb250cm9sbGVySWQsIEhvbWVDb250cm9sbGVyKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsICgkcm91dGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLnN0YXRlKEhvbWUuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogSG9tZS5iYXNlVXJsKydob21lLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IEhvbWVDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2hvbWVcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pXG4gICAgICAgIC5jb25maWcoW1wiJHVybFJvdXRlclByb3ZpZGVyXCIsICgkdXJsUm91dGVyUHJvdmlkZXI6IG5nLnVpLklVcmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9ob21lXCIpXG4gICAgICAgIH1dKVxuICAgICAgICAucnVuKFtOYXYuTmF2U2VydmljZS5zZXJ2aWNlSWQsIGZ1bmN0aW9uIChuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSkge1xuICAgICAgICAgICAgbmF2U2VydmljZS5hZGRJdGVtKHtzdGF0ZTpIb21lLnN0YXRlLCBuYW1lOiBcIkhvbWVcIiwgb3JkZXI6IDB9KTtcblxuICAgICAgICB9XSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWVHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuICAgIGFuZ3VsYXIubW9kdWxlKEhvbWUubW9kdWxlSWQsIFtIb21lLkhvbWVDb250cm9sbGVyLm1vZHVsZUlkXSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5Mb2dpbiB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuTG9naW5cIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiTG9naW4vXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkxvZ2luIHtcblxuICAgIGludGVyZmFjZSBJTG9naW5Db250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgbG9naW46ICh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB2b2lkO1xuICAgICAgICBjaGFuZ2VWaWV3OiBhbnk7XG4gICAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nXG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nXG4gICAgICAgIH07XG4gICAgICAgIHJlZ2lzdGVyOiB7XG4gICAgICAgICAgICBmaXJzdE5hbWU6IHN0cmluZ1xuICAgICAgICAgICAgbGFzdE5hbWU6IHN0cmluZ1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZ1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZ1xuICAgICAgICAgICAgcGFzc3dvcmQyOiBzdHJpbmdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTG9naW5Db250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkxvZ2luQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gTG9naW4ubW9kdWxlSWQgKyBcIi5cIiArIExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBBdXRoLkF1dGhTZXJ2aWNlLnNlcnZpY2VJZF07XG5cbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aC5BdXRoU2VydmljZTtcbiAgICAgICAgcHJpdmF0ZSAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2U7XG4gICAgICAgIHByaXZhdGUgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBcIlwiXG4gICAgICAgIH1cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSUxvZ2luQ29udHJvbGxlclNoZWxsLCAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2UsIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG4gICAgICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcblxuICAgICAgICAgICAgJHNjb3BlLmNyZWRlbnRpYWxzID0gdGhpcy5jcmVkZW50aWFscztcblxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gIHRoaXMubG9naW47XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBsb2dpbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9naW4odGhpcy5jcmVkZW50aWFscy5lbWFpbCx0aGlzLmNyZWRlbnRpYWxzLnBhc3N3b3JkKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSA6IEF1dGguSUxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VjZXNzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKEhvbWUuc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0sIChyZXNwb25zZSA6IEF1dGguSUxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmFpbHVyZVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShMb2dpbkNvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQsIExvZ2luQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShcImxvZ2luXCIsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogTG9naW4uYmFzZVVybCsnbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICAgICAgICAgIH0pLnN0YXRlKFwicmVnaXN0ZXJcIiwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBMb2dpbi5iYXNlVXJsKydyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBMb2dpbkNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbkdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuICAgIGFuZ3VsYXIubW9kdWxlKExvZ2luLm1vZHVsZUlkLCBbTG9naW4uTG9naW5Db250cm9sbGVyLm1vZHVsZUlkXSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkFwcEdsb2JhbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2L05hdk1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoL0F1dGhNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YS9EYXRhTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsL1NoZWxsTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWUvSG9tZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbi9Mb2dpbk1vZHVsZS50c1wiLz5cbm1vZHVsZSBBcHAge1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQXBwLFtcInVpLmJvb3RzdHJhcFwiLCBcInVpLnJvdXRlclwiLCBcImFwcC1wYXJ0aWFsc1wiXSk7XG4gICAgYW5ndWxhci5tb2R1bGUoQXBwLm1vZHVsZUlkLCBkZXApO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==