import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed", "Expired"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Bug", "Feature", "Improvement"],
      default: "Feature",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
TaskSchema.index({ organizationId: 1, status: 1 })
TaskSchema.index({ organizationId: 1, assignedTo: 1 })
TaskSchema.index({ organizationId: 1, dueDate: 1 })

export default mongoose.models.Task || mongoose.model("Task", TaskSchema)