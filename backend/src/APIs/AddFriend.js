import db from "../db";
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const addFriend = async (args) => {
  console.log('AddFriend called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse();
  }

  const { adderAccount, addedAccount } = args
  let ret;
  await lock.acquire('AddFriendLock', async () => {
    const adder = await db.UserModel.findOne({account: adderAccount});
    const addedUser = await db.UserModel.findOne({account: addedAccount});
    if (!adder || !addedUser) {
      ret = accountNotExistResponse();
    } else if (adder.friends.includes(addedUser._id)) {
      ret = alreadyFriendsResponse();
    } else {
      adder.friends.push(addedUser);
      addedUser.friends.push(adder);
      await adder.save();
      await addedUser.save();
      ret = addFriendSuccessResponse();
    }
  });
  return ret;
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
const addFriendSuccessResponse = () => {
  return {
    type: "AddFriend",
    data: {
      success: true
    }
  }
}

export default addFriend;