angular.module('sif')
.filter('ignoredFilter', function() {
  return function(users, ignores) {
    var unIgnored = {};
    angular.forEach(users, function(userData, screenName) {
      if (ignores.indexOf(screenName) === -1) {
        unIgnored[screenName] = userData;
      }
    });
    return unIgnored;
  };
});
