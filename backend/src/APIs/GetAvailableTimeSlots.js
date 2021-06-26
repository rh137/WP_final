const getAvailableTimeSlots = async (args) => {
  console.log('GetAvailableTimeSlots called.');

  return {
    type: "GetAvailableTimeSlots",
    result: {},
    data: {}
  }
}

export default getAvailableTimeSlots;