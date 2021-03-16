const { SapphireClient } = require("@sapphire/framework");

const { open } = require("lmdb-store");

const InviteManager = require("./InviteManager");
const Moderation = require("./Moderation");
const Database = require("./Database");

class ExtendedClient extends SapphireClient {
  constructor(options) {
    super(options);

    this.invites = new InviteManager(this);

    this.opened = open(this.options.database);

    this.db = new Database(this.opened, this);

    this.mod = new Moderation(this);
  }
}

module.exports = ExtendedClient;
