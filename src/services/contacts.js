import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
                                       page = 1,
                                       perPage = 10,
                                       filter = {},
                                       sortOrder = SORT_ORDER.ASC,
                                       sortBy = '_id',
                                       userId,
                                     }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });
  
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactCount = await ContactsCollection.find({ userId }).merge(contactsQuery).countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({[sortBy]: sortOrder})
    .exec();
  const paginationData = calculatePaginationData(contactCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await ContactsCollection.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async (contact, userId) => {
  const newContact = await ContactsCollection.create({ ...contact, userId });
  return newContact;
};

export const updateContact = async (contactId, payload, options = {}, userId) => {
  const updateData = options.upsert ? { ...payload, userId } : payload;
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteById = async (id, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return contact;
};
