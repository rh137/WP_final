const accountExistsResponse = (type) => {
  return {
    type: type,
    data: {
      success: false,
      errorType: "ACCOUNT_EXISTS"
    }
  };
}

export { accountExistsResponse };