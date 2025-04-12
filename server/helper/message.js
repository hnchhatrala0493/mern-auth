const message = {
  User: {
    NAME: "Name is required.",
    EMAIL: "Email is required.",
    INVALID_EMAIL: "Invalid Email",
    EXISTING_EMAIL: "Email Already Taken.",
  },
  OTP: {
    OTP: "OTP is required.",
    INVALID_OTP: "Invalid OTP.",
    NUMBER_OTP: "OTP should be digits.",
  },
  PASSWORD: {
    PASSWORD: "Password is required",
    NEW_PASSWORD: "New Password is required.",
    CONFIRM_PASSWORD: "Confirm Password is required.",
  },
  Validation_Error: {
    NAME: "Name is required.",
    USERID: "User is required.",
    MSGID: "MSG ID is required.",
    NAME_ALPHA: "Name must be alphabetic.",
    EMAIL: "Email is required",
    EMAIL_ID_EXISTS: "Email address or Phone has already been taken or used",
    INVALID_EMAIL: "Invalid Email Address",
    PASSWORD: "Password is required",
    MATCH_PASSWORD: "Password confirmation does not match the new password",
    Strong_Password: {
      MIN_LENGTH: "Password length should be 8 character.",
      MIN_NUMBER: "Password at least 1 Number.",
      MIN_UPPERCASE: "Password at least 1 Uppercase.",
      MIN_LOWERCASE: "Password at least 1 lowercase.",
      MIN_SYMBOLS: "Password at least 1 Symbols.",
    },
  },
};

export default message;
