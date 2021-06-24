import db from "../db";
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const signUp = async (args) => {
  console.log('SignUp called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse();
  }

  let ret;
  const { account } = args;
  await lock.acquire('key', async () => {
    const existingUser = await db.UserModel.findOne({ account: account })
    if (existingUser) {
      ret = userExistsResponse();
    } else {
      await addUserToDB(args);
      ret = successResponse();
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
const missingFieldsResponse = () => {
  return {
    type: "SignUp",
    data: {
      success: false,
      errorType: "MISSING_FIELDS"
    }
  };
}
const userExistsResponse = () => {
  return {
    type: "SignUp",
    data: {
      success: false,
      errorType: "ACCOUNT_EXISTS"
    }
  };
}
const successResponse = () => {
  return {
    type: "SignUp",
    data: {
      success: true
    }
  };
}

export default signUp;