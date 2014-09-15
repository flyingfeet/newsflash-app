// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('newsflash', ['ionic', 'controllers', 'services', 'restangular', 'ui.bootstrap'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.newsflash', {
    url: "/newsflash",
    views: {
      'menuContent' :{
        templateUrl: "templates/newsflash.html",
        controller: 'NewsflashCtrl'
      }
    }
  })

  .state('app.timetable', {
    url: "/timetable",
    views: {
      'menuContent' :{
        templateUrl: "templates/timetable.html"
      }
    }
  })
  .state('app.trainer', {
    url: "/trainer",
    views: {
      'menuContent' :{
        templateUrl: "templates/trainer.html",
      }
    }
  })

  .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent' :{
        templateUrl: "templates/feedback.html",
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/newsflash');
})

.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl("http://newsserver-eurodance.rhcloud.com")
})

.run(function(PushProcessingService) {
   //run once for the app
   PushProcessingService.initialize();
});
