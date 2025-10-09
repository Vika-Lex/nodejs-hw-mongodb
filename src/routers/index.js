import ContactsRouter from './contacts.js';
import AuthRouter from './auth.js';
import { Router } from 'express';

const router = Router();

router.use('/contacts', ContactsRouter);
router.use('/auth', AuthRouter);

export default router;
