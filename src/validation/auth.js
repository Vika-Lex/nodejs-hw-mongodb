import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 30 characters long',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().messages({
    'string.email': 'Email must be a valid email address',
    'string.pattern.base': 'Email must have valid format (user@domain.com)',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
});


export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
