const Discord = require('discord.js')

module.exports = {
    name: "report",
    description: "report a bug",
    /**
     * @param {Discord.Client} bot
     * @param {Discord.Message} message 
     * @param {String[]} args
     */
    run: async (message, args, bot) => {
        let msg = message
        let authorAvatar = msg.author.displayAvatarURL({ dynamic: true, format: 'png' })
        let authorName = msg.author.username
        let guildName = msg.guild.name
        let reportPG = new Discord.MessageEmbed()
            .setTitle("Punch IT Bot List Report Page")
            .setColor("RANDOM")
            .setDescription("This page will guild you in how to report a bug with Punch IT Bot List. \nReact with ✅ to continue and ❌ to cancel.")
            .setFooter(authorName, authorAvatar)
        let x = await msg.channel.send(reportPG)
        x.react('✅')
        x.react('❌')
        let continueOneFilter = (reaction, user) =>
            reaction.emoji.name === "✅" && msg.author.id === user.id
        let exitOneFilter = (reaction, user) =>
            reaction.emoji.name === "❌" && msg.author.id === user.id
        let continueOne = x.createReactionCollector(continueOneFilter, {
            time: 30000,
            max: 1
        })
        let exitOne = x.createReactionCollector(exitOneFilter, {
            time: 30000,
            max: 1
        })
        continueOne.on('collect', async r => {
            x.reactions.removeAll()
            reportPG.setDescription(`Please enter a few words that roughly describe the issue (the subject)! \n**NOTE** if you do not respond in two minutes the process will end!`)
            x.edit(reportPG)
            let subjectFilter = m =>
                m.author.id === msg.author.id
            let s = msg.channel.createMessageCollector(subjectFilter, {
                time: 120000,
                max: 1
            })
            s.on('collect', async m => {
                let subject = m.content
                reportPG.setDescription(`Great! Now please give a basic recollection of how to recreate the problem. \nIf it was a one-time thing or not applicable to the situation, then just write N/A \nYou also have 2 minutes to do this!`)
                reportPG.addField(`Subject`, subject)
                await x.edit(reportPG)
                let sCompleted = true
                if (sCompleted === true) {
                    let recreateFilter = m =>
                        m.author.id === msg.author.id
                    let re = msg.channel.createMessageCollector(recreateFilter, {
                        time: 120000,
                        max: 1
                    })

                    re.on('collect', async m => {
                        let recreate = m.content
                        reportPG.setDescription(`Perfect! Now just write out a detailed description of the issue. \nYou have 5 minutes to do this!`)
                        reportPG.addField(`Recreating Problem`, recreate)
                        await x.edit(reportPG)
                        let reCompleted = true
                        re.stop()
                        if (reCompleted === true) {
                            let descFilter = m =>
                                m.author.id === msg.author.id
                            let d = msg.channel.createMessageCollector(descFilter, {
                                time: 300000,
                                max: 1
                            })
                            d.on('collect', async m => {
                                let desc = m.content
                                reportPG.setDescription(`Awesome! Now review what you've written! React with a ✅ to send it and a ❌ to cancel it!`)
                                reportPG.addField(`Description of Issue`, desc)
                                x.edit(reportPG)
                                x.react('✅')
                                x.react('❌')
                                let sendFilter = (reaction, user) =>
                                    reaction.emoji.name === "✅" && msg.author.id === user.id
                                let cancelFilter = (reaction, user) =>
                                    reaction.emoji.name === "❌" && msg.author.id === user.id
                                let send = x.createReactionCollector(sendFilter, {
                                    time: 60000,
                                    max: 1
                                })
                                let cancel = x.createReactionCollector(cancelFilter, {
                                    time: 60000,
                                    max: 1
                                })
                                send.on('collect', async r => {
                                    let channel = bot.channels.cache.get(`852582119720747028`)
                                    let reportEmbed = new Discord.MessageEmbed()
                                        .setTitle('New Report')
                                        .setDescription(`A new report brought in from \`${authorName}\`!`)
                                        .setColor("RANDOM")
                                        .setThumbnail(authorAvatar)
                                        .addFields(
                                            {
                                                name: "Subject", value: subject, inline: true
                                            },
                                            {
                                                name: "How to recreate problem", value: recreate, inline: true
                                            },
                                            {
                                                name: "Description", value: desc, inline: true
                                            }
                                        )
                                    channel.send(reportEmbed)
                                    x.reactions.removeAll()
                                    send.stop()
                                    cancel.stop()
                                    return
                                })
                                cancel.on('collect', async r => {
                                    reportPG.setDescription('Successfully canceled!')
                                    reportPG.fields.slice(3)
                                    cancel.stop()
                                    send.stop()
                                    return x.edit(reportPG)
                                })
                                d.stop()
                            })
                        }
                    })
                }

                s.stop()
            })
            exitOne.stop()
            continueOne.stop()
        })
        exitOne.on('collect', async r => {
            await reportPG.setDescription("**This process was ended by YOU**")
            await x.edit(reportPG)
            x.reactions.removeAll()
            exitOne.stop()
            continueOne.stop()
        })
        
    }
}
