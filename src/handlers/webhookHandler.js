const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function start(client){
    app.post('/webhook/newmatch', (req, res) => {
        const match = req.body.match
        newMatchWebhook(client, match)
        res.status(200).send("OK");
    });
    
    const PORT = process.env.PORT || 80;
    
    app.listen(PORT, () => {
        console.log(`[Webhook listener] Listening on port ${PORT}`);
    });
}

async function newMatchWebhook(client, match){
    console.log("[Webhook Listener] 'newmatch' Webhook recieved")
    const matchesChannel = await client.channels.cache.get("1268013298339545232")

    const players = match.localTeam ? match.localClub.players : match.awayClub.players
    let playerMentions = ""
    for(p in players){
        var player = players[p]
        var discordId = client.playerDatabase.players.filter((e)=>e.playerName===player.playername)[0].discordId
        playerMentions+=`<@${discordId}> `
    }

    let embedMsg
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
            .setColor(15548997)
    }
    await matchesChannel.send({embeds: [embedMsg]})
}

module.exports = {
    start
}