import React, { useEffect, useState } from 'react'
import './App.css';
import Dashboard from './components/Dashboard';
import axios from 'axios';


function App() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    axios.get("http://localhost:8088/api/auth/me", {withCredentials: true}).then(response => {
      if(response.data.userData){
        setUserData(response.data.userData[0])
      }
    })
  }, []);

  if(userData.access_token){
    return (
      <div>
        <Dashboard userData={userData}/>
      </div>
    )
  }

  return (
    <div className="App">
      <a href={'http://localhost:8088/authorize'}>
        <div style={{height:'30px', width:'110px', border:'1px solid black', borderRadius:'3px', textAlign:'center', lineHeight:'30px'}}>Login to Fitbit</div>
      </a>

      <button onClick={() => axios.get("http://localhost:8088/api/getUser", {withCredentials: true}).then((response) => console.log(response))}>get</button>
    </div>
  );
}

export default App;
