import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("Admin", "User").required(),
});
