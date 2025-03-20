const { BitGo } = require('bitgo');

// Fill in with actual access token
const accessToken = '69f540da1466e5f8b1aba3706b9b2c9a75a7909544a959a4d7128c523bb6638c';

// Initialize the SDK
const bitgo = new BitGo({
accessToken: accessToken,
env: 'test',
});

// Generate hot wallet
async function createHotWalletSimple() {
const newWallet = await bitgo.coin('tsol').wallets().generateWallet({
    label: 'my sol hot Wallet',
    passphrase: 'Dk@9428g',
});

console.log(JSON.stringify(newWallet, undefined, 2));
}
