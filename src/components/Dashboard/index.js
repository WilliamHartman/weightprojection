import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Dashboard(props) {
  const [userData, setUserData] = useState({})

  // useEffect(() => {
  //   axios.get(`http://localhost:8088/api/getUser/${props.userInfo.id}`, {withCredentials: true}).then(response => {
  //     if(response.data.userInfo){
  //       setUserInfo(response.data.userInfo[0])
  //     }
  //   })
  // }, []);

  console.log(props)
  console.log(userData)

  return (
    <div className='Dashboard'>
      <header>Weight Projection</header>
      <Button variant="contained" 
        onClick={() => {
          axios.get(`http://localhost:8088/api/getUser/${props.userInfo.id}/${props.userInfo.last_login}/${'get'}`, {withCredentials: true}).then((response) => setUserData(response.data))
        }}
      >
        Update Data
      </Button>
    </div>
  )
}