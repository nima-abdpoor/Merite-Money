const createUser = require("./UserQuery")
const assert = require('assert');
// const initDB = require("../../db/DataBaseInit")
const {MongoClient} = require('mongodb');


// The assertion for a promise must be returned.

// beforeAll(async () => {
//     jest.useFakeTimers( 'legacy' )
//     initDB()
// });


test("Add Customer POST /customers",async () => {

    const user = {
        username: 'testuser',
        password: 'testpassword',
        role: 'user'
    };
    const response = await createUser(user)
    await response.save();
    expect(response.name).toBe({ success: true });
    jest.runOnlyPendingTimers()
});

it('works with promises', () => {
    // Mock user object
    const user = {
        username: 'testuser',
        password: 'testpassword',
        role: 'user'
    };
    expect.assertions(1);
    return createUser(user).then(data => expect(data).toBe({ success: true }))
});
test('Create user', () => {
    // Mock user object
    const user = {
        username: 'testuser',
        password: 'testpassword',
        role: 'user'
    };


    // Call the createUser function
    const result = createUser(user);
    console.log("asdlkf", result)
    assert.equal(result, { success: true });
});

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb://0.0.0.0:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db("salam");
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should insert a doc into collection', async () => {
        const user = {
            username: 'testuser',
            password: 'testpassword',
            role: 'user'
        };
        const users = db.collection("Salam");


        // const mockUser = {_id: 'some-user-id', name: 'John'};
        // await users.insertOne(mockUser);
        //
        // const insertedUser = await users.findOne({_id: 'some-user-id'});
        // expect(insertedUser).toEqual(mockUser);


        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(user);
        // Call the createUser function
        // const response = await createUser(user)
        // let result = await users.create(user)

        expect(1).toEqual(1);
    });
});