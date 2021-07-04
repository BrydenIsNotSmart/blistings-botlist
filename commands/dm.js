const Discord = require('discord.js')

module.exports = {
  name: "dm",
  description: "Dms a users",
  run: async (message, args, bot) => {
let dmUser = message.mentions.members.first();
let content = args.slice(1).join(" ")
dmUser.send(`From ${message.author.tag}: ${content}`)
message.channel.send(`Sent the message to ${dmUser.user.tag}. 👍`)
  }
}
