const missingFieldsResponse = (type) => {
  return {
    type: type,
    result: {
      success: false,
      errorType: "MISSING_FIELDS"
    }
  };
}

export { missingFieldsResponse };