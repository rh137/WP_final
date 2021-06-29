import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  launcher: { type: mongoose.Types.ObjectId, ref: "User" },
  startDate: String,
  endDate: String,
  startTime: Number,
  endTime: Number
});

const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;