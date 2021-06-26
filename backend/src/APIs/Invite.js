import db from "../db";
import responses from './commonFailedResponses';
const {
  missingFieldsResponse,
  accountNotExistResponse,
  eventNotExistResponse
} = responses;
import AsyncLock from 'async-lock';
const lock = new AsyncLock();

const invite = async (args) => {
  console.log('Invite called.');

  if (hasMissingFields(args)) {
    return missingFieldsResponse("Invite");
  }

  const { inviterAccount, invitedAccount } = args;
  const inviter = await db.UserModel.findOne({account: inviterAccount});
  const invitedUser = await db.UserModel.findOne({account: invitedAccount});
  if (!inviter || !invitedUser) {
    return accountNotExistResponse("Invite");
  }

  const { eventId } = args;
  let event = await db.EventModel.findById(eventId);
  if (!event) {
    return eventNotExistResponse("Invite");
  }

  if (!inviter._id.equals(event.launcher)) {
    return notLauncherResponse();
  }

  let ret;
  await lock.acquire('InviteLock', async () => {
    event = await db.EventModel.findById(eventId);
    if (event.participants.includes(invitedUser._id)) {
      ret = alreadyInvitedResponse();
    } else {
      event.participants.push(invitedUser._id);
      await event.save();
      invitedUser.events.push(event._id);
      await invitedUser.save();
      ret = inviteSuccessResponse(invitedUser);
    }
  });

  return ret;
}

// implementation details
const hasMissingFields = (args) => {
  const { inviterAccount, invitedAccount, eventId } = args;
  return (!inviterAccount || !invitedAccount || !eventId);
}

// responses
const notLauncherResponse = () => {
  return {
    type: "Invite",
    result: {
      success: false,
      errorType: "NOT_LAUNCHER"
    }
  };
}
const alreadyInvitedResponse = () => {
  return {
    type: "Invite",
    result: {
      success: false,
      errorType: "ALREADY_INVITED"
    }
  };
}
const inviteSuccessResponse = (invitedUser) => {
  const { account, nickname } = invitedUser
  return {
    type: "Invite",
    result: {
      success: true
    },
    data: {
      newParticipant: {
        account: account,
        nickname: nickname
      }
    }
  }
}

export default invite;