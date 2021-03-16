const Command = require("../structures/ExtendedCommand");

class StrikesCommand extends Command {
  constructor(context) {
    super(context, {
      name: "strikes",
      usage: "[member]",
      category: "information",
      description: "Sends your total # of strikes, or someone elses",
      preconditions: ["GuildOnly"],
    });
  }

  async run(message, args) {
    const { value: user, error: userError } = await args.pickResult("user");

    if (userError?.identifier === "user") return message.channel.send(`No user called '\`${userError.parameter}\`' found.`);

    const cases = Object.values(this.context.client.db.get(message.guild.id).cases || {});
    const strikes = cases.filter((c) => c.user_id === (user || message.author).id && c.type === "strike");

    return message.channel.send(strikes.length);
  }
}

module.exports = StrikesCommand;
