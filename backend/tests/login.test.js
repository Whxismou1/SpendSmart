const supertest = require("supertest");
const { app, server } = require("../app");

const api = supertest(app);

test("logout unahotized", async () => {
  await api.get("/api/v1/auth/logout").expect(401);
});

afterAll(() => {
  server.close();
});
