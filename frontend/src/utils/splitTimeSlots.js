/*{
  type: "GetAvailableTimeSlots",
    result: {
  success: Boolean,
    errorType: String
},
  data: {
    timeSlots: [{
      date: String,
      startTime: Number,
      endTime: Number,
      availableParticipants: [{
        account: String
        nickname: String
      }]
    }]
  }
}*/

function splitTimeSlots (timeSlots) {
  const returnedTimeSlots = [];
  for (const ts of timeSlots) {
    let currentStartTime = ts.startTime;
    while (currentStartTime !== ts.endTime) {
      returnedTimeSlots.push({
        date: ts.date,
        availableParticipants: ts.availableParticipants,
        startTime: currentStartTime,
        endTime: currentStartTime + 0.5
      });
      currentStartTime += 0.5;
    }
  }
  return returnedTimeSlots;
}

export { splitTimeSlots };