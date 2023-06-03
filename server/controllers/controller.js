const axios = require('axios');
const moment = require('moment');

let userData = {};

module.exports = {
    authMe: (req, res) => {
        if(req.session) {
            return res.status(200).send(req.session)
        } else {
            return res.status(200).send(false)            
        }
    },

    getUser: (req, res) => {
        
        res.status(200).send(req.session)
    },

    getData: (req, res) => {
        const db = app.get('db');
        console.log(req.params)

        res.status(200).send(req.session)
    }
}