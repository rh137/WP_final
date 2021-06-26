const eventNotExistResponse = (type) => {
  return {
    type: type,
    result: {
      success: false,
      errorType: "EVENT_NOT_EXIST"
    }
  };
}

export { eventNotExistResponse };