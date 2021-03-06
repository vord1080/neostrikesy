const { BaseManager, DataResolver, Invite } = require("discord.js");

class InviteManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Invite);
  }

  async fetch(code, cache = true, force = false) {
    if (!force) {
      const resolved = DataResolver.resolveInviteCode(code);
      const existing = this.cache.get(resolved);
      if (existing) return existing;
    }

    const data = await this.client.api.invites(code).get({ query: { with_counts: true } });

    return this.add(data, cache, { id: data.code });
  }
}

module.exports = InviteManager;
