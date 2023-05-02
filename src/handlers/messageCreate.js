const ms = require("ms");
const cooldown = new Map();

module.exports = {
  name: "messageCreate",
  execute: async (message, db) => {
    const client = message.client;
    if (message.author.bot) return;
    if (message.channel.tpe === "dm") return;
    let prefix = process.env.PREFIX; // change this in .env file

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    let command = client.prefixCommands.get(cmd);
    if (!command) command = client.prefixCommands.get(client.aliases.get(cmd));
    if (!command) return;

    if (!command.cooldown) {
      command.run(client, message, args, prefix, db);
      return;
    }
    if (cooldown.has(`${command.name}${message.author.id}`)) {
      const msg = await message.reply(`Try again in \`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\``);
      setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now());
      return;
    }

    command.run(client, message, args, prefix, db);
    cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
    setTimeout(() => {
      cooldown.delete(`${command.name}${message.author.id}`);
    }, command.cooldown);
  },
};
