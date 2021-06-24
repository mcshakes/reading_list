require('dotenv').config()

const { createTableList, insertReadingList, dropTable } = require("../db/db-utils");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app)

describe("Reading List Service", () => {
    beforeAll(async() => {
        await createTableList("reading_lists")
        await insertReadingList('reading_lists', 'Programming Books', "Self Study")
        await insertReadingList('reading_lists', 'Horror Books', "Fear Inducing")
    })

    describe("fetch all Reading Lists", () => {
        test("reading lists are returned as JSON", async () => {
            await api
                .get("/api/v1/lists")
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        
        test("response has proper data properties", async () => {
            const response = await api.get("/api/v1/lists")

            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("results")
            expect(response.body).toHaveProperty("data")
            expect(response.body["data"]["reading_lists"]).toHaveLength(2)

            expect(typeof response.body["results"]).toBe("number");
        })
        
    })

    describe("fetch single reading list", () => {
        let response;

        beforeAll(async () => {
            response = await api.get("/api/v1/lists/1")
        })

        test("returned as succesful JSON", async () => {
            expect(response.type).toBe("application/json")
            expect(response.status).toBe(200)
        })

        test("JSON has correct data properties", async () => {

            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("results")
            expect(response.body).toHaveProperty("data")
            
            expect(response.body["data"]).toHaveProperty("id")
            expect(response.body["data"]).toHaveProperty("list_type")
            expect(response.body["data"]).toHaveProperty("name")
        })

        test("Object has correct types", async () => {
            
            expect(typeof response.body["data"]["id"]).toBe("number")
            expect(typeof response.body["data"]["list_type"]).toBe("string")
            expect(typeof response.body["data"]["name"]).toBe("string")
        })
    })

    describe("Update a single list", () => {
        let response;

        beforeAll(async () => {
            editedList = {
                list_type: "Wishful Thinking",
                name: "Piloting Whales"
            }
            response = await api
                            .put("/api/v1/lists/1")
                            .send(editedList)

        })

        test("returned as succesful JSON", async () => {
            expect(response.type).toBe("application/json")
            expect(response.status).toBe(200)
        })

        test("Reading List object has been updated with new values", async () => {
            expect(response.body["data"]["list_type"]).toEqual("Wishful Thinking")
            expect(response.body["data"]["name"]).toBe("Piloting Whales")
        })
    })

    describe("Delete a single list", () => {

        test("returned as succesful JSON with resource DELETED status code", async () => {
            response = await api.delete("/api/v1/lists/1")
            expect(response.status).toBe(204)
        })
    })

})

