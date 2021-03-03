const { Precondition } = require("@sapphire/framework");

class ModeratorOnlyPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ModeratorOnly" });
  }

  async run(message) {
    const { mod_role_id } = this.context.client.db.get(message.guild.id) || {};

    // because message.member is not always available
    const member = await message.guild?.members?.fetch(message.author);

    if (member?.roles?.cache?.has(mod_role_id)) return this.ok();
    else return this.error({ identifier: "ModeratorOnly", message: "Only a moderator can use this command." });
  }
}

module.exports = ModeratorOnlyPrecondition;
