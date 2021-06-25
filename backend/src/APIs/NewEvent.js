import db from "../db";
import responses from './commonFailedResponses';
const { missingFieldsResponse, accountNotExistResponse } = responses;

const newEvent = async (args) => {
  console.log('NewEvent called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("NewEvent");
  }

  const { participants, launcher } = args
  if (!await allUsersExist(participants) || !await userExists(launcher)) {
    return accountNotExistResponse("NewEvent");
  }

  const { startDate, endDate, startTime, endTime } = args
  if (isInvalidDate(startDate)) return invalidStartDateResponse();
  else if (isInvalidDate(endDate)) return invalidEndDateResponse();
  else if (isInvalidTime(startTime)) return invalidStartTimeResponse();
  else if (isInvalidTime(endTime)) return invalidEndTimeResponse();


  const newEvent_ = await addEventToDB(args);
  await addEventToParticipants(newEvent_, participants);

  return newEventSuccessResponse(newEvent_);
}

// implementation details
const hasMissingFields = (args) => {
  const {
    title, description, startDate, endDate,
    startTime, endTime, participants, launcher
  } = args

  return (
    !title || description === undefined ||
    !startDate || !endDate ||
    !startTime || !endTime ||
    !participants || !launcher
  );
}
const allUsersExist = async (users) => {
  for (const user of users) {
    if (!await userExists(user)) {
      return false;
    }
  }
  return true
}
const userExists = async (user) => {
  const existingUser = await db.UserModel.findOne({account: user.account});
  if (existingUser) return true;
  return false;
}
const isInvalidDate = (date) => {
  // date: Date
  // TODO
  return false
}
const isInvalidTime = (time) => {
  // time: Number (Float)
  // TODO
  return false
}
const getUserIdFromAccount = async (account) => {
  const user = await db.UserModel.findOne({account: account});
  return user._id;
}
const getUserIds = async (users) => {
  return Promise.all(
    users.map(async ({ account }) => (
      await getUserIdFromAccount(account)
    ))
  )
}
const addEventToDB = async (args) => {
  const {
    title, description,
    startDate, endDate,
    startTime, endTime,
    participants, launcher
  } = args
  const newEvent_ = await new db.EventModel({
    title: title,
    description: description,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    participants: await getUserIds(participants),
    launcher: await getUserIdFromAccount(launcher.account)
  })
  await newEvent_.save();
  return newEvent_;
}
const addEventToParticipants = async (event, participants) => {
  const participantIds = await getUserIds(participants);
  for (const userId of participantIds) {
    const user = await db.UserModel.findById(userId);
    user.events.push(event);
    await user.save();
  }
}

// responses
const invalidStartDateResponse = () => {
  return {
    type: "NewEvent",
    data: {
      success: false,
      errorType: "INVALID_START_DATE"
    }
  }
}
const invalidEndDateResponse = () => {
  return {
    type: "NewEvent",
    data: {
      success: false,
      errorType: "INVALID_END_DATE"
    }
  }
}
const invalidStartTimeResponse = () => {
  return {
    type: "NewEvent",
    data: {
      success: false,
      errorType: "INVALID_START_TIME"
    }
  }
}
const invalidEndTimeResponse = () => {
  return {
    type: "NewEvent",
    data: {
      success: false,
      errorType: "INVALID_END_TIME"
    }
  }
}
const newEventSuccessResponse = async (event) => {
  const returnedParticipants = Promise.all(
    event.participants.map(async (_id) => {
      const user = await db.UserModel.findById(_id);
      return {
        account: user.account,
        nickname: user.nickname
      }
    })
  );
  const launcherObj = await db.UserModel.findById(event.launcher);
  const returnedLauncher = {
    account: launcherObj.account,
    nickname: launcherObj.nickname
  };

  return {
    type: "NewEvent",
    data: {
      success: true,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      participants: returnedParticipants,
      launcher: returnedLauncher
    }
  };
}

export default newEvent;