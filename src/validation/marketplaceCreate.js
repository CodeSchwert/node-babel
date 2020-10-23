import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .error(new Error('Invalid Marketplace Name - Name must be between 3 and 50 characters.')),

  description: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .error(new Error('Invalid Marketplace Description - Description must be between 3 and 255 characters.'))
});

export default schema;