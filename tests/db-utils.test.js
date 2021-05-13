const { createTable, dropTable } = require("../db/db-utils");


describe('Database Utils', () => {
    
    describe('createTable', () => {
      it('should create the table in the database', async () => {
        const res = await createTable('test_reading_lists')

        // because we just created the table, no rows should exist
        // the first res is actually the result from the DROP TABLE, so we take the second

        expect(res[1].rowCount).toBe.null
      })
    })

    // describe('insert', () => {
    //     it('should insert an item into the table', async () => {
    //       const res = await insertRestaurant('test_restaurants', 'Pasta Joint', "3800 Perry St", "Denver", "80212", 3, "American")
        
    //       //   [name, street_address, city, zipcode, price_range, food_type])     In this order
    //       expect(res.rowCount).toEqual(1)
    //     })
    // })

    // describe('select', () => {
    //     it('should select items from the table', async () => {
    //       const res = await select('test_restaurants')
    //       expect(res.rows).toStrictEqual([ { id: 1, name: 'Pasta Joint', price_range: 3, street_address: "3800 Perry St", city: "Denver", food_type: "American", zipcode: "80212"} ])
    //     })
    // })

    afterAll(async () => {
        await dropTable('test_reading_lists')
    })
})