const { Precondition } = require("@sapphire/framework");

class ModeratorOnlyPrecondition extends Precondition {
  constructor(context) {
    super(context, { name: "ModeratorOnly" });
  }

  async run(message) {
    const { modrole } = this.context.client.db.getGuild(message.guild.id);

    if (message.member.roles?.cache?.has(modrole.id)) return this.ok();
    else return this.error({ identifier: "ModeratorOnly", message: "Only a moderator can use this command." });
  }
}

module.exports = ModeratorOnlyPrecondition;
