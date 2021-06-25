import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { connectToMongoDB } from "./mongo";
import apis from './APIs'
import apis_dev from './APIs/devOnly'

// server setup
const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer })
const PORT = 5000;

// sample frontend
app.use(express.static("./src/public/"));

const { signUp, signIn, newEvent, addFriend, invite,
  getAvailableTimeSlots, updateAvailableTimeSlots,
  handleInvalidRequestTypes } = apis;
const { clearUser, clearEvent } = apis_dev;

connectToMongoDB();

wsServer.on("connection", (client) => {
  client.sendData = (data) => client.send(JSON.stringify(data));

  client.on("message", async (message) => {
    const request = JSON.parse(message);
    const { type, args } = request;
    let ret;
    switch (type) {
      case "SignIn": ret = await signIn(args); break;
      case "SignUp": ret = await signUp(args); break;
      case "NewEvent": ret = await newEvent(args); break;
      case "AddFriend": ret = await addFriend(args); break;
      case "Invite": ret = await invite(args); break;
      case "GetAvailableTimeSlots": ret = await getAvailableTimeSlots(args); break;
      case "UpdateAvailableTimeSlots": ret = await updateAvailableTimeSlots(args); break;
      case "ClearUser": ret = await clearUser(); break;
      case "ClearEvent": ret = await clearEvent(); break;
      default: ret = handleInvalidRequestTypes(type);
    }
    client.sendData(ret);
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
