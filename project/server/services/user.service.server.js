

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");


module.exports = function (app, models) {

    var userModel = models.userModel;
    var restaurantModel = models.restaurantModel;
    var likeModel = models.likeModel;
    var followModel = models.followModel;


    // User related api calls
    app.put("/api/projectuser/:userId", updateUser);
    app.post("/api/projectuser", createUser);
    app.get("/api/projectuser", getUsers);
    app.post("/api/projectuser/login", passport.authenticate('proj'), login);
    app.post("/api/projectuser/logout", logout);
    app.get("/api/projectuser/loggedIn", loggedIn);
    
    app.get("/api/projectuser/:userId", findUserById);
    app.delete("/api/projectuser/:userId", deleteUser);
    app.post("/api/projectuser/register", register);
    


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));



    // app.get("/auth/facebook", passport.authenticate('facebook'));
    // app.get("/auth/facebook/callback", passport.authenticate('facebook', {
    //     successRedirect: '/project/#/user',
    //     failureRedirect: '/project/#/review'
    // }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/project/#/user',
            failureRedirect: 'project/#/review'
        }));


   passport.use('proj', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    // var googleConfig = {
    //     clientID     : "1021090604010-8r131lpp2p17sv6qoh91ffopqg80vfd1.apps.googleusercontent.com",
    //     clientSecret : "4AJLPG3hhM0SOdHDOtY_NOw6",
    //     callbackURL  : "http://localhost:3000/auth/google/callback"
    // };

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };
    // passport.use('facebook', new FacebookStrategy(facebookConfig, facebookLogin));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if(user && bcrypt.compareSync(password, user.password)){
                        done(null, user);
                    }else{
                        done(null, false);
                    }

                },
                function (error) {
                    done(error);
                }
            );

    }

    // function facebookLogin(token, refreshToken, profile, done) {
    //     console.log("in facebook login");
    //     console.log(profile);
    //     userModel
    //         .findFacebookUser(profile.id)
    //         .then(
    //             function (facebookUser) {
    //                 if(facebookUser){
    //                     return done(null, facebookUser);
    //                 }else{
    //                     facebookUser = {
    //                         username: profile.displayName.replace(/ /g, ''),
    //                         facebook: {
    //                             token: token,
    //                             id: profile.id,
    //                             displayName: profile.displayName
    //                         }
    //                     };
    //                     userModel
    //                         .createUser(facebookUser)
    //                         .then(
    //                             function (user) {
    //                                 done(null, user);
    //                             }
    //                         );
    //
    //
    //                 }
    //
    //             });
    //
    // }
    //

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }




    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function loggedIn(req, res) {
        if(req.isAuthenticated()){
            res.json(req.user);
        }else{
            res.send('0');
        }
    }

    function login( req, res) {
        var user = req.user;
        res.json(user);
    }

    function register(req, res) {
        console.log("in register of server");
        var username = req.body.username;
        var password = req.body.password;
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if(user){
                        console.log("duplicateuser");
                        res.status(400).send("username already in use");
                        return;
                    }else{
                        console.log("password getting encrypted");
                        req.body.password = bcrypt.hashSync(req.body.password);
                        return  userModel
                            .createUser(req.body)
                    }
                },
                function (error) {
                    res.status(400).send(error);
                })
            .then(
                function (user) {
                    if(user){
                        req.login(user, function (err) {
                            if(err){
                                res.status(400).send(err);
                            }
                            else{
                                res.json(user);
                            }
                        });
                    }
                },
                function (error) {
                    res.status(400).send(error);
                }
            )


    }


    function createUser(req, res) {
        var newUser = req.body;
        console.log(req.body);
        userModel
            .createUser(newUser)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.status(400).send("Username  " + newUser.username + " is already in use");

                }

            );

    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(id, newUser)
            .then(
                function (stats) {
                    console.log(stats);
                    res.send(200);
                },
                function (error) {
                    res.statusCode(404).send(error);

                }
            );

    }




    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        var name = req.query['name'];
        if (username && password) {
            // findUserByCredentials(username, password, res);
            findUserByCredentials(username, password,req, res);
        }
        else if (username) {
            findUserByUsername(username, res);
        }
        else if(name){
            findFriend(name, res);
        }
        else {
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },function(error) {
                        res.status(400).send(error);
                    });
        }
    }


    function findFriend(name, res) {
        userModel
            .findFriend(name)
            .then(
                function (users) {
                    res.json(users);
                },function(error) {
                    res.status(400).send(error);
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(function(user) {
                res.send(user);
            },function(error) {
                res.status(400).send(error);
            });

    }


    function deleteUser(req, res) {
        var id = req.params.userId;
        userModel
            .deleteUser(id)
            .then(
                function (stats) {
                    console.log(stats);
                    res.send(200);
                },
                function (error) {
                    res.statusCode(404).send(error);
                }
            );
    }



    function findUserByUsername(username, res) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.status(400).send(error);
                }
            );
    }


    function findUserByCredentials(username, password, req, res) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    console.log(req.session);
                    req.session.currentUser = user;
                    res.json(user);
                },
                function (error) {
                    res.status(400).send(error);
                }
            );
    }


};






