import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer() {

  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200)
       .json({
         status: 200,
         message: 'Successfully found contacts!',
         data: contacts,
       });
  });

  app.get('/contacts/:contactId',async (req, res) => {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });

  });

  app.use((req, res) => {
    res.status(404)
       .json({
         message: 'Not Found'
       });
  });

  app.use((err, req, res, _next) => {
    res.status(500)
       .json({
         message: 'Something went wrong',
         error: err.message,
       });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}
