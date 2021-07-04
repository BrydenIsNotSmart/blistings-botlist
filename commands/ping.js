const Discord = require('discord.js')

module.exports = {
  name: "ping",
  description: "finds bot ping",
  run: async (message, args, bot) => {
     let messag = await message.channel.send("Pinging...")
    const pingEmbed = new Discord.MessageEmbed()
        .setTitle("🏓 Pong")
        .setColor('RANDOM')
        .setDescription(`Websocket Ping: ${bot.ws.ping}ms \nMessage Ping: ${messag.createdAt - message.createdAt}ms.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setTimestamp()
        message.channel.send(pingEmbed)
        await messag.delete();

 

  }
}
