import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  account: String,
  password: String,
  nickname: String,
  friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  events: [{ type: mongoose.Types.ObjectId, ref: "Event" }]
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;