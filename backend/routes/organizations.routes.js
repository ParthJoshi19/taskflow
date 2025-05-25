import express from "express";
const router = express.Router();
import { body } from "express-validator";
import organizationController from "../controller/organization.controller.js";
router.get(
  "/getName",
  [body("token").isEmpty().withMessage("Token is require")],
  organizationController.getName
);

router.get(
  "/getNotifications",
  [body("token").isEmpty().withMessage("Token is require")],
  organizationController.getNots
);

router.get(
  "/getStats",
  [body("token").isEmpty().withMessage("Token is require")],
  organizationController.getStats
);

router.patch(
  "/updateSettings",
  [
    body("settings").notEmpty().withMessage("Settings are required"),
    body("token").isEmpty().withMessage("Token is required"),
  ],

  organizationController.updateSettings
);

router.get(
  "/getTheme",
  [body("token").isEmpty().withMessage("Token is require")],
  organizationController.getTheme
);

export default router;
