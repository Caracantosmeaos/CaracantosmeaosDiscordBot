const { AttachmentBuilder } = require("discord.js")
require('dotenv').config();

const BASE_URL = process.env.IMAGE_GENERATOR_BASEURL || "http://localhost";

async function handle(client, match) {
    try {
        console.log("[Event Listener] 'newmatch' event recieved")
        const matchesChannel = await client.channels.cache.get("1268013298339545232")

        const players = match.localTeam ? match.localClub.players : match.awayClub.players
        let playerMentions = ""
        for (p in players) {
            var player = players[p]
            var discordId = client.playerDatabase.players.filter((e) => e.playerName === player.playerName)[0].discordId
            playerMentions += discordId ? `<@${discordId}> ` : player.playerName + " "
        }

        let embedMsg
        const imgattach = await new AttachmentBuilder(BASE_URL + '/matchsummary/' + match.matchId, { name: `match_${match.matchId}.jpeg` })
        switch (match.result) {
            case "tie": {
                embedMsg = new client.discord.EmbedBuilder()
                    .setTitle('Tablas en el marcador')
                    .setDescription(
                        "Resultado muy apretado y reparto de puntos en nuestro último partido" +
                        "\n\n¡Las victorias llegarán!" +
                        "\n\n*Plantilla: " + playerMentions + "*"
                    )
                    .setAuthor(
                        { name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url: 'https://www.caracantosmeaos.club/partido/' + match.matchId }
                    )
                    .setImage(`attachment://match_${match.matchId}.jpeg`)
                    .setColor(9807270)

                break;
            }
            case "loose": {
                embedMsg = new client.discord.EmbedBuilder()
                    .setTitle('Derrota en nuestro último encuentro')
                    .setDescription(
                        "El equipo no consiguío hacerse con la victoria en el último partido disputado" +
                        "\n\nA seguir trabajando" +
                        "\n\n*Plantilla: " + playerMentions + "*"
                    )
                    .setAuthor(
                        { name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url: 'https://www.caracantosmeaos.club/partido/' + match.matchId }
                    )
                    .setImage(`attachment://match_${match.matchId}.jpeg`)
                    .setColor(15548997)

                break;
            }
            case "win": {
                embedMsg = new client.discord.EmbedBuilder()
                    .setTitle('¡Victoria!')
                    .setDescription(
                        "Victoria de los nuestros en el último partido" +
                        "\n\n¡Enhorabuena equipo!" +
                        "\n\n*Plantilla: " + playerMentions + "*"
                    )
                    .setAuthor(
                        { name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url: 'https://www.caracantosmeaos.club/partido/' + match.matchId }
                    )
                    .setImage(`attachment://match_${match.matchId}.jpeg`)
                    .setColor(5763719)

                break;
            }
            default:
                console.error("[Event Listener] Error getting match result")
                embedMsg = new client.discord.EmbedBuilder()
                    .setTitle('Ha ocurrido un error ')
                    .setDescription("No se ha podido obtener los datos del partido")
                    .setAuthor(
                        { name: 'Caracantosmeaos C.F', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png' }
                    )
                    .setImage(`attachment://match_${match.matchId}.jpeg`)
                    .setColor(15548997)
        }
        await matchesChannel.send({ embeds: [embedMsg], files: [imgattach] })
        console.info("[Event Listener] 'newmatch' hook: Message sended")
    } catch (e) {
        console.error("[Event Listener] 'newmatch' hook: ", e)
    }
}

module.exports = {
    handle
}