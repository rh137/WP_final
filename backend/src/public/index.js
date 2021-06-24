const server = new WebSocket('ws://localhost:5000');
server.onopen = () => console.log('Server connected.');

server.sendEvent = (e) => server.send(JSON.stringify(e));

server.onmessage = (m) => onEvent(JSON.parse(m.data));
const onEvent = (e) => { alert(e.type) };

const signIn = () => {
  server.sendEvent({
    type: "SignIn",
    data: {}
  });
}
const signUp = () => {
  server.sendEvent({
    type: "SignUp",
    data: {}
  })
}
const newEvent = () => {
  server.sendEvent({
    type: "NewEvent",
    data: {}
  })
}
const addFriend = () => {
  server.sendEvent({
    type: "AddFriend",
    data: {}
  })
}
const invite = () => {
  server.sendEvent({
    type: "Invite",
    data: {}
  })
}
const getAvailableTimeSlots = () => {
  server.sendEvent({
    type: "GetAvailableTimeSlots",
    data: {}
  })
}
const updateAvailableTimeSlots = () => {
  server.sendEvent({
    type: "UpdateAvailableTimeSlots",
    data: {}
  })
}
const requestWithUnexpectedType = () => {
  server.sendEvent({
    type: "UnexpectedType",
    data: {}
  })
}
const requestWithoutTypes = () => {
  server.sendEvent({})
}