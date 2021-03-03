const { Precondition } = require("@sapphire/framework");

class ModeratorOnlyPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ModlogChannelExists" });
  }

  async run(message) {
    const { mod_log_channel_id } = this.context.client.db.get(message.guild.id) || {};

    const channel = message.guild?.channels?.resolve(mod_log_channel_id);

    if (channel) return this.ok();
    else return this.error({ identifier: "ModlogChannelExists", message: "Modlog channel does not exist." });
  }
}

module.exports = ModeratorOnlyPrecondition;
