import { Router } from 'express';
import {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
} from './gallery.controller.js';
import { createGalleryItemSchema, updateGalleryItemSchema } from './gallery.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';


const router = Router();



router
  .route('/')
  .get(getGalleryItems)
  .post(
    verifyJWT,
    authorizeRoles('super_admin', 'ops_manager'),
    validate(createGalleryItemSchema),
    createGalleryItem
  );

router
  .route('/:id')
  .get(getGalleryItemById)
  .put(
    verifyJWT,
    authorizeRoles('super_admin', 'ops_manager'),
    validate(updateGalleryItemSchema),
    updateGalleryItem
  )
  .delete(verifyJWT, authorizeRoles('super_admin'), deleteGalleryItem);

export default router;
