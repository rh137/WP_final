import db from "../db";
import responses from "./commonFailedResponses";
const { missingFieldsResponse, accountNotExistResponse } = responses

import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const addFriend = async (args) => {
  console.log('AddFriend called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("AddFriend");
  }

  const { adderAccount, addedAccount } = args
  let ret;
  await lock.acquire('AddFriendLock', async () => {
    const adder = await db.UserModel.findOne({account: adderAccount});
    const addedUser = await db.UserModel.findOne({account: addedAccount});
    if (!adder || !addedUser) {
      ret = accountNotExistResponse("AddFriend");
    } else if (adder.friends.includes(addedUser._id)) {
      // TODO: check bi-directional relationship ?
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
const alreadyFriendsResponse = () => {
  return {
    type: "AddFriend",
    result: {
      success: false,
      errorType: "ALREADY_FRIENDS"
    }
  }
}
const addFriendSuccessResponse = () => {
  return {
    type: "AddFriend",
    result: {
      success: true
    }
  }
}

export default addFriend;