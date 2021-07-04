const Discord = require('discord.js')

module.exports = {
  name: "close",
  description: "close ticket",
  run: async (message, args, bot) => {
if(!message.channel.name.includes("ticket-")) return message.channel.send("You can't use that here!")
        message.channel.delete();
  }
}
