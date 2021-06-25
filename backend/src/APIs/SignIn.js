import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, accountNotExistResponse } = responses;

const signIn = async (args) => {
  console.log('SignIn called.');

  if (hasMissingFields(args)){
    return missingFieldsResponse("SignIn");
  }

  const { account, password } = args;
  const existingUser = await db.UserModel.findOne({account: account})
  if (!existingUser) {
    return accountNotExistResponse("SignIn");
  } else if (existingUser.password !== password) {
    return wrongPasswordResponse();
  }

  const { nickname, friends, events } = existingUser;
  return {
    type: "SignIn",
    data: {
      success: true,
      nickname: nickname,
      friends: parseFriends(friends),
      events: parseEvents(events)
    }
  }
}

// implementation details
const hasMissingFields = (args) => {
  const { account, password } = args;
  return !account || !password;
}
const parseFriends = (friends) => {
  // TODO: from _id to objects
  return friends;
}
const parseEvents = (events) => {
  // TODO: from _id to objects
  return events;
}

// responses
const wrongPasswordResponse = () => {
  return {
    type: "SignIn",
    data: {
      success: false,
      errorType: "WRONG_PASSWORD"
    }
  }
}

export default signIn;