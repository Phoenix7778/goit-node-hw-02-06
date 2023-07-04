const { Contact } = require("../models/contacts");

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res, next);
  } catch (error) {
    next(error);
  }
};

const handleContact = async (req, res, next, action) => {
  try {
    const { id } = req.params;
    const result = await action(id, req.body);
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const listContacts = async (req, res) => {
  const result = await Contact.find();
  res.status(200).json(result);
};

const getContactById = async (req, res) => {
  await handleContact(req, res, Contact.findById);
};

const addContact = async (req, res) => {
  await handleContact(req, res, Contact.create);
};

const removeContact = async (req, res) => {
  await handleContact(req, res, Contact.findByIdAndDelete);
  res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  await handleContact(req, res, (id, body) =>
    Contact.findByIdAndUpdate(id, body, { new: true })
  );
};

const updateStatusContact = async (req, res) => {
  await handleContact(req, res, (id, body) =>
    Contact.findByIdAndUpdate(id, body, { new: true })
  );
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
