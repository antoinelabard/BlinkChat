import Message from "./message.js";

class MessageBuilder {
    constructor(author) {
        this.message = new Message({author: author})
    }
    setText(text) {
        this.message.text = text
    }
    setCommandSuccess(text) {
        this.message.commandResult = "success"
        this.message.text = text
    }

    setCommandError(text) {
        this.message.commandResult = "error"
        this.message.text = text
    }
    setRecipient(recipient){
        this.message.recipient = recipient
    }
    setChannelName(channelName) {
        this.message.channelName = channelName
    }

    build() {
        console.log(this.message)
        return this.message
    }
}

export default MessageBuilder