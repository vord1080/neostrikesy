class Moderation {
  constructor(client) {
    this.client = client;
  }

  async deleteCase({ guild, singleCase }) {
    let currentConfig = this.client.db.get(guild.id);

    delete currentConfig.cases[singleCase.id];

    return await this.client.opened.put(guild.id, currentConfig);
  }

  async strike({ message, user, reason }) {
    await this.client.db.set(message.guild.id, {
      cases: {
        [message.id]: {
          type: "strike",
          user_id: user.id,
          id: message.id,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
        },
      },
    });

    const config = this.client.db.getGuild(message.guild.id);

    const member = await message.guild.members.fetch(user);

    const cases = config.cases;

    const keys = Object.keys(cases);

    if (keys.length === 3 || keys.length === 4) {
      await member.roles.add(config.jailrole);
      await this.client.db.set(message.guild.id, {
        cases: {
          [message.id]: {
            type: "jail",
            user_id: user.id,
            id: message.id,
            expires: new Date(Date.now() + (keys.length === 1 ? 1 : 2) * 24 * 60 * 60 * 1000).getTime(),
          },
        },
      });

      if (config.modlog)
        return await config.modlog.send(
          `${user.username}(\`${user.id}\`) was striked by ${message.author.username}(\`${message.author.id}\`) for: ${
            reason ?? "unspecified reasons"
          } but gained too many strikes and is jailed for a day`
        );
    } else if (keys.length === 5) {
      await member.roles.add(config.jailrole);

      if (config.modlog)
        return await config.modlog.send(
          `${user.username}(\`${user.id}\`) was striked by ${message.author.username}(\`${message.author.id}\`) for: ${
            reason ?? "unspecified reasons"
          } but gained too many strikes and is jailed until they write an essay to get out.`
        );
    }

    if (config.modlog)
      await config.modlog.send(`${user.username}(\`${user.id}\`) was striked by ${message.author.username}(\`${message.author.id}\`) for: ${reason ?? "unspecified reasons"}`);
  }

  async unstrike({ message, user, reason }) {
    const config = this.client.db.getGuild(message.guild.id);

    const caseKeys = Object.keys(config.cases);

    if (caseKeys.length === 0) return;

    await this.client.mod.deleteCase({ guild: message.guild, singleCase: config.cases[caseKeys[0]] });

    if (config.modlog)
      await config.modlog.send(
        `${user.username}(\`${user.id}\`) has been unstriked by ${message.author.username}(\`${message.author.id}\`) for: ${reason ?? "unspecified reasons"}`
      );
  }

  async jail({ message, user, reason }) {}
}

module.exports = Moderation;
