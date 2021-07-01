import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, eventNotExistResponse,
        notInvitedResponse, accountNotExistResponse } = responses;
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

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

  const { availableTimeSlots } = args;
  for (const { date, startTime, endTime } of availableTimeSlots) {
    if (date < event.startDate || date > event.endDate) {
      return dateOutOfRangeResponse();
    }
    if (startTime < event.startTime || endTime > event.endTime) {
      return timeOutOfRangeResponse();
    }
  }

  // update timeslot to db.TimeSlotModel
  await lock.acquire('timeSlotsDBLock', async () => {
    await db.TimeSlotModel.deleteMany({user: user._id, event: event._id})
    for (const {date, startTime, endTime} of availableTimeSlots) {
      await new db.TimeSlotModel({
        user: user._id,
        event: event._id,
        date: date,
        startTime: startTime,
        endTime: endTime
      }).save();
    }
  })

  return updateAvailableTimeSlotsSuccessResponse();
}

// implementation details
const hasMissingFields = (args) => {
  const { requesterAccount, eventId, availableTimeSlots } = args;
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
const timeOutOfRangeResponse = () => {
  return {
    type: "UpdateAvailableTimeSlots",
    result: {
      success: false,
      errorType: "TIME_OUT_OF_RANGE"
    },
    data: {}
  }
}
const dateOutOfRangeResponse = () => {
  return {
    type: "UpdateAvailableTimeSlots",
    result: {
      success: false,
      errorType: "DATE_OUT_OF_RANGE"
    },
    data: {}
  }
}

export default updateAvailableTimeSlots;