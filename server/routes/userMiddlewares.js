"use strict"
// Require modules
const jwt = require('koa-jwt');
const bcrypt = require('bcrypt');
const json2xls = require('json2xls');
const fs = require('fs');
const streamify = require('stream-array');
const through = require('through2');
// Require internally
const util = require('../util'); // for error function
const config = require('../config'); // temporary KEY
const User = require('../models/user'); // User is user Model
const Group = require('../models/group');
const crypto = require('crypto-promise')
const async = require('async');
const nodemailer = require('nodemailer');
const Promise = require('bluebird');
const sgTransport = require('nodemailer-sendgrid-transport');
const constants = require('../config')
const template = require('../templates/template.js')

// POST /user/register    trim form data, validate not undefined, and check for duplicates in the database
module.exports.validateRegistration = function*(next) {
  this.request.body.email = util.trim(this.request.body.email)
  this.request.body.username = util.trim(this.request.body.username)
  this.request.body.name = util.trim(this.request.body.name)

  let email = this.request.body.email
  let password = this.request.body.password
  let firstName = this.request.body.firstName
  let lastName = this.request.body.lastName
  let username = this.request.body.username
  let education = this.request.body.education
  let year = this.request.body.year
  let codingBackground = this.request.body.codingBackground
  let about = this.request.body.about
  let autogroup = this.request.body.autogroup
  let github = this.request.body.github
  let hearFacebook = this.request.body.hearFacebook
  let hearMailingList = this.request.body.hearMailingList
  let hearWordOfMouth = this.request.body.hearWordOfMouth
  let likeToSee = this.request.body.likeToSee
  let mentor = this.request.body.mentor
  let questions = this.request.body.questions
  let school = this.request.body.school
  let scienceType = this.request.body.scienceType


    // If name, password or email does not exist
  //TO BE FIXED! TODO
  //!year || !education || !codingbackground
  if (!email || !password || !firstName  || !lastName || !username || password.length < 8
      || !education) {
    this.response.status = 400 // set response status before sending
    return this.body = {
      message: "Not all fields were filled in"
    }
  } else if (!this.checkBody('email').isEmail().goOn) {
    this.response.status = 400
    util.errorResponse(this)
  } else{
    let modelByEmail = yield User.findOne({
      email: this.request.body.email
    })
    let modelByUsername = yield User.findOne({
      username: this.request.body.username
    })
    if (modelByEmail || modelByUsername) { // if email OR username already in database
      if (modelByEmail) {
        console.log('email exists')
        this.body = {
          message: "Email already exists"
        }
      } else {
        console.log('username exists')
        this.body = {
          message: "Username already exists"
        }
      }
    } else {
      // Authentication complete
      yield next
    }
  }
}

// POST /user/register    save POST data to user model and store in database, while issuing a token
module.exports.saveUsertoDatabase = function*() {
  let verificationToken = yield crypto.randomBytes(20);

  let hashedPassword
  try {
    hashedPassword = yield util.bcryptHashAsync(this.request.body.password)
  } catch(err) {
    this.response.status = 500
    console.error(err)
    util.errorResponse(this)
  }

  let user = new User({
    email: this.request.body.email,
    password: hashedPassword, //8 bit hashing 2^8 rounds is sufficent for now
    firstName: this.request.body.firstName,
    lastName: this.request.body.lastName,
    username: this.request.body.username.toLowerCase(),
    education: this.request.body.education,
    year: this.request.body.year,
    codingBackground: this.request.body.codingBackground,
    about: this.request.body.about,
    autogroup: this.request.body.autogroup,
    github: this.request.body.github,
    hearFrom: this.request.body.hearFrom,
    likeToSee: this.request.body.likeToSee,
    mentor: this.request.body.mentor,
    questions: this.request.body.questions,
    school: this.request.body.school,
    scienceType: this.request.body.scienceType,
    verificationToken: verificationToken.toString('hex')
  })

  try {
    let model = yield user.save() // save new user in database
    model.password = undefined;
    let options = {
      auth : {
        api_user: config.api_user,
        api_key: config.api_key
      }
    }
    let client = nodemailer.createTransport(sgTransport(options));
    let body = 'Hello, ' + model.firstName + ',\n\n\n\nplease paste the following url https://'
                + this.request.host + '/user/verify/'
                + model.verificationToken + ' to verify your account'
    let email = {
      from: 'igem@g.skule.ca',
      to: model.email,
      subject: 'UofT Biohacks Email Verification',
      html: template(body)
    };
    yield sendMail(client, email);

    this.body = {
      message: "Please check your email to verify your account",
      success: true
    };
  } catch (err) {
    this.response.status = 500
    console.error(err)
    util.errorResponse(this)
  }
}

