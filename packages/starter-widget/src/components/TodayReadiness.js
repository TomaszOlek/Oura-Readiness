import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend,Bar } from 'recharts'
import { CircularProgress } from '@chakra-ui/react'
import { useEffect, useState } from 'react';

import arrow_right from "../img/arrow_right.png"
import Crown from "../img/Crown.png"

export default function TodayReadiness(props){

    const [chartData, setChartData] = useState([])
    const [readinessScore, setReadinessScore] = useState("")
    const readyData = props.readyData
    const handleClick = props.handleClick

    useEffect(()=>{
        setChartData ([
            { name: 'Activity Balance', value: readyData[0] ? readyData[0].score_activity_balance : 0 },
            { name: 'HRV Balance', value: readyData[0] ? readyData[0].score_hrv_balance : 0 },
            { name: 'Previous Day', value: readyData[0] ? readyData[0].score_previous_day : 0 },
            { name: 'Previous Night', value: readyData[0] ? readyData[0].score_previous_night : 0 },
            { name: 'Recovery Index', value: readyData[0] ? readyData[0].score_recovery_index : 0 },
            { name: 'Resting HR', value: readyData[0] ? readyData[0].score_resting_hr : 0 },
            { name: 'Sleep Balance', value: readyData[0] ? readyData[0].score_sleep_balance : 0 },
            { name: 'Temperature', value: readyData[0] ? readyData[0].score_temperature : 0 }
        ])
        
        if(true&&readyData.score>=85){
            setReadinessScore("Optimal")
        }else if(true&&readyData.score<=70){
            setReadinessScore("Pay attension")
        }else{
            setReadinessScore("Good")
        }

    },[readyData])


    return(
        <div className='readiness'>
            <div className="readiness-top">

                <h1 className='title'>Readiness</h1> 
                <div className='progress__div'>
                    <CircularProgress 
                    value={(readyData[0] ? readyData[0].score : 0) /2} 
                    size='180px' 
                    thickness='4px'
                    transform="rotateZ(-90deg)"
                    color="white"
                    />
                </div>
                {readyData[0] ? readyData[0].score >= 90 && <img className='readiness__crown' src={Crown}/> : "" }
                <p className='readiness__score'>{readyData[0] ? readyData[0].score : 0}</p>
                <p className='readiness__status'>{readinessScore}</p>
                <div style={{position: "absolute"}} onClick={handleClick}>
                    <img src={arrow_right} className="arrow_right"/>
                </div>
            </div>


            <div className="readiness-bottom">
                <BarChart 
                    width={290} 
                    height={90} 
                    data={chartData}
                    maxBarSize={100}
                    margin={{ top: 15, right: 15, bottom: 5, left: -15 }}
                >
                    <CartesianGrid vertical={false} horizontal={true} strokeDasharray="0"/>
                    <Bar dataKey="value" fill="#8884d8" />
                    <XAxis dataKey="name" hide="true" />
                    <YAxis dataKey="value" fill="#ffffff"/>
                    <Tooltip />
                </BarChart>
            </div>
        </div>
    )
}