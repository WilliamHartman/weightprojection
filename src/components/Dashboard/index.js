import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Dashboard(props) {
  const [data, setData] = useState({})
  console.log(props)

  return (
    <div className='Dashboard'>
      <header>Weight Projection</header>
      <Button variant="contained" onClick={() => axios.get(`http://localhost:8088/api/getData/${props.userData.id}`, {withCredentials: true}).then((response) => setData(response.data))}>Update Data</Button>
    </div>
  )
}