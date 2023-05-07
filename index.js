const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

require("dotenv/config");
const { MongoClient } = require("mongodb");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const token = process.env.TOKEN;

client.slashCommands = new Map();
client.prefixCommands = new Map();
client.aliases = new Map();

const rest = new REST({ version: "10" }).setToken(token);

// prefix command handler
const prefixCommandsArr = [];
const prefixFolders = fs.readdirSync("./src/commands/prefix");
for (const folder of prefixFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/prefix/${folder}`);

  for (const file of commandFiles) {
    const command = require(`./src/commands/prefix/${folder}/${file}`);
    client.prefixCommands.set(command.name, command);
    prefixCommandsArr.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        client.aliases.set(alias, command.name);
      });
    }
  }
}

// slash command handler
const slashCommandsArr = [];
const slashFolders = fs.readdirSync("./src/commands/slash");
for (const folder of slashFolders) {
  const commandFiles = fs.readdirSync(`./src/commands/slash/${folder}`);

  for (const file of commandFiles) {
    const command = require(`./src/commands/slash/${folder}/${file}`);
    let jsonData;
    try {
      jsonData = JSON.parse(command.data);
    } catch (e) {}
    if (jsonData) {
      slashCommandsArr.push(command.data.toJSON());
    } else {
      slashCommandsArr.push(command.data);
    }
    client.slashCommands.set(command.data.name, command);
  }
}

async function events() {
  const client = await MongoClient.connect(process.env.MONGO);
  console.log("Successfully connected to MongoDB!");
  const database = client.db("CLUSTER_NAME");

  return database;
}

events().then((database) => {
  module.exports = {
    // this is to to be able to include @param in other files
    database,
  };

  // event handler
  fs.readdirSync("./src/handlers").forEach(async (file) => {
    const event = await require(`./src/handlers/${file}`);
    client.on(event.name, (...args) => event.execute(...args, database, slashCommandsArr));
  });
});

// nodejs events
process.on("unhandledRejection", (e) => {
  console.error(e);
});
process.on("uncaughtException", (e) => {
  console.error(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.error(e);
});

client.login(token);

// made by discord user yoru#9267
// open to suggestions on how to improve the code!
