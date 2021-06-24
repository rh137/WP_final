const server = new WebSocket('ws://localhost:5000');
server.onopen = () => console.log('Server connected.');

server.sendEvent = (e) => server.send(JSON.stringify(e));

server.onmessage = (m) => onEvent(JSON.parse(m.data));
const onEvent = (e) => { alert(e.type) };

const SignIn = () => {
  server.sendEvent({
    type: "SignIn",
    data: {}
  });
}
const SignUp = () => {
  server.sendEvent({
    type: "SignUp",
    data: {}
  })
}
const NewEvent = () => {
  server.sendEvent({
    type: "NewEvent",
    data: {}
  })
}
const AddFriend = () => {
  server.sendEvent({
    type: "AddFriend",
    data: {}
  })
}
const Invite = () => {
  server.sendEvent({
    type: "Invite",
    data: {}
  })
}
const GetAvailableTimeSlots = () => {
  server.sendEvent({
    type: "GetAvailableTimeSlots",
    data: {}
  })
}
const UpdateAvailableTimeSlots = () => {
  server.sendEvent({
    type: "UpdateAvailableTimeSlots",
    data: {}
  })
}
const RequestWithUnexpectedType = () => {
  server.sendEvent({
    type: "UnexpectedType",
    data: {}
  })
}
const RequestWithoutTypes = () => {
  server.sendEvent({})
}