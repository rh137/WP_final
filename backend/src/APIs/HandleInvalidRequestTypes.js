const handleInvalidRequestTypes = (type) => {
  let ret;
  if (type) {
    console.log(`Invalid request type: "${type}"`)
    ret = {
      type: `Invalid request type: "${type}"`,
      result: {
        success: false
      }
    }
  }
  else {
    console.log("Request type undefined.")
    ret = {
      type: "Request type undefined.",
      result: {
        success: false
      }
    }
  }
  return ret;
}

export default handleInvalidRequestTypes;