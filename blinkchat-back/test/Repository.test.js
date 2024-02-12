import User from "../models/user.js";
import Channel from "../models/channel.js";
import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
import Repository from "../data/Repository.js"
import * as mockData from "./mockData.js"

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
    if (!mongo) {
        return
    }
    const collections = mongoose.connection.collections;

    let messagesCollection = collections["messages"]
    await messagesCollection.deleteMany();
    await messagesCollection.insertMany([
        mockData.message1_ByUser1_ToChannel1,
        mockData.message2_ByUser2_ToChannel1
    ])

    let usersCollection = collections["users"]
    await usersCollection.deleteMany();
    await usersCollection.insertMany([
        mockData.user1,
        mockData.user2
    ])

    let channelsCollection = collections["channels"]
    await channelsCollection.deleteMany();
    await channelsCollection.insertMany([
        mockData.channel1,
        mockData.channel2
    ])
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

describe('Repository.getChannels', () => {
    it("get channels successful", async () => {
        const channels = await repo.getChannels()
        const response = [channels[0].name, channels[1].name]
        expect(response).toContain(mockData.channel1.name)
        expect(response).toContain(mockData.channel2.name)
    })
});
describe('Repository.getUserSubscribedChannels', () => {
    it("get users successful", async () => {
        const channels = await repo.getUserSubscribedChannels(mockData.user1.username)
        const response = channels[0].name
        expect(response).toBe(mockData.channel1.name)
        expect(response).not.toBe(mockData.channel2.name)
    })
});

describe('Repository.addChannel', () => {
    const channelName = "channel3"
    it("addChannel successful", async () => {
        const response = await repo.addChannel(channelName, mockData.user1.username)
        const savedChannel = await Channel.findOne({name: channelName})
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_SUCCESS)
    })
    it("addChannel without username should fail with error message", async () => {
        const response = await repo.addChannel(channelName)
        const savedChannel = await Channel.findOne({name: channelName})
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
    it("addChannel with empty parameters should fail with error message", async () => {
        const response = await repo.addChannel()
        const savedChannel = await Channel.findOne({name: channelName})
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
});

describe('Repository.removeUserFromChannel', () => {
    const wrongChannelName = "channel3"
    const wrongUsername = "user3"
    it("removeUserFromChannel successful", async () => {
        const response = await repo.removeUserFromChannel(mockData.channel1.name, mockData.user1.username)
        const savedChannel = await Channel.findOne({name: mockData.channel1.name})
        expect(savedChannel.users).not.toContain(mockData.user1.name)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_SUCCESS)
    })
    it("removeUserFromChannel without username should fail with error message", async () => {
        const response = await repo.removeUserFromChannel(mockData.channel1.name)
        const savedChannel = await Channel.findOne({name: mockData.channel1.name})
        expect(savedChannel.users).toContain(mockData.user1.username)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
    it("removeUserFromChannel with empty parameters should fail with error message", async () => {
        const response = await repo.removeUserFromChannel()
        const savedChannel = await Channel.findOne({name: mockData.channel1.name})
        expect(savedChannel.users).toContain(mockData.user1.username)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
    it("removeUserFromChannel with not existing channel should fail with error message", async () => {
        const response = await repo.removeUserFromChannel(wrongChannelName, mockData.user1.username)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
    it("removeUserFromChannel with not existing user should fail with error message", async () => {
        const response = await repo.removeUserFromChannel(mockData.channel1.name, wrongUsername)
        expect(response.commandResult).toBe(Repository.COMMAND_RESULT_ERROR)
    })
});