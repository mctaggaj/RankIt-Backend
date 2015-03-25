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
    var Id;
    (function (Id) {
        Id.moduleId = App.moduleId + ".Id";
        Id.baseUrl = App.baseUrl + "Id/";
    })(Id = App.Id || (App.Id = {}));
})(App || (App = {}));

/// <reference path="IdGlobals.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Id;
    (function (Id) {
        /**
         * Use this service to add items to the nav bar.
         */
        var IdService = (function () {
            function IdService() {
                var _this = this;
                this.id = -1;
                this.getId = function () {
                    return _this.id--;
                };
            }
            IdService.serviceId = "IdService";
            IdService.moduleId = Id.moduleId + "." + IdService.serviceId;
            IdService.$inject = [];
            return IdService;
        })();
        Id.IdService = IdService;
        angular.module(IdService.moduleId, []).service(IdService.serviceId, IdService);
    })(Id = App.Id || (App.Id = {}));
})(App || (App = {}));

/// <reference path="IdGlobals.ts" />
/// <reference path="IdService.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Id;
    (function (Id) {
        // Makes App.Nav module
        angular.module(Id.moduleId, App.getChildModuleIds(Id));
    })(Id = App.Id || (App.Id = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Base;
    (function (Base) {
        Base.moduleId = App.moduleId + ".Base";
        Base.baseUrl = App.baseUrl + "Base/";
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));

/// <reference path="BaseGlobals.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Base;
    (function (Base) {
        /**
         * Use this service to add items to the nav bar.
         */
        var BaseHelperFactory = (function () {
            function BaseHelperFactory() {
                var _this = this;
                this.hasPermission = function (permissions, permission) {
                    if (permissions && permissions.hasOwnProperty(permission)) {
                        return permissions[permission];
                    }
                    console.error("Permissions: " + permissions.toString() + " does not exist, or does not have permission: " + permission);
                    return false;
                };
                this.hasAdmin = function (permissions) {
                    return _this.hasPermission(permissions, "admin");
                };
                this.hasCompetitor = function (permissions) {
                    return _this.hasPermission(permissions, "competitor");
                };
                this.hasJudge = function (permissions) {
                    return _this.hasPermission(permissions, "judge");
                };
                /**
                 * Returns true if the user id has edit permissions
                 * @param userId
                 * @param entity the comp, stage or event
                 * @returns {boolean|boolean}
                 */
                this.userCanEdit = function (userId, entity) {
                    return _this.userHas(userId, entity, _this.hasAdmin);
                };
                /**
                 * Returns true if the user id has competitor permissions
                 * @param userId
                 * @param entity the comp, stage or event
                 * @returns {boolean|boolean}
                 */
                this.userIsCompetitor = function (userId, entity) {
                    return _this.userHas(userId, entity, _this.hasCompetitor);
                };
                /**
                 * Returns true if the user id has judge permissions
                 * @param userId
                 * @param entity the comp, stage or event
                 * @returns {boolean|boolean}
                 */
                this.userIsJudge = function (userId, entity) {
                    return _this.userHas(userId, entity, _this.hasJudge);
                };
            }
            BaseHelperFactory.prototype.userHas = function (userId, entity, has) {
                if (entity && entity.participants && userId != undefined) {
                    for (var i in entity.participants) {
                        if (entity.participants[i].userId === userId && has(entity.participants[i].permissions)) {
                            return true;
                        }
                    }
                }
                return false;
            };
            BaseHelperFactory.factoryId = "BaseHelper";
            BaseHelperFactory.moduleId = Base.moduleId + "." + BaseHelperFactory.factoryId;
            BaseHelperFactory.$inject = [];
            BaseHelperFactory.factory = function () {
                var fac = new BaseHelperFactory();
                return {
                    userIsJudge: fac.userIsJudge,
                    userIsCompetitor: fac.userIsCompetitor,
                    userCanEdit: fac.userCanEdit
                };
            };
            return BaseHelperFactory;
        })();
        Base.BaseHelperFactory = BaseHelperFactory;
        angular.module(BaseHelperFactory.moduleId, []).service(BaseHelperFactory.factoryId, BaseHelperFactory.factory);
    })(Base = App.Base || (App.Base = {}));
})(App || (App = {}));

/// <reference path="BaseGlobals.ts" />
/// <reference path="BaseHelperFactory.ts" />
/**
 * @author Jason McTaggart
 */
