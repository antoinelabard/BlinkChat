import Channel from "../models/channel.js"
import Message from "../models/message.js"
import User from "../models/user.js"

class Repository {

    async login(username) {
        if (!username) {
            const errorMessage = new Message({
                "text": `No username provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        const user = new User({
            "username": username
        })
        return await user.save()
            .then(() => {
                const successMessage = new Message({
                    "text": `User ${user.username} successfully created.`,
                    "author": "System",
                    "date": Date.now(),
                    "commandResult": "success"
                })
                console.log(successMessage)
                return successMessage
            })
            .catch(error => {
                switch (error.code) {
                    case 11000: // duplicate key error
                        return new Message({
                            "text": "A user with this name already exists.",
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "error"
                        })
                    default:
                        return new Message({
                            "text": "An error occurred.",
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "error"
                        })
                }

            })
    }

    async logout(username) {
        if (!username) {
            const errorMessage = new Message({
                "text": `No username provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        return await User.deleteOne({username: username})
            .then(() => {
                const successMessage = new Message({
                    "text": `User ${username} successfully removed.`,
                    "author": "System",
                    "date": Date.now(),
                    "commandResult": "success"
                })
                return successMessage
            })
    }

    async renameUser(oldUsername, newUsername) {
        if (!oldUsername || !newUsername) {
            const errorMessage = new Message({
                "text": `No new or old username provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        User.findOne({username: oldUsername})
            .then((user) => {
                console.log(user)
                return User.updateOne({_id: user._id}, {username: newUsername})
                    .then(() => {
                        const successMessage = new Message({
                            "text": `User successfully renamed.`,
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "success"
                        })
                        return successMessage
                    })
            })
    }

    async getChannels() {
        await Channel.find()
            .then((channels) => {
                console.log(channels)
                return channels
            })
            .catch((error) => console.error(error))
    }

    async getChannelByName(name) {
        return new Channel({
            "name": name,
            "author": "author",
            "users": ["Antoine", "Emeric", "Victor"],
            "messages": []
        })
    }

    async addChannel(name, author) {
        if (!name || !author) {
            console.error("addChannel: One or many empty arguments")
            return
        }
        const channel = new Channel({
            "name": name,
            "author": author,
            "users": [],
        })
        await channel.save()
            .then(() => {
                const successMessage = new Message({
                    "text": `Channel ${channel.name} successfully created.`,
                    "author": "System",
                    "date": Date.now(),
                    "recipient": author,
                    "commandResult": "success"
                })
                console.log(successMessage)
                return successMessage
            })
            .catch(error => {
                console.error(error.code)
                switch (error.code) {
                    case 11000: // duplicate key error
                        return new Message({
                            "text": "A channel with this name already exists.",
                            "author": "System",
                            "date": Date.now(),
                            "recipient": author,
                            "commandResult": "error"
                        })
                    default:
                        return new Message({
                            "text": "An error occurred",
                            "author": "System",
                            "date": Date.now(),
                            "recipient": author,
                            "commandResult": "error"
                        })
                }

            })
    }

    async renameChannel(channelName, newName, author) {
        return new Message({
            "text": `[NOT IMPLEMENTED YET] renameChannel: Success message`,
            "author": "System",
            "date": Date.now(),
            "recipient": author,
            "commandResult": "success"
        })
    }

    async deleteChannel(channelName, author) {
        return new Message({
            "text": `[NOT IMPLEMENTED YET] deleteChannel: Success message`,
            "author": "System",
            "date": Date.now(),
            "recipient": author,
            "commandResult": "success"
        })
    }

    async getMessagesByChannel(channelName) {
        return await Channel.findOne({channelName: channelName})
            .then((channel) => {
                if (!channel) {
                    const errorMessage = new Message({
                        "text": `Channel ${channelName} does not exist.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
                return Message.find({channelName: channelName})
                    .then((channels) => {
                        console.log(channels)
                        return channels
                    })
                    .catch((error) => {
                        console.error(error)
                        return new Message({
                            "text": "An error occurred.",
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "error"
                        })
                    })
            })
    }

    async addMessage(author, text, channelName, recipient) {
        return await Channel.findOne({name: channelName})
            .then((channel) => {
                if (!channel) {
                    const errorMessage = new Message({
                        "text": `Channel ${channelName} does not exist.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
                let message = Message({
                    author: author,
                    text: text,
                    date: Date.now(),
                    channelName: channelName,
                    recipient: recipient
                })
                message.save()
                    .catch((error) => console.log(error))
            })
    }
}


export default Repository

