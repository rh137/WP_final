const accountNotExistResponse = (type) => {
  return {
    type: type,
    result: {
      success: false,
      errorType: "ACCOUNT_NOT_EXIST"
    }
  };
}

export { accountNotExistResponse };