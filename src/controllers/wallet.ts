import walletService from '../services/wallet.js';
import validator from 'validator';
import express from 'express';

class WalletController {
    async create(req: express.Request, res: express.Response) {
        const { address, owner, description } = req.body;
    
        if (typeof address !== 'string' || !validator.isEthereumAddress(address)) {
            return res.status(400).json({ errorMessage: 'Invalid address parameter' });
        }
    
        if (owner !== undefined &&
            (typeof owner !== 'string' ||
            !validator.isLength(owner, { min: 0, max: 255 }))
        ) {
            return res.status(400).json({ errorMessage: 'Invalid owner parameter' });
        }
    
        if (description !== undefined &&
            (typeof description !== 'string' ||
            !validator.isLength(description, { min: 0, max: 255 }))
        ) {
            return res.status(400).json({ errorMessage: 'Invalid description parameter' });
        }
    
        try {
            await walletService.addWallet({ address, owner, description });
        } catch (error) {
            if (error.message === 'This wallet is already in the database') {
                return res.status(409).set('Location', `/api/wallets/${address}`)
                    .json({ errorMessage: 'This wallet is already in the database' });
            }
    
            throw error;
        }
    
        res.status(201).set('Location', `/api/wallets/${address}`).end();
    };
    
    async find(req: express.Request, res: express.Response) {
        const { address } = req.params;
    
        if (!validator.isEthereumAddress(address)) {
            return res.status(400).json({ errorMessage: 'Invalid address query' });
        }
    
        const wallet = await walletService.getWallet(address);
        
        if (!wallet) {
            return res.status(404).json({ errorMessage: 'Wallet not found' });
        }
    
        res.json(wallet);
    };
    
    async findAll(req: express.Request, res: express.Response) {
        const wallets = await walletService.getWallets();
    
        res.json(wallets);
    };
    
    async update (req: express.Request, res: express.Response) {
        const { owner, description } = req.body;
        const { address } = req.params;
    
        if (!validator.isEthereumAddress(address)) {
            return res.status(400).json({ errorMessage: 'Invalid address query' });
        }
    
        if (owner !== undefined &&
            (typeof owner !== 'string' ||
            !validator.isLength(owner, { min: 0, max: 255 }))
        ) {
            return res.status(400).json({ errorMessage: 'Invalid owner parameter' });
        }
    
        if (description !== undefined &&
            (typeof description !== 'string' ||
            !validator.isLength(description, { min: 0, max: 255 }))
        ) {
            return res.status(400).json({ errorMessage: 'Invalid description parameter' });
        }
    
        const wallet = await walletService.getWallet(address);
        
        if (!wallet) {
            return res.status(404).json({ errorMessage: 'Wallet not found' });
        }
    
        await walletService.updateWallet(wallet, description, owner);
    
        res.status(200).end();
    };
    
    async remove(req: express.Request, res: express.Response) {
        const { address } = req.params;
    
        if (!validator.isEthereumAddress(address)) {
            return res.status(400).json({ errorMessage: 'Invalid address query' });
        }
    
        await walletService.deleteWallet(address);
    
        res.status(200).end();
    };
};

export default new WalletController();