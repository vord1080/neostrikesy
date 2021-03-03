const Command = require("../structures/ExtendedCommand");

class SecretCommand extends Command {
  constructor(context) {
    super(context, {
      name: "secret",
      aliases: ["mod-nsfw"],
      description: "sshh",
      preconditions: ["NSFW"],
    });
  }

  async run(message) {
    return message.channel.send("https://cdn.discordapp.com/emojis/795134910352064513.png");
  }
}

module.exports = SecretCommand;
