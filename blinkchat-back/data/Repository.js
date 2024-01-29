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
        return await Channel.findOne({username: username})
            .then((user) => {
                if (!user) {
                    const errorMessage = new Message({
                        "text": `User ${username} does not exist.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
                return User.deleteOne({username: username})
                    .then(() => {
                        const successMessage = new Message({
                            "text": `User ${username} successfully removed.`,
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "success"
                        })
                        return successMessage
                    })
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
                if (!user) {
                    const errorMessage = new Message({
                        "text": `No user of name ${channel.name}.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
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
        return await Channel.find()
            .then((channels) => {
                console.log(channels)
                return channels
            })
            .catch((error) => {
                console.error(error)
                return []
            })
    }

    async getChannelByName(name) {
        if (!name) {
            const errorMessage = new Message({
                "text": `No channel name provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        return await Channel.findOne({name: name})
            .then((channel) => {
                console.log("yay")
                return channel
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async addChannel(name, author) {
        if (!name || !author) {
            const errorMessage = new Message({
                "text": `No name or author provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        const channel = new Channel({
            "name": name,
            "author": author,
            "users": [author],
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
                            "text": "An error occurred.",
                            "author": "System",
                            "date": Date.now(),
                            "recipient": author,
                            "commandResult": "error"
                        })
                }

            })
    }

    async renameChannel(channelName, newName) {
        if (!channelName || !newName) {
            const errorMessage = new Message({
                "text": `No channelName or newName provided username provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        return await Channel.findOne({name: channelName})
            .then((channel) => {
                if (!channel) {
                    const errorMessage = new Message({
                        "text": `No channel of name ${channelName}.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
                return Channel.updateOne({_id: channel._id}, {name: newName})
                    .then(() => {
                        const successMessage = new Message({
                            "text": `Channel successfully renamed.`,
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "success"
                        })
                        return successMessage
                    })
                    .catch(error => {
                        switch (error.code) {
                            case 11000: // duplicate key error
                                return new Message({
                                    "text": "A channel with this name already exists.",
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
            })
    }

    async deleteChannel(channelName) {
        if (!channelName) {
            const errorMessage = new Message({
                "text": `No channelName provided.`,
                "author": "System",
                "date": Date.now(),
                "commandResult": "error"
            })
            return errorMessage
        }
        return await Channel.findOne({name: channelName})
            .then(async (channel) => {
                if (!channel) {
                    const errorMessage = new Message({
                        "text": `Channel ${channelName} does not exist.`,
                        "author": "System",
                        "date": Date.now(),
                        "commandResult": "error"
                    })
                    return errorMessage
                }
                await Message.deleteMany({channelName: channelName})
                return Channel.deleteOne({name: channelName})
                    .then(() => {
                        const successMessage = new Message({
                            "text": `Channel ${channelName} successfully deleted.`,
                            "author": "System",
                            "date": Date.now(),
                            "commandResult": "success"
                        })
                        return successMessage
                    })
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

