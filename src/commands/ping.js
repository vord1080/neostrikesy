const Command = require("../structures/ExtendedCommand");

class PingCommand extends Command {
  constructor(context) {
    super(context, {
      name: "ping",
      description: "Pong!",
    });
  }

  async run(message) {
    const sent = await message.channel.send(["Pong!", message.guild?.emojis?.cache?.random() ?? "_ _"]);

    const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);

    return sent.edit(["Pong!", `${timeDiff}ms`]);
  }
}

module.exports = PingCommand;
