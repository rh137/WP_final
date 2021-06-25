import db from "../db";
import responses from './commonFailedResponses';
const { missingFieldsResponse, accountNotExistResponse } = responses;

const newEvent = async (args) => {
  console.log('NewEvent called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("NewEvent");
  }
  const {
    title, description,
    startDate, endDate,
    startTime, endTime,
    participants, launcher
  } = args

  if (!await allAccountExist(participants) || !await accountExists(launcher.account)) {
    return accountNotExistResponse("NewEvent");
  }

  if (isInvalidDate(startDate)) return invalidStartDateResponse();
  else if (isInvalidDate(endDate)) return invalidEndDateResponse();
  else if (isInvalidTime(startTime)) return invalidStartTimeResponse();
  else if (isInvalidTime(endTime)) return invalidEndTimeResponse();

  // TODO: add validated event to db

  return {
    type: "NewEvent",
    data: {}
  }
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
const allAccountExist = async (participants) => {
  for (const { account } of participants) {
    if (!await accountExists(account)) {
      return false;
    }
  }
  return true
}
const accountExists = async (account) => {
  const existingUser = await new db.UserModel.findOne({account: account});
  if (existingUser) return true;
  return false;
}
const isInvalidDate = (date) => {
  // date: Date
  // TODO
}
const isInvalidTime = (time) => {
  // time: Number (Float)
  // TODO
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

export default newEvent;