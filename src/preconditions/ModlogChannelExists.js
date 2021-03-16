const { Precondition } = require("@sapphire/framework");

class ModeratorOnlyPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ModlogChannelExists" });
  }

  async run(message) {
    const { modlog } = this.context.client.db.getGuild(message.guild.id);

    if (modlog) return this.ok();
    else return this.error({ identifier: "ModlogChannelExists", message: "Modlog channel does not exist." });
  }
}

module.exports = ModeratorOnlyPrecondition;
