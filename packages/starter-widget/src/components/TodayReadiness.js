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
            { name: 'Activity Balance', value: readyData ? readyData.score_activity_balance : 1 },
            { name: 'HRV Balance', value: readyData ? readyData.score_hrv_balance : 1 },
            { name: 'Previous Day', value: readyData ? readyData.score_previous_day : 1 },
            { name: 'Previous Night', value: readyData ? readyData.score_previous_night : 1 },
            { name: 'Recovery Index', value: readyData ? readyData.score_recovery_index : 1 },
            { name: 'Resting HR', value: readyData ? readyData.score_resting_hr : 1 },
            { name: 'Sleep Balance', value: readyData ? readyData.score_sleep_balance : 1 },
            { name: 'Temperature', value: readyData ? readyData.score_temperature : 1 }
        ])
        
        if (readyData){

            if(readyData.score>=85){
                setReadinessScore("Optimal")
            }else if(readyData.score<=70){
                setReadinessScore("Pay attension")
            }
            else{setReadinessScore("Good")}

        }else{
            setReadinessScore("No Informations")
        }

    },[readyData])


    return(
        <div className='readiness'>
            <div className="readiness-top">

                <h1 className='title'>Readiness</h1> 
                <div className='progress__div'>
                    <CircularProgress 
                    value={(readyData ? readyData.score : 2) /2} 
                    size='180px' 
                    thickness='4px'
                    transform="rotateZ(-90deg)"
                    color="white"
                    />
                </div>
                {readyData ? readyData.score >= 90 && <img className='readiness__crown' src={Crown}/> : "" }
                <p className='readiness__score'>{readyData ? readyData.score : 0}</p>
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
                    <YAxis dataKey="value" fill="#ffffff" domain={[0, 100]}/>
                    <Tooltip />
                </BarChart>
            </div>
        </div>
    )
}