import { body } from "express-validator";
import messages from "./messages.js";

export const passwordValidateRule = [
  body("new_password")
    .not()
    .isEmpty()
    .withMessage(messages.Validation_Error.PASSWORD)
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LENGTH)
    .matches(/.*[0-9].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_NUMBER)
    .matches(/.*[A-Z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_UPPERCASE)
    .matches(/.*[a-z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LOWERCASE)
    .matches(/.*[@#$%^&*].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_SYMBOLS),
  body("confirm_password")
    .not()
    .isEmpty()
    .withMessage(messages.Validation_Error.PASSWORD)
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LENGTH)
    .matches(/.*[0-9].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_NUMBER)
    .matches(/.*[A-Z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_UPPERCASE)
    .matches(/.*[a-z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LOWERCASE)
    .matches(/.*[@#$%^&*].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_SYMBOLS),
];

export const singlePasswordRule = [
  body("password")
    .not()
    .isEmpty()
    .withMessage(messages.Validation_Error.PASSWORD)
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
    })
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LENGTH)
    .matches(/.*[0-9].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_NUMBER)
    .matches(/.*[A-Z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_UPPERCASE)
    .matches(/.*[a-z].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_LOWERCASE)
    .matches(/.*[@#$%^&*].*/)
    .withMessage(messages.Validation_Error.Strong_Password.MIN_SYMBOLS),
];
