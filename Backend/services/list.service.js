const listModel = require("../models/list.model");

module.exports.createListUser = async ({
  firstname,
  lastname,
  email,
  phone,
  userImage,
  address,
  isDeleted,
}) => {
  try {
    if (!firstname || !lastname || !email || !phone || !userImage || !address) {
      throw new Error("Please fill in all fields");
    }

    const existingListUser = await listModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingListUser) {
      if (existingListUser.isDeleted) {
        throw new Error(
          "This user is marked as deleted and cannot be added again"
        );
      }
      throw new Error("Email or phone number already exists");
    }

    const newUser = new listModel({
      firstname,
      lastname,
      email,
      phone,
      userImage,
      address,
      isDeleted: false,
    });

    await newUser.save();

    return {
      status: true,
      message: "User created successfully",
      data: newUser,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
