import * as mongoose from "mongoose";
import * as request from "supertest";
import { app } from "../app";
import Entry from "../models/entry";
import * as randomstring from "randomstring";
import config from "../utils/config";

/**
 * TODO:
 * Test TTL
 * Test keys limit
 */

/* We will use this Entry for each test */
const testEntry = {
  key: "Jest99",
  value: "Jest test value 99",
};

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(config.DATABASE_URL);
});

/* Clear Database and close database connection after each test. */
afterEach(async () => {
  await Entry.deleteMany({});
  await mongoose.connection.close();
});
afterAll(async () => {
  await mongoose.connect(config.DATABASE_URL);
  await Entry.collection.drop();
  await mongoose.connection.close();
});

describe("POST /keys", () => {
  it("should add testEntry to app", async () => {
    const res = await request(app).post("/keys").send(testEntry);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
    expect(res.body.value).toBe(testEntry.value);
    const newValue = randomstring.generate();
    const res2 = await request(app)
      .post("/keys")
      .send({ key: testEntry.key, value: newValue });
    expect(res2.statusCode).toBe(201);
    expect(res2.body.key).toBe(testEntry.key);
    expect(res2.body.value).toBe(newValue);
  });
});

/* Take care about logic described in cache-tools.ts updateOrPopAddEntry method */
describe("GET /keys/<Entry.key>", () => {
  it("will create new key with 201 status code", async () => {
    const randomKey = randomstring.generate();
    const res = await request(app).get("/keys/" + randomKey);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(randomKey);
  });
  it("after creation should be 200 status code", async () => {
    const res = await request(app).get("/keys/" + testEntry.key);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
    const res2 = await request(app).get("/keys/" + testEntry.key);
    expect(res2.statusCode).toBe(200);
    expect(res2.body.key).toBe(testEntry.key);
  });
  it("should update updatedAt field", async () => {
    await new Entry(testEntry).save();
    const initialEntry = await Entry.find({ key: testEntry.key });
    const res = await request(app).get("/keys/" + testEntry.key);
    const newupdEntry = await Entry.find({ key: testEntry.key });
    expect(newupdEntry[0]["updatedAt"].getTime()).toBeGreaterThan(
      initialEntry[0]["updatedAt"].getTime()
    );
  });
});

describe("GET /keys", () => {
  it("should return all entries", async () => {
    const res = await request(app).get("/keys");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(0);
    await new Entry(testEntry).save();
    const res2 = await request(app).get("/keys");
    expect(res2.statusCode).toBe(200);
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

describe("DELETE /keys", () => {
  it("should delete all entries", async () => {
    const testEntry2 = {
      key: "Jest100",
      value: "Jest test value 100",
    };
    await new Entry(testEntry).save();
    await new Entry(testEntry2).save();
    const res = await request(app).delete("/keys");
    expect(res.body.deletedCount).toEqual(2);
    expect(res.statusCode).toBe(200);
  });
});

describe("Check TTL", () => {
  test("check that the expireAfterSeconds field is set correctly", async () => {
    const EntryIndexes = await Entry.listIndexes();
    expect(EntryIndexes[2]["expireAfterSeconds"]).toBe(config.KEY_TTL);
  });
});

describe("Max entries count", () => {
  test("check max entries count and a deletion logic", async () => {
    for (let i = 1; i < 11; i++) {
      await new Entry({
        key: `TestMax${i}`,
        value: randomstring.generate(),
      }).save();
    }
    const res = await request(app).post("/keys").send(testEntry);
    expect(res.statusCode).toBe(201);
    expect(res.body.key).toBe(testEntry.key);
    expect(res.body.value).toBe(testEntry.value);
    const result = await Entry.find({ key: "TestMax1" });
    expect(result).toBeNull;
  });
});
