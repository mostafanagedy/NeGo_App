const joi = require("joi")

const updateProfileSchema = joi.object({
  firstName: joi.string().trim().min(2),
  lastName: joi.string().trim().min(2),
  bio: joi.string().trim().max(500).allow(""),
  location: joi.string().trim().max(100).allow(""),
  website: joi.string().trim().max(200).allow(""),
  work: joi.string().trim().max(100).allow(""),
  education: joi.string().trim().max(100).allow(""),
})

module.exports = { updateProfileSchema }
