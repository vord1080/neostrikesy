const Command = require("../structures/ExtendedCommand");

class ReloadCommand extends Command {
  constructor(context) {
    super(context, {
      name: "reload",
      aliases: ["r"],
      usage: "[command name or alias]",
      description: "Reloads a command",
      preconditions: ["OwnerOnly"],
    });
  }

  async run(message, args) {
    const command = await args.pickResult("command");

    if (!command.success) {
      return message.channel.send(`Command not found.`);
    }

    try {
      var [reloaded] = await this.context.client.stores.get("commands").load(command.value.path);
    } catch (error) {
      return message.channel.send(`Failed to reload command '${command.value.name}': ${error.message || error.split("\n")[0]}`);
    }

    return message.channel.send(`Reloaded command '${reloaded.name}'.`);
  }
}

module.exports = ReloadCommand;
