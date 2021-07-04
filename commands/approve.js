const Discord = require('discord.js')
const db = require('quick.db')
let supportIDs = ["291633488535486474", "529815278456930314", "320546614857170945", "601420236335480842", "572944636209922059", "572944636209922059", "749558323795329044"]

module.exports = {
  name: "approve",
  description: "manually approve a bot app",
  aliases: ['allow'],
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
   let newBotsChannel = message.guild.channels.cache.find(c => c.id === "852587976982265887")
    let approvedEmbed = new Discord.MessageEmbed()
      .setTitle("Punch IT Bot Notice")
      .setColor("RANDOM")
      .setDescription("Hey! This is Punch IT Bot List here to inform you that, your application was APPROVED! Yipee! You have been given a role that will allow you to manage your standing within the bot list. Feel free to reach our to the support team if you have any questions!")
      .addField("Approved by", message.author.tag, true)
      .addField("Comments from Approval Team", reason, true)
      .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png'}))
    target.send(approvedEmbed)
    message.author.send("📧 Message sent 📧")

    
   let botLogDEmbed = new Discord.MessageEmbed() 
      .setTitle(`Bot Approved!`)
      .setDescription(`${botn} by ${target} was approved by our moderators!\n To find/add this bot look in ${newBotsChannel}!`)
      .setColor('GREEN')
      .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
      .setTimestamp();
     	bot.channels.cache.get('852626687925551156').send(botLogDEmbed);

  }
}
