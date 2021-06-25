const accountNotExistResponse = (type) => {
  return {
    type: type,
    data: {
      success: false,
      errorType: "ACCOUNT_NOT_EXISTS"
    }
  };
}

export { accountNotExistResponse };