const Command = require("../structures/ExtendedCommand");

const { version: djsVersion } = require("discord.js");
const { version: sapphireVersion } = require("@sapphire/framework/package.json");

class StatsCommand extends Command {
  constructor(context) {
    super(context, {
      name: "stats",
      aliases: ["statistics", "info", "about"],
      category: "information",
      description: "Sends statistics for the bot",
    });
  }

  async run(message) {
    return message.channel.send([
      `**Cached Guilds**: ${this.context.client.guilds.cache.size}`,
      `**Cached Channels**: ${this.context.client.channels.cache.size}`,
      `**Cached Users**: ${this.context.client.users.cache.size}`,
      `**Cached Emojis**: ${this.context.client.emojis.cache.size}`,
      "",
      `**Time since last \`READY\` event**: ${this.context.client.uptime}ms`,
      "",
      `**Memory Usage**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      `**Sapphire**: v${sapphireVersion}`,
      `**Discord.js**: v${djsVersion}`,
    ]);
  }
}

module.exports = StatsCommand;
