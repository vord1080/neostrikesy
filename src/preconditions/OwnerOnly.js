const { Precondition } = require("@sapphire/framework");

const { bot } = require("../../data/config.json");

class OwnerOnlyPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "OwnerOnly" });
  }

  run(message) {
    if (bot.owners.includes(message.author.id)) return this.ok();
    else return this.error({ identifier: "OwnerOnly", message: "Only an owner of the bot can use this command." });
  }
}

module.exports = OwnerOnlyPrecondition;
