import db from "../db";

const signUp = async (args) => {
  console.log('SignUp called.');

  const { account, password, nickname } = args;
  let ret = { type: "SignUp" }

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