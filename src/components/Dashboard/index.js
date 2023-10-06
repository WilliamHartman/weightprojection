import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import axios from 'axios';

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
      <header>Weight Projection</header>
      <h1>Today's Weight</h1>
      {/* <h3>{dailyData[0].weight}</h3> */}
    </div>
  )
}