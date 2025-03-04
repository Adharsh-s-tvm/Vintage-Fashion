import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";




const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
        res.status(401);
        throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
        res.status(401);
        throw new Error("Not authorized as admin");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        { id: admin._id, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
        _id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        isAdmin: admin.isAdmin,
    });
});


const logoutCurrentAdmin = asyncHandler(async (req, res) => {
    // Clear the token cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/'
    });

    // Clear any other admin-specific cookies if they exist
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/'
    });

    res.status(200).json({ message: "Admin logged out successfully" });
});


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});


const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});


const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});


const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});


const getDashboard = asyncHandler(async (req, res) => {
    if (!req.admin || !req.admin.isAdmin) {
        res.status(401);
        throw new Error("Not authorized as admin");
    }

    res.status(200).json({
        success: true,
        message: "Admin dashboard access granted",
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            name: `${req.admin.firstname} ${req.admin.lastname}`
        }
    });
});


export {
    loginAdmin,
    getAllUsers,
    deleteUserById,
    getUserById,
    updateUserById,
    logoutCurrentAdmin,
    getDashboard
};