const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const mongoString = process.env.DATABASE_URL;
const Entry = require("../models/entry");
const randomstring = require("randomstring");


/**
 * TODO:
 * Test TTL
 * Test keys limit
 */

require("dotenv").config();
const testEntry = {
  key: "Jest99",
  value: "Jest test value 99",
}

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(mongoString);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await Entry.deleteMany({})
  await mongoose.connection.close();
});

describe("POST /keys", () => {
  it("should add some data to app", async () => {
    await new Entry(testEntry).save();
    const res = await request(app).post("/keys").send(testEntry);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
    expect(res.body.value).toBe(testEntry.value);
  });
});

describe("GET /keys/<Entry.key>", () => {
  it("should create and return one entry", async () => {
    const res = await request(app).get("/keys/" + testEntry.key);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
    const res2 = await request(app).get("/keys/" + testEntry.key);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
  });
});

describe("GET /keys", () => {
  it("should return all entries", async () => {
    const res = await request(app).get("/keys");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(0);
    await new Entry(testEntry).save();
    const res2 = await request(app).get("/keys");
    expect(res.statusCode).toBe(200);
  });
});

describe("DELETE /keys/<Entry.key>", () => {
  it("should delete one entry", async () => {
    await new Entry(testEntry).save();
    const res = await request(app).delete("/keys/" + testEntry.key);
    expect(res.statusCode).toBe(200);
    expect(res.body.key).toBe(testEntry.key);
    expect(res.body.value).toBe(testEntry.value);
    const failed = await request(app).delete("/keys/Test21331232213231");
    expect(failed.statusCode).toBe(404);
  });
});

describe("GET /keys/<Entry.key>", () => {
  it("will create new key with 201", async () => {
    randomKey = randomstring.generate();
    const res = await request(app).get("/keys/" + randomKey);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(randomKey);
  });
});

describe("DELETE /keys", () => {
  it("should delete all entries", async () => {
    const testEntry2 = {
      key: "Jest100",
      value: "Jest test value 100",
    }
    await new Entry(testEntry).save();
    await new Entry(testEntry2).save();
    const res = await request(app).delete("/keys");
    expect(res.body.deletedCount).toEqual(2);
    expect(res.statusCode).toBe(200);
  });
});