const axios = require('axios');
const moment = require('moment');

function getFromFitbit(db, accessToken, date, userID){
    let data = {date: date}

    axios.get(`https://api.fitbit.com//1/user/-/activities/date/${date}.json`, {headers: {Authorization: `Bearer ${accessToken}`}})
        .then( fitbitActivityData => {
            data.caloriesOut = fitbitActivityData.data.summary.caloriesOut

            axios.get(`https://api.fitbit.com/1/user/-/foods/log/date/${date}.json`, {headers: {Authorization: `Bearer ${accessToken}`}})
                .then( fitbitNutritionData => {
                    data.caloriesIn = fitbitNutritionData.data.summary.calories

                    axios.get(`https://api.fitbit.com/1/user/-/body/log/weight/date/${date}.json`, {headers: {Authorization: `Bearer ${accessToken}`}})
                        .then( fitbitWeightData => {
                            data.weight = fitbitWeightData.data.weight[0] ? fitbitWeightData.data.weight[0].weight : 0
                            data.fat = fitbitWeightData.data.weight[0] ? fitbitWeightData.data.weight[0].fat : 0

                            db.get_daily_data_by_id_and_date(userID, date)
                                .then( dbData => {
                                    console.log(`Date: ${date} | Calories Out: ${data.caloriesOut} | Calories In: ${data.caloriesIn} | Weight ${data.weight} | Fat: ${data.fat}`)
                                    if(!dbData[0]){
                                        db.create_daily(userID, date, data.caloriesOut, data.caloriesIn, data.weight, data.fat)
                                    } else {
                                        db.update_daily(dbData[0].id, data.caloriesOut, data.caloriesIn, data.weight, data.fat)
                                    }
                                })

                            return
                        })
            })
    })
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function dailyGetLoop(req, res, db, userData){
    let todayDate = moment().format('YYYY-MM-DD')
    let workingDate = todayDate
    let lastLogin = moment(userData[0].last_login).subtract(1, 'days').format('YYYY-MM-DD')
    console.log(lastLogin)

    do {
        console.log('do while loop get for date: ', workingDate)
        getFromFitbit(db, req.session.access_token, workingDate, req.params.id)
        workingDate = moment(workingDate).subtract(1, 'days').format('YYYY-MM-DD')
        await timer(1000);
    } while (workingDate !== lastLogin)

    db.update_last_login(req.params.id, todayDate)
        .then(() => {
            db.get_daily(req.params.id)
                .then( dailyData => {
                    res.status(200).send(dailyData)
                })
        })
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
        console.log('getUser hit, user ID: ', req.params)

        db.get_user_by_id(req.params.id)
            .then( userData => {
                dailyGetLoop(req, res, db, userData)
            })
    },

    getData: (req, res) => {

        
        res.status(200).send(req.session)
    }
}