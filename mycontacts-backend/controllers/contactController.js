const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc Create new contact
// @route POST /api/contacts
// @access Private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const contact = await Contact.create({ 
    name, 
    email, 
    phone, 
    user_id: req.user.id 
  });
  res.status(201).json(contact);
});

// @desc Get single contact
// @route GET /api/contacts/:id
// @access Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, user_id: req.user.id });
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json(contact);
});

// @desc Update contact
// @route PUT /api/contacts/:id
// @access Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, user_id: req.user.id });
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  if (contact.user_id.toString() !== req.user.id) {
    return res.status(403).json({ message: "User don't have permission to update other user contacts" });
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedContact);
});

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, user_id: req.user.id });
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });

  }
  if (contact.user_id.toString() !== req.user.id) {
    return res.status(403).json({ message: "User don't have permission to delete other user contacts" });
  }


  await Contact.deleteOne({ _id: req.params.id, user_id: req.user.id });
  res.status(200).json({ message: "Contact deleted", contact });
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
