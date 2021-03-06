const Command = require("../structures/ExtendedCommand");

class PrefixCommand extends Command {
  constructor(context) {
    super(context, {
      name: "prefix",
      category: "information",
      description: "Sends the current prefix",
    });
  }

  async run(message) {
    return message.channel.send(`My prefix here is '\`${this.context.client.fetchPrefix(message)}\`'`);
  }
}

module.exports = PrefixCommand;
