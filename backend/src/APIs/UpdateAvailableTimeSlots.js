import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, eventNotExistResponse, notInvitedResponse } = responses;

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
  if (!event.participants.includes(user._id)) {
    // TODO: check bi-directional relation?
    return notInvitedResponse("UpdateAvailableTimeSlots");
  }

  // TODO: check startTime and endTime

  // TODO: async-lock the following block
  // update timeslot to db.TimeSlotModel

  return {
    type: "UpdateAvailableTimeSlots",
    result: {},
    data: {}
  }
}

// implementation details
const hasMissingFields = (args) => {
  const {requesterAccount, eventId, availableTimeSlots} = args;
  return (!!requesterAccount || !eventId || !availableTimeSlots);
}

// responses

export default updateAvailableTimeSlots;