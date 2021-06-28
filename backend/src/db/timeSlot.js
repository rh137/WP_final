import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Types.ObjectId, ref: 'Event'},
  date: String,
  startTime: Number,
  endTime: Number
});

const timeSlotModel = mongoose.model('TimeSlot', timeSlotSchema);

export default timeSlotModel;