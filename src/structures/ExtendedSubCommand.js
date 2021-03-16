const { SubCommandPluginCommand } = require("@sapphire/plugin-subcommands");

class ExtendedSubCommand extends SubCommandPluginCommand {
  constructor(context, options) {
    super(context, options);

    this.category = options.category ?? "default";

    this.usage = options.usage ?? "";
  }
}

module.exports = ExtendedSubCommand;
