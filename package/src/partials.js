(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/CompStruct/compStruct.html',
    '<div ng-class="{detail: detail===true}" ng-show="show">\n' +
    '    <canvas id="{{id}}"></canvas>\n' +
    '    <div ng-repeat="stage in comp.stages" class="stage" ng-style="stageStyle">\n' +
    '        <div ng-repeat="event in stage.event" class="event-container" id="{{event.eventId}}" ng-style="stage.eventStyle">\n' +
    '            <div class="event"><p ng-show="detail">{{event.name}}</p></div>\n' +
    '        </div>\n' +
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
  $templateCache.put('/src/Home/home.html',
    '<div class="row top-push" ng-repeat="comp in competitions">\n' +
    '    <div class="col-xs-12">\n' +
    '        <accordion>\n' +
    '            <accordion-group>\n' +
    '                <accordion-heading>\n' +
    '                    <h2>{{comp.name}} - {{comp.description}}</h2>\n' +
    '                    <p>In Progress</p>\n' +
    '                    <comp-struct competition="comp" detail="true"></comp-struct>\n' +
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
    '    <form class="jumbotron panel">\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="text" class="form-control input-lg" placeholder="First Name" ng-hide="loginMode" class="ng-hide" ng-model="info.firstName">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="text" class="form-control input-lg" placeholder="Last Name" ng-hide="loginMode" ng-model="info.lastName">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="email" class="form-control input-lg" id="email" placeholder="Email" ng-model="info.email">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="password" placeholder="Password" ng-model="info.password">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="password2" ng-hide="loginMode" placeholder="Password Confirm" ng-model="info.password2">\n' +
    '        </div>\n' +
    '        \n' +
    '\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block" ng-show="loginMode" ng-click="login()">Log in</button>\n' +
    '        <button class="btn btn-default btn-block" ng-show="loginMode" ng-click="register()">Register</button>\n' +
    '\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block" ng-hide="loginMode" ng-click="register()">Register</button>\n' +
    '        <button class="btn btn-default btn-block" ng-hide="loginMode" ng-click="login()">Cancel</button>\n' +
    '\n' +
    '        <!-- <button type="submit" class="btn-lg btn-primary btn-block">Log in</button>\n' +
    '        <a href="#/register" type="submit" ng-click="register()" class="btn btn-default btn-block">Register</a> -->\n' +
    '    </form>\n' +
    '</div>');
}]);
})();
