import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";



const loginWithEmailAndPassword = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
  try {
    const result = await authServices.loginWithEmailAndPassword( payload );

    res.status(200).json({
      success: true,
      message: result.message ? result.message : "user login successfully",
      data: result.data,
    });
  } catch (error : any) {
    console.log("error is = ",error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
    next();
  }
};

// --------2. authWithGoogle
const authWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
  try {
    const result = await authServices.authWithGoogle( payload );

    res.status(200).json({
      success: true,
      message: result?.message ? result?.message : "user login successfully",
      data: result.data,
    });
  } catch (error : any) {
    console.log("error is = ",error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error,
    });
    next();
  }
};



// --------
export const authControllers = {
    loginWithEmailAndPassword,
    authWithGoogle
}