module.exports.getAuthentication = function*(){
  let groupModel = null
  let userModel = this.userModel

  if (userModel.group) { // return just groupModel if user has a group already

    groupModel = yield Group.findById(userModel.group).populate(['users', 'pendingInvites']).exec()
  } else {
    userModel = yield User.findById(userModel._id).populate('invites').exec() // otherwise fill userModel.invit
  }
  userModel.password = undefined
  this.body = {
    userModel: userModel,
    message: "Welcome, " + userModel.firstName,
    groupModel: groupModel
  }
}

// POST /user/login       check for invalid input, query database for matching email and password and grant token
module.exports.requestLogin = function*() {
  // assign variable
  let emailOrUsername = util.trim(this.request.body.emailOrUsername)
  let password = this.request.body.password
    // check for invalid input
  if (!emailOrUsername || !password) {
    this.response.status = 400
    util.errorResponse(this)
  } else {
    try {
      // query database for matching email OR username
      let userModel = yield User.findOne({
          $or: [{
            email: emailOrUsername.toLowerCase()
          }, {
            username: emailOrUsername
          }]
        }).populate('invites').select('+password').exec()

      //code kind of a cluster....running out of time
      let passwordComparison = yield util.bcryptCompareAsync(password, userModel.password)

      if (userModel && !userModel.verified) {
        this.body = {
          message: "Email has not been verified",
          verification: false
        }
      } else if (userModel && passwordComparison) {
        // mask password and grant token
        userModel.password = undefined;
        this.userModel = userModel // this.userModel persists for the entire session
        let token = jwt.sign({
          userModel: userModel
        }, config.SECRET, {
          expiresInMinutes: 60 * 5
        });

        let groupModel = null;
        if (this.userModel.group) { // return just groupModel if user has a group already
          groupModel = yield Group.findById(this.userModel.group).populate('users').exec()
        } else {
          userModel = yield User.findById(this.userModel._id).populate('invites').exec() // otherwise fill userModel.invit
        }
        this.body = {
          token: token,
          userModel: userModel,
          message: "Welcome, " + userModel.firstName, // user.invites and user.group is populated
          groupModel: groupModel
        };
      } else { // authentication fails
        this.body = {
          message: "Wrong password and/or email/username"
        }
      }
    } catch (err) {
      this.response.status = 500
      console.error(err)
      util.errorResponse(this)
    }
  }
}

// middleware /user/all            attach all user data to this.users
module.exports.getUsers = function*(next) {
    try {
      var users = yield User.find({}).populate('invites group').exec();
      for (var i = 0; i < users.length; i++) {
        users[i] = users[i].toJSON()
        users[i].password = undefined;
        users[i]._id = undefined;
        users[i].__v = undefined;
        users[i].invites = undefined;
        if (users[i].group) {
          users[i].group = users[i].group.name
        }
      }
      this.users = users;
      yield next;
    } catch (err) {
      console.error(err);
      this.response.status = 500;
      util.errorResponse(this);
    }
  }
  // middlware /user/all and /user/all/csv
module.exports.validateAdmin = function*(next) {
  if (this.userModel && this.userModel.username === 'admin' && this.userModel.email === 'igem@g.skule.ca') {
    yield next;
  } else {
    this.response.status = 403;
    util.errorResponse(this);
  }
}

// GET   /user/all/csv    downloads CSV containing userdata
module.exports.getCSV = function*() {
  this.response.set('Content-disposition', 'attachment; filename=users.csv');
  this.type = 'text/csv';

  let data = [{
    email: "email",
    name: "name",
    username: "username",
    group: "group"
  }].concat(this.users);
  this.body = streamify(data)
    .pipe(through.obj(function(chunk, enc, callback) {
      let curRow = chunk.email + ', ' + chunk.name + ', ' + chunk.username + ',' + chunk.group + '\n';
      this.push(curRow);

      callback()
    }))
}

