const Bank = artifacts.require('Bank.sol')

contract("Bank", async (accounts) => {
    it("allows a user to deposit funds", async () => {
        const bank = await Bank.new();
        const depositor = accounts[0];

        const amount = web3.utils.toWei('10', 'ether');

        await bank.deposit({ 
            from: depositor, 
            value: amount 
        });

        let balance = await bank.balanceOf(depositor);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));

        assert.equal(balance, 10);
    });

    it("allows a user to withdraw funds", async () => {
        const bank = await Bank.new();
        const depositor = accounts[1];

        const amount = web3.utils.toWei('20', 'ether');

        await bank.deposit({
            from: depositor,
            value: amount
        });

        let balance = await bank.balanceOf(depositor);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        assert.equal(balance, 20);

        const withdraw_amount = web3.utils.toWei('10', 'ether');
        await bank.withdraw(withdraw_amount, { from: depositor });

        balance = await bank.balanceOf(depositor);
        balance = parseInt(web3.utils.fromWei(balance, 'ether'));
        assert.equal(balance, 10);

        let bankTotalBalance = await web3.eth.getBalance(bank.address);
        bankTotalBalance = web3.utils.fromWei(bankTotalBalance);
        assert.equal(parseInt(bankTotalBalance), 10);
    });

    it('allows users to transfer deposited funds between each other', async () => {
        const bank = await Bank.new();
        const sender = accounts[0];
        const receiver = accounts[1];

        const amount = web3.utils.toWei('10', 'ether');

        await bank.deposit({ 
            from: sender, 
            value: amount 
        });

        await bank.sendMoney(receiver, web3.utils.toWei('5', 'ether'), {
            from: sender
        });

        let senderBalance = await bank.balanceOf(sender);
        senderBalance = web3.utils.fromWei(senderBalance);
        assert.equal(parseInt(senderBalance), 5);

        let receiverBalance = await bank.balanceOf(receiver);
        receiverBalance = web3.utils.fromWei(receiverBalance);
        assert.equal(parseInt(receiverBalance), 5);
    });
})
