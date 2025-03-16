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

        let embedMsg = new client.discord.EmbedBuilder()
        .setTitle(achievement.reached+" "+achievementType)
        .setDescription(
            "**"+encoraugements[Math.floor(Math.random() * encoraugements.length)]+"**"+
            "\n\nNuestro jugador "+playerMention+" ha alcanzado esta increíble cifra de "+achievementType+
            "\n\n¡A por más!"
        )
        .setAuthor(
            {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/plantilla/'+player.playerName }
        )
        .setColor(16776960)
        .setThumbnail(`https://www.caracantosmeaos.club/players/${player.playerName}_full_transp.png`)

        /*
        const players = match.localTeam ? match.localClub.players : match.awayClub.players
        let playerMentions = ""
        for(p in players){
            var player = players[p]
            var discordId = client.playerDatabase.players.filter((e)=>e.playerName===player.playername)[0].discordId
            playerMentions+=`<@${discordId}> `
        }
    
        let embedMsg
        const imgattach = await new AttachmentBuilder(BASE_URL+'/matchsummary/'+match.matchId, { name: `match_${match.matchId}.jpeg` })
        switch(match.result){
            case "tie": {
                embedMsg = new client.discord.EmbedBuilder()
                .setTitle('Tablas en el marcador')
                .setDescription(
                    "Resultado muy apretado y reparto de puntos en nuestro último partido"+
                    "\n\n¡Las victorias llegarán!"+
                    "\n\n*Plantilla: "+playerMentions+"*"
                )
                .setAuthor(
                    {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/partidos'}
                )
                .setImage(`attachment://match_${match.matchId}.jpeg`)
                .setColor(9807270)
    
                break;
            }
            case "loose": {
                embedMsg = new client.discord.EmbedBuilder()
                .setTitle('Derrota en nuestro último encuentro')
                .setDescription(
                    "El equipo no consiguío hacerse con la victoria en el último partido disputado"+
                    "\n\nA seguir trabajando"+
                    "\n\n*Plantilla: "+playerMentions+"*"
                )
                .setAuthor(
                    {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/partidos'}
                )
                .setImage(`attachment://match_${match.matchId}.jpeg`)
                .setColor(15548997)
    
                break;
            }
            case "win": {
                embedMsg = new client.discord.EmbedBuilder()
                .setTitle('¡Victoria!')
                .setDescription(
                    "Victoria de los nuestros en el último partido"+
                    "\n\n¡Enhorabuena equipo!"+
                    "\n\n*Plantilla: "+playerMentions+"*"
                )
                .setAuthor(
                    {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/partidos'}
                )
                .setImage(`attachment://match_${match.matchId}.jpeg`)
                .setColor(5763719)
    
                break;
            }
            default:
                console.error("[NewMatchWebhook] Error getting match result")
                embedMsg = new client.discord.EmbedBuilder()
                .setTitle('Ha ocurrido un error ')
                .setDescription("No se ha podido obtener los datos del partido")
                .setAuthor(
                    {name: 'Caracantosmeaos C.F', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png'}
                )
                .setImage(`attachment://match_${match.matchId}.jpeg`)
                .setColor(15548997)
        }
        await announcementsChannel.send({embeds: [embedMsg], files:[imgattach]})
        console.info("[Webhook Listener] 'newmatch' Webhook: Message sended")*/
        await announcementsChannel.send({embeds: [embedMsg]})
        console.info("[Webhook Listener] 'memberachievement' Webhook: Message sended")
    }catch(e){
        console.error("[Webhook Listener] 'memberachievement' Webhook: "+e)
    }
}

module.exports = {
    handle
}