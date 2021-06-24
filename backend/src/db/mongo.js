import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';

function connectToMongoDB() {
  dotenv.config()

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', (err) => console.log(err));
  db.once('open', () => console.log('Mongo DB connected.'));
}

export { connectToMongoDB };