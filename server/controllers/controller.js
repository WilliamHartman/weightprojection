const axios = require('axios');
const moment = require('moment');

let userData = {};

module.exports = {


    authMe: (req, res) => {
        console.log('Session in authMe')
        console.log(req.session)
        if(req.session) {
            return res.status(200).send(req.session)
        } else {
            return res.status(200).send(false)            
        }
    },
    
    // test: (req, res) => {
    //     req.session.userData = {name: 'bob'}
    //     req.session.save((err) => {
    //         console.log(req.session)
    //         res.status(200).send(req.session)

    //       });
    // },

    // getUser: (req, res) => {
    //     console.log(req.session)
    //     res.status(200).send(req.session)
    // }
}