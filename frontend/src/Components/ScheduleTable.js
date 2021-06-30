import React, { useState } from 'react';
import moment from 'moment';
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';

const ScheduleTable = ({startDate, endDate, startTime, endTime, setAvailableParticipants, setUnavailableParticipants}) => {         //add timeSlots
  //for test 
  const timeSlots = [
    {date: "2021-06-29", startTime: 9, endTime: 9.5, availableParticipants: [{account: 'irene', nickname: "Irene"}, {account: 'wendy', nickname: "Wendy"}]}
  ] 

  //get date list
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
    date_range.map((date) => keyArray.push({key: date, participants:""}))
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
    data_list.map((i, {participants}) => {
      if(i.key.length < 8)
        arr.push({key: i.key, value: i.key, readOnly: true, width: 100})
      
      else if(i.key.length < 11)
        arr.push({key: i.key, value: i.key, readOnly: true, width:200 })
      else
        arr.push({key: i.key, value: i.participants.length, participants: i.participants, readOnly: true, width: 200})     
    })
    console.log(arr);
    let gridArray = []
    for(let i = 0, j=arr.length; i < j; i+=(date_range.length+1)){
      gridArray.push(arr.slice(i, i+(date_range.length+1)))
    }
    return gridArray;
  }

  let date_range = getDates(new Date(Date.parse(startDate)), new Date(Date.parse(endDate)));
  let time_range = getTimes(startTime, endTime);
  let time_list = getTimeFormat(startTime, endTime);
  let key_list = getKey(date_range, time_range, time_list);
  let data_list = getData(key_list, timeSlots);
  console.log(data_list)

  const grid_list = getGrid(data_list);
  const [grid, setGrid] = useState( grid_list )

  const handleSelected = (cell) =>{
    console.log(cell);
    console.log(grid[cell.start.i][cell.start.j])
  }


    return (
        <ReactDataSheet
          data={grid}
          valueRenderer={cell => cell.value}
          style={{width:100}}
          onSelect={handleSelected}
        />
    );
}

export default ScheduleTable;