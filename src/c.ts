import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const q = 'tasks';
async function main() {
    const conn = amqp.connect(
        [
            'amqp://localhost:8081',
            'amqp://localhost:8082',
            'amqp://localhost:8083',
        ]);
    const ch = conn.createChannel({
        json: true,
        setup: (ch: ConfirmChannel) => ch.checkQueue(q)
    });

    try {
        await ch.consume(q, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                process.exit(0);
            }
        }, {
            noAck: true,
        })
    } catch (error) {
        console.log(error);
    }
}

main();
