const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const listController = require("../controllers/list.controller");
const authenticate = require("../auth/auth.middleware");

const validateAddUser = [
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("userImage").notEmpty().withMessage("User image is required"),
  body("phone").isNumeric().withMessage("Phone number must be numeric"),
  body("address").notEmpty().withMessage("Address is required"),
];

const validateUpdateUser = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric"),
  body("firstname").optional().notEmpty().withMessage("First name is required"),
  body("lastname").optional().notEmpty().withMessage("Last name is required"),
  body("userImage").optional().notEmpty().withMessage("User image is required"),
  body("address").optional().notEmpty().withMessage("Address is required"),
];

const validateUserId = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
];

router.use(authenticate);

router.post("/add-user", validateAddUser, listController.addUser);
router.delete(
  "/delete-user/:userId",
  validateUserId,
  listController.deleteUser
);
router.put(
  "/update-user/:userId",
  validateUpdateUser,
  listController.updateUser
);
router.get("/get-all-users", listController.getAllUsers);
router.get("/get-all-deleted-users", listController.getAllDeletedUsers);

module.exports = router;
