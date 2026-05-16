import app from "./app";
import config from "./config";
import { initDb } from "./db";
const port = config.port;

const main = () => {
  initDb();

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
