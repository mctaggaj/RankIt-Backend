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
    '    <div id="comp-info" class="pull-left">\n' +
    '        <p>View Competition Page</p>\n' +
    '        <p>{{competition.name}}</p>\n' +
    '        <p>{{competition.subject}}</p>\n' +
    '        <p>{{competition.description}}</p>\n' +
    '        <p>{{competition.location}}</p>\n' +
    '        <p>{{competition.public}}</p>\n' +
    '        <p>{{competition.state}}</p>\n' +
    '        <p>{{competition.streamUrl}}</p>\n' +
    '        <comp-struct comp="{{competition}}" detail="true"></comp-struct>\n' +
    '        <button class="btn btn-primary" ng-if="competition.competitionId" ui-sref="editComp({comp:{{competition}},compId:{{competition.competitionId}}})">Edit This Competition</button>\n' +
    '    </div>\n' +
    '    <div id="user-info" class="pull-right">\n' +
    '        <h3>People</h3>\n' +
    '        <a ng-repeat="user in users" ui-sref="Profile({user:{{user.userObject}},userId:{{user.userObject.id}})">{{user.userObject.firstName}} {{user.userObject.lastName}} - {{user.role}}</a>\n' +
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
  $templateCache.put('/src/Event/event.html',
    '<!--Andrew Welton-->\n' +
    '<div class="row panel top-push">\n' +
    '    <p>View Event Page</p>\n' +
    '    <p>{{event.location}}</p>\n' +
    '    <p>{{event.name}}</p>\n' +
    '    <p>{{event.state}}</p>\n' +
    '    <button class="btn btn-primary" ng-if="event" ui-sref="editEvent({event:{{event}},\'eventId\':{{event.eventId}}})">Edit This Event</button>\n' +
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
    '        <accordion ng-repeat="comp in competitions | homeFilter:subjects" class="comp-row">\n' +
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
    '    <div class="alert alert-danger alert-dismissible login-alert" ng-show="error.enabled" role="alert">\n' +
    '        <button type="button" class="close" aria-label="Close" ng-click="error.enabled = false"><span aria-hidden="true">&times;</span></button>\n' +
    '        <div dynamic="error" style="display:inline;"></div>\n' +
    '\n' +
    '    </div>\n' +
    '    <form class="jumbotron panel login-form" ng-show="loginMode" ng-submit="login()">\n' +
    '\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="email" class="form-control input-lg" id="email" placeholder="Email" ng-model="info.email" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="password" placeholder="Password" ng-model="info.password" ng-required="true">\n' +
    '        </div>\n' +
    '\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block">Log in</button>\n' +
    '        <a class="btn btn-default btn-block" ng-click="register()">Register</a>\n' +
    '    </form>\n' +
    '    <form class="jumbotron panel" ng-hide="loginMode" ng-submit="register()">\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="text" class="form-control input-lg" placeholder="First Name" class="ng-hide" ng-model="info.firstName" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="text" class="form-control input-lg" placeholder="Last Name" ng-model="info.lastName" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="email" class="form-control input-lg" id="email" placeholder="Email" ng-model="info.email" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="password" placeholder="Password" ng-model="info.password" ng-required="true">\n' +
    '        </div>\n' +
    '        <div class="form-group form-group-lg">\n' +
    '            <input type="password" class="form-control input-lg" id="password2" placeholder="Password Confirm" ng-model="info.password2" ng-required="true">\n' +
    '        </div>\n' +
    '\n' +
    '        <button type="submit" class="btn-lg btn-primary btn-block">Register</button>\n' +
    '        <a class="btn btn-default btn-block" ng-click="login()">Cancel</a>\n' +
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
  $templateCache.put('/src/Profile/profile.html',
    '<!-- \n' +
    '    frontend code for profile page\n' +
    '    author: Timothy Engel\n' +
    '-->\n' +
    '<div class="row panel top-push">\n' +
    '	<h1>Hey its a profile page!</h1>\n' +
    '\n' +
    '	<div id="profileInfo">\n' +
    '		<b>Username: </b><p>{{user.userName}}</p>\n' +
    '		<b>First Name: </b><p>{{user.firstName}}</p>\n' +
    '		<b>Last Name: </b><p>{{user.lastName}}</p>\n' +
    '	</div>\n' +
    '\n' +
    '\n' +
    '	<form id="changePassword" class="jumbotron panel" ng-show="extras" ng-submit="changePassword()">\n' +
    '		<div class="form-group form-group-lg">\n' +
    '		    <input type="text" class="form-control input-lg" placeholder="Current Password" class="ng-hide" ng-model="newPassword.current" ng-required="true">\n' +
    '		</div>\n' +
    '		<div class="form-group form-group-lg">\n' +
    '		    <input type="text" class="form-control input-lg" placeholder="New Password" ng-model="newPassword.password1" ng-required="true">\n' +
    '		</div>\n' +
    '		<div class="form-group form-group-lg">\n' +
    '		    <input type="text" class="form-control input-lg" placeholder="New Password Confirm" ng-model="newPassword.password2" ng-required="true">\n' +
    '		</div>\n' +
    '		<button type="submit" class="btn-lg btn-primary btn-block">Change</button>\n' +
    '	</form>\n' +
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
    '    <button class="btn btn-primary" ng-if="stage" ui-sref="editStage({\'stage\':{{stage}},\'stageId\':{{stage.stageId}}})">Edit This Stage</button>\n' +
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
    '                <label for="compSubject">Competing in *</label>\n' +
    '                <input id="compSubject" class="form-control" type="text" placeholder="Subject of Competition" ng-required="true" ng-model="comp.subject"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compParticipants">Number of Participants</label>\n' +
    '                <select id="compParticipants" class="form-control" ng-model="numParticipants" ng-init="numParticipants=\'8\'" popover="Set to zero for manual competition setup." popover-trigger="mouseenter">\n' +
    '                    <option>0</option>\n' +
    '                    <option>2</option>\n' +
    '                    <option>4</option>\n' +
    '                    <option>8</option>\n' +
    '                    <option>16</option>\n' +
    '                    <option>32</option>\n' +
    '                    <option>64</option>\n' +
    '                    <option>128</option>\n' +
    '                    <option>256</option>\n' +
    '                    <option>512</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="compParticipantsPerEvent">Participants Per Event</label>\n' +
    '                <select id="compParticipantsPerEvent" class="form-control" ng-model="participantsPerEvent" ng-init="participantsPerEvent=\'2\'">\n' +
    '                    <option>2</option>\n' +
    '                    <option>3</option>\n' +
    '                    <option>4</option>\n' +
    '                    <option>5</option>\n' +
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
    '                    <a ui-sref="Stage({\'stage\':{{stage}},\'stageId\':{{stage.stageId}}})">{{stage.name}}</a>\n' +
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
    '            <h1>Edit an Event</h1>\n' +
    '            <p>* Indicates a required field.</p>\n' +
    '            <div class="form-group">\n' +
    '                <label for="eventName">Event Name *</label>\n' +
    '                <input id="eventName" class="form-control" type="text" placeholder="Event Name" ng-model="event.name" value="{{event.name}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="eventState">Event State</label>\n' +
    '                <select id="eventState" class="form-control" ng-model="event.state" value="{{event.state}}">\n' +
    '                    <option ng-repeat="state in states">{{state}}</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <label for="eventLocation">Event Location</label>\n' +
    '                <input id="eventLocation" class="form-control" type="text" placeholder="Where is it?" ng-model="event.location" value="{{event.location}}"/>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Save Event</button>\n' +
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
    '                <select id="stageState" class="form-control" ng-model="stage.state" value="{{stage.state}}">\n' +
    '                    <option ng-repeat="state in states">{{state}}</option>\n' +
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
    '                    <a ui-sref="Event({\'event\':{{event}},\'eventId\':{{event.eventId}}})">{{event.name}}</a>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" ng-if="stage" ui-sref="createEvent({\'stage\':{{stage}}})">Add Event</a>\n' +
    '            </div>\n' +
    '            <div class="form-group">\n' +
    '                <button class="btn btn-primary" type="submit">Save Event</button>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
