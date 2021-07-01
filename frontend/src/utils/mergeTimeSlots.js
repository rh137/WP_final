/*{
  type: "UpdateAvailableTimeSlots",
  args: {
    requesterAccount: String,
    eventId: mongoose.Types.ObjectId,
    availableTimeSlots: [{
      date: String,
      startTime: Number,
      endTime: Number
    }]
  }
}*/

function mergeTimeSlots (timeSlots) {
  timeSlots.sort((ts1, ts2) => {
    if (ts1.date < ts2.date) return -1;
    if (ts1.date > ts2.date) return 1;
    else {
      if (ts1.startTime < ts2.startTime) return -1;
      if (ts1.startTime > ts2.startTime) return 1;
    }
    return 0;
  })
  const mergedTimeSlots = [];
  let currentStartTime = -1;
  let currentEndTime = -1;
  let currentDate = -1;
  for (const ts of timeSlots) {
    if (currentStartTime === -1) {
      currentStartTime = ts.startTime;
      currentEndTime = ts.endTime;
      currentDate = ts.date;
    } else if (ts.date === currentDate && currentEndTime === ts.startTime) {
      currentEndTime = ts.endTime
    } else {
      // push to mergedTimeSlots
      mergedTimeSlots.push({
        date: currentDate,
        startTime: currentStartTime,
        endTime: currentEndTime
      })
      // reset state variables
      currentDate = ts.date;
      currentStartTime = ts.startTime;
      currentEndTime = ts.endTime;
    }
  }
  // last time slot
  mergedTimeSlots.push({
    date: currentDate,
    startTime: currentStartTime,
    endTime: currentEndTime
  })
  return mergedTimeSlots;
}

/*
// 1. same date, touched intervals
const in1 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 5.5, endTime: 6 },
  { date: "2020-07-17", startTime: 6, endTime: 6.5 },
  { date: "2020-07-17", startTime: 6.5, endTime: 7 },
]
const out1 = [
  { date: "2020-07-17", startTime: 5, endTime: 7 }
]

// 2. same date, disjoint intervals
const in2 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 6, endTime: 6.5 },
  { date: "2020-07-17", startTime: 7, endTime: 7.5 },
]
const out2 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 6, endTime: 6.5 },
  { date: "2020-07-17", startTime: 7, endTime: 7.5 },
]

// 3. same date, mixed
const in3 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 6, endTime: 6.5 },
  { date: "2020-07-17", startTime: 7, endTime: 7.5 },
  { date: "2020-07-17", startTime: 7.5, endTime: 8 },
  { date: "2020-07-17", startTime: 8, endTime: 8.5 },
  { date: "2020-07-17", startTime: 9, endTime: 9.5 },
  { date: "2020-07-17", startTime: 9.5, endTime: 10 },
]
const out3 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 6, endTime: 6.5 },
  { date: "2020-07-17", startTime: 7, endTime: 8.5 },
  { date: "2020-07-17", startTime: 9, endTime: 10 },
]

// 4. different date 1
const in4 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
]
const out4 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
]

// 5. different date 2
const in5 = [
  { date: "2020-07-19", startTime: 5, endTime: 5.5 },
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
]
const out5 = [
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
  { date: "2020-07-19", startTime: 5, endTime: 5.5 },
]

// 6. different date 3
const in6 = [
  { date: "2020-07-17", startTime: 5, endTime: 5.5 },
  { date: "2020-07-17", startTime: 5.5, endTime: 6 },
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
  { date: "2020-07-18", startTime: 10, endTime: 10.5 },
  { date: "2020-07-18", startTime: 10.5, endTime: 11 },
  { date: "2020-07-18", startTime: 11, endTime: 11.5 },
  { date: "2020-07-18", startTime: 11.5, endTime: 12 },
]
const out6 = [
  { date: "2020-07-17", startTime: 5, endTime: 6 },
  { date: "2020-07-18", startTime: 5.5, endTime: 6 },
  { date: "2020-07-18", startTime: 10, endTime: 12 },
]
*/

export { mergeTimeSlots };