// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('market', ['ionic', 'market.controllers', 'market.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    /*$ionicPlatform.registerBackButtonAction(function (event) {
      if($state.current.name=='user.home'){
        ionic.Platform.exitApp();
      }
      else {
        ionic.Platform.backHistory();
      }
    }, 101);*/
  })
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $stateProvider
    .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html"
    })

    .state('auth.signin', {
      url: '/signin',
      views: {
        'auth-signin': {
          templateUrl: 'templates/auth-signin.html',
          controller: 'SignInCtrl'
        }
      }
    })

    .state('auth.signup', {
      url: '/signup',
      views: {
        'auth-signup': {
          templateUrl: 'templates/auth-signup.html',
          controller: 'SignUpCtrl'
        }
      }
    })

    .state('user', {
      url: '/user',
      abstract: true,
      templateUrl: 'templates/user.html'
    })

    .state('user.home', {
      url: '/home',
      views: {
        'user-home': {
          templateUrl: 'templates/user-home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('user.map', {
      url: '/map',
      views: {
        'user-map': {
          templateUrl: 'templates/user-map.html',
          controller: 'MapCtrl'
        }
      }
    })

    .state('user.options', {
      url: '/options',
      views: {
        'user-options': {
          templateUrl: 'templates/user-options.html',
          controller: 'OptionsCtrl'
        }
      }
    })

    .state('user.profile', {
      url: '/profile',
      views: {
        'user-profile': {
          templateUrl: 'templates/user-profile.html'
        }
      }
    })

    .state('user.search', {
      url: '/search',
      views: {
        'user-home': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      }
    })

    .state('user.lastplaces', {
      url: '/lastplaces',
      views: {
        'user-home': {
          templateUrl: 'templates/places.html'
        }
      }
    })

    .state('user.notif', {
      url: '/notif',
      views: {
        'user-home': {
          templateUrl: 'templates/notif.html'
        }
      }
    })

    .state('user.local', {
      url: '/local/:id',
      views: {
        'user-home': {
          templateUrl: 'templates/local.html',
          controller: 'LocalCtrl'
        }
      }
    })

    .state('user.comment', {
      url: '/comment/:id',
      views: {
        'user-home': {
          templateUrl: 'templates/comment.html',
          controller: 'CommentCtrl'
        }
      }
    })

  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  $urlRouterProvider.otherwise('/auth/signin');
});