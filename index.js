const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ms = require("ms");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}kick`){

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Tidak ada user");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tidak ada izin");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tidak bisa kick");

    message.delete().catch(O_o=>{});
    message.channel.send(`${kUser} telah dikick oleh ${message.author}, karena ${kReason}`)
    message.guild.member(kUser).kick(kReason);
    return;
  }

  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Tidak ada user");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Tidak ada izin");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tidak bisa kick");

    message.delete().catch(O_o=>{});
    message.channel.send(`${bUser} telah dibanned oleh ${message.author}, karena ${bReason}`)
    message.guild.member(bUser).ban(bReason);


    return;
  }


  if(cmd === `${prefix}report`){

    //!report @ned this is the reason

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Tidak ada user");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported oleh", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Dibuat pada", message.createdAt)
    .addField("Reason", rreason)
    .setFooter("Beta v0.2 | Discord.js");

    let reportschannel = message.guild.channels.find(`name`, "reports");

    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);
    message.channel.send("Terima kasih sudah report")

    return;
  }


  if(cmd === `${prefix}clear`){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("No.");
    if(!args[0]) return message.channel.send("no");
    message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Menghapus ${args[0]} messages.`).then(msg => msg.delete(2000));
   })
  
  }


  if(cmd === `${prefix}warn`){
      let wUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
          if(!wUser) return message.channel.send("User tidak ditemukan");
          let wReason = args.join(" ").slice(22);
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tidak bisa mute");

          message.delete().catch(O_o=>{});
          message.channel.send(`${wUser} anda telah mendapat peringatan dari ${message.author}, karena ${wReason}`)
    return;
  }

  if(cmd === `${prefix}mute`){
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("User tidak ditemukan!");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Tidak bisa mute!");
    let muterole = message.guild.roles.find(`name`, "muted");
    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("Waktu tidak ada!");
  
    await(tomute.addRole(muterole.id));

    message.channel.send(`<@${tomute.id}> anda telah dimute selama ${ms(ms(mutetime))}`)
  
    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> sudah di unmuted!`);
    }, ms(mutetime));
  }

});

bot.login(process.env.TOKEN);