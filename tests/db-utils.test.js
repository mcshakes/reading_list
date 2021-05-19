const { 
        createTableList, 
        insertReadingList, 
        selectReadingList, 
        dropTable,
        createTableBooks,
        insertBookInReadingList
      } = require("../db/db-utils");


describe('Database Utils', () => {

    describe("List Creation and Manipulation", () => {
      describe('createTable for Reading Lists', () => {
        it('should create the table in the database', async () => {
          const res = await createTableList('test_reading_lists')
  
          // because we just created the table, no rows should exist
          // the first res is actually the result from the DROP TABLE, so we take the second
  
          expect(res[1].rowCount).toBe.null
        })
      })
  
      describe('insertReadingList', () => {
          it('should insert a Reading List into the table', async () => {
            const res = await insertReadingList('test_reading_lists', 'Pasta Books', "Food Blog")
          
            expect(res.rowCount).toEqual(1)
          })
      })
  
      describe('selectReadingList', () => {
          it('should select items from the table', async () => {
            const res = await selectReadingList('test_reading_lists')
            expect(res.rows).toStrictEqual([ { id: 1, name: 'Pasta Books', list_type: "Food Blog"} ])
          })
      })
    })

    describe("Books Creation and manipulation", () => {

        beforeAll(async() => {
          await createTableList("test_reading_lists")
        })

        it('should create the table in the database', async () => {
          const res = await createTableBooks("test_books", "test_reading_lists")
          expect(res[1].rowCount).toBe.null
        })

        it('should insert a book into the Reading List', async () => {
          const list = await insertReadingList("test_reading_lists", "programming books", "self IMPROVEMENT")
          await insertBookInReadingList('test_books', 'python for dummies', "Guy Fieri", 1)
          

          expect(list.rowCount).toEqual(1)
          expect(list.rows).toStrictEqual([ { id: 1, name: 'programming books', list_type: 'self IMPROVEMENT' } ])
        })

    })

    afterAll(async done => {
        await dropTable('test_reading_lists')
        done();
    })
})