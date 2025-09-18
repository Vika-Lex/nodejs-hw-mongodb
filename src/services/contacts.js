import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts =async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const deleteById = async (id) => {
  const contact = await ContactsCollection.deleteOne(id);
  return contact;
};
