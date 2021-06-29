import { useState } from 'react';
import moment from 'moment';
import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';

const ScheduleTable = ({startDate, endDate, startTime, endTime, timeSlots}) => {


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
  for (let i = startTime; i < endTime; i+=0.5){
    timeArray.push(i);
  }
  return timeArray  
}
const newKey = (date_range, time_range) => {
  let keyArray = [""];
  date_range.map((date) => keyArray.push(date))
  for (let i = 0; i < time_range.length; i++){
    for(let j = 0; j < date_range.length; j++){
      if(j === 0)
          keyArray.push(`${time_range[i]}`);  
      keyArray.push(`${date_range[j]}_${time_range[i]}`); 
    }
  }
  return keyArray  
}

let date_range = getDates(new Date(Date.parse(startDate)), new Date(Date.parse(endDate)));
let time_range = getTimes(startTime, endTime);
let key_list = newKey(date_range, time_range);

const gridArray = (key_list) => {
  let arr = []
  key_list.map((key) => {
    if(key.length < 8)
      arr.push({key: key, value: key, readOnly: true, width: 100})
    
    else
      arr.push({key: key, value: key, participant: "", readOnly: true, width: 200})
  })

  let group = []
  for(let i = 0, j=arr.length; i < j; i+=(date_range.length+1)){
    group.push(arr.slice(i, i+(date_range.length+1)))
  }
  return group;
}

const str = gridArray(key_list);
const [grid, setGrid] = useState( str )

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