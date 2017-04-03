'use strict';
angular
    .module('app.core')
    .controller('HomeController', function($scope, PageValues, GoogleMapsService) {

        //Set page title and description
        PageValues.title = "Busca por CEP";
        PageValues.description = "Busca de oficinas mecânicas utilizando API Google Places.";

        //Setup view model object
        var vm = this;

        vm.pageTitle = PageValues.title;
        vm.pageDescription = PageValues.description;

        vm.messages = {
            address: "É necessário digitar o CEP ou parte do endereço.",
            places: "Aguardando a busca ser iniciada :)"
        }

        vm.location = {};
        vm.location.searchStarted = false;
        vm.location.addressCompleted = false;
        vm.location.placesCompleted = false;
        vm.location.zipCode = "";
        vm.location.address = "";
        vm.location.position = {};

        vm.places = {};
        vm.places.completed = false;
        vm.places.open_now = false;
        vm.places.results = [];
        vm.places.resultsFilter = [];

        vm.filter = {};
        vm.filter.rating = 1;

        if (document.getElementById('map') != null) {
            vm.location.position = new google.maps.LatLng(-23.5475000,-46.6361100);
            vm.map = new google.maps.Map(document.getElementById('map'), {
                center: vm.location.position,
                zoom: 15
            });
        }



        //Functions
        vm.getAddressByZipCode = function getAddressByZipCode() {
            vm.location.searchStarted = true;
            vm.location.addressCompleted = false;
            vm.location.placesCompleted = false;
            vm.places.resultsFilter = vm.places.results = [];
            vm.location.address = "";
            vm.filter.rating = 1;

            if (vm.location != null && vm.location.zipCode != null && vm.location.zipCode != "") {
                vm.messages.address = "Carregando...";
                vm.messages.places = "Carregando...";
                GoogleMapsService.getAddressByZipCode(vm.location.zipCode).then(function(response){

                    if (response != null && response.length != null && response.length > 0) {

                        vm.location.address = response[0].formatted_address;
                        vm.location.position = new google.maps.LatLng(response[0].geometry.location.lat, response[0].geometry.location.lng);

                        var location =
                        vm.map = new google.maps.Map(document.getElementById('map'), {
                            center: vm.location.position,
                            zoom: 15
                        });
                        vm.location.addressCompleted = true;
                        vm.getPlacesByLatLng();
                    } else {
                        vm.messages.address ="Nenhum endereço foi encontrado. Tente novamente";
                        vm.messages.places = "Aguardando a busca ser iniciada :)";
                    }
                });
            } else {
                vm.messages.address = "É necessário digitar o CEP ou parte do endereço.";
            };
        };


        vm.getPlacesByLatLng = function getPlacesByLatLng() {
            var request = {
                location: vm.location.position,
                radius: '500',
                types: ['car_repair'],
                openNow: vm.places.open_now
            };
            var service = new google.maps.places.PlacesService(vm.map);
            service.nearbySearch(request, function (results, status) {

                vm.location.searchStarted = false;

                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    vm.places.resultsFilter = vm.places.results = results;

                    if (vm.places.results.length < 1) {
                        vm.messages.places = "Nenhum resultado encontrado :(";
                    }

                    vm.places.results.forEach(function(result){
                        var marker = new google.maps.Marker({
                            position: result.geometry.location,
                            title: result.name
                        });
                        marker.setMap(vm.map);
                    });

                } else {
                    vm.messages.places = "Nenhum resultado encontrado :(";
                }
                vm.location.addressCompleted = true;
                vm.location.placesCompleted = true;
                $scope.$apply();
            });
        };

        vm.changeRatingFilter = function changeRatingFilter() {
            if (vm.filter.rating == "1") {
                vm.places.resultsFilter = vm.places.results;
            } else if (vm.filter.rating == "5") {
                vm.places.resultsFilter = vm.places.results.filter(function (item) {
                    return item.rating == 5;
                });
            } else {
                vm.places.resultsFilter = vm.places.results.filter(function (item) {
                    return item.rating >= vm.filter.rating;
                });
            }
        };

    });
