require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { 
    Client, 
    Collection, 
    GatewayIntentBits, 
    REST, 
    Routes 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// Cuando el bot está listo
client.once('ready', async () => {
    console.log(`✅ Bot listo como ${client.user.tag}`);

    const commands = [];
    client.commands.forEach(command => {
        commands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('🔄 Registrando comandos del servidor...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands },
        );

        console.log('✅ Comandos del servidor registrados correctamente.');
    } catch (error) {
        console.error(error);
    }
});

// Escuchar slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: '❌ Error ejecutando el comando.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ Error ejecutando el comando.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);
