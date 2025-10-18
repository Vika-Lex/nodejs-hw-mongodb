import { Router } from 'express';
import {
  createContactController, deleteContactController,
  getAllContactsController,
  getContactByIdController, patchContactController, upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactSchema),upload.single('photo') ,ctrlWrapper(createContactController));
router.put('/:contactId', isValidId, validateBody(createContactSchema), ctrlWrapper(upsertContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), upload.single('photo'),ctrlWrapper(patchContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
