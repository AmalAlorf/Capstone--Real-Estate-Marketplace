var ERC721MintableComplete = artifacts.require('ERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];
    const account_six = accounts[5];

    describe('match erc721 spec', function() {
        beforeEach(async function() {
            this.contract = await ERC721MintableComplete.new({ from: account_one });

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, { from: account_one });
            await this.contract.mint(account_three, 2, { from: account_one });
            await this.contract.mint(account_four, 3, { from: account_one });
            await this.contract.mint(account_five, 4, { from: account_one });

        })

        it('should return total supply', async function() {
            let totalSupp = await this.contract.totalSupply.call();
            assert.equal(totalSupp.toNumber(), 4, "result is not correct");
        })

        it('should get token balance', async function() {
            let tokenBalance = await this.contract.balanceOf.call(account_two, { from: account_one });
            assert.equal(tokenBalance.toNumber(), 1, "Balance of account_two should be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function() {
            let tokenURI = await this.contract.tokenURI.call(1, { from: account_one });
            assert(tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "TokenURI doesn't exist ");
        })

        it('should transfer token from one owner to another', async function() {
            let token = 1;
            await this.contract.approve(account_three, token, { from: account_two });
            await this.contract.transferFrom(account_two, account_three, token, { from: account_two });
            // check new owner
            currentOwner = await this.contract.ownerOf.call(token);
            assert.equal(currentOwner, account_three, "Owner is account_three");
        })
    });

    describe('have ownership properties', function() {
        beforeEach(async function() {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function() {
            let fail = false;
            try {
                await this.contract.mint(account_six, 5, { from: account_two });
            } catch (e) {
                fail = true;
            }

            assert.equal(fail, true, "should fail when address is not contract owner");

        })

        it('should return contract owner', async function() {
            let contractOwner = await this.contract.owner.call({ from: account_one });
            assert.equal(contractOwner, account_one, "owner is account_one");
        })

    });
})