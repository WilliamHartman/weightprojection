const express = require('express');
const bodyParser = require('body-parser');
const ctrl = require(`./controllers/controller.js`);
const cors = require('cors')
const massive = require('massive');
const session = require("express-session");
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();
const FitbitApiClient = require("fitbit-node");

const baseURL = `/api`;
const morgan = require('morgan');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

//Middleware
const app = express();
app.use(session({
  secret: 'tempsessionsecret', 
  cookie: { 
    maxAge: 9999999999,
    secure: false
  },
  resave: false,
  saveUninitialized: true
 }));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// app.use(express.static(__dirname + './../build'));
app.use(morgan('dev'));



const client = new FitbitApiClient({clientId: CLIENT_ID, clientSecret: CLIENT_SECRET});



 massive(process.env.CONNECTION_STRING)
.then( (db) => {
    console.log('Connected to ElephantSQL')
    app.set('db', db);
}).catch(err=>console.log(err))

// redirect the user to the Fitbit authorization page
app.get("/authorize", function (req, res) {
  // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
  res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight',CALLBACK_URL));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
  // exchange the authorization code we just received for an access token
  client.getAccessToken(req.query.code, CALLBACK_URL).then(function (result) {
      axios.get('https://api.fitbit.com/1/user/-/profile.json', {headers: {Authorization: `Bearer ${result.access_token}`}})
          .then( profileData => {
            console.log(profileData)
              const db = app.get('db');
              // Check if there is a user with that fitbit id in the user table
              db.find_user([profileData.data.user.encodedId])
                  .then(user => {
                      // If no user, create user and redirect
                      if(!user[0]){
                          console.log('no user found')
                          db.create_user([
                              profileData.data.user.firstName,
                              profileData.data.user.lastName,
                              profileData.data.user.encodedId,
                              profileData.data.user.height,                                
                              profileData.data.user.weight,                                
                              profileData.data.user.dateOfBirth,                                
                              profileData.data.user.gender,                                
                              profileData.data.user.timezone,
                              result.access_token,
                              profileData.data.user.weight,
                              profileData.data.user.weight,
                              moment().format('YYYY-MM-DD')
                          ]).then(returnedData => {
                              // ctrl.firstLoginDataRequest;
                              req.session.userData = returnedData;
                              req.session.authorized = true;
                              req.session.access_token = result.access_token;
                              req.session.save((err) => {
                                res.redirect(`http://localhost:3000/`);
                              });
                          })
                          .catch(err => console.log(err))
                      } else {
                        console.log('User found')
                          // If there is a user, update the access token and redirect
                          db.update_access_token([result.access_token, user[0].auth_id])
                              .then(returnedData => {
                                req.session.userData = returnedData;
                                req.session.authorized = true;
                                req.session.access_token = result.access_token;
                                req.session.save((err) => {
                                  console.log('Session before redirect')
                                  console.log(req.session)
                                  res.redirect(`http://localhost:3000/`);
                                });
                              })
                      }
                  })
          })
          .catch(error => console.log('error: ', error))
  }).catch(err => res.status(400).send(err))
});

app.get("/logout", function(req, res) {
  req.session.authorized = false;
  req.session.access_token = null;
  req.session.save();
  res.redirect(process.env.FRONTEND_URL);  
})

//Endpoints
app.get(`/auth/me`, ctrl.authMe)
app.get(`/test`, ctrl.test)
app.get(`/getUser`, ctrl.getUser)


// const path = require('path')
// app.get('*', (req, res)=>{
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// })


app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));