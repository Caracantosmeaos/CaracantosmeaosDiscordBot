
const rabbitmqHandler = require("../../handlers/rabbitmqHandler")
module.exports = {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client 
     */
    async execute(client) {
        
        // Puts an activity
        // ActivityType: https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType
        client.user.setActivity('¡Animando al equipo!', { type: 4 })
        
        // Send a message on the console
        console.log(`[LOG] ${client.user.tag} activo`);

        //Start listening rabbitmq
        rabbitmqHandler.startConsumer(client)
    }
}
