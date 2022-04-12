import express from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import 'dotenv/config';
import dataSource from './services/index.js';
import router from './routes/index.js';

const app = express();
app.use(bodyParser.json());
router(app);

async function main() {
    try {
        await dataSource.initialize();
        console.log('Connected to db');

        await new Promise<void>(res => app.listen(process.env.SERVER_PORT, res));
        console.log(`Server listens port ${process.env.SERVER_PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

main();