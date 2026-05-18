import jwt, { type JwtPayload } from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import config from "../config";
import { pool } from "../db";
import type { IUser } from "../modules/user/user.interface";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // console.log("This is protected Route");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = jwt.verify(
      token as string,
      config.secret as string,
    ) as JwtPayload;
    console.log(decoded);

    const userData = await pool.query(
      `SELECT * FROM users
        WHERE email = $1
        `,
      [decoded.email],
    );
    const user: IUser = userData.rows[0];

    if (userData.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      res.status(403).json({
        success: false,
        message: "Forbidden!",
      });
    }
    console.log(user);
    next();
  };
};

export default auth;
