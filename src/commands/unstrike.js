const Command = require("../structures/ExtendedCommand");

class UnstrikeCommand extends Command {
  constructor(context) {
    super(context, {
      name: "unstrike",
      usage: "[member] [reason]",
      category: "moderation",
      description: "Unstrikes a member.",
      preconditions: ["GuildOnly", "ModeratorOnly"],
    });
  }

  async run(message, args) {
    const member = await args.pick("member");
    const { value: reason } = await args.restResult("string");

    message.channel.send("destriking...");

    return this.context.client.mod.unstrike({ message, user: member.user, reason });
  }
}

module.exports = UnstrikeCommand;
