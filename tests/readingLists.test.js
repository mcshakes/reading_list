const { createTableList, insertReadingList, dropTable } = require("../db/db-utils");
const supertest = require("supertest");
const app = require("../app");
const { types } = require("pg");

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
            // console.log(response)
            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("results")
            expect(response.body).toHaveProperty("data")
            expect(response.body["data"]["reading_lists"]).toHaveLength(2)

            expect(typeof response.body["results"]).toBe("number");
            // expect(response.body.data.reading_lists).toBeArray()
        })

        
    })
})

