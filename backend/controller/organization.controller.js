import jwt, { decode } from "jsonwebtoken";
import User from "./../models/user.model.js";
import Organization from "./../models/Organization.model.js";
import Task from "./../models/Task.model.js";
import Notification from "../models/notification.model.js";
const getName = async (req, res) => {
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
    const organization = await Organization.findById(decoded.organizationId);

    if (!organization) {
      return res.json({ message: "Organization not found" }).status(404);
    }

    return res.json(organization).status(200);
  } catch (error) {}
};

const getNots = async (req, res) => {
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
    const overdueTasks = await Task.find({
      organizationId: decoded.organizationId,
      assignedTo: decoded.userId,
      status: "Expired",
    }).populate("createdBy", "name");
    const notifications = overdueTasks.map((task) => ({
      title: "Overdue Task",
      message: `Task "${task.title}" is overdue`,
      time: "Now",
      type: "overdue",
    }));
    const notify = await Notification.find({ assignedTo: decoded.userId });
    notify.map((noti) => {
      notifications.push({
        title: "New Task",
        message: noti.message,
        time: noti.createdAt,
        type: "Assignment",
      });
    });
    return res.json(notifications).status(200);
  } catch (error) {
    console.error("Error while getting Notifications", error);
    return res
      .json({ message: "Error while getting Notifications" })
      .status(401);
  }
};

const getStats = async (req, res) => {
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
    const organizationId = decoded.organizationId;
    const totalTasks = await Task.countDocuments({ organizationId });
    const completedTasks = await Task.countDocuments({
      organizationId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      organizationId,
      status: "Expired",
    });
    const inProgressTasks = await Task.countDocuments({
      organizationId,
      status: "In Progress",
    });

    // Get member count
    const totalMembers = await User.countDocuments({ organizationId });

    // Get tasks by category
    const tasksByCategory = await Task.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { organizationId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Format the aggregated data
    const categoryStats = tasksByCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const priorityStats = tasksByPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return res
      .json({
        totalTasks,
        completedTasks,
        overdueTasks,
        inProgressTasks,
        totalMembers,
        tasksByCategory: categoryStats,
        tasksByPriority: priorityStats,
      })
      .status(200);
  } catch (error) {
    console.error("Error while getting stats", error);
    return res.json({ message: "Error while getting stats" }).status(401);
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings, token } = req.body;
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
    const organization = await Organization.findById(decoded.organizationId);
    if (!organization) {
      return res.json({ message: "Organization not found" }).status(404);
    }
    organization.settings = settings;
    await organization.save();
    return res.json({ message: "Settings updated successfully" }).status(200);
  } catch (error) {
    console.error("Error while updating settings", error);
    return res.json({ message: "Error while updating settings" }).status(500);
  }
};

const getTheme = async (req, res) => {
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
    const organization = await Organization.findById(decoded.organizationId);
    if (!organization) {
      return res.json({ message: "Organization not found" }).status(404);
    }

    return res.json({ theme: organization.settings.theme }).status(200);
  } catch (error) {
    console.error("Error while updating settings", error);
    return res.json({ message: "Error while updating settings" }).status(500);
  }
};

export default { getName, getNots, getStats, updateSettings, getTheme };
