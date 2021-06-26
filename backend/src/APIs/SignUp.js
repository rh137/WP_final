import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, accountExistsResponse } = responses;

import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const signUp = async (args) => {
  console.log('SignUp called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("SignUp");
  }

  let ret;
  const { account } = args;
  await lock.acquire('SignUpLock', async () => {
    const existingUser = await db.UserModel.findOne({ account: account })
    if (existingUser) {
      ret = accountExistsResponse("SignUp");
    } else {
      await addUserToDB(args);
      ret = signUpSuccessResponse();
    }
  });
  return ret;
}

// implementation details
const hasMissingFields = (args) => {
  const { account, password, nickname } = args;
  return (!account || !password || !nickname);
}
const addUserToDB = async (args) => {
  const { account, password, nickname } = args;
  const newUser = await new db.UserModel({account, password, nickname});
  await newUser.save();
}

// responses
const signUpSuccessResponse = () => {
  return {
    type: "SignUp",
    result: {
      success: true
    }
  };
}

export default signUp;