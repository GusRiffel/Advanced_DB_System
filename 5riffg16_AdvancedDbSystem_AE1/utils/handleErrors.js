const handleErrors = (err) => {
  let errors = {
    name: "",
    postcode: "",
    date: "",
    time: "",
    username: "",
    email: "",
    password: "",
  };

  if (err.code === 11000) {
    errors.email = "Username or Email already exists.";
    return errors;
  }

  if (
    err.message.includes("Park validation failed") ||
    err.message.includes("User validation failed")
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = handleErrors;
