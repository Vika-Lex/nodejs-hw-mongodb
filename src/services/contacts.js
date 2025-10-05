import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts =async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (contact) => {
  const newContact = await ContactsCollection.create(contact);
  return newContact;
};

export const updateContact = async (studentId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {_id:studentId},
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options
    }
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted)
  };
};

export const deleteById = async (id) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: id
  });
  return contact;
};
