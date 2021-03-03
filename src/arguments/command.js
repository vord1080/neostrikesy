const { Argument, UserError } = require("@sapphire/framework");

class CommandArgument extends Argument {
  constructor(context) {
    super(context, { name: "command" });
  }

  async run(argument) {
    const command = this.context.stores.get("commands").get(argument);

    if (command) return this.ok(command);
    else return this.error(new UserError({ identifier: "ArgumentCommandUnknownCommand", message: "The argument did not resolve to a command.", context: argument }));
  }
}

module.exports = CommandArgument;
