import supertest from "supertest";
import app from "../index";
import { describe, it } from "node:test";

const request = supertest(app);

describe("Test basic endpoint server", () => {
  it("Get the / endpoint", async () => {
    const response = await request.get("/");
    console.log(response);
    
  });
});
