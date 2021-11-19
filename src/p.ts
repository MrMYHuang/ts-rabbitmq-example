import * as amqp from 'amqplib';

const q = 'tasks';
async function main() {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    try {
        await ch.assertQueue(q);
        await ch.sendToQueue(q, Buffer.from('hello.'));
    } catch (error) {
        console.log(error);
    }
}

main();
