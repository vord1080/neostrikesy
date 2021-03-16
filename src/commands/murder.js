const Command = require("../structures/ExtendedCommand");

const { MessagePrompter } = require("@sapphire/discord.js-utilities");

class MurderCommand extends Command {
  constructor(context) {
    super(context, {
      name: "murder",
      usage: "[user to ban] [reason]",
      quotes: [],
      category: "moderation",
      aliases: ["ban"],
      description: "Bans no matter what, say `yes` to confirm the ban",
      preconditions: ["GuildOnly", "ModeratorOnly", "ModlogChannelExists"],
    });
  }

  async run(message, args) {
    const user = await args.pick("user");
    const { value: reason } = await args.pickResult("string");

    const member = await message.guild?.members?.fetch(user).catch((e) => {});

    if (member?.roles?.highest?.position > message.member.roles.highest.position) return message.channel.send(`Member has a higher role than you.`);

    const handler = new MessagePrompter(
      `You are about to ban ${user.username}(\`${user.id}\`) for ${reason ? `'${reason}'` : "unspecified reasons"}, are you sure? Say \`yes\` to confirm.`,
      "message",
      { timeout: 60 * 1000 }
    );

    const result = await handler.run(message.channel, message.author).catch((e) => {
      throw new Error("Collector timed out.");
    });

    if (result.content !== "yes") return message.channel.send(`You did not say 'yes', you said '${result.content}' - they live to see another day.`);

    message.channel.send("Removing their privilege to life.");

    const { modlog } = this.context.client.db.getGuild(message.guild.id);

    await message.guild.members.ban(user);

    return modlog.send(`${user.username}(\`${user.id}\`) did an oopsie woopsie and has been banned${reason ? ` for ${reason}.` : "."} Forever.`);
  }
}

module.exports = MurderCommand;
