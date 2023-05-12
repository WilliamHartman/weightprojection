import React, { useEffect, useState } from 'react'
import './App.css';
import Dashboard from './components/Dashboard';
import axios from 'axios';


function App() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    axios.get("http://localhost:8088/auth/me", {withCredentials: true}).then(response => {
      console.log(response)
      if(response.data.userData){
        setUserData(response.data.userData[0])
      }
    })
  }, []);

  console.log(userData)

  if(userData){
    return (
      <div>
        <Dashboard />
      </div>
    )
  }

  return (
    <div className="App">
      <a href={'http://localhost:8088/authorize'}>
        <div style={{height:'30px', width:'110px', border:'1px solid black', borderRadius:'3px', textAlign:'center', lineHeight:'30px'}}>Login to Fitbit</div>
      </a>

      {/* <button onClick={() => axios.get("http://localhost:8088/test", {withCredentials: true}).then((response) => console.log(response))}>test</button>
      <button onClick={() => axios.get("http://localhost:8088/getUser", {withCredentials: true}).then((response) => console.log(response))}>get</button> */}
    </div>
  );
}

export default App;
