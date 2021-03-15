const { Argument } = require("@sapphire/framework");

class CommandArgument extends Argument {
  constructor(context) {
    super(context, { name: "command" });
  }

  async run(parameter, context) {
    const command = this.context.stores.get("commands").get(parameter);

    if (command) return this.ok(command);
    else return this.error({ parameter, identifier: "unknownCommand", message: "The argument did not resolve to a command.", context });
  }
}

module.exports = CommandArgument;
