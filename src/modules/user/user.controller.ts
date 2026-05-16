import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const result = await userService.createUserIntoDb(req.body);
    //   console.log(result.rows);
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

export const userController = {
  createUser,
};
