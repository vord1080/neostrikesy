const { Event, Events } = require("@sapphire/framework");

class ErrorEvent extends Event {
  constructor(context) {
    super(context, { event: Events.Error });
  }

  async run(error) {
    return console.log(error);
  }
}

module.exports = ErrorEvent;
