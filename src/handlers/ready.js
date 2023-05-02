const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

module.exports = {
  name: "ready",
  execute: async (client, _, slashCommandsArr) => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), { body: slashCommandsArr });
      console.log(`Logged in as ${client.user.tag}`);
    } catch (error) {
      console.error(error);
    }
  },
};
