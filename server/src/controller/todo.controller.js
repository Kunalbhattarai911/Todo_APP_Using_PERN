import prisma from "../../Database/db.config.js";

export const addTodo = async (req, res) => {
  try {
    const userId = req.user.id;

    const { date, title, description, day, isCompleted } = req.body;

    // Convert date string to DateTime object
    const dateTime = new Date(date);

    const addData = await prisma.todo.create({
      data: {
        date: dateTime,
        title: title,
        description: description,
        day,
        isCompleted,
        user: {
          connect: {
            id: String(userId),
          },
        },
      },
    });

    return res.status(201).json({
      message: "Successfully Added Todo List",
      success: true,
      data: addData,
    });
  } catch (error) {
    console.error("Error Adding Todo List:", error);
    return res.status(500).json({
      message: "Internal Server Occured",
      success: false,
      error: error.message,
    });
  }
};

//get todoapp lists
export const getLists = async (req, res) => {
  try {
    const userId = req.user.id;
    
    //Pagination 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if(page <= 0) {
        page = 1;
    } 

    if(limit <= 0 || limit > 100) {
        limit = 10;
    }

    const skip = (page - 1) * limit;

    const findLists = await prisma.todo.findMany({
      where: {
        user_id: String(userId),
      },
      skip : skip,
      take : limit,
      orderBy : {
        id : "desc"
      }
    });

    if (!findLists || findLists.length === 0) {
      return res.status(404).json({
        message: "No List Are presented on this userId",
        success: true,
      });
    }


    const count = await prisma.todo.count({
      where: {
        user_id: String(userId),
      },
    });

    const totalPages = Math.ceil(count/limit)

    return res.status(200).json({
      message: "Lists Of Todo App:",
      success: true,
      data: findLists,
      meta : {
      totalPages,
      currentPage : page,
      limit : limit
      }
    });
  } catch (error) {
    console.error("Error Fetching Todo List:", error);
    return res.status(500).json({
      message: "Internal Server Occured",
      success: false,
      error: error.message,
    });
  }
};

//get todo list by id
export const getList = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    const findList = await prisma.todo.findUnique({
      where: {
        user_id: String(userId),
        id: String(todoId),
      },
      include : {
        user : {
            select : {
                id : true,
                firstName : true,
                middleName : true,
                lastName : true,
                email : true,
                location : true,
                Age : true,
                Gender : true
            }
        }
      }
    });

    if (!findList) {
      return res.status(404).json({
        message: "No Data Found",
        success: false,
      });
    }

    if (!findList || findList.length === 0) {
      return res.status(404).json({
        message: "No List Are presented on this userId",
        success: true,
      });
    }

    return res.status(200).json({
      message: "Lists Of Todo App:",
      success: true,
      data: findList,
    });
  } catch (error) {
    console.error("Error Fetching Todo List:", error);
    return res.status(500).json({
      message: "Internal Server Occured",
      success: false,
      error: error.message,
    });
  }
};

//update todo list
export const updateTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    const { date, title, description, day } = req.body;

    // Validate and format the date
    const dateTime = date ? new Date(date) : undefined;

    if (date && isNaN(dateTime.getTime())) {
      return res.status(400).json({
        message: "Invalid date format. Expected ISO-8601 DateTime.",
        success: false,
      });
    }

    const findData = await prisma.todo.findFirst({
       where : {
        user_id : String(userId),
        id : String(todoId)
       }
    })

    if(!findData) {
        return res.status(404).json({
            message : "List Not Found",
            success : false
        })
    }

    const updateData = await prisma.todo.update({
      where: {
        user_id: String(userId),
        id: String(todoId),
      },
      data: {
        title: title || undefined,
        date: dateTime || undefined,
        day: day || undefined,
        description: description || undefined,
      },
    });

    return res.status(200).json({
      message: "Updated successfully",
      success: true,
      updateData,
    });
  } catch (error) {
    console.error("Error updating Todo List:", error);
    return res.status(500).json({
      message: "Internal Server Occurred",
      success: false,
      error: error.message,
    });
  }
};

//delete todo list
export const deleteList = async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    const findData = await prisma.todo.findUnique({
      where: {
        user_id: String(userId),
        id: String(todoId),
      },
    });

    if (!findData) {
      return res.status(404).json({
        message: "List Not Found",
        success: false,
      });
    }

    await prisma.todo.delete({
      where: {
        user_id: String(userId),
        id: String(todoId),
      },
    });

    return res.status(200).json({
      message: "List Removed Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error Deleting List:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//search todo list 
export const searchList = async (req,res) => {
    try {
        const userId = req.user.id;
        const query = req.query.q;

        if(!query) {
            return res.status(200).json({
                message : "No Search Query Provided",
                success : true,
                lists : [],
                count : 0
            })
        }
        const lists = await prisma.todo.findMany({
            where : {
                user_id : String(userId),
                OR : [
                    {
                        title : {
                            contains : query,
                            mode : "insensitive"
                        }
                    },
                    {
                        description : {
                            contains : query,
                            mode : "insensitive"
                        }
                    },
                    
                ]
            },
            select : {
                id : true,
                title : true,
                description : true,
                date : true,
                day : true,
            },
            
        })

        //count the matching lists
        const count = lists.length;

        //if no results found return a message as 404 
        if(count === 0) {
            return res.status(404).json({
                message : "No Matching List Found",
                success  :false,
                count : count 
            })
        }

        return res.status(200).json({
            message : "Lists Retrived Successfully",
            success : true,
            lists,
            count : count
        })
    } catch (error) {
        console.error("Error Fetching Lists", error);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false,
            error : error.message
        })
    }
}
