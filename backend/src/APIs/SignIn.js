import db from "../db";

const signIn = async (args) => {
  console.log('SignIn called.');

  const { account, password } = args;
  const existingUser = await db.UserModel.findOne({account: account})
  if (!existingUser) return accountNotExistResponse();
  else if (existingUser.password !== password) return wrongPasswordResponse();

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

// responses
const accountNotExistResponse = () => {
  return {
    type: "SignIn",
    data: {
      success: false,
      errorType: "ACCOUNT_NOT_EXIST"
    }
  }
}
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