import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, eventNotExistResponse,
        accountNotExistResponse, notInvitedResponse} = responses;

const getMyAvailableTimeSlots = async (args) => {
  console.log('GetMyAvailableTimeSlots called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("GetMyAvailableTimeSlots");
  }

  const {requesterAccount, eventId} = args;
  const event = await db.EventModel.findById(eventId);
  if (!event) {
    return eventNotExistResponse("GetMyAvailableTimeSlots");
  }

  const user = await db.UserModel.findOne({account: requesterAccount});
  if (!user) {
    return accountNotExistResponse("GetMyAvailableTimeSlots");
  }

  if (!event.participants.includes(user._id)) {
    return notInvitedResponse("GetMyAvailableTimeSlots");
  }


  const availableTimeSlotsOfTheUser = await db.TimeSlotModel.find({event: eventId, user: user});
  const returnedAvailableTimeSlotsOfTheUser = availableTimeSlotsOfTheUser.map(ts => {
    return {
      date: ts.date,
      startTime: ts.startTime,
      endTime: ts.endTime
    }
  })

  return getMyAvailableTimeSlotsSuccessResponse(returnedAvailableTimeSlotsOfTheUser);
}

// implementation details
const hasMissingFields = (args) => {
  const { requesterAccount, eventId } = args;
  return (!requesterAccount || !eventId);
}

// responses
const getMyAvailableTimeSlotsSuccessResponse = (returnedTimeSlots) => {
  return {
    type: "GetMyAvailableTimeSlots",
    result: {
      success: true
    },
    data: {
      availableTimeSlots: returnedTimeSlots
    }
  }
}

export default getMyAvailableTimeSlots;