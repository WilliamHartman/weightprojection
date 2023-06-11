const axios = require('axios');
const moment = require('moment');

let userData = {};



function sinceLastLogin(req, res){
    let todayDate = moment().format('YYYY-MM-DD');
    let lastLoginDate = req.params.date;
    let workingDate = lastLoginDate;
    console.log(req.session)
    console.log(`Today date: ${todayDate}`)
    console.log(`Last login date: ${lastLoginDate}`)
    if(todayDate !== lastLoginDate){
        do{
            console.log(`Update activity, weight, and calories for the date: ${workingDate}`)
            // getSleep(req, res, workingDate, req.params.rest);
            // getActivity(req, res, workingDate, req.params.rest);
            // getWeight(req, res, workingDate, req.params.rest);
            // getNutrition(req, res, workingDate, req.params.rest);
            workingDate = moment(workingDate).add(1, 'days').format('YYYY-MM-DD');
        }while(workingDate !== todayDate);
    }
}

module.exports = {
    authMe: (req, res) => {
        if(req.session) {
            return res.status(200).send(req.session)
        } else {
            return res.status(200).send(false)            
        }
    },

    getUser: (req, res) => {
        const db = req.app.get('db');
        
        db.get_burned([req.params.id])
            .then(returnedBurnedData => {
                db.get_consumed([req.params.id])
                    .then(returnedConsumedData => {
                        db.get_weights([req.params.id])
                            .then(returnedWeightData => {
                                let userData = {
                                    burnedData: returnedBurnedData,
                                    consimedData: returnedConsumedData,
                                    weightData: returnedWeightData
                                }

                                sinceLastLogin(req, res)
                                res.status(200).send(userData)
                            })
                    })
            })
        
    },

    getData: (req, res) => {
        
        res.status(200).send(req.session)
    }
}