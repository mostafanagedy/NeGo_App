const request = require("supertest");
const app = require("../src/app");

describe("NeGo API Health Check", () => {
  it("GET / should return status 200 with running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("NeGo_App API Running");
  });
});
