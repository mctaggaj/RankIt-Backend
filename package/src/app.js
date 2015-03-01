/// <reference path="../Typings/Typings.d.ts"/>
/**
 * @author Jason McTaggart
 * The App module.
 * Contains all sub-modules and implementation required for the app
 */
var App;
(function (App) {
    App.moduleId = "App";
    App.baseUrl = "/src/";
    /**
     * Gets the list of child module ids given a module
     * @param object the parent modules
     * @param <optional> the array of dependencies to add to
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
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        Nav.moduleId = App.moduleId + ".Nav";
        Nav.baseUrl = App.baseUrl + "Nav/";
    })(Nav = App.Nav || (App.Nav = {}));
})(App || (App = {}));

/// <reference path="NavGlobals.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        /**
         * Use this service to add items to the nav bar.
         */
        var NavService = (function () {
            function NavService() {
                var _this = this;
                /**
                 * The list of items in the nav-bar
                 * @type {Array}
                 */
                this.navItems = [];
                /**
                 * Adds the given item to the nav-bar
                 * @param item
                 */
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
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Nav;
    (function (Nav) {
        // Makes App.Nav module
        angular.module(Nav.moduleId, App.getChildModuleIds(Nav));
    })(Nav = App.Nav || (App.Nav = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
/**
 * @author Jason McTaggart
 */
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
/**
 * @author Jason McTaggart
 * @subauthor Timothy Engel
 */
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
                        // Success
                        response.data.userName = userName;
                        _this.setAuthData(response.data.userName, response.data.userId, response.data.token);
                        defered.resolve({
                            reason: null
                        });
                    }, function (response) {
                        // Failure
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
                    _this.$http.delete("/api/authentication").success(function () {
                        _this.clearAuthData();
                    });
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
                        _this.$http.defaults.headers.common["X-Token"] = token;
                        _this.httpAuthService.loginConfirmed();
                    }
                    else {
                        // Clears the token
                        _this.$http.defaults.headers.common["X-Token"] = undefined;
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
/**
 * @author Jason McTaggart
 */
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
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Data;
    (function (Data) {
        Data.moduleId = App.moduleId + ".Data";
        Data.baseUrl = App.baseUrl + "Data/";
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));

/**
 * Handles data interactions between the app and the server
 *
 * @author Jason McTaggart
 *
 * @Sub-Author - Andrew Welton
 *  I copied and pasted Jason's working function and changed parameters as needed.
 *  All the functions are basically the same, Jason wrote the core one.
 */
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
                /**
                 * Treats the given competition data
                 * @param comp to treat
                 */
                this.treatComp = function (comp) {
                    // Makes Urls trusted
                    if (comp.hasOwnProperty("streamURL")) {
                        comp.streamURL = _this.$sce.trustAsResourceUrl(comp.streamURL);
                    }
                };
                /**
                 * Gets the list of competitions for the current user, only public competitions if no user is logged in
                 * @returns {IPromise<RankIt.ICompetition[]>}
                 */
                this.getAllComps = function () {
                    var defered = _this.$q.defer();
                    _this.$http.get("/api/competitions").success(function (data, status, headers, config) {
                        //Success
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
                        // Failure
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.getComp = function (id) {
                    var defered = _this.$q.defer();
                    _this.$http.get("/api/competitions/" + id).success(function (data, status, headers, config) {
                        _this.treatComp(data);
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.getStage = function (stageId) {
                    var defered = _this.$q.defer();
                    _this.$http.get("/api/competitions/stages/" + stageId).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.createCompetition = function (comp) {
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/competitions", comp).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.createStage = function (compId, stage) {
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/competitions/" + compId + "/stages", stage).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.createEvent = function (stageId, event) {
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/competitions/0/stages/" + stageId + "/events", event).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.editCompetition = function (comp) {
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/competitions", comp).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.getCompStages = function (compId) {
                    var defered = _this.$q.defer();
                    _this.$http.get("api/competitions/" + compId + "/stages").success(function (data, status, headers, config) {
                        defered.resolve(data.stages);
                    }).error(function (data, status, headers, config) {
                    });
                    return defered.promise;
                };
                this.getStageEvents = function (stageId) {
                    var defered = _this.$q.defer();
                    _this.$http.get("api/competitions/0/stages/" + stageId + "/events").success(function (data, status, headers, config) {
                        defered.resolve(data.events);
                    }).error(function (data, status, headers, config) {
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
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Data;
    (function (Data) {
        // Makes App.Auth module
        angular.module(Data.moduleId, App.getChildModuleIds(Data));
    })(Data = App.Data || (App.Data = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Shell;
    (function (Shell) {
        Shell.moduleId = App.moduleId + ".Shell";
        Shell.baseUrl = App.baseUrl + "Shell/";
    })(Shell = App.Shell || (App.Shell = {}));
})(App || (App = {}));

/// <reference path="ShellGlobals.ts" />
/**
 * @author Jason McTaggart
 */
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
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Shell;
    (function (Shell) {
        angular.module(Shell.moduleId, App.getChildModuleIds(Shell));
    })(Shell = App.Shell || (App.Shell = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
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

/**
 * Home Page
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="HomeGlobals.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        var HomeController = (function () {
            function HomeController($scope, dataService) {
                $scope.competitions = [];
                $scope.subjects = {};
                dataService.getAllComps().then(function (data) {
                    $scope.competitions = data;
                    for (var i = 0; i < data.length; i++) {
                        if ($scope.subjects[data[i].subject] === undefined) {
                            $scope.subjects[data[i].subject] = { name: data[i].subject, checked: true };
                        }
                    }
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
        }]).filter('homeFilter', function () {
            return function (input, options) {
                var output = [];
                for (var i in input) {
                    if (options[input[i].subject].checked == true) {
                        output.push(input[i]);
                    }
                }
                return output;
            };
        });
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="HomeGlobals.ts" />
/// <reference path="HomeController.ts" />
var App;
(function (App) {
    var Home;
    (function (Home) {
        angular.module(Home.moduleId, App.getChildModuleIds(Home));
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
/**
 * @author Timothy Engel
 */
var App;
(function (App) {
    var Login;
    (function (Login) {
        Login.moduleId = App.moduleId + ".Login";
        Login.baseUrl = App.baseUrl + "Login/";
    })(Login = App.Login || (App.Login = {}));
})(App || (App = {}));

/// <reference path="LoginGlobals.ts" />
/*
    Controls the login and register functionality
    @author	Timothy Engel
*/
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
                this.error = {
                    enabled: false,
                    title: "Error!",
                    state: "",
                    handler: function (self) {
                        console.log(self);
                        if (self.state == "BAD_LOGIN") {
                            _this.scope.loginMode = false;
                            self.enabled = false;
                        }
                    },
                    html: ""
                };
                this.loginMode = true;
                this.login = function () {
                    if (!_this.scope.loginMode) {
                        _this.scope.loginMode = true;
                        _this.error.enabled = false;
                        return;
                    }
                    _this.authService.login(_this.scope.info.email, _this.scope.info.password).then(function (response) {
                        // Sucess
                        _this.$state.go(App.Home.state);
                    }, function (response) {
                        _this.error.title = 'Error!';
                        _this.error.html = 'Invalid username or password. If you do not have an account, \
                        make sure you <a class="alert-link" ng-click="msg.handler(msg);">register</a>';
                        _this.error.state = "BAD_LOGIN";
                        _this.error.enabled = true;
                    });
                };
                this.register = function () {
                    if (_this.scope.loginMode) {
                        _this.scope.loginMode = false;
                        _this.error.enabled = false;
                        return;
                    }
                    _this.authService.register(_this.scope.info.email, _this.scope.info.password).then(function (response) {
                        // Sucess
                        _this.$state.go(App.Home.state);
                    }, function (response) {
                        // console.log(response)
                        _this.error.html = response.reason;
                        _this.error.enabled = true;
                        // console.log(response)
                    });
                };
                this.authService = authService;
                this.$state = $state;
                $scope.loginMode = true;
                if ($state.current.url == '/register')
                    $scope.loginMode = false;
                this.scope = $scope;
                $scope.login = this.login;
                $scope.register = this.register;
                $scope.info = this.info;
                $scope.error = this.error;
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
/**
 * @author Timothy Engel
 */
var App;
(function (App) {
    var Home;
    (function (Home) {
        angular.module(App.Login.moduleId, App.getChildModuleIds(App.Login));
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));

/**
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        Comp.moduleId = App.moduleId + ".Comp";
        Comp.baseUrl = App.baseUrl + "Comp/";
        Comp.state = "Comp";
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * View Competition Page
 * Andrew Welton
 */
/// <reference path="CompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var CompController = (function () {
            function CompController($scope, $state, $stateParams, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$state = $state;
                this.dataService = dataService;
                this.edit = function (compId) {
                    _this.$state.go(Comp.Edit.state, { compId: compId });
                };
                $scope.edit = this.edit;
                //If we have a competition structure, use it. Otherwise get it from the database
                if ($stateParams['comp']) {
                    $scope.competition = $stateParams['comp'];
                }
                else {
                    dataService.getComp($stateParams['compId']).then(function (data) {
                        console.log(data);
                        $scope.competition = data;
                    }, function (failure) {
                    });
                }
            }
            CompController.controllerId = "CompController";
            CompController.moduleId = Comp.moduleId + "." + CompController.controllerId;
            CompController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return CompController;
        })();
        Comp.CompController = CompController;
        angular.module(CompController.moduleId, [App.Nav.NavService.moduleId]).controller(CompController.controllerId, CompController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl + 'comp.html',
                controller: CompController.controllerId,
                url: "/comp/{compId}"
            });
        }]);
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../CompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Create;
        (function (Create) {
            Create.moduleId = Comp.moduleId + ".CreateComp";
            Create.baseUrl = Comp.baseUrl + "Create/";
            Create.state = "createComp";
        })(Create = Comp.Create || (Comp.Create = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Create Competition Controller
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="CreateCompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Create;
        (function (Create) {
            var CreateCompController = (function () {
                function CreateCompController($scope, $state, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        //Create the competition
                        _this.dataService.createCompetition(_this.$scope.comp).then(function (data) {
                            _this.$state.go(Comp.state, { compId: data.competitionId, comp: data });
                        }, function () {
                            // failure
                        });
                    };
                    $scope.submit = this.submit;
                }
                CreateCompController.controllerId = "CreateCompController";
                CreateCompController.moduleId = Create.moduleId + "." + CreateCompController.controllerId;
                CreateCompController.$inject = ["$scope", "$state", App.Data.DataService.serviceId];
                return CreateCompController;
            })();
            Create.CreateCompController = CreateCompController;
            angular.module(CreateCompController.moduleId, [App.Nav.NavService.moduleId]).controller(CreateCompController.controllerId, CreateCompController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Create.state, {
                    templateUrl: Create.baseUrl + 'createComp.html',
                    controller: CreateCompController.controllerId,
                    url: "/comp/create"
                });
            }]).run([App.Nav.NavService.serviceId, function (navService) {
                navService.addItem({ state: Create.state, name: "Create Competition", order: 0 });
            }]);
        })(Create = Comp.Create || (Comp.Create = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="CreateCompGlobals.ts" />
/// <reference path="CreateCompController.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Create;
        (function (Create) {
            angular.module(Create.moduleId, App.getChildModuleIds(Create));
        })(Create = Comp.Create || (Comp.Create = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../CompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Edit;
        (function (Edit) {
            Edit.moduleId = Comp.moduleId + ".EditComp";
            Edit.baseUrl = Comp.baseUrl + "Edit/";
            Edit.state = "editComp";
        })(Edit = Comp.Edit || (Comp.Edit = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Edit Competition Page
 * Andrew Welton
 */
/// <reference path="EditCompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Edit;
        (function (Edit) {
            var EditCompController = (function () {
                function EditCompController($scope, $state, $stateParams, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        _this.dataService.editCompetition(_this.$scope.comp).then(function (data) {
                            _this.$state.go(Comp.state, { compId: data.competitionId, comp: data });
                        }, function () {
                            // failure
                        });
                    };
                    this.addStage = function (comp) {
                        _this.$state.go(App.Stage.Create.state, { comp: comp });
                    };
                    $scope.submit = this.submit;
                    $scope.addStage = this.addStage;
                    dataService.getComp($stateParams['compId']).then(function (data) {
                        $scope.comp = data;
                    }, function (failure) {
                    });
                    //Get the stages in the competition to show on the page.
                    dataService.getCompStages($stateParams['compId']).then(function (data) {
                        console.log(data);
                        $scope.stages = data;
                    }, function (failure) {
                    });
                }
                EditCompController.controllerId = "EditCompController";
                EditCompController.moduleId = Edit.moduleId + "." + EditCompController.controllerId;
                EditCompController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
                return EditCompController;
            })();
            Edit.EditCompController = EditCompController;
            angular.module(EditCompController.moduleId, [App.Nav.NavService.moduleId]).controller(EditCompController.controllerId, EditCompController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Edit.state, {
                    templateUrl: Edit.baseUrl + 'editComp.html',
                    controller: EditCompController.controllerId,
                    url: "/comp/edit/{compId}"
                });
            }]);
        })(Edit = Comp.Edit || (Comp.Edit = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="EditCompGlobals.ts" />
/// <reference path="EditCompController.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Edit;
        (function (Edit) {
            angular.module(Edit.moduleId, App.getChildModuleIds(Edit));
        })(Edit = Comp.Edit || (Comp.Edit = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/// <reference path="../CompGlobals.ts" />
/**
 * @author Jason McTaggart
 * Used for displaying a competition's structure
 */
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var CompStruct;
        (function (CompStruct) {
            CompStruct.moduleId = Comp.moduleId + ".StructView";
            CompStruct.baseUrl = Comp.baseUrl + "StructView/";
        })(CompStruct = Comp.CompStruct || (Comp.CompStruct = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/// <reference path="CompStructGlobals.ts" />
/**
 * @author Jason McTaggart
 * A directive to display the visual representation of a competition's structure
 */
var App;
(function (App) {
    var Comp;
    (function (Comp) {
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
                    /**
                     * The Post Link function see https://docs.angularjs.org/api/ng/service/$compile
                     * @param scope
                     * @param elem
                     * @param attrs
                     */
                    this.postLink = function (scope, elem, attrs, controller, transclude) {
                        scope.show = true;
                        // BAIL OUT CONDITION
                        // No comp
                        // No stages
                        if (!scope.comp || !scope.comp.stages) {
                            scope.show = false;
                            return;
                        }
                        // Finds the appropriate with for events in each stage (width / number of events in stage)
                        scope.eventStyle = {};
                        for (var i = 0; i < scope.comp.stages.length; i++) {
                            // BAIL OUT CONDITION
                            // No events in stage
                            if (!scope.comp.stages[i].events) {
                                scope.show = false;
                                return;
                            }
                            scope.eventStyle[scope.comp.stages[i].stageId.toString()] = {
                                width: (100 / scope.comp.stages[i].events.length + "%")
                            };
                        }
                        // Generates an id so the element can be found using JQuery
                        var id = Math.floor((1 + Math.random()) * 0x1000000);
                        scope.id = id;
                        // Watches for changes in the detail function and propagates changes to scope
                        attrs.$observe('detail', function () {
                            scope.detail = scope.$eval(attrs.detail);
                        });
                        // Gives Angular time to complete directive rendering
                        _this.$timeout(function () {
                            var $canvas = $("canvas#" + id);
                            $canvas.attr('width', $canvas.parent().width());
                            $canvas.attr('height', $canvas.parent().height());
                            var stageHeight = 100 / scope.comp.stages.length;
                            scope.stageStyle = { height: stageHeight + "%" };
                            // Applies scope changes
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            // Finds all the connections
                            var connectors = [];
                            for (var i = 1; i < scope.comp.stages.length; i++) {
                                _this.findConnections(scope.comp.stages[i - 1], scope.comp.stages[i], connectors);
                            }
                            // Re-Draws when the canvas changes visibility to visible
                            scope.$watch(function () {
                                return $canvas.css("visibility");
                            }, function (newVal) {
                                // Re-Draws if the canvas is visible
                                if (newVal === "visible") {
                                    _this.draw($canvas, connectors);
                                }
                            });
                        }, 0);
                    };
                    /**
                     * Finds the connections given 2 stages and adds them to the connectors object
                     * @param prevStage
                     * @param nextStage
                     * @param connectors
                     */
                    this.findConnections = function (prevStage, nextStage, connectors) {
                        connectors = connectors || [];
                        for (var i = 0; i < nextStage.events.length; i++) {
                            // Finds all connections given a stage
                            var event = nextStage.events[i];
                            for (var j = 0; j < event.seed.length; j++) {
                                var seed = event.seed[j];
                                for (var k = 0; k < prevStage.events.length; k++) {
                                    var fromEvent = prevStage.events[k];
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
                    };
                    /**
                     * Draws the connections on the given canvas
                     * @param $canvas
                     * @param connectors
                     */
                    this.draw = function ($canvas, connectors) {
                        // Gets the context to draw on
                        var origin = $canvas.offset();
                        var ctx = $canvas[0].getContext("2d");
                        ctx.lineWidth = 3;
                        // Clears the canvas
                        ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
                        for (var i = 0; i < connectors.length; i++) {
                            var c = connectors[i];
                            // To and from elements
                            var eFrom = c.from;
                            var eTo = c.to;
                            var fromPos = eFrom.offset();
                            var toPos = eTo.offset();
                            // Start position
                            var startX = fromPos.left + eFrom.width() / 2 - origin.left;
                            var startY = fromPos.top - origin.top + 1;
                            // End position
                            var finX = toPos.left + eTo.width() / 2 - origin.left;
                            var finY = toPos.top - origin.top + eTo.height() - 1;
                            // Draws the lines
                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(startX, (startY) + (finY - startY) / 2);
                            ctx.lineTo(finX, (startY) + (finY - startY) / 2);
                            ctx.lineTo(finX, finY);
                            ctx.stroke();
                        }
                    };
                    /**
                     * The compile function see https://docs.angularjs.org/api/ng/service/$compile
                     * @returns {{post: IDirectiveLinkFn}}
                     */
                    this.compile = function (templateElement, templateAttributes, transclude) {
                        return {
                            post: _this.postLink
                        };
                    };
                }
                CompStructDirective.directiveId = "compStruct";
                CompStructDirective.moduleId = CompStruct.moduleId + "." + CompStructDirective.directiveId;
                CompStructDirective.$inject = ["$timeout"];
                /**
                 * The factory returning the directive
                 * @param $timeout
                 * @returns {ng.IDirective}
                 */
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
        })(CompStruct = Comp.CompStruct || (Comp.CompStruct = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/// <reference path="CompStructGlobals.ts" />
/// <reference path="CompStructDirective.ts" />
/**
 * @author Jason McTaggart
 * Used for displaying a competition's structure
 */
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var CompStruct;
        (function (CompStruct) {
            var dep = App.getChildModuleIds(CompStruct);
            angular.module(CompStruct.moduleId, dep);
        })(CompStruct = Comp.CompStruct || (Comp.CompStruct = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="CompGlobals.ts" />
/// <reference path="CompController.ts" />
/// <reference path="Create/CreateCompModule.ts" />
/// <reference path="Edit/EditCompModule.ts"/>
/// <reference path="StructView/CompStructModule.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        angular.module(Comp.moduleId, App.getChildModuleIds(Comp));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        Stage.moduleId = App.moduleId + ".Stage";
        Stage.baseUrl = App.baseUrl + "Stage/";
        Stage.state = "Stage";
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * View Stage Controller
 * Andrew Welton
 */
/// <reference path="StageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var StageController = (function () {
            function StageController($scope, $state, $stateParams, dataService) {
                this.$scope = $scope;
                this.$state = $state;
                this.dataService = dataService;
                this.edit = function (compId) {
                    //this.$state.go(Comp.Edit.state,{compId: compId});
                };
                $scope.edit = this.edit;
                if ($stateParams['stage']) {
                    $scope.stage = $stateParams['stage'];
                }
                else {
                    dataService.getStage($stateParams['stageId']).then(function (data) {
                        console.log(data);
                        $scope.stage = data;
                    }, function (failure) {
                    });
                }
            }
            StageController.controllerId = "StageController";
            StageController.moduleId = App.Comp.moduleId + "." + StageController.controllerId;
            StageController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return StageController;
        })();
        Stage.StageController = StageController;
        angular.module(StageController.moduleId, [App.Nav.NavService.moduleId]).controller(StageController.controllerId, StageController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Stage.state, {
                templateUrl: Stage.baseUrl + 'stage.html',
                controller: StageController.controllerId,
                url: "/stage/{stageId}",
                params: { 'stage': undefined }
            });
        }]);
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../StageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Create;
        (function (Create) {
            Create.moduleId = Stage.moduleId + ".CreateStage";
            Create.baseUrl = Stage.baseUrl + "Create/";
            Create.state = "createStage";
        })(Create = Stage.Create || (Stage.Create = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Create Stage controller
 * Andrew Welton
 */
/// <reference path="CreateStageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Create;
        (function (Create) {
            var CreateStageController = (function () {
                function CreateStageController($scope, $state, $stateParams, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        _this.dataService.createStage(_this.$scope.comp.competitionId, _this.$scope.stage).then(function (data) {
                            _this.$state.go(Stage.state, { 'stageId': data.stageId, 'stage': data });
                        }, function () {
                            // failure
                        });
                    };
                    $scope.comp = $stateParams['comp'];
                    $scope.submit = this.submit;
                }
                CreateStageController.controllerId = "CreateStageController";
                CreateStageController.moduleId = Create.moduleId + "." + CreateStageController.controllerId;
                CreateStageController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
                return CreateStageController;
            })();
            Create.CreateStageController = CreateStageController;
            angular.module(CreateStageController.moduleId, [App.Nav.NavService.moduleId]).controller(CreateStageController.controllerId, CreateStageController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Create.state, {
                    templateUrl: Create.baseUrl + 'createStage.html',
                    controller: CreateStageController.controllerId,
                    url: "/stage/create",
                    params: { 'comp': undefined }
                });
            }]);
        })(Create = Stage.Create || (Stage.Create = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="CreateStageGlobals.ts" />
/// <reference path="CreateStageController.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Create;
        (function (Create) {
            angular.module(Create.moduleId, App.getChildModuleIds(Create));
        })(Create = Stage.Create || (Stage.Create = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../StageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Edit;
        (function (Edit) {
            Edit.moduleId = Stage.moduleId + ".EditStage";
            Edit.baseUrl = Stage.baseUrl + "Edit/";
            Edit.state = "editStage";
        })(Edit = Stage.Edit || (Stage.Edit = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Edit Stage Controller
 * Andrew Welton
 */
/// <reference path="EditStageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Edit;
        (function (Edit) {
            var EditStageController = (function () {
                function EditStageController($scope, $state, $stateParams, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        /*this.dataService.editStage(this.$scope.comp).then((data: RankIt.ICompetition) => {
                            this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
                        }, () => {
                            // failure
                        });*/
                    };
                    $scope.submit = this.submit;
                    $scope.stage = $stateParams['stage'];
                    dataService.getStageEvents(this.$scope.stage.stageId).then(function (data) {
                        _this.$scope.events = data;
                    }, function () {
                        //failure
                    });
                }
                EditStageController.controllerId = "EditStageController";
                EditStageController.moduleId = Edit.moduleId + "." + EditStageController.controllerId;
                EditStageController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
                return EditStageController;
            })();
            Edit.EditStageController = EditStageController;
            angular.module(EditStageController.moduleId, [App.Nav.NavService.moduleId]).controller(EditStageController.controllerId, EditStageController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Edit.state, {
                    templateUrl: Edit.baseUrl + 'editStage.html',
                    controller: EditStageController.controllerId,
                    url: "/stage/edit/{stageId}",
                    params: { 'stage': undefined }
                });
            }]);
        })(Edit = Stage.Edit || (Stage.Edit = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="EditStageGlobals.ts" />
/// <reference path="EditStageController.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Edit;
        (function (Edit) {
            angular.module(Edit.moduleId, App.getChildModuleIds(Edit));
        })(Edit = Stage.Edit || (Stage.Edit = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="StageGlobals.ts" />
/// <reference path="StageController.ts" />
/// <reference path="Create/CreateStageModule.ts" />
/// <reference path="Edit/EditStageModule.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        angular.module(Stage.moduleId, App.getChildModuleIds(Stage));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../AppGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        Event.moduleId = App.moduleId + ".Event";
        Event.baseUrl = App.baseUrl + "Event/";
        Event.state = "Event";
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * View Event Controller
 * Andrew Welton
 */
/// <reference path="EventGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var EventController = (function () {
            function EventController($scope, $state, $stateParams, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$state = $state;
                this.dataService = dataService;
                this.edit = function (compId) {
                    _this.$state.go(App.Comp.Edit.state, { compId: compId });
                };
                $scope.edit = this.edit;
                if ($stateParams['comp']) {
                    $scope.competition = $stateParams['comp'];
                }
                else {
                    dataService.getComp($stateParams['compId']).then(function (data) {
                        console.log(data);
                        $scope.competition = data;
                    }, function (failure) {
                    });
                }
            }
            EventController.controllerId = "EventController";
            EventController.moduleId = App.Comp.moduleId + "." + EventController.controllerId;
            EventController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return EventController;
        })();
        Event.EventController = EventController;
        angular.module(EventController.moduleId, [App.Nav.NavService.moduleId]).controller(EventController.controllerId, EventController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Event.state, {
                templateUrl: Event.baseUrl + 'event.html',
                controller: EventController.controllerId,
                url: "/event/{eventId}",
                params: { 'event': undefined }
            });
        }]);
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../EventGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Create;
        (function (Create) {
            Create.moduleId = Event.moduleId + ".CreateEvent";
            Create.baseUrl = Event.baseUrl + "Create/";
            Create.state = "createEvent";
        })(Create = Event.Create || (Event.Create = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Create Event Controller
 * Andrew Welton
 */
/// <reference path="CreateEventGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Create;
        (function (Create) {
            var CreateEventController = (function () {
                function CreateEventController($scope, $state, $stateParams, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        _this.dataService.createEvent(_this.$scope.stage.stageId, _this.$scope.event).then(function (data) {
                            _this.$state.go(Event.state, { eventId: data.eventId, comp: data });
                        }, function () {
                            // failure
                        });
                    };
                    this.$scope.stage = $stateParams['stage'];
                    $scope.submit = this.submit;
                }
                CreateEventController.controllerId = "CreateEventController";
                CreateEventController.moduleId = Event.moduleId + "." + CreateEventController.controllerId;
                CreateEventController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
                return CreateEventController;
            })();
            Create.CreateEventController = CreateEventController;
            angular.module(CreateEventController.moduleId, [App.Nav.NavService.moduleId]).controller(CreateEventController.controllerId, CreateEventController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Create.state, {
                    templateUrl: Create.baseUrl + 'createEvent.html',
                    controller: CreateEventController.controllerId,
                    url: "/event/create",
                    params: { 'stage': undefined }
                });
            }]);
        })(Create = Event.Create || (Event.Create = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="CreateEventGlobals.ts" />
/// <reference path="CreateEventController.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Create;
        (function (Create) {
            angular.module(Create.moduleId, App.getChildModuleIds(Create));
        })(Create = Event.Create || (Event.Create = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="../EventGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Edit;
        (function (Edit) {
            Edit.moduleId = Event.moduleId + ".EditEvent";
            Edit.baseUrl = Event.baseUrl + "Edit/";
            Edit.state = "editEvent";
        })(Edit = Event.Edit || (Event.Edit = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Edit Event Controller
 * Andrew Welton
 */
/// <reference path="EditEventGlobals.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Edit;
        (function (Edit) {
            var EditEventController = (function () {
                function EditEventController($scope, $state, $stateParams, dataService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.submit = function () {
                        _this.dataService.editCompetition(_this.$scope.comp).then(function (data) {
                            _this.$state.go(App.Comp.state, { compId: data.competitionId, comp: data });
                        }, function () {
                            // failure
                        });
                    };
                    $scope.submit = this.submit;
                    console.log($state);
                    console.log($stateParams);
                    dataService.getComp($stateParams['compId']).then(function (data) {
                        console.log(data);
                        $scope.comp = data;
                    }, function (failure) {
                    });
                }
                EditEventController.controllerId = "EditEventController";
                EditEventController.moduleId = Edit.moduleId + "." + EditEventController.controllerId;
                EditEventController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
                return EditEventController;
            })();
            Edit.EditEventController = EditEventController;
            angular.module(EditEventController.moduleId, [App.Nav.NavService.moduleId]).controller(EditEventController.controllerId, EditEventController).config(["$stateProvider", function ($routeProvider) {
                $routeProvider.state(Edit.state, {
                    templateUrl: Edit.baseUrl + 'editEvent.html',
                    controller: EditEventController.controllerId,
                    url: "/event/edit/{compId}"
                });
            }]);
        })(Edit = Event.Edit || (Event.Edit = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="EditEventGlobals.ts" />
/// <reference path="EditEventController.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        var Edit;
        (function (Edit) {
            angular.module(Edit.moduleId, App.getChildModuleIds(Edit));
        })(Edit = Event.Edit || (Event.Edit = {}));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/**
 * Andrew Welton
 */
/// <reference path="EventGlobals.ts" />
/// <reference path="EventController.ts" />
/// <reference path="Create/CreateEventModule.ts" />
/// <reference path="Edit/EditEventModule.ts" />
var App;
(function (App) {
    var Event;
    (function (Event) {
        angular.module(Event.moduleId, App.getChildModuleIds(Event));
    })(Event = App.Event || (App.Event = {}));
})(App || (App = {}));

/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
/// <reference path="Comp/CompModule.ts"/>
/// <reference path="Stage/StageModule.ts"/>
/// <reference path="Event/EventModule.ts"/>
/**
 * @author Jason McTaggart
 * The App module.
 * Contains all sub-modules and implementation required for the app
 */
var App;
(function (App) {
    var dep = App.getChildModuleIds(App, ["ui.bootstrap", "ui.router", "app-partials", "ngAnimate"]);
    var app = angular.module(App.moduleId, dep);
    app.directive('dynamic', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            scope: { msg: '=dynamic' },
            link: function postLink(scope, element) {
                scope.$watch('msg', function (msg) {
                    element.html(msg.html);
                    $compile(element.contents())(scope);
                }, true);
            }
        };
    });
})(App || (App = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BcHBHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZTZXJ2aWNlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL05hdi9OYXZNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQXV0aC9BdXRoR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BdXRoL0F1dGhTZXJ2aWNlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0F1dGgvQXV0aE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9EYXRhL0RhdGFHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0RhdGEvRGF0YVNlcnZpY2UudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRGF0YS9EYXRhTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1NoZWxsL1NoZWxsR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TaGVsbC9TaGVsbENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU2hlbGwvU2hlbGxNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vSG9tZS9Ib21lR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Ib21lL0hvbWVDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0hvbWUvSG9tZU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Mb2dpbi9Mb2dpbkdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vTG9naW4vTG9naW5Db250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0xvZ2luL0xvZ2luTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvQ29tcEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9Db21wQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0NyZWF0ZS9DcmVhdGVDb21wR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0NyZWF0ZS9DcmVhdGVDb21wQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0NyZWF0ZS9DcmVhdGVDb21wTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvRWRpdC9FZGl0Q29tcEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9FZGl0L0VkaXRDb21wQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0VkaXQvRWRpdENvbXBNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9TdHJ1Y3RWaWV3L0NvbXBTdHJ1Y3RHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvU3RydWN0Vmlldy9Db21wU3RydWN0RGlyZWN0aXZlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvU3RydWN0Vmlldy9Db21wU3RydWN0TW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvQ29tcE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9TdGFnZUdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvU3RhZ2VDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL0NyZWF0ZS9DcmVhdGVTdGFnZUdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvQ3JlYXRlL0NyZWF0ZVN0YWdlQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9DcmVhdGUvQ3JlYXRlU3RhZ2VNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvRWRpdC9FZGl0U3RhZ2VHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL0VkaXQvRWRpdFN0YWdlQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9FZGl0L0VkaXRTdGFnZU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9TdGFnZU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9FdmVudEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRXZlbnQvRXZlbnRDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0NyZWF0ZS9DcmVhdGVFdmVudEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRXZlbnQvQ3JlYXRlL0NyZWF0ZUV2ZW50Q29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9DcmVhdGUvQ3JlYXRlRXZlbnRNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRXZlbnQvRWRpdC9FZGl0RXZlbnRHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0VkaXQvRWRpdEV2ZW50Q29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9FZGl0L0VkaXRFdmVudE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9FdmVudE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BcHBNb2R1bGUudHMiXSwibmFtZXMiOlsiQXBwIiwiQXBwLmdldENoaWxkTW9kdWxlSWRzIiwiQXBwLk5hdiIsIkFwcC5OYXYuTmF2U2VydmljZSIsIkFwcC5OYXYuTmF2U2VydmljZS5jb25zdHJ1Y3RvciIsIkFwcC5BdXRoIiwiQXBwLkF1dGguQXV0aFNlcnZpY2UiLCJBcHAuQXV0aC5BdXRoU2VydmljZS5jb25zdHJ1Y3RvciIsIkFwcC5EYXRhIiwiQXBwLkRhdGEuRGF0YVNlcnZpY2UiLCJBcHAuRGF0YS5EYXRhU2VydmljZS5jb25zdHJ1Y3RvciIsIkFwcC5TaGVsbCIsIkFwcC5TaGVsbC5TaGVsbENvbnRyb2xsZXIiLCJBcHAuU2hlbGwuU2hlbGxDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkhvbWUiLCJBcHAuSG9tZS5Ib21lQ29udHJvbGxlciIsIkFwcC5Ib21lLkhvbWVDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkxvZ2luIiwiQXBwLkxvZ2luLkxvZ2luQ29udHJvbGxlciIsIkFwcC5Mb2dpbi5Mb2dpbkNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuQ29tcCIsIkFwcC5Db21wLkNvbXBDb250cm9sbGVyIiwiQXBwLkNvbXAuQ29tcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuQ29tcC5DcmVhdGUiLCJBcHAuQ29tcC5DcmVhdGUuQ3JlYXRlQ29tcENvbnRyb2xsZXIiLCJBcHAuQ29tcC5DcmVhdGUuQ3JlYXRlQ29tcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuQ29tcC5FZGl0IiwiQXBwLkNvbXAuRWRpdC5FZGl0Q29tcENvbnRyb2xsZXIiLCJBcHAuQ29tcC5FZGl0LkVkaXRDb21wQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5Db21wLkNvbXBTdHJ1Y3QiLCJBcHAuQ29tcC5Db21wU3RydWN0LkNvbXBTdHJ1Y3REaXJlY3RpdmUiLCJBcHAuQ29tcC5Db21wU3RydWN0LkNvbXBTdHJ1Y3REaXJlY3RpdmUuY29uc3RydWN0b3IiLCJBcHAuU3RhZ2UiLCJBcHAuU3RhZ2UuU3RhZ2VDb250cm9sbGVyIiwiQXBwLlN0YWdlLlN0YWdlQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5TdGFnZS5DcmVhdGUiLCJBcHAuU3RhZ2UuQ3JlYXRlLkNyZWF0ZVN0YWdlQ29udHJvbGxlciIsIkFwcC5TdGFnZS5DcmVhdGUuQ3JlYXRlU3RhZ2VDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLlN0YWdlLkVkaXQiLCJBcHAuU3RhZ2UuRWRpdC5FZGl0U3RhZ2VDb250cm9sbGVyIiwiQXBwLlN0YWdlLkVkaXQuRWRpdFN0YWdlQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5FdmVudCIsIkFwcC5FdmVudC5FdmVudENvbnRyb2xsZXIiLCJBcHAuRXZlbnQuRXZlbnRDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkV2ZW50LkNyZWF0ZSIsIkFwcC5FdmVudC5DcmVhdGUuQ3JlYXRlRXZlbnRDb250cm9sbGVyIiwiQXBwLkV2ZW50LkNyZWF0ZS5DcmVhdGVFdmVudENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuRXZlbnQuRWRpdCIsIkFwcC5FdmVudC5FZGl0LkVkaXRFdmVudENvbnRyb2xsZXIiLCJBcHAuRXZlbnQuRWRpdC5FZGl0RXZlbnRDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwicG9zdExpbmsiXSwibWFwcGluZ3MiOiJBQUFBLCtDQUErQztBQUUvQyxBQUtBOzs7O0dBREc7QUFDSCxJQUFPLEdBQUcsQ0FvQ1Q7QUFwQ0QsV0FBTyxHQUFHLEVBQUMsQ0FBQztJQWlCR0EsWUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDakJBLFdBQU9BLEdBQUdBLE9BQU9BLENBQUNBO0lBRTdCQSxBQU1BQTs7Ozs7T0FER0E7YUFDYUEsaUJBQWlCQSxDQUFDQSxN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LEdBQUNBO2dDQUN0REEsS0FBS0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0E7NkJBQzFEQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBRURBLEFBQ0FBLDJEQUQyREE7NEJBQ3ZEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTt3QkFDckRBLEtBQUtBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO3dCQUVkQSxBQUNBQSw2RUFENkVBO3dCQUM3RUEsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUE7NEJBQ3JCLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBTyxLQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3BELENBQUMsQ0FBQ0EsQ0FBQ0E7d0JBRUhBLEFBQ0FBLHFEQURxREE7d0JBQ3JEQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFFQTs0QkFDWEEsSUFBSUEsT0FBT0EsR0FBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7NEJBQzdCQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQTs0QkFDaERBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBOzRCQUNsREEsSUFBSUEsV0FBV0EsR0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEs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QSxVQUFVQSxRQUFRQTtRQUMzQyxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsR0FBRztZQUNiLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBQztZQUN6QixJQUFJLEVBQUUsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU87Z0JBQ3BDa0QsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBRUEsS0FBS0EsRUFBR0EsVUFBU0EsR0FBR0E7b0JBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2QixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDWEEsQ0FBQ0E7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDbEQsQ0FBQ0E7QUFFTEEsQ0FBQ0EsRUFuQk0sR0FBRyxLQUFILEdBQUcsUUFtQlQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1R5cGluZ3MvVHlwaW5ncy5kLnRzXCIvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBUaGUgQXBwIG1vZHVsZS5cbiAqIENvbnRhaW5zIGFsbCBzdWItbW9kdWxlcyBhbmQgaW1wbGVtZW50YXRpb24gcmVxdWlyZWQgZm9yIHRoZSBhcHBcbiAqL1xubW9kdWxlIEFwcCB7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhbmd1bGFyIG1vZHVsZVxuICAgICAqL1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1vZHVsZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYW5ndWxhciBtb2R1bGVcbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZUlkOnN0cmluZztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGJhc2UgdXJsIGZvciBhbnkgdGVtcGxhdGVzXG4gICAgICAgICAqL1xuICAgICAgICBiYXNlVXJsPzogc3RyaW5nO1xuICAgIH1cblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBcIkFwcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IFwiL3NyYy9cIjtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxpc3Qgb2YgY2hpbGQgbW9kdWxlIGlkcyBnaXZlbiBhIG1vZHVsZVxuICAgICAqIEBwYXJhbSBvYmplY3QgdGhlIHBhcmVudCBtb2R1bGVzXG4gICAgICogQHBhcmFtIDxvcHRpb25hbD4gdGhlIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0byBhZGQgdG9cbiAgICAgKiBAcmV0dXJucyBtb2R1bGUgaWRzIG9mIGNoaWxkIG1vZHVsZXNcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2hpbGRNb2R1bGVJZHMob2JqZWN0OiBJTW9kdWxlLCBkZXA/OiBzdHJpbmdbXSk6c3RyaW5nW10ge1xuICAgICAgICB2YXIgZGVwOiBzdHJpbmdbXSA9IGRlcHx8W107XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkmJm9iamVjdFtwcm9wZXJ0eV0uaGFzT3duUHJvcGVydHkoXCJtb2R1bGVJZFwiKSkge1xuICAgICAgICAgICAgICAgIGRlcC5wdXNoKCg8SU1vZHVsZT5vYmplY3RbcHJvcGVydHldKS5tb2R1bGVJZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVwXG4gICAgfVxuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICovXG5tb2R1bGUgQXBwLk5hdiB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuTmF2XCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIk5hdi9cIjtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2R2xvYmFscy50c1wiIC8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuTmF2IHtcblxuICAgIC8qKlxuICAgICAqIEFuIEl0ZW0gdG8gYmUgcGxhY2VkIGluIHRoZSBuYXYgYmFyLlxuICAgICAqL1xuICAgIGludGVyZmFjZSBJTmF2SXRlbSB7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgc3RhdGU6IHN0cmluZztcbiAgICAgICAgb3JkZXI6IG51bWJlcjtcbiAgICAgICAgaWNvbj86IHN0cmluZztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIHNlcnZpY2UgdG8gYWRkIGl0ZW1zIHRvIHRoZSBuYXYgYmFyLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBOYXZTZXJ2aWNlIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlSWQgPSBcIk5hdlNlcnZpY2VcIlxuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gTmF2Lm1vZHVsZUlkICsgXCIuXCIgKyBOYXZTZXJ2aWNlLnNlcnZpY2VJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGlzdCBvZiBpdGVtcyBpbiB0aGUgbmF2LWJhclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgbmF2SXRlbXM6IElOYXZJdGVtW10gPSBbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyB0aGUgZ2l2ZW4gaXRlbSB0byB0aGUgbmF2LWJhclxuICAgICAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGFkZEl0ZW0gPSAoaXRlbTogSU5hdkl0ZW0pID0+IHtcbiAgICAgICAgICAgIHRoaXMubmF2SXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIHRoaXMubmF2SXRlbXMuc29ydCgoYTogSU5hdkl0ZW0sIGI6IElOYXZJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKE5hdlNlcnZpY2UubW9kdWxlSWQsIFtdKVxuICAgICAgICAuc2VydmljZShOYXZTZXJ2aWNlLnNlcnZpY2VJZCwgTmF2U2VydmljZSlcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2R2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2U2VydmljZS50c1wiIC8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuTmF2IHtcblxuICAgIC8vIE1ha2VzIEFwcC5OYXYgbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoTmF2Lm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoTmF2KSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuQXV0aCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuQXV0aFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJBdXRoL1wiO1xuXG4gICAgZXhwb3J0IHZhciBMU19Vc2VyTmFtZSA9IFwiUmFua0l0LkF1dGguVXNlck5hbWVcIjtcbiAgICBleHBvcnQgdmFyIExTX1VzZXJJZCA9IFwiUmFua0l0LkF1dGguVXNlcklkXCI7XG4gICAgZXhwb3J0IHZhciBMU19Vc2VyVG9rZW4gPSBcIlJhbmtJdC5BdXRoLlVzZXJUb2tlblwiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoR2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqIEBzdWJhdXRob3IgVGltb3RoeSBFbmdlbFxuICovXG5tb2R1bGUgQXBwLkF1dGgge1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTG9naW5SZXNwb25zZSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWFzb24gZm9yIGZhaWx1cmVcbiAgICAgICAgICovXG4gICAgICAgIHJlYXNvbjogc3RyaW5nXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHNoYXBlIG9mIHRoZSBkYXRhIHJldHVybmVkIHVwb24gc3VjY2Vzc2Z1bCBhdXRoZW50aWNhdGlvblxuICAgICAqL1xuICAgIGludGVyZmFjZSBJSHR0cExvZ2luUmVzb2x2ZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYXV0aCBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIC8vIGF1dGggOiB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIHVzZXJuYW1lXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVzZXJOYW1lOiBzdHJpbmc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIHVzZXIgSWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXNlcklkOiBzdHJpbmc7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRva2VuOiBzdHJpbmc7XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2hhcGUgb2YgdGhlIHByb21pc2UgcmVzb2x1dGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElIdHRwTG9naW5FcnJvciB7XG4gICAgICAgIG1zZzogc3RyaW5nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdXNlciBhdXRoZW50aWNhdGlvbiBhbmQgY3VycmVudCB1c2VyIHN0YXRlXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlSWQgPSBcIkF1dGhlbnRpY2F0aW9uU2VydmljZVwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuXCIgKyBBdXRoU2VydmljZS5zZXJ2aWNlSWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdDogc3RyaW5nW10gPSBbXCIkaHR0cFwiLCBcIiRxXCIsIFwibG9jYWxTdG9yYWdlU2VydmljZVwiLCBcImF1dGhTZXJ2aWNlXCJdO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBodHRwIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByb21pc2Ugc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbG9jYWwgc3RvcmFnZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGxvY2FsU3RvcmFnZVNlcnZpY2U6IG5nLmxvY2FsU3RvcmFnZS5JTG9jYWxTdG9yYWdlU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNlcnZpY2UgdGhhdCBoYW5kbGVzIDQwMSBhbmQgNDAzIGVycm9yc1xuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBodHRwQXV0aFNlcnZpY2UgOiBuZy5odHRwQXV0aC5JQXV0aFNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgQXV0aFNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlOiBuZy5sb2NhbFN0b3JhZ2UuSUxvY2FsU3RvcmFnZVNlcnZpY2UsIGh0dHBBdXRoU2VydmljZTogbmcuaHR0cEF1dGguSUF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLiRodHRwID0gJGh0dHA7XG4gICAgICAgICAgICB0aGlzLiRxID0gJHE7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuICAgICAgICAgICAgdGhpcy5odHRwQXV0aFNlcnZpY2UgPSBodHRwQXV0aFNlcnZpY2U7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9nZ2VkSW4oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW4odGhpcy5nZXRUb2tlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2dzIGluIHdpdGggdGhlIGdpdmVuIHVzZXJuYW1lIGFuZCBwYXNzd29yZFxuICAgICAgICAgKiBAcGFyYW0gdXNlck5hbWVcbiAgICAgICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgbG9naW4gPSAodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IG5nLklQcm9taXNlPElMb2dpblJlc3BvbnNlPiA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQXV0aERhdGEoKTtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KFwiL2FwaS9hdXRoZW50aWNhdGlvblwiLCB7dXNlck5hbWU6IHVzZXJOYW1lLCBwYXNzd29yZDogcGFzc3dvcmR9KVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8SUh0dHBMb2dpblJlc29sdmU+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS51c2VyTmFtZSA9IHVzZXJOYW1lIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF1dGhEYXRhKHJlc3BvbnNlLmRhdGEudXNlck5hbWUsIHJlc3BvbnNlLmRhdGEudXNlcklkLHJlc3BvbnNlLmRhdGEudG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAocmVzcG9uc2U6IG5nLklIdHRwUHJvbWlzZUNhbGxiYWNrQXJnPElIdHRwTG9naW5FcnJvcj4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmFpbHVyZVxuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFzb246IHJlc3BvbnNlLmRhdGEubXNnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWdpc3RlcnMgYSBuZXcgdXNlclxuICAgICAgICAgKiBAQXV0aG9yIFRpbVxuICAgICAgICAgKiBAcGFyYW0gdXNlck5hbWVcbiAgICAgICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIgPSAodXNlck5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IG5nLklQcm9taXNlPElMb2dpblJlc3BvbnNlPiA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQXV0aERhdGEoKTtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KFwiL2FwaS91c2Vyc1wiLCB7dXNlck5hbWU6IHVzZXJOYW1lLCBwYXNzd29yZDogcGFzc3dvcmR9KVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8SUh0dHBMb2dpblJlc29sdmU+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXV0aERhdGEocmVzcG9uc2UuZGF0YS51c2VyTmFtZSxyZXNwb25zZS5kYXRhLnVzZXJJZCxyZXNwb25zZS5kYXRhLnRva2VuKVxuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlOiBuZy5JSHR0cFByb21pc2VDYWxsYmFja0FyZzxJSHR0cExvZ2luRXJyb3I+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbjogcmVzcG9uc2UuZGF0YS5tc2dcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ3MgdGhlIGN1cnJlbnQgdXNlciBvdXRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2dvdXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLiRodHRwLmRlbGV0ZShcIi9hcGkvYXV0aGVudGljYXRpb25cIikuc3VjY2VzcygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckF1dGhEYXRhKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGN1cnJlbnRseSBsb2dnZWQgaW4gZmFsc2UgaWYgbG9nZ2VkIG91dFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGlzTG9nZ2VkSW4gPSAoKTogYW55ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5nZXRVc2VyTmFtZSgpXG4gICAgICAgICAgICAmJiB0aGlzLmdldFVzZXJJZCgpXG4gICAgICAgICAgICAmJiB0aGlzLmdldFRva2VuKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSB1c2VyIG5hbWUgb2YgdGhlIGN1cnJlbnQgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldFVzZXJOYW1lID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChBdXRoLkxTX1VzZXJOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdXNlciBpZCBvZiB0aGUgY3VycmVudCB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0VXNlcklkID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChBdXRoLkxTX1VzZXJJZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgdG9rZW4sIGFuZCByZXRpZXMgZmFpbGVkIHJlcXVlc3RzXG4gICAgICAgICAqIEBwYXJhbSB0b2tlblxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBzZXRUb2tlbiA9ICh0b2tlbiA6IFN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChBdXRoLkxTX1VzZXJUb2tlbiwgdG9rZW4pO1xuICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbltcIlgtVG9rZW5cIl0gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZS5sb2dpbkNvbmZpcm1lZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ2xlYXJzIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJYLVRva2VuXCJdID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMuaHR0cEF1dGhTZXJ2aWNlLmxvZ2luQ2FuY2VsbGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIGF1dGggdG9rZW5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRUb2tlbiA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXQoQXV0aC5MU19Vc2VyVG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyB0aGUgYXV0aGVudGljYXRpb24gZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBjbGVhckF1dGhEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZShBdXRoLkxTX1VzZXJOYW1lKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoQXV0aC5MU19Vc2VySWQpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZShBdXRoLkxTX1VzZXJUb2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgYXV0aGVudGljYXRpb24gZGF0YVxuICAgICAgICAgKiBAcGFyYW0gdXNlck5hbWUgVGhlIHVzZXIgbmFtZSBvZiB0aGUgdXNlclxuICAgICAgICAgKiBAcGFyYW0gdXNlcklkIHRoZSB1c2VyIGlkIG9mIHRoZSB1c2VyXG4gICAgICAgICAqIEBwYXJhbSB1c2VyVG9rZW4gdGhlIHNlc3Npb24gdG9rZW5cbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgc2V0QXV0aERhdGEgPSAodXNlck5hbWU6IHN0cmluZywgdXNlcklkOiBzdHJpbmcsIHVzZXJUb2tlbjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KEF1dGguTFNfVXNlck5hbWUsIHVzZXJOYW1lKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5zZXQoQXV0aC5MU19Vc2VySWQsIHVzZXJJZCk7XG4gICAgICAgICAgICB0aGlzLnNldFRva2VuKHVzZXJUb2tlbik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuZ3VsYXIgYW5kIHNlcnZpY2UgcmVnaXN0cmF0aW9uXG4gICAgICovXG4gICAgYW5ndWxhci5tb2R1bGUoQXV0aFNlcnZpY2UubW9kdWxlSWQsIFtcIkxvY2FsU3RvcmFnZU1vZHVsZVwiLCBcImh0dHAtYXV0aC1pbnRlcmNlcHRvclwiXSlcbiAgICAgICAgLnNlcnZpY2UoQXV0aFNlcnZpY2Uuc2VydmljZUlkLCBBdXRoU2VydmljZSlcblxuXG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQXV0aEdsb2JhbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQXV0aFNlcnZpY2UudHNcIi8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5BdXRoIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdCBvZiBjaGlsZCBtb2R1bGVzXG4gICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAqL1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQXV0aCk7XG5cbiAgICAvLyBNYWtlcyBBcHAuQXV0aCBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShBdXRoLm1vZHVsZUlkLCBkZXApO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICovXG5tb2R1bGUgQXBwLkRhdGEge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLkRhdGFcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiRGF0YS9cIjtcbn0iLCIvKipcbiAqIEhhbmRsZXMgZGF0YSBpbnRlcmFjdGlvbnMgYmV0d2VlbiB0aGUgYXBwIGFuZCB0aGUgc2VydmVyXG4gKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqXG4gKiBAU3ViLUF1dGhvciAtIEFuZHJldyBXZWx0b25cbiAqICBJIGNvcGllZCBhbmQgcGFzdGVkIEphc29uJ3Mgd29ya2luZyBmdW5jdGlvbiBhbmQgY2hhbmdlZCBwYXJhbWV0ZXJzIGFzIG5lZWRlZC5cbiAqICBBbGwgdGhlIGZ1bmN0aW9ucyBhcmUgYmFzaWNhbGx5IHRoZSBzYW1lLCBKYXNvbiB3cm90ZSB0aGUgY29yZSBvbmUuXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkRhdGEge1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB1c2VyIGF1dGhlbnRpY2F0aW9uIGFuZCBjdXJyZW50IHVzZXIgc3RhdGVcbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgRGF0YVNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiRGF0YVNlcnZpY2VcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLlwiICsgRGF0YVNlcnZpY2Uuc2VydmljZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3Q6IHN0cmluZ1tdID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcIiRzY2VcIl07XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGh0dHAgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvbWlzZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwcm9taXNlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgJHNjZTogbmcuSVNDRVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgRGF0YVNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlLCAkc2NlOiBuZy5JU0NFU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy4kaHR0cCA9ICRodHRwO1xuICAgICAgICAgICAgdGhpcy4kcSA9ICRxO1xuICAgICAgICAgICAgdGhpcy4kc2NlID0gJHNjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmVhdHMgdGhlIGdpdmVuIGNvbXBldGl0aW9uIGRhdGFcbiAgICAgICAgICogQHBhcmFtIGNvbXAgdG8gdHJlYXRcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgdHJlYXRDb21wID0gKGNvbXA6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gTWFrZXMgVXJscyB0cnVzdGVkXG4gICAgICAgICAgICBpZiAoY29tcC5oYXNPd25Qcm9wZXJ0eShcInN0cmVhbVVSTFwiKSl7XG4gICAgICAgICAgICAgICAgY29tcC5zdHJlYW1VUkwgPSB0aGlzLiRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGNvbXAuc3RyZWFtVVJMKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSBsaXN0IG9mIGNvbXBldGl0aW9ucyBmb3IgdGhlIGN1cnJlbnQgdXNlciwgb25seSBwdWJsaWMgY29tcGV0aXRpb25zIGlmIG5vIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAgICAgICAqIEByZXR1cm5zIHtJUHJvbWlzZTxSYW5rSXQuSUNvbXBldGl0aW9uW10+fVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldEFsbENvbXBzID0gKCk6bmcuSVByb21pc2U8UmFua0l0LklDb21wZXRpdGlvbltdPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCIvYXBpL2NvbXBldGl0aW9uc1wiKS5zdWNjZXNzKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAvL1N1Y2Nlc3NcblxuICAgICAgICAgICAgICAgIGRhdGEuY29tcGV0aXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBldGl0aW9uSWRcIjogXCJjMlwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCIzNzYwIE1lZXRpbmcgRXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiQ2xhc3MhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJJIGhvcGUgRGVuaXMgbGlrZXMgaXQhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJEZW5pcycgT2ZmaWNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwicmVzdWx0c1wiOiBcIltdXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogXCJJbiBQcm9ncmVzc1wiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGF0YS5jb21wZXRpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcGV0aXRpb25JZFwiOiBcImMzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlRlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiVGVzdFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVHdpdGNoIFN0cmVhbSBUZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJUZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHVibGljXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwicmVzdWx0c1wiOiBcIltdXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RhdGVcIjogXCJJbiBQcm9ncmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0cmVhbVVSTFwiOiBcImh0dHA6Ly93d3cudHdpdGNoLnR2L2ZyYWdiaXRlbGl2ZS9lbWJlZFwiXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBUcmVhdHMgYWxsIGNvbXBldGl0aW9uIGRhdGFcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IGRhdGEuY29tcGV0aXRpb25zLmxlbmd0aCA7IGkgKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVhdENvbXAoZGF0YS5jb21wZXRpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhLmNvbXBldGl0aW9ucyk7XG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbHVyZVxuXG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb21wID0gKGlkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUNvbXBldGl0aW9uPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCIvYXBpL2NvbXBldGl0aW9ucy9cIitpZCkuc3VjY2VzcygoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVhdENvbXAoZGF0YSk7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRTdGFnZSA9IChzdGFnZUlkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSVN0YWdlPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiL2FwaS9jb21wZXRpdGlvbnMvc3RhZ2VzL1wiK3N0YWdlSWQpLnN1Y2Nlc3MoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNyZWF0ZUNvbXBldGl0aW9uID0gKGNvbXApOm5nLklQcm9taXNlPFJhbmtJdC5JQ29tcGV0aXRpb24+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KFwiL2FwaS9jb21wZXRpdGlvbnNcIixjb21wKS5zdWNjZXNzKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uLCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3JlYXRlU3RhZ2UgPSAoY29tcElkLHN0YWdlKTpuZy5JUHJvbWlzZTxSYW5rSXQuSVN0YWdlPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAucG9zdChcIi9hcGkvY29tcGV0aXRpb25zL1wiK2NvbXBJZCtcIi9zdGFnZXNcIixzdGFnZSkuc3VjY2VzcygoZGF0YTogUmFua0l0LklTdGFnZSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3JlYXRlRXZlbnQgPSAoc3RhZ2VJZCxldmVudCk6bmcuSVByb21pc2U8UmFua0l0LklFdmVudD4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL2NvbXBldGl0aW9ucy8wL3N0YWdlcy9cIitzdGFnZUlkK1wiL2V2ZW50c1wiLGV2ZW50KS5zdWNjZXNzKChkYXRhOiBSYW5rSXQuSUV2ZW50LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBlZGl0Q29tcGV0aXRpb24gPSAoY29tcCk6bmcuSVByb21pc2U8UmFua0l0LklDb21wZXRpdGlvbj4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL2NvbXBldGl0aW9uc1wiLGNvbXApLnN1Y2Nlc3MoKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24sIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcblxuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb21wU3RhZ2VzID0gKGNvbXBJZCk6bmcuSVByb21pc2U8UmFua0l0LklTdGFnZVtdPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiYXBpL2NvbXBldGl0aW9ucy9cIitjb21wSWQrXCIvc3RhZ2VzXCIpLnN1Y2Nlc3MoKGRhdGE6YW55LCBzdGF0dXM6bnVtYmVyLCBoZWFkZXJzOm5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOm5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEuc3RhZ2VzKTtcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOmFueSwgc3RhdHVzOm51bWJlciwgaGVhZGVyczpuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzpuZy5JUmVxdWVzdENvbmZpZykgPT57XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRTdGFnZUV2ZW50cyA9IChzdGFnZUlkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUV2ZW50W10+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCJhcGkvY29tcGV0aXRpb25zLzAvc3RhZ2VzL1wiK3N0YWdlSWQrXCIvZXZlbnRzXCIpLnN1Y2Nlc3MoKGRhdGE6YW55LCBzdGF0dXM6bnVtYmVyLCBoZWFkZXJzOm5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOm5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEuZXZlbnRzKTtcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOmFueSwgc3RhdHVzOm51bWJlciwgaGVhZGVyczpuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzpuZy5JUmVxdWVzdENvbmZpZykgPT57XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5ndWxhciBhbmQgc2VydmljZSByZWdpc3RyYXRpb25cbiAgICAgKi9cbiAgICBhbmd1bGFyLm1vZHVsZShEYXRhU2VydmljZS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKERhdGFTZXJ2aWNlLnNlcnZpY2VJZCwgRGF0YVNlcnZpY2UpXG5cblxuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFHbG9iYWxzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFTZXJ2aWNlLnRzXCIvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuRGF0YSB7XG5cbiAgICAvLyBNYWtlcyBBcHAuQXV0aCBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShEYXRhLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRGF0YSkpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5TaGVsbCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuU2hlbGxcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiU2hlbGwvXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsR2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5TaGVsbCB7XG5cbiAgICBpbnRlcmZhY2UgSVNoZWxsQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIG5hdlNlcnZpY2U6IE5hdi5OYXZTZXJ2aWNlO1xuICAgICAgICBhdXRoU2VydmljZTogQXV0aC5BdXRoU2VydmljZTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgU2hlbGxDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVyTmFtZSA9IFwiU2hlbGxDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBTaGVsbC5tb2R1bGVJZCArIFwiLlwiICsgU2hlbGxDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBBdXRoLkF1dGhTZXJ2aWNlLnNlcnZpY2VJZF07XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSVNoZWxsQ29udHJvbGxlclNoZWxsLCBuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSwgYXV0aFNlcnZpY2U6IEF1dGguQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlPVwiSGVsbG8gV29ybGQhIVwiO1xuICAgICAgICAgICAgJHNjb3BlLm5hdlNlcnZpY2U9bmF2U2VydmljZTtcbiAgICAgICAgICAgICRzY29wZS5hdXRoU2VydmljZT1hdXRoU2VydmljZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKFNoZWxsQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoU2hlbGxDb250cm9sbGVyLmNvbnRyb2xsZXJOYW1lLCBTaGVsbENvbnRyb2xsZXIpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTaGVsbEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsQ29udHJvbGxlci50c1wiIC8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuU2hlbGwge1xuICAgIGFuZ3VsYXIubW9kdWxlKFNoZWxsLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoU2hlbGwpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5Ib21lIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5Ib21lXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkhvbWUvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJob21lXCJcbn0iLCIvKipcbiAqIEhvbWUgUGFnZVxuICogQW5kcmV3IFdlbHRvbiwgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuXG4gICAgaW50ZXJmYWNlIElIb21lQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBjb21wZXRpdGlvbnM6UmFua0l0LklDb21wZXRpdGlvbltdO1xuICAgICAgICBzdWJqZWN0czp7IFtzdWJqZWN0OiBzdHJpbmddOiB7bmFtZTogc3RyaW5nOyBjaGVja2VkOiBib29sZWFufTsgfTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSG9tZUNvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiSG9tZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEhvbWUubW9kdWxlSWQgKyBcIi5cIiArIEhvbWVDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yICgkc2NvcGU6IElIb21lQ29udHJvbGxlclNoZWxsLCBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb25zPVtdO1xuICAgICAgICAgICAgJHNjb3BlLnN1YmplY3RzPXt9O1xuICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0QWxsQ29tcHMoKS50aGVuKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uW10pID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb25zID0gZGF0YTtcbiAgICAgICAgICAgICAgICAvL0dldCBhIGxpc3Qgb2YgYWxsIHN1YmplY3RzIGZvciB0aGUgY2hlY2tib3hlcyBpbiB0aGUgc2lkZWJhclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLnN1YmplY3RzW2RhdGFbaV0uc3ViamVjdF09PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJqZWN0c1tkYXRhW2ldLnN1YmplY3RdID0ge25hbWU6IGRhdGFbaV0uc3ViamVjdCwgY2hlY2tlZDogdHJ1ZX07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAoZmFpbHVyZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoSG9tZUNvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKEhvbWVDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgSG9tZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoSG9tZS5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBIb21lLmJhc2VVcmwrJ2hvbWUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogSG9tZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvaG9tZVwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSlcbiAgICAgICAgLmNvbmZpZyhbXCIkdXJsUm91dGVyUHJvdmlkZXJcIiwgKCR1cmxSb3V0ZXJQcm92aWRlcjogbmcudWkuSVVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL2hvbWVcIilcbiAgICAgICAgfV0pXG4gICAgICAgIC5ydW4oW05hdi5OYXZTZXJ2aWNlLnNlcnZpY2VJZCwgZnVuY3Rpb24gKG5hdlNlcnZpY2U6IE5hdi5OYXZTZXJ2aWNlKSB7XG4gICAgICAgICAgICBuYXZTZXJ2aWNlLmFkZEl0ZW0oe3N0YXRlOkhvbWUuc3RhdGUsIG5hbWU6IFwiSG9tZVwiLCBvcmRlcjogMH0pO1xuXG4gICAgICAgIH1dKVxuICAgICAgICAvL0ZpbHRlciBvdXQgdGhlIHVuY2hlY2tlZCBib3hlcyBmb3Igc3ViamVjdHNcbiAgICAgICAgLmZpbHRlcignaG9tZUZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0OiBSYW5rSXQuSUNvbXBldGl0aW9uW10sb3B0aW9uczogeyBbc3ViamVjdDogc3RyaW5nXToge25hbWU6IHN0cmluZzsgY2hlY2tlZDogYm9vbGVhbn07IH0pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0cHV0OiBSYW5rSXQuSUNvbXBldGl0aW9uW10gPSBbXVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9uc1tpbnB1dFtpXS5zdWJqZWN0XS5jaGVja2VkPT10cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGlucHV0W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lR2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSG9tZUNvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5Ib21lIHtcbiAgICBhbmd1bGFyLm1vZHVsZShIb21lLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoSG9tZSkpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIFRpbW90aHkgRW5nZWxcbiAqL1xubW9kdWxlIEFwcC5Mb2dpbiB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuTG9naW5cIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiTG9naW4vXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luR2xvYmFscy50c1wiIC8+XG5cbi8qXG5cdENvbnRyb2xzIHRoZSBsb2dpbiBhbmQgcmVnaXN0ZXIgZnVuY3Rpb25hbGl0eVxuXHRAYXV0aG9yXHRUaW1vdGh5IEVuZ2VsXG4qL1xubW9kdWxlIEFwcC5Mb2dpbiB7XG5cbiAgICBpbnRlcmZhY2UgSUxvZ2luRXJyb3JSZXNwb25zZSB7XG5cbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgSUxvZ2luQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIGxvZ2luOiAoZGF0YTogYW55KSA9PiB2b2lkO1xuICAgICAgICByZWdpc3RlcjogKGRhdGE6IGFueSkgPT4gdm9pZDtcbiAgICAgICAgbG9naW5Nb2RlOiBib29sZWFuO1xuICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICBmaXJzdE5hbWU6IHN0cmluZ1xuICAgICAgICAgICAgbGFzdE5hbWU6IHN0cmluZ1xuICAgICAgICAgICAgZW1haWw6IHN0cmluZ1xuICAgICAgICAgICAgcGFzc3dvcmQ6IHN0cmluZ1xuICAgICAgICAgICAgcGFzc3dvcmQyOiBzdHJpbmdcbiAgICAgICAgfTtcblxuICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgZW5hYmxlZDogYm9vbGVhblxuICAgICAgICAgICAgdGl0bGU6IHN0cmluZ1xuICAgICAgICAgICAgc3RhdGU6IHN0cmluZ1xuICAgICAgICAgICAgaGFuZGxlcjogKHNlbGY6IGFueSkgPT4gdm9pZFxuICAgICAgICAgICAgaHRtbDogc3RyaW5nXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgTG9naW5Db250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkxvZ2luQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gTG9naW4ubW9kdWxlSWQgKyBcIi5cIiArIExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBBdXRoLkF1dGhTZXJ2aWNlLnNlcnZpY2VJZF07XG5cbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aC5BdXRoU2VydmljZTtcbiAgICAgICAgcHJpdmF0ZSAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2U7XG4gICAgICAgIHByaXZhdGUgaW5mbyA9IHtcbiAgICAgICAgICAgIGZpcnN0TmFtZTogXCJcIixcbiAgICAgICAgICAgIGxhc3ROYW1lOiBcIlwiLFxuICAgICAgICAgICAgZW1haWw6IFwiXCIsXG4gICAgICAgICAgICBwYXNzd29yZDogXCJcIixcbiAgICAgICAgICAgIHBhc3N3b3JkMjogXCJcIlxuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZXJyb3IgPSB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHRpdGxlOiBcIkVycm9yIVwiLFxuICAgICAgICAgICAgc3RhdGU6IFwiXCIsXG4gICAgICAgICAgICBoYW5kbGVyOiAoc2VsZikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYpXG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PSBcIkJBRF9MT0dJTlwiKXtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubG9naW5Nb2RlID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbmFibGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaHRtbDogXCJcIlxuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgbG9naW5Nb2RlID0gdHJ1ZTtcbiAgICAgICAgcHJpdmF0ZSBzY29wZTtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoJHNjb3BlOiBJTG9naW5Db250cm9sbGVyU2hlbGwsICRzdGF0ZTogbmcudWkuSVN0YXRlU2VydmljZSwgYXV0aFNlcnZpY2U6IEF1dGguQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgICAgICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICAgICAgJHNjb3BlLmxvZ2luTW9kZSA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICgkc3RhdGUuY3VycmVudC51cmwgPT0gJy9yZWdpc3RlcicpXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvZ2luTW9kZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnNjb3BlID0gJHNjb3BlXG5cbiAgICAgICAgICAgICRzY29wZS5sb2dpbiA9IHRoaXMubG9naW5cbiAgICAgICAgICAgICRzY29wZS5yZWdpc3RlciA9IHRoaXMucmVnaXN0ZXJcblxuICAgICAgICAgICAgJHNjb3BlLmluZm8gPSB0aGlzLmluZm9cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSB0aGlzLmVycm9yXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgbG9naW4gPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2NvcGUubG9naW5Nb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZS5sb2dpbk1vZGUgPSB0cnVlXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dpbih0aGlzLnNjb3BlLmluZm8uZW1haWwsdGhpcy5zY29wZS5pbmZvLnBhc3N3b3JkKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSA6IEF1dGguSUxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VjZXNzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKEhvbWUuc3RhdGUpO1xuICAgICAgICAgICAgICAgIH0sIChyZXNwb25zZSA6IEF1dGguSUxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci50aXRsZSA9ICdFcnJvciEnXG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5odG1sID0gJ0ludmFsaWQgdXNlcm5hbWUgb3IgcGFzc3dvcmQuIElmIHlvdSBkbyBub3QgaGF2ZSBhbiBhY2NvdW50LCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFrZSBzdXJlIHlvdSA8YSBjbGFzcz1cImFsZXJ0LWxpbmtcIiBuZy1jbGljaz1cIm1zZy5oYW5kbGVyKG1zZyk7XCI+cmVnaXN0ZXI8L2E+J1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLnN0YXRlID0gXCJCQURfTE9HSU5cIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByaXZhdGUgcmVnaXN0ZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY29wZS5sb2dpbk1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmxvZ2luTW9kZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5yZWdpc3Rlcih0aGlzLnNjb3BlLmluZm8uZW1haWwsIHRoaXMuc2NvcGUuaW5mby5wYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UgOiBBdXRoLklMb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Vzc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhIb21lLnN0YXRlKTtcbiAgICAgICAgICAgICAgICB9LCAocmVzcG9uc2UgOiBBdXRoLklMb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmh0bWwgPSByZXNwb25zZS5yZWFzb25cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICBhbmd1bGFyLm1vZHVsZShMb2dpbkNvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQsIExvZ2luQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShcImxvZ2luXCIsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogTG9naW4uYmFzZVVybCsnbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICAgICAgICAgIH0pLnN0YXRlKFwicmVnaXN0ZXJcIiwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBMb2dpbi5iYXNlVXJsKydsb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBMb2dpbkNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbkdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luQ29udHJvbGxlci50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBUaW1vdGh5IEVuZ2VsXG4gKi9cbm1vZHVsZSBBcHAuSG9tZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoTG9naW4ubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhMb2dpbikpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvbiwgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuQ29tcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJDb21wL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiQ29tcFwiXG59IiwiLyoqXG4gKiBWaWV3IENvbXBldGl0aW9uIFBhZ2VcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcCB7XG5cbiAgICBpbnRlcmZhY2UgSUNvbXBDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGNvbXBldGl0aW9uOlJhbmtJdC5JQ29tcGV0aXRpb247XG4gICAgICAgIGVkaXQ6IChjb21wSWQpID0+IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbXBDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkNvbXBDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuXCIgKyBDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsXCIkc3RhdGVcIixcIiRzdGF0ZVBhcmFtc1wiLERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgJHNjb3BlOiBJQ29tcENvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlICwkc3RhdGVQYXJhbXM6bmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSwgcHJpdmF0ZSBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdD10aGlzLmVkaXQ7XG4gICAgICAgICAgICAvL0lmIHdlIGhhdmUgYSBjb21wZXRpdGlvbiBzdHJ1Y3R1cmUsIHVzZSBpdC4gT3RoZXJ3aXNlIGdldCBpdCBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgaWYoJHN0YXRlUGFyYW1zWydjb21wJ10pe1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbj0kc3RhdGVQYXJhbXNbJ2NvbXAnXTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRhdGFTZXJ2aWNlLmdldENvbXAoJHN0YXRlUGFyYW1zWydjb21wSWQnXSkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBldGl0aW9uID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9LCAoZmFpbHVyZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBlZGl0ID0gKGNvbXBJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oQ29tcC5FZGl0LnN0YXRlLHtjb21wSWQ6IGNvbXBJZH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKENvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgQ29tcENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoQ29tcC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDb21wLmJhc2VVcmwrJ2NvbXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogQ29tcENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvY29tcC97Y29tcElkfVwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Db21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuQ3JlYXRlIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuQ3JlYXRlQ29tcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IENvbXAuYmFzZVVybCArIFwiQ3JlYXRlL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiY3JlYXRlQ29tcFwiXG59IiwiLyoqXG4gKiBDcmVhdGUgQ29tcGV0aXRpb24gQ29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvbiwgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVDb21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuQ3JlYXRlIHtcblxuICAgIGludGVyZmFjZSBJQ3JlYXRlQ29tcENvbnRyb2xsZXJTY29wZSBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgY29tcDogUmFua0l0LklDb21wZXRpdGlvbjtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDcmVhdGVDb21wQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJDcmVhdGVDb21wQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gQ3JlYXRlLm1vZHVsZUlkICsgXCIuXCIgKyBDcmVhdGVDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsXCIkc3RhdGVcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUNyZWF0ZUNvbXBDb250cm9sbGVyU2NvcGUscHJpdmF0ZSAkc3RhdGU6bmcudWkuSVN0YXRlU2VydmljZSwgcHJpdmF0ZSBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gdGhpcy5zdWJtaXQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3VibWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgLy9DcmVhdGUgdGhlIGNvbXBldGl0aW9uXG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNyZWF0ZUNvbXBldGl0aW9uKHRoaXMuJHNjb3BlLmNvbXApLnRoZW4oKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhDb21wLnN0YXRlLHtjb21wSWQ6IGRhdGEuY29tcGV0aXRpb25JZCxjb21wOmRhdGF9KTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKENyZWF0ZUNvbXBDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihDcmVhdGVDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQsIENyZWF0ZUNvbXBDb250cm9sbGVyKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsICgkcm91dGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLnN0YXRlKENyZWF0ZS5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDcmVhdGUuYmFzZVVybCsnY3JlYXRlQ29tcC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBDcmVhdGVDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jb21wL2NyZWF0ZVwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSlcbiAgICAgICAgLnJ1bihbTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBmdW5jdGlvbiAobmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UpIHtcbiAgICAgICAgICAgIG5hdlNlcnZpY2UuYWRkSXRlbSh7c3RhdGU6Q3JlYXRlLnN0YXRlLCBuYW1lOiBcIkNyZWF0ZSBDb21wZXRpdGlvblwiLCBvcmRlcjogMH0pO1xuXG4gICAgICAgIH1dKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZUNvbXBHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVDb21wQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuQ3JlYXRlIHtcbiAgICBhbmd1bGFyLm1vZHVsZShDcmVhdGUubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhDcmVhdGUpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5FZGl0IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuRWRpdENvbXBcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBDb21wLmJhc2VVcmwgKyBcIkVkaXQvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJlZGl0Q29tcFwiXG59IiwiLyoqXG4gKiBFZGl0IENvbXBldGl0aW9uIFBhZ2VcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRDb21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuRWRpdCB7XG5cbiAgICBpbnRlcmZhY2UgSUVkaXRDb21wQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBjb21wOiBhbnk7XG4gICAgICAgIHN0YWdlczogUmFua0l0LklTdGFnZVtdO1xuICAgICAgICBzdWJtaXQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGFkZFN0YWdlOiAoY29tcCkgPT4gdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRWRpdENvbXBDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkVkaXRDb21wQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gRWRpdC5tb2R1bGVJZCArIFwiLlwiICsgRWRpdENvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElFZGl0Q29tcENvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlLCAkc3RhdGVQYXJhbXM6bmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSwgcHJpdmF0ZSBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gdGhpcy5zdWJtaXQ7XG4gICAgICAgICAgICAkc2NvcGUuYWRkU3RhZ2UgPSB0aGlzLmFkZFN0YWdlO1xuICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0Q29tcCgkc3RhdGVQYXJhbXNbJ2NvbXBJZCddKS50aGVuKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXAgPSBkYXRhO1xuICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vR2V0IHRoZSBzdGFnZXMgaW4gdGhlIGNvbXBldGl0aW9uIHRvIHNob3cgb24gdGhlIHBhZ2UuXG4gICAgICAgICAgICBkYXRhU2VydmljZS5nZXRDb21wU3RhZ2VzKCRzdGF0ZVBhcmFtc1snY29tcElkJ10pLnRoZW4oKGRhdGE6IFJhbmtJdC5JU3RhZ2VbXSk9PntcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhZ2VzPWRhdGE7XG4gICAgICAgICAgICB9LChmYWlsdXJlOmFueSk9PntcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3VibWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5lZGl0Q29tcGV0aXRpb24odGhpcy4kc2NvcGUuY29tcCkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKENvbXAuc3RhdGUse2NvbXBJZDogZGF0YS5jb21wZXRpdGlvbklkLGNvbXA6ZGF0YX0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGFkZFN0YWdlID0gKGNvbXApID0+IHtcbiAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKFN0YWdlLkNyZWF0ZS5zdGF0ZSx7Y29tcDpjb21wfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShFZGl0Q29tcENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKEVkaXRDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQsIEVkaXRDb21wQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShFZGl0LnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEVkaXQuYmFzZVVybCsnZWRpdENvbXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogRWRpdENvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NvbXAvZWRpdC97Y29tcElkfVwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0Q29tcEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRDb21wQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuRWRpdCB7XG4gICAgYW5ndWxhci5tb2R1bGUoRWRpdC5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKEVkaXQpKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQ29tcEdsb2JhbHMudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBVc2VkIGZvciBkaXNwbGF5aW5nIGEgY29tcGV0aXRpb24ncyBzdHJ1Y3R1cmVcbiAqL1xubW9kdWxlIEFwcC5Db21wLkNvbXBTdHJ1Y3Qge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IENvbXAubW9kdWxlSWQgKyBcIi5TdHJ1Y3RWaWV3XCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQ29tcC5iYXNlVXJsICsgXCJTdHJ1Y3RWaWV3L1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wU3RydWN0R2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqIEEgZGlyZWN0aXZlIHRvIGRpc3BsYXkgdGhlIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiBhIGNvbXBldGl0aW9uJ3Mgc3RydWN0dXJlXG4gKi9cbm1vZHVsZSBBcHAuQ29tcC5Db21wU3RydWN0IHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzaGFwZSBvZiB0aGUgc2NvcGVcbiAgICAgKi9cbiAgICBpbnRlcmZhY2UgSUNvbXBTdHJ1Y3RTY29wZSBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjb21wZXRpdGlvbiB0byBkaXNwbGF5XG4gICAgICAgICAqL1xuICAgICAgICBjb21wOiBSYW5rSXQuSUNvbXBldGl0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogVHJ1ZSBpZiBkZXRhaWxzIHNob3VsZCBiZSBkaXNwbGF5ZWRcbiAgICAgICAgICovXG4gICAgICAgIGRldGFpbDogYm9vbGVhbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJ1ZSBpcyB2aXNpYmxlXG4gICAgICAgICAqL1xuICAgICAgICBzaG93OiBib29sZWFuO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGlkIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBpZDogbnVtYmVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc3R5bGVzIGZvciBldmVudHMgZ2l2ZW4gdGhlaXIgcGFyZW50IHN0YWdlXG4gICAgICAgICAqL1xuICAgICAgICBldmVudFN0eWxlOiB7W3N0YWdlSWQ6c3RyaW5nXTogYW55fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzdHlsZSBmb3IgYWxsIHRoZSBzdGFnZXNcbiAgICAgICAgICovXG4gICAgICAgIHN0YWdlU3R5bGU6IGFueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJmYWNlIGZvciB0d28gb2JqZWN0cyB0byBoYXZlIGEgbGluZSBkcmF3biBiZXR3ZWVuIHRoZW1cbiAgICAgKi9cbiAgICBpbnRlcmZhY2UgSUNvbm5lY3RvcntcbiAgICAgICAgdG86IEpRdWVyeTtcbiAgICAgICAgZnJvbTogSlF1ZXJ5O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDb21wU3RydWN0RGlyZWN0aXZlIGltcGxlbWVudHMgbmcuSURpcmVjdGl2ZSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGlyZWN0aXZlSWQgPSBcImNvbXBTdHJ1Y3RcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IENvbXBTdHJ1Y3QubW9kdWxlSWQgKyBcIi5cIiArIENvbXBTdHJ1Y3REaXJlY3RpdmUuZGlyZWN0aXZlSWQ7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiR0aW1lb3V0XCJdO1xuXG4gICAgICAgIHB1YmxpYyAkc2NvcGUgPSB7XG4gICAgICAgICAgICBjb21wOiBcIj1cIlxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJlc3RyaWN0ID0gXCJFXCI7XG5cbiAgICAgICAgcHVibGljIHRlbXBsYXRlVXJsID0gQ29tcFN0cnVjdC5iYXNlVXJsK0NvbXBTdHJ1Y3REaXJlY3RpdmUuZGlyZWN0aXZlSWQrXCIuaHRtbFwiO1xuXG5cbiAgICAgICAgY29uc3RydWN0b3IgKHB1YmxpYyAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgUG9zdCBMaW5rIGZ1bmN0aW9uIHNlZSBodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcvc2VydmljZS8kY29tcGlsZVxuICAgICAgICAgKiBAcGFyYW0gc2NvcGVcbiAgICAgICAgICogQHBhcmFtIGVsZW1cbiAgICAgICAgICogQHBhcmFtIGF0dHJzXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgcG9zdExpbmsgPSAoc2NvcGU6IElDb21wU3RydWN0U2NvcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtOiBuZy5JQXVnbWVudGVkSlF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IG5nLklBdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNjbHVkZTogbmcuSVRyYW5zY2x1ZGVGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgc2NvcGUuc2hvdz10cnVlO1xuXG4gICAgICAgICAgICAvLyBCQUlMIE9VVCBDT05ESVRJT05cbiAgICAgICAgICAgIC8vIE5vIGNvbXBcbiAgICAgICAgICAgIC8vIE5vIHN0YWdlc1xuICAgICAgICAgICAgaWYgKCFzY29wZS5jb21wIHx8ICFzY29wZS5jb21wLnN0YWdlcyl7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2hvdz1mYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmluZHMgdGhlIGFwcHJvcHJpYXRlIHdpdGggZm9yIGV2ZW50cyBpbiBlYWNoIHN0YWdlICh3aWR0aCAvIG51bWJlciBvZiBldmVudHMgaW4gc3RhZ2UpXG4gICAgICAgICAgICBzY29wZS5ldmVudFN0eWxlPXt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY29wZS5jb21wLnN0YWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIEJBSUwgT1VUIENPTkRJVElPTlxuICAgICAgICAgICAgICAgIC8vIE5vIGV2ZW50cyBpbiBzdGFnZVxuICAgICAgICAgICAgICAgIGlmICghc2NvcGUuY29tcC5zdGFnZXNbaV0uZXZlbnRzKXtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvdz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5ldmVudFN0eWxlW3Njb3BlLmNvbXAuc3RhZ2VzW2ldLnN0YWdlSWQudG9TdHJpbmcoKV09e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogKDEwMCAvIHNjb3BlLmNvbXAuc3RhZ2VzW2ldLmV2ZW50cy5sZW5ndGggKyBcIiVcIilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZXMgYW4gaWQgc28gdGhlIGVsZW1lbnQgY2FuIGJlIGZvdW5kIHVzaW5nIEpRdWVyeVxuICAgICAgICAgICAgdmFyIGlkID0gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMDAwKTtcbiAgICAgICAgICAgIHNjb3BlLmlkID0gaWQ7XG5cbiAgICAgICAgICAgIC8vIFdhdGNoZXMgZm9yIGNoYW5nZXMgaW4gdGhlIGRldGFpbCBmdW5jdGlvbiBhbmQgcHJvcGFnYXRlcyBjaGFuZ2VzIHRvIHNjb3BlXG4gICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZGV0YWlsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuZGV0YWlsID0gc2NvcGUuJGV2YWwoKDxhbnk+YXR0cnMpLmRldGFpbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gR2l2ZXMgQW5ndWxhciB0aW1lIHRvIGNvbXBsZXRlIGRpcmVjdGl2ZSByZW5kZXJpbmdcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoICgpID0+e1xuICAgICAgICAgICAgICAgIHZhciAkY2FudmFzPSAkKFwiY2FudmFzI1wiK2lkKTtcbiAgICAgICAgICAgICAgICAkY2FudmFzLmF0dHIoJ3dpZHRoJywgJGNhbnZhcy5wYXJlbnQoKS53aWR0aCgpKTtcbiAgICAgICAgICAgICAgICAkY2FudmFzLmF0dHIoJ2hlaWdodCcsICRjYW52YXMucGFyZW50KCkuaGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgIHZhciBzdGFnZUhlaWdodD0xMDAvc2NvcGUuY29tcC5zdGFnZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHNjb3BlLnN0YWdlU3R5bGUgPSB7aGVpZ2h0OiBzdGFnZUhlaWdodCtcIiVcIn07XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBsaWVzIHNjb3BlIGNoYW5nZXNcbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLiQkcGhhc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kcyBhbGwgdGhlIGNvbm5lY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25uZWN0b3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgc2NvcGUuY29tcC5zdGFnZXMubGVuZ3RoIDsgaSArKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kQ29ubmVjdGlvbnMoc2NvcGUuY29tcC5zdGFnZXNbaS0xXSwgc2NvcGUuY29tcC5zdGFnZXNbaV0sIGNvbm5lY3RvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmUtRHJhd3Mgd2hlbiB0aGUgY2FudmFzIGNoYW5nZXMgdmlzaWJpbGl0eSB0byB2aXNpYmxlXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGNhbnZhcy5jc3MoXCJ2aXNpYmlsaXR5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9LCAobmV3VmFsKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlLURyYXdzIGlmIHRoZSBjYW52YXMgaXMgdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gXCJ2aXNpYmxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3KCRjYW52YXMsIGNvbm5lY3RvcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5kcyB0aGUgY29ubmVjdGlvbnMgZ2l2ZW4gMiBzdGFnZXMgYW5kIGFkZHMgdGhlbSB0byB0aGUgY29ubmVjdG9ycyBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHByZXZTdGFnZVxuICAgICAgICAgKiBAcGFyYW0gbmV4dFN0YWdlXG4gICAgICAgICAqIEBwYXJhbSBjb25uZWN0b3JzXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kQ29ubmVjdGlvbnMgPSAocHJldlN0YWdlIDpSYW5rSXQuSVN0YWdlLCBuZXh0U3RhZ2UgOlJhbmtJdC5JU3RhZ2UsIGNvbm5lY3RvcnM6IElDb25uZWN0b3JbXSkgPT4ge1xuICAgICAgICAgICAgY29ubmVjdG9ycyA9IGNvbm5lY3RvcnMgfHwgW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5leHRTdGFnZS5ldmVudHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIC8vIEZpbmRzIGFsbCBjb25uZWN0aW9ucyBnaXZlbiBhIHN0YWdlXG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV4dFN0YWdlLmV2ZW50c1tpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGV2ZW50LnNlZWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlZWQgPSBldmVudC5zZWVkW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmRzIGV2ZW50IGluIHByZXZpb3VzIHN0YWdlIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgc2VlZFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHByZXZTdGFnZS5ldmVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcm9tRXZlbnQgPSBwcmV2U3RhZ2UuZXZlbnRzW2tdXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZXZlbnQuc2VlZC5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVNlZWQgPSBldmVudC5zZWVkW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VlZCA9PSBmcm9tU2VlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJChcIiNcIiArIGZyb21FdmVudC5ldmVudElkICsgXCI+LmV2ZW50XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG86ICQoXCIjXCIgKyBldmVudC5ldmVudElkICsgXCI+LmV2ZW50XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYXdzIHRoZSBjb25uZWN0aW9ucyBvbiB0aGUgZ2l2ZW4gY2FudmFzXG4gICAgICAgICAqIEBwYXJhbSAkY2FudmFzXG4gICAgICAgICAqIEBwYXJhbSBjb25uZWN0b3JzXG4gICAgICAgICAqL1xuICAgICAgICBkcmF3ID0gKCRjYW52YXM6IEpRdWVyeSwgY29ubmVjdG9yczogSUNvbm5lY3RvcltdKSA9PiB7XG4gICAgICAgICAgICAvLyBHZXRzIHRoZSBjb250ZXh0IHRvIGRyYXcgb25cbiAgICAgICAgICAgIHZhciBvcmlnaW49JGNhbnZhcy5vZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9ICg8SFRNTENhbnZhc0VsZW1lbnQ+JGNhbnZhc1swXSkuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XG5cbiAgICAgICAgICAgIC8vIENsZWFycyB0aGUgY2FudmFzXG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsICRjYW52YXMud2lkdGgoKSwgJGNhbnZhcy5oZWlnaHQoKSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbm5lY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNvbm5lY3RvcnNbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBUbyBhbmQgZnJvbSBlbGVtZW50c1xuICAgICAgICAgICAgICAgIHZhciBlRnJvbSA9IGMuZnJvbTtcbiAgICAgICAgICAgICAgICB2YXIgZVRvID0gYy50bztcblxuICAgICAgICAgICAgICAgIHZhciBmcm9tUG9zID0gZUZyb20ub2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRvUG9zID0gZVRvLm9mZnNldCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRYID0gZnJvbVBvcy5sZWZ0ICsgZUZyb20ud2lkdGgoKSAvIDIgLSBvcmlnaW4ubGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRZID0gZnJvbVBvcy50b3AgLSBvcmlnaW4udG9wICsgMTtcblxuICAgICAgICAgICAgICAgIC8vIEVuZCBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHZhciBmaW5YID0gdG9Qb3MubGVmdCArIGVUby53aWR0aCgpIC8gMi0gb3JpZ2luLmxlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIGZpblkgPSB0b1Bvcy50b3AgLSBvcmlnaW4udG9wICsgZVRvLmhlaWdodCgpIC0gMTtcblxuICAgICAgICAgICAgICAgIC8vIERyYXdzIHRoZSBsaW5lc1xuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHN0YXJ0WCwgKHN0YXJ0WSkgKyAoZmluWSAtIHN0YXJ0WSkgLyAyKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKGZpblgsIChzdGFydFkpICsgKGZpblkgLSBzdGFydFkpIC8gMik7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhmaW5YLCBmaW5ZKTtcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY29tcGlsZSBmdW5jdGlvbiBzZWUgaHR0cHM6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL25nL3NlcnZpY2UvJGNvbXBpbGVcbiAgICAgICAgICogQHJldHVybnMge3twb3N0OiBJRGlyZWN0aXZlTGlua0ZufX1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBjb21waWxlOiBuZy5JRGlyZWN0aXZlQ29tcGlsZUZuICA9XG4gICAgKFxuICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQ6IG5nLklBdWdtZW50ZWRKUXVlcnksXG4gICAgICAgIHRlbXBsYXRlQXR0cmlidXRlczogbmcuSUF0dHJpYnV0ZXMsXG4gICAgICAgIHRyYW5zY2x1ZGU6IG5nLklUcmFuc2NsdWRlRnVuY3Rpb25cbiAgICApOiBuZy5JRGlyZWN0aXZlUHJlUG9zdCA9PntcbiAgICAgICAgICAgIHJldHVybiAoPG5nLklEaXJlY3RpdmVQcmVQb3N0PntcbiAgICAgICAgICAgICAgICBwb3N0OiAgdGhpcy5wb3N0TGlua1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZmFjdG9yeSByZXR1cm5pbmcgdGhlIGRpcmVjdGl2ZVxuICAgICAgICAgKiBAcGFyYW0gJHRpbWVvdXRcbiAgICAgICAgICogQHJldHVybnMge25nLklEaXJlY3RpdmV9XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgc3RhdGljIGZhY3Rvcnk6bmcuSURpcmVjdGl2ZUZhY3RvcnkgID0gKCR0aW1lb3V0Om5nLklUaW1lb3V0U2VydmljZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBuZXcgQ29tcFN0cnVjdERpcmVjdGl2ZSgkdGltZW91dCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbXBpbGU6IGNvbXAuY29tcGlsZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogY29tcC50ZW1wbGF0ZVVybCxcbiAgICAgICAgICAgICAgICAkc2NvcGU6IGNvbXAuJHNjb3BlLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiBjb21wLnJlc3RyaWN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKENvbXBTdHJ1Y3REaXJlY3RpdmUubW9kdWxlSWQsIFtdKS5cbiAgICAgICAgZGlyZWN0aXZlKENvbXBTdHJ1Y3REaXJlY3RpdmUuZGlyZWN0aXZlSWQsIFtcIiR0aW1lb3V0XCIsIENvbXBTdHJ1Y3REaXJlY3RpdmUuZmFjdG9yeV0pO1xuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBTdHJ1Y3RHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wU3RydWN0RGlyZWN0aXZlLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICogVXNlZCBmb3IgZGlzcGxheWluZyBhIGNvbXBldGl0aW9uJ3Mgc3RydWN0dXJlXG4gKi9cbm1vZHVsZSBBcHAuQ29tcC5Db21wU3RydWN0IHtcbiAgICB2YXIgZGVwID0gQXBwLmdldENoaWxkTW9kdWxlSWRzKENvbXBTdHJ1Y3QpO1xuICAgIGFuZ3VsYXIubW9kdWxlKENvbXBTdHJ1Y3QubW9kdWxlSWQsIGRlcCk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uLCBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wQ29udHJvbGxlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlL0NyZWF0ZUNvbXBNb2R1bGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXQvRWRpdENvbXBNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU3RydWN0Vmlldy9Db21wU3RydWN0TW9kdWxlLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcCB7XG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcC5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKENvbXApKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuU3RhZ2VcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiU3RhZ2UvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJTdGFnZVwiXG59IiwiLyoqXG4gKiBWaWV3IFN0YWdlIENvbnRyb2xsZXJcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlN0YWdlR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlIHtcblxuICAgIGludGVyZmFjZSBJU3RhZ2VDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIHN0YWdlOlJhbmtJdC5JU3RhZ2U7XG4gICAgICAgIGVkaXQ6IChjb21wSWQpID0+IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN0YWdlQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJTdGFnZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IENvbXAubW9kdWxlSWQgKyBcIi5cIiArIFN0YWdlQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsXCIkc3RhdGVcIixcIiRzdGF0ZVBhcmFtc1wiLERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgJHNjb3BlOiBJU3RhZ2VDb250cm9sbGVyU2hlbGwscHJpdmF0ZSAkc3RhdGU6bmcudWkuSVN0YXRlU2VydmljZSAsJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLmVkaXQ9dGhpcy5lZGl0O1xuICAgICAgICAgICAgaWYoJHN0YXRlUGFyYW1zWydzdGFnZSddKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhZ2U9JHN0YXRlUGFyYW1zWydzdGFnZSddO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0U3RhZ2UoJHN0YXRlUGFyYW1zWydzdGFnZUlkJ10pLnRoZW4oKGRhdGE6IFJhbmtJdC5JU3RhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGFnZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZWRpdCA9IChjb21wSWQpID0+IHtcbiAgICAgICAgICAgIC8vdGhpcy4kc3RhdGUuZ28oQ29tcC5FZGl0LnN0YXRlLHtjb21wSWQ6IGNvbXBJZH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoU3RhZ2VDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLCBTdGFnZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoU3RhZ2Uuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogU3RhZ2UuYmFzZVVybCsnc3RhZ2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogU3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YWdlL3tzdGFnZUlkfVwiLFxuICAgICAgICAgICAgICAgIHBhcmFtczp7J3N0YWdlJzp1bmRlZmluZWR9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG4gICAgICAgIC8qLnJ1bihbTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBmdW5jdGlvbiAobmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UpIHtcbiAgICAgICAgICAgIG5hdlNlcnZpY2UuYWRkSXRlbSh7c3RhdGU6Q3JlYXRlQ29tcC5zdGF0ZSwgbmFtZTogXCJDcmVhdGUgQ29tcGV0aXRpb25cIiwgb3JkZXI6IDB9KTtcblxuICAgICAgICB9XSk7Ki9cbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1N0YWdlR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkNyZWF0ZSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gU3RhZ2UubW9kdWxlSWQgKyBcIi5DcmVhdGVTdGFnZVwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IFN0YWdlLmJhc2VVcmwgKyBcIkNyZWF0ZS9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImNyZWF0ZVN0YWdlXCJcbn0iLCIvKipcbiAqIENyZWF0ZSBTdGFnZSBjb250cm9sbGVyXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVTdGFnZUdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5DcmVhdGUge1xuXG4gICAgaW50ZXJmYWNlIElDcmVhdGVTdGFnZUNvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgY29tcDogYW55O1xuICAgICAgICBzdGFnZTphbnk7XG4gICAgICAgIHN1Ym1pdDogKCkgPT4gdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlU3RhZ2VDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkNyZWF0ZVN0YWdlQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gQ3JlYXRlLm1vZHVsZUlkICsgXCIuXCIgKyBDcmVhdGVTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUNyZWF0ZVN0YWdlQ29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UsJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLmNvbXAgPSAkc3RhdGVQYXJhbXNbJ2NvbXAnXTtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXQgPSB0aGlzLnN1Ym1pdDtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN1Ym1pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY3JlYXRlU3RhZ2UodGhpcy4kc2NvcGUuY29tcC5jb21wZXRpdGlvbklkLHRoaXMuJHNjb3BlLnN0YWdlKS50aGVuKChkYXRhOiBSYW5rSXQuSVN0YWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oU3RhZ2Uuc3RhdGUseydzdGFnZUlkJzpkYXRhLnN0YWdlSWQsJ3N0YWdlJzpkYXRhfSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShDcmVhdGVTdGFnZUNvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKENyZWF0ZVN0YWdlQ29udHJvbGxlci5jb250cm9sbGVySWQsIENyZWF0ZVN0YWdlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShDcmVhdGUuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ3JlYXRlLmJhc2VVcmwrJ2NyZWF0ZVN0YWdlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IENyZWF0ZVN0YWdlQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zdGFnZS9jcmVhdGVcIixcbiAgICAgICAgICAgICAgICBwYXJhbXM6eydjb21wJzp1bmRlZmluZWR9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVTdGFnZUdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZVN0YWdlQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkNyZWF0ZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoQ3JlYXRlLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQ3JlYXRlKSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TdGFnZUdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5FZGl0IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBTdGFnZS5tb2R1bGVJZCArIFwiLkVkaXRTdGFnZVwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IFN0YWdlLmJhc2VVcmwgKyBcIkVkaXQvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJlZGl0U3RhZ2VcIlxufSIsIi8qKlxuICogRWRpdCBTdGFnZSBDb250cm9sbGVyXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0U3RhZ2VHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuU3RhZ2UuRWRpdCB7XG5cbiAgICBpbnRlcmZhY2UgSUVkaXRTdGFnZUNvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgc3RhZ2U6IGFueTtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgICAgICBldmVudHM6IFJhbmtJdC5JRXZlbnRbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRWRpdFN0YWdlQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJFZGl0U3RhZ2VDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBFZGl0Lm1vZHVsZUlkICsgXCIuXCIgKyBFZGl0U3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElFZGl0U3RhZ2VDb250cm9sbGVyU2hlbGwscHJpdmF0ZSAkc3RhdGU6bmcudWkuSVN0YXRlU2VydmljZSwgJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IHRoaXMuc3VibWl0O1xuICAgICAgICAgICAgJHNjb3BlLnN0YWdlPSRzdGF0ZVBhcmFtc1snc3RhZ2UnXTtcblxuICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0U3RhZ2VFdmVudHModGhpcy4kc2NvcGUuc3RhZ2Uuc3RhZ2VJZCkudGhlbigoZGF0YTpSYW5rSXQuSUV2ZW50W10pPT57XG4gICAgICAgICAgICAgICAgdGhpcy4kc2NvcGUuZXZlbnRzPWRhdGE7XG4gICAgICAgICAgICB9LCgpPT57XG4gICAgICAgICAgICAgICAgLy9mYWlsdXJlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKnRoaXMuZGF0YVNlcnZpY2UuZWRpdFN0YWdlKHRoaXMuJHNjb3BlLmNvbXApLnRoZW4oKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhDb21wLnN0YXRlLHtjb21wSWQ6IGRhdGEuY29tcGV0aXRpb25JZCxjb21wOmRhdGF9KTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgICAgICB9KTsqL1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoRWRpdFN0YWdlQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoRWRpdFN0YWdlQ29udHJvbGxlci5jb250cm9sbGVySWQsIEVkaXRTdGFnZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoRWRpdC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBFZGl0LmJhc2VVcmwrJ2VkaXRTdGFnZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBFZGl0U3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N0YWdlL2VkaXQve3N0YWdlSWR9XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOnsnc3RhZ2UnOnVuZGVmaW5lZH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRTdGFnZUdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRTdGFnZUNvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5FZGl0IHtcbiAgICBhbmd1bGFyLm1vZHVsZShFZGl0Lm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRWRpdCkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU3RhZ2VHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdGFnZUNvbnRyb2xsZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZS9DcmVhdGVTdGFnZU1vZHVsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdC9FZGl0U3RhZ2VNb2R1bGUudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoU3RhZ2UubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhTdGFnZSkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5FdmVudFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJFdmVudC9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcIkV2ZW50XCJcbn0iLCIvKipcbiAqIFZpZXcgRXZlbnQgQ29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnRHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQge1xuXG4gICAgaW50ZXJmYWNlIElFdmVudENvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgY29tcGV0aXRpb246UmFua0l0LklDb21wZXRpdGlvbjtcbiAgICAgICAgZWRpdDogKGNvbXBJZCkgPT4gdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRXZlbnRDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkV2ZW50Q29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gQ29tcC5tb2R1bGVJZCArIFwiLlwiICsgRXZlbnRDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElFdmVudENvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlICwkc3RhdGVQYXJhbXM6bmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSwgcHJpdmF0ZSBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdD10aGlzLmVkaXQ7XG4gICAgICAgICAgICBpZigkc3RhdGVQYXJhbXNbJ2NvbXAnXSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBldGl0aW9uPSRzdGF0ZVBhcmFtc1snY29tcCddO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0Q29tcCgkc3RhdGVQYXJhbXNbJ2NvbXBJZCddKS50aGVuKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb24gPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0sIChmYWlsdXJlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGVkaXQgPSAoY29tcElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhDb21wLkVkaXQuc3RhdGUse2NvbXBJZDogY29tcElkfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShFdmVudENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKEV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQsIEV2ZW50Q29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShFdmVudC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBFdmVudC5iYXNlVXJsKydldmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnQve2V2ZW50SWR9XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOnsnZXZlbnQnOnVuZGVmaW5lZH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKTtcbiAgICAgICAgLyoucnVuKFtOYXYuTmF2U2VydmljZS5zZXJ2aWNlSWQsIGZ1bmN0aW9uIChuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSkge1xuICAgICAgICAgICAgbmF2U2VydmljZS5hZGRJdGVtKHtzdGF0ZTpDcmVhdGVDb21wLnN0YXRlLCBuYW1lOiBcIkNyZWF0ZSBDb21wZXRpdGlvblwiLCBvcmRlcjogMH0pO1xuXG4gICAgICAgIH1dKTsqL1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vRXZlbnRHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQuQ3JlYXRlIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBFdmVudC5tb2R1bGVJZCArIFwiLkNyZWF0ZUV2ZW50XCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gRXZlbnQuYmFzZVVybCArIFwiQ3JlYXRlL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiY3JlYXRlRXZlbnRcIlxufSIsIi8qKlxuICogQ3JlYXRlIEV2ZW50IENvbnRyb2xsZXJcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZUV2ZW50R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50LkNyZWF0ZSB7XG5cbiAgICBpbnRlcmZhY2UgSUNyZWF0ZUV2ZW50Q29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBzdGFnZTogYW55O1xuICAgICAgICBldmVudDogYW55O1xuICAgICAgICBzdWJtaXQ6ICgpID0+IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENyZWF0ZUV2ZW50Q29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJDcmVhdGVFdmVudENvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEV2ZW50Lm1vZHVsZUlkICsgXCIuXCIgKyBDcmVhdGVFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUNyZWF0ZUV2ZW50Q29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UsJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy4kc2NvcGUuc3RhZ2U9JHN0YXRlUGFyYW1zWydzdGFnZSddO1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IHRoaXMuc3VibWl0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN1Ym1pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY3JlYXRlRXZlbnQodGhpcy4kc2NvcGUuc3RhZ2Uuc3RhZ2VJZCx0aGlzLiRzY29wZS5ldmVudCkudGhlbigoZGF0YTogUmFua0l0LklFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKEV2ZW50LnN0YXRlLHtldmVudElkOiBkYXRhLmV2ZW50SWQsY29tcDpkYXRhfSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShDcmVhdGVFdmVudENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKENyZWF0ZUV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQsIENyZWF0ZUV2ZW50Q29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShDcmVhdGUuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQ3JlYXRlLmJhc2VVcmwrJ2NyZWF0ZUV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IENyZWF0ZUV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9ldmVudC9jcmVhdGVcIixcbiAgICAgICAgICAgICAgICBwYXJhbXM6eydzdGFnZSc6dW5kZWZpbmVkfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlRXZlbnRHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVFdmVudENvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5FdmVudC5DcmVhdGUge1xuICAgIGFuZ3VsYXIubW9kdWxlKENyZWF0ZS5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKENyZWF0ZSkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vRXZlbnRHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQuRWRpdCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gRXZlbnQubW9kdWxlSWQgKyBcIi5FZGl0RXZlbnRcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBFdmVudC5iYXNlVXJsICsgXCJFZGl0L1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiZWRpdEV2ZW50XCJcbn0iLCIvKipcbiAqIEVkaXQgRXZlbnQgQ29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdEV2ZW50R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50LkVkaXQge1xuXG4gICAgaW50ZXJmYWNlIElFZGl0RXZlbnRDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGNvbXA6IGFueTtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFZGl0RXZlbnRDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkVkaXRFdmVudENvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEVkaXQubW9kdWxlSWQgKyBcIi5cIiArIEVkaXRFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUVkaXRFdmVudENvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlLCAkc3RhdGVQYXJhbXM6bmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSwgcHJpdmF0ZSBkYXRhU2VydmljZTpEYXRhLkRhdGFTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gdGhpcy5zdWJtaXQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKTtcbiAgICAgICAgICAgIGRhdGFTZXJ2aWNlLmdldENvbXAoJHN0YXRlUGFyYW1zWydjb21wSWQnXSkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21wID0gZGF0YTtcbiAgICAgICAgICAgIH0sIChmYWlsdXJlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3VibWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5lZGl0Q29tcGV0aXRpb24odGhpcy4kc2NvcGUuY29tcCkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKENvbXAuc3RhdGUse2NvbXBJZDogZGF0YS5jb21wZXRpdGlvbklkLGNvbXA6ZGF0YX0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoRWRpdEV2ZW50Q29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoRWRpdEV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQsIEVkaXRFdmVudENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoRWRpdC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBFZGl0LmJhc2VVcmwrJ2VkaXRFdmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBFZGl0RXZlbnRDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2V2ZW50L2VkaXQve2NvbXBJZH1cIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdEV2ZW50R2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdEV2ZW50Q29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50LkVkaXQge1xuICAgIGFuZ3VsYXIubW9kdWxlKEVkaXQubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhFZGl0KSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50Q29udHJvbGxlci50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlL0NyZWF0ZUV2ZW50TW9kdWxlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0L0VkaXRFdmVudE1vZHVsZS50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50IHtcbiAgICBhbmd1bGFyLm1vZHVsZShFdmVudC5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKEV2ZW50KSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkFwcEdsb2JhbHMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiTmF2L05hdk1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBdXRoL0F1dGhNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YS9EYXRhTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsL1NoZWxsTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWUvSG9tZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbi9Mb2dpbk1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wL0NvbXBNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU3RhZ2UvU3RhZ2VNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnQvRXZlbnRNb2R1bGUudHNcIi8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBUaGUgQXBwIG1vZHVsZS5cbiAqIENvbnRhaW5zIGFsbCBzdWItbW9kdWxlcyBhbmQgaW1wbGVtZW50YXRpb24gcmVxdWlyZWQgZm9yIHRoZSBhcHBcbiAqL1xubW9kdWxlIEFwcCB7XG4gICAgdmFyIGRlcCA9IEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhBcHAsW1widWkuYm9vdHN0cmFwXCIsIFwidWkucm91dGVyXCIsIFwiYXBwLXBhcnRpYWxzXCIsIFwibmdBbmltYXRlXCJdKTtcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoQXBwLm1vZHVsZUlkLCBkZXApO1xuXG5cbiAgICBhcHAuZGlyZWN0aXZlKCdkeW5hbWljJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHsgbXNnOiAnPWR5bmFtaWMnfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIHBvc3RMaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaCggJ21zZycgLCBmdW5jdGlvbihtc2cpe1xuICAgICAgICAgIGVsZW1lbnQuaHRtbChtc2cuaHRtbCk7XG4gICAgICAgICAgJGNvbXBpbGUoZWxlbWVudC5jb250ZW50cygpKShzY29wZSk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuXG59XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==