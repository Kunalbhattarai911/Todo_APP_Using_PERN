import express from "express"
import { isUserAuthenticated } from "../middleware/isUserAuthenciated.js";
import { addTodo, deleteList, getList, getLists, searchList, updateTodo } from "../controller/todo.controller.js";

const router = express.Router();

//Add Todo list 
router.post("/add", isUserAuthenticated, addTodo)

//get all todo list of the authenticated user 
router.get("/get", isUserAuthenticated, getLists)

//get single list by id 
router.get("/get/:id", isUserAuthenticated, getList)

//update the list by id when authenticated
router.put("/update/:id", isUserAuthenticated, updateTodo)

//delete the list by id
router.delete("/delete/:id", isUserAuthenticated, deleteList)

//serach the list 
router.get("/search", isUserAuthenticated, searchList)

export default router