const { Precondition, PreconditionError } = require("@sapphire/framework");

class ManageGuildPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ManageGuildPermission" });
  }

  async run(message) {
    // because message.member is not always available
    const member = await message.guild?.members?.fetch(message.author);

    if (member?.permissions?.has("MANAGE_GUILD")) return this.ok();
    else return this.error({ identifier: "ManageGuildPermission", message: "Only a member with `Manage Server` can use this command." });
  }
}

module.exports = ManageGuildPrecondition;
