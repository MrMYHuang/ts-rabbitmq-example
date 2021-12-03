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
        setup: (ch: ConfirmChannel) => ch.assertQueue(q, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-expires': 60000,
            }
        })
    });

    try {
        ch.sendToQueue(q, { hello: 'world' })
            .then(() => {
                console.log('Done');
                process.exit(0);
            });
    } catch (error) {
        console.log(error);
    }
}

main();
