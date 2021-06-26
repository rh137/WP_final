import db from "../db";
import responses from './commonFailedResponses';
const {
  missingFieldsResponse,
  accountNotExistResponse,
  eventNotExistResponse
} = responses;

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
  const event = await db.EventModel.findById(eventId);
  if (!event) {
    return eventNotExistResponse("Invite");
  }

  if (!inviter._id.equals(event.launcher)) {
    return notLauncherResponse();
  }

  if (event.participants.includes(invitedUser._id)){
    return alreadyInvitedResponse();
  }

  event.participants.push(invitedUser._id);
  await event.save();

  invitedUser.events.push(event._id);
  await invitedUser.save();

  return inviteSuccessResponse();
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
    data: {
      success: false,
      errorType: "NOT_LAUNCHER"
    }
  };
}
const alreadyInvitedResponse = () => {
  return {
    type: "Invite",
    data: {
      success: false,
      errorType: "ALREADY_INVITED"
    }
  };
}
const inviteSuccessResponse = () => {
  return {
    type: "Invite",
    data: {
      success: true
    }
  }
}

export default invite;