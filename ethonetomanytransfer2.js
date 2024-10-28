const Web3 = require('web3');
const web3 = new Web3(process.env.ALCHEMY_API_URL);  // Replace with your Alchemy testnet URL
const contractABI = ["function sendEther(address[] recipients, uint256[] amounts) public payable"];
const contractAddress = process.env.CONTRACT_ADDRESS;  // Replace with your contract's address
const senderAddress = '0xC28dfa9cfb2c078FF9C09A5c515b0F84B4157481';  // Replace with your "from" address
const privateKey = process.env.PRIVATE_KEY;  // Replace with your private key

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Define your recipients and amounts
const recipients = [
  "0x69C796D2D02Abefc4592b7331cb07D96aC8ACF29",
    "0x7A85beecc6e592EA4816E62E2BEBa9CFB4968F1c"
];

const amounts = [
  web3.utils.toWei('0.01', 'ether'),  // 0.1 ETH to recipient 1
  web3.utils.toWei('0.02', 'ether')  // 0.2 ETH to recipient 2
];

// Encode the transaction data to call your one-to-many transfer function
const data = contract.methods.sendEther(recipients, amounts).encodeABI();

// Create and sign the transaction
web3.eth.getTransactionCount(senderAddress).then(nonce => {
  const tx = {
    from: senderAddress,
    to: contractAddress,
    gas: 2000000,  // You can adjust the gas limit
    nonce: nonce,
    data: data,
  };

  // Sign the transaction with your private key
  web3.eth.accounts.signTransaction(tx, privateKey)
    .then(signedTx => {
      // Send the signed transaction
      return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    })
    .then(receipt => {
      console.log('Transaction successful with receipt: ', receipt);
    })
    .catch(err => {
      console.error('Transaction failed: ', err);
    });
});
