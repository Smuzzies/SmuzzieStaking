import { expect } from 'chai';
import { ethers } from 'hardhat';
import { GameToken } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('GameToken', function () {
    let gameToken: GameToken;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    const initialSupply = 1_000_000n;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const GameToken = await ethers.getContractFactory('GameToken');
        gameToken = await GameToken.deploy(initialSupply);
    });

    describe('Deployment', function () {
        it('Should set the right name and symbol', async function () {
            expect(await gameToken.name()).to.equal('GameToken');
            expect(await gameToken.symbol()).to.equal('GTK');
        });

        it('Should assign the total supply to the owner', async function () {
            const ownerBalance = await gameToken.balanceOf(owner.address);
            const totalSupply = await gameToken.totalSupply();
            expect(totalSupply).to.equal(ownerBalance);
            expect(totalSupply).to.equal(initialSupply * 10n ** 18n); // Account for decimals
        });
    });

    describe('Transactions', function () {
        it('Should transfer tokens between accounts', async function () {
            const transferAmount = ethers.parseEther('100');

            // Transfer from owner to addr1
            await gameToken.transfer(addr1.address, transferAmount);

            const addr1Balance = await gameToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(transferAmount);
        });

        it('Should fail if sender does not have enough tokens', async function () {
            const initialBalance = await gameToken.balanceOf(addr1.address);
            await expect(
                gameToken.connect(addr1).transfer(addr2.address, 1)
            ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
            expect(await gameToken.balanceOf(addr1.address)).to.equal(initialBalance);
        });

        it('Should update balances after transfers', async function () {
            const initialOwnerBalance = await gameToken.balanceOf(owner.address);
            const transferAmount = ethers.parseEther('100');

            // Transfer to addr1
            await gameToken.transfer(addr1.address, transferAmount);

            // Transfer from addr1 to addr2
            await gameToken.connect(addr1).transfer(addr2.address, transferAmount.div(2));

            const finalOwnerBalance = await gameToken.balanceOf(owner.address);
            const addr1Balance = await gameToken.balanceOf(addr1.address);
            const addr2Balance = await gameToken.balanceOf(addr2.address);

            expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount);
            expect(addr1Balance).to.equal(transferAmount.div(2));
            expect(addr2Balance).to.equal(transferAmount.div(2));
        });
    });
}); 