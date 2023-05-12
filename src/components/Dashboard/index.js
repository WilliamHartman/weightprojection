import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Dashboard() {
  // const [userData, setUserData] = useState({})

  useEffect(() => {
    // axios.get("http://localhost:8088/auth/me").then(response => {
    //   console.log(response)
    // })
  }, []);


  return (
    <div style={{height: '100vh', width:'100vw'}}>
      Dashboard
    </div>
  )
}