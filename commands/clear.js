const Discord = require('discord.js')

module.exports = {
  name: "clear",
  description: "clears x amt of messages",
  run: async (message, args, bot) => {
    const deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply(
            "Please provide a number between 2 and 100 for the number of messages to delete."
          );

        const fetched = await message.channel.messages.fetch({
          limit: deleteCount
        });

        message.channel.bulkDelete(fetched).then(() => {
        let xembed = new Discord.MessageEmbed()
          .setTitle("Clear Command")
          .setDescription(`Cleared ${args[0]} messages!`)
          .addField("Command used by:", `${message.author.username}`)
          .setFooter(`${message.author.tag}`)
          .setTimestamp();
        message.channel.send(xembed).then(m => m.delete({ timeout: 5000 }));
        })

  }
}
