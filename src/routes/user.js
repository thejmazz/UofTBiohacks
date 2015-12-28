"use strict"

let Router = require('koa-router');
let User = require('../models/user');
let util = require('../util');
let bcrypt = require('bcrypt');





/**
 * Register user router
 * @param  Koa app
 * @return N/A
 */
function user(app) {

    //API with prefix /user to each route
    let router = new Router({
        prefix: '/user'
    });

    function* validateUser(next) {
        let email = this.request.body.email;
        let password = this.request.body.password;
        let name = this.request.body.name;
        let username = this.request.body.username;

        //If name, password or email does not exist
        if (!email || !password || !name || !username) {
            this.response.status = 400;
            util.errorResponse(this);
        } else {
            let modelByEmail = yield User.findOne({email: this.request.body.email});
            let modelByUsername = yield User.findOne({username: this.request.body.username});
            if (modelByEmail || modelByUsername) {
                if (modelByEmail) {
                    this.body = {
                        message: "Email already exists"
                    };
                } else {
                    this.body = {
                        message: "Username already exists"
                    }
                }
            } else {
                //Authentication complete
                yield next;
            }
        }

    }
    router.use('/register', validateUser);
    /**
     * Route for registering a user
     */
    router.post('/register', function*() {
        let user = new User({
            email: this.request.body.email,
            password: util.bcrypt(this.request.body.password), //8 bit hashing 2^8 rounds is sufficent for now
            name: this.request.body.name,
            username: this.request.body.username,
            school: this.request.body.school,
            github: this.request.body.github,
            about: this.request.body.about
        });
        try {
            var model = yield user.save();
            this.body = model;
            //Start session
            this.session.userModel = model;
        } catch (err) {
            this.response.status = 500;
            console.error(err);
            util.errorResponse(this);
        }

    });

    /**
     * Route for logging in a user
     */
    router.post('/login', function*() {
        let email = this.request.body.email;
        let password = this.request.body.password;
        let username = this.request.body.username;
        if (!email || !password || !username) {
            this.response.status = 400;
            util.errorResponse(this);
        } else {
            //add try catch
            try {
                var model = yield User.findOne({
                    email: email
                });

                if (bcrypt.compareSync(password, model.password)) {
                    //start session
                    this.session.userModel = model;
                    this.body = {
                        message: "logged in!"
                    }
                } else {
                    this.body = {
                        message: "Wrong password"
                    }
                }
            } catch (err) {
                this.response.status = 500;
                console.error(err);
                util.errorResponse(this);
            }
        }

    });

    /**
     *  logs out user
     */
    router.get('/logout', function*() {
        this.session = null;
        this.body = {
            message: "logged out"
        }
    });
    /**
     * Temporary to test session
     */
    router.get('/session', function*() {
        this.body = this.session.userModel;
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = user
