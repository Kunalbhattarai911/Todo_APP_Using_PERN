import prisma from "../../Database/db.config.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//Register User
export const registerUser = async(req,res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            email,
            location,
            Age,
            Gender,
            password
        } = req.body

        const findEmail = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(findEmail) {
            return res.status(400).json({
                message : "This Email Is Already Registered. Please Use Another Valid Email.",
                success : false
            })
        }

        const saltPassword = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltPassword)

        const register = await prisma.user.create({
            data : {
                firstName,
                middleName,
                lastName,
                email,
                location,
                Age,
                Gender,
                password : hashPassword
            }
        })

        return res.status(201).json({
            message : "User Created Successfully",
            success : true,
            register
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

//Login User
export const login = async(req,res) => {
    try {
        const {
            email,
            password
        } = req.body

        //check email is presented or not
        const findEmail = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(!findEmail) {
            return res.status(404).json({
                message : "Email Or Password Is Incorrect",
                success : false
            })
        }

        //check if the password is correct or not of the email provided
        const checkPassword = await bcrypt.compare(password, findEmail.password)
        if(!checkPassword) {
            return res.status(404).json({
                message : "Email Or Password Is Incorrect",
                success : false
            })
        }

        const token = jwt.sign(
            {email: findEmail.email, id:findEmail.id},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "24h"}
        )

        return res.status(200).json({
            message : "Login Successful",
            success : true,
            token : token,
            data : {
                id: findEmail.id,
                email: findEmail.email,
                firstName: findEmail.firstName,
                middleName: findEmail.middleName,
                lastName: findEmail.lastName,
                location: findEmail.location,
                Age: findEmail.Age,
                Gender: findEmail.Gender,
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};