import db from "../db";
import { parseTimeSlots } from "./myUtil";
import util from "util";

const getAvailableTimeSlots = async (args) => {
  console.log('GetAvailableTimeSlots called.');

  // TODO: check missing fields

  // TODO: check if the event exists

  // TODO: check if the account exists

  // TODO: check if the user is invited

  const { requesterAccount, eventId } = args;
  //const user = await db.UserModel.findOne({ account: requesterAccount });
  const event = await db.EventModel.findById(eventId);
  const { startDate, endDate } = event;

  // (pseudocode)
  //    for date in [startDate, endDate]:
  //      1) find all timeslots of event on date
  //      2) apply parseTimeSlotsInADate.js
  //      3) add date fields to each output time slot, push to ret
  //    return ret
  const ret = [];
  const dateStrings = getAllDateStringsInRange(startDate, endDate);
  for (const date of dateStrings) {
    const timeSlotsOnDate = await db.TimeSlotModel.find({date: date, event: eventId});
    const ret__ = await parseTimeSlots(timeSlotsOnDate)
    if (ret__.length > 0) {
      console.log(ret__[0].availableParticipants)
      ret__.forEach((obj) => { obj.date = date })
      ret.push(...ret__)
    }
  }
  for (const r of ret) {
    console.log(r)
    //console.log(r.availableParticipants);
  }

  return {
    type: "GetAvailableTimeSlots",
    result: {
      success: true
    },
    data: {
      timeSlots: ret
    }
  }
}

// implementation details
const getDaysByYearAndMonth = (year, month) => {
  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12: return 31;
    case 4: case 6: case 9: case 11: return 30;
    case 2:
      if (year % 400 === 0) return 29;
      if (year % 100 === 0) return 28;
      if (year % 4 === 0) return 29;
      return 28;
  }
}
function parseDateString(dateString) {
  // dateString: type String, format yyyy_mm_dd
  const [y, m, d] = dateString.split("-").map(s => parseInt(s, 10))
  return { y: y, m: m, d: d }
}
function getAllDateStringsInRange(startDate, endDate) {
  const start = parseDateString(startDate)
  const end = parseDateString(endDate)
  if (start.y  >  end.y) return []
  if (start.y === end.y && start.m  >  end.m) return []
  if (start.y === end.y && start.m === end.m && start.d > end.d) return []

  const ret =[]
  for (let y = start.y; y <= end.y; y++) {
    for (let m = 1; m <= 12; m++) {
      if (y === start.y && m < start.m) continue
      if (y === end.y   && m > end.m) continue
      const days = getDaysByYearAndMonth(y, m);
      for (let d = 1; d <= days; d++) {
        if (y === start.y && m === start.m && d < start.d) continue
        if (y === end.y   && m === end.m   && d > end.d) continue
        ret.push("" + y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d);
      }
    }
  }
  return ret;
}

export default getAvailableTimeSlots;