module.exports = {
    name: 'slowmode',
    description: "Sets a channels slowmode.",
    run: async (message, args, bot) => {
        if (!args[0])
        return message.channel.send(
          `You did not specify the time in seconds you wish to set this channel's slow mode too!`
        );
      if (isNaN(args[0])) return message.channel.send(`That is not a number!`);
      let reasoning = args.slice(1).join(" ")
       
      if (!reasoning) {
        reasoning = "No reason provided!";
      }
      message.channel.setRateLimitPerUser(args[0], reasoning);
      message.channel.send(
        `Set the slowmode of this channel to **${args[0]}s** with the reason: **${reasoning}**`
      );
      
    }
}
