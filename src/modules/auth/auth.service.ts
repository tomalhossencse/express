import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IAuth } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "../user/user.interface";

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
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.secret as string,
    {
      expiresIn: config.access_token_expires,
    } as jwt.SignOptions,
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    config.refresh_secret as string,
    {
      expiresIn: config.refresh_token_expires,
    } as jwt.SignOptions,
  );

  return { accessToken, refreshToken };
};

const registerUserIntoDB = async (payload: IUser) => {
  const { email, password } = payload;
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users( email, password)
    VALUES ($1, $2)
    RETURNING *
    `,
    [email, hashPassword],
  );
  delete result.rows[0].password;
  return result;
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("unauthorized");
  }

  const decoded = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `SELECT * FROM users
        WHERE email = $1
        `,
    [decoded.email],
  );
  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  if (!user.is_active) {
    throw new Error("Fobidden");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.secret as string,
    {
      expiresIn: config.access_token_expires,
    } as jwt.SignOptions,
  );

  return { accessToken };
};

export const authService = {
  loginInUserIntoDB,
  registerUserIntoDB,
  generateRefreshToken,
};
