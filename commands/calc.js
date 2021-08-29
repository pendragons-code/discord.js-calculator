const Discord = require('discord.js')
const db = require('quick.db')
const bot = new Discord.Client({disableEveryone: true});
module.exports.run = async (bot, message, args) => {
let prefix = await db.get(`prefix_${message.guild.id}`)
if (prefix === null) prefix = "prefix here"

try {
    var ca = message.content.substring(message.content.indexOf(" "));
    message.reply(ca + " is " + eval(ca).toFixed(2));
 }
 catch (err) {
   message.reply("that is not a number")
 }

}

module.exports.help = {
  name:"calc",
  aliases:["calculator"]
}
