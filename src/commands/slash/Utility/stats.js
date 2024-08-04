const { ApplicationCommandOptionType  } = require('discord.js');
module.exports = {
    name: "stats",
    usage: "/stats o /stats [jugador]",
    options: [
        {
            name: 'jugador',
            description: 'Jugador del que deseas ver sus estadísticas',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    category: "Utility",
    description: "Consulta tus estadísticas o las de otro jugador",
    ownerOnly: false,
    run: async (client, interaction) => {
        const jugadorOption = interaction.options.getUser("jugador");
        const msg = jugadorOption ? await interaction.reply({content: ":hourglass_flowing_sand: Obteniendo estadísticas del jugador...", ephemeral: true}) 
        : await interaction.reply({content: ":hourglass_flowing_sand: Obteniendo tus estadísticas...", ephemeral: true})

        let embedMsg

        try{
            const playerId = jugadorOption ? jugadorOption.id : interaction.user.id
            const player = client.playerDatabase.players.filter((e)=>e.discordId===playerId)[0]
            const playerName = player ? player.playerName : ""
            if(!playerName | playerName==""){
                if(!jugadorOption) throw new Error("¡No eres un jugador del club! Debes especificar un jugador")
                else throw new Error("Jugador no encontrado, por favor especifica un nombre de jugador que juegue en el club")

            }
            const apiResponse = await fetch("https://api.caracantosmeaos.club/members")
            if(!apiResponse.status || apiResponse.status!=200) throw new Error("Error conectando con la API")

            const jsonResponse = await apiResponse.json()
            const jsonPlayer = jsonResponse.response.filter((e)=>e.name===playerName)[0]
            if(!jsonPlayer | jsonPlayer=="") throw new Error("Jugador no encontrado, por favor especifica un nombre de jugador que juegue en el club")

            embedMsg = new client.discord.EmbedBuilder()
            .setTitle('Estadísticas de '+playerName)
            .setDescription(jsonPlayer.proName+" ("+jsonPlayer.proOverall+")")
            .setAuthor(
                {name: 'Ver más en la web', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png', url:'https://www.caracantosmeaos.club/players/'+playerName }
            )
            .setColor(16776960)
            .setThumbnail(`https://www.caracantosmeaos.club/players/${playerName}_full_transp.png`)
            .addFields(
                {name: 'Partidos jugados', value: jsonPlayer.gamesPlayed, inline: true},
                {name: 'Goles', value: jsonPlayer.goals, inline: true},
                {name: 'Asistencias', value: jsonPlayer.assists, inline: true},
                {name: 'Tarjetas Rojas', value: jsonPlayer.redCards, inline: true},
                {name: 'Valoración media', value: jsonPlayer.ratingAve, inline: true},
                {name: 'Nº mejor del partido', value: jsonPlayer.manOfTheMatch, inline: true}
            )
        }catch(e){
            embedMsg = new client.discord.EmbedBuilder()
                .setTitle('Ha ocurrido un error: ')
                .setDescription(e.message)
                .setAuthor(
                    {name: 'Caracantosmeaos C.F', iconURL: 'https://www.caracantosmeaos.club/escudo2024.png'}
                )
                .setColor(15548997)
        }finally{
            //msg.delete();
            await interaction.editReply({
                content: "",
                embeds: [embedMsg],
                ephemeral: true
            });
        }
    }
};