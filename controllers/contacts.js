const {
  ContactModel: { Contact },
} = require("../models/contacts");

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

const listContacts = ctrlWrapper(async (req, res) => {
  const result = await Contact.find();
  res.status(200).json(result);
});

const handleContactById = (action) =>
  ctrlWrapper(async (req, res) => {
    await handleContact(req, res, action);
  });

const addContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { body } = req;
  const result = await Contact.create({ ...body, owner });
  res.status(201).json(result);
});

const removeContact = handleContactById(Contact.findByIdAndDelete);

const updateContact = handleContactById((id, body) =>
  Contact.findByIdAndUpdate(id, body, { new: true })
);

const updateStatusContact = handleContactById((id, body) =>
  Contact.findByIdAndUpdate(id, body, { new: true })
);

module.exports = {
  listContacts,
  getContactById: handleContactById(Contact.findById),
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
