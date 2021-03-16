const Command = require("../structures/ExtendedCommand");

class StrikeCommand extends Command {
  constructor(context) {
    super(context, {
      name: "strike",
      usage: "[member] [reason]",
      category: "moderation",
      description: "Strikes a member.",
      preconditions: ["GuildOnly", "ModeratorOnly"],
    });
  }

  async run(message, args) {
    const member = await args.pick("member");
    const { value: reason } = await args.restResult("string");

    message.channel.send("striking...");

    return this.context.client.mod.strike({ user: member.user, message, reason });
  }
}

module.exports = StrikeCommand;
