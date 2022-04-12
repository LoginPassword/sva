import { DataSource } from 'typeorm'; 
import WalletModel from '../models/wallet.js';

const {
    DB_TYPE: type,
    DB_HOST: host,
    DB_PORT,
    DB_USERNAME: username,
    DB_PASSWORD: password,
    DB_DATABASE: database
} = process.env;

if (type !== 'postgres' && type !== 'mysql') {
    throw new Error('Invalid database type');
}

export default new DataSource({
    type, host, username, password, database,
    port: Number(DB_PORT),
    entities: [WalletModel],
    synchronize: true
});
