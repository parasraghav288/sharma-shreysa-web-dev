(function () {
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController", EditWebsiteController);
    
    function EditWebsiteController($routeParams, WebsiteService, $location) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.websiteId = $routeParams.websiteId;
        vm.updateWebsite = updateWebsite;
        vm.navigateToWebsite = navigateToWebsite;
        vm.navigateToProfile = navigateToProfile;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsiteById( vm.websiteId )
                .then(function (response) {
                    vm.website = response.data;

                });
          


        }
        init();

        function deleteWebsite(){
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .then(function () {
                    vm.success = "Website was successfully deleted";
                    $location.url("/user/" + vm.userId + "/website");
                }, function () {
                    vm.error = "Website not deleted";
                    $location.url("/user/" + vm.userId + "/website");
                });
        }


        function updateWebsite() {
            WebsiteService
                .updateWebsite(vm.websiteId, vm.website)
                .then(function (response) {
                    vm.success = "Website was successfully updated";
                $location.url("/user/" + vm.userId + "/website");
            }, function (error) {
                vm.error = "Website not updated";
            });
        }

        function navigateToWebsite() {
            $location.url("/user/" + vm.userId + "/website");
        }

        function navigateToProfile() {
            $location.url("/user/" + vm.userId);
        }
        
    }



        
})();
