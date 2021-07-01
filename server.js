import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';
import url from 'url';

import { connectToMongoDB } from "./backend/src/mongo";
import apis from './backend/src/APIs'
import apis_dev from './backend/src/APIs/devOnly'

// server setup
const app = express();
const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer })
const PORT = process.env.PORT || 5000;

// deploy frontend
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static("./frontend/build"));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
})

const { signUp, signIn, newEvent, addFriend, invite,
  getAvailableTimeSlots, updateAvailableTimeSlots, getMyAvailableTimeSlots,
  handleInvalidRequestTypes } = apis;
const { clearUser, clearEvent, clearTimeSlot } = apis_dev;

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
      case "GetMyAvailableTimeSlots": ret = await getMyAvailableTimeSlots(args); break
      case "GetAvailableTimeSlots": ret = await getAvailableTimeSlots(args); break;
      case "UpdateAvailableTimeSlots": ret = await updateAvailableTimeSlots(args); break;
      case "ClearUser": ret = await clearUser(); break;
      case "ClearEvent": ret = await clearEvent(); break;
      case "ClearTimeSlot": ret = await clearTimeSlot(); break;
      default: ret = handleInvalidRequestTypes(type);
    }
    client.sendData(ret);
  })
})

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}.`);
});
