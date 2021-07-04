
const Discord = require('discord.js');
const bot = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]}, { allowedMentions: { parse: [] } });
const db = require('quick.db');
const guildInvites = new Map();
var cheerio = require("cheerio"); 
var request = require("request")

bot.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()))
bot.on('ready', () => {
    bot.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

bot.on('guildMemberAdd', async member => {

    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);


   member.guild.fetchInvites()
      .then
      (invites => {
        const userInvites = invites.array().filter(o => o.inviter.id === usedInvite.inviter.id);
        var userInviteCount = 0;
        for (var i = 0; i < userInvites.length; i++) {
          var invite = userInvites[i];
          userInviteCount += invite['uses'];
        } 


        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(`${member.user} joined the server, invited by ${usedInvite.inviter}. They now have a total of ${userInviteCount} invites!`)
            .setTimestamp()
            .setFooter(`Now at ${member.guild.memberCount} members!`, member.guild.iconURL({ dynamic: true, format: 'png' }))
            .setTitle(`New Member!`)
            .setColor("#2cf809")

        bot.channels.cache.get('welcome-channel-id').send(embed)

        })
    }
    catch(err) {
        console.log(err);
    }
});

bot.on('message', async message => {
if(!message.guild) {
message.channel.send('hi')
}
})

bot.on('ready', async () => {
	console.log(`${bot.user.username} is online.`);

const activities = [`15 approved bots.`, `BListings Bot List`];
  setInterval(() => {
    let activity = activities[Math.floor(Math.random() * activities.length)];
    bot.user.setActivity(activity, { type: "WATCHING" });
  }, 20000);


});


bot.on('message', async message => {
	let prefix = await db.fetch(`prefix_${message.guild.id}`);
	if (!prefix) {
		prefix = 'b!';
	}
	let guildPrefix = new Discord.MessageEmbed()
		.setTitle('Prefix')
		.setDescription(`The prefix for this guild is set to ${prefix}`)
		.setFooter(
			message.author.username,
			message.author.displayAvatarURL({ dynamic: true, format: 'png' })
		);

	if (message.author.bot) return;
	if (!message.guild) return;

	if (message.content.match(new RegExp(`^<@!?${bot.user.id}>( |)$`)))
		return message.channel.send(guildPrefix);
});

const fs = require('fs');
bot.commands = new Discord.Collection();

const cmds = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of cmds) {
	const cmd = require(`./commands/${file}`);

	bot.commands.set(cmd.name, cmd);
	console.log(`✅${cmd.name} loaded!`);
}

bot.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = "ticket-message-id"
    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);
        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }       
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome to the support system!").setDescription("The staff will get in touch with you soon!").setColor("RANDOM"))
        })
    }
});
bot.on('message', async message => {
  if (!message.guild) return;
	let prefix = await db.fetch(`prefix_${message.guild.id}`);
	if (!prefix) {
		prefix = 'b!';
	}
  

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	if (
		message.author.bot ||
		!message.guild ||
		!message.content.startsWith(prefix)
	)
		return;
	const commandName = args.shift().toLowerCase();
	const cmd =
		bot.commands.get(commandName) ||
		bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!cmd) return;
	try {
		cmd.run(message, args, bot);
	} catch (e) {
		return;
	}
});

bot.login('token-here');
