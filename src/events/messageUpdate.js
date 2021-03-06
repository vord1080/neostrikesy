const { Event, Events } = require("@sapphire/framework");

class MessageUpdateEvent extends Event {
  constructor(context) {
    super(context, { event: Events.MessageUpdateEvent });
  }

  async run(oldMessage, message) {
    if (!message.guild) return;

    const { invite_filter } = this.context.client.db.get(message.guild.id) || {};

    if (invite_filter) {
      const matches = message.content.matchAll(/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gis);

      for (const match of matches) {
        try {
          const invite = await this.context.client.invites.fetch(match[1]);

          if (invite.guild?.id !== message.guild.id) {
            message.delete({ reason: "Invite Filter" });
            break;
          }
        } catch (error) {
          if (error.message !== "Unknown Invite") {
            message.delete();
            console.log(error);
          }
        }
      }
    }
  }
}

module.exports = MessageUpdateEvent;
