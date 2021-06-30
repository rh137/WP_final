import { useState } from 'react';
import moment from 'moment';
import ReactDataSheet from 'react-datasheet';
import '../App.css';
import { splitTimeSlots } from '../utils/index';

const ScheduleTable = ({startDate, endDate, startTime, endTime, timeSlots, participants, setAvailableParticipants, setUnavailableParticipants}) => {       
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
    data_list.map((i) => {
      if(i.key.length < 8)
        arr.push({key: i.key, value: i.key, participants: null, readOnly: true, width: "100vh"})
      
      else if(i.key.length < 11)
        arr.push({key: i.key, value: i.key, participants: null, readOnly: true, width: "180vh" })
      else if(i.participants.length === 0)
        arr.push({key: i.key, value: i.participants.length, participants: null, readOnly: true, width: "180vh"})
      else
        arr.push({key: i.key, value: i.participants.length, participants: i.participants, readOnly: true, width: "180vh"})     
    })

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
  const [grid, setGrid] = useState( grid_list )

  //Set Available/Unavailable Participants
  const handleSelected = (cell) =>{
    if(grid[cell.start.i][cell.start.j].participants !== null){
      setAvailableParticipants(grid[cell.start.i][cell.start.j].participants);
      //set unavailableParticipants()
      
    }
    else{
      setAvailableParticipants([""]);
      setUnavailableParticipants(participants);
    }
  }

    return (
        <ReactDataSheet
          data={grid}
          valueRenderer={cell => cell.value}
          style={{backgroundColor: "purple"}}
          onSelect={handleSelected}
        />
    );
}

export default ScheduleTable;