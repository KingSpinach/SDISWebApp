angular.module('market.controllers', ['market.services', ])
 
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his bucketlist
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/user/home');
    }
 
    $scope.user = {
        email: "",
        password: ""
    };
 
    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
        	$rootScope.notify("Please enter valid credentials");
        	return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/user/home');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})

.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };
 
    $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/user/home');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.notify("A user with this email already exists");
            }
            else
            {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }
            
        });
    }
})

.controller('HomeCtrl', function($scope, $state, $window, $ionicHistory){
    $scope.changeState = function($stt){
        $state.go($stt, {});
    }


    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
})

.controller('OptionsCtrl', function($scope, $state){

})

.controller('SearchCtrl', function($scope, $state, $cordovaGeolocation, GPSService) {
  
    //search button
  //$scope.search = function() {
    var latitude;
    var longitude;
     
    GPSService.fetchCoords($cordovaGeolocation)
      .then(function(r){
            latitude = GPSService.getLatitude();//41.1560445
            longitude = GPSService.getLongitude();//-8.6170553
            $scope.lat = latitude;
            $scope.lon = longitude;
            var search = GPSService.search(latitude,longitude,2000,'grocery_or_supermarket')
              .then(function(r){
                console.log(search);
                var status = GPSService.getSearchStatus();
                  if(status == undefined)
                    $scope.status = "An error occured. Please perform the search again.";
                  else if(status != "OK")
                    $scope.status = search;
                  else {
                    $scope.status = "";
                    $scope.places = GPSService.getSearchData();
                  }
              });

      });
  //}  
})

.controller('MapCtrl', function($scope, $ionicLoading) {
 
    
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("maptab"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
 
})

.controller('LocalCtrl', function($scope, $stateParams, GPSService/*, RatingService*/, $rootScope, API, $state, $window) {
  
  var pId = $stateParams.id;
  $scope.imagem = undefined;
  $scope.titulo = undefined;
  $scope.morada = undefined;
  $scope.telefone = undefined;
  $scope.tipos = undefined;
  $scope.aberturas = undefined;
  $scope.aberto = undefined;
  $scope.website = undefined;
  $scope.preco = undefined;

  /*RatingService.fetchGeneralInfo(pId).then(function(response){
      $scope.rate = response;
  });*/

  var mapOptions = {
    center: new google.maps.LatLng(37.3000, -120.4833),
    zoom: 16
  };

  var map = new google.maps.Map(document.getElementById("maplocal"), mapOptions);

  GPSService.searchByID(pId, map).then(function(response) {
    $scope.imagem = response.icon;
    $scope.titulo = response.name;
    $scope.morada = response.formatted_address;
    $scope.telefone = (response.formatted_phone_number? response.formatted_phone_number : "No data available");
    $scope.tipos = response.types;

    var opening_hours = response.opening_hours;

    if(opening_hours != undefined) {
      $scope.aberto = response.opening_hours.open_now;
      $scope.aberturas = response.opening_hours.periods;
      console.log("RAW");
      console.log(response.opening_hours.periods);
    }
    else {
      $scope.aberto = "No data available";
    }
    
    $scope.website = (response.website? response.website : "No data available");
    $scope.preco = (response.price_level? response.price_level : "No data available");
    var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(response.geometry.location.A, response.geometry.location.F),
        map: map,
        title: "Local"
    });
    map.setCenter(new google.maps.LatLng(response.geometry.location.A, response.geometry.location.F));
    $scope.map = map;

  });
  
  $scope.comment = function(){
    //$state.go('user.comment', {id:$stateParams.id});
    $window.location.href = ('#/user/comment/'+$stateParams.id);
    /*var form = {
                user: $rootScope.getToken(),
                comment: "ola"
            }

            console.log(form.comment);
 
            API.saveComment(form, form.user)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                });*/
  };
  
})

.controller('CommentCtrl', function($scope, $rootScope, API, $stateParams, $window){
    $scope.user = {
        comment: ""
    };

    $scope.ratingstar = function(rat){
        $scope.rating = rat;
    }

    $scope.submit = function(){
        var form = {
            user: $rootScope.getToken(),
            comment: $scope.user.comment,
            rating: $scope.rating,
            placeId: $stateParams.id
        }
 
        API.saveComment(form, form.user)
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Comment saved!");
                $rootScope.doRefresh(1);
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });

        $window.location.href = ('#/user/local/'+$stateParams.id);
    }

})