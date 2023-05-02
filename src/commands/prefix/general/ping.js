const { Message } = require("discord.js");
/**
 * what we do here is make it so the `message` object can autocomplete
 * @param {Message} message
 */

async function run(message) {
  const timeNow = Date.now();
  const response = await message.channel.send(`Pong! 🏓`);
  const ms = Date.now() - timeNow;
  response.edit(`Pong! 🏓(${ms}ms)`);
}

module.exports = {
  name: "ping",
  aliases: ["pong"],
  cooldown: 5000, // this is in miliseconds, so it would be 5 seconds. (5*1000)
  run: async (client, message, args, prefix) => {
    await run(message);
  },
};
