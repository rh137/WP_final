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
      friends: await getFriendObjectsByIds(friends),
      events: getEventObjectsByIds(events)
    }
  }
}

// implementation details
const hasMissingFields = (args) => {
  const { account, password } = args;
  return !account || !password;
}
const getFriendObjectsByIds = async (friendIds) => {
  // ref: https://flaviocopes.com/javascript-async-await-array-map/
  return Promise.all(
    friendIds.map(
      async (friendId) => {
        const friend = await db.UserModel.findById(friendId);
        return {
          account: friend.account,
          nickname: friend.nickname
        };
      }
    )
  );
}
const getEventObjectsByIds = (events) => {
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