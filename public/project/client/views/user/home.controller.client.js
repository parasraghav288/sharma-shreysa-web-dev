(function () {
    angular
        .module("EatHeartyApp")
        .controller("HomeController", HomeController);

    function HomeController(YelpService, $location, $routeParams) {
        var vm = this;
       // vm.userId = $routeParams.userId;

        vm.findRestaurant = findRestaurant;

        function findRestaurant(searchFood,searchLocation) {
            console.log(searchLocation);
            YelpService
                .findRestaurant(searchFood, searchLocation)
                .then(function (response) {
                    console.log("*********************** in client");
                    console.log(response.data);
                    vm.business = response.data;
                    vm.id = [];
                    // for (i = 0; i < vm.business.businesses.length; i++) {
                    //     //   //  console.log(vm.business.businesses[0].id);
                    //     //
                    //     vm.id.push(vm.business.businesses[i]);
                    // }

                });
        }

        function findRestaurantById() {
            console.log(id);
            console.log("client rest by id");
            YelpService
                .findRestaurantById(id)
                .then(
                    function (response) {
                        vm.restaurant = response.data;
                    }, function (err) {
                        vm.error(err);
                    }
                );
        }
    }})();
