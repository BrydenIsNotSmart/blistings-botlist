const Discord = require('discord.js')
const db = require('quick.db')
let supportIDs = ["291633488535486474", "529815278456930314", "320546614857170945", "601420236335480842"]

module.exports = {
  name: "decline",
  description: "manually decline a bot app",
  aliases: ['d'],
  /**
   * @param {Discord.Client} bot
   * @param {Discord.Message} message 
   * @param {String[]} args
   */
  run: async (message, args, bot) => {
    if (!supportIDs.includes(message.author.id)) return
    let target = message.mentions.members.first()
    let botn = args[1]
    if (!botn) return
    if (!target) return
    let reason = args.slice(2).join(" ")
    if (!reason) reason = "N/A"
    let approvedEmbed = new Discord.MessageEmbed()
      .setTitle("Punch IT Bot Notice")
      .setColor("RANDOM")
      .setDescription("Hey! This is Punch IT Bot List here to inform you that, regretably, your application was denied. Don't fret! You can try again, or open a ticket to refute the decision!")
      .addField("Declined by", message.author.tag, true)
      .addField("Comments from Approval Team", reason, true)
      .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png'}))
    target.send(approvedEmbed)
    message.author.send("📧 Message sent 📧")

    
   let botLogDEmbed = new Discord.MessageEmbed() 
      .setTitle(`Bot Denied.`)
      .setDescription(`${botn} by ${target} was denied by our moderators.\n ${target}, you can always re-apply once you have fixed the problem!`)
      .setColor('RED')
      .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
      .setTimestamp();
     	bot.channels.cache.get('760042542141538324').send(botLogDEmbed);

  }
}
