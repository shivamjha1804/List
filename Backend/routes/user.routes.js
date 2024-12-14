const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authenticate = require("../auth/auth.middleware");

const validateSignUp = [
  body("firstname").not().isEmpty().withMessage("First name is required"),
  body("lastname").not().isEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("profileImage").isString().withMessage("Invalid image URL"),
];

const loginUser = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

const verifyEmail = [
  body("email").isEmail().withMessage("Invalid email address"),
];

const updateUser = [
  body("firstname")
    .optional()
    .not()
    .isEmpty()
    .withMessage("First name cannot be empty"),
  body("lastname")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Last name cannot be empty"),
  body("profileImage").optional().isURL().withMessage("Invalid image URL"),
];

const updatePassword = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
];

const matchOtp = [
  body("otp").isLength({ min: 4, max: 4 }).withMessage("OTP must be 4 digits"),
  body("otp").isInt().withMessage("OTP must be an integer"),
  body("email").isEmail().withMessage("Invalid email address"),
];

router.post("/sign-up", validateSignUp, userController.signUpUser);
router.post("/login", loginUser, userController.loginUser);

router.use(authenticate);
router.put("/update-profile", updateUser, userController.updateProfile);
router.put("/update-password", updatePassword, userController.updatePassword);
router.get("/profile", userController.getProfile);

module.exports = router;
