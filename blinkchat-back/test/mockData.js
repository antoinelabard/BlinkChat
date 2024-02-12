import Channel from "../models/channel.js";
import User from "../models/user.js"
import Message from "../models/message.js";

// test database population
export const user1 = User({username: "user1"})
export const user2 = User({username: "user2"})
export const channel1 = Channel({name: "channel1", author: "user1", users: ["user1"]})
export const channel2 = Channel({name: "channel2", author: "user2", users: ["user2"]})
export const message1_ByUser1_ToChannel1 = Message({text: "message1_ByUser1_ToChannel1", author: "user1", date: Date.now(), channelName: "channel1"})
export const message2_ByUser2_ToChannel1 = Message({text: "message2_ByUser2_ToChannel1", author: "user2", date: Date.now(), channelName: "channel1"})
