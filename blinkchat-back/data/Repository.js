import Channel from "../models/channel.js";
import Message from "../models/message.js";

class Repository {
  async getChannels() {
    try {
      // Assuming Channel.find() returns a promise
      const channels = await Channel.find();

      return channels;
    } catch (error) {
      console.error(error);
      // Optionally, you can throw the error here or handle it accordingly.
      throw error;
    }
  }

  getChannelByName(name) {
    return new Channel({
      name: name,
      author: "author",
      users: ["Antoine", "Emeric", "Victor"],
      messages: [],
    });
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

  renameChannel(channelName, newName, author) {
    return new Message({
      text: `[NOT IMPLEMENTED YET] renameChannel: Success message`,
      author: "System",
      date: Date.now(),
      recipient: author,
      commandResult: "success",
    });
  }

  deleteChannel(channelName, author) {
    return new Message({
      text: `[NOT IMPLEMENTED YET] deleteChannel: Success message`,
      author: "System",
      date: Date.now(),
      recipient: author,
      commandResult: "success",
    });
  }

  getMessagesByChannel(channelName) {
    return [
      new Message({
        text: "Short message 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        author: "author1",
        date: Date.now(),
      }),
      new Message({
        text: "Short message 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        author: "author2",
        date: Date.now() - 10000, // now minus 10s
      }),
      new Message({
        text: "Long message: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: "author1",
        date: Date.now() - 20000, // now minus 10s
      }),
    ];
  }
  getChannelByUser(userId) {
    return [
      new Channel({
        name: "la caverne d'alibaba",
        author: "anthon",
        users: ["vicous", "anthon"],
      }),
      new Channel({
        name: "la caverne des 40 voleurs",
        author: "anthon",
        users: ["vicous", "anthon"],
      }),
      new Channel({
        name: "i love les pdf",
        author: "vicous",
        users: ["vicous", "anthon"],
      }),
    ];
  }
}

export default Repository;