function sendMail(client, email) {
  return new Promise(function(res, rej) {
    client.sendMail(email, function cb(err, data) {
      if (err) rej(err)
      else res(data)
    });
  });
}
module.exports.verifyRedirect = function*(){

  try{
    let user = yield User.findOne({ verificationToken: this.token})
    if(user){
      this.response.redirect(constants.FRONT_END_URL + "/verify?token="+ this.token)
    }else{
      this.response.redirect(constants.FRONT_END_URL + "/verify?")
    }

  }catch(err){
    console.error(err)
    this.response.status = 500
    util.errorResponse(this)
  }
}

module.exports.verify = function*(){
  try{
    console.log(this.request.body.token)
    let user = yield User.findOne({verificationToken: this.request.body.token})
    if(!user){
      return this.body = {
        success: false,
        message: "Email validation token is invalid, make sure you copied the correct URL"
      }
    }

    user.verified = true
    user = yield user.save()
    console.log(user)
    this.body = {
      success: true,
      message: "Email has been verified, redirecting in 5 seconds! "
    }
  }catch(err){
    console.error(err)
    this.response.status = 500
    util.errorResponse(this)
  }
}

module.exports.resetPassword = function* (){
  try{
    let user = yield User.findOne({ resetPasswordToken: this.token, resetPasswordExpires: { $gt: Date.now() }})
    if(user){
      this.response.redirect(constants.FRONT_END_URL + "/reset?token="+ this.token)
    }else{
      this.response.redirect(constants.FRONT_END_URL + "/reset?")
    }

  }catch(err){
    console.error(err)
    this.response.status = 500
    util.errorResponse(this)
  }
}
module.exports.resetConfirmationPassword = function * (){
  let token = this.request.body.token
  let password = this.request.body.password
  if(password.length < 8){
    return this.body = {
      message: "Password is too short"
    }
  }
  try {
    let user = yield User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }}).select('+password  ')
    if (!user) {
      return this.body = {
        message: "Invalid Token or Token has expired",
        success: false
      }
    }
    //user.password = util.bcrypt(this.request.body.password);
    user.password = yield util.bcryptHashAsync(this.request.body.password)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user = yield user.save()
    let options = {
      auth : {
        api_user: config.api_user,
        api_key: config.api_key
      }
    }
    let client = nodemailer.createTransport(sgTransport(options));
    let email = {
      from: 'igem@g.skule.ca',
      to: user.email,
      subject: 'UofT Biohacks Password Reset',
      html: template('Hello ' + user.name + ', \n\nThis is a confirmation that the password for your account ' + user.email + ' has just been changed.\n')
    };
    yield sendMail(client, email);
    this.body = {
      message: "Your password has been changed",
      success: true
    }
  } catch (err) {
    console.error(err)
    this.response.status = 500;
    util.errorResponse(this);
  }
}
module.exports.forgotPassword = function*() {
  let token = yield crypto.randomBytes(20);
  token = token.toString('hex');
  try {
    let user = yield User.findOne({
      email: this.request.body.email
    })
    if (!user) {
      return this.body = {
        message: "No account with that email exists",
        success: false
      }
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000 //1 hour
    user = yield user.save()
    let options = {
      auth : {
        api_user: config.api_user,
        api_key: config.api_key
      }
    }
    let client = nodemailer.createTransport(sgTransport(options));
    let emailbody = 'You are receiving this email because a password change request was submitted for your account. Please click on the following link, or paste it into your browser to complete the process:\n\n' +
        'https://' + this.request.host + '/user/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    let email = {
      from: 'igem@g.skule.ca',
      to: user.email,
      subject: 'UofT Biohacks Password Reset',
      html: template(emailbody)
    };
    yield sendMail(client, email);
    this.body = {
      message: "An email will be sent to you for further instructions",
      success: true
    }
  } catch (err) {
    console.error(err)
    this.response.status = 500;
    util.errorResponse(this);
  }
}
