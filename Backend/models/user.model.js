const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true,
  }
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {expiresIn: "2d"});
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  console.log(password, "first", this.password)
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
