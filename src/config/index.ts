import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  conection_string: process.env.CONNECTIONSTRING as string,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_TOKEN,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES,
};
export default config;
