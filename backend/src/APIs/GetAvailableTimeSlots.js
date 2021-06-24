const GetAvailableTimeSlots = async (args) => {
  console.log('GetAvailableTimeSlots called.');

  return {
    type: "GetAvailableTimeSlots",
    data: {}
  }
}

export default GetAvailableTimeSlots;