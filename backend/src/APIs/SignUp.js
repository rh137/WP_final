import db from "../db";

const signUp = async (args) => {
  console.log('SignUp called.');

  if (fieldsAreMissing(args)) {
    return missingFieldsRet(args)
  }

  const { account } = args;
  const existingUser = await db.UserModel.findOne({ account: account })
  if (existingUser) {
    return userExistsRet()
  } else {
    await addUserToDB(args);
    return newUserRet();
  }
}

// implementation details
const fieldsAreMissing = (args) => {
  const { account, password, nickname } = args;
  if (!account || !password || !nickname) return true;
  return false;
}
const missingFieldsRet = (args) => {
  const { account, password, nickname } = args;
  let ret = {
    type: "SignUp",
    data: {
      success: false,
      detail: "Missing field(s):"
    }
  }
  if (!account) ret.data.detail += " account,";
  if (!password) ret.data.detail += " password,";
  if (!nickname) ret.data.detail += " nickname,";
  ret.data.detail = ret.data.detail.substring(0, ret.data.detail.length-1) + ".";
  return ret;
}
const userExistsRet = () => {
  let ret = {
    type: "SignUp",
    data: {
      success: false,
      detail: "The account already exists."
    }
  }
  return ret;
}
const newUserRet = () => {
  let ret = {
    type: "SignUp",
    data: {
      success: true,
      detail: ""
    }
  }
  return ret;
}
const addUserToDB = async (args) => {
  const { account, password, nickname } = args;
  const newUser = await new db.UserModel({account, password, nickname});
  await newUser.save();
}

export default signUp;