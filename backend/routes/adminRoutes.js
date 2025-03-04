import express from "express";
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'
import {
  loginAdmin,
  logoutCurrentAdmin,
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
  getDashboard
} from "../controllers/adminController.js";

const router = express.Router();


router.post("/login", loginAdmin);
router.post("/logout", logoutCurrentAdmin);
router.get("/dashboard", authenticate, authorizeAdmin, getDashboard);

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

export default router;
