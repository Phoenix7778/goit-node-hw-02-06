const express = require("express");
const { schemas } = require("../../models/contacts");
const ctrl = require("../../controllers/contacts");
const { isValidId, validateBody } = require("../../utils/validator");

const router = express.Router();

router
  .route("/")
  .get(ctrl.listContacts)
  .post(validateBody(schemas.addSchema), ctrl.addContact);

router
  .route("/:id")
  .get(isValidId, ctrl.getContactById)
  .delete(isValidId, ctrl.removeContact)
  .put(isValidId, validateBody(schemas.addSchema), ctrl.updateContact);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
