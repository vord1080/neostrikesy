const Command = require("../structures/ExtendedCommand");

class ReviveCommand extends Command {
  constructor(context) {
    super(context, {
      name: "revive",
      usage: "[user to unban] [reason]",
      quotes: [],
      category: "moderation",
      aliases: ["unban"],
      description: "Unbans a member",
      preconditions: ["GuildOnly", "ModeratorOnly", "ModlogChannelExists"],
    });
  }

  async run(message, args) {
    const user = await args.pick("user");
    const { value: reason } = await args.pickResult("string");

    message.channel.send("Restoring their privilege to life.");

    const { modlog } = this.context.client.db.getGuild(message.guild.id);

    await message.guild.members.unban(user);

    return modlog.send(`${user.username}(\`${user.id}\`) was unbanned${reason ? ` for ${reason}.` : "."}`);
  }
}

module.exports = ReviveCommand;
