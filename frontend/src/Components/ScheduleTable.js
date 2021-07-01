import React from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import ReactDataSheet from 'react-datasheet';
import '../App.css';
import { splitTimeSlots } from '../utils/index';

const ScheduleTable = ({startDate, endDate, startTime, endTime, timeSlots, participants, setAvailableParticipants, setUnavailableParticipants}) => {       
  console.log("ScheduleTable: ");
  console.log(timeSlots)
  //get dates in `YYYY-MM-DD`
  Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  const getDates = (startDate, endDate) => {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(moment(new Date (currentDate)).format("YYYY-MM-DD"));
      currentDate = currentDate.addDays(1);
    }
    return dateArray
  }
  //get time in float
  const getTimes = (startTime, endTime) => {
    let timeArray = [];
    for (let i = startTime; i < endTime; i+=0.5)
      timeArray.push(i);
    return timeArray  
  }
  const getTimeFormat = (startTime, endTime) => {
    let timeArray = [];
    for (let i = startTime; i < endTime; i+=0.5){
      let hour = parseInt(i).toString();
      let time;
      if(i % 1 !== 0)
        time = hour.concat(":30")
      else
        time = hour.concat(":00")
      timeArray.push(time);
    }
    return timeArray  
  }
  const getKey = (date_range, time_range, time_list) => {
    let keyArray = [{key: "", participants:""}];
    date_range.map((date) => keyArray.push({key: moment(date).format("M/D"), participants:""}))
    for (let i = 0; i < time_range.length; i++){
      for(let j = 0; j < date_range.length; j++){
        if(j === 0)
            keyArray.push({key:`${time_list[i]}`, participants:""});  
        keyArray.push({key: `${date_range[j]}_${time_range[i]}`, participants:""}); 
      }
    }
    return keyArray  
  }
  const getData = (key_list, timeSlots) => {
    timeSlots.map(({date, startTime, availableParticipants}) => {
      let index = key_list.findIndex(value => value.key === `${date}_${startTime}`)
      if(index !== -1)
        key_list[index] = {key: `${date}_${startTime}`, participants: availableParticipants}
    })
    return key_list
  }

  const getGrid = (data_list) => {
    let arr = []
    // row length: date_range.length + 1
    for (let _ = 0; _ < data_list.length; _++) {
      let i = data_list[_];
      if(i.key.length < 8)
        arr.push({key: i.key, value: i.key, participants: null, readOnly: true, width: "100vh", type: "COL1"})

      else if(i.key.length < 11)
        arr.push({key: i.key, value: i.key, participants: null, readOnly: true, width: "180vh", type: "ROW1"})
        //else if(i.participants.length === 0)
      //  arr.push({key: i.key, value: i.participants.length, participants: null, readOnly: true, width: "180vh"})
      else{
        let li = Math.floor(_ / (date_range.length + 1));
        let lj = _ % (date_range.length + 1);
        arr.push({key: i.key, value: i.participants.length, participants: ((i.participants.length === 0) ? null : i.participants), readOnly: true, width: "180vh", type: "VAL", loci: li, locj: lj})
      }
    }

    let gridArray = []
    for(let i = 0, j=arr.length; i < j; i+=(date_range.length+1)){
      gridArray.push(arr.slice(i, i+(date_range.length+1)))
    }
    return gridArray;
  }
  
  timeSlots = splitTimeSlots(timeSlots);
  let date_range = getDates(new Date(Date.parse(startDate)), new Date(Date.parse(endDate)));
  let time_range = getTimes(startTime, endTime);
  let time_list = getTimeFormat(startTime, endTime);
  let key_list = getKey(date_range, time_range, time_list);
  let data_list = getData(key_list, timeSlots);
  const grid_list = getGrid(data_list);
  //const [grid, setGrid] = useState(grid_list);
  const color_list = ["#6495ed", "#5286d5", "#5077be", "4668a6", "3c598e"]

  //Set Available/Unavailable Participants
  const handleSelected = (cell) =>{
    console.log(cell)
    if(grid_list[cell.start.i][cell.start.j].participants !== null){
      setAvailableParticipants(grid_list[cell.start.i][cell.start.j].participants);

      //set unavailableParticipants()
      let unavailableArray = participants;
      grid_list[cell.start.i][cell.start.j].participants.map(({account}) => {
        unavailableArray=(unavailableArray.filter(function(participant){
          return participant.account !== account;
        }))
      })
      setUnavailableParticipants(unavailableArray);
    }
    else{
      setAvailableParticipants([""]);
      if(cell.start.i !==0 && cell.start.j !== 0)
        setUnavailableParticipants(participants);
      else
        setUnavailableParticipants([""]);
    }
  }

    return (
        <ReactDataSheet
          //data={grid}
          data={grid_list}
          valueRenderer={cell => cell.value}
          onSelect={handleSelected}
          rowRenderer={(props) => {
            return <tr style={{"white-space": "nowrap", 'overflow': 'scroll'}}>{props.children}</tr>
          }}
          cellRenderer={(props) => {
            const { participants } = props.cell;
            const participantsCount = participants ? participants.length : 0;
            let class_ = 'cell val';
            if (props.cell.type === "VAL") {
              class_ += ' part' + Math.min(participantsCount, 5);
              class_ += ' i' + props.cell.loci;
              class_ += ' j' + props.cell.locj;
            }
            return (
              props.cell.type === "COL1" ?
                <td style={{'background-color': 'white'}} className='cell col1'>
                  {props.cell.value}
                </td> :
              props.cell.type === "ROW1" ?
                <td style={{'background-color': 'white'}} className='cell row1'>
                  {props.cell.value}
                </td> :
                <td className={class_}
                    onMouseOver={(event) => {
                      const cls = event.target.className.split(' ');
                      console.log(cls)
                      const i = cls[cls.length - 2].slice(1);
                      const j = cls[cls.length - 1].slice(1);
                      console.log(i);
                      console.log(j);
                      const arg = {
                        start: {
                          i: parseInt(i),
                          j: parseInt(j)
                        }
                      }
                      handleSelected(arg);
                      }
                    } onMouseLeave={(event) => {
                      setAvailableParticipants([""]);
                      setUnavailableParticipants([""]);
                    }}
                    >
                  {participantsCount}
                </td>
            )
          }}
        />
    );
}

export default ScheduleTable;