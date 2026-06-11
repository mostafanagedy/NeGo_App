const joi = require("joi")

const updateProfileSchema = joi.object({
  firstName: joi.string().trim().min(3),
 lastName:joi.string().trim().min(3),
 bio:joi.string().trim().max(300),

})
module.exports={updateProfileSchema,}
