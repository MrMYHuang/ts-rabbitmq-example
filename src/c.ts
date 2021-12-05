import fs from 'fs';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

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
        setup: (ch: ConfirmChannel) => ch.checkQueue(q)
    });

    try {
        await ch.consume(q, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                process.exit(0);
            }
        }, {
            noAck: false,
        })
    } catch (error) {
        console.log(error);
    }
}

main();
