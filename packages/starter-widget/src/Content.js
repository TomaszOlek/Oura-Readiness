import React, { useState, useEffect } from "react";
import Loading from "./components/Loading"
import Menu from "./components/Menu"

import { usePrifina, Op } from "@prifina/hooks";
import Oura from "@prifina/oura";

import "./style.css"

const appID = "vZtgPtC93D1PYQC2cGXCzV";

const asyncFalseData = [
  "summary_date	score",
  "2022-09-04	87",
  "2022-09-05	87",
  "2022-09-06	87",
  "2022-09-07	87",
  "2022-09-08	87",
  "2022-09-09	87",
  "2022-09-10	87",
];


const DryRun = (props) => {

  const { onUpdate, Prifina, API, registerHooks } = usePrifina();
  const stage = props.stage || "dev";

  const [readyData, setReadyData] = useState(false)
  const [asyncReadyData, setAsyncReadyData] = useState(false)
  const [isDataReady, setIsDataReady] = useState(false)

  const processAsyncData = (data) =>{
    console.log("ORIGINAL PROCESS ASYNC DATA", data);

    let filterData = data;
    let readyData = []

    const keys = filterData[0].split("\t");
    console.log("keys", keys)

    for (let i=1; i < data.length; i++ ){
      let field = filterData[i].split("\t");
      let data = {}

      for (let i=0; i < field.length; i++ ){
        if (isNaN(Number(field[i]))){
          data[keys[i]] = field[i]
        }else{
          data[keys[i]] = Number(field[i])
        }
      }
      readyData.push(data)
    }

    console.log("async result", readyData)
  
    setAsyncReadyData(readyData)
  }

  const processData = (data) =>{
    console.log("ORIGINAL PROCESS DATA", data);

    const filterData = data;
    console.log(filterData[0])
    console.log("result", filterData)

    setReadyData(filterData)
  }

  const dataUpdate = async (payload) => {
    console.log("UPDATE ", payload);
    if (
      payload.hasOwnProperty("data") &&
      payload.data.hasOwnProperty("content")
    ) {
      // process async data
      if (
        payload.data.dataconnector === "Oura/queryReadinessSummariesAsync" &&
        payload.data.content.length > 1
      ) {
        console.log("update")
        processAsyncData(payload.data.content);
      }
      console.log("PAYLOAD DATA", payload);
    }
  }

  useEffect(async () => {
    onUpdate(appID, dataUpdate);
    registerHooks(appID, [Oura]);

    const referenceDay = 6
    const d = new Date(); 

    //get Today date
    const today = d.setDate(d.getDate()); 
    const todayDateStr = new Date(today).toISOString().split("T")[0];
    console.log("date", todayDateStr)
 
    //get a date that was 6("referenceDay") days ago 
    const dd = d.setDate(d.getDate() - referenceDay); 
    const asyncDateStr = new Date(dd).toISOString().split("T")[0];
    console.log("date", asyncDateStr)

    //Set filter to get data from last 6("referenceDay") days
    const asyncFilter = {
      ["s3::date"]: {
        [Op.gte]: asyncDateStr,
      },
    };

    //Filter data from today
    const filter = {
      ["s3::date"]: {
        [Op.eq]: todayDateStr,
      },
    };

    //Get filtered data
    const asyncResult = await API[appID].Oura.queryReadinessSummariesAsync({
      filter: asyncFilter,
      fields: "summary_date,score",
    });

    //Get today data
    const result = await API[appID].Oura.queryReadinessSummary({
      filter: filter,
    });

    // console.log("result", result)
    // console.log("asyncResult", asyncResult)

    processData(result.data.getDataObject.content[0]);

    //process the asyncData
    if (stage === "dev") {
      processAsyncData(asyncFalseData);
      processData(result.data.getDataObject.content);
    }
  }, []);

  useEffect(()=>{
    console.log(asyncReadyData)
    console.log(readyData[0])
    if (asyncReadyData && readyData){
      setIsDataReady(true)
    }
  },[readyData,asyncReadyData])

  return (
  <div style={
    { 
      border: "1px solid black", 
      margin: "10px", 
      borderRadius: "10px",
      height: "300px",
      width: "300px",
    }
  }>
  {
    isDataReady 
    ?
      <Menu asyncReadyData={asyncReadyData} readyData={readyData}/>
    :
      <Loading/>
  }
  </div>
  );
};

export default DryRun;
