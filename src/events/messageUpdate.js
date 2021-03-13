const { Event, Events } = require("@sapphire/framework");

class MessageUpdateEvent extends Event {
  constructor(context) {
    super(context, { event: Events.MessageUpdateEvent });
  }

  async run(oldMessage, message) {
    if (!message.content || !message.guild || !message.deletable) return;

    const { invite_filter } = this.context.client.db.get(message.guild.id) || {};

    if (!invite_filter) return;

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

module.exports = MessageUpdateEvent;
