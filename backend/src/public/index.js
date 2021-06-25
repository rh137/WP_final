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
  alert(alertMsg);
};



const signIn = () => {
  server.sendEvent({
    type: "SignIn",
    args: {
      account: "Ryan",
      password: "1234",
    }
  });
}
const signUp = () => {
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "Ryan",
      password: "1234",
      nickname: "NickName"
    }
  })
}
const newEvent = () => {
  server.sendEvent({
    type: "NewEvent",
    args: {}
  })
}
const addFriend = () => {
  server.sendEvent({
    type: "AddFriend",
    args: {
      adderAccount: "Ryan",
      addedAccount: "Tina"
    }
  })
}
const invite = () => {
  server.sendEvent({
    type: "Invite",
    args: {}
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
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "TestUserForSignUpTwice",
      password: "1234",
      nickname: "NickName"
    }
  })
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "TestUserForSignUpTwice",
      password: "1234",
      nickname: "NickName"
    }
  })
}
const addFriendTwice = () => {
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "AddFriendTestAccount1",
      password: "aaaaa",
      nickname: "test1"
    }
  })
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "AddFriendTestAccount2",
      password: "abbb",
      nickname: "test2"
    }
  })
  server.sendEvent({
    type: "AddFriend",
    args: {
      adderAccount: "AddFriendTestAccount1",
      addedAccount: "AddFriendTestAccount2",
    }
  })
  server.sendEvent({
    type: "AddFriend",
    args: {
      adderAccount: "AddFriendTestAccount1",
      addedAccount: "AddFriendTestAccount2",
    }
  })
}
const clearUser = () => {
  server.sendEvent({
    type: "ClearUser"
  })
}