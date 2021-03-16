const { Precondition } = require("@sapphire/framework");

class ManageGuildPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ManageGuildPermission" });
  }

  async run(message) {
    if (message.member?.permissions?.has("MANAGE_GUILD")) return this.ok();
    else return this.error({ identifier: "ManageGuildPermission", message: "Only a member with `Manage Server` can use this command." });
  }
}

module.exports = ManageGuildPrecondition;
