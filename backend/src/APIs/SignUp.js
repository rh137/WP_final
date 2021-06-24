import db from "../db";

const signUp = async (args) => {
  console.log('SignUp called.');

  const { account, password, nickname } = args;
  let ret = { type: "SignUp" }
  if (!account || !password || !nickname) {
    ret.data = { status: "fail", detail: "Missing field(s):" }
    if (!account) ret.data.detail += " account,";
    if (!password) ret.data.detail += " password,";
    if (!nickname) ret.data.detail += " nickname,";
    ret.data.detail = ret.data.detail.substring(0, ret.data.detail.length-1) + ".";
    return ret;
  }

  const existingUser = await db.UserModel.findOne({ account: account })

  if (existingUser) {
    ret.data = {
      status: "fail",
      detail: "The account already exists."
    }
  } else {
    const newUser = await new db.UserModel({account, password, nickname});
    await newUser.save();
    ret.data = {
      status: "success",
      detail: ""
    }
  }

  return ret;
}

export default signUp;