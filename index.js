require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Mensaje cuando el bot está listo
client.once("ready", () => {
  console.log("✅ BOT ENCENDIDO COMO:", client.user.tag);
});

// Manejo de errores (muy recomendable)
process.on("unhandledRejection", (error) => {
  console.error("❌ Error no manejado:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Excepción no capturada:", error);
});

// Login usando variable de entorno
client.login(process.env.TOKEN);
