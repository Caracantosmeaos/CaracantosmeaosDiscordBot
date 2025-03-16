const express = require('express');
require('dotenv').config();
const app = express();
const newMatchWebhook = require('../webhooks/newmatch.webhook')
const memberAchievementWebhook = require('../webhooks/memberachievement.webhook')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function start(client){
    app.post('/webhook/newmatch', (req, res) => {
        const match = req.body.match
        setTimeout(async ()=>{
            newMatchWebhook.handle(client, match)
        }, 3000)
        res.status(200).send("OK");
    });

    app.post('/webhook/memberachievement', (req, res) => {
        const achievement = req.body.achievement
        setTimeout(async ()=>{
            memberAchievementWebhook.handle(client, achievement)
        }, 3000)
        res.status(200).send("OK");
    });
    
    const PORT = process.env.PORT || 80;
    
    app.listen(PORT, () => {
        console.log(`[Webhook listener] Listening on port ${PORT}`);
    });
}

module.exports = {
    start
}