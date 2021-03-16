function deepMerge(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === "object") {
      deepMerge((target[key] = target[key] || {}), value);
      return;
    }
    target[key] = value;
  });
  return target;
}

class Database {
  constructor(opened, client) {
    this.opened = opened;
    this.client = client;
  }

  async set(key, value = {}) {
    const current = this.opened.get(key) || {};

    return await this.opened.put(key, deepMerge(current, value));
  }

  get(key) {
    return this.opened.get(key);
  }

  async put(key, value) {
    return await this.opened.put(key, value);
  }

  getRange(opts) {
    return this.opened.getRange(opts);
  }

  getGuild(guildID) {
    const config = this.opened.get(guildID) || {};
    const guild = this.client.guilds.resolve(guildID);

    return {
      modrole: guild.roles.resolve(config.mod_role_id),
      jailrole: guild.roles.resolve(config.jail_role_id),
      solitaryrole: guild.roles.resolve(config.solitary_role_id),
      modlog: guild.channels.resolve(config.mod_log_channel_id),
      filterinvites: Boolean(config.filterinvites),
      cases: config.cases,
      prefix: config.command_prefix,
    };
  }
}

module.exports = Database;
