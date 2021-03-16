const Command = require("../structures/ExtendedCommand");

const { Util } = require("discord.js");

const { bot } = require("../../data/config.json");

class HelpCommand extends Command {
  constructor(context) {
    super(context, {
      name: "help",
      usage: "[command]",
      aliases: ["commands", "command"],
      description: "Sends this message",
    });
  }

  async run(message, args) {
    const { value, error, success } = await args.pickResult("command");

    if (error?.identifier === "unknownCommand") return message.channel.send(`No command called '${Util.escapeMarkdown(error.parameter)}' found.`);

    if (success)
      return message.channel.send([`${this.context.client.fetchPrefix(message) + [value.name, ...value.aliases].join(",")} ${value.usage}\n`, value.description], {
        code: true,
      });

    const commands = this.context.client.stores.get("commands").array();

    const longest = commands
      .map((cmd) => cmd.name)
      .sort((a, b) => {
        if (a.length > b.length) return -1;
        if (a.length < b.length) return 1;
        return 0;
      })[0].length;

    const categories = {};

    const final = [];

    for (const command of commands.sort()) {
      if (!categories[command.category]) categories[command.category] = [];
      categories[command.category].push(command);
    }

    if (bot.description) final.push(bot.description);
    else final.push(`${this.context.client.user.username} (${this.context.client.user.id})`);

    for (const category in categories) {
      final.push(`\n${category[0].toUpperCase() + category.slice(1)}:`);

      for (const command of categories[category]) {
        final.push(`  ${command.name.padEnd(longest)}    ${command.description || ""}`);
      }
    }

    final.push(`\nType ${this.context.client.fetchPrefix(message)}help command for more info on a command.`);

    return message.channel.send(final, { code: true, split: { char: "\n" } });
  }
}

module.exports = HelpCommand;
