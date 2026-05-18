import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginInUserIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "User retrived Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const registerUser = async (req: Request, res: Response) => {
  const result = await authService.registerUserIntoDB(req.body);
  try {
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// const updateUser = async (req: Request, res: Response) => {
//   try {
//     res.status(201).json({
//       success: true,
//       message: "User Update successfully",
//       data: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error,
//     });
//   }
// };

export const authController = {
  loginUser,
  registerUser,
};
