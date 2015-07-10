'use strict';

var app = angular.module('sif', ['ui.router']);

angular.module('sif')
.run(function(){
  console.log('Twinder!');
});

'use strict';

angular.module('sif')
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home/home.html'});
});

'use strict';

angular.module('sif')
.constant('urls',{
  'apiUrl': ''
});

angular.module('sif')
.controller("mainCtrl", function($scope, twitterUser) {
  $scope.tags = [];
  $scope.tweet = "";
  $scope.ignores = [];

  $scope.btnStyle = function(ratio) {
    var greenScale = Math.floor(125 * ratio);
    return { 'background-color': 'rgb(0,' + greenScale + ',0)' };
  };

  $scope.follow = function(screenName) {
    twitterUser.follow(screenName)
    .success(function(data) {
      console.log(data);
      $scope.data.users[screenName].following = true;
    })
    .catch(function(error) {
      console.log(error);
    });

    return false;
  };

  $scope.search = function() {
    console.log("searching");
    twitterUser.search($scope.words)
    .success(function(data) {
      console.log(data);
      $scope.data = data;
    })
    .catch(function(error) {
      console.log(error);
    });

    return false;
  };

  $scope.sendTweet = function() {
    twitterUser.sendTweet($scope.tweet)
    .success(function(resp) {
      $scope.tweet = "";
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  $scope.includeInTweet = function(tag) {
    $scope.tweet = $scope.tweet + " " + tag;
  };

  $scope.ignoreUser = function(ignoreName) {
    twitterUser.ignoreUser(ignoreName)
      .success(function(resp) {
        console.log(resp);
        $scope.ignores.push(resp.ignoredUser);
        $scope.data.users[ignoreName] = {};
      })
      .catch(function(error) {
        console.log(error);
      });
  };
});

'use strict';

angular.module('sif')
.controller('NavCtrl', function($scope){
  // $scope.login = FBService.twitterLogin;
  // $scope.logout = FBService.twitterLogout;
  //
  // $scope.currentUser = FBService.currentUser;
});

'use strict';

angular.module('sif')
.filter('friendsFilter', function() {
  return function(users, showFriends) {
    if (showFriends) {
      return users;
    }

    var filteredUsers = {};
    angular.forEach(users, function(userData, screenName) {
      if (!userData.following) {
        filteredUsers[screenName] = userData;
      }
    });
    return filteredUsers;
  };
});

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

'use strict';

// angular.module('sif')
// .service('FBService', function(urls){
//   // var fb = this;
//   //
//   // this.db = new Firebase(urls.firebaseUrl);
//   //
//   // this.db.onAuth(function(authData) {
//   //   if (authData) {
//   //     fb.currentUser = authData.twitter;
//   //     console.log("Logged in: ", authData);
//   //   }
//   // });
//   //
//   // this.twitterLogout = function() {
//   //   fb.db.unauth();
//   // };
//   //
//   // this.twitterLogin = function() {
//   //   fb.db.authWithOAuthRedirect("twitter", function(error) {
//   //     if (error) {
//   //       console.log("Login Failed!", error);
//   //     }
//   //   });
//   // };
// });

'use strict';

angular.module('sif')
.service('twitterUser', function(urls, $http) {

  var withTokens = function(obj) {
    // obj.access_token_key = FBService.currentUser.accessToken;
    // obj.access_token_secret = FBService.currentUser.accessTokenSecret;
    return obj;
  };

  this.search = function(words) {
    var data = withTokens({ words: words });
    return $http.post(urls.apiUrl + "/search", data);
  };

  this.sendTweet = function(tweet) {
    var data = withTokens({ tweet: tweet });
    return $http.post(urls.apiUrl + "/tweet", data);
  };

  this.follow = function(screenName) {
    var data = withTokens({ screen_name: screenName });
    return $http.post(urls.apiUrl + "/follow", data);
  };

  this.ignoreUser = function(screenName) {
    return $http.post(urls.apiUrl + "/ignores", {ignoredUser: screenName});
  };
});
