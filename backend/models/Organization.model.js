import mongoose from "mongoose"

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    settings: {
      theme: {
        type: String,
        default: "light",
      },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema)
