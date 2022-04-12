import { Entity, BaseEntity, PrimaryColumn, Column} from 'typeorm';
import Web3 from 'web3';

const web3 = new Web3(process.env.ETHEREUM_NODE_URL || 'https://cloudflare-eth.com');

interface IWallet {
    address: string;
    owner?: string;
    description?: string;
    ethBalance?: string;
    tetherBalance?: string;
};

@Entity()
export default class WalletModel extends BaseEntity implements IWallet  {
    @PrimaryColumn({ length: 44 })
    address: string;

    // два дополнительных поля, чтобы модель не состояла из одного только адреса
    @Column({ length: 255, nullable: true })
    owner?: string;

    @Column({ length: 255, nullable: true })
    description?: string;

    async getBalance() {
        this.ethBalance = web3.utils.fromWei(
            (await web3.eth.getBalance(this.address)), 'ether'
        );

        const usdtContract = new web3.eth.Contract([
            {
                constant: true,
                inputs: [{ name: '_owner', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: 'balance', type: 'uint256' }],
                type: 'function'
            },
            {
                constant: true,
                inputs: [],
                name: 'decimals',
                outputs: [{ name:'', type:'uint8' }],
                type: 'function'
            }
        ], '0xdAC17F958D2ee523a2206206994597C13D831ec7');

        this.tetherBalance = web3.utils.fromWei(
            await usdtContract.methods.balanceOf(this.address).call(), 'mwei'
        );
    };

    ethBalance?: string;
    tetherBalance?: string;
}

export { IWallet };