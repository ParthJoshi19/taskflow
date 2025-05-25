import Task from "./../models/Task.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { token } = req.body;
    if (!token) {
      return res.json({ message: "No token provided" }).status(401);
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .json({ success: false, message: "User not found" })
        .status(401);
    }

    if (!["Admin", "Manager"].includes(user.role)) {
      return res.json({ message: "Insufficient permissions" }).status(403);
    }

    const { title, description, priority, category, dueDate, assignedTo } =
      req.body.newTask;
    const task = new Task({
      title,
      description,
      priority,
      category,
      dueDate,
      assignedTo: assignedTo || null,
      createdBy: decoded.userId,
      organizationId: decoded.organizationId,
      status: "Todo",
    });

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name");
    return res.json(task).status(201);
  } catch (error) {
    console.error("Error while creating task", error);
    return res.json({ message: "Error Task" }).status(400);
  }
};

const getTasks = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.json({ message: "No token provided" }).status(401);
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .json({ success: false, message: "User not found" })
        .status(401);
    }
    const tasks = await Task.find({
      organizationId: decoded.organizationId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return res.json(tasks).status(200);
  } catch (error) {
    console.error("Error while getting Tasks", error);
    return res.json({ message: "Error Task" }).status(500);
  }
};

const updateTask = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ message: "No token provided" }).status(401);
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .json({ success: false, message: "User not found" })
        .status(401);
    }
    const {taskId,status}=req.body;
    const task = await Task.findOne({
      _id: taskId,
      organizationId: decoded.organizationId,
    });
    if (!task) {
      return res.json({ message: "Task not found" }).status(404);
    }

    const canUpdate =
      user.role === "Admin" ||
      user.role === "Manager" ||
      task.assignedTo?.toString() === user.userId
    if (!canUpdate) {
      console.log("Invalid user ")
      return res.json({ message: "Insufficient permissions" }).status(403);
    }
    task.status = status
    await task.save()
    
    return res.json(task).status(200);
  } catch (error) {
    console.error("Error while updating task",error);
    res.json({message:"Error while updating task"}).status(500)
  }
};

export default { createTask, getTasks, updateTask };
