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
