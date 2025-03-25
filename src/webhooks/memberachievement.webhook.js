const {AttachmentBuilder} = require("discord.js")
require('dotenv').config();

const IMAGE_GENERATOR_BASEURL = process.env.IMAGE_GENERATOR_BASEURL || "http://localhost";

async function handle(client, achievement){
    try{
        console.log("[Webhook Listener] 'memberachievement' Webhook recieved")
        const announcementsChannel = await client.channels.cache.get("1134219726780911667")

        const player = achievement.player
        const discordId = client.playerDatabase.players.filter((e)=>e.playerName===player.playerName)[0].discordId
        const playerMention = `<@${discordId}>`
    
        const encoraugements = ['¡Increible!','¡Imparable!','¡Impresionante!','¡Menudo logro!']
        let achievementType = ""

        switch(achievement.type){
            case 'played': {
                achievementType = "partidos jugados"
                break;
            }
            case 'goals': {
                achievementType = "goles"
                break;
            }
            case 'assists': {
                achievementType = "asistencias"
                break;
            }
            case 'redcards': {
                achievementType = "tarjetas rojas"
                break;
            }
            case 'passes': {
                achievementType = "pases realizados"
                break;
            }
            case 'motm': {
                achievementType = "mejor del partido"
                break;
            }
        }

        const filename =`playerachievement_${player.playerName}_${achievement.type}_${achievement.reached}.jpeg`
        const imgattach = await new AttachmentBuilder(IMAGE_GENERATOR_BASEURL+'/playerachievement/'+player.playerName+'?type='+achievement.type+"&reached="+achievement.reached, { name: filename })
        let embedMsg = new client.discord.EmbedBuilder()
        .setTitle(encoraugements[Math.floor(Math.random() * encoraugements.length)])
        .setDescription(
            "\n\nNuestro jugador "+playerMention+" ha alcanzado esta increíble cifra de "+achievementType+
            "\n\n¡A por más!"
        )
        .setAuthor(
            {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/plantilla/'+player.playerName }
        )
        .setColor(16776960)
        .setImage('attachment://'+filename)

        await announcementsChannel.send({embeds: [embedMsg], files:[imgattach]})
        console.info("[Webhook Listener] 'memberachievement' Webhook: Message sended")
    }catch(e){
        console.error("[Webhook Listener] 'memberachievement' Webhook: "+e)
    }
}

module.exports = {
    handle
}