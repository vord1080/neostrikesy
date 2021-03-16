const { Event, Events } = require("@sapphire/framework");

class CommandFailedEvent extends Event {
  constructor(context) {
    super(context, { event: Events.CommandError });
  }

  async run(error, { message }) {
    return message.channel.send(`Something went wrong. The problem: \`${error.message.replaceAll("\n", " ")}\``);
  }
}

module.exports = CommandFailedEvent;
