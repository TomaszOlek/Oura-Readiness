import { useEffect, useState, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'

import TodayReadiness from "./TodayReadiness"
import WeeklyReadiness from "./WeeklyReadiness"
import Loading from "./Loading"

// import rawData from "../rawData.json"


const Menu = (props) =>{
    const asyncReadyData = props.asyncReadyData
    const readyData = props.readyData

    const [backgroundImage, setBackgroundImage] = useState("")
    const [isDataReady, setIsDataReady] = useState(false)
    const [reload, setReaload] = useState(false)
    const [changeItem, setChangeItem] = useState(false)

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    
    useEffect(()=>{
        fetch(`https://picsum.photos/id/${getRandomInt(1084)}/info`) // TODO: Change API
        .then(res => {if(res.status === 404){
            setReaload(r => !r)
        } // SomeTimes we get 404 error so we need to get new image
        else{
            return res.json()
        }})
        .then(res => setBackgroundImage(res.download_url))
        .then(setIsDataReady(true))
    },[reload])

    const handleClick = () =>{
        setChangeItem(r=>!r)
    }

    return(     
    <>
    {isDataReady ?

    <div className="menu">
        <div className='background'>
            <div className='background__burger'/>
            <div 
                className='background__top' 
                style={{backgroundImage: `url(${backgroundImage})`}}
            >
                <div className='background__blur'></div>
            </div>
            <div className='background__bottom'></div>
        </div>

        <div className="scroll-container">
            <div 
            className={`scorll-container__items  
            ${changeItem ? "left" : "right"}`}>
                <TodayReadiness readyData={readyData} handleClick={handleClick}/>
                <WeeklyReadiness asyncReadyData={asyncReadyData} handleClick={handleClick}/>
            </div>
        </div>
    </div>

    :
    <Loading/>
    }
    </>
    )
}

export default Menu