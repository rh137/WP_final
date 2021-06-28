import db from "../../db";

const clearTimeSlot = async () => {
  await db.TimeSlotModel.deleteMany({});
  return {
    type: "ClearTimeSlot",
    result: {
      success: true
    }
  }
}

export default clearTimeSlot;