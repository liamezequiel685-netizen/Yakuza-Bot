const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once("clientReady", () => {
    console.log(`✅ BOT ENCENDIDO COMO: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ban") {

        await interaction.deferReply();

        const user = interaction.options.getUser("usuario");
        const reason = interaction.options.getString("razon") || "Sin razón especificada";

        const member = interaction.guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.editReply("❌ No tienes permisos para banear.");
        }

        if (!member) {
            return interaction.editReply("❌ No encontré a ese usuario en el servidor.");
        }

        try {
            await member.ban({ reason: reason });
            await interaction.editReply(`✅ ${user.tag} fue baneado.\n📌 Razón: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ No pude banear a ese usuario.");
        }
    }
});

client.login(process.env.TOKEN);
