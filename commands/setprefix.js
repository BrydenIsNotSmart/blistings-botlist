const Discord = require('discord.js')
const db = require('quick.db')
module.exports = {
	name: "setprefix",
	description: "Sets guild prefix.",
	run: async (message, args, bot) => {
	if(!message.member.hasPermission('MANAGE_GUILD')) return message.reply('you don\'t have required permissios to use this command');
    if(!args[0]) return message.reply('define new prefix');
    await db.set(`prefix_${message.guild.id}`, args[0])
    let e = new Discord.MessageEmbed()
     .setDescription(`Prefix for this guild has been changed to ${args[0]}, succssfully! :tada:`)
    message.channel.send(e)
      
       
    
	}
}
