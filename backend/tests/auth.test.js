const supertest = require("supertest");
const bcrypt = require("bcrypt");

const { app, server } = require("../app");
const UserModel = require("../models/user.model");
const { sendVerificationEmail } = require("../config/mail.config");
const api = supertest(app);

jest.mock("../config/mail.config", () => ({
  sendVerificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendResetPasswordRequest: jest.fn(),
  sendPasswordResetSucces: jest.fn(),
}));

beforeAll(async () => {
  await UserModel.deleteMany({});
});

/**
 * Register Tests
 */

test("Missing credentials on register", async () => {
  await api
    .post("/api/v1/auth/register")
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("Register an user", async () => {
  const newUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "TestPassword123",
  };
  await api
    .post("/api/v1/auth/register")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
  const verificationToken = sendVerificationEmail.mock.calls[0][1];
  expect(verificationToken).toBeDefined();

  const response = await api
    .post("/api/v1/auth/verify-email")
    .send({ verificationCode: verificationToken })
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe("Email verified successfully");
});

test("Register a user that exists already", async () => {
  const newUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "waaa",
  };
  await api
    .post("/api/v1/auth/register")
    .send(newUser)
    .expect(409)
    .expect("Content-Type", /application\/json/);
});

/**
 * Login Tests
 */

test("Missing credentials on login", async () => {
  await api
    .post("/api/v1/auth/login")
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("Invalid credentials on login", async () => {
  const credentials = {
    email: "testuser@example.com",
    password: "abc",
  };
  await api.post("/api/v1/auth/login").send(credentials).expect(400);
});

test("Login with valid credentials", async () => {
  const email = "testuser@example.com";
  const user = await UserModel.findOne({ email });
  const credentials = {
    email: "testuser@example.com",
    password: "TestPassword123",
  };
  const response = await api
    .post("/api/v1/auth/login")
    .send(credentials)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body.success).toBe(true);
  expect(response.body.user.email).toBe(user.email);

  const cookies = response.headers["set-cookie"];

  const token = cookies.find((cookie) => cookie.includes("jwt_token"));
  expect(token).toBeDefined();
  global.cookie = cookies;
});

test("logout authorized", async () => {
  const response = await api
    .get("/api/v1/auth/logout")
    .set("Cookie", global.cookie)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe("Logged out successfully");
});

test("logout unauthorized because there are no cookies", async () => {
  const response = await api.get("/api/v1/auth/logout").expect(401);

  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Invalid cookie");
});

afterAll(() => {
  server.close();
});
