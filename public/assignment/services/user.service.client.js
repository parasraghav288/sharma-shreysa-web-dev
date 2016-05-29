(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService );
    
    function UserService() {
        var users = [
            {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
            {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
            {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
        ];

        var api = {

            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById,
            updateUser: updateUser,
            deleteUser: deleteUser,
            createUser: createUser,
            findUserByUsername: findUserByUsername

        };

        return api;

        var cnewuser = {};



        function createUser(newUser) {

            var cnewuser = {
                _id: (new Date()).getTime().toString(),
                username: newUser.username,
                password: newUser.password
            };
            users.push(cnewuser);
            return cnewuser;
        }

        function findUserByUsername(username){
            for (var i in users){
                if(users[i].username === username){
                    return true;
                }
            }
            return false;
        }





        function deleteUser(userId) {
          for(var i in users){
              if(users[i]._id === userId){
                 users.splice(i, 1);
                  return true;
              }
          }
            return false;

        }


        function findUserByCredentials(username, password) {
            for (var i in users)
            {
                if (users[i].username === username && users[i].password === password) {
                   return users[i];
                }
            }
            return null;
        }

        function findUserById(id) {
            for (var i in users) {
                if(users[i]._id === id) {
                    return users[i];
                }
            }
            return null;
        }

        function updateUser(id, newUser) {
            for (var i in user)
            {
                if(user[i].id === id){
                    user[i].firstName = newUser.firstName;
                    user[i].lastName = newUser.lastName;
                    return true;
                }
            }
            return false;
        }
    }
})();

