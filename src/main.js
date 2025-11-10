import { Bot } from "grammy";
import "dotenv/config"

const BOT_TOKEN=process.env.BOT_TOKEN

const bot=new Bot(BOT_TOKEN)

bot.command("start",(ctx)=>{
    ctx.reply(`Assalomu aleykum :) ${ctx.message.from.username}`,{
        parse_mode:"HTML",
        reply_to_message:25,
        reply_markup:{
            force_reply:true
        }
    })})
    
bot.hears("pizza")
bot.on("message",(ctx)=>ctx.reply("Hi there"))

bot.start()