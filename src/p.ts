import fs from 'fs';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const message = process.argv[2] || 'Hello!';
const q = 'tasks';
async function main() {
    const conn = amqp.connect(
        [
            'amqps://localhost:8081',
            'amqps://localhost:8082',
            'amqps://localhost:8083',
        ],
        {
            connectionOptions: {
                ca: fs.readFileSync('./config/certs/ca_certificate.pem'),
            }
        });
    const ch = conn.createChannel({
        json: true,
        setup: (ch: ConfirmChannel) => {
            ch.assertExchange('dlx', 'direct');
            ch.assertQueue('dlq');
            ch.bindQueue('dlq', 'dlx', 'dlrk');
            return ch.assertQueue(q, {
                durable: true,
                arguments: {
                    'x-queue-type': 'quorum',
                }
            });
        }
    });

    try {
        ch.sendToQueue(q, { message })
            .then(() => {
                console.log('Done');
                process.exit(0);
            });
    } catch (error) {
        console.log(error);
    }
}

main();
