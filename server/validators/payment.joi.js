const Joi = require('joi');

module.exports.paymentValidate = (paymentBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      const schema = Joi.object({
        CardNumber: Joi.string().length(16).required(),
        ExpDate: Joi.string().required(),
        Cvv: Joi.string().length(3).required(),
        Amount: Joi.number().required()
      })

      const value = await schema.validateAsync(paymentBody, {
        abortEarly: false
      });

      resolve(value)
    } catch (err) {
      reject(err)
    }
  })
}