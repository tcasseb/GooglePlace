'use strict';

angular
    .module('app.services')
    .constant('API_KEY', 'AIzaSyCIO5pZMBQ5NmMCwBWsFBsnR9rpZRdk29Q')
    .constant('BASE_URL', 'https://maps.googleapis.com/maps/api')
    .factory('GoogleMapsService', dataService);

function dataService($http, API_KEY, BASE_URL, $log, moment) {

    var data = {
        'getAddressByZipCode': getAddressByZipCode,
        'getPlacesByLatLng': getPlacesByLatLng
    };

    function makeRequest(url, params) {
        var requestUrl = BASE_URL + '/' + url + '?key=' + API_KEY;
        angular.forEach(params, function(value, key){
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http({
            'url': requestUrl,
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            },

            'cache': true
        }).then(function(response){
            return response.data;
        }).catch(dataServiceError);
    }

    function getAddressByZipCode(zipCode) {
        return makeRequest('geocode/json', {'address': zipCode}).then(function(data){
            return data.results;
        });
    }

    function getPlacesByLatLng(latitude, longitude, type, radius) {
        /*return makeRequest('place/nearbysearch/json', {'location': latitude + ',' + longitude, 'type': type, 'radius': radius}).then(function(data){
            return data.results;
        });*/


    }

    return data;

    function dataServiceError(errorResponse) {
        $log.error('XHR Failed for GoogleMapsService');
        $log.error(errorResponse);
        return errorResponse;
    }
}