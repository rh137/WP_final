import db from "../db";

const addFriend = async (args) => {
  console.log('AddFriend called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse();
  }

  const { adderAccount, addedAccount } = args
  const adder = await db.UserModel.findOne({account: adderAccount});
  const addedUser = await db.UserModel.findOne({account: addedAccount});
  if (!adder || !addedUser) {
    return accountNotExistResponse();
  } else if (adder.friends.includes(addedUser._id)) {
    return alreadyFriendsResponse();
  }

  // TODO: async-lock
  adder.friends.push(addedUser);
  addedUser.friends.push(adder);
  await adder.save();
  await addedUser.save();

  return {
    type: "AddFriend",
    data: {
      success: true
    }
  }
}

// implementation details
const hasMissingFields = (args) => {
  const { adderAccount, addedAccount } = args;
  return !adderAccount || !addedAccount;
}

// responses
const missingFieldsResponse = () => {
  return {
    type: "AddFriend",
    data: {
      success: false,
      errorType: "MISSING_FIELDS"
    }
  };
}
const accountNotExistResponse = () => {
  return {
    type: "AddFriend",
    data: {
      success: false,
      errorType: "ACCOUNT_NOT_EXIST"
    }
  }
}
const alreadyFriendsResponse = () => {
  return {
    type: "AddFriend",
    data: {
      success: false,
      errorType: "ALREADY_FRIENDS"
    }
  }
}

export default addFriend;