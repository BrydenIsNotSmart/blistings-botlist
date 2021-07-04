const Discord = require('discord.js')
const db = require('quick.db')
let supportIDs = ["291633488535486474", "529815278456930314", "320546614857170945", "601420236335480842", "572944636209922059", "749558323795329044"]

module.exports = {
  name: "apply",
  description: "apply to add your bot to the list",
  /**
   * @param {Discord.Client} bot
   * @param {Discord.Message} msg 
   * @param {String[]} args
   */
  run: async (message, args, bot) => {
    let msg = message
    let author = msg.author
    let authorID = msg.author.id
    let authorAvatar = msg.author.displayAvatarURL({ dynamic: true, format: 'png' })
    let authorName = msg.author.username
    let guild = msg.guild
    let guildIcon = msg.guild.iconURL({ dynamic: true, format: 'png' })
    let guildName = msg.guild.name

    let z = await db.has(`barred_${msg.guild.id}`, authorID)
    if (z) {
      msg.delete()
      msg.channel.send(`Check your dms, ${author.tag}. If your dms are off, just know that you cannot use this command anymore.`)
      return author.send("You are barred from making applications!")
    }

    let supportRole = msg.guild.roles.cache.find(r => r.name === "Support")

    let applyEmbed = new Discord.MessageEmbed()
      .setTitle("Apply to add your bot!")
      .setColor("RANDOM")
      .setDescription("This page will guide you through the application process. React with ✅ to continue and ❌ to cancel. **NOTE** this process may be slow due to mass applications or development.")
      .setFooter(authorName, authorAvatar)
    let x = await msg.channel.send(applyEmbed)
    x.react('✅')
    x.react('❌')
    let filter = m => msg.author.id === m.author.id
    let continueOneFilter = (reaction, user) =>
      reaction.emoji.name === "✅" && msg.author.id === user.id
    let exitOneFilter = (reaction, user) =>
      reaction.emoji.name === "❌" && msg.author.id === user.id
    let start = x.createReactionCollector(continueOneFilter, {
      time: 30000,
      max: 1
    })
    let exit = x.createReactionCollector(exitOneFilter, {
      time: 30000,
      max: 1
    })

    start.on('collect', async r => {
      x.reactions.removeAll()
      exit.stop()
      msg.delete()
      let botName;
      let botDesc;
      let botID;
      let botInv;
      let botTags;
      let botExtra;
      let review;
      applyEmbed.setDescription("To start, please enter your bots ID.")
      x.edit(applyEmbed)
      let bID = msg.channel.createMessageCollector(filter, {
        time: 60000,
        max: 1
      })
      bID.on('collect', async m => {
        let bid = m.content
        m.delete()
        try {
          var botUser = await bot.users.fetch(bid)
        } catch (error) {
          return message.channel.send('The client ID you have provided was not found on Discord. You may re-apply.')
        }
        if (!botUser.bot) return message.channel.send('Please provide a valid **bot** user. You may re-apply')
        applyEmbed.addField("Bot Name", botUser.username, true)
        applyEmbed.addField("Client ID", bid, true)
        applyEmbed.addField("Invite", `[Click Me](https://discord.com/oauth2/authorize?client_id=${botUser.id}&scope=bot&permissions=0)`, true)
        applyEmbed.setDescription("Great. Please provide a prefix which users will trigger your bot.")
        x.edit(applyEmbed)
        botInv = true
        if (botInv = true) {
          let bPRE = msg.channel.createMessageCollector(filter, {
            time: 600000,
            max: 1
          })
          bPRE.on('collect', async m => {
            let bprefix = m.content
            m.delete()
            applyEmbed.setDescription("Nice! Now please give a detailed description of your bot such as what it does, what features it has, how it stands out, etc. You have 10 minutes.")
            applyEmbed.addField("Prefix", bprefix, true)
            x.edit(applyEmbed)
            botPrefix = true
            if (botPrefix = true) {
              let bDESC = msg.channel.createMessageCollector(filter, {
                time: 600000,
                max: 1
              })
              bDESC.on('collect', async m => {
                let bdesc = m.content
                m.delete()
                applyEmbed.setDescription("Awesome! Now please write a few tags separated by commas. You have 1 minute.")
                applyEmbed.addField("Description", bdesc, true)
                x.edit(applyEmbed)
                botTags = true
                if (botTags = true) {
                  let bTAGS = msg.channel.createMessageCollector(filter, {
                    time: 60000,
                    max: 1
                  })
                  bTAGS.on('collect', async m => {
                    let btags = '#' + m.content.split(',').join(' #').replace(/# /g, '#')
                    m.delete()
                    applyEmbed.setDescription("Neat, now please write anything else you think we should know before submitting it! If you have nothing else to say, write N/A. You have 10 minutes.")
                    applyEmbed.addField("Tags", btags, true)
                    x.edit(applyEmbed)
                    botExtra = true
                    if (botExtra = true) {
                      let bEXTRA = msg.channel.createMessageCollector(filter, {
                        time: 600000,
                        max: 1
                      })
                      bEXTRA.on('collect', async m => {
                        let bextra = m.content
                        m.delete()
                        applyEmbed.setDescription('Brilliant! Now review your submission and submit it when you\'re ready. Remember, if you get rejected you can always try again. We also may open a private channel to ask further questions! Good luck!')
                        applyEmbed.addField("Extra Info", bextra, true)
                        x.edit(applyEmbed)
                        review = true
                        if (review = true) {
                          x.react('✅')
                          x.react('❌')
                          let submitFilter = (reaction, user) =>
                            reaction.emoji.name === "✅" && msg.author.id === user.id
                          let dontsubmitFilter = (reaction, user) =>
                            reaction.emoji.name === "❌" && msg.author.id === user.id
                          let submit = x.createReactionCollector(submitFilter, {
                            time: 30000,
                            max: 1
                          })
                          let cancel = x.createReactionCollector(dontsubmitFilter, {
                            time: 30000,
                            max: 1
                          })
                          submit.on('collect', async r => {
                            let botLogEmbed = new Discord.MessageEmbed()
                              .setTitle(`New Bot`)
                              .setDescription(`${message.author} has added ${botUser.username}!`)
                              .setColor('BLUE')
                              .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                              .setTimestamp();
                            bot.channels.cache.get('852626687925551156').send(botLogEmbed);
                            x.reactions.removeAll()
                            cancel.stop()
                            let channel = bot.channels.cache.get('852627317137604628')
                            applyEmbed.setDescription("Okay! Your application was successfully submitted")
                            x.edit(applyEmbed).then(m => m.delete({ timeout: 10000 }))
                            let appEmbed = new Discord.MessageEmbed()
                              .setTitle("New Bot Application")
                              .setColor("RANDOM")
                              .setThumbnail(authorAvatar)
                              .setDescription(`Applicant: \`${authorName}\` \n Applicant ID: \`${author.id}\``)
                              .addFields(
                                {
                                  name: "Bot Name", value: botUser.username, inline: true
                                },
                                {
                                  name: "Client ID", value: botUser.id, inline: true
                                },
                                {
                                  name: "Invite", value: `[Click Me](https://discord.com/oauth2/authorize?client_id=${botUser.id}&scope=bot&permissions=0)`, inline: true
                                },
                                {
                                  name: "Prefix", value: bprefix, inline: true
                                },
                                {
                                  name: "Description", value: bdesc, inline: true
                                },
                                {
                                  name: "Tags", value: btags, inline: true
                                },
                                {
                                  name: "Extra Info", value: bextra, inline: true
                                }
                              )
                              .setFooter(authorName, authorAvatar)
                            let y = await channel.send(appEmbed)
                            y.react('✅')
                            y.react('🔵')
                            y.react('❌')
                            let approveFilter = (reaction, user) =>
                              reaction.emoji.name === "✅" && supportIDs.includes(user.id)
                              
                            let inquireFilter = (reaction, user) =>
                              reaction.emoji.name === "🔵" && supportIDs.includes(user.id)
                            let rejectFilter = (reaction, user) =>
                              reaction.emoji.name === "❌" && supportIDs.includes(user.id)
                            let approve = y.createReactionCollector(approveFilter, {
                              max: 1
                            })
                            let inquire = y.createReactionCollector(inquireFilter, {
                              max: 1
                            })
                            let reject = y.createReactionCollector(rejectFilter, {
                              max: 1
                            })
                            approve.on('collect', async r => {
                              y.reactions.removeAll()
                              appEmbed.setAuthor("Application was successfully approved")
                              y.edit(appEmbed)
                              let newBotsChannel = msg.guild.channels.cache.find(c => c.id === "761968442780811275")
                              let botLogAEmbed = new Discord.MessageEmbed()
                                .setTitle(`Bot Approved!`)
                                .setDescription(`${botUser.username} by ${message.author} was approved!\n To find/add this bot look in <#852587976982265887>!`)
                                .setColor('GREEN')
                                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                                .setTimestamp();
                              bot.channels.cache.get('852626687925551156').send(botLogAEmbed);

                              let approvedBotEmbed = new Discord.MessageEmbed()
                                .setTitle("New Approved Bot")
                                .setColor("GREEN")
                                .setDescription(`Bot by: ${message.author}`)
                                .addFields(
                                  {
                                    name: "Bot Name", value: botUser.username, inline: true
                                  },
                                  {
                                    name: "Invite", value: `[Click Me](https://discord.com/oauth2/authorize?client_id=${botUser.id}&scope=bot&permissions=0)`, inline: true
                                  },
                                  {
                                    name: "Prefix", value: bprefix, inline: true
                                  },
                                  {
                                    name: "Description", value: bdesc, inline: false
                                  },
                                  {
                                    name: "Tags", value: btags, inline: true
                                  },
                                )
                                .setFooter(authorName, authorAvatar)

                              bot.channels.cache.get('852587976982265887').send(approvedBotEmbed)


                              return
                            })
                            inquire.on('collect', async r => {
                              r.remove()
                              msg.guild.channels.create(`Bot Inquiry - ${bid}`, {
                                type: "text", topic: `This is an inquiry into the bot application of ${authorName} for the bot ${botUser.username}`, permissionOverwrites: [
                                  {
                                    id: supportRole,
                                    allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
                                  },
                                  {
                                    id: authorID,
                                    allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "READ_MESSAGES"]
                                  },
                                  {
                                    id: msg.guild.roles.everyone,
                                    deny: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "SEND_MESSAGES"]
                                  }
                                ]
                              })
                            })
                            reject.on('collect', async r => {
                              y.reactions.removeAll()
                              appEmbed.setAuthor("Application was successfully rejected")
                              y.edit(appEmbed)
                              author.send("Hey! This is Punch IT Bot List here to inform you that, regretably, your application was denied. Don't fret! You can try again, or open a ticket to refute the decision!")

                              let botLogDEmbed = new Discord.MessageEmbed()
                                .setTitle(`Bot Denied.`)
                                .setDescription(`${botUser.username} by ${message.author} was denied by our moderators.\n ${message.author}, you can always re-apply once you have fixed the problem!`)
                                .setColor('RED')
                                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                                .setTimestamp();
                              bot.channels.cache.get('852626687925551156').send(botLogDEmbed);

                              return
                            })
                            bDESC.stop()
                            bEXTRA.stop()
                            bID.stop()
                            bTAGS.stop()
                            submit.stop()
                            return
                          })
                          cancel.on('collect', async r => {
                            x.reactions.removeAll()
                            submit.stop()
                            applyEmbed.setDescription("The process was cancelled! You don't need to do anything else!")
                            x.edit(applyEmbed).then(m => m.delete({ timeout: 5000 }))
                            start.stop()
                            bDESC.stop()
                            bEXTRA.stop()
                            bID.stop()
                            bTAGS.stop()
                            return
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })

    exit.on('collect', async r => {
      x.reactions.removeAll()
      msg.delete()
      applyEmbed.setDescription(`This process was cancelled.`)
      x.edit(applyEmbed)
      x.delete({ timeout: 5000 }).then(msg.delete())
      start.stop()
      exit.stop()
      return
    })

  }
}
