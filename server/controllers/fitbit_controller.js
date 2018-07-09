const axios = require('axios');
const moment = require('moment');

module.exports = {
    authMe: (req, res) => {
        if(req.session) {
            return res.status(200).send(req.session)
        } else {
            return res.status(200).send(false)            
        }
    },

    updateLastLogin: (req, res) => {
        const db = req.app.get('db');
        db.update_last_login([req.params.id, req.params.date])
            .then(returning => res.status(200).send(returning))
    }
}