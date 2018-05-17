const http = require('http');
const path = require('path');
const express = require('express');
const axios = require('axios');
const massive = require('massive');
const session = require("express-session");
const process = require("process");
const bodyParser = require('body-parser');
const cors = require('cors')
const moment = require('moment');
require('dotenv').config();


const fCtrl = require('./controllers/fitbit_controller');
const lCtrl = require('./controllers/lifts_controller');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + './../build'));


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;


// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient(CLIENT_ID, CLIENT_SECRET);

// Use the session middleware
massive(process.env.CONNECTION_STRING)
.then( (db) => {
    console.log('Connected to Heroku')
    app.set('db', db);
}).catch(err=>console.log(err))


app.use(session({
     secret: SESSION_SECRET, 
     cookie: { maxAge: 60000 },
     resave: false,
     saveUninitialized: true
    }));

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
                                profileData.data.user.avatar640,
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
                                fCtrl.firstLoginDataRequest;
                                req.session.userData = returnedData;
                                req.session.authorized = true;
                                req.session.access_token = result.access_token;
                                req.session.save();
                                res.redirect(`/UserLanding`);
                            })
                            .catch(err => console.log(err))
                        } else {
                            // If there is a user, update the access token and redirect
                            db.update_access_token([result.access_token, user[0].auth_id])
                                .then(returnedData => {
                                    req.session.userData = returnedData;
                                    req.session.authorized = true;
                                    req.session.access_token = result.access_token;
                                    req.session.save();
                                    res.redirect(`/UserLanding`);
                                })
                        }
                    })
            })
            .catch(error => console.log('error: ', error))
        // use the access token to fetch the user's profile information
        
    }).catch(err => res.status(400).send(err))
});

app.get("/logout", function(req, res) {
    req.session.authorized = false;
    req.session.access_token = null;
    req.session.save();
    res.redirect(process.env.FRONTEND_URL);  
})


//Endpoints
app.get(`/api/auth/me`, fCtrl.authMe)
app.get(`/api/data/getTodaySleep/:id/:date/:rest`, fCtrl.getTodaySleep)
app.get(`/api/data/getTodayActivity/:id/:date/:rest`, fCtrl.getTodayActivity)
app.get(`/api/data/getTodayWeight/:id/:date/:rest`, fCtrl.getTodayWeight)
app.get(`/api/data/getTodayNutrition/:id/:date/:rest`, fCtrl.getTodayNutrition)
app.get(`/api/data/getAllData/:id`, fCtrl.getAllData)
app.post(`/api/data/getSinceLastLogin/:id/:date/:rest`, fCtrl.getSinceLastLogin)
app.post(`/api/data/updateLastLogin/:id/:date`, fCtrl.updateLastLogin)
app.put(`/api/data/updateGoals/:id`, fCtrl.updateGoals)

//Exercise/lift log endpoints
app.get(`/api/data/getAllLifts/:id`, lCtrl.getAllLifts)
app.post(`/api/data/logLift/:id`, lCtrl.logLift)
app.post(`/api/data/logLifts/:id`, lCtrl.logLifts)
app.put(`/api/data/updateLift/:liftid`, lCtrl.updateLift)

app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})


// launch the server
const PORT = 8082;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));