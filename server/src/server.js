import express from "express"
import dotenv from "dotenv"
dotenv.config();
import serverRoute from "./route/index.route.js"

const app = express();
const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server Is Running On The PORT ${PORT}`);
})

//home page 
app.get("/", (req,res) => {
    res.json("Welcome To ToDo App")
})

//middleware
app.use(express.json())

//route
app.use("/api", serverRoute)