var App;
(function (App) {
    var Base;
    (function (Base) {
        // Makes App.Nav module
        angular.module(Base.moduleId, App.getChildModuleIds(Base));
    })(Base = App.Base || (App.Base = {}));
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
        Auth.LS_Username = "RankIt.Auth.Username";
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
                this.login = function (username, password) {
                    _this.clearAuthData();
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/authentication", { userName: username, password: password }).then(function (response) {
                        // Success
                        response.data.username = username;
                        _this.setAuthData(response.data);
                        defered.resolve({
                            msg: null
                        });
                    }, function (response) {
                        // Failure
                        defered.reject({
                            msg: response.data.msg
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
                this.register = function (username, password, firstName, lastName) {
                    _this.clearAuthData();
                    var defered = _this.$q.defer();
                    _this.$http.post("/api/users", { userName: username, password: password, firstName: firstName, lastName: lastName }).then(function (response) {
                        response.data.username = username;
                        _this.setAuthData(response.data);
                        defered.resolve({
                            msg: null
                        });
                    }, function (response) {
                        defered.reject({
                            msg: response.data.msg
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
                    var user = _this.getAuthData();
                    return (user.userId && user.token && user.username);
                };
                /**
                 * @returns {string} the user name of the current user
                 */
                this.getUsername = function () {
                    return _this.localStorageService.get(Auth.LS_Username);
                };
                /**
                 * @returns {string} the user id of the current user
                 */
                this.getUserId = function () {
                    return parseInt(_this.localStorageService.get(Auth.LS_UserId));
                };
                /**
                 * Sets the token, and reties failed requests
                 * @param token
                 */
                this.setToken = function (token) {
                    _this.user.token = token;
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
                this.clearToken = function () {
                    return _this.setToken(undefined);
                };
                /**
                 * Clears the authentication data
                 */
                this.clearAuthData = function () {
                    _this.clearToken();
                    _this.localStorageService.remove(Auth.LS_Username);
                    _this.localStorageService.remove(Auth.LS_UserId);
                };
                /**
                 * Sets the authentication data
                 * @param userName The user name of the user
                 * @param userId the user id of the user
                 * @param userToken the session token
                 */
                this.setAuthData = function (data) {
                    _this.user.username = data.username;
                    _this.user.userId = data.userId;
                    _this.localStorageService.set(Auth.LS_Username, data.username);
                    _this.localStorageService.set(Auth.LS_UserId, data.userId);
                    _this.setToken(data.token);
                };
                this.getAuthData = function () {
                    if (!_this.user) {
                        _this.user = {};
                        _this.user.token = _this.getToken();
                        _this.user.username = _this.getUsername();
                        _this.user.userId = _this.getUserId();
                    }
                    return _this.user;
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
            function DataService($http, $q, $sce, authService) {
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
                    _this.$http.get("/api/stages/" + stageId).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.getEvent = function (eventId) {
                    var defered = _this.$q.defer();
                    _this.$http.get("/api/events/" + eventId).success(function (data, status, headers, config) {
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
                    _this.$http.post("/api/stages/" + stageId + "/events", event).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.editCompetition = function (compId, comp) {
                    var defered = _this.$q.defer();
                    _this.$http.put("/api/competitions/" + compId, comp).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.editStage = function (stageId, stage) {
                    var defered = _this.$q.defer();
                    _this.$http.put("/api/stages/" + stageId, stage).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defered.reject();
                    });
                    return defered.promise;
                };
                this.editEvent = function (eventId, event) {
                    var defered = _this.$q.defer();
                    _this.$http.put("/api/events/" + eventId, event).success(function (data, status, headers, config) {
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
                    _this.$http.get("api/stages/" + stageId + "/events").success(function (data, status, headers, config) {
                        defered.resolve(data.events);
                    }).error(function (data, status, headers, config) {
                    });
                    return defered.promise;
                };
                this.getUser = function (userId) {
                    var defered = _this.$q.defer();
                    _this.$http.get("api/users/" + userId).success(function (data, status, headers, config) {
                        defered.resolve(data);
                    }).error(function (data, status, headers, config) {
                    });
                    return defered.promise;
                };
                // public getUserObject = (userId):ng.IPromise<RankIt.IUser> => {
                //     var defered = this.$q.defer();
                //     this.$http.get("api/users/"+userId).success((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) => {
                //         defered.resolve(data);
                //     }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) =>{
                //     });
                //     return defered.promise;
                // }
                this.clientLogin = function (username, password) {
                    return _this.authService.login(username, password);
                };
                this.clientRegister = function (username, password, firstName, lastName) {
                    return _this.authService.register(username, password, firstName, lastName);
                };
                this.clientLogout = function () {
                    _this.authService.logout();
                };
                this.getAuthData = function () {
                    return _this.authService.getAuthData();
                };
                this.$http = $http;
                this.$q = $q;
                this.$sce = $sce;
                this.authService = authService;
            }
            DataService.serviceId = "DataService";
            DataService.moduleId = App.moduleId + "." + DataService.serviceId;
            DataService.$inject = ["$http", "$q", "$sce", App.Auth.AuthService.serviceId];
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
            function ShellController($scope, navService, dataService, authService) {
                $scope.navService = navService;
                $scope.dataService = dataService;
                $scope.authService = authService;
            }
            ShellController.controllerName = "ShellController";
            ShellController.moduleId = Shell.moduleId + "." + ShellController.controllerName;
            ShellController.$inject = ["$scope", App.Nav.NavService.serviceId, App.Data.DataService.serviceId, App.Auth.AuthService.serviceId];
            return ShellController;
        })();
        Shell.ShellController = ShellController;
        angular.module(ShellController.moduleId, [App.Nav.NavService.moduleId, App.Auth.AuthService.moduleId, App.Data.DataService.moduleId]).controller(ShellController.controllerName, ShellController);
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
        Login.state = "Login";
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
            function LoginController($scope, $state, dataService) {
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
                    _this.dataService.clientLogin(_this.scope.info.email, _this.scope.info.password).then(function (response) {
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
                    _this.dataService.clientRegister(_this.scope.info.email, _this.scope.info.password, _this.scope.info.firstName, _this.scope.info.lastName).then(function (response) {
                        // Sucess
                        _this.dataService.clientLogin(_this.scope.info.email, _this.scope.info.password).then(function (response) {
                            // Sucess
                            _this.$state.go(App.Home.state);
                        }, function (response) {
                            _this.scope.loginMode = true;
                            _this.error.title = 'Error!';
                            _this.error.html = 'Something went wrong, contact an administrator';
                            _this.error.state = "BAD_LOGIN";
                            _this.error.enabled = true;
                        });
                    }, function (response) {
                        _this.error.html = response.msg;
                        _this.error.enabled = true;
                    });
                };
                this.dataService = dataService;
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
            LoginController.$inject = ["$scope", "$state", App.Data.DataService.serviceId];
            return LoginController;
        })();
        Login.LoginController = LoginController;
        angular.module(LoginController.moduleId, [App.Nav.NavService.moduleId]).controller(LoginController.controllerId, LoginController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Login.state, {
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
    var Login;
    (function (Login) {
        angular.module(Login.moduleId, App.getChildModuleIds(Login));
    })(Login = App.Login || (App.Login = {}));
})(App || (App = {}));

/// <reference path="../AppGlobals.ts" />
/**
 * @author Timothy Engel
 */
var App;
(function (App) {
    var Profile;
    (function (Profile) {
        Profile.moduleId = App.moduleId + ".Profile";
        Profile.baseUrl = App.baseUrl + "Profile/";
        Profile.state = "Profile";
    })(Profile = App.Profile || (App.Profile = {}));
})(App || (App = {}));

/// <reference path="ProfileGlobals.ts" />
/**
 * @author Timothy Engel
 */
var App;
(function (App) {
    var Profile;
    (function (Profile) {
        var ProfileController = (function () {
            function ProfileController($scope, $state, $stateParams, dataService) {
                var _this = this;
                this.updateIfOwnProfile = function () {
                    if (!_this.$scope.user) {
                        return;
                    }
                    if (_this.dataService.getAuthData().userId == _this.$scope.user.userId) {
                        _this.$scope.extras = true;
                    }
                    else {
                        _this.$scope.extras = false;
                    }
                };
                this.getUser = function (userId) {
                    _this.dataService.getUser(userId).then(function (response) {
                        // Success
                        console.log(response);
                        _this.$scope.user = response;
                        _this.$scope.userId = userId;
                        _this.updateIfOwnProfile();
                    }, function (response) {
                        console.log("Failed to get user by Id: " + userId.toString());
                    });
                };
                this.dataService = dataService;
                this.$scope = $scope;
                this.$state = $state;
                $scope.userId = parseInt($stateParams['userId']);
                $scope.user = $stateParams['user'];
                if (!$scope.user) {
                    console.log('getting user');
                    this.getUser($scope.userId);
                }
                console.log($stateParams);
                this.updateIfOwnProfile();
            }
            ProfileController.controllerId = "ProfileController";
            ProfileController.moduleId = Profile.moduleId + "." + ProfileController.controllerId;
            ProfileController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return ProfileController;
        })();
        Profile.ProfileController = ProfileController;
        angular.module(ProfileController.moduleId, [App.Nav.NavService.moduleId]).controller(ProfileController.controllerId, ProfileController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Profile.state, {
                templateUrl: Profile.baseUrl + 'profile.html',
                controller: ProfileController.controllerId,
                url: "/profile/{userId}"
            });
        }]);
    })(Profile = App.Profile || (App.Profile = {}));
})(App || (App = {}));

/// <reference path="ProfileGlobals.ts" />
/// <reference path="ProfileController.ts" />
/**
 * @author Timothy Engel
 */
var App;
(function (App) {
    var Profile;
    (function (Profile) {
        angular.module(Profile.moduleId, App.getChildModuleIds(Profile));
    })(Profile = App.Profile || (App.Profile = {}));
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
                this.$scope = $scope;
                this.$state = $state;
                this.dataService = dataService;
                if ($stateParams['event']) {
                    $scope.event = $stateParams['event'];
                }
                else {
                    dataService.getEvent($stateParams['eventId']).then(function (data) {
                        $scope.event = data;
                    }, function (failure) {
                    });
                }
            }
            EventController.controllerId = "EventController";
            EventController.moduleId = Event.moduleId + "." + EventController.controllerId;
            EventController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return EventController;
        })();
        Event.EventController = EventController;
        angular.module(EventController.moduleId, [App.Nav.NavService.moduleId]).controller(EventController.controllerId, EventController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Event.state, {
                templateUrl: Event.baseUrl + 'event.html',
                controller: EventController.controllerId,
                url: "/event/{eventId}",
                params: { 'event': null }
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
                        _this.dataService.editEvent(_this.$scope.event.eventId, _this.$scope.event).then(function (data) {
                            _this.$state.go(Event.state, { eventId: data.eventId, event: data });
                        }, function () {
                            // failure
                        });
                    };
                    $scope.submit = this.submit;
                    $scope.states = RankIt.state;
                    if ($stateParams['event']) {
                        $scope.event = $stateParams['event'];
                    }
                    else {
                        dataService.getEvent($stateParams['eventId']).then(function (data) {
                            $scope.event = data;
                        }, function (failure) {
                        });
                    }
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
                    url: "/event/edit/{eventId}",
                    params: { event: null }
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
 * Jason McTaggart
 */
/// <reference path="../StageGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Filler;
        (function (Filler) {
            Filler.moduleId = Stage.moduleId + ".Filler";
            Filler.baseUrl = Stage.baseUrl + "Filler/";
        })(Filler = Stage.Filler || (Stage.Filler = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Edit Competition Page
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Filler;
        (function (Filler) {
            var FillerFactory = (function () {
                function FillerFactory(idService) {
                    var _this = this;
                    this.idService = idService;
                    /**
                     * Generates seed, events ans events seed
                     * @param stage
                     * @param participants
                     * @param participantsPerEvent
                     */
                    this.fill = function (stage, participants, participantsPerEvent) {
                        if (participantsPerEvent < 2) {
                            participantsPerEvent = 2;
                        }
                        if (!stage.events)
                            stage.events = [];
                        stage.seed = [];
                        var numEvents = participants / participantsPerEvent;
                        for (var i = 0; i < numEvents; i++) {
                            if (!stage.events[i]) {
                                stage.events[i] = { name: "Event " + i, state: "Upcoming" };
                                stage.events[i].eventId = _this.idService.getId();
                                stage.events[i].stageId = stage.stageId;
                            }
                            var seeds = _this.fillEvent(stage.events[i], participantsPerEvent, participants, i);
                            for (var seed in seeds) {
                                if (stage.seed.indexOf(seeds[seed]) < 0) {
                                    stage.seed.push(seeds[seed]);
                                }
                            }
                        }
                        stage.seed.sort(function (x, y) { return x - y; });
                    };
                    /**
                     * Generates the seeds for the given event
                     * @param event
                     * @param participants
                     * @param participantsInStage
                     * @param eventPosition
                     * @returns {number[]} the seed array
                     */
                    this.fillEvent = function (event, participants, participantsInStage, eventPosition) {
                        var seed = [];
                        var numEvents = participantsInStage / participants;
                        for (var i = 0; i < participants; i++) {
                            var toAdd = numEvents * i;
                            if (i % 2 == 0) {
                                toAdd += eventPosition;
                                toAdd++;
                            }
                            else {
                                toAdd += numEvents;
                                toAdd -= eventPosition;
                            }
                            seed.push(toAdd);
                        }
                        event.seed = seed;
                        return seed;
                    };
                }
                FillerFactory.factoryId = "StageFiller";
                FillerFactory.moduleId = Filler.moduleId + FillerFactory.factoryId;
                FillerFactory.$inject = [App.Id.IdService.serviceId];
                FillerFactory.$get = function (idService) {
                    var fac = new FillerFactory(idService);
                    return {
                        fill: fac.fill
                    };
                };
                return FillerFactory;
            })();
            Filler.FillerFactory = FillerFactory;
            angular.module(FillerFactory.moduleId, []).factory(FillerFactory.factoryId, [App.Id.IdService.serviceId, FillerFactory.$get]);
        })(Filler = Stage.Filler || (Stage.Filler = {}));
    })(Stage = App.Stage || (App.Stage = {}));
})(App || (App = {}));

/**
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
/// <reference path="FillerFactory.ts" />
var App;
(function (App) {
    var Stage;
    (function (Stage) {
        var Filler;
        (function (Filler) {
            angular.module(Filler.moduleId, App.getChildModuleIds(Filler));
        })(Filler = Stage.Filler || (Stage.Filler = {}));
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
                if ($stateParams['stage']) {
                    $scope.stage = $stateParams['stage'];
                }
                else {
                    dataService.getStage($stateParams['stageId']).then(function (data) {
                        $scope.stage = data;
                    }, function (failure) {
                    });
                }
            }
            StageController.controllerId = "StageController";
            StageController.moduleId = Stage.moduleId + "." + StageController.controllerId;
            StageController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId];
            return StageController;
        })();
        Stage.StageController = StageController;
        angular.module(StageController.moduleId, [App.Nav.NavService.moduleId]).controller(StageController.controllerId, StageController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Stage.state, {
                templateUrl: Stage.baseUrl + 'stage.html',
                controller: StageController.controllerId,
                url: "/stage/{stageId}",
                params: { stage: null }
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
                        _this.dataService.editStage(_this.$scope.stage.stageId, _this.$scope.stage).then(function (data) {
                            _this.$state.go(Stage.state, { stageId: data.stageId, stage: data });
                        }, function () {
                            // failure
                        });
                    };
                    $scope.submit = this.submit;
                    $scope.states = RankIt.state;
                    if ($stateParams['stage']) {
                        $scope.stage = $stateParams['stage'];
                        dataService.getStageEvents(this.$scope.stage.stageId).then(function (data) {
                            _this.$scope.events = data;
                        }, function () {
                            //failure
                        });
                    }
                    else {
                        dataService.getStage($stateParams['stageId']).then(function (data) {
                            _this.$scope.stage = data;
                            _this.$scope.events = data.events;
                        }, function () {
                            //failure
                        });
                    }
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
                    params: { 'stage': null }
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
/// <reference path="Filler/FillerModule.ts" />
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
 * Jason McTaggart
 */
/// <reference path="../CompGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Filler;
        (function (Filler) {
            Filler.moduleId = Comp.moduleId + ".Filler";
            Filler.baseUrl = Comp.baseUrl + "Filler/";
        })(Filler = Comp.Filler || (Comp.Filler = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Edit Competition Page
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Filler;
        (function (Filler) {
            var FillerFactory = (function () {
                function FillerFactory(stageFiller, idService) {
                    var _this = this;
                    this.stageFiller = stageFiller;
                    this.idService = idService;
                    /**
                     * Creates a complete competition bracket tree with the given number of participants
                     * with seeds in place.
                     *
                     * @param comp the competition
                     * @param participants number of participants in the competition
                     * @param participantsPerEvent the number of participants in each event
                     */
                    this.fill = function (comp, participants, participantsPerEvent) {
                        if (participantsPerEvent < 2) {
                            participantsPerEvent = 2;
                        }
                        if (!comp.stages)
                            comp.stages = [];
                        if (participants == 0) {
                            return;
                        }
                        var numStages = Math.ceil(_this.logBase(participants, participantsPerEvent));
                        for (var i = numStages; i > 0; i--) {
                            var participantsInStage = Math.pow(participantsPerEvent, i);
                            if (!comp.stages[numStages - i]) {
                                comp.stages[numStages - i] = { name: "Stage " + i, state: "Upcoming" };
                                comp.stages[numStages - i].stageId = _this.idService.getId();
                                comp.stages[numStages - i].competitionId = comp.competitionId;
                                if (numStages - i > 0) {
                                    comp.stages[numStages - i - 1].nextStageId = comp.stages[numStages - i].stageId;
                                    comp.stages[numStages - i].previousStageId = comp.stages[numStages - i - 1].stageId;
                                }
                            }
                            _this.stageFiller.fill(comp.stages[numStages - i], participantsInStage, participantsPerEvent);
                        }
                    };
                    /**
                     * logb(x)
                     * @param x
                     * @param b the base
                     * @returns the result
                     */
                    this.logBase = function (x, b) {
                        return Math.log(x) / Math.log(b);
                    };
                }
                FillerFactory.factoryId = "CompFiller";
                FillerFactory.moduleId = Filler.moduleId + FillerFactory.factoryId;
                FillerFactory.$inject = [App.Stage.Filler.FillerFactory.factoryId];
                FillerFactory.$get = function (stageFiller, idService) {
                    var fac = new FillerFactory(stageFiller, idService);
                    return {
                        fill: fac.fill
                    };
                };
                return FillerFactory;
            })();
            Filler.FillerFactory = FillerFactory;
            angular.module(FillerFactory.moduleId, []).factory(FillerFactory.factoryId, [App.Stage.Filler.FillerFactory.factoryId, App.Id.IdService.serviceId, FillerFactory.$get]);
        })(Filler = Comp.Filler || (Comp.Filler = {}));
    })(Comp = App.Comp || (App.Comp = {}));
})(App || (App = {}));

/**
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
/// <reference path="FillerFactory.ts" />
var App;
(function (App) {
    var Comp;
    (function (Comp) {
        var Filler;
        (function (Filler) {
            angular.module(Filler.moduleId, App.getChildModuleIds(Filler));
        })(Filler = Comp.Filler || (Comp.Filler = {}));
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
            function CompController($scope, $state, $stateParams, dataService, baseHelper) {
                var _this = this;
                this.$scope = $scope;
                this.$state = $state;
                this.dataService = dataService;
                this.baseHelper = baseHelper;
                this.populateUsers = function () {
                    var userList = _this.$scope.competition.users;
                    for (var i = 0; i < userList.length; i++) {
                        _this.dataService.getUser(userList[i].userId).then(function (data) {
                            var temp = {};
                            temp.userObject = data;
                            if (_this.baseHelper.userCanEdit(data.userId, _this.$scope.competition)) {
                                temp.role = "Admin";
                            }
                            else if (_this.baseHelper.userIsCompetitor(data.userId, _this.$scope.competition)) {
                                temp.role = "Competitor";
                            }
                            else if (_this.baseHelper.userIsJudge(data.userId, _this.$scope.competition)) {
                                temp.role = "Judge";
                            }
                            _this.$scope.users.push(temp);
                        }, function (failure) {
                        });
                    }
                };
                $scope.users = [];
                //If we have a competition structure, use it. Otherwise get it from the database
                if ($stateParams['comp']) {
                    $scope.competition = $stateParams['comp'];
                    this.populateUsers();
                }
                else {
                    dataService.getComp($stateParams['compId']).then(function (data) {
                        $scope.competition = data;
                        _this.populateUsers();
                    }, function (failure) {
                    });
                }
            }
            CompController.controllerId = "CompController";
            CompController.moduleId = Comp.moduleId + "." + CompController.controllerId;
            CompController.$inject = ["$scope", "$state", "$stateParams", App.Data.DataService.serviceId, App.Base.BaseHelperFactory.factoryId];
            return CompController;
        })();
        Comp.CompController = CompController;
        angular.module(CompController.moduleId, [App.Nav.NavService.moduleId]).controller(CompController.controllerId, CompController).config(["$stateProvider", function ($routeProvider) {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl + 'comp.html',
                controller: CompController.controllerId,
                url: "/comp?id={compId}"
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
                function CreateCompController($scope, $state, dataService, compFiller) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.dataService = dataService;
                    this.compFiller = compFiller;
                    this.submit = function () {
                        //Create the competition
                        if (_this.$scope.numParticipants != 0) {
                            _this.compFiller.fill(_this.$scope.comp, _this.$scope.numParticipants, _this.$scope.participantsPerEvent);
                        }
                        console.log(_this.$scope.comp);
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
                CreateCompController.$inject = ["$scope", "$state", App.Data.DataService.serviceId, Comp.Filler.FillerFactory.factoryId];
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
                        _this.dataService.editCompetition(_this.$scope.comp.competitionId, _this.$scope.comp).then(function (data) {
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
                    if ($stateParams['comp'] !== undefined) {
                        $scope.comp = $stateParams['comp'];
                        $scope.stages = $scope.comp.stages;
                    }
                    else {
                        dataService.getComp($stateParams['compId']).then(function (data) {
                            $scope.comp = data;
                        }, function (failure) {
                        });
                        //Get the stages in the competition to show on the page.
                        dataService.getCompStages($stateParams['compId']).then(function (data) {
                            $scope.stages = data;
                        }, function (failure) {
                        });
                    }
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
                        if (!scope.comp || !scope.comp.stages || !scope.comp.stages.length) {
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
                            _this.sortComp(scope.comp);
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
                                // Finds event in previous stage with the corresponding seed
                                var index = _this.eventIndexWithSeed(prevStage.events, seed);
                                var fromEvent = prevStage.events[index];
                                if (fromEvent && event) {
                                    connectors.push({
                                        from: $("#" + fromEvent.eventId + ">.event"),
                                        to: $("#" + event.eventId + ">.event")
                                    });
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
                /**
                 * Sorts a given competition's stages and their events
                 * @param comp
                 */
                CompStructDirective.prototype.sortComp = function (comp) {
                    var firstStage;
                    var stageIndex = 0;
                    var currentStage = comp.stages[stageIndex];
                    while (!firstStage) {
                        if (currentStage && !currentStage.previousStageId) {
                            firstStage = currentStage;
                        }
                        else {
                            stageIndex = this.stageIndexWithId(comp.stages, currentStage.previousStageId);
                            currentStage = comp.stages[stageIndex];
                        }
                    }
                    // Sorts the stages
                    var counter = 0;
                    while (currentStage && currentStage.nextStageId) {
                        this.arraySwap(comp.stages, counter++, stageIndex);
                        stageIndex = this.stageIndexWithId(comp.stages, currentStage.nextStageId);
                        var nextStage = comp.stages[stageIndex];
                        this.sortStage(currentStage, nextStage);
                        currentStage = nextStage;
                    }
                };
                /**
                 * Sorts the events within the stage to resemble the order they would appear in a traditional bracketed competition
                 * @param stage
                 * @param nextStage
                 */
                CompStructDirective.prototype.sortStage = function (stage, nextStage) {
                    if (!stage || !nextStage) {
                        throw new Error("Stage and nextStage arguments must exist");
                    }
                    var counter = 0;
                    for (var i in nextStage.events) {
                        for (var j in nextStage.events[i].seed) {
                            var index = this.eventIndexWithSeed(stage.events, nextStage.events[i].seed[j]);
                            this.arraySwap(stage.events, counter, index);
                            counter++;
                        }
                    }
                };
                /**
                 * finds the index of an event with a given seed
                 * @param events
                 * @param seed
                 * @returns {number} the index of the item (-1 if not present)
                 */
                CompStructDirective.prototype.eventIndexWithSeed = function (events, seed) {
                    for (var i in events) {
                        var event = events[i];
                        for (var j in event.seed) {
                            if (seed == event.seed[j]) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };
                /**
                 * Gets the index of the stage with a given id
                 * @param stages
                 * @param id
                 * @returns {number} the index of the item (-1 if not present)
                 */
                CompStructDirective.prototype.stageIndexWithId = function (stages, id) {
                    for (var i in stages) {
                        if (stages[i].stageId == id) {
                            return i;
                        }
                    }
                    return -1;
                };
                /**
                 * Swaps items at index x and y in the array
                 * @param array
                 * @param x
                 * @param y
                 */
                CompStructDirective.prototype.arraySwap = function (array, x, y) {
                    if (!array || x < 0 || x >= array.length || y < 0 || y >= array.length) {
                        throw new Error("Invalid Arguments");
                    }
                    else {
                        var temp = array[x];
                        array[x] = array[y];
                        array[y] = temp;
                    }
                };
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
/// <reference path="Filler/FillerModule.ts" />
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

/// <reference path="AppGlobals.ts"/>
/// <reference path="Id/IdModule.ts"/>
/// <reference path="Base/BaseModule.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
/// <reference path="Profile/ProfileModule.ts"/>
/// <reference path="Event/EventModule.ts"/>
/// <reference path="Stage/StageModule.ts"/>
/// <reference path="Comp/CompModule.ts"/>
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
var RankIt;
(function (RankIt) {
    RankIt.state = ["Upcoming", "In Progress", "Completed"];
})(RankIt || (RankIt = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BcHBHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0lkL0lkR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9JZC9JZFNlcnZpY2UudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vSWQvSWRNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQmFzZS9CYXNlR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9CYXNlL0Jhc2VIZWxwZXJGYWN0b3J5LnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0Jhc2UvQmFzZU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9OYXYvTmF2R2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9OYXYvTmF2U2VydmljZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9OYXYvTmF2TW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0F1dGgvQXV0aEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQXV0aC9BdXRoU2VydmljZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9BdXRoL0F1dGhNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRGF0YS9EYXRhR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9EYXRhL0RhdGFTZXJ2aWNlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0RhdGEvRGF0YU1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TaGVsbC9TaGVsbEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU2hlbGwvU2hlbGxDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1NoZWxsL1NoZWxsTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0hvbWUvSG9tZUdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vSG9tZS9Ib21lQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Ib21lL0hvbWVNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vTG9naW4vTG9naW5HbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0xvZ2luL0xvZ2luQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Mb2dpbi9Mb2dpbk1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Qcm9maWxlL1Byb2ZpbGVHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1Byb2ZpbGUvUHJvZmlsZUNvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vUHJvZmlsZS9Qcm9maWxlTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0V2ZW50R2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9FdmVudENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRXZlbnQvQ3JlYXRlL0NyZWF0ZUV2ZW50R2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9DcmVhdGUvQ3JlYXRlRXZlbnRDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0NyZWF0ZS9DcmVhdGVFdmVudE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9FdmVudC9FZGl0L0VkaXRFdmVudEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vRXZlbnQvRWRpdC9FZGl0RXZlbnRDb250cm9sbGVyLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0VkaXQvRWRpdEV2ZW50TW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0V2ZW50L0V2ZW50TW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL1N0YWdlR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9GaWxsZXIvRmlsbGVyR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9GaWxsZXIvRmlsbGVyRmFjdG9yeS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9GaWxsZXIvRmlsbGVyTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL1N0YWdlQ29udHJvbGxlci50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9DcmVhdGUvQ3JlYXRlU3RhZ2VHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL0NyZWF0ZS9DcmVhdGVTdGFnZUNvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvQ3JlYXRlL0NyZWF0ZVN0YWdlTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL1N0YWdlL0VkaXQvRWRpdFN0YWdlR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9TdGFnZS9FZGl0L0VkaXRTdGFnZUNvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvRWRpdC9FZGl0U3RhZ2VNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vU3RhZ2UvU3RhZ2VNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9Db21wR2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0ZpbGxlci9GaWxsZXJHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvRmlsbGVyL0ZpbGxlckZhY3RvcnkudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9GaWxsZXIvRmlsbGVyTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvQ29tcENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9DcmVhdGUvQ3JlYXRlQ29tcEdsb2JhbHMudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9DcmVhdGUvQ3JlYXRlQ29tcENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9DcmVhdGUvQ3JlYXRlQ29tcE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0VkaXQvRWRpdENvbXBHbG9iYWxzLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvRWRpdC9FZGl0Q29tcENvbnRyb2xsZXIudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQ29tcC9FZGl0L0VkaXRDb21wTW9kdWxlLnRzIiwiL1VzZXJzL2phc29ubWN0YWdnYXJ0L0Ryb3Bib3gvVU9HdWVscGgvQ0lTIDM3NjAvd2ViLWFwcGxpY2F0aW9uL0NvbXAvU3RydWN0Vmlldy9Db21wU3RydWN0R2xvYmFscy50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL1N0cnVjdFZpZXcvQ29tcFN0cnVjdERpcmVjdGl2ZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL1N0cnVjdFZpZXcvQ29tcFN0cnVjdE1vZHVsZS50cyIsIi9Vc2Vycy9qYXNvbm1jdGFnZ2FydC9Ecm9wYm94L1VPR3VlbHBoL0NJUyAzNzYwL3dlYi1hcHBsaWNhdGlvbi9Db21wL0NvbXBNb2R1bGUudHMiLCIvVXNlcnMvamFzb25tY3RhZ2dhcnQvRHJvcGJveC9VT0d1ZWxwaC9DSVMgMzc2MC93ZWItYXBwbGljYXRpb24vQXBwTW9kdWxlLnRzIl0sIm5hbWVzIjpbIkFwcCIsIkFwcC5nZXRDaGlsZE1vZHVsZUlkcyIsIkFwcC5JZCIsIkFwcC5JZC5JZFNlcnZpY2UiLCJBcHAuSWQuSWRTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiQXBwLkJhc2UiLCJBcHAuQmFzZS5CYXNlSGVscGVyRmFjdG9yeSIsIkFwcC5CYXNlLkJhc2VIZWxwZXJGYWN0b3J5LmNvbnN0cnVjdG9yIiwiQXBwLkJhc2UuQmFzZUhlbHBlckZhY3RvcnkudXNlckhhcyIsIkFwcC5OYXYiLCJBcHAuTmF2Lk5hdlNlcnZpY2UiLCJBcHAuTmF2Lk5hdlNlcnZpY2UuY29uc3RydWN0b3IiLCJBcHAuQXV0aCIsIkFwcC5BdXRoLkF1dGhTZXJ2aWNlIiwiQXBwLkF1dGguQXV0aFNlcnZpY2UuY29uc3RydWN0b3IiLCJBcHAuRGF0YSIsIkFwcC5EYXRhLkRhdGFTZXJ2aWNlIiwiQXBwLkRhdGEuRGF0YVNlcnZpY2UuY29uc3RydWN0b3IiLCJBcHAuU2hlbGwiLCJBcHAuU2hlbGwuU2hlbGxDb250cm9sbGVyIiwiQXBwLlNoZWxsLlNoZWxsQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5Ib21lIiwiQXBwLkhvbWUuSG9tZUNvbnRyb2xsZXIiLCJBcHAuSG9tZS5Ib21lQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5Mb2dpbiIsIkFwcC5Mb2dpbi5Mb2dpbkNvbnRyb2xsZXIiLCJBcHAuTG9naW4uTG9naW5Db250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLlByb2ZpbGUiLCJBcHAuUHJvZmlsZS5Qcm9maWxlQ29udHJvbGxlciIsIkFwcC5Qcm9maWxlLlByb2ZpbGVDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkV2ZW50IiwiQXBwLkV2ZW50LkV2ZW50Q29udHJvbGxlciIsIkFwcC5FdmVudC5FdmVudENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuRXZlbnQuQ3JlYXRlIiwiQXBwLkV2ZW50LkNyZWF0ZS5DcmVhdGVFdmVudENvbnRyb2xsZXIiLCJBcHAuRXZlbnQuQ3JlYXRlLkNyZWF0ZUV2ZW50Q29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5FdmVudC5FZGl0IiwiQXBwLkV2ZW50LkVkaXQuRWRpdEV2ZW50Q29udHJvbGxlciIsIkFwcC5FdmVudC5FZGl0LkVkaXRFdmVudENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuU3RhZ2UiLCJBcHAuU3RhZ2UuRmlsbGVyIiwiQXBwLlN0YWdlLkZpbGxlci5GaWxsZXJGYWN0b3J5IiwiQXBwLlN0YWdlLkZpbGxlci5GaWxsZXJGYWN0b3J5LmNvbnN0cnVjdG9yIiwiQXBwLlN0YWdlLlN0YWdlQ29udHJvbGxlciIsIkFwcC5TdGFnZS5TdGFnZUNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuU3RhZ2UuQ3JlYXRlIiwiQXBwLlN0YWdlLkNyZWF0ZS5DcmVhdGVTdGFnZUNvbnRyb2xsZXIiLCJBcHAuU3RhZ2UuQ3JlYXRlLkNyZWF0ZVN0YWdlQ29udHJvbGxlci5jb25zdHJ1Y3RvciIsIkFwcC5TdGFnZS5FZGl0IiwiQXBwLlN0YWdlLkVkaXQuRWRpdFN0YWdlQ29udHJvbGxlciIsIkFwcC5TdGFnZS5FZGl0LkVkaXRTdGFnZUNvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuQ29tcCIsIkFwcC5Db21wLkZpbGxlciIsIkFwcC5Db21wLkZpbGxlci5GaWxsZXJGYWN0b3J5IiwiQXBwLkNvbXAuRmlsbGVyLkZpbGxlckZhY3RvcnkuY29uc3RydWN0b3IiLCJBcHAuQ29tcC5Db21wQ29udHJvbGxlciIsIkFwcC5Db21wLkNvbXBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkNvbXAuQ3JlYXRlIiwiQXBwLkNvbXAuQ3JlYXRlLkNyZWF0ZUNvbXBDb250cm9sbGVyIiwiQXBwLkNvbXAuQ3JlYXRlLkNyZWF0ZUNvbXBDb250cm9sbGVyLmNvbnN0cnVjdG9yIiwiQXBwLkNvbXAuRWRpdCIsIkFwcC5Db21wLkVkaXQuRWRpdENvbXBDb250cm9sbGVyIiwiQXBwLkNvbXAuRWRpdC5FZGl0Q29tcENvbnRyb2xsZXIuY29uc3RydWN0b3IiLCJBcHAuQ29tcC5Db21wU3RydWN0IiwiQXBwLkNvbXAuQ29tcFN0cnVjdC5Db21wU3RydWN0RGlyZWN0aXZlIiwiQXBwLkNvbXAuQ29tcFN0cnVjdC5Db21wU3RydWN0RGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwiQXBwLkNvbXAuQ29tcFN0cnVjdC5Db21wU3RydWN0RGlyZWN0aXZlLnNvcnRDb21wIiwiQXBwLkNvbXAuQ29tcFN0cnVjdC5Db21wU3RydWN0RGlyZWN0aXZlLnNvcnRTdGFnZSIsIkFwcC5Db21wLkNvbXBTdHJ1Y3QuQ29tcFN0cnVjdERpcmVjdGl2ZS5ldmVudEluZGV4V2l0aFNlZWQiLCJBcHAuQ29tcC5Db21wU3RydWN0LkNvbXBTdHJ1Y3REaXJlY3RpdmUuc3RhZ2VJbmRleFdpdGhJZCIsIkFwcC5Db21wLkNvbXBTdHJ1Y3QuQ29tcFN0cnVjdERpcmVjdGl2ZS5hcnJheVN3YXAiLCJwb3N0TGluayIsIlJhbmtJdCJdLCJtYXBwaW5ncyI6IkFBQUEsK0NBQStDO0FBRS9DLEFBS0E7Ozs7R0FERztBQUNILElBQU8sR0FBRyxDQW9DVDtBQXBDRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBaUJHQSxZQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNqQkEsV0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0E7SUFFN0JBLEFBTUFBOzs7OztPQURHQTthQUNhQSxpQkFBaUJBLENBQUNBLE1BQWVBLEVBQUVBLEdBQWNBO1FBQzdEQyxJQUFJQSxHQUFHQSxHQUFhQSxHQUFHQSxJQUFFQSxFQUFFQSxDQUFDQTtRQUM1QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsSUFBSUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLElBQUVBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLGNBQWNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvRUEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBV0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQUE7WUFDbERBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLEdBQUdBLENBQUFBO0lBQ2RBLENBQUNBO0lBUmVELHFCQUFpQkEsR0FBakJBLGlCQVFmQSxDQUFBQTtBQUVMQSxDQUFDQSxFQXBDTSxHQUFHLEtBQUgsR0FBRyxRQW9DVDs7QUMzQ0QsQUFJQSx5Q0FKeUM7QUFDekM7O0dBRUc7QUFDSCxJQUFPLEdBQUcsQ0FJVDtBQUpELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxFQUFFQSxDQUlaQTtJQUpVQSxXQUFBQSxF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RUFBR0EsQ0FBQ0EsR0FBR0EsU0FBU0EsRUFBR0EsQ0FBQ0EsRUFBR0EsRUFBRUEsQ0FBQ0E7NEJBQ3BDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUNyQkEsQ0FBQ0E7Z0NBQ0dBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQVNBLEVBQUNBLElBQUlBLEVBQUNBLFFBQVFBLEdBQUNBLENBQUNBLEVBQUNBLEtBQUtBLEVBQUNBLFVBQVVBLEVBQUVBLENBQUNBO2dDQUM1REEsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsR0FBQ0EsS0FBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQUE7Z0NBQzlDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQTs0QkFDNUNBLENBQUNBOzRCQUNEQSxJQUFJQSxLQUFLQSxHQUFHQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFDQSxvQkFBb0JBLEVBQUNBLFlBQVlBLEVBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNoRkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FDdkJBLENBQUNBO2dDQUNHQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtvQ0FDcENBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dDQUNqQ0EsQ0FBQ0E7NEJBQ0xBLENB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SUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsRUFBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFFM0VBLEdBQUdBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLFNBQVNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUNBLENBQUNBOzRCQUMvQkEsSUFBSUEsbUJBQW1CQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxvQkFBb0JBLEVBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUMzREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzVCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFDQSxDQUFDQSxDQUFDQSxHQUFTQSxFQUFDQSxJQUFJQSxFQUFDQSxRQUFRQSxHQUFDQSxDQUFDQSxFQUFDQSxLQUFLQSxFQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtnQ0FDckVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLEdBQUNBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUFBO2dDQUN2REEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0NBQzVEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxHQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDbEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUNBLENBQUNBLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBO29DQUMxRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0NBQ2xGQSxDQUFDQTs0QkFDTEEsQ0FBQ0E7NEJBQ0RBLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUNBLENBQUNBLENBQUNBLEVBQUNBLG1CQUFtQkEsRUFBQ0Esb0JBQW9CQSxDQUFDQSxDQUFBQTt3QkFDNUZBLENBQUNBO29CQUVMQSxDQUFDQSxDQUFDQTtvQkFHRkE7Ozs7O3VCQUtHQTtvQkFDS0EsWUFBT0EsR0FBR0EsVUFBQ0EsQ0FBUUEsRUFBRUEsQ0FBU0E7d0JBQ2xDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbkNBLENBQUNBLENBQUFBO2dCQWhEREEsQ0FBQ0E7Z0JBWmFELHVCQUFTQSxHQUFHQSxZQUFZQSxDQUFDQTtnQkFDekJBLHNCQUFRQSxHQUFHQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFDckRBLHFCQUFPQSxHQUFhQSxDQUFDQSxTQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtnQkFFM0RBLGtCQUFJQSxHQUFHQSxVQUFDQSxXQUF1Q0EsRUFBRUEsU0FBdUJBO29CQUNsRkEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsYUFBYUEsQ0FBQ0EsV0FBV0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQUE7b0JBQ25EQSxNQUFNQSxDQUFDQTt3QkFDSEEsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsSUFBSUE7cUJBQ2pCQSxDQUFBQTtnQkFDTEEsQ0FBQ0EsQ0FBQUE7Z0JBcURMQSxvQkFBQ0E7WUFBREEsQ0FoRUFELEFBZ0VDQyxJQUFBRDtZQWhFWUEsb0JBQWFBLEdBQWJBLGFBZ0VaQSxDQUFBQTtZQUVEQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUN0Q0EsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsU0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsRUFBRUEsTUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDN0hBLENBQUNBLEVBdEVlRCxNQUFNQSxHQUFOQSxXQUFNQSxLQUFOQSxXQUFNQSxRQXNFckJBO0lBQURBLENBQUNBLEVBdEVVbkQsSUFBSUEsR0FBSkEsUUFBSUEsS0FBSkEsUUFBSUEsUUFzRWRBO0FBQURBLENBQUNBLEVBdEVNLEdBQUcsS0FBSCxHQUFHLFFBc0VUOztBQzNFRCxBQUtBOztHQUhHO0FBQ0gseUNBQXlDO0FBQ3pDLHlDQUF5QztBQUN6QyxJQUFPLEdBQUcsQ0FFVDtBQUZELFdBQU8sR0FBRztJQUFDQSxJQUFBQSxJQUFJQSxDQUVkQTtJQUZVQSxXQUFBQSxJQUFJQTtRQUFDbUQsSUFBQUEsTUFBTUEsQ0FFckJBO1FBRmVBLFdBQUFBLE1BQU1BLEVBQUNBLENBQUNBO1lBQ3BCQyxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxDQUFDQSxpQkFBaUJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1FBQ25FQSxDQUFDQSxFQUZlRCxNQUFNQSxHQUFOQSxXQUFNQSxLQUFOQSxXQUFNQSxRQUVyQkE7SUFBREEsQ0FBQ0EsRUFGVW5ELElBQUlBLEdBQUpBLFFBQUlBLEtBQUpBLFFBQUlBLFFBRWRBO0FBQURBLENBQUNBLEVBRk0sR0FBRyxLQUFILEdBQUcsUUFFVDs7QUNQRCxBQUtBOzs7R0FGRztBQUNILHVDQUF1QztBQUN2QyxJQUFPLEdBQUcsQ0E0RFQ7QUE1REQsV0FBTyxHQUFHO0lBQUNBLElBQUFBLElBQUlBLENBNERkQTtJQTVEVUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7UUFTYm1ELElBQWFBLGNBQWNBO1lBS3ZCSSxTQUxTQSxjQUFjQSxDQUtGQSxNQUE0QkEsRUFBU0EsTUFBMEJBLEVBQUVBLFlBQXNDQSxFQUFVQSxXQUE0QkEsRUFBVUEsVUFBa0NBO2dCQUxsTkMsaUJBd0NDQTtnQkFuQ3dCQSxXQUFNQSxHQUFOQSxNQUFNQSxDQUFzQkE7Z0JBQVNBLFdBQU1BLEdBQU5BLE1BQU1BLENBQW9CQTtnQkFBa0RBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFpQkE7Z0JBQVVBLGVBQVVBLEdBQVZBLFVBQVVBLENBQXdCQTtnQkFnQnRNQSxrQkFBYUEsR0FBR0E7b0JBQ3BCQSxJQUFJQSxRQUFRQSxHQUFDQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFDM0NBLEdBQUdBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLEVBQUNBLENBQUNBLEdBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLEVBQUVBLEVBQUNBLENBQUNBO3dCQUMvQkEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQ0EsSUFBaUJBOzRCQUNoRUEsSUFBSUEsSUFBSUEsR0FBS0EsRUFBRUEsQ0FBQ0E7NEJBQ2hCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFDQSxJQUFJQSxDQUFDQTs0QkFDckJBLEVBQUVBLENBQUFBLENBQUNBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUNBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO2dDQUNqRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBQ0EsT0FBT0EsQ0FBQ0E7NEJBQ3RCQSxDQUFDQTs0QkFBQUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFDQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFDQTtnQ0FDNUVBLElBQUlBLENBQUNBLElBQUlBLEdBQUNBLFlBQVlBLENBQUNBOzRCQUMzQkEsQ0FBQ0E7NEJBQUFBLElBQUlBLENBQUNBLEVBQUVBLENBQUFBLENBQUNBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUNBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUFBLENBQUNBO2dDQUN2RUEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBQ0EsT0FBT0EsQ0FBQ0E7NEJBQ3RCQSxDQUFDQTs0QkFDREEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ2pDQSxDQUFDQSxFQUFFQSxVQUFDQSxPQUFXQTt3QkFFZkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLENBQUNBO2dCQUNMQSxDQUFDQSxDQUFBQTtnQkFqQ0dBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUNBLEVBQUVBLENBQUNBO2dCQUNoQkEsQUFDQUEsZ0ZBRGdGQTtnQkFDaEZBLEVBQUVBLENBQUFBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUFBLENB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QUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLElBQXlCQTs0QkFDN0dBLEtBQUlBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUNBLEVBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLGFBQWFBLEVBQUNBLElBQUlBLEVBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO3dCQUN0RUEsQ0FBQ0EsRUFBRUE7NEJBQ0NBLFVBQVVBO3dCQUNkQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0EsQ0FBQUE7b0JBRU1BLGFBQVFBLEdBQUdBLFVBQUNBLElBQUlBO3dCQUNuQkEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsU0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBQ0EsRUFBQ0EsSUFBSUEsRUFBQ0EsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25EQSxDQUFDQSxDQUFBQTtvQkE5QkdBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO29CQUM1QkEsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7b0JBQ2hDQSxFQUFFQSxDQUFBQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFHQSxTQUFTQSxDQUFDQSxDQUFBQSxDQUFDQTt3QkFDakNBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO3dCQUNuQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7b0JBQ3ZDQSxDQUFDQTtvQkFBQUEsSUFBSUEsQ0FBQUEsQ0FBQ0E7d0JBQ0ZBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNB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SUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0E7NkJBQzFEQSxDQUFDQTt3QkFDTkEsQ0FBQ0E7d0JBRURBLEFBQ0FBLDJEQUQyREE7NEJBQ3ZEQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTt3QkFDckRBLEtBQUtBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO3dCQUVkQSxBQUNBQSw2RUFENkVBO3dCQUM3RUEsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUE7NEJBQ3JCLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBTyxLQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3BELENBQUMsQ0FBQ0EsQ0FBQ0E7d0JBRUhBLEFBQ0FBLHFEQURxREE7d0JBQ3JEQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFFQTs0QkFDWEEsSUFBSUEsT0FBT0EsR0FBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7NEJBQzdCQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQTs0QkFDaERBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBOzRCQUNsREEsSUFBSUEsV0FBV0EsR0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7NEJBQzdDQSxLQUFLQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFDQSxNQUFNQSxFQUFFQSxXQUFX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Q0FBQztJQUNDd0UsWUFBS0EsR0FBQ0EsQ0FBQ0EsVUFBVUEsRUFBQ0EsYUFBYUEsRUFBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7QUFDNURBLENBQUNBLEVBRk0sTUFBTSxLQUFOLE1BQU0sUUFFWiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vVHlwaW5ncy9UeXBpbmdzLmQudHNcIi8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqIFRoZSBBcHAgbW9kdWxlLlxuICogQ29udGFpbnMgYWxsIHN1Yi1tb2R1bGVzIGFuZCBpbXBsZW1lbnRhdGlvbiByZXF1aXJlZCBmb3IgdGhlIGFwcFxuICovXG5tb2R1bGUgQXBwIHtcblxuICAgIC8qKlxuICAgICAqIEFuIGFuZ3VsYXIgbW9kdWxlXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTW9kdWxlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBhbmd1bGFyIG1vZHVsZVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlSWQ6c3RyaW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYmFzZSB1cmwgZm9yIGFueSB0ZW1wbGF0ZXNcbiAgICAgICAgICovXG4gICAgICAgIGJhc2VVcmw/OiBzdHJpbmc7XG4gICAgfVxuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IFwiQXBwXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gXCIvc3JjL1wiO1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGlzdCBvZiBjaGlsZCBtb2R1bGUgaWRzIGdpdmVuIGEgbW9kdWxlXG4gICAgICogQHBhcmFtIG9iamVjdCB0aGUgcGFyZW50IG1vZHVsZXNcbiAgICAgKiBAcGFyYW0gPG9wdGlvbmFsPiB0aGUgYXJyYXkgb2YgZGVwZW5kZW5jaWVzIHRvIGFkZCB0b1xuICAgICAqIEByZXR1cm5zIG1vZHVsZSBpZHMgb2YgY2hpbGQgbW9kdWxlc1xuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDaGlsZE1vZHVsZUlkcyhvYmplY3Q6IElNb2R1bGUsIGRlcD86IHN0cmluZ1tdKTpzdHJpbmdbXSB7XG4gICAgICAgIHZhciBkZXA6IHN0cmluZ1tdID0gZGVwfHxbXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSYmb2JqZWN0W3Byb3BlcnR5XS5oYXNPd25Qcm9wZXJ0eShcIm1vZHVsZUlkXCIpKSB7XG4gICAgICAgICAgICAgICAgZGVwLnB1c2goKDxJTW9kdWxlPm9iamVjdFtwcm9wZXJ0eV0pLm1vZHVsZUlkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXBcbiAgICB9XG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuSWQge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLklkXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIklkL1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJJZEdsb2JhbHMudHNcIiAvPlxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICovXG5tb2R1bGUgQXBwLklkIHtcblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIHNlcnZpY2UgdG8gYWRkIGl0ZW1zIHRvIHRoZSBuYXYgYmFyLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBJZFNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiSWRTZXJ2aWNlXCJcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IElkLm1vZHVsZUlkICsgXCIuXCIgKyBJZFNlcnZpY2Uuc2VydmljZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3Q6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBpZCA9IC0xO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRJZCA9ICgpOiBSYW5rSXQuSUlkID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlkLS07XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKElkU2VydmljZS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKElkU2VydmljZS5zZXJ2aWNlSWQsIElkU2VydmljZSlcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiSWRHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJJZFNlcnZpY2UudHNcIiAvPlxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICovXG5tb2R1bGUgQXBwLklkIHtcblxuICAgIC8vIE1ha2VzIEFwcC5OYXYgbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoSWQubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhJZCkpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5CYXNlIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5CYXNlXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkJhc2UvXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkJhc2VHbG9iYWxzLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5CYXNlIHtcblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIHNlcnZpY2UgdG8gYWRkIGl0ZW1zIHRvIHRoZSBuYXYgYmFyLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBCYXNlSGVscGVyRmFjdG9yeSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFjdG9yeUlkID0gXCJCYXNlSGVscGVyXCJcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEJhc2UubW9kdWxlSWQgKyBcIi5cIiArIEJhc2VIZWxwZXJGYWN0b3J5LmZhY3RvcnlJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtdO1xuXG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIHByaXZhdGUgaGFzUGVybWlzc2lvbiA9IChwZXJtaXNzaW9uczogUmFua0l0LklQZXJtaXNzaW9ucywgcGVybWlzc2lvbjogc3RyaW5nKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocGVybWlzc2lvbnMmJnBlcm1pc3Npb25zLmhhc093blByb3BlcnR5KHBlcm1pc3Npb24pKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9uc1twZXJtaXNzaW9uXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQZXJtaXNzaW9uczogXCIrcGVybWlzc2lvbnMudG9TdHJpbmcoKStcIiBkb2VzIG5vdCBleGlzdCwgb3IgZG9lcyBub3QgaGF2ZSBwZXJtaXNzaW9uOiBcIitwZXJtaXNzaW9uKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaGFzQWRtaW4gPSAocGVybWlzc2lvbnM6IFJhbmtJdC5JUGVybWlzc2lvbnMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb24ocGVybWlzc2lvbnMsIFwiYWRtaW5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGhhc0NvbXBldGl0b3IgPSAocGVybWlzc2lvbnM6IFJhbmtJdC5JUGVybWlzc2lvbnMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb24ocGVybWlzc2lvbnMsIFwiY29tcGV0aXRvclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaGFzSnVkZ2UgPSAocGVybWlzc2lvbnM6IFJhbmtJdC5JUGVybWlzc2lvbnMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb24ocGVybWlzc2lvbnMsIFwianVkZ2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHVzZXJIYXModXNlcklkOiBSYW5rSXQuSUlkLCBlbnRpdHk6IFJhbmtJdC5JQmFzZSwgaGFzOihwZXJtaXNzaW9uczogUmFua0l0LklQZXJtaXNzaW9ucykgPT4gYm9vbGVhbikge1xuICAgICAgICAgICAgaWYgKGVudGl0eSAmJiBlbnRpdHkucGFydGljaXBhbnRzICYmIHVzZXJJZCE9dW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBlbnRpdHkucGFydGljaXBhbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRpdHkucGFydGljaXBhbnRzW2ldLnVzZXJJZD09PXVzZXJJZCYmaGFzKGVudGl0eS5wYXJ0aWNpcGFudHNbaV0ucGVybWlzc2lvbnMpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHVzZXIgaWQgaGFzIGVkaXQgcGVybWlzc2lvbnNcbiAgICAgICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAgICAgKiBAcGFyYW0gZW50aXR5IHRoZSBjb21wLCBzdGFnZSBvciBldmVudFxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbnxib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHVzZXJDYW5FZGl0ID0gKHVzZXJJZDogUmFua0l0LklJZCwgZW50aXR5OiBSYW5rSXQuSUJhc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJIYXModXNlcklkLCBlbnRpdHksIHRoaXMuaGFzQWRtaW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdXNlciBpZCBoYXMgY29tcGV0aXRvciBwZXJtaXNzaW9uc1xuICAgICAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICAgICAqIEBwYXJhbSBlbnRpdHkgdGhlIGNvbXAsIHN0YWdlIG9yIGV2ZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufGJvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgdXNlcklzQ29tcGV0aXRvciA9ICh1c2VySWQ6IFJhbmtJdC5JSWQsIGVudGl0eTogUmFua0l0LklCYXNlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VySGFzKHVzZXJJZCwgZW50aXR5LCB0aGlzLmhhc0NvbXBldGl0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdXNlciBpZCBoYXMganVkZ2UgcGVybWlzc2lvbnNcbiAgICAgICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAgICAgKiBAcGFyYW0gZW50aXR5IHRoZSBjb21wLCBzdGFnZSBvciBldmVudFxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbnxib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHVzZXJJc0p1ZGdlID0gKHVzZXJJZDogUmFua0l0LklJZCwgZW50aXR5OiBSYW5rSXQuSUJhc2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJIYXModXNlcklkLCBlbnRpdHksIHRoaXMuaGFzSnVkZ2UpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgc3RhdGljIGZhY3RvcnkgPSAoKSA9PiB7XG4gICAgICAgICAgICB2YXIgZmFjID0gbmV3IEJhc2VIZWxwZXJGYWN0b3J5KCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXJJc0p1ZGdlOiBmYWMudXNlcklzSnVkZ2UsXG4gICAgICAgICAgICAgICAgdXNlcklzQ29tcGV0aXRvcjogZmFjLnVzZXJJc0NvbXBldGl0b3IsXG4gICAgICAgICAgICAgICAgdXNlckNhbkVkaXQ6IGZhYy51c2VyQ2FuRWRpdFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShCYXNlSGVscGVyRmFjdG9yeS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKEJhc2VIZWxwZXJGYWN0b3J5LmZhY3RvcnlJZCwgQmFzZUhlbHBlckZhY3RvcnkuZmFjdG9yeSlcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQmFzZUdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkJhc2VIZWxwZXJGYWN0b3J5LnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5CYXNlIHtcblxuICAgIC8vIE1ha2VzIEFwcC5OYXYgbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoQmFzZS5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKEJhc2UpKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuTmF2IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5OYXZcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiTmF2L1wiO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZHbG9iYWxzLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5OYXYge1xuXG4gICAgLyoqXG4gICAgICogQW4gSXRlbSB0byBiZSBwbGFjZWQgaW4gdGhlIG5hdiBiYXIuXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElOYXZJdGVtIHtcbiAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICBzdGF0ZTogc3RyaW5nO1xuICAgICAgICBvcmRlcjogbnVtYmVyO1xuICAgICAgICBpY29uPzogc3RyaW5nO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoaXMgc2VydmljZSB0byBhZGQgaXRlbXMgdG8gdGhlIG5hdiBiYXIuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIE5hdlNlcnZpY2Uge1xuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VJZCA9IFwiTmF2U2VydmljZVwiXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBOYXYubW9kdWxlSWQgKyBcIi5cIiArIE5hdlNlcnZpY2Uuc2VydmljZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3Q6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsaXN0IG9mIGl0ZW1zIGluIHRoZSBuYXYtYmFyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBuYXZJdGVtczogSU5hdkl0ZW1bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIHRoZSBnaXZlbiBpdGVtIHRvIHRoZSBuYXYtYmFyXG4gICAgICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYWRkSXRlbSA9IChpdGVtOiBJTmF2SXRlbSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uYXZJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgdGhpcy5uYXZJdGVtcy5zb3J0KChhOiBJTmF2SXRlbSwgYjogSU5hdkl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoTmF2U2VydmljZS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKE5hdlNlcnZpY2Uuc2VydmljZUlkLCBOYXZTZXJ2aWNlKVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXZTZXJ2aWNlLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5OYXYge1xuXG4gICAgLy8gTWFrZXMgQXBwLk5hdiBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShOYXYubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhOYXYpKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5BdXRoIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5BdXRoXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkF1dGgvXCI7XG5cbiAgICBleHBvcnQgdmFyIExTX1VzZXJuYW1lID0gXCJSYW5rSXQuQXV0aC5Vc2VybmFtZVwiO1xuICAgIGV4cG9ydCB2YXIgTFNfVXNlcklkID0gXCJSYW5rSXQuQXV0aC5Vc2VySWRcIjtcbiAgICBleHBvcnQgdmFyIExTX1VzZXJUb2tlbiA9IFwiUmFua0l0LkF1dGguVXNlclRva2VuXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhHbG9iYWxzLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICogQHN1YmF1dGhvciBUaW1vdGh5IEVuZ2VsXG4gKi9cbm1vZHVsZSBBcHAuQXV0aCB7XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHVzZXIgYXV0aGVudGljYXRpb24gYW5kIGN1cnJlbnQgdXNlciBzdGF0ZVxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZUlkID0gXCJBdXRoZW50aWNhdGlvblNlcnZpY2VcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLlwiICsgQXV0aFNlcnZpY2Uuc2VydmljZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3Q6IHN0cmluZ1tdID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcImxvY2FsU3RvcmFnZVNlcnZpY2VcIiwgXCJhdXRoU2VydmljZVwiXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGh0dHAgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcHJvbWlzZSBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRxOiBuZy5JUVNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBsb2NhbCBzdG9yYWdlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgbG9jYWxTdG9yYWdlU2VydmljZTogbmcubG9jYWxTdG9yYWdlLklMb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VydmljZSB0aGF0IGhhbmRsZXMgNDAxIGFuZCA0MDMgZXJyb3JzXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGh0dHBBdXRoU2VydmljZSA6IG5nLmh0dHBBdXRoLklBdXRoU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmFnZSBvZiB0aGUgdXNlciBkYXRhXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHVzZXI6IFJhbmtJdC5JVXNlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBBdXRoU2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IgKCRodHRwOiBuZy5JSHR0cFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2UsIGxvY2FsU3RvcmFnZVNlcnZpY2U6IG5nLmxvY2FsU3RvcmFnZS5JTG9jYWxTdG9yYWdlU2VydmljZSwgaHR0cEF1dGhTZXJ2aWNlOiBuZy5odHRwQXV0aC5JQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAgPSAkaHR0cDtcbiAgICAgICAgICAgIHRoaXMuJHEgPSAkcTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IGxvY2FsU3RvcmFnZVNlcnZpY2U7XG4gICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZSA9IGh0dHBBdXRoU2VydmljZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMb2dnZWRJbigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRUb2tlbih0aGlzLmdldFRva2VuKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ3MgaW4gd2l0aCB0aGUgZ2l2ZW4gdXNlcm5hbWUgYW5kIHBhc3N3b3JkXG4gICAgICAgICAqIEBwYXJhbSB1c2VyTmFtZVxuICAgICAgICAgKiBAcGFyYW0gcGFzc3dvcmRcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBsb2dpbiA9ICh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogbmcuSVByb21pc2U8UmFua0l0LklSZXNwb25zZT4gPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhckF1dGhEYXRhKCk7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAucG9zdChcIi9hcGkvYXV0aGVudGljYXRpb25cIiwge3VzZXJOYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkfSlcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAocmVzcG9uc2U6IG5nLklIdHRwUHJvbWlzZUNhbGxiYWNrQXJnPFJhbmtJdC5JVXNlcj4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnVzZXJuYW1lID0gdXNlcm5hbWUgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXV0aERhdGEocmVzcG9uc2UuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8UmFua0l0LklSZXNwb25zZT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmFpbHVyZVxuICAgICAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2c6IHJlc3BvbnNlLmRhdGEubXNnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWdpc3RlcnMgYSBuZXcgdXNlclxuICAgICAgICAgKiBAQXV0aG9yIFRpbVxuICAgICAgICAgKiBAcGFyYW0gdXNlck5hbWVcbiAgICAgICAgICogQHBhcmFtIHBhc3N3b3JkXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIgPSAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgZmlyc3ROYW1lOiBzdHJpbmcsIGxhc3ROYW1lOiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxSYW5rSXQuSVJlc3BvbnNlPiA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQXV0aERhdGEoKTtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KFwiL2FwaS91c2Vyc1wiLCB7dXNlck5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQsIGZpcnN0TmFtZTogZmlyc3ROYW1lLCBsYXN0TmFtZTogbGFzdE5hbWV9KVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8UmFua0l0LklVc2VyPikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QXV0aERhdGEocmVzcG9uc2UuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChyZXNwb25zZTogbmcuSUh0dHBQcm9taXNlQ2FsbGJhY2tBcmc8UmFua0l0LklSZXNwb25zZT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiByZXNwb25zZS5kYXRhLm1zZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9ncyB0aGUgY3VycmVudCB1c2VyIG91dFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGxvZ291dCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVsZXRlKFwiL2FwaS9hdXRoZW50aWNhdGlvblwiKS5zdWNjZXNzKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyQXV0aERhdGEoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgY3VycmVudGx5IGxvZ2dlZCBpbiBmYWxzZSBpZiBsb2dnZWQgb3V0XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgaXNMb2dnZWRJbiA9ICgpOiBhbnkgPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSB0aGlzLmdldEF1dGhEYXRhKCk7XG4gICAgICAgICAgICByZXR1cm4gKHVzZXIudXNlcklkJiZ1c2VyLnRva2VuJiZ1c2VyLnVzZXJuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdXNlciBuYW1lIG9mIHRoZSBjdXJyZW50IHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRVc2VybmFtZSA9ICgpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXQoQXV0aC5MU19Vc2VybmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHVzZXIgaWQgb2YgdGhlIGN1cnJlbnQgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldFVzZXJJZCA9ICgpOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXQoQXV0aC5MU19Vc2VySWQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSB0b2tlbiwgYW5kIHJldGllcyBmYWlsZWQgcmVxdWVzdHNcbiAgICAgICAgICogQHBhcmFtIHRva2VuXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHNldFRva2VuID0gKHRva2VuIDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVzZXIudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5zZXQoQXV0aC5MU19Vc2VyVG9rZW4sIHRva2VuKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bXCJYLVRva2VuXCJdID0gdG9rZW47XG4gICAgICAgICAgICAgICAgdGhpcy5odHRwQXV0aFNlcnZpY2UubG9naW5Db25maXJtZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENsZWFycyB0aGUgdG9rZW5cbiAgICAgICAgICAgICAgICB0aGlzLiRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uW1wiWC1Ub2tlblwiXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHBBdXRoU2VydmljZS5sb2dpbkNhbmNlbGxlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBhdXRoIHRva2VuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZ2V0VG9rZW4gPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KEF1dGguTFNfVXNlclRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjbGVhclRva2VuID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0VG9rZW4odW5kZWZpbmVkKVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyB0aGUgYXV0aGVudGljYXRpb24gZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBjbGVhckF1dGhEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRva2VuKClcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoQXV0aC5MU19Vc2VybmFtZSk7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKEF1dGguTFNfVXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBhdXRoZW50aWNhdGlvbiBkYXRhXG4gICAgICAgICAqIEBwYXJhbSB1c2VyTmFtZSBUaGUgdXNlciBuYW1lIG9mIHRoZSB1c2VyXG4gICAgICAgICAqIEBwYXJhbSB1c2VySWQgdGhlIHVzZXIgaWQgb2YgdGhlIHVzZXJcbiAgICAgICAgICogQHBhcmFtIHVzZXJUb2tlbiB0aGUgc2Vzc2lvbiB0b2tlblxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSBzZXRBdXRoRGF0YSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXNlci51c2VybmFtZSA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgICAgICB0aGlzLnVzZXIudXNlcklkID0gZGF0YS51c2VySWQ7XG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KEF1dGguTFNfVXNlcm5hbWUsIGRhdGEudXNlcm5hbWUpO1xuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChBdXRoLkxTX1VzZXJJZCwgZGF0YS51c2VySWQpO1xuICAgICAgICAgICAgdGhpcy5zZXRUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRBdXRoRGF0YSA9ICgpOiBSYW5rSXQuSVVzZXIgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnVzZXIpe1xuICAgICAgICAgICAgICAgIHRoaXMudXNlciA9ICg8YW55Pnt9KVxuICAgICAgICAgICAgICAgIHRoaXMudXNlci50b2tlbiA9IHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXIudXNlcm5hbWUgPSB0aGlzLmdldFVzZXJuYW1lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyLnVzZXJJZCA9IHRoaXMuZ2V0VXNlcklkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VyO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmd1bGFyIGFuZCBzZXJ2aWNlIHJlZ2lzdHJhdGlvblxuICAgICAqL1xuICAgIGFuZ3VsYXIubW9kdWxlKEF1dGhTZXJ2aWNlLm1vZHVsZUlkLCBbXCJMb2NhbFN0b3JhZ2VNb2R1bGVcIiwgXCJodHRwLWF1dGgtaW50ZXJjZXB0b3JcIl0pXG4gICAgICAgIC5zZXJ2aWNlKEF1dGhTZXJ2aWNlLnNlcnZpY2VJZCwgQXV0aFNlcnZpY2UpXG5cblxuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhHbG9iYWxzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGhTZXJ2aWNlLnRzXCIvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuQXV0aCB7XG4gICAgLyoqXG4gICAgICogVGhlIGxpc3Qgb2YgY2hpbGQgbW9kdWxlc1xuICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgKi9cbiAgICB2YXIgZGVwID0gQXBwLmdldENoaWxkTW9kdWxlSWRzKEF1dGgpO1xuXG4gICAgLy8gTWFrZXMgQXBwLkF1dGggbW9kdWxlXG4gICAgYW5ndWxhci5tb2R1bGUoQXV0aC5tb2R1bGVJZCwgZGVwKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5EYXRhIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5EYXRhXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIkRhdGEvXCI7XG59IiwiLyoqXG4gKiBIYW5kbGVzIGRhdGEgaW50ZXJhY3Rpb25zIGJldHdlZW4gdGhlIGFwcCBhbmQgdGhlIHNlcnZlclxuICpcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKlxuICogQFN1Yi1BdXRob3IgLSBBbmRyZXcgV2VsdG9uXG4gKiAgSSBjb3BpZWQgYW5kIHBhc3RlZCBKYXNvbidzIHdvcmtpbmcgZnVuY3Rpb24gYW5kIGNoYW5nZWQgcGFyYW1ldGVycyBhcyBuZWVkZWQuXG4gKiAgQWxsIHRoZSBmdW5jdGlvbnMgYXJlIGJhc2ljYWxseSB0aGUgc2FtZSwgSmFzb24gd3JvdGUgdGhlIGNvcmUgb25lLlxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRGF0YUdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5EYXRhIHtcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdXNlciBhdXRoZW50aWNhdGlvbiBhbmQgY3VycmVudCB1c2VyIHN0YXRlXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlSWQgPSBcIkRhdGFTZXJ2aWNlXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5cIiArIERhdGFTZXJ2aWNlLnNlcnZpY2VJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtcIiRodHRwXCIsIFwiJHFcIiwgXCIkc2NlXCIsIEF1dGguQXV0aFNlcnZpY2Uuc2VydmljZUlkXTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaHR0cCBzZXJ2aWNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwcm9taXNlIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgJHE6IG5nLklRU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHByb21pc2Ugc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJpdmF0ZSAkc2NlOiBuZy5JU0NFU2VydmljZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXV0aFNlcnZpY2UgcmVmZXJlbmNlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgRGF0YVNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlLCAkc2NlOiBuZy5JU0NFU2VydmljZSwgYXV0aFNlcnZpY2U6IEF1dGguQXV0aFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAgPSAkaHR0cDtcbiAgICAgICAgICAgIHRoaXMuJHEgPSAkcTtcbiAgICAgICAgICAgIHRoaXMuJHNjZSA9ICRzY2U7XG4gICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2VcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmVhdHMgdGhlIGdpdmVuIGNvbXBldGl0aW9uIGRhdGFcbiAgICAgICAgICogQHBhcmFtIGNvbXAgdG8gdHJlYXRcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgdHJlYXRDb21wID0gKGNvbXA6IFJhbmtJdC5JQ29tcGV0aXRpb24pID0+IHtcbiAgICAgICAgICAgIC8vIE1ha2VzIFVybHMgdHJ1c3RlZFxuICAgICAgICAgICAgaWYgKGNvbXAuaGFzT3duUHJvcGVydHkoXCJzdHJlYW1VUkxcIikpe1xuICAgICAgICAgICAgICAgIGNvbXAuc3RyZWFtVVJMID0gdGhpcy4kc2NlLnRydXN0QXNSZXNvdXJjZVVybChjb21wLnN0cmVhbVVSTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgbGlzdCBvZiBjb21wZXRpdGlvbnMgZm9yIHRoZSBjdXJyZW50IHVzZXIsIG9ubHkgcHVibGljIGNvbXBldGl0aW9ucyBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpblxuICAgICAgICAgKiBAcmV0dXJucyB7SVByb21pc2U8UmFua0l0LklDb21wZXRpdGlvbltdPn1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRBbGxDb21wcyA9ICgpOm5nLklQcm9taXNlPFJhbmtJdC5JQ29tcGV0aXRpb25bXT4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiL2FwaS9jb21wZXRpdGlvbnNcIikuc3VjY2VzcygoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9TdWNjZXNzXG5cbiAgICAgICAgICAgICAgICAvLyBUcmVhdHMgYWxsIGNvbXBldGl0aW9uIGRhdGFcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IGRhdGEuY29tcGV0aXRpb25zLmxlbmd0aCA7IGkgKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVhdENvbXAoZGF0YS5jb21wZXRpdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhLmNvbXBldGl0aW9ucyk7XG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbHVyZVxuXG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcblxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDb21wID0gKGlkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUNvbXBldGl0aW9uPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcblxuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCIvYXBpL2NvbXBldGl0aW9ucy9cIitpZCkuc3VjY2VzcygoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVhdENvbXAoZGF0YSk7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFN0YWdlID0gKHN0YWdlSWQpOm5nLklQcm9taXNlPFJhbmtJdC5JU3RhZ2U+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCIvYXBpL3N0YWdlcy9cIitzdGFnZUlkKS5zdWNjZXNzKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRFdmVudCA9IChldmVudElkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUV2ZW50PiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiL2FwaS9ldmVudHMvXCIrZXZlbnRJZCkuc3VjY2VzcygoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6IGFueSwgc3RhdHVzOiBudW1iZXIsIGhlYWRlcnM6IG5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOiBuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY3JlYXRlQ29tcGV0aXRpb24gPSAoY29tcDogUmFua0l0LklDb21wZXRpdGlvbik6bmcuSVByb21pc2U8UmFua0l0LklDb21wZXRpdGlvbj4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL2NvbXBldGl0aW9uc1wiLGNvbXApLnN1Y2Nlc3MoKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24sIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcblxuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjcmVhdGVTdGFnZSA9IChjb21wSWQsc3RhZ2U6IFJhbmtJdC5JU3RhZ2UpOm5nLklQcm9taXNlPFJhbmtJdC5JU3RhZ2U+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5wb3N0KFwiL2FwaS9jb21wZXRpdGlvbnMvXCIrY29tcElkK1wiL3N0YWdlc1wiLHN0YWdlKS5zdWNjZXNzKChkYXRhOiBSYW5rSXQuSVN0YWdlLCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBjcmVhdGVFdmVudCA9IChzdGFnZUlkLCBldmVudDogUmFua0l0LklFdmVudCk6bmcuSVByb21pc2U8UmFua0l0LklFdmVudD4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnBvc3QoXCIvYXBpL3N0YWdlcy9cIitzdGFnZUlkK1wiL2V2ZW50c1wiLGV2ZW50KS5zdWNjZXNzKChkYXRhOiBSYW5rSXQuSUV2ZW50LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KS5lcnJvcigoZGF0YTogYW55LCBzdGF0dXM6IG51bWJlciwgaGVhZGVyczogbmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6IG5nLklSZXF1ZXN0Q29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBlZGl0Q29tcGV0aXRpb24gPSAoY29tcElkLCBjb21wOiBSYW5rSXQuSUNvbXBldGl0aW9uKTpuZy5JUHJvbWlzZTxSYW5rSXQuSUNvbXBldGl0aW9uPiA9PiB7XG4gICAgICAgICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIHRoaXMuJGh0dHAucHV0KFwiL2FwaS9jb21wZXRpdGlvbnMvXCIrY29tcElkLGNvbXApLnN1Y2Nlc3MoKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24sIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGVkaXRTdGFnZSA9IChzdGFnZUlkLCBzdGFnZTogUmFua0l0LklTdGFnZSk6bmcuSVByb21pc2U8UmFua0l0LklTdGFnZT4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnB1dChcIi9hcGkvc3RhZ2VzL1wiK3N0YWdlSWQsc3RhZ2UpLnN1Y2Nlc3MoKGRhdGE6IFJhbmtJdC5JU3RhZ2UsIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGVkaXRFdmVudCA9IChldmVudElkLCBldmVudDogUmFua0l0LklFdmVudCk6bmcuSVByb21pc2U8UmFua0l0LklFdmVudD4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLnB1dChcIi9hcGkvZXZlbnRzL1wiK2V2ZW50SWQsZXZlbnQpLnN1Y2Nlc3MoKGRhdGE6IFJhbmtJdC5JRXZlbnQsIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOiBhbnksIHN0YXR1czogbnVtYmVyLCBoZWFkZXJzOiBuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzogbmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldENvbXBTdGFnZXMgPSAoY29tcElkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSVN0YWdlW10+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCJhcGkvY29tcGV0aXRpb25zL1wiK2NvbXBJZCtcIi9zdGFnZXNcIikuc3VjY2VzcygoZGF0YTphbnksIHN0YXR1czpudW1iZXIsIGhlYWRlcnM6bmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6bmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YS5zdGFnZXMpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6YW55LCBzdGF0dXM6bnVtYmVyLCBoZWFkZXJzOm5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOm5nLklSZXF1ZXN0Q29uZmlnKSA9PntcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFN0YWdlRXZlbnRzID0gKHN0YWdlSWQpOm5nLklQcm9taXNlPFJhbmtJdC5JRXZlbnRbXT4gPT4ge1xuICAgICAgICAgICAgdmFyIGRlZmVyZWQgPSB0aGlzLiRxLmRlZmVyKCk7XG4gICAgICAgICAgICB0aGlzLiRodHRwLmdldChcImFwaS9zdGFnZXMvXCIrc3RhZ2VJZCtcIi9ldmVudHNcIikuc3VjY2VzcygoZGF0YTphbnksIHN0YXR1czpudW1iZXIsIGhlYWRlcnM6bmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6bmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YS5ldmVudHMpO1xuICAgICAgICAgICAgfSkuZXJyb3IoKGRhdGE6YW55LCBzdGF0dXM6bnVtYmVyLCBoZWFkZXJzOm5nLklIdHRwSGVhZGVyc0dldHRlciwgY29uZmlnOm5nLklSZXF1ZXN0Q29uZmlnKSA9PntcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFVzZXIgPSAodXNlcklkKTpuZy5JUHJvbWlzZTxSYW5rSXQuSVVzZXI+ID0+IHtcbiAgICAgICAgICAgIHZhciBkZWZlcmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICAgICAgdGhpcy4kaHR0cC5nZXQoXCJhcGkvdXNlcnMvXCIrdXNlcklkKS5zdWNjZXNzKChkYXRhOmFueSwgc3RhdHVzOm51bWJlciwgaGVhZGVyczpuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzpuZy5JUmVxdWVzdENvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKChkYXRhOmFueSwgc3RhdHVzOm51bWJlciwgaGVhZGVyczpuZy5JSHR0cEhlYWRlcnNHZXR0ZXIsIGNvbmZpZzpuZy5JUmVxdWVzdENvbmZpZykgPT57XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHB1YmxpYyBnZXRVc2VyT2JqZWN0ID0gKHVzZXJJZCk6bmcuSVByb21pc2U8UmFua0l0LklVc2VyPiA9PiB7XG4gICAgICAgIC8vICAgICB2YXIgZGVmZXJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgLy8gICAgIHRoaXMuJGh0dHAuZ2V0KFwiYXBpL3VzZXJzL1wiK3VzZXJJZCkuc3VjY2VzcygoZGF0YTphbnksIHN0YXR1czpudW1iZXIsIGhlYWRlcnM6bmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6bmcuSVJlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgLy8gICAgICAgICBkZWZlcmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgIC8vICAgICB9KS5lcnJvcigoZGF0YTphbnksIHN0YXR1czpudW1iZXIsIGhlYWRlcnM6bmcuSUh0dHBIZWFkZXJzR2V0dGVyLCBjb25maWc6bmcuSVJlcXVlc3RDb25maWcpID0+e1xuXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBwdWJsaWMgY2xpZW50TG9naW4gPSAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6bmcuSVByb21pc2U8UmFua0l0LklSZXNwb25zZT4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZpY2UubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGNsaWVudFJlZ2lzdGVyID0gKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGZpcnN0TmFtZTogc3RyaW5nLCBsYXN0TmFtZTogc3RyaW5nKTpuZy5JUHJvbWlzZTxSYW5rSXQuSVJlc3BvbnNlPiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmljZS5yZWdpc3Rlcih1c2VybmFtZSwgcGFzc3dvcmQsIGZpcnN0TmFtZSwgbGFzdE5hbWUpXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgY2xpZW50TG9nb3V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRBdXRoRGF0YSA9ICgpOlJhbmtJdC5JVXNlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmljZS5nZXRBdXRoRGF0YSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5ndWxhciBhbmQgc2VydmljZSByZWdpc3RyYXRpb25cbiAgICAgKi9cbiAgICBhbmd1bGFyLm1vZHVsZShEYXRhU2VydmljZS5tb2R1bGVJZCwgW10pXG4gICAgICAgIC5zZXJ2aWNlKERhdGFTZXJ2aWNlLnNlcnZpY2VJZCwgRGF0YVNlcnZpY2UpXG5cblxuXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFHbG9iYWxzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGFTZXJ2aWNlLnRzXCIvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbm1vZHVsZSBBcHAuRGF0YSB7XG5cbiAgICAvLyBNYWtlcyBBcHAuQXV0aCBtb2R1bGVcbiAgICBhbmd1bGFyLm1vZHVsZShEYXRhLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRGF0YSkpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5TaGVsbCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuU2hlbGxcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiU2hlbGwvXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsR2xvYmFscy50c1wiIC8+XG5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5TaGVsbCB7XG5cbiAgICBpbnRlcmZhY2UgSVNoZWxsQ29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZTtcbiAgICAgICAgZGF0YVNlcnZpY2U6IERhdGEuRGF0YVNlcnZpY2U7XG4gICAgICAgIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBTaGVsbENvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJOYW1lID0gXCJTaGVsbENvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IFNoZWxsLm1vZHVsZUlkICsgXCIuXCIgKyBTaGVsbENvbnRyb2xsZXIuY29udHJvbGxlck5hbWU7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLCBOYXYuTmF2U2VydmljZS5zZXJ2aWNlSWQsIERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkLCBBdXRoLkF1dGhTZXJ2aWNlLnNlcnZpY2VJZF07XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSVNoZWxsQ29udHJvbGxlclNoZWxsLCBuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSwgZGF0YVNlcnZpY2U6IERhdGEuRGF0YVNlcnZpY2UsIGF1dGhTZXJ2aWNlOiBBdXRoLkF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICAgICAkc2NvcGUubmF2U2VydmljZT1uYXZTZXJ2aWNlO1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFTZXJ2aWNlPWRhdGFTZXJ2aWNlO1xuICAgICAgICAgICAgJHNjb3BlLmF1dGhTZXJ2aWNlPWF1dGhTZXJ2aWNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoU2hlbGxDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWQsIEF1dGguQXV0aFNlcnZpY2UubW9kdWxlSWQsIERhdGEuRGF0YVNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihTaGVsbENvbnRyb2xsZXIuY29udHJvbGxlck5hbWUsIFNoZWxsQ29udHJvbGxlcik7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlNoZWxsR2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2hlbGxDb250cm9sbGVyLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xubW9kdWxlIEFwcC5TaGVsbCB7XG4gICAgYW5ndWxhci5tb2R1bGUoU2hlbGwubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhTaGVsbCkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQXBwR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEFwcC5tb2R1bGVJZCArIFwiLkhvbWVcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiSG9tZS9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImhvbWVcIlxufSIsIi8qKlxuICogSG9tZSBQYWdlXG4gKiBBbmRyZXcgV2VsdG9uLCBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWVHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuSG9tZSB7XG5cbiAgICBpbnRlcmZhY2UgSUhvbWVDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGNvbXBldGl0aW9uczpSYW5rSXQuSUNvbXBldGl0aW9uW107XG4gICAgICAgIHN1YmplY3RzOnsgW3N1YmplY3Q6IHN0cmluZ106IHtuYW1lOiBzdHJpbmc7IGNoZWNrZWQ6IGJvb2xlYW59OyB9O1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBIb21lQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJIb21lQ29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gSG9tZS5tb2R1bGVJZCArIFwiLlwiICsgSG9tZUNvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkXTtcbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSUhvbWVDb250cm9sbGVyU2hlbGwsIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbnM9W107XG4gICAgICAgICAgICAkc2NvcGUuc3ViamVjdHM9e307XG4gICAgICAgICAgICBkYXRhU2VydmljZS5nZXRBbGxDb21wcygpLnRoZW4oKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb25bXSkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIC8vR2V0IGEgbGlzdCBvZiBhbGwgc3ViamVjdHMgZm9yIHRoZSBjaGVja2JveGVzIGluIHRoZSBzaWRlYmFyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxkYXRhLmxlbmd0aDtpKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZigkc2NvcGUuc3ViamVjdHNbZGF0YVtpXS5zdWJqZWN0XT09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1YmplY3RzW2RhdGFbaV0uc3ViamVjdF0gPSB7bmFtZTogZGF0YVtpXS5zdWJqZWN0LCBjaGVja2VkOiB0cnVlfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIChmYWlsdXJlOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShIb21lQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoSG9tZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLCBIb21lQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShIb21lLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEhvbWUuYmFzZVVybCsnaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBIb21lQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9ob21lXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuICAgICAgICAuY29uZmlnKFtcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCAoJHVybFJvdXRlclByb3ZpZGVyOiBuZy51aS5JVXJsUm91dGVyUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvaG9tZVwiKVxuICAgICAgICB9XSlcbiAgICAgICAgLnJ1bihbTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBmdW5jdGlvbiAobmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UpIHtcbiAgICAgICAgICAgIG5hdlNlcnZpY2UuYWRkSXRlbSh7c3RhdGU6SG9tZS5zdGF0ZSwgbmFtZTogXCJIb21lXCIsIG9yZGVyOiAwfSk7XG5cbiAgICAgICAgfV0pXG4gICAgICAgIC8vRmlsdGVyIG91dCB0aGUgdW5jaGVja2VkIGJveGVzIGZvciBzdWJqZWN0c1xuICAgICAgICAuZmlsdGVyKCdob21lRmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQ6IFJhbmtJdC5JQ29tcGV0aXRpb25bXSxvcHRpb25zOiB7IFtzdWJqZWN0OiBzdHJpbmddOiB7bmFtZTogc3RyaW5nOyBjaGVja2VkOiBib29sZWFufTsgfSkge1xuICAgICAgICAgICAgICAgIHZhciBvdXRwdXQ6IFJhbmtJdC5JQ29tcGV0aXRpb25bXSA9IFtdXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zW2lucHV0W2ldLnN1YmplY3RdLmNoZWNrZWQ9PXRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goaW5wdXRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkhvbWVHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJIb21lQ29udHJvbGxlci50c1wiIC8+XG5tb2R1bGUgQXBwLkhvbWUge1xuICAgIGFuZ3VsYXIubW9kdWxlKEhvbWUubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhIb21lKSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgVGltb3RoeSBFbmdlbFxuICovXG5tb2R1bGUgQXBwLkxvZ2luIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5Mb2dpblwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJMb2dpbi9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcIkxvZ2luXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luR2xvYmFscy50c1wiIC8+XG5cbi8qXG5cdENvbnRyb2xzIHRoZSBsb2dpbiBhbmQgcmVnaXN0ZXIgZnVuY3Rpb25hbGl0eVxuXHRAYXV0aG9yXHRUaW1vdGh5IEVuZ2VsXG4qL1xubW9kdWxlIEFwcC5Mb2dpbiB7XG5cbiAgICBpbnRlcmZhY2UgSUxvZ2luRXJyb3JSZXNwb25zZSB7XG5cbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgSUxvZ2luQ29udHJvbGxlciBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xuICAgICAgICBsb2dpbjogKGRhdGE6IGFueSkgPT4gdm9pZDtcbiAgICAgICAgcmVnaXN0ZXI6IChkYXRhOiBhbnkpID0+IHZvaWQ7XG4gICAgICAgIGxvZ2luTW9kZTogYm9vbGVhbjtcbiAgICAgICAgaW5mbzoge1xuICAgICAgICAgICAgZmlyc3ROYW1lOiBzdHJpbmdcbiAgICAgICAgICAgIGxhc3ROYW1lOiBzdHJpbmdcbiAgICAgICAgICAgIGVtYWlsOiBzdHJpbmdcbiAgICAgICAgICAgIHBhc3N3b3JkOiBzdHJpbmdcbiAgICAgICAgICAgIHBhc3N3b3JkMjogc3RyaW5nXG4gICAgICAgIH07XG5cbiAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGJvb2xlYW5cbiAgICAgICAgICAgIHRpdGxlOiBzdHJpbmdcbiAgICAgICAgICAgIHN0YXRlOiBzdHJpbmdcbiAgICAgICAgICAgIGhhbmRsZXI6IChzZWxmOiBhbnkpID0+IHZvaWRcbiAgICAgICAgICAgIGh0bWw6IHN0cmluZ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIExvZ2luQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJMb2dpbkNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IExvZ2luLm1vZHVsZUlkICsgXCIuXCIgKyBMb2dpbkNvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuXG4gICAgICAgIHByaXZhdGUgZGF0YVNlcnZpY2U6IERhdGEuRGF0YVNlcnZpY2U7XG4gICAgICAgIHByaXZhdGUgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlO1xuICAgICAgICBwcml2YXRlIGluZm8gPSB7XG4gICAgICAgICAgICBmaXJzdE5hbWU6IFwiXCIsXG4gICAgICAgICAgICBsYXN0TmFtZTogXCJcIixcbiAgICAgICAgICAgIGVtYWlsOiBcIlwiLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgICAgICBwYXNzd29yZDI6IFwiXCJcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGVycm9yID0ge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICB0aXRsZTogXCJFcnJvciFcIixcbiAgICAgICAgICAgIHN0YXRlOiBcIlwiLFxuICAgICAgICAgICAgaGFuZGxlcjogKHNlbGYpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmKVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuc3RhdGUgPT0gXCJCQURfTE9HSU5cIil7XG5cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmxvZ2luTW9kZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZW5hYmxlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGh0bWw6IFwiXCJcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGxvZ2luTW9kZSA9IHRydWU7XG4gICAgICAgIHByaXZhdGUgc2NvcGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSUxvZ2luQ29udHJvbGxlciwgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlLCBkYXRhU2VydmljZTogRGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZSA9IGRhdGFTZXJ2aWNlO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICAkc2NvcGUubG9naW5Nb2RlID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50LnVybCA9PSAnL3JlZ2lzdGVyJylcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9naW5Nb2RlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuc2NvcGUgPSAkc2NvcGVcblxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luID0gdGhpcy5sb2dpblxuICAgICAgICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gdGhpcy5yZWdpc3RlclxuXG4gICAgICAgICAgICAkc2NvcGUuaW5mbyA9IHRoaXMuaW5mb1xuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHRoaXMuZXJyb3JcblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2dpbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zY29wZS5sb2dpbk1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlLmxvZ2luTW9kZSA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVuYWJsZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNsaWVudExvZ2luKHRoaXMuc2NvcGUuaW5mby5lbWFpbCx0aGlzLnNjb3BlLmluZm8ucGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWNlc3NcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oSG9tZS5zdGF0ZSk7XG4gICAgICAgICAgICAgICAgfSwgKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLnRpdGxlID0gJ0Vycm9yISdcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmh0bWwgPSAnSW52YWxpZCB1c2VybmFtZSBvciBwYXNzd29yZC4gSWYgeW91IGRvIG5vdCBoYXZlIGFuIGFjY291bnQsIFxcXG4gICAgICAgICAgICAgICAgICAgICAgICBtYWtlIHN1cmUgeW91IDxhIGNsYXNzPVwiYWxlcnQtbGlua1wiIG5nLWNsaWNrPVwibXNnLmhhbmRsZXIobXNnKTtcIj5yZWdpc3RlcjwvYT4nXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3Iuc3RhdGUgPSBcIkJBRF9MT0dJTlwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVuYWJsZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJpdmF0ZSByZWdpc3RlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjb3BlLmxvZ2luTW9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubG9naW5Nb2RlID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVuYWJsZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNsaWVudFJlZ2lzdGVyKHRoaXMuc2NvcGUuaW5mby5lbWFpbCwgdGhpcy5zY29wZS5pbmZvLnBhc3N3b3JkLCB0aGlzLnNjb3BlLmluZm8uZmlyc3ROYW1lLCB0aGlzLnNjb3BlLmluZm8ubGFzdE5hbWUpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWNlc3NcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5jbGllbnRMb2dpbih0aGlzLnNjb3BlLmluZm8uZW1haWwsdGhpcy5zY29wZS5pbmZvLnBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Vzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKEhvbWUuc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcGUubG9naW5Nb2RlID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudGl0bGUgPSAnRXJyb3IhJ1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5odG1sID0gJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBjb250YWN0IGFuIGFkbWluaXN0cmF0b3InXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5zdGF0ZSA9IFwiQkFEX0xPR0lOXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgKHJlc3BvbnNlIDogUmFua0l0LklSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmh0bWwgPSByZXNwb25zZS5tc2dcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvci5lbmFibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIGFuZ3VsYXIubW9kdWxlKExvZ2luQ29udHJvbGxlci5tb2R1bGVJZCwgW05hdi5OYXZTZXJ2aWNlLm1vZHVsZUlkXSkuXG4gICAgICAgIGNvbnRyb2xsZXIoTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZCwgTG9naW5Db250cm9sbGVyKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsICgkcm91dGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLnN0YXRlKExvZ2luLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IExvZ2luLmJhc2VVcmwrJ2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IExvZ2luQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiXG4gICAgICAgICAgICB9KS5zdGF0ZShcInJlZ2lzdGVyXCIsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogTG9naW4uYmFzZVVybCsnbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogTG9naW5Db250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3JlZ2lzdGVyXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiTG9naW5HbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJMb2dpbkNvbnRyb2xsZXIudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgVGltb3RoeSBFbmdlbFxuICovXG5tb2R1bGUgQXBwLkxvZ2luIHtcbiAgICBhbmd1bGFyLm1vZHVsZShMb2dpbi5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKExvZ2luKSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxuLyoqXG4gKiBAYXV0aG9yIFRpbW90aHkgRW5nZWxcbiAqL1xubW9kdWxlIEFwcC5Qcm9maWxlIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBBcHAubW9kdWxlSWQgKyBcIi5Qcm9maWxlXCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gQXBwLmJhc2VVcmwgKyBcIlByb2ZpbGUvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJQcm9maWxlXCI7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlByb2ZpbGVHbG9iYWxzLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIFRpbW90aHkgRW5nZWxcbiAqL1xubW9kdWxlIEFwcC5Qcm9maWxlIHtcblxuICAgIGludGVyZmFjZSBJUHJvZmlsZUNvbnRyb2xsZXIgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIHVzZXI6IFJhbmtJdC5JVXNlcjtcbiAgICAgICAgdXNlcklkOiBudW1iZXI7XG4gICAgICAgIGV4dHJhczogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUHJvZmlsZUNvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiUHJvZmlsZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IFByb2ZpbGUubW9kdWxlSWQgKyBcIi5cIiArIFByb2ZpbGVDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkXTtcblxuICAgICAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBEYXRhLkRhdGFTZXJ2aWNlO1xuICAgICAgICBwcml2YXRlICRzdGF0ZTogbmcudWkuSVN0YXRlU2VydmljZTtcbiAgICAgICAgcHJpdmF0ZSAkc2NvcGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCRzY29wZTogSVByb2ZpbGVDb250cm9sbGVyLCAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2UsICRzdGF0ZVBhcmFtczogbmcudWkuSVN0YXRlUGFyYW1zU2VydmljZSwgZGF0YVNlcnZpY2U6IERhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNlcnZpY2UgPSBkYXRhU2VydmljZTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICAkc2NvcGUudXNlcklkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zWyd1c2VySWQnXSlcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gJHN0YXRlUGFyYW1zWyd1c2VyJ107XG5cbiAgICAgICAgICAgIGlmICghJHNjb3BlLnVzZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXR0aW5nIHVzZXInKVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0VXNlcigkc2NvcGUudXNlcklkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJHN0YXRlUGFyYW1zKVxuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlmT3duUHJvZmlsZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHVwZGF0ZUlmT3duUHJvZmlsZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy4kc2NvcGUudXNlcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVNlcnZpY2UuZ2V0QXV0aERhdGEoKS51c2VySWQgPT0gdGhpcy4kc2NvcGUudXNlci51c2VySWQpe1xuICAgICAgICAgICAgICAgIHRoaXMuJHNjb3BlLmV4dHJhcyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuJHNjb3BlLmV4dHJhcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuXG4gICAgICAgIHByaXZhdGUgZ2V0VXNlciA9ICh1c2VySWQ6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5nZXRVc2VyKHVzZXJJZClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UgOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2NvcGUudXNlciA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzY29wZS51c2VySWQgPSB1c2VySWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJZk93blByb2ZpbGUoKTtcblxuICAgICAgICAgICAgICAgIH0sIChyZXNwb25zZSA6IFJhbmtJdC5JVXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCB0byBnZXQgdXNlciBieSBJZDogXCIgKyB1c2VySWQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKFByb2ZpbGVDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihQcm9maWxlQ29udHJvbGxlci5jb250cm9sbGVySWQsIFByb2ZpbGVDb250cm9sbGVyKVxuICAgICAgICAuY29uZmlnKFtcIiRzdGF0ZVByb3ZpZGVyXCIsICgkcm91dGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLnN0YXRlKFByb2ZpbGUuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogUHJvZmlsZS5iYXNlVXJsKydwcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFByb2ZpbGVDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2ZpbGUve3VzZXJJZH1cIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1dKTtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiUHJvZmlsZUdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlByb2ZpbGVDb250cm9sbGVyLnRzXCIgLz5cbi8qKlxuICogQGF1dGhvciBUaW1vdGh5IEVuZ2VsXG4gKi9cbm1vZHVsZSBBcHAuUHJvZmlsZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoUHJvZmlsZS5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKFByb2ZpbGUpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5FdmVudCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuRXZlbnRcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiRXZlbnQvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJFdmVudFwiXG59IiwiLyoqXG4gKiBWaWV3IEV2ZW50IENvbnRyb2xsZXJcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50IHtcblxuICAgIGludGVyZmFjZSBJRXZlbnRDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGV2ZW50OlJhbmtJdC5JRXZlbnQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50Q29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJFdmVudENvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IEV2ZW50Lm1vZHVsZUlkICsgXCIuXCIgKyBFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUV2ZW50Q29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UgLCRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtc1snZXZlbnQnXSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50PSRzdGF0ZVBhcmFtc1snZXZlbnQnXTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRhdGFTZXJ2aWNlLmdldEV2ZW50KCRzdGF0ZVBhcmFtc1snZXZlbnRJZCddKS50aGVuKChkYXRhOiBSYW5rSXQuSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ldmVudCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShFdmVudENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKEV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQsIEV2ZW50Q29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShFdmVudC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBFdmVudC5iYXNlVXJsKydldmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnQve2V2ZW50SWR9XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOnsnZXZlbnQnOm51bGx9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG4gICAgICAgIC8qLnJ1bihbTmF2Lk5hdlNlcnZpY2Uuc2VydmljZUlkLCBmdW5jdGlvbiAobmF2U2VydmljZTogTmF2Lk5hdlNlcnZpY2UpIHtcbiAgICAgICAgICAgIG5hdlNlcnZpY2UuYWRkSXRlbSh7c3RhdGU6Q3JlYXRlQ29tcC5zdGF0ZSwgbmFtZTogXCJDcmVhdGUgQ29tcGV0aXRpb25cIiwgb3JkZXI6IDB9KTtcblxuICAgICAgICB9XSk7Ki9cbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0V2ZW50R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50LkNyZWF0ZSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gRXZlbnQubW9kdWxlSWQgKyBcIi5DcmVhdGVFdmVudFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEV2ZW50LmJhc2VVcmwgKyBcIkNyZWF0ZS9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImNyZWF0ZUV2ZW50XCJcbn0iLCIvKipcbiAqIENyZWF0ZSBFdmVudCBDb250cm9sbGVyXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVFdmVudEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5FdmVudC5DcmVhdGUge1xuXG4gICAgaW50ZXJmYWNlIElDcmVhdGVFdmVudENvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgc3RhZ2U6IGFueTtcbiAgICAgICAgZXZlbnQ6IGFueTtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBDcmVhdGVFdmVudENvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiQ3JlYXRlRXZlbnRDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBFdmVudC5tb2R1bGVJZCArIFwiLlwiICsgQ3JlYXRlRXZlbnRDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElDcmVhdGVFdmVudENvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlLCRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLnN0YWdlPSRzdGF0ZVBhcmFtc1snc3RhZ2UnXTtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXQgPSB0aGlzLnN1Ym1pdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNyZWF0ZUV2ZW50KHRoaXMuJHNjb3BlLnN0YWdlLnN0YWdlSWQsdGhpcy4kc2NvcGUuZXZlbnQpLnRoZW4oKGRhdGE6IFJhbmtJdC5JRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhFdmVudC5zdGF0ZSx7ZXZlbnRJZDogZGF0YS5ldmVudElkLGNvbXA6ZGF0YX0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ3JlYXRlRXZlbnRDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihDcmVhdGVFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkLCBDcmVhdGVFdmVudENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoQ3JlYXRlLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENyZWF0ZS5iYXNlVXJsKydjcmVhdGVFdmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBDcmVhdGVFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnQvY3JlYXRlXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOnsnc3RhZ2UnOnVuZGVmaW5lZH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZUV2ZW50R2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlRXZlbnRDb250cm9sbGVyLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQuQ3JlYXRlIHtcbiAgICBhbmd1bGFyLm1vZHVsZShDcmVhdGUubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhDcmVhdGUpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0V2ZW50R2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkV2ZW50LkVkaXQge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IEV2ZW50Lm1vZHVsZUlkICsgXCIuRWRpdEV2ZW50XCI7XG4gICAgZXhwb3J0IHZhciBiYXNlVXJsID0gRXZlbnQuYmFzZVVybCArIFwiRWRpdC9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImVkaXRFdmVudFwiXG59IiwiLyoqXG4gKiBFZGl0IEV2ZW50IENvbnRyb2xsZXJcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRFdmVudEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5FdmVudC5FZGl0IHtcblxuICAgIGludGVyZmFjZSBJRWRpdEV2ZW50Q29udHJvbGxlclNoZWxsIGV4dGVuZHMgbmcuSVNjb3Ble1xuICAgICAgICBldmVudDogUmFua0l0LklFdmVudDtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgICAgICBzdGF0ZXM6c3RyaW5nW107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEVkaXRFdmVudENvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiRWRpdEV2ZW50Q29udHJvbGxlclwiO1xuICAgICAgICBwdWJsaWMgc3RhdGljIG1vZHVsZUlkID0gRWRpdC5tb2R1bGVJZCArIFwiLlwiICsgRWRpdEV2ZW50Q29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsXCIkc3RhdGVcIixcIiRzdGF0ZVBhcmFtc1wiLERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgJHNjb3BlOiBJRWRpdEV2ZW50Q29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UsICRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXQgPSB0aGlzLnN1Ym1pdDtcbiAgICAgICAgICAgICRzY29wZS5zdGF0ZXM9UmFua0l0LnN0YXRlO1xuICAgICAgICAgICAgaWYoJHN0YXRlUGFyYW1zWydldmVudCddKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnQ9JHN0YXRlUGFyYW1zWydldmVudCddO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0RXZlbnQoJHN0YXRlUGFyYW1zWydldmVudElkJ10pLnRoZW4oKGRhdGE6IFJhbmtJdC5JRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50ID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9LCAoZmFpbHVyZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmVkaXRFdmVudCh0aGlzLiRzY29wZS5ldmVudC5ldmVudElkLHRoaXMuJHNjb3BlLmV2ZW50KS50aGVuKChkYXRhOiBSYW5rSXQuSUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oRXZlbnQuc3RhdGUse2V2ZW50SWQ6IGRhdGEuZXZlbnRJZCxldmVudDpkYXRhfSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShFZGl0RXZlbnRDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihFZGl0RXZlbnRDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgRWRpdEV2ZW50Q29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShFZGl0LnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEVkaXQuYmFzZVVybCsnZWRpdEV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IEVkaXRFdmVudENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvZXZlbnQvZWRpdC97ZXZlbnRJZH1cIixcbiAgICAgICAgICAgICAgICBwYXJhbXM6e2V2ZW50Om51bGx9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0RXZlbnRHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0RXZlbnRDb250cm9sbGVyLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQuRWRpdCB7XG4gICAgYW5ndWxhci5tb2R1bGUoRWRpdC5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKEVkaXQpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV2ZW50R2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXZlbnRDb250cm9sbGVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGUvQ3JlYXRlRXZlbnRNb2R1bGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXQvRWRpdEV2ZW50TW9kdWxlLnRzXCIgLz5cbm1vZHVsZSBBcHAuRXZlbnQge1xuICAgIGFuZ3VsYXIubW9kdWxlKEV2ZW50Lm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRXZlbnQpKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0FwcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZSB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuU3RhZ2VcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBBcHAuYmFzZVVybCArIFwiU3RhZ2UvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJTdGFnZVwiXG59IiwiLyoqXG4gKiBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL1N0YWdlR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkZpbGxlciB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gU3RhZ2UubW9kdWxlSWQgKyBcIi5GaWxsZXJcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBTdGFnZS5iYXNlVXJsICsgXCJGaWxsZXIvXCI7XG59IiwiLyoqXG4gKiBFZGl0IENvbXBldGl0aW9uIFBhZ2VcbiAqIEphc29uIE1jVGFnZ2FydFxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRmlsbGVyR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkZpbGxlciB7XG5cbiAgICBleHBvcnQgY2xhc3MgRmlsbGVyRmFjdG9yeSB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBmYWN0b3J5SWQgPSBcIlN0YWdlRmlsbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBGaWxsZXIubW9kdWxlSWQgKyBGaWxsZXJGYWN0b3J5LmZhY3RvcnlJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtJZC5JZFNlcnZpY2Uuc2VydmljZUlkXTtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRnZXQgPSAoaWRTZXJ2aWNlOiBJZC5JZFNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgIHZhciBmYWMgPSBuZXcgRmlsbGVyRmFjdG9yeShpZFNlcnZpY2UpXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZpbGw6IGZhYy5maWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBpZFNlcnZpY2U6IElkLklkU2VydmljZSkge1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlcyBzZWVkLCBldmVudHMgYW5zIGV2ZW50cyBzZWVkXG4gICAgICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAgICAgKiBAcGFyYW0gcGFydGljaXBhbnRzXG4gICAgICAgICAqIEBwYXJhbSBwYXJ0aWNpcGFudHNQZXJFdmVudFxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGZpbGwgPSAoc3RhZ2U6IFJhbmtJdC5JU3RhZ2UsIHBhcnRpY2lwYW50czogbnVtYmVyLCBwYXJ0aWNpcGFudHNQZXJFdmVudD86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgaWYocGFydGljaXBhbnRzUGVyRXZlbnQ8Mikge1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50c1BlckV2ZW50ID0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFzdGFnZS5ldmVudHMpIHN0YWdlLmV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgc3RhZ2Uuc2VlZCA9IFtdO1xuXG5cbiAgICAgICAgICAgIHZhciBudW1FdmVudHMgPSBwYXJ0aWNpcGFudHMvcGFydGljaXBhbnRzUGVyRXZlbnQ7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IG51bUV2ZW50cyA7IGkgKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXN0YWdlLmV2ZW50c1tpXSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWdlLmV2ZW50c1tpXSA9ICg8YW55PntuYW1lOlwiRXZlbnQgXCIraSxzdGF0ZTpcIlVwY29taW5nXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2UuZXZlbnRzW2ldLmV2ZW50SWQ9dGhpcy5pZFNlcnZpY2UuZ2V0SWQoKVxuICAgICAgICAgICAgICAgICAgICBzdGFnZS5ldmVudHNbaV0uc3RhZ2VJZCA9IHN0YWdlLnN0YWdlSWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzZWVkcyA9IHRoaXMuZmlsbEV2ZW50KHN0YWdlLmV2ZW50c1tpXSxwYXJ0aWNpcGFudHNQZXJFdmVudCxwYXJ0aWNpcGFudHMsaSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2VlZCBpbiBzZWVkcylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YWdlLnNlZWQuaW5kZXhPZihzZWVkc1tzZWVkXSkgPCAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlLnNlZWQucHVzaChzZWVkc1tzZWVkXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YWdlLnNlZWQuc29ydCgoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+ICB4LXkpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlcyB0aGUgc2VlZHMgZm9yIHRoZSBnaXZlbiBldmVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICogQHBhcmFtIHBhcnRpY2lwYW50c1xuICAgICAgICAgKiBAcGFyYW0gcGFydGljaXBhbnRzSW5TdGFnZVxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRQb3NpdGlvblxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IHRoZSBzZWVkIGFycmF5XG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGZpbGxFdmVudCA9IChldmVudDogUmFua0l0LklFdmVudCwgcGFydGljaXBhbnRzOiBudW1iZXIsIHBhcnRpY2lwYW50c0luU3RhZ2U6IG51bWJlciwgZXZlbnRQb3NpdGlvbjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICB2YXIgc2VlZDogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIHZhciBudW1FdmVudHMgPSBwYXJ0aWNpcGFudHNJblN0YWdlL3BhcnRpY2lwYW50cztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwIDsgaSA8IHBhcnRpY2lwYW50czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvQWRkID0gbnVtRXZlbnRzKmlcbiAgICAgICAgICAgICAgICBpZihpICUgMiA9PSAwKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdG9BZGQrPWV2ZW50UG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIHRvQWRkICsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0b0FkZCs9bnVtRXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICB0b0FkZC09ZXZlbnRQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VlZC5wdXNoKHRvQWRkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnNlZWQ9c2VlZDtcblxuICAgICAgICAgICAgcmV0dXJuIHNlZWQ7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoRmlsbGVyRmFjdG9yeS5tb2R1bGVJZCwgW10pLlxuICAgICAgICBmYWN0b3J5KEZpbGxlckZhY3RvcnkuZmFjdG9yeUlkLCBbSWQuSWRTZXJ2aWNlLnNlcnZpY2VJZCxGaWxsZXJGYWN0b3J5LiRnZXRdKTtcbn0iLCIvKipcbiAqIEphc29uIE1jVGFnZ2FydFxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRmlsbGVyR2xvYmFscy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRmlsbGVyRmFjdG9yeS50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkZpbGxlciB7XG4gICAgYW5ndWxhci5tb2R1bGUoRmlsbGVyLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRmlsbGVyKSk7XG59IiwiLyoqXG4gKiBWaWV3IFN0YWdlIENvbnRyb2xsZXJcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlN0YWdlR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlIHtcblxuICAgIGludGVyZmFjZSBJU3RhZ2VDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIHN0YWdlOlJhbmtJdC5JU3RhZ2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFN0YWdlQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJTdGFnZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IFN0YWdlLm1vZHVsZUlkICsgXCIuXCIgKyBTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSVN0YWdlQ29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UgLCRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtc1snc3RhZ2UnXSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YWdlPSRzdGF0ZVBhcmFtc1snc3RhZ2UnXTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRhdGFTZXJ2aWNlLmdldFN0YWdlKCRzdGF0ZVBhcmFtc1snc3RhZ2VJZCddKS50aGVuKChkYXRhOiBSYW5rSXQuSVN0YWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGFnZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShTdGFnZUNvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKFN0YWdlQ29udHJvbGxlci5jb250cm9sbGVySWQsIFN0YWdlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShTdGFnZS5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBTdGFnZS5iYXNlVXJsKydzdGFnZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvc3RhZ2Uve3N0YWdlSWR9XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOntzdGFnZTpudWxsfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xuICAgICAgICAvKi5ydW4oW05hdi5OYXZTZXJ2aWNlLnNlcnZpY2VJZCwgZnVuY3Rpb24gKG5hdlNlcnZpY2U6IE5hdi5OYXZTZXJ2aWNlKSB7XG4gICAgICAgICAgICBuYXZTZXJ2aWNlLmFkZEl0ZW0oe3N0YXRlOkNyZWF0ZUNvbXAuc3RhdGUsIG5hbWU6IFwiQ3JlYXRlIENvbXBldGl0aW9uXCIsIG9yZGVyOiAwfSk7XG5cbiAgICAgICAgfV0pOyovXG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9TdGFnZUdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5DcmVhdGUge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IFN0YWdlLm1vZHVsZUlkICsgXCIuQ3JlYXRlU3RhZ2VcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBTdGFnZS5iYXNlVXJsICsgXCJDcmVhdGUvXCI7XG5cbiAgICBleHBvcnQgdmFyIHN0YXRlID0gXCJjcmVhdGVTdGFnZVwiXG59IiwiLyoqXG4gKiBDcmVhdGUgU3RhZ2UgY29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlU3RhZ2VHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuU3RhZ2UuQ3JlYXRlIHtcblxuICAgIGludGVyZmFjZSBJQ3JlYXRlU3RhZ2VDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGNvbXA6IGFueTtcbiAgICAgICAgc3RhZ2U6YW55O1xuICAgICAgICBzdWJtaXQ6ICgpID0+IHZvaWQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENyZWF0ZVN0YWdlQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJDcmVhdGVTdGFnZUNvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IENyZWF0ZS5tb2R1bGVJZCArIFwiLlwiICsgQ3JlYXRlU3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElDcmVhdGVTdGFnZUNvbnRyb2xsZXJTaGVsbCxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlLCRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5jb21wID0gJHN0YXRlUGFyYW1zWydjb21wJ107XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gdGhpcy5zdWJtaXQ7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNyZWF0ZVN0YWdlKHRoaXMuJHNjb3BlLmNvbXAuY29tcGV0aXRpb25JZCx0aGlzLiRzY29wZS5zdGFnZSkudGhlbigoZGF0YTogUmFua0l0LklTdGFnZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKFN0YWdlLnN0YXRlLHsnc3RhZ2VJZCc6ZGF0YS5zdGFnZUlkLCdzdGFnZSc6ZGF0YX0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ3JlYXRlU3RhZ2VDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihDcmVhdGVTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLCBDcmVhdGVTdGFnZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoQ3JlYXRlLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENyZWF0ZS5iYXNlVXJsKydjcmVhdGVTdGFnZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBDcmVhdGVTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvc3RhZ2UvY3JlYXRlXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOnsnY29tcCc6dW5kZWZpbmVkfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlU3RhZ2VHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVTdGFnZUNvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5DcmVhdGUge1xuICAgIGFuZ3VsYXIubW9kdWxlKENyZWF0ZS5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKENyZWF0ZSkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vU3RhZ2VHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuU3RhZ2UuRWRpdCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gU3RhZ2UubW9kdWxlSWQgKyBcIi5FZGl0U3RhZ2VcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBTdGFnZS5iYXNlVXJsICsgXCJFZGl0L1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiZWRpdFN0YWdlXCJcbn0iLCIvKipcbiAqIEVkaXQgU3RhZ2UgQ29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdFN0YWdlR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLlN0YWdlLkVkaXQge1xuXG4gICAgaW50ZXJmYWNlIElFZGl0U3RhZ2VDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIHN0YWdlOiBhbnk7XG4gICAgICAgIHN1Ym1pdDogKCkgPT4gdm9pZDtcbiAgICAgICAgZXZlbnRzOiBhbnk7XG4gICAgICAgIHN0YXRlczpzdHJpbmdbXTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRWRpdFN0YWdlQ29udHJvbGxlciB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udHJvbGxlcklkID0gXCJFZGl0U3RhZ2VDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBFZGl0Lm1vZHVsZUlkICsgXCIuXCIgKyBFZGl0U3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZDtcblxuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkc2NvcGVcIixcIiRzdGF0ZVwiLFwiJHN0YXRlUGFyYW1zXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWRdO1xuICAgICAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSAkc2NvcGU6IElFZGl0U3RhZ2VDb250cm9sbGVyU2hlbGwscHJpdmF0ZSAkc3RhdGU6bmcudWkuSVN0YXRlU2VydmljZSwgJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IHRoaXMuc3VibWl0O1xuICAgICAgICAgICAgJHNjb3BlLnN0YXRlcz1SYW5rSXQuc3RhdGU7XG4gICAgICAgICAgICBpZigkc3RhdGVQYXJhbXNbJ3N0YWdlJ10pe1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGFnZT0kc3RhdGVQYXJhbXNbJ3N0YWdlJ107XG4gICAgICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0U3RhZ2VFdmVudHModGhpcy4kc2NvcGUuc3RhZ2Uuc3RhZ2VJZCkudGhlbigoZGF0YTpSYW5rSXQuSUV2ZW50W10pPT57XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNjb3BlLmV2ZW50cz1kYXRhO1xuICAgICAgICAgICAgICAgIH0sKCk9PntcbiAgICAgICAgICAgICAgICAgICAgLy9mYWlsdXJlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBkYXRhU2VydmljZS5nZXRTdGFnZSgkc3RhdGVQYXJhbXNbJ3N0YWdlSWQnXSkudGhlbigoZGF0YTpSYW5rSXQuSVN0YWdlKT0+e1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzY29wZS5zdGFnZT1kYXRhO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzY29wZS5ldmVudHM9ZGF0YS5ldmVudHM7XG4gICAgICAgICAgICAgICAgfSwoKT0+e1xuICAgICAgICAgICAgICAgICAgICAvL2ZhaWx1cmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmVkaXRTdGFnZSh0aGlzLiRzY29wZS5zdGFnZS5zdGFnZUlkLHRoaXMuJHNjb3BlLnN0YWdlKS50aGVuKChkYXRhOiBSYW5rSXQuSVN0YWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3RhdGUuZ28oU3RhZ2Uuc3RhdGUse3N0YWdlSWQ6IGRhdGEuc3RhZ2VJZCxzdGFnZTpkYXRhfSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShFZGl0U3RhZ2VDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihFZGl0U3RhZ2VDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgRWRpdFN0YWdlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbmZpZyhbXCIkc3RhdGVQcm92aWRlclwiLCAoJHJvdXRlUHJvdmlkZXI6IG5nLnVpLklTdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5zdGF0ZShFZGl0LnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEVkaXQuYmFzZVVybCsnZWRpdFN0YWdlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IEVkaXRTdGFnZUNvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvc3RhZ2UvZWRpdC97c3RhZ2VJZH1cIixcbiAgICAgICAgICAgICAgICBwYXJhbXM6eydzdGFnZSc6bnVsbH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b25cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRTdGFnZUdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkVkaXRTdGFnZUNvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZS5FZGl0IHtcbiAgICBhbmd1bGFyLm1vZHVsZShFZGl0Lm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoRWRpdCkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU3RhZ2VHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJGaWxsZXIvRmlsbGVyTW9kdWxlLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdGFnZUNvbnRyb2xsZXIudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZS9DcmVhdGVTdGFnZU1vZHVsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdC9FZGl0U3RhZ2VNb2R1bGUudHNcIiAvPlxubW9kdWxlIEFwcC5TdGFnZSB7XG4gICAgYW5ndWxhci5tb2R1bGUoU3RhZ2UubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhTdGFnZSkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvbiwgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9BcHBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcCB7XG5cbiAgICBleHBvcnQgdmFyIG1vZHVsZUlkID0gQXBwLm1vZHVsZUlkICsgXCIuQ29tcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IEFwcC5iYXNlVXJsICsgXCJDb21wL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiQ29tcFwiXG59IiwiLyoqXG4gKiBKYXNvbiBNY1RhZ2dhcnRcbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5GaWxsZXIge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IENvbXAubW9kdWxlSWQgKyBcIi5GaWxsZXJcIjtcbiAgICBleHBvcnQgdmFyIGJhc2VVcmwgPSBDb21wLmJhc2VVcmwgKyBcIkZpbGxlci9cIjtcbn0iLCIvKipcbiAqIEVkaXQgQ29tcGV0aXRpb24gUGFnZVxuICogSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJGaWxsZXJHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5GaWxsZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIEZpbGxlckZhY3Rvcnkge1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFjdG9yeUlkID0gXCJDb21wRmlsbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBGaWxsZXIubW9kdWxlSWQgKyBGaWxsZXJGYWN0b3J5LmZhY3RvcnlJZDtcbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0OiBzdHJpbmdbXSA9IFtTdGFnZS5GaWxsZXIuRmlsbGVyRmFjdG9yeS5mYWN0b3J5SWRdO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGdldCA9IChzdGFnZUZpbGxlcjogU3RhZ2UuRmlsbGVyLkZpbGxlckZhY3RvcnksIGlkU2VydmljZTogSWQuSWRTZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgICB2YXIgZmFjID0gbmV3IEZpbGxlckZhY3Rvcnkoc3RhZ2VGaWxsZXIsIGlkU2VydmljZSlcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmlsbDogZmFjLmZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdHJ1Y3RvciAocHVibGljIHN0YWdlRmlsbGVyOiBTdGFnZS5GaWxsZXIuRmlsbGVyRmFjdG9yeSwgcHJpdmF0ZSBpZFNlcnZpY2U6IElkLklkU2VydmljZSkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIGNvbXBsZXRlIGNvbXBldGl0aW9uIGJyYWNrZXQgdHJlZSB3aXRoIHRoZSBnaXZlbiBudW1iZXIgb2YgcGFydGljaXBhbnRzXG4gICAgICAgICAqIHdpdGggc2VlZHMgaW4gcGxhY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBjb21wIHRoZSBjb21wZXRpdGlvblxuICAgICAgICAgKiBAcGFyYW0gcGFydGljaXBhbnRzIG51bWJlciBvZiBwYXJ0aWNpcGFudHMgaW4gdGhlIGNvbXBldGl0aW9uXG4gICAgICAgICAqIEBwYXJhbSBwYXJ0aWNpcGFudHNQZXJFdmVudCB0aGUgbnVtYmVyIG9mIHBhcnRpY2lwYW50cyBpbiBlYWNoIGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgZmlsbCA9IChjb21wOiBSYW5rSXQuSUNvbXBldGl0aW9uLCBwYXJ0aWNpcGFudHM6IG51bWJlciwgcGFydGljaXBhbnRzUGVyRXZlbnQ/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJ0aWNpcGFudHNQZXJFdmVudCA8IDIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnRzUGVyRXZlbnQgPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIWNvbXAuc3RhZ2VzKSBjb21wLnN0YWdlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZihwYXJ0aWNpcGFudHMgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG51bVN0YWdlcyA9IE1hdGguY2VpbCh0aGlzLmxvZ0Jhc2UocGFydGljaXBhbnRzLHBhcnRpY2lwYW50c1BlckV2ZW50KSk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IG51bVN0YWdlczsgaSA+IDA7IGktLSl7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnRpY2lwYW50c0luU3RhZ2UgPSBNYXRoLnBvdyhwYXJ0aWNpcGFudHNQZXJFdmVudCxpKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXAuc3RhZ2VzW251bVN0YWdlcy1pXSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wLnN0YWdlc1tudW1TdGFnZXMtaV0gPSAoPGFueT57bmFtZTpcIlN0YWdlIFwiK2ksc3RhdGU6XCJVcGNvbWluZ1wifSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXAuc3RhZ2VzW251bVN0YWdlcy1pXS5zdGFnZUlkPXRoaXMuaWRTZXJ2aWNlLmdldElkKClcbiAgICAgICAgICAgICAgICAgICAgY29tcC5zdGFnZXNbbnVtU3RhZ2VzLWldLmNvbXBldGl0aW9uSWQgPSBjb21wLmNvbXBldGl0aW9uSWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChudW1TdGFnZXMtaSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAuc3RhZ2VzW251bVN0YWdlcy1pLTFdLm5leHRTdGFnZUlkID0gY29tcC5zdGFnZXNbbnVtU3RhZ2VzLWldLnN0YWdlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wLnN0YWdlc1tudW1TdGFnZXMtaV0ucHJldmlvdXNTdGFnZUlkID0gY29tcC5zdGFnZXNbbnVtU3RhZ2VzLWktMV0uc3RhZ2VJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlRmlsbGVyLmZpbGwoY29tcC5zdGFnZXNbbnVtU3RhZ2VzLWldLHBhcnRpY2lwYW50c0luU3RhZ2UscGFydGljaXBhbnRzUGVyRXZlbnQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBsb2diKHgpXG4gICAgICAgICAqIEBwYXJhbSB4XG4gICAgICAgICAqIEBwYXJhbSBiIHRoZSBiYXNlXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSByZXN1bHRcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgbG9nQmFzZSA9ICh4Om51bWJlciwgYjogbnVtYmVyKTpudW1iZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubG9nKHgpL01hdGgubG9nKGIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZShGaWxsZXJGYWN0b3J5Lm1vZHVsZUlkLCBbXSkuXG4gICAgICAgIGZhY3RvcnkoRmlsbGVyRmFjdG9yeS5mYWN0b3J5SWQsIFtTdGFnZS5GaWxsZXIuRmlsbGVyRmFjdG9yeS5mYWN0b3J5SWQsIElkLklkU2VydmljZS5zZXJ2aWNlSWQsIEZpbGxlckZhY3RvcnkuJGdldF0pO1xufSIsIi8qKlxuICogSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJGaWxsZXJHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJGaWxsZXJGYWN0b3J5LnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5GaWxsZXIge1xuICAgIGFuZ3VsYXIubW9kdWxlKEZpbGxlci5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKEZpbGxlcikpO1xufSIsIi8qKlxuICogVmlldyBDb21wZXRpdGlvbiBQYWdlXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAge1xuXG5cblxuICAgIGludGVyZmFjZSBJQ29tcENvbnRyb2xsZXJTaGVsbCBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgY29tcGV0aXRpb246UmFua0l0LklDb21wZXRpdGlvbjtcbiAgICAgICAgdXNlcnM6e3VzZXJPYmplY3Q6UmFua0l0LklVc2VyOyByb2xlOnN0cmluZzt9W107XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIENvbXBDb250cm9sbGVyIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb250cm9sbGVySWQgPSBcIkNvbXBDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuXCIgKyBDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQ7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gW1wiJHNjb3BlXCIsXCIkc3RhdGVcIixcIiRzdGF0ZVBhcmFtc1wiLERhdGEuRGF0YVNlcnZpY2Uuc2VydmljZUlkLCBCYXNlLkJhc2VIZWxwZXJGYWN0b3J5LmZhY3RvcnlJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUNvbXBDb250cm9sbGVyU2hlbGwscHJpdmF0ZSAkc3RhdGU6bmcudWkuSVN0YXRlU2VydmljZSAsJHN0YXRlUGFyYW1zOm5nLnVpLklTdGF0ZVBhcmFtc1NlcnZpY2UsIHByaXZhdGUgZGF0YVNlcnZpY2U6RGF0YS5EYXRhU2VydmljZSwgcHJpdmF0ZSBiYXNlSGVscGVyOiBCYXNlLkJhc2VIZWxwZXJGYWN0b3J5KSB7XG4gICAgICAgICAgICAkc2NvcGUudXNlcnM9W107XG4gICAgICAgICAgICAvL0lmIHdlIGhhdmUgYSBjb21wZXRpdGlvbiBzdHJ1Y3R1cmUsIHVzZSBpdC4gT3RoZXJ3aXNlIGdldCBpdCBmcm9tIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgaWYoJHN0YXRlUGFyYW1zWydjb21wJ10pe1xuICAgICAgICAgICAgICAgICRzY29wZS5jb21wZXRpdGlvbj0kc3RhdGVQYXJhbXNbJ2NvbXAnXTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlVXNlcnMoKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGRhdGFTZXJ2aWNlLmdldENvbXAoJHN0YXRlUGFyYW1zWydjb21wSWQnXSkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGV0aXRpb24gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9LCAoZmFpbHVyZTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgcG9wdWxhdGVVc2VycyA9ICgpID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyTGlzdD10aGlzLiRzY29wZS5jb21wZXRpdGlvbi51c2VycztcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dXNlckxpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5nZXRVc2VyKHVzZXJMaXN0W2ldLnVzZXJJZCkudGhlbigoZGF0YTpSYW5rSXQuSVVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXA6YW55PXt9O1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnVzZXJPYmplY3Q9ZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5iYXNlSGVscGVyLnVzZXJDYW5FZGl0KGRhdGEudXNlcklkLHRoaXMuJHNjb3BlLmNvbXBldGl0aW9uKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wLnJvbGU9XCJBZG1pblwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih0aGlzLmJhc2VIZWxwZXIudXNlcklzQ29tcGV0aXRvcihkYXRhLnVzZXJJZCx0aGlzLiRzY29wZS5jb21wZXRpdGlvbikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5yb2xlPVwiQ29tcGV0aXRvclwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih0aGlzLmJhc2VIZWxwZXIudXNlcklzSnVkZ2UoZGF0YS51c2VySWQsdGhpcy4kc2NvcGUuY29tcGV0aXRpb24pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAucm9sZT1cIkp1ZGdlXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2NvcGUudXNlcnMucHVzaCh0ZW1wKTtcbiAgICAgICAgICAgICAgICB9LCAoZmFpbHVyZTphbnkpID0+IHtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKENvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgQ29tcENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoQ29tcC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBDb21wLmJhc2VVcmwrJ2NvbXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogQ29tcENvbnRyb2xsZXIuY29udHJvbGxlcklkLFxuICAgICAgICAgICAgICAgIHVybDogXCIvY29tcD9pZD17Y29tcElkfVwiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XSk7XG59IiwiLyoqXG4gKiBBbmRyZXcgV2VsdG9uXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9Db21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuQ3JlYXRlIHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuQ3JlYXRlQ29tcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IENvbXAuYmFzZVVybCArIFwiQ3JlYXRlL1wiO1xuXG4gICAgZXhwb3J0IHZhciBzdGF0ZSA9IFwiY3JlYXRlQ29tcFwiXG59IiwiLyoqXG4gKiBDcmVhdGUgQ29tcGV0aXRpb24gQ29udHJvbGxlclxuICogQW5kcmV3IFdlbHRvbiwgSmFzb24gTWNUYWdnYXJ0XG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGVDb21wR2xvYmFscy50c1wiIC8+XG5tb2R1bGUgQXBwLkNvbXAuQ3JlYXRlIHtcblxuICAgIGludGVyZmFjZSBJQ3JlYXRlQ29tcENvbnRyb2xsZXJTY29wZSBleHRlbmRzIG5nLklTY29wZXtcbiAgICAgICAgY29tcDogUmFua0l0LklDb21wZXRpdGlvbjtcbiAgICAgICAgc3VibWl0OiAoKSA9PiB2b2lkO1xuICAgICAgICBudW1QYXJ0aWNpcGFudHM6IG51bWJlcjtcbiAgICAgICAgcGFydGljaXBhbnRzUGVyRXZlbnQ6IG51bWJlcjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ3JlYXRlQ29tcENvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiQ3JlYXRlQ29tcENvbnRyb2xsZXJcIjtcbiAgICAgICAgcHVibGljIHN0YXRpYyBtb2R1bGVJZCA9IENyZWF0ZS5tb2R1bGVJZCArIFwiLlwiICsgQ3JlYXRlQ29tcENvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsRGF0YS5EYXRhU2VydmljZS5zZXJ2aWNlSWQsRmlsbGVyLkZpbGxlckZhY3RvcnkuZmFjdG9yeUlkXTtcbiAgICAgICAgY29uc3RydWN0b3IgKHByaXZhdGUgJHNjb3BlOiBJQ3JlYXRlQ29tcENvbnRyb2xsZXJTY29wZSxwcml2YXRlICRzdGF0ZTpuZy51aS5JU3RhdGVTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UsIHByaXZhdGUgY29tcEZpbGxlcjpGaWxsZXIuRmlsbGVyRmFjdG9yeSkge1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IHRoaXMuc3VibWl0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN1Ym1pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRoZSBjb21wZXRpdGlvblxuICAgICAgICAgICAgaWYodGhpcy4kc2NvcGUubnVtUGFydGljaXBhbnRzIT0wKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBGaWxsZXIuZmlsbCh0aGlzLiRzY29wZS5jb21wLHRoaXMuJHNjb3BlLm51bVBhcnRpY2lwYW50cyx0aGlzLiRzY29wZS5wYXJ0aWNpcGFudHNQZXJFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLiRzY29wZS5jb21wKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY3JlYXRlQ29tcGV0aXRpb24odGhpcy4kc2NvcGUuY29tcCkudGhlbigoZGF0YTogUmFua0l0LklDb21wZXRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHN0YXRlLmdvKENvbXAuc3RhdGUse2NvbXBJZDogZGF0YS5jb21wZXRpdGlvbklkLGNvbXA6ZGF0YX0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ3JlYXRlQ29tcENvbnRyb2xsZXIubW9kdWxlSWQsIFtOYXYuTmF2U2VydmljZS5tb2R1bGVJZF0pLlxuICAgICAgICBjb250cm9sbGVyKENyZWF0ZUNvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZCwgQ3JlYXRlQ29tcENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoQ3JlYXRlLnN0YXRlLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IENyZWF0ZS5iYXNlVXJsKydjcmVhdGVDb21wLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IENyZWF0ZUNvbXBDb250cm9sbGVyLmNvbnRyb2xsZXJJZCxcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NvbXAvY3JlYXRlXCJcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuICAgICAgICAucnVuKFtOYXYuTmF2U2VydmljZS5zZXJ2aWNlSWQsIGZ1bmN0aW9uIChuYXZTZXJ2aWNlOiBOYXYuTmF2U2VydmljZSkge1xuICAgICAgICAgICAgbmF2U2VydmljZS5hZGRJdGVtKHtzdGF0ZTpDcmVhdGUuc3RhdGUsIG5hbWU6IFwiQ3JlYXRlIENvbXBldGl0aW9uXCIsIG9yZGVyOiAwfSk7XG5cbiAgICAgICAgfV0pO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ3JlYXRlQ29tcEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNyZWF0ZUNvbXBDb250cm9sbGVyLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5DcmVhdGUge1xuICAgIGFuZ3VsYXIubW9kdWxlKENyZWF0ZS5tb2R1bGVJZCwgQXBwLmdldENoaWxkTW9kdWxlSWRzKENyZWF0ZSkpO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQ29tcEdsb2JhbHMudHNcIiAvPlxubW9kdWxlIEFwcC5Db21wLkVkaXQge1xuXG4gICAgZXhwb3J0IHZhciBtb2R1bGVJZCA9IENvbXAubW9kdWxlSWQgKyBcIi5FZGl0Q29tcFwiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IENvbXAuYmFzZVVybCArIFwiRWRpdC9cIjtcblxuICAgIGV4cG9ydCB2YXIgc3RhdGUgPSBcImVkaXRDb21wXCJcbn0iLCIvKipcbiAqIEVkaXQgQ29tcGV0aXRpb24gUGFnZVxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdENvbXBHbG9iYWxzLnRzXCIgLz5cbm1vZHVsZSBBcHAuQ29tcC5FZGl0IHtcblxuICAgIGludGVyZmFjZSBJRWRpdENvbXBDb250cm9sbGVyU2hlbGwgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIGNvbXA6IGFueTtcbiAgICAgICAgc3RhZ2VzOiBSYW5rSXQuSVN0YWdlW107XG4gICAgICAgIHN1Ym1pdDogKCkgPT4gdm9pZDtcbiAgICAgICAgYWRkU3RhZ2U6IChjb21wKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBFZGl0Q29tcENvbnRyb2xsZXIge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnRyb2xsZXJJZCA9IFwiRWRpdENvbXBDb250cm9sbGVyXCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBFZGl0Lm1vZHVsZUlkICsgXCIuXCIgKyBFZGl0Q29tcENvbnRyb2xsZXIuY29udHJvbGxlcklkO1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgJGluamVjdCA9IFtcIiRzY29wZVwiLFwiJHN0YXRlXCIsXCIkc3RhdGVQYXJhbXNcIixEYXRhLkRhdGFTZXJ2aWNlLnNlcnZpY2VJZF07XG4gICAgICAgIGNvbnN0cnVjdG9yIChwcml2YXRlICRzY29wZTogSUVkaXRDb21wQ29udHJvbGxlclNoZWxsLHByaXZhdGUgJHN0YXRlOm5nLnVpLklTdGF0ZVNlcnZpY2UsICRzdGF0ZVBhcmFtczpuZy51aS5JU3RhdGVQYXJhbXNTZXJ2aWNlLCBwcml2YXRlIGRhdGFTZXJ2aWNlOkRhdGEuRGF0YVNlcnZpY2UpIHtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXQgPSB0aGlzLnN1Ym1pdDtcbiAgICAgICAgICAgICRzY29wZS5hZGRTdGFnZSA9IHRoaXMuYWRkU3RhZ2U7XG4gICAgICAgICAgICBpZigkc3RhdGVQYXJhbXNbJ2NvbXAnXSE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXAgPSAkc3RhdGVQYXJhbXNbJ2NvbXAnXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhZ2VzID0gJHNjb3BlLmNvbXAuc3RhZ2VzO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZGF0YVNlcnZpY2UuZ2V0Q29tcCgkc3RhdGVQYXJhbXNbJ2NvbXBJZCddKS50aGVuKChkYXRhOiBSYW5rSXQuSUNvbXBldGl0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wPWRhdGE7XG4gICAgICAgICAgICAgICAgfSwgKGZhaWx1cmU6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIHN0YWdlcyBpbiB0aGUgY29tcGV0aXRpb24gdG8gc2hvdyBvbiB0aGUgcGFnZS5cbiAgICAgICAgICAgICAgICBkYXRhU2VydmljZS5nZXRDb21wU3RhZ2VzKCRzdGF0ZVBhcmFtc1snY29tcElkJ10pLnRoZW4oKGRhdGE6IFJhbmtJdC5JU3RhZ2VbXSk9PntcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YWdlcz1kYXRhO1xuICAgICAgICAgICAgICAgIH0sKGZhaWx1cmU6YW55KT0+e1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc3VibWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYXRhU2VydmljZS5lZGl0Q29tcGV0aXRpb24odGhpcy4kc2NvcGUuY29tcC5jb21wZXRpdGlvbklkLHRoaXMuJHNjb3BlLmNvbXApLnRoZW4oKGRhdGE6IFJhbmtJdC5JQ29tcGV0aXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhDb21wLnN0YXRlLHtjb21wSWQ6IGRhdGEuY29tcGV0aXRpb25JZCxjb21wOmRhdGF9KTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBhZGRTdGFnZSA9IChjb21wKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbyhTdGFnZS5DcmVhdGUuc3RhdGUse2NvbXA6Y29tcH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoRWRpdENvbXBDb250cm9sbGVyLm1vZHVsZUlkLCBbTmF2Lk5hdlNlcnZpY2UubW9kdWxlSWRdKS5cbiAgICAgICAgY29udHJvbGxlcihFZGl0Q29tcENvbnRyb2xsZXIuY29udHJvbGxlcklkLCBFZGl0Q29tcENvbnRyb2xsZXIpXG4gICAgICAgIC5jb25maWcoW1wiJHN0YXRlUHJvdmlkZXJcIiwgKCRyb3V0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcikgPT4ge1xuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIuc3RhdGUoRWRpdC5zdGF0ZSwge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBFZGl0LmJhc2VVcmwrJ2VkaXRDb21wLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IEVkaXRDb21wQ29udHJvbGxlci5jb250cm9sbGVySWQsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jb21wL2VkaXQve2NvbXBJZH1cIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfV0pO1xufSIsIi8qKlxuICogQW5kcmV3IFdlbHRvblxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdENvbXBHbG9iYWxzLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFZGl0Q29tcENvbnRyb2xsZXIudHNcIiAvPlxubW9kdWxlIEFwcC5Db21wLkVkaXQge1xuICAgIGFuZ3VsYXIubW9kdWxlKEVkaXQubW9kdWxlSWQsIEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhFZGl0KSk7XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0NvbXBHbG9iYWxzLnRzXCIgLz5cblxuLyoqXG4gKiBAYXV0aG9yIEphc29uIE1jVGFnZ2FydFxuICogVXNlZCBmb3IgZGlzcGxheWluZyBhIGNvbXBldGl0aW9uJ3Mgc3RydWN0dXJlXG4gKi9cbm1vZHVsZSBBcHAuQ29tcC5Db21wU3RydWN0IHtcblxuICAgIGV4cG9ydCB2YXIgbW9kdWxlSWQgPSBDb21wLm1vZHVsZUlkICsgXCIuU3RydWN0Vmlld1wiO1xuICAgIGV4cG9ydCB2YXIgYmFzZVVybCA9IENvbXAuYmFzZVVybCArIFwiU3RydWN0Vmlldy9cIjtcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tcFN0cnVjdEdsb2JhbHMudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBBIGRpcmVjdGl2ZSB0byBkaXNwbGF5IHRoZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBjb21wZXRpdGlvbidzIHN0cnVjdHVyZVxuICovXG5tb2R1bGUgQXBwLkNvbXAuQ29tcFN0cnVjdCB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2hhcGUgb2YgdGhlIHNjb3BlXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElDb21wU3RydWN0U2NvcGUgZXh0ZW5kcyBuZy5JU2NvcGV7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY29tcGV0aXRpb24gdG8gZGlzcGxheVxuICAgICAgICAgKi9cbiAgICAgICAgY29tcDogUmFua0l0LklDb21wZXRpdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRydWUgaWYgZGV0YWlscyBzaG91bGQgYmUgZGlzcGxheWVkXG4gICAgICAgICAqL1xuICAgICAgICBkZXRhaWw6IGJvb2xlYW47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRydWUgaXMgdmlzaWJsZVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvdzogYm9vbGVhbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpZCBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgaWQ6IG51bWJlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHN0eWxlcyBmb3IgZXZlbnRzIGdpdmVuIHRoZWlyIHBhcmVudCBzdGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgZXZlbnRTdHlsZToge1tzdGFnZUlkOnN0cmluZ106IGFueX07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc3R5bGUgZm9yIGFsbCB0aGUgc3RhZ2VzXG4gICAgICAgICAqL1xuICAgICAgICBzdGFnZVN0eWxlOiBhbnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGludGVyZmFjZSBmb3IgdHdvIG9iamVjdHMgdG8gaGF2ZSBhIGxpbmUgZHJhd24gYmV0d2VlbiB0aGVtXG4gICAgICovXG4gICAgaW50ZXJmYWNlIElDb25uZWN0b3J7XG4gICAgICAgIHRvOiBKUXVlcnk7XG4gICAgICAgIGZyb206IEpRdWVyeTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQ29tcFN0cnVjdERpcmVjdGl2ZSBpbXBsZW1lbnRzIG5nLklEaXJlY3RpdmUge1xuICAgICAgICBwdWJsaWMgc3RhdGljIGRpcmVjdGl2ZUlkID0gXCJjb21wU3RydWN0XCI7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbW9kdWxlSWQgPSBDb21wU3RydWN0Lm1vZHVsZUlkICsgXCIuXCIgKyBDb21wU3RydWN0RGlyZWN0aXZlLmRpcmVjdGl2ZUlkO1xuICAgICAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbXCIkdGltZW91dFwiXTtcblxuICAgICAgICBwdWJsaWMgJHNjb3BlID0ge1xuICAgICAgICAgICAgY29tcDogXCI9XCJcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyByZXN0cmljdCA9IFwiRVwiO1xuXG4gICAgICAgIHB1YmxpYyB0ZW1wbGF0ZVVybCA9IENvbXBTdHJ1Y3QuYmFzZVVybCtDb21wU3RydWN0RGlyZWN0aXZlLmRpcmVjdGl2ZUlkK1wiLmh0bWxcIjtcblxuXG4gICAgICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU29ydHMgYSBnaXZlbiBjb21wZXRpdGlvbidzIHN0YWdlcyBhbmQgdGhlaXIgZXZlbnRzXG4gICAgICAgICAqIEBwYXJhbSBjb21wXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHNvcnRDb21wIChjb21wOiBSYW5rSXQuSUNvbXBldGl0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RTdGFnZTogUmFua0l0LklTdGFnZVxuICAgICAgICAgICAgdmFyIHN0YWdlSW5kZXggPSAwO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRTdGFnZTogUmFua0l0LklTdGFnZSA9IGNvbXAuc3RhZ2VzW3N0YWdlSW5kZXhdXG4gICAgICAgICAgICAvLyBGaW5kcyB0aGUgZmlyc3Qgc3RhZ2VcbiAgICAgICAgICAgIHdoaWxlICghZmlyc3RTdGFnZSl7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGFnZSYmIWN1cnJlbnRTdGFnZS5wcmV2aW91c1N0YWdlSWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFN0YWdlID0gY3VycmVudFN0YWdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzdGFnZUluZGV4ID0gdGhpcy5zdGFnZUluZGV4V2l0aElkKGNvbXAuc3RhZ2VzLCBjdXJyZW50U3RhZ2UucHJldmlvdXNTdGFnZUlkKVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3RhZ2UgPSBjb21wLnN0YWdlc1tzdGFnZUluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNvcnRzIHRoZSBzdGFnZXNcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50U3RhZ2UgJiYgY3VycmVudFN0YWdlLm5leHRTdGFnZUlkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlTd2FwKGNvbXAuc3RhZ2VzLGNvdW50ZXIrKyxzdGFnZUluZGV4KTtcbiAgICAgICAgICAgICAgICBzdGFnZUluZGV4ID0gdGhpcy5zdGFnZUluZGV4V2l0aElkKGNvbXAuc3RhZ2VzLCBjdXJyZW50U3RhZ2UubmV4dFN0YWdlSWQpXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTdGFnZSA9IGNvbXAuc3RhZ2VzW3N0YWdlSW5kZXhdO1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydFN0YWdlKGN1cnJlbnRTdGFnZSwgbmV4dFN0YWdlKTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFnZSA9IG5leHRTdGFnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTb3J0cyB0aGUgZXZlbnRzIHdpdGhpbiB0aGUgc3RhZ2UgdG8gcmVzZW1ibGUgdGhlIG9yZGVyIHRoZXkgd291bGQgYXBwZWFyIGluIGEgdHJhZGl0aW9uYWwgYnJhY2tldGVkIGNvbXBldGl0aW9uXG4gICAgICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAgICAgKiBAcGFyYW0gbmV4dFN0YWdlXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIHNvcnRTdGFnZSAoc3RhZ2U6IFJhbmtJdC5JU3RhZ2UsIG5leHRTdGFnZTogUmFua0l0LklTdGFnZSkge1xuICAgICAgICAgICAgaWYgKCFzdGFnZSB8fCAhbmV4dFN0YWdlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0YWdlIGFuZCBuZXh0U3RhZ2UgYXJndW1lbnRzIG11c3QgZXhpc3RcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIG5leHRTdGFnZS5ldmVudHMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBuZXh0U3RhZ2UuZXZlbnRzW2ldLnNlZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmV2ZW50SW5kZXhXaXRoU2VlZChzdGFnZS5ldmVudHMsIG5leHRTdGFnZS5ldmVudHNbaV0uc2VlZFtqXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVN3YXAoc3RhZ2UuZXZlbnRzLCBjb3VudGVyLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGZpbmRzIHRoZSBpbmRleCBvZiBhbiBldmVudCB3aXRoIGEgZ2l2ZW4gc2VlZFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRzXG4gICAgICAgICAqIEBwYXJhbSBzZWVkXG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgaXRlbSAoLTEgaWYgbm90IHByZXNlbnQpXG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGV2ZW50SW5kZXhXaXRoU2VlZChldmVudHM6IFJhbmtJdC5JRXZlbnRbXSwgc2VlZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gZXZlbnRzW2ldO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gZXZlbnQuc2VlZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWVkID09IGV2ZW50LnNlZWRbal0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIGluZGV4IG9mIHRoZSBzdGFnZSB3aXRoIGEgZ2l2ZW4gaWRcbiAgICAgICAgICogQHBhcmFtIHN0YWdlc1xuICAgICAgICAgKiBAcGFyYW0gaWRcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gdGhlIGluZGV4IG9mIHRoZSBpdGVtICgtMSBpZiBub3QgcHJlc2VudClcbiAgICAgICAgICovXG4gICAgICAgIHByaXZhdGUgc3RhZ2VJbmRleFdpdGhJZCAoc3RhZ2VzOiBSYW5rSXQuSVN0YWdlW10sIGlkOiBSYW5rSXQuSUlkKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHN0YWdlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhZ2VzW2ldLnN0YWdlSWQgPT0gaWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3dhcHMgaXRlbXMgYXQgaW5kZXggeCBhbmQgeSBpbiB0aGUgYXJyYXlcbiAgICAgICAgICogQHBhcmFtIGFycmF5XG4gICAgICAgICAqIEBwYXJhbSB4XG4gICAgICAgICAqIEBwYXJhbSB5XG4gICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGFycmF5U3dhcChhcnJheTogYW55W10sIHg6IG51bWJlciwgeTogbnVtYmVyKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZighYXJyYXl8fHg8MHx8eD49YXJyYXkubGVuZ3RofHx5PDB8fHk+PWFycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEFyZ3VtZW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IGFycmF5W3hdO1xuICAgICAgICAgICAgICAgIGFycmF5W3hdID0gYXJyYXlbeV07XG4gICAgICAgICAgICAgICAgYXJyYXlbeV0gPSB0ZW1wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBQb3N0IExpbmsgZnVuY3Rpb24gc2VlIGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy9zZXJ2aWNlLyRjb21waWxlXG4gICAgICAgICAqIEBwYXJhbSBzY29wZVxuICAgICAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAgICAgKiBAcGFyYW0gYXR0cnNcbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBwb3N0TGluayA9IChzY29wZTogSUNvbXBTdHJ1Y3RTY29wZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW06IG5nLklBdWdtZW50ZWRKUXVlcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczogbmcuSUF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NsdWRlOiBuZy5JVHJhbnNjbHVkZUZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICBzY29wZS5zaG93PXRydWU7XG5cbiAgICAgICAgICAgIC8vIEJBSUwgT1VUIENPTkRJVElPTlxuICAgICAgICAgICAgLy8gTm8gY29tcFxuICAgICAgICAgICAgLy8gTm8gc3RhZ2VzXG4gICAgICAgICAgICBpZiAoIXNjb3BlLmNvbXAgfHwgIXNjb3BlLmNvbXAuc3RhZ2VzIHx8ICFzY29wZS5jb21wLnN0YWdlcy5sZW5ndGggKXtcbiAgICAgICAgICAgICAgICBzY29wZS5zaG93PWZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGaW5kcyB0aGUgYXBwcm9wcmlhdGUgd2l0aCBmb3IgZXZlbnRzIGluIGVhY2ggc3RhZ2UgKHdpZHRoIC8gbnVtYmVyIG9mIGV2ZW50cyBpbiBzdGFnZSlcbiAgICAgICAgICAgIHNjb3BlLmV2ZW50U3R5bGU9e307XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjb3BlLmNvbXAuc3RhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gQkFJTCBPVVQgQ09ORElUSU9OXG4gICAgICAgICAgICAgICAgLy8gTm8gZXZlbnRzIGluIHN0YWdlXG4gICAgICAgICAgICAgICAgaWYgKCFzY29wZS5jb21wLnN0YWdlc1tpXS5ldmVudHMpe1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93PWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjb3BlLmV2ZW50U3R5bGVbc2NvcGUuY29tcC5zdGFnZXNbaV0uc3RhZ2VJZC50b1N0cmluZygpXT17XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAoMTAwIC8gc2NvcGUuY29tcC5zdGFnZXNbaV0uZXZlbnRzLmxlbmd0aCArIFwiJVwiKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdlbmVyYXRlcyBhbiBpZCBzbyB0aGUgZWxlbWVudCBjYW4gYmUgZm91bmQgdXNpbmcgSlF1ZXJ5XG4gICAgICAgICAgICB2YXIgaWQgPSBNYXRoLmZsb29yKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDApO1xuICAgICAgICAgICAgc2NvcGUuaWQgPSBpZDtcblxuICAgICAgICAgICAgLy8gV2F0Y2hlcyBmb3IgY2hhbmdlcyBpbiB0aGUgZGV0YWlsIGZ1bmN0aW9uIGFuZCBwcm9wYWdhdGVzIGNoYW5nZXMgdG8gc2NvcGVcbiAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdkZXRhaWwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5kZXRhaWwgPSBzY29wZS4kZXZhbCgoPGFueT5hdHRycykuZGV0YWlsKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBHaXZlcyBBbmd1bGFyIHRpbWUgdG8gY29tcGxldGUgZGlyZWN0aXZlIHJlbmRlcmluZ1xuICAgICAgICAgICAgdGhpcy4kdGltZW91dCggKCkgPT57XG4gICAgICAgICAgICAgICAgdmFyICRjYW52YXM9ICQoXCJjYW52YXMjXCIraWQpO1xuICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignd2lkdGgnLCAkY2FudmFzLnBhcmVudCgpLndpZHRoKCkpO1xuICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignaGVpZ2h0JywgJGNhbnZhcy5wYXJlbnQoKS5oZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHN0YWdlSGVpZ2h0PTEwMC9zY29wZS5jb21wLnN0YWdlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgc2NvcGUuc3RhZ2VTdHlsZSA9IHtoZWlnaHQ6IHN0YWdlSGVpZ2h0K1wiJVwifTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0Q29tcChzY29wZS5jb21wKVxuICAgICAgICAgICAgICAgIC8vIEFwcGxpZXMgc2NvcGUgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGlmICghc2NvcGUuJCRwaGFzZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kcyBhbGwgdGhlIGNvbm5lY3Rpb25zXG4gICAgICAgICAgICAgICAgdmFyIGNvbm5lY3RvcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAxIDsgaSA8IHNjb3BlLmNvbXAuc3RhZ2VzLmxlbmd0aCA7IGkgKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kQ29ubmVjdGlvbnMoc2NvcGUuY29tcC5zdGFnZXNbaS0xXSwgc2NvcGUuY29tcC5zdGFnZXNbaV0sIGNvbm5lY3RvcnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlLURyYXdzIHdoZW4gdGhlIGNhbnZhcyBjaGFuZ2VzIHZpc2liaWxpdHkgdG8gdmlzaWJsZVxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkY2FudmFzLmNzcyhcInZpc2liaWxpdHlcIik7XG4gICAgICAgICAgICAgICAgfSwgKG5ld1ZhbCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlLURyYXdzIGlmIHRoZSBjYW52YXMgaXMgdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsID09PSBcInZpc2libGVcIilcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3KCRjYW52YXMsIGNvbm5lY3RvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDApO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluZHMgdGhlIGNvbm5lY3Rpb25zIGdpdmVuIDIgc3RhZ2VzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIGNvbm5lY3RvcnMgb2JqZWN0XG4gICAgICAgICAqIEBwYXJhbSBwcmV2U3RhZ2VcbiAgICAgICAgICogQHBhcmFtIG5leHRTdGFnZVxuICAgICAgICAgKiBAcGFyYW0gY29ubmVjdG9yc1xuICAgICAgICAgKi9cbiAgICAgICAgZmluZENvbm5lY3Rpb25zID0gKHByZXZTdGFnZSA6UmFua0l0LklTdGFnZSwgbmV4dFN0YWdlIDpSYW5rSXQuSVN0YWdlLCBjb25uZWN0b3JzOiBJQ29ubmVjdG9yW10pID0+IHtcbiAgICAgICAgICAgIGNvbm5lY3RvcnMgPSBjb25uZWN0b3JzIHx8IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0U3RhZ2UuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kcyBhbGwgY29ubmVjdGlvbnMgZ2l2ZW4gYSBzdGFnZVxuICAgICAgICAgICAgICAgIHZhciBldmVudCA9IG5leHRTdGFnZS5ldmVudHNbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBldmVudC5zZWVkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gZXZlbnQuc2VlZFtqXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kcyBldmVudCBpbiBwcmV2aW91cyBzdGFnZSB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHNlZWRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5ldmVudEluZGV4V2l0aFNlZWQocHJldlN0YWdlLmV2ZW50cywgc2VlZClcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21FdmVudCA9IHByZXZTdGFnZS5ldmVudHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbUV2ZW50ICYmIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICQoXCIjXCIgKyBmcm9tRXZlbnQuZXZlbnRJZCArIFwiPi5ldmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogJChcIiNcIiArIGV2ZW50LmV2ZW50SWQgKyBcIj4uZXZlbnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhd3MgdGhlIGNvbm5lY3Rpb25zIG9uIHRoZSBnaXZlbiBjYW52YXNcbiAgICAgICAgICogQHBhcmFtICRjYW52YXNcbiAgICAgICAgICogQHBhcmFtIGNvbm5lY3RvcnNcbiAgICAgICAgICovXG4gICAgICAgIGRyYXcgPSAoJGNhbnZhczogSlF1ZXJ5LCBjb25uZWN0b3JzOiBJQ29ubmVjdG9yW10pID0+IHtcbiAgICAgICAgICAgIC8vIEdldHMgdGhlIGNvbnRleHQgdG8gZHJhdyBvblxuICAgICAgICAgICAgdmFyIG9yaWdpbj0kY2FudmFzLm9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gKDxIVE1MQ2FudmFzRWxlbWVudD4kY2FudmFzWzBdKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMztcblxuICAgICAgICAgICAgLy8gQ2xlYXJzIHRoZSBjYW52YXNcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgJGNhbnZhcy53aWR0aCgpLCAkY2FudmFzLmhlaWdodCgpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29ubmVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjID0gY29ubmVjdG9yc1tpXTtcblxuICAgICAgICAgICAgICAgIC8vIFRvIGFuZCBmcm9tIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgdmFyIGVGcm9tID0gYy5mcm9tO1xuICAgICAgICAgICAgICAgIHZhciBlVG8gPSBjLnRvO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZyb21Qb3MgPSBlRnJvbS5vZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9Qb3MgPSBlVG8ub2Zmc2V0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFydCBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHZhciBzdGFydFggPSBmcm9tUG9zLmxlZnQgKyBlRnJvbS53aWR0aCgpIC8gMiAtIG9yaWdpbi5sZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBzdGFydFkgPSBmcm9tUG9zLnRvcCAtIG9yaWdpbi50b3AgKyAxO1xuXG4gICAgICAgICAgICAgICAgLy8gRW5kIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgdmFyIGZpblggPSB0b1Bvcy5sZWZ0ICsgZVRvLndpZHRoKCkgLyAyLSBvcmlnaW4ubGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgZmluWSA9IHRvUG9zLnRvcCAtIG9yaWdpbi50b3AgKyBlVG8uaGVpZ2h0KCkgLSAxO1xuXG4gICAgICAgICAgICAgICAgLy8gRHJhd3MgdGhlIGxpbmVzXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oc3RhcnRYLCAoc3RhcnRZKSArIChmaW5ZIC0gc3RhcnRZKSAvIDIpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oZmluWCwgKHN0YXJ0WSkgKyAoZmluWSAtIHN0YXJ0WSkgLyAyKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKGZpblgsIGZpblkpO1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBjb21waWxlIGZ1bmN0aW9uIHNlZSBodHRwczovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcvc2VydmljZS8kY29tcGlsZVxuICAgICAgICAgKiBAcmV0dXJucyB7e3Bvc3Q6IElEaXJlY3RpdmVMaW5rRm59fVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGNvbXBpbGU6IG5nLklEaXJlY3RpdmVDb21waWxlRm4gID1cbiAgICAoXG4gICAgICAgIHRlbXBsYXRlRWxlbWVudDogbmcuSUF1Z21lbnRlZEpRdWVyeSxcbiAgICAgICAgdGVtcGxhdGVBdHRyaWJ1dGVzOiBuZy5JQXR0cmlidXRlcyxcbiAgICAgICAgdHJhbnNjbHVkZTogbmcuSVRyYW5zY2x1ZGVGdW5jdGlvblxuICAgICk6IG5nLklEaXJlY3RpdmVQcmVQb3N0ID0+e1xuICAgICAgICAgICAgcmV0dXJuICg8bmcuSURpcmVjdGl2ZVByZVBvc3Q+e1xuICAgICAgICAgICAgICAgIHBvc3Q6ICB0aGlzLnBvc3RMaW5rXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmYWN0b3J5IHJldHVybmluZyB0aGUgZGlyZWN0aXZlXG4gICAgICAgICAqIEBwYXJhbSAkdGltZW91dFxuICAgICAgICAgKiBAcmV0dXJucyB7bmcuSURpcmVjdGl2ZX1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZmFjdG9yeTpuZy5JRGlyZWN0aXZlRmFjdG9yeSAgPSAoJHRpbWVvdXQ6bmcuSVRpbWVvdXRTZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IG5ldyBDb21wU3RydWN0RGlyZWN0aXZlKCR0aW1lb3V0KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29tcGlsZTogY29tcC5jb21waWxlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBjb21wLnRlbXBsYXRlVXJsLFxuICAgICAgICAgICAgICAgICRzY29wZTogY29tcC4kc2NvcGUsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6IGNvbXAucmVzdHJpY3RcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcFN0cnVjdERpcmVjdGl2ZS5tb2R1bGVJZCwgW10pLlxuICAgICAgICBkaXJlY3RpdmUoQ29tcFN0cnVjdERpcmVjdGl2ZS5kaXJlY3RpdmVJZCwgW1wiJHRpbWVvdXRcIiwgQ29tcFN0cnVjdERpcmVjdGl2ZS5mYWN0b3J5XSk7XG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tcFN0cnVjdEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBTdHJ1Y3REaXJlY3RpdmUudHNcIiAvPlxuXG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBVc2VkIGZvciBkaXNwbGF5aW5nIGEgY29tcGV0aXRpb24ncyBzdHJ1Y3R1cmVcbiAqL1xubW9kdWxlIEFwcC5Db21wLkNvbXBTdHJ1Y3Qge1xuICAgIHZhciBkZXAgPSBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQ29tcFN0cnVjdCk7XG4gICAgYW5ndWxhci5tb2R1bGUoQ29tcFN0cnVjdC5tb2R1bGVJZCwgZGVwKTtcbn0iLCIvKipcbiAqIEFuZHJldyBXZWx0b24sIEphc29uIE1jVGFnZ2FydFxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiQ29tcEdsb2JhbHMudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkZpbGxlci9GaWxsZXJNb2R1bGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkNvbXBDb250cm9sbGVyLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDcmVhdGUvQ3JlYXRlQ29tcE1vZHVsZS50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRWRpdC9FZGl0Q29tcE1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdHJ1Y3RWaWV3L0NvbXBTdHJ1Y3RNb2R1bGUudHNcIiAvPlxubW9kdWxlIEFwcC5Db21wIHtcbiAgICBhbmd1bGFyLm1vZHVsZShDb21wLm1vZHVsZUlkLCBBcHAuZ2V0Q2hpbGRNb2R1bGVJZHMoQ29tcCkpO1xufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJBcHBHbG9iYWxzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIklkL0lkTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkJhc2UvQmFzZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJOYXYvTmF2TW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkF1dGgvQXV0aE1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJEYXRhL0RhdGFNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU2hlbGwvU2hlbGxNb2R1bGUudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiSG9tZS9Ib21lTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkxvZ2luL0xvZ2luTW9kdWxlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlByb2ZpbGUvUHJvZmlsZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJFdmVudC9FdmVudE1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdGFnZS9TdGFnZU1vZHVsZS50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJDb21wL0NvbXBNb2R1bGUudHNcIi8+XG4vKipcbiAqIEBhdXRob3IgSmFzb24gTWNUYWdnYXJ0XG4gKiBUaGUgQXBwIG1vZHVsZS5cbiAqIENvbnRhaW5zIGFsbCBzdWItbW9kdWxlcyBhbmQgaW1wbGVtZW50YXRpb24gcmVxdWlyZWQgZm9yIHRoZSBhcHBcbiAqL1xubW9kdWxlIEFwcCB7XG4gICAgdmFyIGRlcCA9IEFwcC5nZXRDaGlsZE1vZHVsZUlkcyhBcHAsW1widWkuYm9vdHN0cmFwXCIsIFwidWkucm91dGVyXCIsIFwiYXBwLXBhcnRpYWxzXCIsIFwibmdBbmltYXRlXCJdKTtcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoQXBwLm1vZHVsZUlkLCBkZXApO1xuXG5cbiAgICBhcHAuZGlyZWN0aXZlKCdkeW5hbWljJywgZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7bXNnOiAnPWR5bmFtaWMnfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIHBvc3RMaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdtc2cnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaHRtbChtc2cuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQuY29udGVudHMoKSkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG59XG5cbm1vZHVsZSBSYW5rSXR7XG4gICAgZXhwb3J0IHZhciBzdGF0ZT1bXCJVcGNvbWluZ1wiLFwiSW4gUHJvZ3Jlc3NcIixcIkNvbXBsZXRlZFwiXTtcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9