import express from "express";
const router = express.Router();
import { body } from "express-validator";
import userController from "./../controller/user.controller.js";
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("organizationName")
      .notEmpty()
      .withMessage("Organization name is required"),
  ],
  userController.register
);

router.post(
  "/join",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("inviteCode").notEmpty().withMessage("Invite code is required"),
  ],
  userController.join
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.login
);

router.get(
  "/getInfo",
  [body("token").notEmpty().withMessage("Token not provided")],
  userController.getInfo
);

router.get(
  "/invite-code",
  [body("token").notEmpty().withMessage("Token not provided")],
  userController.getInvite
);

router.patch(
  "/updateUserRole",
  [
    body("token").notEmpty().withMessage("Token not provided"),
    body("userId").isEmpty().withMessage("User Id is needed"),
    body("newRole").isEmpty().withMessage("New Role is needed"),
  ],
  userController.updateRole
);

router.delete(
  "/removeUser",
  [
    body("token").notEmpty().withMessage("Token not provided"),
    body("userId").isEmpty().withMessage("User Id is needed"),
  ],
  userController.removeUser
);

export default router;
