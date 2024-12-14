const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userImage: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const listModel = mongoose.model("List", listSchema);

module.exports = listModel;
