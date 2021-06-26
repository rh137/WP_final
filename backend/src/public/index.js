const server = new WebSocket('ws://localhost:5000');
server.onopen = () => console.log('Server connected.');

server.sendEvent = (e) => server.send(JSON.stringify(e));

server.onmessage = (m) => onEvent(JSON.parse(m.data));
const onEvent = (e) => {
  let alertMsg = e.type;
  if (e.data.success !== undefined) alertMsg += "\n" + (e.data.success ? "success" : "fail");
  if (e.data.errorType) alertMsg += "\n" + e.data.errorType;
  if (e.data.nickname) alertMsg += "\n" + e.data.nickname;
  if (e.data.friends) alertMsg += "\n" + e.data.friends;
  if (e.type === "SignIn" && e.data) {
    if (e.data.success) {
      console.log(`[SignIn success]\n  account: ${arg1.value}\n  nickname: ${e.data.nickname}`)
      console.log("friends:");
      console.log(e.data.friends);
      console.log("events: ");
      console.log(e.data.events);
    } else {
      console.log(`[SignIn failed]`)
    }
  }
  alert(alertMsg);
};

// args
let arg1 = document.getElementById('field1');
let arg2 = document.getElementById('field2');
let arg3 = document.getElementById('field3');
const clearArgs = () => {
  arg1.value = ""
  arg2.value = ""
  arg3.value = ""
}

// requests
const signIn = () => {
  server.sendEvent({
    type: "SignIn",
    args: {
      account: arg1.value,
      password: arg2.value,
    }
  });
}
const signUp = () => {
  server.sendEvent({
    type: "SignUp",
    args: {
      account: arg1.value,
      password: arg2.value,
      nickname: arg3.value
    }
  })
}
const newEvent = () => {
  server.sendEvent({
    type: "NewEvent",
    args: {
      title: "test title",
      description: "test description",
      startDate: new Date(),
      endDate: new Date(),
      startTime: 7.5,
      endTime: 21,
      participants: [
        { account: arg1.value },
        { account: arg2.value },
        { account: arg3.value },
      ],
      launcher: {
        account: arg1.value
      }
    }
  })
}
const addFriend = () => {
  server.sendEvent({
    type: "AddFriend",
    args: {
      adderAccount: arg1.value,
      addedAccount: arg2.value
    }
  })
}
const invite = () => {
  server.sendEvent({
    type: "Invite",
    args: {
      inviterAccount: arg1.value,
      invitedAccount: arg2.value,
      eventId: arg3.value
    }
  })
}
const getAvailableTimeSlots = () => {
  server.sendEvent({
    type: "GetAvailableTimeSlots",
    args: {}
  })
}
const updateAvailableTimeSlots = () => {
  server.sendEvent({
    type: "UpdateAvailableTimeSlots",
    args: {}
  })
}
const requestWithUnexpectedType = () => {
  server.sendEvent({
    type: "UnexpectedType",
    args: {}
  })
}
const requestWithoutTypes = () => {
  server.sendEvent({})
}

// for async test
const signUpTwice = () => {
  // for async test
  signUp();
  signUp();
}
const addFriendTwice = () => {
  addFriend();
  addFriend();
}
const inviteTwice = () => {
  invite();
  invite();
}

// clear DB
const clearUser = () => {
  server.sendEvent({
    type: "ClearUser"
  })
}
const clearEvent = () => {
  server.sendEvent({
    type: "ClearEvent"
  })
}
const clearAll = () => {
  clearUser();
  clearEvent();
}