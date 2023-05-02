const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

/**
 * what we do here is make it so `interaction` object can autocomplete
 * @param {ChatInputCommandInteraction} interaction
 */

async function run(interaction) {
  await interaction.deferReply();
  // this is always good practice to include in your code
  // because if it takes a long time for the bot to reply to a message
  // it will time out and cause it to crash.
  // It basically sends a message as soon as you run the command,

  // then using the `editReply()` function we can edit the message to actually what we want the user to see.
  const timeNow = Date.now();
  const response = await interaction.editReply(`Pong! 🏓`);
  const ms = Date.now() - timeNow;
  response.edit(`Pong! 🏓(${ms}ms)`);
}

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("returns the ping of the bot"), // for more information on how to create slash commands, visit https://discordjs.guide/slash-commands/advanced-creation.html
  run: async (client, interaction) => {
    await run(interaction);
  },
};
