const server = new WebSocket('ws://localhost:5000');
server.onopen = () => console.log('Server connected.');

server.sendEvent = (e) => server.send(JSON.stringify(e));

server.onmessage = (m) => onEvent(JSON.parse(m.data));
const onEvent = (e) => {
  let alertMsg = e.type;
  if (e.result.success !== undefined) alertMsg += "\n" + (e.result.success ? "success" : "fail");
  if (e.result.errorType) alertMsg += "\n" + e.result.errorType;
  if (e.data) {
    if (e.data.nickname) alertMsg += "\n" + e.data.nickname;
  }
  if (e.type === "SignIn" && e.result) {
    if (e.result.success) {
      console.log(`[SignIn success]\n  account: ${arg1.value}\n  nickname: ${e.data.nickname}`)
      console.log("friends:");
      console.log(e.data.friends);
      console.log("events: ");
      console.log(e.data.events);
    } else {
      console.log(`[SignIn failed]`)
    }
  } else if (e.type === "Invite" && e.result) {
    if (e.result.success) {
      console.log(e.data.newParticipant);
    }
  } else if (e.type === "AddFriend") {
    console.log(e.data);
  } else if (e.type === "NewEvent") {
    console.log(e.data);
  } else if (e.type === "GetAvailableTimeSlots") {
    console.log(e.data);
  } else if (e.type === "GetMyAvailableTimeSlots") {
    console.log(e.data);
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
      startDate: "2021-07-01",
      endDate: "2021-07-15",
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
    args: {
      requesterAccount: arg1.value,
      eventId: arg2.value,
    }
  })
}
const getMyAvailableTimeSlots = () => {
  server.sendEvent({
    type: "GetMyAvailableTimeSlots",
    args: {
      requesterAccount: arg1.value,
      eventId: arg2.value,
    }
  })
}
const updateAvailableTimeSlots = () => {
  server.sendEvent({
    type: "UpdateAvailableTimeSlots",
    args: {
      requesterAccount: arg1.value,
      eventId: arg2.value,
      availableTimeSlots: [{
        date: "2021-07-07",
        startTime: 16,
        endTime: 18
      }, {
        date: "2021-07-08",
        startTime: 7,
        endTime: 15
      }]
    }
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
const clearTimeSlot = () => {
  server.sendEvent({
    type: "ClearTimeSlot"
  })
}
const clearAll = () => {
  clearUser();
  clearEvent();
  clearTimeSlot();
}