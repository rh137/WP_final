import db from "../db";

const getMyAvailableTimeSlots = async (args) => {
  console.log('GetMyAvailableTimeSlots called.');

  // TODO: check missing fields

  // TODO: check if the event exists

  // TODO: check if the account exists

  // TODO: check if the user is invited

  const { requesterAccount, eventId } = args;
  const user = await db.UserModel.findOne({ account: requesterAccount });
  const event = await db.EventModel.findById(eventId);
  const availableTimeSlotsOfTheUser = await db.TimeSlotModel.find({event: eventId, user: user});
  const returnedAvailableTimeSlotsOfTheUser = availableTimeSlotsOfTheUser.map(ts => {
    return {
      date: ts.date,
      startTime: ts.startTime,
      endTime: ts.endTime
    }
  })

  return {
    type: "GetMyAvailableTimeSlots",
    result: {
      success: true
    },
    data: {
      availableTimeSlots: returnedAvailableTimeSlotsOfTheUser
    }
  }
}

// implementation details

export default getMyAvailableTimeSlots;