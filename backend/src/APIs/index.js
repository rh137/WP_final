import signIn from './SignIn';
import signUp from "./SignUp";
import newEvent from "./NewEvent";
import addFriend from "./AddFriend";
import invite from "./Invite";
import getAvailableTimeSlots from "./GetAvailableTimeSlots";
import updateAvailableTimeSlots from "./UpdateAvailableTimeSlots";
import handleInvalidRequestTypes from "./HandleInvalidRequestTypes";

const apis = {
  signIn, signUp, newEvent, addFriend, invite,
  updateAvailableTimeSlots, getAvailableTimeSlots, handleInvalidRequestTypes,
};

export default apis;