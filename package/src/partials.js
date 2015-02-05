(function(module) {
try {
  module = angular.module('app-partials');
} catch (e) {
  module = angular.module('app-partials', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/src/Home/home.html',
    'Home View');
}]);
})();
