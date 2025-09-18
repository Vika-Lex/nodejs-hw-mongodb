import {Schema, model} from 'mongoose';

const contactSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  phoneNumber:{
    type: String,
    required: true,
  },
  email:{
    type: String,
  },
  isFavourite:{
    type: Boolean,
    default: false,
  },
  contactType:{
    type: String,
    required: true,
    enum: ['personal','home','work'],
    default: 'personal'
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const ContactsCollection = model('contacts', contactSchema);
