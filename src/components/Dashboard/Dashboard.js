import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import axios from 'axios';
import moment from 'moment';
import { jsx } from '@emotion/react';

function dayContainer(dailyData) {
  let jsxDailyData = dailyData.map( data => {
    return (
      <div className='day-container'>
        <div className='date'>{moment(data.daily_date).format(`MMMM DD, YYYY`)}</div>
        <div className='day-subcont'>
          <div className='data-cont'>
            <div className='data-title'>Calories In</div>
            <div>{data.calories_consumed}</div>
          </div>
          <div className='data-cont'>
            <div className='data-type'>Calories Out</div>
            <div >{data.calories_burned}</div>
          </div>
          <div className='data-cont'>
            <div className='data-type'>Weight</div>
            <div >{data.daily_weight}</div>
          </div>
          <div className='data-cont'>
            <div className='data-type'>Fat</div>
            <div >{Math.round(data.fat * 10) / 10}%</div>
          </div>
        </div>
      </div>
    )
  })
  return jsxDailyData;
}

export default function Dashboard(props) {
  const [dailyData, setDailyData] = useState({})

  useEffect(() => {
    console.log('useEffect in dashboard hit')
    axios.get(`http://localhost:8088/api/getUser/${props.userInfo.id}`, {withCredentials: true}).then(response => {
      setDailyData(response.data)
    })
  }, []);

  console.log(props)
  console.log(dailyData)

  if(dailyData.length === 0){
    return (
      <div>
        <h1>Updating data...</h1>
      </div>
    )
  }

  return (
    <div className='Dashboard'>
      <h1 className='title'>Weight Projection</h1>
      {
       dayContainer(dailyData)
      }
    </div>
  )
}