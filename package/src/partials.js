(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Home/home.html',
    '<div class="row top-push" ng-repeat="comp in competitions">\n' +
    '    <div class="col-xs-12">\n' +
    '        <accordion>\n' +
    '            <accordion-group>\n' +
    '                <accordion-heading>\n' +
    '                    <h2>{{comp.name}} - {{comp.description}}</h2>\n' +
    '                    <p>In Progress</p>\n' +
    '                </accordion-heading>\n' +
    '                <h4>Taking place at {{comp.location}}</h4>\n' +
    '                <p>Competing in: {{comp.subject}}</p>\n' +
    '                <span ng-if="comp.streamURL">\n' +
    '\n' +
    '                    <h2>Stream</h2>\n' +
    '                    <iframe src="{{comp.streamURL}}" frameborder="0" scrolling="no" height="378" width="620"></iframe>\n' +
    '                </span>\n' +
    '            </accordion-group>\n' +
    '        </accordion>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Login/login.html',
    '<div class="login-container" id="login">\n' +
    '    <form class="jumbotron panel" ng-submit="login()">\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="email" class="form-control input-lg" id="inputEmail3" placeholder="Email" ng-model="credentials.email" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="inputPassword3" placeholder="Password" ng-model="credentials.password" ng-required="true">\n' +
    '        </div>\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block">Log in</button>\n' +
    '        <a href="#/register" type="submit" ng-click="register()" class="btn btn-default btn-block">Register</a>\n' +
    '    </form>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Login/register.html',
    '<style>\n' +
    '.login-container {\n' +
    '	position:relative;\n' +
    '	margin-left:auto;\n' +
    '	margin-right:auto;\n' +
    '	margin-top:10%;\n' +
    '	max-width:500px;\n' +
    '	box-shadow: 0 0 2px black;\n' +
    '}\n' +
    '\n' +
    '.input {\n' +
    '	font-size:6em;\n' +
    '}\n' +
    '\n' +
    '.input {\n' +
    '	height:4em;\n' +
    '}\n' +
    '\n' +
    '.form-horizontal {\n' +
    '	margin-left:auto;\n' +
    '	margin-right:auto;\n' +
    '	max-width: 450px;\n' +
    '	padding: 3em;\n' +
    '\n' +
    '}\n' +
    '\n' +
    '</style>\n' +
    '\n' +
    '\n' +
    '<div class="login-container">\n' +
    '<form class="form-horizontal">\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <input type="text" class="form-control input-lg" placeholder="First Name" ng-model="register.email">\n' +
    '    </div>\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <input type="text" class="form-control input-lg" placeholder="Last Name" ng-model="register.email">\n' +
    '    </div>\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <input type="email" class="form-control input-lg" placeholder="Email" ng-model="register.email">\n' +
    '    </div>\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <input type="password" class="form-control input-lg" placeholder="Password" ng-model="register.password">\n' +
    '    </div>\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <input type="password" class="form-control input-lg" placeholder="Password Confirm" ng-model="register.password">\n' +
    '    </div>\n' +
    '    <div class="form-group form-group-lg">\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block" ng-click="register()">Register</button>\n' +
    '        <a href="#/login" type="submit" class="btn btn-default btn-block">Log In</a>\n' +
    '    </div>\n' +
    '</form>\n' +
    '</div>');
}]);
})();
