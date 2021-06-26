const eventNotExistResponse = (type) => {
  return {
    type: type,
    data: {
      success: false,
      errorType: "EVENT_NOT_EXIST"
    }
  };
}

export { eventNotExistResponse };