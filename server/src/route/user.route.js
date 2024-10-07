import express from "express";
import {
    deleteUser,
  getUsers,
  getUserByID,
  updateUser,
} from "../controller/user.controller.js";
import { isUserAuthenticated } from "../middleware/isUserAuthenciated.js";

const router = express.Router();

//get all users
router.get("/get", getUsers);

//get user by id
router.get("/getUserData", isUserAuthenticated, getUserByID);

//update user when it is authenticated
router.put("/update", isUserAuthenticated, updateUser);

//delete user 
router.delete("/delete", isUserAuthenticated, deleteUser)

export default router;
