import React, { useEffect, useState } from 'react'
import './Charts.css';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';

Chart.register(...registerables);

export default function Data(props) {
    // let chartOptions = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //         title: {
    //             display: true,
    //             text: 'Chart.js Line Chart',
    //         },
    //     },
    // }

    let chartLables = ['10-20-2023', '10-21-2023', '10-22-2023', '10-23-2023', '10-24-2023', '10-25-2023']

    const data = {
        labels: chartLables,
        datasets: [
          {
            label: "Weight",
            data: [208, 205, 206, 203, 204, 199],
            fill: false,
            borderColor: "#742774"
          }
        ]
      };    

    return (
        <div className='Charts'>
            <div className='chart-title'>Charts</div>
            <div className='chart-container'>
               <Line data={data}/>
            </div>
        </div>
    )
}