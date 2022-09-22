import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { CircularProgress } from '@chakra-ui/react'
import { useEffect, useState } from 'react';

import Crown from "../img/Crown.png"
import arrow_left from "../img/arrow_left.png"

export default function WeeklyReadiness(props){
 
    const [chartData, setChartData] = useState([])
    const [averageScore, setAverageScore] = useState(0)
    const days = []
    const readyData = props.asyncReadyData
    const handleClick = props.handleClick
    let sumary = 0

    for(let i=0;i<=6; i++){
        const d = new Date(); 
        const dd = d.setDate(d.getDate() - i); 
        const dateStr = new Date(dd).toISOString().split("T")[0];
        days.push(dateStr)

        if(readyData[i] !== undefined){
            sumary = sumary + readyData[i].score
        }
    }

    useEffect(()=>{
        setChartData ([
            { 
                name: readyData[6] ? readyData[6].summary_date : "xxx-xx-xx",
                value: readyData[6] ? readyData[6].score : 1 
            },
            { 
                name: readyData[5] ? readyData[5].summary_date : "xxx-xx-xx", 
                value: readyData[5] ? readyData[5].score : 1
            },
            { 
                name: readyData[4] ? readyData[4].summary_date : "xxx-xx-xx", 
                value: readyData[4] ? readyData[4].score : 1 
            },
            { 
                name: readyData[3] ? readyData[3].summary_date : "xxx-xx-xx", 
                value: readyData[3] ? readyData[3].score : 1 
            },
            {
                name: readyData[2] ? readyData[2].summary_date : "xxx-xx-xx",
                value: readyData[2] ? readyData[2].score : 1 
            },
            { 
                name: readyData[1] ? readyData[1].summary_date : "xxx-xx-xx",
                value: readyData[1] ? readyData[1].score : 1 
            },
            { 
                name: readyData[0] ? readyData[0].summary_date : "xxx-xx-xx",
                value: readyData[0] ? readyData[0].score : 1
            },
        ])

        setAverageScore(sumary/7)
    },[readyData])

    return( 
        <div className='readiness'>
            <div className="readiness-top">

                <h1 className='title'>Week Average</h1> 
                <div className='progress__div'>
                    <CircularProgress 
                        value={averageScore > 1 ? averageScore/2 : 1 } 
                        size='180px' 
                        thickness='4px'
                        transform="rotateZ(-90deg)"
                        color="white"
                    />
                </div>
                {averageScore >= 85 && <img className='readiness__crown' src={Crown}/> }
                <p className='readiness__score'>{Math.round(averageScore)}</p>
                <div style={{position: "absolute"}} onClick={handleClick}>
                    <img src={arrow_left} className="arrow_left"/>
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