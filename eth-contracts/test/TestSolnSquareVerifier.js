let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

let proof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async function() {
        const _SquareVerifier = await SquareVerifier.new({ from: account_one });
        this.contract = await SolnSquareVerifier.new(_SquareVerifier.address, { from: account_one });
    })

    //// Test if a new solution can be added for contract - SolnSquareVerifier
    it('if a new solution can be added for contract', async function() {
        let canAdd = true;
        try {
            await this.contract.mintNewToken(account_two, 2, proof.proof.A, proof.proof.A_p,
                proof.proof.B, proof.proof.B_p, proof.proof.C, proof.proof.C_p, proof.proof.H,
                proof.proof.K, proof.input, { from: account_one });
        } catch (e) {
            canAdd = false;
        }
        assert.equal(canAdd, true, "Solution cannot be added");
    })

    //// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('if an ERC721 token can be minted for contract', async function() {
        let canMint = true;
        try {
            await this.contract.mintNewToken(account_two, 2, proof.proof.A, proof.proof.A_p, proof.proof.B, proof.proof.B_p, proof.proof.C, proof.proof.C_p, proof.proof.H, proof.proof.K, proof.input, { from: account_one });
        } catch (e) {
            canMint = false;
        }
        assert.equal(canMint, true, "cannot mint  a token");
    })


});