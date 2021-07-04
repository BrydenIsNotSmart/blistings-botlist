
const Discord = require('discord.js')

module.exports = {
    name: "suggest",
    description: "suggest a thing idk",
    aliases: [""],
   
    run: async (message, args, bot) => {
    let channel = bot.channels.cache.get('853003910272778250')
    let content = args.slice(0).join(' ');
    const webhooks = await message.channel.fetchWebhooks();
    let webhook
      
    if (webhooks.size < 1) {
      webhook = await channel.createWebhook(`${message.author.username}`, {
        avatar: `${message.author.displayAvatarURL()}`,
      })
    } else {
      webhook = webhooks.first()
        }
    
    if (!content) return message.channel.send('I can\'t send an empty message, can I?');
  WebhookMessage = await webhook.send({
      username: `${message.author.username}`,
      avatarURL: `${message.author.displayAvatarURL()}`,
       "embeds": [{
 "author": {
      "name": `${message.author.tag}`,
      "icon_url": `${message.author.displayAvatarURL()}`
    },
    "title": `${message.author.username}'s Suggestion`,
    "description": content
  }]

    });
        
       await WebhookMessage.react('👍');
       await WebhookMessage.react('👎');
       webhook.delete()
  
message.channel.send(`Sent your suggestion! View it in <#853003910272778250>!`)
            

    }
}
			
