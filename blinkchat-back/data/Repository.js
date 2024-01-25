import Channel from "../models/channel.js";
import Message from "../models/message.js";

class Repository {
  channelsName = [];
  getChannels() {
    Channel.find()
      .then((channels) => {
        this.channelsName = [];
        // console.log(channels);
        for (let i = 0; i < channels.length; i++) {
          //   console.log(channels[i].name);
          this.channelsName.push(channels[i].name);
        }
      })
      .catch((error) => console.error(error));
    return this.channelsName;
  }

  addChannel(name, author) {
    if (!name || !author) {
      console.error("addChannel: One or many empty arguments");
      return;
    }
    const channel = new Channel({
      name: name,
      author: author,
      users: [],
      messages: [],
    });
    channel
      .save()
      .then(() => {
        const successMessage = new Message({
          text: `Channel ${channel.name} successfully created.`,
          author: "System",
          date: Date.now(),
          recipient: author,
          commandResult: "success",
        });
        console.log(successMessage);
        return successMessage;
      })
      .catch((error) => {
        console.error(error.code);
        switch (error.code) {
          case 11000: // duplicate key error
            return new Message({
              text: "A channel with this name already exists.",
              author: "System",
              date: Date.now(),
              recipient: author,
              commandResult: "error",
            });
          default:
            return new Message({
              text: "An error occurred",
              author: "System",
              date: Date.now(),
              recipient: author,
              commandResult: "error",
            });
        }
      });
  }
}

export default Repository;
