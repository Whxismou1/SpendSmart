const express = require("express");
require("dotenv").config();

const authRouter = require("./routes/auth.route");
const dbConfig = require("./config/db.config");

const app = express();

const startWebApp = () => {
  dbConfig.createConnection();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use("/api/v1/auth", authRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
};

startWebApp();
