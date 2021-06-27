const notInvitedResponse = (type) => {
  return {
    type: type,
    result: {
      success: false,
      errorType: "NOT_INVITED"
    }
  };
}

export { notInvitedResponse };