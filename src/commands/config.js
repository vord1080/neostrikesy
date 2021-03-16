const Command = require("../structures/ExtendedSubCommand.js");

const { Util } = require("discord.js");

class ConfigCommand extends Command {
  constructor(context) {
    super(context, {
      name: "config",
      usage: "[config item] [new value]",
      aliases: ["configuration"],
      category: "configuration",
      description: "Sends the current config of the server",
      subCommands: ["modrole", "jailrole", "solitaryrole", "modlog", "filterinvites", "prefix", { input: "show", default: true }],
      preconditions: ["GuildOnly", "ManageGuildPermission"],
    });
  }

  async modrole(message, args) {
    const { value, error } = await args.pickResult("role");

    if (error?.identifier === "argsMissing") return message.channel.send(`No role provided.`);
    if (error?.identifier === "role") return message.channel.send(`No role called '${Util.escapeMarkdown(error.parameter)}' found.`);

    await this.context.client.db.set(message.guild.id, {
      mod_role_id: value.id,
    });

    return message.channel.send(`Set Moderator role to **${value.name}**`);
  }

  async jailrole(message, args) {
    const { value, error } = await args.pickResult("role");

    if (error?.identifier === "argsMissing") return message.channel.send(`No role provided.`);
    if (error?.identifier === "role") return message.channel.send(`No role called '${Util.escapeMarkdown(error.parameter)}' found.`);

    await this.context.client.db.set(message.guild.id, {
      jail_role_id: value.id,
    });

    return message.channel.send(`Set Jail role to **${value.name}**`);
  }

  async solitaryrole(message, args) {
    const { value, error } = await args.pickResult("role");

    if (error?.identifier === "argsMissing") return message.channel.send(`No role provided.`);
    if (error?.identifier === "role") return message.channel.send(`No role called '${Util.escapeMarkdown(error.parameter)}' found.`);

    await this.context.client.db.set(message.guild.id, {
      solitary_role_id: value.id,
    });

    return message.channel.send(`Set Solitary role to **${value.name}**`);
  }

  async modlog(message, args) {
    const { value, error } = await args.pickResult("textChannel");

    if (error?.identifier === "argsMissing") return message.channel.send(`No channel provided.`);
    if (error?.identifier === "channel") return message.channel.send(`No channel called '${Util.escapeMarkdown(error.parameter)}' found.`);

    await this.context.client.db.set(message.guild.id, {
      mod_log_channel_id: value.id,
    });

    return message.channel.send(`Set Moderation Log channel to **${value.name}**`);
  }

  async prefix(message, args) {
    const { value, error } = await args.pickResult("string");

    if (error?.identifier === "argsMissing") return message.channel.send(`No prefix provided.`);

    await this.context.client.db.set(message.guild.id, {
      command_prefix: value,
    });

    return message.channel.send(`Set Command Prefix to **${Util.escapeMarkdown(value)}**`);
  }

  async filterinvites(message, args) {
    const { value, error } = await args.pickResult("boolean");

    if (error?.identifier === "argsMissing") return message.channel.send(`No boolean provided.`);
    if (error?.identifier === "boolean") return message.channel.send(`'${Util.escapeMarkdown(error.parameter)}' did not resolve to a boolean.`);

    await this.context.client.db.set(message.guild.id, {
      invite_filter: value,
    });

    return message.channel.send(`**${value ? "Enabled" : "Disabled"}** Invite Filtering`);
  }

  async show(message) {
    const config = this.context.client.db.getGuild(message.guild.id);

    const configMessage = [];

    if (!config.modrole) configMessage.push(`**modrole**: not set`);
    else configMessage.push(`**modrole**: \`${config.modrole.name}\` (${config.modrole.id})`);

    if (!config.jailrole) configMessage.push(`**jailrole**: not set`);
    else configMessage.push(`**jailrole**: \`${config.jailrole.name}\` (${config.jailrole.id})`);

    if (!config.solitaryrole) configMessage.push(`**solitaryrole**: not set`);
    else configMessage.push(`**solitaryrole**: \`${config.solitaryrole.name}\` (${config.solitaryrole.id})`);

    if (!config.modlog) configMessage.push(`**modlog**: not set`);
    else configMessage.push(`**modlog**: \`${config.modlog.name}\` (${config.modlog.id})`);

    configMessage.push(`**filterinvites**: \`${config.filterinvites}\``);

    configMessage.push(`**prefix**: \`${this.context.client.fetchPrefix(message)}\``);

    return message.channel.send(configMessage);
  }
}

module.exports = ConfigCommand;
