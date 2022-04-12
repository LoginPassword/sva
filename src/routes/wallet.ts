import express from 'express';
import walletController from '../controllers/wallet.js'

const walletRouter = express.Router();

walletRouter.post('/', walletController.create);

walletRouter.get('/:address', walletController.find);

walletRouter.get('/', walletController.findAll);

walletRouter.put('/:address', walletController.update);

walletRouter.delete('/:address', walletController.remove);

export default walletRouter;