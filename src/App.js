import React, { useEffect, useState } from 'react'
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import axios from 'axios';


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
    return (
      <div className="App">
        <Dashboard userInfo={userInfo}/>
      </div>
    )
  }

  return (
    <div className="App">
      <a href={'http://localhost:8088/authorize'}>
        <div style={{height:'30px', width:'110px', border:'1px solid black', borderRadius:'3px', textAlign:'center', lineHeight:'30px'}}>Login to Fitbit</div>
      </a>

    </div>
  );
}

export default App;