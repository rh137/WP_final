import db from "../../db";

const clearUser = async () => {
  await db.UserModel.deleteMany({});
  return {
    type: "ClearUser",
    data: {
      success: true
    }
  }
}

export default clearUser;