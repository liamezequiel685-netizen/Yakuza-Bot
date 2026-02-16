const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banea a un usuario del servidor')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('El usuario a banear')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: '❌ No se pudo encontrar al usuario.',
                ephemeral: true
            });
        }

        try {
            await member.ban();
            await interaction.reply(`✅ ${user.tag} ha sido baneado.`);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ No tengo permisos para banear a este usuario.',
                ephemeral: true
            });
        }
    }
};
