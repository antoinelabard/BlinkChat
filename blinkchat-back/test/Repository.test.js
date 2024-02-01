import User from "../models/user.js";

import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
import Repository from "../data/Repository.js"

let mongo = undefined
const repo = new Repository()

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const url = mongo.getUri();

    await mongoose.connect(url, {
        useNewUrlParser: true,
    });
});

afterEach(async () => {
    if (mongo) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
})

afterAll(async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
});

describe('Repository.login', () => {
    const username = "usertest"
    it("login successful", async () => {
        const response = await repo.login(username)
        const savedUser = await User.findOne({username: username})
        expect(savedUser.username).toBe(username)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_SUCCESS)
    })
    it("login without username should fail with error message", async () => {
        const response = await repo.login()
        const savedUser = await User.findOne({username: username})
        expect(savedUser).toBeNull()
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
    it("login with empty username should fail with error message", async () => {
        const response = await repo.login("")
        const savedUser = await User.findOne({username: username})
        expect(savedUser).toBeNull()
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
});
