const http = require('http');
const path = require('path');
const express = require('express');
const axios = require('axios');
const Auth0Strategy = require('passport-auth0');
const passport = require('passport');
const massive = require('massive');
const session = require("express-session");
const process = require("process");
const bodyParser = require('body-parser');
const cors = require('cors')
const moment = require('moment');
require('dotenv').config();


const fCtrl = require('./controllers/fitbit_controller');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(__dirname + './../build'));


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

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

const strategy = new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
}, (accessToken, refreshToken, extraParams, profile, done) => {
    const db = app.get("db");
    const userData = profile._json;
    
    db.find_user([userData.identities[0].user_id]).then(user => {
    if (user[0]) {
        return done(null, user[0].auth_id);
    } else {
        db.create_user([
            userData.given_name,
            userData.family_name,
            userData.email,
            userData.identities[0].user_id
        ])
        .then(user => {
            return done(null, userData.identities[0].user_id);
        });
    }
    });
})

passport.use(strategy)

passport.serializeUser( (user, done) => {
    done(null, user);
}) 

passport.deserializeUser( (id, done) => {
    console.log('deserializeUser ', id)
    app.get("db").find_session_user([id])
        .then(user => {
        console.log(user);
        done(null, user[0]);
        });
})

app.use(passport.initialize());
app.use(passport.session()); 

app.get('/auth/me', (req, res) => {
    if(!req.user){
        console.log('if(!req.user) === true')
        return res.status(401).send('No user logged in.');
    }
    return res.status(200).send(req.user);
})

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/'
}))



// redirect the user to the Fitbit authorization page
app.get("/authorize", function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    let authURL = client.getAuthorizeUrl('nutrition profile settings weight',CALLBACK_URL);
    let redirect = [authURL.slice(0,69), CLIENT_ID, authURL.slice(69)].join('')
    console.log(authURL)
    console.log(redirect)
    res.redirect(redirect);
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
                            db.fitbit_first_login([
                                profileData.data.user.encodedId,
                                profileData.data.user.height,                                                             
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
                                res.redirect(`/dashboard`);
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
                                    res.redirect(`/dashboard`);
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



app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})


// launch the server
const PORT = 8085;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));