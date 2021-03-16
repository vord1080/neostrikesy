const Command = require("../structures/ExtendedCommand");

const { MessagePrompter } = require("@sapphire/discord.js-utilities");

class JailCommand extends Command {
  constructor(context) {
    super(context, {
      name: "jail",
      usage: "[user to jail] [reason]",
      category: "moderation",
      aliases: ["mute"],
      description: "Jails the member given for the duration given",
      preconditions: ["GuildOnly", "ModeratorOnly", "ModlogChannelExists"],
    });
  }

  async run(message, args) {
    const member = await args.pick("member");
    const { value: reason } = await args.restResult("string");

    if (member.roles.highest.position > message.member.roles.highest.position) return message.channel.send(`Member has a higher role than you.`);

    message.channel.send("Removing their privilege to life.");

    const { mod_log_channel_id } = this.context.client.db.get(message.guild.id);
    const modlogChannel = message.guild.channels.resolve(mod_log_channel_id);

    await this.context.client.mod.jail();

    return modlogChannel.send(`${user.username}(\`${user.id}\`) was jailed by sex dick for: ${reason || ""}`);
  }
}

module.exports = JailCommand;
