import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginInUserIntoDB(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false, // in production i will be true
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "User login Successfully",
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

const refreshToken = async (req: Request, res: Response) => {
  // console.log(req.cookies);

  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refreshToken,
    );

    res.status(200).json({
      success: true,
      message: "Access token generated!",
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

export const authController = {
  loginUser,
  registerUser,
  refreshToken,
};
