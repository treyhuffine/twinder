angular.module('sif')
.filter('ignoredFilter', function() {
  return function(users, ignores) {
    var unIgnored = {};
    angular.forEach(users, function(userData, screenName) {
      angular.forEach(ignores, function(ignoredData, idx) {
        if (ignoredData.ignoredUser === screenName) {
          unIgnored[screenName] = userData;
        }
      });
    });
    return unIgnored;
  };
});
