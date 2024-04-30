import React, { useEffect, useState } from 'react'
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import axios from 'axios';
import Button from '@mui/material/Button';

function App() {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    axios.get("http://localhost:8088/api/auth/me", {withCredentials: true}).then(response => {
      if(response.data.userInfo){
        setUserInfo(response.data.userInfo[0])
      }
    })
  }, []);

  if(userInfo.access_token){
    console.log(userInfo)
    return (
      <div className="App">
        <Dashboard userInfo={userInfo}/>
      </div>
    )
  }

  return (
    <div className="App">
      <Button variant='contained' href="http://localhost:8088/authorize">Login to Fitbit</Button>
    </div>
  );
}

export default App;