import { validationResult } from "express-validator";
import messages from "../helper/message.js";

const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = {};
    errors.array().map((err) => ({ errors: errors.array() }));
    return res
      .status(messages.HTTP_Error.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array() });
  }
  next();
};
export default Validate;
