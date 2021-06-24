const HandleInvalidRequestTypes = (type) => {
  let ret;
  if (type) {
    console.log(`Invalid request type: "${type}"`)
    ret = {
      type: `Invalid request type: "${type}"`,
      data: {}
    }
  }
  else {
    console.log("Request type undefined.")
    ret = {
      type: "Request type undefined.",
      data: {}
    }
  }
  return ret;
}

export default HandleInvalidRequestTypes;