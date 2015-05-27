angular.module('market.services', [])
    .factory('API', function ($rootScope, $http, $ionicLoading, $window) {
       var base = "https://pure-bayou-2346.herokuapp.com/";
        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                template: text,
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };
 
        $rootScope.hide = function () {
            $ionicLoading.hide();
        };
 
        $rootScope.logout = function () {
            $rootScope.setToken("");
            $rootScope.notify('Logging out...');
            $window.setTimeout(function(){
                $window.location.href = '#/auth/signin';
            }, 1000);
        };
 
        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 1000);
        };
 
        $rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else
                $rootScope.$broadcast('fetchCompleted');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };
 
        $rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
 
        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }
 
        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }
 
        return {
            signin: function (form) {
                return $http.post(base+'/api/v1/MarketPlace/auth/login', form);
            },
            signup: function (form) {
                return $http.post(base+'/api/v1/MarketPlace/auth/register', form);
            },
            saveComment: function (form, email) {
                return $http.post(base+'/api/v1/MarketPlace/data/comment', form, {
                    method: 'POST',
                    params: {
                        token: email
                    }
                });
            }
        }
    })

.service('GPSService', function($http, $q){
    var latitude = 0;
    var longitude = 0;

    var searchStatus = undefined;
    var searchData = undefined;

    function fetchCoords(cordovaGeolocation, $ionicPlatform) {
        var deferred = $q.defer();
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function (position) {
                latitude  = position.coords.latitude
                longitude = position.coords.longitude
                deferred.resolve();
            }, function(err) {
                //default
                latitude = 41.1560445
                longitude = -8.6170553
                deferred.reject();
            });

        return deferred.promise;
    };

    var searchByID = function(placeID, map) {
        var deferred = $q.defer();

        var request = {
            placeId: placeID
        };

        var service = new google.maps.places.PlacesService(map);

        service.getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                deferred.resolve(place);
            }
            else {
                deferred.reject("Não foram encontrados resultados.");
            }
        });

        return deferred.promise;
    }

    var search = function(lat, lon, radius, types) {
        var deferred = $q.defer();

        var location = new google.maps.LatLng(lat,lon);
        console.log(location.lat());
        console.log(location.lng());
        map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 15
        });

        var request = {
            location: location,
            radius: radius,
            rankby: google.maps.places.RankBy.DISTANCE,
            types: [types]
        };

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function(results, status) {
            console.log("STatus:"+status);
            console.log(results);
            switch(status) {
                case 'ZERO_RESULTS':
                    searchStatus = "No results found.";
                    break;
                case 'ERROR':
                    searchStatus = "There was a problem contacting the Google servers.";
                    break;
                case 'INVALID_REQUEST':
                    searchStatus = "This request was invalid.";
                    break;
                case 'OVER_QUERY_LIMIT':
                    searchStatus = "This application has gone over its request quota.";
                    break;
                case 'REQUEST_DENIED':
                    searchStatus = "This application is not allowed to use the PlacesService.";
                    break;
                case 'UNKNOWN_ERROR':
                    searchStatus = "The PlacesService request could not be processed due to a server error. The request may succeed if you try again.";
                    break;
                case 'OK':
                    searchStatus = "OK";
                    searchData = results;
                    break;
                default:
                    searchStatus = undefined;
                    searchData = undefined;
                    break;
            }
            deferred.resolve(searchStatus);
        });

        return deferred.promise;
    };

    return {
        fetchCoords: fetchCoords,
        searchByID: searchByID,
        search: search,
        getLongitude: function() {return longitude;},
        getLatitude: function() {return latitude;},
        getSearchData: function() {return searchData;},
        getSearchStatus: function() {return searchStatus;}
    };
})

.service('RatingService', function($http, $q) {

    function fetchGeneralInfo(placeID) {
        var deferred = $q.defer();
        $http.get("http://localhost:8080/places/"+placeID)
        .success(function(data, status, headers){
            var rating = "Sem informação.";
            if(data[0])
                rating = data[0].rating;
            deferred.resolve(rating);
        })
        .error(function(data, status, headers){
            console.log("Connection failed.");
            var rating = "Sem informação.";
            deferred.resolve(rating);
        });

        return deferred.promise;
    }

    function fetchComments(placeID) {
        var deferred = $q.defer();
        $http.get("http://localhost:8080/places/"+placeID)
        .success(function(data, status, headers){
            console.log("Connection success.");
            console.log(data);
            deferred.resolve(data);
        })
        .error(function(data, status, headers){
            console.log("Connection failed.");
            deferred.reject(status);
        });

        return deferred.promise;
    }

    return {
        fetchGeneralInfo: fetchGeneralInfo,
        fetchComments: fetchComments
    };
})