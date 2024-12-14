const listModel = require("../models/list.model");

(module.exports.addUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, userImage, phone, address } = req.body;
    const newUser = new listModel({
      firstname,
      lastname,
      email,
      userImage,
      phone,
      address,
    });
    await newUser.save();
    res.status(201).json({
      status: true,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}),
  (module.exports.deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await listModel.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }),
  (module.exports.updateUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const user = await listModel.findByIdAndUpdate(userId, updates, {
        new: true,
      });
      if (!user || user.isDeleted) {
        return res
          .status(404)
          .json({ status: false, message: "User not found or deleted" });
      }
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }),
  (module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await listModel.find({ isDeleted: false });
      res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }),
  (module.exports.getAllDeletedUsers = async (req, res, next) => {
    try {
      const deletedUsers = await listModel.find({ isDeleted: true });
      res.status(200).json({
        status: true,
        message: "Deleted users fetched successfully",
        data: deletedUsers,
      });
    } catch (error) {
      next(error);
    }
  });
