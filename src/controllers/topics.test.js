const request = require("supertest");
const app = require("../app");
const { teardownMongoose } = require("../utils/testTearDownMongoose");
const topicsData = require("../../data/topic.data");
const TopicsModel = require("../models/topics.model");

jest.mock("jsonwebtoken");
//const jwt = require("jsonwebtoken");

describe("Companies Route", () => {
  afterAll(async () => {
    await teardownMongoose();
  });

  beforeEach(async () => {
    await TopicsModel.create(topicsData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await TopicsModel.deleteMany();
  });

  it("GET / should return JSON object of all topics (and no _id, __v)", async () => {
    const expectedValue = topicsData;

    const { body: actualValue } = await request(app)
      .get("/topics/")
      .expect(200);

    expect(actualValue).toEqual(expectedValue);
  });

  it("POST / should return JSON object of topics that's posted", async () => {
    const expectedValue = {
      topicName: "Topic name 3",
      topicStarterName: "topic starter 3",
    };

    const { body: actualValue } = await request(app)
      .post("/topics/")
      .send(expectedValue)
      .expect(201);
  });

  it("GET /:id return JSON object of topic with corresponding ID including its comment", async () => {
    const topicID = topicsData[0].id;
    const expectedValue = topicsData[0]; // this will be the first company in the test data

    const { body: actualValue } = await request(app)
      .get(`/topics/${topicID}`)
      .expect(200);

    expect(actualValue).toEqual(expectedValue);
  });

  it("GET /:id return 404 error when no topic is found", async () => {
    const topicID = "invalidID";
    const expectedValue = "No data found";

    const { body: errMsg } = await request(app)
      .get(`/topics/${topicID}`)
      .expect(404);

    expect(errMsg.error).toEqual(expectedValue);
  });

  it("POST /:id/comments should add a comment to the correct company", async () => {
    const topicID = topicsData[0].id;
    const review = {
      username: "another user",
      comment: "another comment",
    };

    const expectedValue = {
      userId: "testuser",
      username: "another user",
      comment: "another comment",
    };

    const { body: actualValue } = await request(app)
      .post(`/topics/${topicID}/comments`)
      .send(review)
      .expect(201);

    expect(actualValue).toMatchObject(expectedValue);
  });

  it("POST /:id/comments should add a comment to the correct company", async () => {
    const topicID = "invalidID";
    const review = {
      username: "another user",
      comment: "another comment",
    };

    const expectedValue = "No data found";

    const { body: errMsg } = await request(app)
      .post(`/topics/${topicID}/comments`)
      .send(review)
      .expect(404);

    expect(errMsg.error).toEqual(expectedValue);
  });
});
