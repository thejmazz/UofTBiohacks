'use strict'
// Require modules
const Router = require('koa-router');
const jwt = require('koa-jwt');
// Require internally
const userMiddlewares = require('./userMiddlewares.js');
const util = require('../util');                      // for error function
const config = require('../config');                  // temporary KEY
const User = require('../models/user');               // User is User Model

 // Initiate router instance
let router = new Router();


router.use('/register', userMiddlewares.validateRegistration);
router.post('/register', userMiddlewares.saveUsertoDatabase);


router.get('/auth', userMiddlewares.getAuthentication);

router.post('/login', userMiddlewares.requestLogin);
router.get('/logout', function*(){
    this.body = {
      message: "logged out"
    };
});
router.post('/update/about', userMiddlewares.updateAbout)
router.param('token', function*(id, next){
      this.token = id
      yield next
    })
      .post('/forgot', userMiddlewares.forgotPassword)
      .get('/reset/:token', userMiddlewares.resetPassword)
      .post('/reset', userMiddlewares.resetConfirmationPassword)
      .get('/verify/:token', userMiddlewares.verifyRedirect)
      .post('/verify', userMiddlewares.verify)


router.get('/biohackinvite/accept', userMiddlewares.acceptBiohackinvite)
router.get('/biohackinvite/reject', userMiddlewares.rejectBiohackinvite)

console.log('/user routes:', router.stack.map(i => i.path));

module.exports = router;
