const addFriend = async (args) => {
  console.log('AddFriend called.');

  return {
    type: "AddFriend",
    data: {}
  }
}

export default addFriend;