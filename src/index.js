const { SapphireClient } = require("@sapphire/framework");

const { open } = require("lmdb-store");

const config = require("../data/config.json");

const client = new SapphireClient({
  intents: config.discord.intents,
  defaultPrefix: config.bot.defaultPrefix,
  disableMentions: "all",
  baseUserDirectory: __dirname,
  logger: { level: "debug" },
});

client.db = open(config.database);

// le shitty hacks have arrived
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

client.db.set = async function (key, value = {}) {
  const current = client.db.get(key) || {};

  return await client.db.put(key, deepMerge(current, value));
};

client.fetchPrefix = (message) => {
  if (message.guild) {
    const entry = client.db.get(message.guild.id);
    if (entry?.command_prefix) return entry.command_prefix;
    else return config.bot.defaultPrefix;
  } else return config.bot.defaultPrefix;
};

client.login(config.discord.token).catch(console.error);
