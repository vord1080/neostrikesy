const Command = require("../structures/ExtendedCommand");

// hellish. rewrite later

class ConfigCommand extends Command {
  constructor(context) {
    super(context, {
      name: "config",
      usage: "[config item] [new value]",
      aliases: ["configuration"],
      category: "configuration",
      description: "Sends the current config of the server",
      preconditions: ["GuildOnly", "ManageGuildPermission"],
    });
  }

  async run(message, args) {
    const { value: configItem } = await args.pickResult("config");

    if (configItem) {
      const newValue = await args.rest(configItem.type);

      await this.context.client.db.set(message.guild.id, {
        [configItem.key]: configItem.accessor ? newValue[configItem.accessor] : newValue,
      });
    }

    const config = this.context.client.db.get(message.guild.id) || {};

    const configMessage = [];

    const modRole = message.guild.roles.resolve(config.mod_role_id);
    const jailRole = message.guild.roles.resolve(config.jail_role_id);
    const solitaryRole = message.guild.roles.resolve(config.solitary_role_id);
    const modlogChannel = message.guild.channels.resolve(config.mod_log_channel_id);
    const prefix = this.context.client.fetchPrefix(message);

    if (!config.mod_role_id && !modRole) configMessage.push(`**modrole**: not set`);
    else if (config.mod_role_id && !modRole) configMessage.push(`**modrole**: \`${config.mod_role_id}\` used to exist but does not anymore`);
    else if (config.mod_role_id && modRole) configMessage.push(`**modrole**: \`${modRole.name}\` (${modRole.id})`);

    if (!config.jail_role_id && !jailRole) configMessage.push(`**jailrole**: not set`);
    else if (config.jail_role_id && !jailRole) configMessage.push(`**jailrole**: \`${config.jail_role_id}\` used to exist but does not anymore`);
    else if (config.jail_role_id && jailRole) configMessage.push(`**jailrole**: \`${jailRole.name}\` (${jailRole.id})`);

    if (!config.solitary_role_id && !solitaryRole) configMessage.push(`**solitaryrole**: not set`);
    else if (config.solitary_role_id && !solitaryRole) configMessage.push(`**solitaryrole**: \`${config.solitary_role_id}\` used to exist but does not anymore`);
    else if (config.solitary_role_id && solitaryRole) configMessage.push(`**solitaryrole**: \`${solitaryRole.name}\` (${solitaryRole.id})`);

    if (!config.mod_log_channel_id && !modlogChannel) configMessage.push(`**modlog**: not set`);
    else if (config.mod_log_channel_id && !modlogChannel) configMessage.push(`**modlog**: \`${config.mod_log_channel_id}\` used to exist but does not anymore`);
    else if (config.mod_log_channel_id && modlogChannel) configMessage.push(`**modlog**: \`${modlogChannel.name}\` (${modlogChannel.id})`);

    if (!config.invite_filter) configMessage.push(`**filterinvites**: \`false\``);
    else if (config.invite_filter) configMessage.push(`**filterinvites**: \`true\``);

    configMessage.push(`**prefix**: \`${prefix}\``);

    return message.channel.send(configMessage);
  }
}

module.exports = ConfigCommand;
