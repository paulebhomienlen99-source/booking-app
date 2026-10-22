import request from "supertest";
import app from "../server.js";

describe("JWT Security Tests", () => {
  let token;

  test("Admin login", async () => {
    const response = await request(app)
      .post("/api/admin/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();

    token = response.body.token;
  });

  test("Dashboard with valid token", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Dashboard without token", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Token missing");
  });

  test("Dashboard with invalid token", async () => {
    const response = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", "Bearer abc123");

    expect(response.statusCode).toBe(401);
  });
});
