const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth.route");
const movementRouter = require("./routes/movement.route");
const dbConfig = require("./config/db.config");
const userRouter = require("./routes/user.route");

const app = express();

dbConfig.createConnection();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movements", movementRouter);
app.use("/api/v1/users", userRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = { app, server };
