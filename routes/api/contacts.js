const express = require("express");
const {
  validateBody,
  authenticate,
  isValidId,
} = require("../../utils/validator");
const { schemas } = require("../../models/contacts");
const { ctrlContacts } = require("../../controllers/contacts");

const router = express.Router();

const authMiddleware = [authenticate, isValidId];

router.get("/", authMiddleware, ctrlContacts.listContacts);
router.get("/:id", authMiddleware, ctrlContacts.getContactById);
router.post(
  "/",
  authMiddleware,
  validateBody(schemas.addSchema),
  ctrlContacts.addContact
);
router.delete("/:id", authMiddleware, ctrlContacts.removeContact);
router.put(
  "/:id",
  authMiddleware,
  validateBody(schemas.addSchema),
  ctrlContacts.updateContact
);
router.patch(
  "/:id/favorite",
  authMiddleware,
  validateBody(schemas.updateFavoriteSchema),
  ctrlContacts.updateStatusContact
);

module.exports = router;
