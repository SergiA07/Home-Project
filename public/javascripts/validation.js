const Joi = require('joi')

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.min': 'Username length must be at least 3 characters long'
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'Password length must be at least 6 characters long'
            })
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation



