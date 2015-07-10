var routes = function(passport) {
  var express = require('express');
  var Twitter = require("twitter");
  var router = express.Router();
// var mongoose = require('mongoose');

// mongoose.connect(process.env.MONGOLAB_URI);
//
// var Ignore = mongoose.model("Ignore", {
//   ignoredUser: {type: String, required: true, unique: true}
// });

// function twitterClient(params) {
//   return new Twitter({
//     consumer_key: process.env.CONSUMER_KEY,
//     consumer_secret: process.env.CONSUMER_SECRET,
//     access_token_key: process.env.ACCESS_TOKEN_KEY,
//     access_token_secret: process.env.ACCESS_TOKEN_SECRET
//     // access_token_key: params.access_token_key,
//     // access_token_secret: params.access_token_secret
//   });
// }
//
  router.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
     // Successful authentication, redirect home.
     res.redirect('/');
   });

  router.post('/tweet', function(req, res, next) {
    var client = twitterClient(req.body);

    client.post('statuses/update', { status: req.body.tweet }, function(error, tweets, response){
      if (error) {
        console.error(error);
        res.status(500);
        return;
      }

      res.json(tweets);
    });
  });

  router.post('/search', function(req, res, next) {
    var client = twitterClient(req.body);
    var words = req.body.words.toLowerCase().split(" ");
    console.log(client);

    client.get('search/tweets', { q: words.join(" OR "), count: 100 }, function(error, tweets, response){
      if (error) {
        console.error(error);
        res.status(500);
        return;
      }

      var stats = {}, oneTweetWords, lowerCaseWord, users = {};

      tweets.statuses.forEach(function(tweet) {
        oneTweetWords = tweet.text.toLowerCase().split(" ");
        oneTweetWords.forEach(function(word) {
          lowerCaseWord = word.toLowerCase();
          if (words.indexOf(lowerCaseWord) >= 0) {
            stats[word] = stats[word] || 0;
            stats[word]++;
            var ratio = tweet.user.friends_count/tweet.user.followers_count;
            tweet.user.ratio = ratio > 1 ? 1.0/ratio : ratio;
            users[tweet.user.screen_name] = tweet.user;
          }
        });
      });

      res.json({ stats: stats, users: users });
    });

  });

  router.post('/follow', function(req, res, next) {
    var client = twitterClient(req.body);

    client.post('friendships/create', { screen_name: req.body.screen_name }, function(error, user, response){
      if (error) {
        console.error(error);
        res.status(500);
        return;
      }

      res.json(user);
    });

  });

  // router.post('/ignores', function(req, res, next) {
  //   var ignore = new Ignore(req.body);
  //   console.log(req.body);
  //   console.log(ignore);
  //   ignore.save(function(err, ignoredUser) {
  //     if (err) {
  //       res.status(400).json({error: "Validation Failed"});
  //     }
  //     res.json(ignoredUser);
  //   });
  // });
  //
  // router.get('/ignores', function(req, res, next) {
  //   Ignore.find({}).exec(function(err, ignores) {
  //     if(err) {
  //       console.log(err);
  //       res.status(400).json({error: "Could not read questions data"});
  //     }
  //     res.json(ignores);
  //   });
  // });

  return router;
};
module.exports = routes;
