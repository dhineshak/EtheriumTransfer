require('dotenv').config();
const { ethers } = require('ethers');

// Alchemy API URL and provider setup
const alchemyApiUrl = process.env.ALCHEMY_API_URL;
const provider = new ethers.providers.JsonRpcProvider(alchemyApiUrl);

// // Ganache API URL and provider setup
// const ganacheApiUrl = process.env.GANACHE_API_URL;
// const provider = new ethers.providers.JsonRpcProvider(ganacheApiUrl);

// Your private key (make sure to never hardcode it in production code)
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Contract address and ABI (Application Binary Interface)
const contractAbi = 
  // Paste your contract's ABI here (find it in Remix or where you compiled the contract)
  // Example: Transfer function ABI (ensure your function name and signature matches)
  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "recipients",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "sendEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "recipients",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "sendTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

  const tokenAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "account", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const contractAddress = process.env.CONTRACT_ADDRESS_6;
// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

// Function to test one-to-many ETH transfer
async function multiTransfer() {
  const _sender = wallet.address;
  //0x69C796D2D02Abefc4592b7331cb07D96aC8ACF29 - sanjay
  //0x7A85beecc6e592EA4816E62E2BEBa9CFB4968F1c - jai
  const recipients = [
    "0x69C796D2D02Abefc4592b7331cb07D96aC8ACF29",
    "0x7A85beecc6e592EA4816E62E2BEBa9CFB4968F1c"
  ];

  const amounts = [
    ethers.utils.parseEther("0.001"),
    ethers.utils.parseEther("0.002")
  ];

  const totalValue = ethers.utils.parseEther("0.003"); // Total value being transferred
  const totalAmount = amounts.reduce((acc, amount) => acc.add(amount), ethers.BigNumber.from(0));

  if (!totalValue.eq(totalAmount)) {
    throw new Error("Total value provided does not match the total amount to be transferred.");
  }

  // Send the transaction
  const tx = await contract.sendEther(_sender,recipients, amounts, {
    value: totalValue, // Total value being transferred
    gasLimit: 300000 // Set the gas limit for the transaction (optional)
  });

  console.log("Transaction sent: ", tx.hash);

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed: ", receipt.toString());

  const contractBalance = await provider.getBalance(contractAddress);
  console.log('Contract Balance:', ethers.utils.formatEther(contractBalance));

}

// Call the function
// multiTransfer().catch(console.error);

async function sendTokens() {
  const senderAddress = wallet.address; // The address of the token sender

  //0x69C796D2D02Abefc4592b7331cb07D96aC8ACF29 - sanjay
  //0x7A85beecc6e592EA4816E62E2BEBa9CFB4968F1c - jai
  const recipients = [
    "0x69C796D2D02Abefc4592b7331cb07D96aC8ACF29",
    "0x7A85beecc6e592EA4816E62E2BEBa9CFB4968F1c"
  ];

  const amounts = [
    ethers.utils.parseUnits("10", 18), // 10 tokens (adjust decimals as per token contract)
    ethers.utils.parseUnits("20", 18)  // 20 tokens
  ];

  const tokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; //Link token address
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
    const totalValue = ethers.utils.parseUnits("30", 18);
    
    const balance = await tokenContract.balanceOf(wallet.address);
    console.log("Token Balance:", balance.toString());
    
    const contractBalance = await tokenContract.balanceOf(contractAddress);
    console.log("Contract Token Balance:", ethers.utils.formatUnits(contractBalance, 18));

    // const decimals = await tokenContract.decimals();
    // console.log(decimals);
    
    const allowance = await tokenContract.allowance(wallet.address, contractAddress);
    console.log("Allowance set for contract:", ethers.utils.formatUnits(allowance, 18));
    
    const approveTx = await tokenContract.approve(contractAddress, totalValue);
    await approveTx.wait();

    // const currentAllowance = await tokenContract.allowance(wallet.address, contractAddress);
    // console.log("After approve Allowance:", ethers.utils.formatUnits(currentAllowance, 18));


    const tx = await contract.sendTokens(senderAddress, tokenAddress, recipients, amounts, {
      gasLimit: 300000 // Optional: Adjust gas limit as necessary
    });

    console.log("Transaction sent: ", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    const afterbalance = await tokenContract.balanceOf(wallet.address);
    console.log("Token Balance after:", afterbalance.toString());

    const contractBalanceafter = await tokenContract.balanceOf(contractAddress);
    console.log("Contract Token Balance after:", ethers.utils.formatUnits(contractBalanceafter, 18));
  } catch (error) {
    console.error("Error in sending tokens:", error);
  }
}

// Call the sendTokens function
sendTokens().catch(console.error);
