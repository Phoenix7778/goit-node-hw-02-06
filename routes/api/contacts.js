const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const { contactValidator } = require("../../utils/validator");

const router = express.Router();

const handleErrors = (res, status, message) =>
  res.status(status).json({ message });

router.get("/", async (req, res) => {
  try {
    res.json(await listContacts());
  } catch (error) {
    handleErrors(res, 500, "Internal server error");
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    contact ? res.json(contact) : handleErrors(res, 404, "Not found");
  } catch (error) {
    handleErrors(res, 500, "Internal server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = contactValidator(req.body);
    if (error) return handleErrors(res, 400, error.details[0].message);
    res.json(await addContact(req.body));
  } catch (error) {
    handleErrors(res, 500, "Internal server error");
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    contact
      ? res.json({ message: "Contact deleted" })
      : handleErrors(res, 404, "Not found");
  } catch (error) {
    handleErrors(res, 500, "Internal server error");
  }
});

router.put("/:contactId", async (req, res) => {
  try {
    const { error } = contactValidator(req.body);
    if (error) return handleErrors(res, 400, error.details[0].message);
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone)
      return handleErrors(res, 400, "Missing fields");
    res.json(await updateContact(contactId, req.body));
  } catch (error) {
    handleErrors(res, 500, "Internal server error");
  }
});

module.exports = router;
