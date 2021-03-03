const { Command } = require("@sapphire/framework");

class ExtendedCommand extends Command {
  constructor(context, options) {
    super(context, options);

    this.category = options.category ?? "default";

    this.usage = options.usage ?? "";
  }
}

module.exports = ExtendedCommand;
