const signIn = async (args) => {
  console.log('SignIn called.');

  return {
    type: "SignIn",
    data: {}
  }
}

export default signIn;