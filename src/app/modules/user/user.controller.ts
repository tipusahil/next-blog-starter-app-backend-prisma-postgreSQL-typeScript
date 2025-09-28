import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { prisma } from "../../config/db.config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  try {
    const result = await userServices.createUser(payload);

    res.status(201).json({
      success: true,
      message: result?.message || "user created successfully",
      data: result?.data,
    });
  } catch (error : any) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error?.message || "user creation failed!",
      error: error,
    });
    next();
  }
};

// ------------2.update user--
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
  const payload = req.body;
  try {
    const result = await userServices.updateUser( Number(id) , payload);

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "user updateding failed!",
      error: error,
    });
    next();
  }
};

// ------------3. getAllUsers --
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.getAllUsers();

    res.status(200).json({
      success: true,
      message: "all users retrieved successfully",
      data: {
        meta: {
            totalUsers : result.meta
        },
        data: result.data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "all users retrieving failed!",
      error: error,
    });
    next();
  }
};


// ---------4. getUserById ---
const getUserById= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.getUserById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "user retrieved successfully",
      data: {
        totalPosts : result.totalPosts,
        data : result.data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "user retrieving failed!",
      error: error,
    });
    next();
  }
 }

// ---------4. deleteUser ---
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.deleteUser(Number(req.params.id));


    res.status(200).json({
      success: true,
      message: "user delete successfully",
      data:result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "user delation failed!",
      error: error,
    });
    next();
  }
 }


//  -------

// ---------------
export const userControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
