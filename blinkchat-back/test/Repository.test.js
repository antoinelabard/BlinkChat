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

describe('test', () => {
    const username = "usertest"
    it("testcase", async () => {
        await repo.login(username)
        const savedUser = await User.findOne({username: username})
        console.log(savedUser)
        expect(savedUser.username).toBe(username)
    })
});
