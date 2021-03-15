const Command = require("../structures/ExtendedCommand");

class ReloadCommand extends Command {
  constructor(context) {
    super(context, {
      name: "reload",
      usage: "[command name or alias]",
      aliases: ["r"],
      description: "Reloads a command",
      preconditions: ["OwnerOnly"],
    });
  }

  async run(message, args) {
    const { value, error } = await args.pickResult("command");

    if (error?.identifier === "argsMissing") return message.channel.send(`No command provided.`);
    if (error?.identifier === "unknownCommand") return message.channel.send(`No command called '\`${error.parameter}\`' found.`);

    try {
      await value.reload();
    } catch (error) {
      return message.channel.send(`Failed to reload command '${value.name}': ${error.message || error.split("\n")[0]}`);
    }

    return message.channel.send(`Reloaded command '${value.name}.'`);
  }
}

module.exports = ReloadCommand;
