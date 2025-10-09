import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 30 characters long',
    'any.required': 'Name is required'
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must be at most 30 characters long',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required().messages({
    'string.email': 'Email must be a valid email address',
    'string.pattern.base': 'Email must have valid format (user@domain.com)',
    'any.required': 'Email is required'
  }),
  isFavourite: Joi.boolean().required().messages({
    'boolean.base': 'Is favourite must be a boolean value',
    'any.required': 'Is favourite is required'
  }),
  contactType: Joi.string().valid('personal','home','work').required().messages({
    'any.only': 'Contact type must be one of: personal, home, work',
    'any.required': 'Contact type is required'
  }),
  userId: Joi.string().custom((value,helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  })
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 30 characters long'
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max': 'Phone number must be at most 30 characters long'
  }),
  email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).messages({
    'string.email': 'Email must be a valid email address',
    'string.pattern.base': 'Email must have valid format (user@domain.com)'
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is favourite must be a boolean value'
  }),
  contactType: Joi.string().valid('personal','home','work').messages({
    'any.only': 'Contact type must be one of: personal, home, work'
  }),
  userId: Joi.string().custom((value,helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  })
});
