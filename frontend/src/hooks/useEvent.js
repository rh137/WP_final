import {useState} from "react";

const useEvent = () => {
    let eventInfo = [];
    
    const newEvent = (account, title, description, date_start, date_end, time_start, time_end, participant) => {
        console.log(account, title, date_start, date_end, time_start, participant);

    }




    return{eventInfo, newEvent}

}

export default useEvent;