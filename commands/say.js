const Discord = require('discord.js')

module.exports = {
  name: "say",
  description: "says somthing",
  run: async (message, args, bot) => {
let context = args.join(" ")
message.channel.send(context)
  }
}
