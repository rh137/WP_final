const newEvent = async (args) => {
  console.log('NewEvent called.');

  return {
    type: "NewEvent",
    data: {}
  }
}

export default newEvent;