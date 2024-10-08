import express from "express"
import { isUserAuthenticated } from "../middleware/isUserAuthenciated.js";
import { addTodo, deleteList, getList, getLists, markTaskAsComplete, searchList, updateTodo } from "../controller/todo.controller.js";

const router = express.Router();

//Add Todo list 
router.post("/add", isUserAuthenticated, addTodo)

//get all todo list of the authenticated user 
router.get("/get", isUserAuthenticated, getLists)

//get single list by id 
router.get("/get/:id", isUserAuthenticated, getList)

//update the list by id when authenticated
router.put("/update/:id", isUserAuthenticated, updateTodo)

//mark as true to task
router.put("/updateTask/:id", isUserAuthenticated, markTaskAsComplete)

//delete the list by id
router.delete("/delete/:id", isUserAuthenticated, deleteList)

//serach the list 
router.get("/search", isUserAuthenticated, searchList)

export default router