const accountNotExistResponse = (type) => {
  return {
    type: type,
    data: {
      success: false,
      errorType: "ACCOUNT_NOT_EXIST"
    }
  };
}

export { accountNotExistResponse };