import express from 'express';
import http from 'http';
import WebSocket from 'ws';

import { connectToMongoDB } from "./db/mongo";
import db from "./db";
import apis from './APIs'

const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer })
const PORT = 5000;

app.use(express.static("./src/public/"));

const { SignUp, SignIn, NewEvent, AddFriend, Invite,
  GetAvailableTimeSlots, UpdateAvailableTimeSlots,
  HandleInvalidRequestTypes } = apis;

connectToMongoDB();

wsServer.on("connection", (client) => {
  client.sendData = (data) => client.send(JSON.stringify(data));

  client.on("message", async (message) => {
    const request = JSON.parse(message);
    const { type, args } = request;
    let ret;
    switch (type) {
      case "SignIn": ret = await SignIn(args); break;
      case "SignUp": ret = await SignUp(args); break;
      case "NewEvent": ret = await NewEvent(args); break;
      case "AddFriend": ret = await AddFriend(args); break;
      case "Invite": ret = await Invite(args); break;
      case "GetAvailableTimeSlots": ret = await GetAvailableTimeSlots(args); break;
      case "UpdateAvailableTimeSlots": ret = await UpdateAvailableTimeSlots(args); break;
      default: ret = HandleInvalidRequestTypes(type);
    }
    client.sendData(ret);
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
