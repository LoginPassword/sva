import WalletModel, { IWallet } from '../models/wallet.js';

class WalletService {
    async addWallet(data: IWallet) {
        const wallet = await WalletModel.findOneBy({ address: data.address });
        if (wallet) {
            throw new Error('This wallet is already in the database');
        }

        const walletModel = new WalletModel();
        
        walletModel.address = data.address;
        walletModel.description = data.description;
        walletModel.owner = data.owner;
        
        return walletModel.save();
    };

    async getWallets() {
        const wallets = await WalletModel.find();
        await Promise.all(wallets.map(wallet => wallet.getBalance()));
        
        return wallets;
    };

    async getWallet(address: string) {
        const wallet = await WalletModel.findOneBy({ address });
        if (wallet) {
            await wallet.getBalance();
        }

        return wallet;
    };

    async updateWallet(wallet: WalletModel, description: string | undefined, owner: string | undefined) {
        wallet.description = description;
        wallet.owner = owner;
        
        return wallet.save();
    };
    
    async deleteWallet(address: string) {
        const wallet = await WalletModel.findOneBy({ address });
        await wallet?.remove();
    };
}

export default new WalletService();