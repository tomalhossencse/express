import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginInUserIntoDB = async (payload: IAuth) => {
  const { email, password } = payload;
  // 1. check if the use exists
  // 2. compare the passwords
  // 3. Genate token

  //   1.check if the use exists

  const userData = await pool.query(
    `
    SELECT * FROM users
    WHERE email = $1    
    `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Creadentials");
  }

  const user = userData.rows[0];
  //  2.console.log(user);

  //   compare the passwords

  const matchPassword = await bcrypt.compare(password, user.password);
  //   console.log(matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid Creadentials");
  }

  //   3. Genate token

  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  return { accessToken };
};

export const authService = {
  loginInUserIntoDB,
};
