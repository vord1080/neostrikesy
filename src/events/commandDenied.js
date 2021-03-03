const { Event, Events } = require("@sapphire/framework");

class CommandDeniedEvent extends Event {
  constructor(context) {
    super(context, { event: Events.CommandDenied });
  }

  async run(error, { message }) {
    return await message.channel.send(error.message);
  }
}

module.exports = CommandDeniedEvent;
