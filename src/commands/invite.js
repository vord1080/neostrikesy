const Command = require("../structures/ExtendedCommand");

class InviteCommand extends Command {
  constructor(context) {
    super(context, {
      name: "invite",
      aliases: ["addbot", "add"],
      description: "Add this bot to your server",
    });
  }

  async run(message, args) {
    const { botPublic, id } = await this.context.client.fetchApplication();

    if (botPublic)
      return await message.channel.send([
        `Add ${this.context.client.user.username} to your server:`,
        `<https://discord.com/oauth2/authorize?scope=applications.commands+bot&client_id=${id}>`,
      ]);
    else return await message.channel.send(`${this.context.client.user.username} is a private bot. Only the owner can add it to other servers.`);
  }
}

module.exports = InviteCommand;
