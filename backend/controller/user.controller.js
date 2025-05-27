import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./../models/user.model.js";
import Organization from "./../models/Organization.model.js";
import Notification from "../models/notification.model.js";
const register = async (req, res, next) => {
  try {
    const { name, email, password, organizationName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const organization = new Organization({
      name: organizationName,
      inviteCode: Math.random().toString(36).substring(2, 15),
    });

    await organization.save();

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      organizationId: organization._id,
    });

    await user.save();
    const token = jwt.sign(
      { userId: user._id, organizationId: organization._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res
      .json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        },
      })
      .status(200);
  } catch (error) {
    console.error("Registration Error", error);
    res.status(500);
  }
};

const join = async (req, res, next) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    const organization = await Organization.findOne({ inviteCode });
    if (!organization) {
      return NextResponse.json(
        { message: "Invalid invite code" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "Member",
      organizationId: organization._id,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, organizationId: organization._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    return res
      .json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        },
      })
      .status(200);
  } catch (err) {
    console.error("Joining Error", err);
    res.json({ msg: "Joining Erro" }).status(500);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Invalide credintials" }).status(401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: "Incorrect Email or Password" }).status(401);
    }

    const token = jwt.sign(
      { userId: user._id, organizationId: user.organizationId },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    return res
      .json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        },
      })
      .status(200);
  } catch (error) {
    console.error("Login error:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

const getInfo = async (req, res, next) => {
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

    const users = await User.find({
      organizationId: user.organizationId,
    });
    return res.json(users);
  } catch (error) {
    console.error("Error while getting users", error);
  }
};

const getInvite = async (req, res) => {
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

    if (!["Admin", "Manager"].includes(user.role)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const organization = await Organization.findById(user.organizationId);

    if (!organization) {
      return res.json({ message: "Organization not found" }).status(404);
    }

    return res.json({ inviteCode: organization.inviteCode });
  } catch (error) {
    console.error("Get invite code error:", error);
  }
};

const updateRole = async (req, res) => {
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
    if (!["Admin", "Manager"].includes(user.role)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
    const {newRole,userId}=req.body;
    const newUser=await User.findById(userId).select("-password");
    if(!newUser){
      return res.json({message:"User Not found"}).status(400);
    }
    newUser.role=newRole;
    await newUser.save();
    return res.json({message:"Role updated successfully"}).status(200);
  } catch (error) {
    console.error("Error while updating error",error);
    return res.json({message:"Error while updating error"}).status(500);
  }
};

const removeUser=async(req,res)=>{
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
    if (!["Admin", "Manager"].includes(user.role)) {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const {userId}=req.query;
    const isRemoved=await User.findByIdAndDelete(userId);
    if(!isRemoved){
      return res.json({message:"User not found"}).status(400);
    }
    return res.json({message:"User removed successfully"}).status(200);

  } catch (error) {
    console.log("Error while removing user",error);
    return res.json({message:"Error while removing user"}).status(500);
  }
}


const sendNotification = async (req, res) => {
  try {
    const { message, assignedTo, token } = req.body;
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

    const assignedUser = await User.find({email:assignedTo});
    if (!assignedUser) {
      return res.json({ message: "User not found" }).status(400);
    }
    const userId=decoded.userId;
    const newNot=new Notification({
      userId,message,read:false,assignedTo
    })

    await newNot.save();

    return res
      .json({ message: "Notification sent successfully" })
      .status(200);
  } catch (error) {
    console.error("Error while sending notification", error);
    return res
      .json({ message: "Error while sending notification" })
      .status(500);
  }
};

export default { register, join, login, getInfo, getInvite, updateRole,removeUser,sendNotification };
