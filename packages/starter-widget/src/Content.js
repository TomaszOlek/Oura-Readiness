import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loading from "./components/Loading"
import Menu from "./components/Menu"

import { usePrifina, Op } from "@prifina/hooks";
import Oura from "@prifina/oura";

import "./style.css"
//  /?path=/story/dry-run-widget--box

// Oura
// "queryActivitySummary",
// "queryActivitySummariesAsync",
// "queryReadinessSummary",
// "queryReadinessSummariesAsync",

//  Dont Work v ?? : Cannot convert undefined or null to object
// "querySleepData",      longest sleep period
// "querySleepDataAsync",
// "querySleepSummary",
// "querySleepSummariesAsync",

const appID = process.env.APP_ID;


const DryRun = (props) => {

  const { onUpdate, Prifina, API, registerHooks } = usePrifina();
  const stage = props.stage || "prod";

  const [readyData, setReadyData] = useState(false)
  const [isDataReady, setIsDataReady] = useState(true)

  const setData = (data) =>{
    setReadyData(data.content)
    setIsDataReady(true)
  }

  const dataUpdate = async (payload) => {
    // console.log("UPDATE ", payload);
    // if (
    //   payload.hasOwnProperty("settings") &&
    //   typeof data.settings === "object" &&
    //   payload.settings.hasOwnProperty("city")
    // ) {
    //   setCity(payload.settings.city);
    //   setUrl(
    //     `${API_BASE_URL}/data/2.5/onecall?q=${data.settings.city}&units=metric&appid=${API_KEY}`
    //   );
    // }

    // if (
    //   payload.hasOwnProperty("data") &&
    //   payload.data.hasOwnProperty("content")
    // ) {
    //   // process async data
    //   if (
    //     payload.data.dataconnector === "Oura/queryActivitySummariesAsync" &&
    //     payload.data.content.length > 1
    //   ) {
    //     processData(payload.data.content);
    //   }
    // }
  };

  useEffect(async () => {

    onUpdate(appID, dataUpdate);
    registerHooks(appID, [Oura]);

    //get a date that was 8("referenceDay") days ago 
    const referenceDay = 7
    const d = new Date(); 
    const dd = d.setDate(d.getDate() - referenceDay); 
    const dateStr = new Date(dd).toISOString().split("T")[0];
    console.log("date", dateStr)

    //Filter data from last 8("referenceDay") days
    const filter = {
      ["s3::date"]: {
        [Op.eq]: dateStr,
      },
    };

    // Get filtered data
    const activityResult = await API[appID].Oura.queryReadinessSummary({
      filter: filter,
    });

    //process the received data
    if (stage === "dev") {
      console.log("data", activityResult.data.getDataObject)
      setData(activityResult.data.getDataObject)
    }

  }, []);

  const Container = styled("div")(
    {
      boxShadow: 0,
      padding: 5,
      borderRadius: 10,
      backgroundColor: "white",
      height: 300,
      width: 300,
    },
  );


  return (
  <Container style={{ border: "1px solid black", margin: "10px", borderRadius: "10px" }}>
  {
    isDataReady 
    ?
      <Menu readyData={readyData}/>
    :
      <Loading/>
  }
  </Container>
  );
};

export default DryRun;
