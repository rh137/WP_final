import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, eventNotExistResponse,
        notInvitedResponse, accountNotExistResponse } = responses;

const updateAvailableTimeSlots = async (args) => {
  console.log('UpdateAvailableTimeSlots called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("UpdateAvailableTimeSlots");
  }

  const { eventId, requesterAccount } = args
  const event = await db.EventModel.findById(eventId);
  if (!event) {
    return eventNotExistResponse("UpdateAvailableTimeSlots");
  }

  const user = await db.UserModel.findOne({account: requesterAccount});
  if (!user){
    return accountNotExistResponse("UpdateAvailableTimeSlots")
  }
  if (!event.participants.includes(user._id)) {
    // TODO: check bi-directional relation?
    return notInvitedResponse("UpdateAvailableTimeSlots");
  }

  // TODO: check startTime and endTime

  // TODO: async-lock the following block
  // update timeslot to db.TimeSlotModel
  const { availableTimeSlots } = args;
  await db.TimeSlotModel.deleteMany({user: user._id, event: event._id})
  for (const { date, startTime, endTime } of availableTimeSlots) {
    await new db.TimeSlotModel({
      user: user._id,
      event: event._id,
      date: date,
      startTime: startTime,
      endTime: endTime
    }).save();
  }

  return updateAvailableTimeSlotsSuccessResponse();
}

// implementation details
const hasMissingFields = (args) => {
  const { requesterAccount, eventId, availableTimeSlots } = args;
  console.log(requesterAccount);
  console.log(eventId);
  console.log(availableTimeSlots);
  return (!requesterAccount || !eventId || !availableTimeSlots);
}

// responses
const updateAvailableTimeSlotsSuccessResponse = () => {
  return {
    type: "UpdateAvailableTimeSlots",
    result: {
      success: true
    }
  }
}

export default updateAvailableTimeSlots;