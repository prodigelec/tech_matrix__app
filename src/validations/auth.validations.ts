import Joi from 'joi'

// Schema Joi pour la validation du login
const loginSchemaJoi = Joi.object({
  email: Joi
    .string()
    .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'fr'] }
    })
    .required()
    .messages({
    'string.email': 'Email invalide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      'any.required': 'Le mot de passe est requis'
    }),
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
      'string.alphanum': 'Le pseudo ne doit contenir que des caractères alphanumériques',
      'string.min': 'Le pseudo doit contenir au moins 3 caractères',
      'string.max': 'Le pseudo ne doit pas dépasser 30 caractères'
  })
})

export default loginSchemaJoi;

