import prisma from "../../Database/db.config.js";

//Get All User Details
export const getUsers = async (req, res) => {
  try {
    const findUser = await prisma.user.findMany();

    if (findUser.length === 0) {
      return res.status(404).json({
        message: "No User Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "The List Of User Are:",
      success: true,
      data: findUser,
    });
  } catch (error) {
    console.log(error);
  }
};

//Get User By ID
export const getUserByID = async (req, res) => {
  try {
    const userId = req.user.id;

    const findUser = await prisma.user.findFirst({
      where: {
        id: String(userId),
      },
      include : {
        Todo : true,
        _count : {
            select : {
                Todo : true
            }
        }
      }
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: `${findUser.firstName} details`,
      success: true,
      data: findUser,
    });
  } catch (error) {
    console.log(error);
  }
};

//update User Data
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const { firstName, middleName, lastName, location, email, Age, Gender } = req.body;

    //check if the updated email exists or not
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          message: "This Email Is Already Registered.",
          success: false,
        });
      }
    }

    const updateData = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        firstName: firstName || undefined, // update only if provided
        middleName: middleName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        location: location || undefined,
        Age: Age || undefined,
        Gender: Gender || undefined,
      },
    });

    return res.status(201).json({
      message: "User Details Updated Successfully",
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};


//delete user
export const deleteUser = async(req,res) => {
    try {
        const userId = req.user.id

        const user = await prisma.user.findUnique({
            where : {
                id : String(userId)
            }
        })

        if(!user) {
            return res.status(404).json({
                message : "User Not Found",
                success : false
            })
        }

       await prisma.user.delete({
            where : {
                id : String(userId)
            }
        })

        return res.status(200).json({
            message : "User Deleted Successfully",
            success : true
        })
    } catch (error) {
        console.error("Error Deleting User:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
          });
        }
      };