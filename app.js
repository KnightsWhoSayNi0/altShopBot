const {Client, MessageEmbed} = require("discord.js");
const client = new Client();
const token = require("./token.js")
// make a file token.js with this line in it
// module.exports = "[YOUR DISCORD TOKEN]";

var prefix = ".";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('message', msg => {
    if (msg.content === prefix + 'ping') {
        msg.reply("Pong!")
    }
    if (msg.content === prefix + 'help') {
        const embed = new MessageEmbed()
            .setTitle('AltShop Bot Help')
            .setColor(0xff0000)
            .setDescription('Prefix is: ' + prefix + '\nCommands:')
            .addField('ping', "Returns Pong!", true);
        msg.channel.send(embed);
    }
  });

client.login(token)