export const validateLogin = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password Required";
  }

  return errors;
};

export const validateAuth = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password Required";
  }

  if (!values.lname) {
    errors.lname = "Lastname Required";
  }
  if (!values.phone) {
    errors.phone = "Phone Required";
  }
  if (!values.fname) {
    errors.fname = "Firstname Required";
  }
  if (!values.type || !values.type === "Select User Type") {
    errors.type = "Role Required";
  }

  return errors;
};

