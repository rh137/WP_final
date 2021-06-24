import express from 'express';
import { connectToMongoDB } from "./db/mongo";
import db from "./db";

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send("Hello, World!");
});

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});
