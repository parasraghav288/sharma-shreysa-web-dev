(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService );
    
    function UserService($http) {


        var api = {

            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            updateUser: updateUser,
            deleteUser: deleteUser,
            createUser: createUser,
            findUserByUsername: findUserByUsername

        };

        return api;


        function createUser(username, password) {

            var user = {
                username: username,
                password: password
            };
          return $http.post("/api/user", user);
        }

        function findUserByUsername(username){
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }





        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
         


        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password ;
            return $http.get(url);
        }

        function findUserById(id) {
          var url = "/api/user/" + id;
            return $http.get(url);
        }

        function updateUser(id, newUser) {
            var url = "/api/user/" + id;
            return $http.put(url, newUser);
        }
    }
})();


