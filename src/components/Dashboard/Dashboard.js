import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import axios from 'axios';
import Data from '../Data/Data.js'
import Charts from '../Charts/Charts.js'

function tabRender(selectedTab, dailyData){
  if(dailyData.length <= 0){
    return null;
  }
  switch(selectedTab){
    case 'data': 
      return  <Data dailyData={dailyData}/>
      break;
    case 'charts':
      return  <Charts dailyData={dailyData}/>
      break;
  }
}

export default function Dashboard(props) {
  const [dailyData, setDailyData] = useState({})
  const [selectedTab, setSelectedTab] = useState('data')

  useEffect(() => {
    axios.get(`http://localhost:8088/api/getUser/${props.userInfo.id}`, {withCredentials: true}).then(response => {
      setDailyData(response.data)
    })
  }, []);

  if(Object.keys(dailyData).length === 0){
    return (
      <div className='Dashboard'>
        <h1 className='title'>Weight Projection</h1>
        <div className='tab-container'>
          <div className={selectedTab === 'charts' ? 'selected-tab tab' : 'tab'} onClick={() => setSelectedTab('charts')}>Charts</div>
          <div className={selectedTab === 'data' ? 'selected-tab tab' : 'tab'} onClick={() => setSelectedTab('data')}>Data</div>
        </div>
        <div className='main-container'>
          <h1>Updating data...</h1>
        </div>
      </div>
    )
  } else {
    return (
      <div className='Dashboard'>
        <h1 className='title'>Weight Projection</h1>
        <div className='tab-container'>
          <div className={selectedTab === 'charts' ? 'selected-tab tab' : 'tab'} onClick={() => setSelectedTab('charts')}>Charts</div>
          <div className={selectedTab === 'data' ? 'selected-tab tab' : 'tab'} onClick={() => setSelectedTab('data')}>Data</div>
        </div>
        <div className='main-container'>
          {
            tabRender(selectedTab, dailyData)
          }
        </div>
      </div>
    )
  }
}