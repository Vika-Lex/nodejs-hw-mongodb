import {
  createContact, deleteById,
  getAllContacts,
  getContactById, updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { createContactSchema } from '../validation/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const {page,perPage} = parsePaginationParams(req.query);
  const {sortBy, sortOrder} = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    filter,
    sortBy,
    sortOrder
  });
  res.status(200)
     .json({
       status: 200,
       message: 'Successfully found contacts!',
       data: contacts,
     });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200)
     .json({
       status: 200,
       message: `Successfully found contact with id ${contactId}!`,
       data: contact,
     });
};

export const createContactController = async (req, res,next) => {
  try {
    const validated = await createContactSchema.validateAsync(req.body, { abortEarly: false });
    const contact = await createContact(validated);
    res.status(201)
       .json({
         status: 201,
         message: 'Successfully created contact!',
         data: contact,
       });
  } catch (validationError) {
    next(validationError);
  }
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, { upsert: true });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew
                 ? 201
                 : 200;

  res.status(status)
     .json({
       status,
       message: 'Successfully upserted contact!',
       data: result.contact,
     });

};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully pathed a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204)
     .send();
};
