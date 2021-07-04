const Discord = require('discord.js')

module.exports = {
  name: "panel",
  description: "ticket panel",
  run: async (message, args, bot) => {
   let channel = message.mentions.channels.first();
        if(!channel) return message.reply("How to use: `b!panel #channel`");

        let sent = await channel.send(new Discord.MessageEmbed() // Embed that will be sent after setup
            .setTitle("Ticket System")
            .setDescription("React with 🎫 to open a ticket!")
            .setFooter("BListings© Ticket System")
            .setColor("GREEN")
        );

        sent.react('🎫');

        message.channel.send("Complete ticket system setup!")
  }
}
