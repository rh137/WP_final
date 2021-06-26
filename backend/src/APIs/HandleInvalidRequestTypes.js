const handleInvalidRequestTypes = (type) => {
  let ret;
  if (type) {
    console.log(`Invalid request type: "${type}"`)
    ret = {
      type: `Invalid request type: "${type}"`,
    }
  }
  else {
    console.log("Request type undefined.")
    ret = {
      type: "Request type undefined.",
    }
  }
  return ret;
}

export default handleInvalidRequestTypes;