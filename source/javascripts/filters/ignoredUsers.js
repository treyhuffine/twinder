angular.module('sif')
.filter('ignoredFilter', function() {
  return function(users, ignores) {
    var unIgnored = {};
    angular.forEach(users, function(userData, screenName) {
      angular.forEach(ignores, function(ignoredData, idx) {
        console.log(userData);
        console.log(ignoredData);
        if (ignoredData.ignoredUser === screenName) {
          unIgnored[screenName] = userData;
        }
      });
    });
    return unIgnored;
  };
});
