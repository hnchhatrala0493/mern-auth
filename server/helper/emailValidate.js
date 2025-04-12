import { body } from "express-validator";
import messages from "./messages.js";

export const emailValidateRule = [
  body("email")
    .not()
    .isEmpty()
    .withMessage(messages.Validation_Error.EMAIL)
    .isEmail()
    .withMessage(messages.Validation_Error.INVALID_EMAIL),
];
