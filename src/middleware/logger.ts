import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `\nMethod =>  ${req.method} | Url =>  ${req.url} | Time =>  ${Date.now()}\n`;

  fs.appendFile("logger.txt", log, (error) => {
    // console.log(error);
  });

  next();
};

export default logger;
