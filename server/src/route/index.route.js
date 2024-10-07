import express from "express"
import authRoute from "./auth.route.js"
import userRoute from "./user.route.js"
import todoRoute from "./todo.route.js"

const router = express.Router()

//Auth Route
router.use("/user/auth", authRoute)

//User Route
router.use("/user", userRoute)

//Todo Route
router.use("/todo", todoRoute)

export default router