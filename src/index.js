const ExtendedClient = require("./structures/ExtendedClient");

const config = require("../data/config.json");

const client = new ExtendedClient({
  logger: { level: "debug" },
  intents: config.discord.intents,
  database: config.database,
  defaultPrefix: config.bot.defaultPrefix,
  disableMentions: "all",
  baseUserDirectory: __dirname,
});

// murder the invite cache every 48 hours
// client.setInterval(() => {
//   client.invites.cache.clear();
// }, 1.728e8);

client.fetchPrefix = (message) => {
  if (!message.guild) return config.bot.defaultPrefix;

  const { prefix } = client.db.getGuild(message.guild.id);

  return prefix ?? config.bot.defaultPrefix;
};

client.login(config.discord.token).catch(console.error);
