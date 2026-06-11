const joi =require("joi")


const registerSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  username: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});


const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
module.exports = {
  registerSchema,
  loginSchema,
};
