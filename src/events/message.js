const { Event, Events } = require("@sapphire/framework");

class MessageCreateEvent extends Event {
  constructor(context) {
    super(context, { event: Events.MessageCreateEvent });
  }

  async run(message) {
    if (!message.content || !message.guild || !message.deletable) return;

    const { invite_filter } = this.context.client.db.get(message.guild.id) || {};

    if (!invite_filter) return;

    const { success: isMod } = await message.client.stores.get("preconditions").get("ModeratorOnly").run(message);

    if (isMod) return;

    const matches = message.content.matchAll(/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gis);

    for (const match of matches) {
      const invite = await this.context.client.invites.fetch(match[1]).catch((e) => {});

      if (!invite) return;
      if (invite.guild?.id === message.guild.id) return;

      message.delete({ reason: "Invite Filter" });
      break;
    }
  }
}

module.exports = MessageCreateEvent;
