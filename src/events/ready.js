const { Event, Events } = require("@sapphire/framework");

class ReadyEvent extends Event {
  constructor(context) {
    super(context, { event: Events.Ready });
  }

  run() {
    this.context.client.user.setPresence({
      activity: { name: `@${this.context.client.user.username} help` },
      type: "LISTENING",
    });
    console.log(". . .");
  }
}

module.exports = ReadyEvent;
