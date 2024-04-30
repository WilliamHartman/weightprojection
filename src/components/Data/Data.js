import React, { useEffect, useState } from 'react'
import './Data.css';
import moment from 'moment';

function dayContainer(dailyData) {
  let jsxDailyData = dailyData.map( (data, index) => {
    return (
      <div className='data-day-container' key={index}>
        <div className='data-date'>{moment(data.daily_date).format(`MMMM DD, YYYY`)}</div>
        <div className='data-day-subcont'>
          <div className='data-data-cont'>
            <div className='data-data-title'>Calories In</div>
            <div>{data.calories_consumed}</div>
          </div>
          <div className='data-data-cont'>
            <div className='data-data-type'>Calories Out</div>
            <div >{data.calories_burned}</div>
          </div>
          <div className='data-data-cont'>
            <div className='data-data-type'>Weight</div>
            <div >{data.daily_weight}</div>
          </div>
          <div className='data-data-cont'>
            <div className='data-data-type'>Fat</div>
            <div >{Math.round(data.fat * 10) / 10}%</div>
          </div>
        </div>
      </div>
    )
  })
  return jsxDailyData;
}

export default function Data(props) {
    console.log(props.dailyData)

    return (
        <div className='Data'>
            <div className='data-title'>My Daily Info</div>
            <div className='data-jsx-container'>
                {
                    dayContainer(props.dailyData)
                }
            </div>
        </div>
    )
}