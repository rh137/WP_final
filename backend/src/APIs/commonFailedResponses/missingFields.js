const missingFieldsResponse = (type) => {
  return {
    type: type,
    data: {
      success: false,
      errorType: "MISSING_FIELDS"
    }
  };
}

export { missingFieldsResponse };