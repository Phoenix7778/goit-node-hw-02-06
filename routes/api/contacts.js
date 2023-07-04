const express = require("express");
const {
  isValidId,
  validateBody,
  authenticate,
} = require("../../utils/validator");
const { schemas } = require("../../models/contacts");
const { ctrlContacts } = require("../../controllers/contacts");

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlContacts.listContacts);

router.get("/:id", isValidId, ctrlContacts.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrlContacts.addContact);

router.delete("/:id", isValidId, ctrlContacts.removeContact);

router.put(
  "/:id",
  isValidId,
  validateBody(schemas.addSchema),
  ctrlContacts.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrlContacts.updateStatusContact
);

module.exports = router;
