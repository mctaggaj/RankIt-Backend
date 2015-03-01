(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Comp/comp.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <p>View Competition Page</p>\n' +
    '    <p>{{competition.name}}</p>\n' +
    '    <p>{{competition.subject}}</p>\n' +
    '    <p>{{competition.description}}</p>\n' +
    '    <p>{{competition.location}}</p>\n' +
    '    <p>{{competition.public}}</p>\n' +
    '    <p>{{competition.state}}</p>\n' +
    '    <p>{{competition.streamUrl}}</p>\n' +
    '\n' +
    '    <button class="btn btn-primary" ng-click="edit(competition.competitionId)">Edit This Competition</button>\n' +
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
  $templateCache.put('/src/Event/event.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <p>View Competition Page</p>\n' +
    '    <p>{{competition.name}}</p>\n' +
    '    <p>{{competition.subject}}</p>\n' +
    '    <p>{{competition.description}}</p>\n' +
    '    <p>{{competition.location}}</p>\n' +
    '    <p>{{competition.public}}</p>\n' +
    '    <p>{{competition.state}}</p>\n' +
    '    <p>{{competition.streamUrl}}</p>\n' +
    '\n' +
    '    <button class="btn btn-primary" ng-click="edit(competition.competitionId)">Edit This Competition</button>\n' +
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
    '<!--Andrew Welton-->\n' +
    '<div class="row top-push">\n' +
    '    <div class="col-xs-8">\n' +
    '        <accordion ng-repeat="comp in competitions | homeFilter:subjects">\n' +
    '            <accordion-group>\n' +
    '                <accordion-heading>\n' +
    '                    <h2>{{comp.name}} - {{comp.description}}</h2>\n' +
    '                    <p>In Progress</p>\n' +
    '                </accordion-heading>\n' +
    '                <comp-struct competition="comp" detail="true">\n' +
    '                </comp-struct>\n' +
    '                <h4>Taking place at {{comp.location}}</h4>\n' +
    '                <p>Competing in: {{comp.subject}}</p>\n' +
    '                <span ng-if="comp.streamURL">\n' +
    '                    <h2>Stream</h2>\n' +
    '                    <iframe src="{{comp.streamURL}}" frameborder="0" scrolling="no" height="378" width="620"></iframe>\n' +
    '                </span>\n' +
    '                <a ui-sref="Comp({compId:{{comp.competitionId}}})">View Competition Page</a>\n' +
    '            </accordion-group>\n' +
    '        </accordion>\n' +
    '    </div>\n' +
    '    <div class="col-xs-4">\n' +
    '        <div class="panel" style="padding:0.5em">\n' +
    '            <label for="competitionSearch">Search for a Competition:</label>\n' +
    '            <input type="text" id="competitionSearch" class="form-control" placeholder="Search"/>\n' +
    '            <label>Or</label>\n' +
    '            <label>Filter By:</label>\n' +
    '            <div class="checkbox" ng-repeat="(subject, item) in subjects">\n' +
    '                <label>\n' +
    '                    <input type="checkbox" ng-model="item.checked"> {{subject}}\n' +
    '                </label>\n' +
    '            </div>\n' +
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
  $templateCache.put('/src/Login/login.html',
    '<!-- \n' +
    '    frontend code for login and register page\n' +
    '    author: Timothy Engel\n' +
    '-->\n' +
    '\n' +
    '<div class="login-container" id="login">\n' +
    '\n' +
    '    <div class="alert alert-danger alert-dismissible" ng-show="error.enabled" role="alert">\n' +
    '        <button type="button" class="close" aria-label="Close" ng-click="error.enabled = false"><span aria-hidden="true">&times;</span></button>\n' +
    '\n' +
    '        <!-- <strong>{{ error.title }}</strong> -->\n' +
    '        <!-- <div ng-bind-html="error.msg" style="display:inline;"></div> -->\n' +
    '        <div dynamic="error" style="display:inline;"></div>\n' +
    '\n' +
    '\n' +
    '        <!-- <a class="alert-link" ng-click="register()">register</a> -->\n' +
    '        <!-- <a class="alert-link" ng-click="register()"> {{ message }}</a> -->\n' +
    '\n' +
    '    </div>\n' +
    '    <form class="jumbotron panel">\n' +
    '        \n' +
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

(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Stage/stage.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <p>View Stage Page</p>\n' +
    '    <p>{{stage.name}}</p>\n' +
    '    <p>{{stage.subject}}</p>\n' +
    '    <p>{{stage.description}}</p>\n' +
    '    <p>{{stage.location}}</p>\n' +
    '    <p>{{stage.state}}</p>\n' +
    '    <button class="btn btn-primary" ui-sref="editStage({\'stage\':{{stage}}})">Edit This Stage</button>\n' +
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
  $templateCache.put('/src/Comp/Create/createComp.html',
    '<!-- Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="createCompForm" ng-submit="submit()">\n' +
    '            <h1>Create a new Competition</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compName">Competition Name *</label>\n' +
    '                <input id="compName" class="form-control" type="text" placeholder="Competition Name" ng-model="comp.name"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compPrivacy">Public Competition</label>\n' +
    '                <select id="compPrivacy" class="form-control" ng-model="comp.public" ng-init="comp.public=\'1\'">\n' +
    '                    <option value="1">Public</option>\n' +
    '                    <option value="0">Private</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compState">Competition State</label>\n' +
    '                <select id="compState" class="form-control" ng-model="comp.state" ng-init="comp.state=\'Upcoming\'">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compSubject">Competing in *</label>\n' +
    '                <input id="compSubject" class="form-control" type="text" placeholder="Subject of Competition" ng-required="true" ng-model="comp.subject"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compDescription">Competition Description</label>\n' +
    '                <input id="compDescription" class="form-control" type="text" placeholder="Describe the Competition" ng-model="comp.description"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compLocation">Competition Location</label>\n' +
    '                <input id="compLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="comp.location"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Create Competition</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
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
  $templateCache.put('/src/Comp/StructView/compStruct.html',
    '<!--\n' +
    '/**\n' +
    ' * @author Jason McTaggart\n' +
    ' * Used for displaying a competition\'s structure\n' +
    ' */\n' +
    '-->\n' +
    '<div ng-class="{detail: detail===true}" ng-show="show">\n' +
    '    <canvas id="{{id}}"></canvas>\n' +
    '    <div class="stage-container">\n' +
    '        <div ng-repeat="stage in comp.stages" class="stage" ng-style="stageStyle">\n' +
    '            <div ng-repeat="event in stage.events" class="event-container" id="{{event.eventId}}" ng-style="eventStyle[stage.stageId]">\n' +
    '\n' +
    '                <div class="event"><p ng-show="detail">{{event.name}}</p></div>\n' +
    '            </div>\n' +
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
  $templateCache.put('/src/Comp/Edit/editComp.html',
    '<!--Andrew Welton -->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="editCompForm" ng-submit="submit()">\n' +
    '            <h1>Edit a Competition</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compName">Competition Name *</label>\n' +
    '                <input id="compName" class="form-control" type="text" placeholder="Competition Name" ng-model="comp.name" value="{{comp.name}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compPrivacy">Public Competition</label>\n' +
    '                <select id="compPrivacy" class="form-control" ng-model="comp.public" value="{{comp.public}}">\n' +
    '                    <option value="1">Public</option>\n' +
    '                    <option value="0">Private</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compState">Competition State</label>\n' +
    '                <select id="compState" class="form-control" ng-model="comp.state"  value="{{comp.state}}">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compSubject">Competing in</label>\n' +
    '                <input id="compSubject" class="form-control" type="text" placeholder="Subject of Competition" ng-model="comp.subject" value="{{comp.subject}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compDescription">Competition Description</label>\n' +
    '                <input id="compDescription" class="form-control" type="text" placeholder="Describe the Competition" ng-model="comp.description" value="{{comp.description}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compLocation">Competition Location</label>\n' +
    '                <input id="compLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="comp.location" value="{{comp.location}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <p>Stages</p>\n' +
    '                <div ng-repeat="stage in stages">\n' +
    '                    <a ui-sref="Stage({\'stage\':{{stage}}})">{{stage.name}}</a>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" ng-click="addStage(comp)">Add Stage</a>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Save Competition</button>\n' +
    '            </div>\n' +
    '\n' +
    '        </form>\n' +
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
  $templateCache.put('/src/Event/Create/createEvent.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="createCompForm" ng-submit="submit()">\n' +
    '            <h1>Create a new Event</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="eventName">Event Name *</label>\n' +
    '                <input id="eventName" class="form-control" type="text" placeholder="Event Name" ng-model="event.name"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compLocation">Event Location</label>\n' +
    '                <input id="compLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="event.location"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="eventState">Event State</label>\n' +
    '                <select id="eventState" class="form-control" ng-model="event.state" ng-init="event.state=\'Upcoming\'">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Create Event</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
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
  $templateCache.put('/src/Event/Edit/editEvent.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="editCompForm" ng-submit="submit()">\n' +
    '            <h1>Edit a Competition</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compName">Competition Name *</label>\n' +
    '                <input id="compName" class="form-control" type="text" placeholder="Competition Name" ng-model="comp.name" value="{{comp.name}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compPrivacy">Public Competition</label>\n' +
    '                <select id="compPrivacy" class="form-control" ng-model="comp.public" ng-init="comp.public=\'Public\'" value="{{comp.public}}">\n' +
    '                    <option>Public</option>\n' +
    '                    <option>Private</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compState">Competition State</label>\n' +
    '                <select id="compState" class="form-control" ng-model="comp.state" ng-init="comp.state=\'Upcoming\'" value="{{comp.state}}">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compSubject">Competing in</label>\n' +
    '                <input id="compSubject" class="form-control" type="text" placeholder="Subject of Competition" ng-model="comp.subject" value="{{comp.subject}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compDescription">Competition Description</label>\n' +
    '                <input id="compDescription" class="form-control" type="text" placeholder="Describe the Competition" ng-model="comp.description" value="{{comp.description}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compLocation">Competition Location</label>\n' +
    '                <input id="compLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="comp.location" value="{{comp.location}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Save Competition</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
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
  $templateCache.put('/src/Stage/Create/createStage.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="createStageForm" ng-submit="submit()">\n' +
    '            <h1>Create a new Stage for {{comp.name}}</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageName">Stage Name *</label>\n' +
    '                <input id="stageName" class="form-control" type="text" placeholder="Stage Name" ng-model="stage.name"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageState">Stage State</label>\n' +
    '                <select id="stageState" class="form-control" ng-model="stage.state" ng-init="stage.state=\'Upcoming\'">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageDescription">Stage Description</label>\n' +
    '                <input id="stageDescription" class="form-control" type="text" placeholder="Describe the Stage" ng-model="stage.description"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageLocation">Stage Location</label>\n' +
    '                <input id="stageLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="stage.location"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Create Stage</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
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
  $templateCache.put('/src/Stage/Edit/editStage.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <div class="col-xs-12">\n' +
    '        <form id="editStageForm" ng-submit="submit()">\n' +
    '            <h1>Edit Stage</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageName">Stage Name *</label>\n' +
    '                <input id="stageName" class="form-control" type="text" placeholder="Stage Name" ng-model="stage.name" value="{{stage.name}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageState">Stage State</label>\n' +
    '                <select id="stageState" class="form-control" ng-model="stage.state" ng-init="stage.state=\'Upcoming\'" value="{{stage.state}}">\n' +
    '                    <option>Upcoming</option>\n' +
    '                    <option>In Progress</option>\n' +
    '                    <option>Finished</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageDescription">Stage Description</label>\n' +
    '                <input id="stageDescription" class="form-control" type="text" placeholder="Describe the Stage" ng-model="stage.description" value="{{stage.description}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="stageLocation">Stage Location</label>\n' +
    '                <input id="stageLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="stage.location" value="{{stage.location}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <p>Events</p>\n' +
    '                <div ng-repeat="event in events">\n' +
    '                    <a ui-sref="Stage({\'stage\':{{event}}})">{{event.name}}</a>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" ui-sref="createEvent({\'stage\':{{stage}}})">Add Event</a>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Save Event</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
