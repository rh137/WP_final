const accountExistsResponse = (type) => {
  return {
    type: type,
    result: {
      success: false,
      errorType: "ACCOUNT_EXISTS"
    }
  };
}

export { accountExistsResponse };