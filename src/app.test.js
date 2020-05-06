const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./utils/testTearDownMongoose");

describe("App", () => {
  afterAll(async () => {
    await teardownMongoose();
  });

  it("Testing to see if Jest works", () => {
    expect(1).toBe(1);
  });

  it("GET / should return JSON object of all endpoints", async () => {
    const expectedValue = {
      "0": "GET /",
      "1": "GET /topics",
      "2": "POST /topics",
      "3": "GET /topics/:id",
      "4": "POST /topics/:id/comments",
    };

    const { body: endpointValue } = await request(app).get("/").expect(200);

    expect(endpointValue).toEqual(expectedValue);
  });
});
