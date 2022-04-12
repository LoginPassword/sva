import express from 'express';
import walletRouter from './wallet.js';

export default (app: express.Application) => {
    app.use('/api/wallets', walletRouter);

    app.use((req, res) => res.status(404).json({ errorMessage: 'Page not found 404' }));
    app.use((error, req, res, next) => res.status(500).json({ errorMessage: 'Server error 500' }));
};