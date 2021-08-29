const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
//defining entities/constances/variables and locations to pull the packages from

fs.readdir("./commands/", (err, files) => {
//looks for files in the commands folder, it will not register non-.js files, so if you for some reason decided to put a .py file in there, it would not break anything
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  
//looks for the names of the files in the commands folder
  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      bot.aliases.set(alias, props.help.name);
  
  });
});
})

//telling the bot what to do when it logs in (back-end)
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);


  bot.on("message", async message => {
    if(message.author.bot) return; //will not respond to bots
    if(message.channel.type === "dm") return; //will not respond to dms
    let prefix = botconfig.prefix //looks for prefix in the botconfig.json folder
    let messageArray = message.content.split(" ");// looks for certain parts within the message
    let args = message.content.slice(prefix.length).trim().split(/ +/g); // defining arguments, e.g ${prefix}cake eat now, the thing is distrubuted this way: Prefix command(cake in this context) args[0] (eat in this context) args[1] (now in this context)
    let cmd = args.shift().toLowerCase(); //command name within the message
    let commandfile;

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
  } else if (bot.aliases.has(cmd)) {
    commandfile = bot.commands.get(bot.aliases.get(cmd));
  }//running the file by checking if the command name or alias matches the preset ones!
  
      if (!message.content.startsWith(prefix)) return;
//not responding to messages that do not start with the pre-set prefix!
          
  try {
    commandfile.run(bot, message, args);
  //calling for execution of the file/ running the code of the file
  } catch (e) {
    
    message.channel.send("The command could not be ran!")
    console.log(`The command, ${cmd} could not be ran!`)
    return;
    
  }}
  )})


bot.login("token here");
