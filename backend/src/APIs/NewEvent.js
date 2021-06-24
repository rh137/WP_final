const NewEvent = async (args) => {
  console.log('NewEvent called.');

  return {
    type: "NewEvent",
    data: {}
  }
}

export default NewEvent;