const amqp = require('amqplib');
const path = require('path');
require('dotenv').config();

const newMatchWebhook = require('../hook/newmatch.webhook');
const memberAchievementWebhook = require('../hook/memberachievement.webhook');

const EXCHANGE_NAME = 'events';
const QUEUE_NAME = 'discordbot';

async function startConsumer(client) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'match.new');
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'player.achievement');

    console.log('[RabbitMQ] Listening...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const content = JSON.parse(msg.content.toString());

      try {
        switch (routingKey) {
          case 'match.new':
            setTimeout(async ()=>{
                await newMatchWebhook.handle(client, content);
            }, 2000)
            break;
          case 'player.achievement':
            setTimeout(async ()=>{
              await memberAchievementWebhook.handle(client, content);
            }, 2000)
            break;
          default:
            console.warn(`[RabbitMQ] Unknown event type: ${routingKey}`);
        }
      } catch (err) {
        console.error(`[RabbitMQ] Error processing event ${routingKey}`, err);
      } finally {
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('[RabbitMQ] Error connecting to rabbitmq:', err);
  }
}

module.exports = { startConsumer };
