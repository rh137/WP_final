import db from "../../db";

const clearUser = async () => {
  await db.UserModel.deleteMany({});
  return {
    type: "ClearUser",
    result: {
      success: true
    }
  }
}

export default clearUser;