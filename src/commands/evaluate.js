const Command = require("../structures/ExtendedCommand");

const { inspect } = require("util");
const { discord } = require("../../data/config.json");

// Ported poorly from akairo, rewrite later tbh.

class EvalCommand extends Command {
  constructor(context) {
    super(context, {
      name: "eval",
      usage: "[code]",
      aliases: ["evaluate", "exec", "e"],
      description: "Evaluates a string",
      preconditions: ["OwnerOnly"],
    });
  }

  async run(message, args) {
    const code = this.lexer.input;

    if (!code) {
      return message.channel.send("No code provided!");
    }

    const evaled = {};
    const logs = [];
    const token = discord.token.split("").join("[^]{0,2}");
    const rev = discord.token.split("").reverse().join("[^]{0,2}");
    const tokenRegex = new RegExp(`${token}|${rev}`, "g");
    const cb = "```";
    const print = (...a) => {
      // eslint-disable-line no-unused-vars
      const cleaned = a.map((obj) => {
        if (typeof o !== "string") obj = inspect(obj, { depth: 1 });
        return obj.replace(tokenRegex, "[TOKEN]");
      });

      if (!evaled.output) {
        logs.push(...cleaned);
        return;
      }

      evaled.output += evaled.output.endsWith("\n") ? cleaned.join(" ") : `\n${cleaned.join(" ")}`;
      const title = evaled.errored ? "☠\u2000**Error**" : "📤\u2000**Output**";
      if (evaled.output.length + code.length > 1900) {
        evaled.output = "Output too long.";
      }

      evaled.message.edit([`📥\u2000**Input**${cb}js`, code, cb, `${title}${cb}js`, evaled.output, cb]);
    };

    try {
      // eslint-disable-next-line no-eval
      let output = eval(code);

      // eslint-disable-next-line eqeqeq
      if (output != null && typeof output.then === "function") {
        output = await output;
      }

      if (typeof output !== "string") {
        output = inspect(output, { depth: 0 });
      }

      output = `${logs.join("\n")}\n${logs.length && output === "undefined" ? "" : output}`;
      output = output.replace(tokenRegex, "[TOKEN]");
      if (output.length + code.length > 1900) {
        output = "Output too long.";
      }

      const sent = await message.channel.send([`📥\u2000**Input**${cb}js`, code, cb, `📤\u2000**Output**${cb}js`, output, cb]);

      evaled.message = sent;
      evaled.errored = false;
      evaled.output = output;
      return sent;
    } catch (err) {
      let error = err;
      error = error.toString();
      error = `${logs.join("\n")}\n${logs.length && error === "undefined" ? "" : error}`;
      error = error.replace(tokenRegex, "[TOKEN]");
      const sent = await message.channel.send([`📥\u2000**Input**${cb}js`, code, cb, `☠\u2000**Error**${cb}js`, error, cb]);

      evaled.message = sent;
      evaled.errored = true;
      evaled.output = error;
      return sent;
    }
  }
}

module.exports = EvalCommand;
