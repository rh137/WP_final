import db from "../../db";

const clearEvent = async () => {
  await db.EventModel.deleteMany({});
  return {
    type: "ClearEvent",
    data: {
      success: true
    }
  }
}

export default clearEvent;