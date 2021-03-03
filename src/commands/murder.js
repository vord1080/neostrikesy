const Command = require("../structures/ExtendedCommand");

const { MessagePrompter } = require("@sapphire/discord.js-utilities");

class MurderCommand extends Command {
  constructor(context) {
    super(context, {
      name: "murder",
      usage: "[user to ban] [reason]",
      category: "moderation",
      aliases: ["ban"],
      description: "Bans no matter what, say `yes` to confirm the ban",
      preconditions: ["GuildOnly", "ModeratorOnly", "ModlogChannelExists"],
    });
  }

  async run(message, args) {
    const user = await args.pick("user");
    const { value: reason } = await args.restResult("string");

    const member = await message.guild?.members?.fetch(user);

    if (member?.roles?.highest?.position > message.member.roles.highest.position) return message.channel.send(`Member has a higher role than you.`);

    const handler = new MessagePrompter(
      `You are about to ban ${user.username}(\`${user.id}\`) for ${reason ? `'${reason}'` : "unspecified reasons"}, are you sure? Say \`yes\` to confirm.`,
      "message",
      { timeout: 60 * 1000 }
    );

    const result = await handler.run(message.channel, message.author);

    if (result.content === "yes") {
      message.channel.send("Removing their privilege to life.");

      const { mod_log_channel_id } = this.context.client.db.get(message.guild.id);
      const modlogChannel = message.guild.channels.resolve(mod_log_channel_id);

      await message.guild.members.ban(user);

      return modlogChannel.send(`${user.username}(\`${user.id}\`) did an oopsie woopsie and has been banned${reason ? ` for ${reason}.` : "."} Forever.`);
    } else {
      return message.channel.send(`You did not say 'yes', you said '${result.content}' - they live to see another day.`);
    }
  }
}

module.exports = MurderCommand;
