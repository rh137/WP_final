import util from 'util';
import _ from 'lodash';
import db from "../db";
const logDeep = (obj) => { console.log(util.inspect(obj, false, null, true)); return;}

const timeSlots = [
  { account: "user1", startTime: 7, endTime: 9 },
  { account: "user2", startTime: 8, endTime: 10 },
]
const expectedOutput = [
  { startTime: 7, endTime: 8,  availableParticipants: [ { account: "user1" } ] },
  { startTime: 8, endTime: 9,  availableParticipants: [ { account: "user1" }, { account: "user2" } ] },
  { startTime: 9, endTime: 10, availableParticipants: [ { account: "user2" } ] }
]
async function parseTimeSlots (timeSlots) {
  const splitTimeSlots = await split(timeSlots);
  splitTimeSlots.sort(compareTimeSlots);

  let ret = [];

  let startTimeStack = []
  let currentStartTime = -1;
  let currentUsers = []
  for (const ts of splitTimeSlots) {
    if (ts.type === "START") {
      startTimeStack.push(ts.time);
      if (currentStartTime !== -1 && ts.time !== currentStartTime) {  // not first element
        ret.push({
          availableParticipants: Object.assign([], currentUsers),
          startTime: currentStartTime,
          endTime: ts.time,
        })  // end last slot
      }
      currentStartTime = ts.time;
      currentUsers.push(ts.user);
    } else {  // ts.type === "END"
      startTimeStack.pop();
      if (ts.time !== currentStartTime) {
        ret.push({
          availableParticipants: Object.assign([], currentUsers),
          startTime: currentStartTime,
          endTime: ts.time,
        })
      }
      // remove ts.account from currentUsers use filter
      currentUsers = currentUsers.filter(obj => obj.account !== ts.user.account);

      if (startTimeStack.length === 0) {
        currentStartTime = -1  // restart
      } else {
        currentStartTime = ts.time;
      }
    }
  }

  return ret;
}

// utilities
/*
const timeSlots = [
  { account: "user1", startTime: 7, endTime: 9 },
  { account: "user2", startTime: 8, endTime: 10 },
] */
const expectedSplitTimeSlots = [
  { account: "user1", time: 7, type: "START" },
  { account: "user1", time: 9, type: "END" },
  { account: "user2", time: 8, type: "START" },
  { account: "user2", time: 10, type: "END" }
]
async function split (timeSlots) {
  const splitTimeSlots = []
  for (const ts of timeSlots) {
    const user = await db.UserModel.findById(ts.user);
    splitTimeSlots.push({
      user: {
        account: user.account,
        nickname: user.nickname
      },
      // account: ts.account,
      time: ts.startTime,
      type: "START"
    }, {
      user: {
        account: user.account,
        nickname: user.nickname
      },
      // account: ts.account,
      time: ts.endTime,
      type: "END"
    });
  }
  return splitTimeSlots;
}
function compareTypes (t1, t2) {
  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
  return 0;
}
function compareTimeSlots(ts1, ts2) {
  if (ts1.time === ts2.time) {
    return compareTypes(ts1.type, ts2.type);
  } else {
    return ts1.time - ts2.time;
  }
}


function main () {
  let o1 = parseTimeSlots(timeSlots);
  let o2 = expectedOutput;

  logDeep(o1)
  logDeep(o2)

  console.log(_.isEqual(o1, o2));
}

//main();

export { parseTimeSlots };