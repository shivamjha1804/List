const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
  profileImage,
}) => {
  try {
    if (!firstname || !lastname || !email || !password || !profileImage) {
      throw new Error("Please fill in all fields");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profileImage,
    });

    return user;
  } catch (error) {
    throw error;
  }
};
