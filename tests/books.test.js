const { createTableList, 
        insertReadingList,
        insertBookInReadingList, 
        createTableBooks } = require("../db/db-utils");

const supertest = require("supertest");
const app = require("../app");

const api = supertest(app)


expect.extend({
	toBeType(received, argument) {
		const initialType = typeof received;
		const type = initialType === "object" ? Array.isArray(received) ? "array" : initialType : initialType;
		return type === argument ? {
			message: () => `expected ${received} to be type ${argument}`,
			pass: true
		} : {
			message: () => `expected ${received} to be type ${argument}`,
			pass: false
		};
	}
});

describe("API : Books Service : ", () => {
    let readingList;

    beforeAll(async () => {
        await createTableList("reading_lists")
        await insertReadingList('reading_lists', 'Programming Books', "Self Study")
        await createTableBooks("books", "reading_lists")
        await insertBookInReadingList('books', 'python for dummies', "Guy Fieri", 1)
                        
    })

    describe("Fetch all books in a Reading List", () => {
        let response;

        beforeAll(async () => {
            response = await api.get("/api/v1/lists/1/books")
        })

        test("returned as succesful JSON", async () => {
            expect(response.type).toBe("application/json")
            expect(response.status).toBe(200)
        })

        test("JSON has correct data properties", async () => {

            expect(response.body).toHaveProperty("status")
            expect(response.body).toHaveProperty("results")
            expect(response.body).toHaveProperty("data")
            
            expect(response.body["data"]).toHaveProperty("reading_lists")
            expect(response.body["data"]["reading_lists"]).toHaveProperty("id")
            expect(response.body["data"]["reading_lists"]).toHaveProperty("name")
            expect(response.body["data"]["reading_lists"]).toHaveProperty("list_type")
            
            expect(response.body["data"]["reading_lists"]["books"]).toBeType("array")
        })

        
    })
})