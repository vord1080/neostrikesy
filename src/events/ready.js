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

    this.context.client.zenzi = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

      try {
        for (let { key, value } of this.context.client.db.getRange({ start: 0 })) {
          const guild = await this.context.client.guilds.fetch(key);

          if (guild) {
            const cases = Object.values(value.cases ?? {});

            const { modlog } = this.context.client.db.getGuild(guild.id);

            for (const singleCase of cases) {
              if (Date.now() > singleCase.expires) {
                if (singleCase.type === "strike") {
                  const user = await this.context.client.users.fetch(singleCase.user_id);
                  await this.context.client.mod.deleteCase({ guild, singleCase });

                  await modlog.send(`${user.username}(\`${user.id}\`) has lost a strike due to strike decay!`);
                } else if (singleCase.type === "jail") {
                  // const user = await this.context.client.users.fetch(singleCase.user_id);
                  // const member = await guild.members.fetch(singleCase.user_id);
                  // await member.roles.remove(jail_role_id);
                  // await modlogChannel.send(`${user.username}(\`${user.id}\`) is unjailed!`);
                  // await this.context.client.mod.deleteCase({ guild, singleCase });
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }

      await this.context.client.zenzi();
    };

    this.context.client.zenzi();

    console.log(". . .");
  }
}

module.exports = ReadyEvent;
