import * as amqp from 'amqplib';

const q = 'tasks';
async function main() {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    try {
        await ch.assertQueue(q);
        await ch.consume(q, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

main();
