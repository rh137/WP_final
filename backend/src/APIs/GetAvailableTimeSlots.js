import db from "../db";

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

  // TODO: (pseudocode)
  //    for date in [startDate, endDate]:
  //      1) find all timeslots of event on date
  //      2) apply parseTimeSlotsInADate.js
  //      3) add date fields to each output time slot, push to ret
  //    return ret

  return {
    type: "GetAvailableTimeSlots",
    result: {},
    data: {}
  }
}

export default getAvailableTimeSlots;