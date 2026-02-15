const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a banear')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón del baneo'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        await interaction.deferReply();

        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || "Sin razón";

        if (user.id === interaction.user.id) {
            return interaction.editReply("❌ No puedes banearte a ti mismo.");
        }

        try {
            await interaction.guild.members.ban(user.id, { reason });

            await interaction.editReply(`🔨 ${user.tag} fue baneado.\n📄 Razón: ${reason}`);

        } catch (error) {
            console.error("ERROR:", error);
            await interaction.editReply("❌ No pude banear a ese usuario.");
        }
    }
};
