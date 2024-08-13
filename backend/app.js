const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const startWebApp = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
};

startWebApp();
