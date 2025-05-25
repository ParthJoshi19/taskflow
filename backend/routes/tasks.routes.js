import express from "express";
const router = express.Router();
import { body } from "express-validator";
import tasksController from "../controller/tasks.controller.js";

router.post(
  "/createTask",
  [
    body("token").isEmpty().withMessage("Token is require"),
    body("newTask").isEmpty().withMessage("Task is require"),
  ],
  tasksController.createTask
);

router.get(
  "/getTasks",
  [body("token").isEmpty().withMessage("Token is require")],
  tasksController.getTasks
);

router.patch(
  "/updateTask",
  [
    body("token").isEmpty().withMessage("Token is needed"),
    body("status").isEmpty().withMessage("Status is needed"),
    body("taskId").isEmpty().withMessage("taskId is needed"),
  ],
  tasksController.updateTask
);

export default router;
