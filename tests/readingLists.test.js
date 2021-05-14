const { createTableList, insertReadingList, dropTable } = require("../db/db-utils");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app)

describe("Reading List Service", () => {
    beforeAll(async() => {
        await createTableList("test_lists")
        await insertReadingList('test_lists', 'Programming Books', "Self Study")
        await insertReadingList('test_lists', 'Horror Books', "Fear Inducing")
    })

    describe("fetch all Reading Lists", () => {
        
        test("response has proper data properties", async () => {
            const response = await api.get("/api/v1/lists")

            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("results")
            expect(response.body).toHaveProperty("data")
            
            expect(response.body.status).toBeString()
            expect(response.body.results).toBeNumber();
            expect(response.body.data.reading_lists).toBeArray()
        })

        test("reading lists are returned as JSON", async () => {
            await api
                .get("/api/v1/lists")
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test("all reading lists are returned", async () => {
            const response = await api.get("/api/v1/lists")

            expect(response.body.data).not.toBeEmpty()
            expect(response.body.data.restaurants).toBeArrayOfSize(2)
        })
    })
})

