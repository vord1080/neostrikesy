const { Argument } = require("@sapphire/framework");

class CommandArgument extends Argument {
  constructor(context) {
    super(context, { name: "config" });
  }

  run(argument) {
    const items = {
      modrole: { key: "mod_role_id", type: "role" },
      jailrole: { key: "jail_role_id", type: "role" },
      solitaryrole: { key: "solitary_role_id", type: "role" },
      modlog: { key: "mod_log_channel_id", type: "textChannel" },
      prefix: { key: "command_prefix", type: "string" },
    };
    const config = items[argument];

    return config ? this.ok(config) : this.error(argument, "ArgumentConfigUnknownConfig", "The argument did not resolve to a configuration item.");
  }
}

module.exports = CommandArgument;
