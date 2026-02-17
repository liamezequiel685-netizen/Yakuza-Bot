require('dotenv').config();

const { 
    Client, 
    GatewayIntentBits, 
    PermissionsBitField 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const prefix = "*";

// Base de datos simple (se reinicia si el bot se apaga)
const data = {
    honor: {},
    warns: {}
};

client.once('ready', () => {
    console.log(`✅ Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // =========================
    // PROMOTE
    // =========================
    if (command === "promote") {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("❌ No tienes permiso para usar este comando.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Uso: *promote @usuario NombreDelRol");

        const roleName = args.slice(1).join(" ");
        const role = message.guild.roles.cache.find(r => r.name === roleName);

        if (!role) return message.reply("❌ Rol no encontrado.");

        try {
            await member.roles.add(role);
            message.channel.send(`⬆️ ${member.user.tag} ahora es ${role.name}`);
        } catch (err) {
            message.reply("❌ No puedo asignar ese rol.");
        }
    }

    // =========================
    // APORTE
    // =========================
    if (command === "aporte") {

        const member = message.mentions.members.first();
        const cantidad = parseInt(args[1]);

        if (!member || isNaN(cantidad)) {
            return message.reply("Uso: *aporte @usuario cantidad");
        }

        message.channel.send(`💰 ${member.user.tag} aportó ${cantidad}.`);
    }

    // =========================
    // KICK
    // =========================
    if (command === "kick") {

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply("❌ No tienes permiso.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Uso: *kick @usuario");

        try {
            await member.kick();
            message.channel.send(`👢 ${member.user.tag} fue expulsado.`);
        } catch {
            message.reply("❌ No puedo expulsar a ese usuario.");
        }
    }

    // =========================
    // BAN
    // =========================
    if (command === "ban") {

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ No tienes permiso.");
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply("Uso: *ban @usuario");

        try {
            await member.ban();
            message.channel.send(`🔨 ${member.user.tag} fue baneado.`);
        } catch {
            message.reply("❌ No puedo banear a ese usuario.");
        }
    }

    // =========================
    // WARN
    // =========================
    if (command === "warn") {

        const member = message.mentions.members.first();
        if (!member) return message.reply("Uso: *warn @usuario");

        if (!data.warns[member.id]) data.warns[member.id] = 0;
        data.warns[member.id]++;

        message.channel.send(`⚠️ ${member.user.tag} ahora tiene ${data.warns[member.id]} warns.`);
    }

    // =========================
    // AÑADIR HONOR
    // =========================
    if (command === "añadirhonor") {

        const member = message.mentions.members.first();
        const cantidad = parseInt(args[1]);

        if (!member || isNaN(cantidad)) {
            return message.reply("Uso: *añadirhonor @usuario cantidad");
        }

        if (!data.honor[member.id]) data.honor[member.id] = 0;
        data.honor[member.id] += cantidad;

        message.channel.send(`🏆 ${member.user.tag} ahora tiene ${data.honor[member.id]} puntos de honor.`);
    }

    // =========================
    // QUITAR HONOR
    // =========================
    if (command === "quitarhonor") {

        const member = message.mentions.members.first();
        const cantidad = parseInt(args[1]);

        if (!member || isNaN(cantidad)) {
            return message.reply("Uso: *quitarhonor @usuario cantidad");
        }

        if (!data.honor[member.id]) data.honor[member.id] = 0;
        data.honor[member.id] -= cantidad;

        message.channel.send(`📉 ${member.user.tag} ahora tiene ${data.honor[member.id]} puntos de honor.`);
    }

    // =========================
    // EXPEDIENTE
    // =========================
    if (command === "expediente") {

        const member = message.mentions.members.first();
        if (!member) return message.reply("Uso: *expediente @usuario");

        const honor = data.honor[member.id] || 0;
        const warns = data.warns[member.id] || 0;

        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r.name)
            .join(", ");

        message.channel.send(`
📁 EXPEDIENTE DE ${member.user.tag}

Rango actual: ${roles || "Sin rango"}
Puntos de Honor: ${honor}
Warns: ${warns}
        `);
    }

    // =========================
    // DECLARAR GUERRA
    // =========================
    if (command === "declararguerra") {

        const clan = args[0];
        const dia = args[1];
        const hora = args[2];

        if (!clan || !dia || !hora) {
            return message.reply("Uso: *declararguerra Clan 20/03 21:00");
        }

        message.channel.send(`
🔥 NUEVA GUERRA 🔥

Clan Rival: ${clan}
Día: ${dia}
Hora: ${hora}

@GUERREROS
        `);
    }

});

client.login(process.env.TOKEN);
