const server = new WebSocket('ws://localhost:5000');
server.onopen = () => console.log('Server connected.');

server.sendEvent = (e) => server.send(JSON.stringify(e));

server.onmessage = (m) => onEvent(JSON.parse(m.data));
const onEvent = (e) => {
  let alertMsg = e.type;
  if (e.data.success !== undefined) alertMsg += "\n" + (e.data.success ? "success" : "fail");
  if (e.data.detail) alertMsg += "\n" + e.data.detail;
  alert(alertMsg);
};



const signIn = () => {
  server.sendEvent({
    type: "SignIn",
    args: {}
  });
}
const signUp = () => {
  server.sendEvent({
    type: "SignUp",
    args: {
      account: "Nick",
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
    args: {}
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