For local environment:
	To install ganache:
	npm install -g ganache-cli

	To run ganache:
	ganache-cli

	Default ganache url:
	GANACHE_API_URL=http://127.0.0.1:8545

To integrate local network or testnet with wallet provider:
	Local:
		Add a new custom network in metamask:
		Network name - Ganche (Anything can be set)
		rpc url : http://127.0.0.1:8545
		Chain id: 1337
		currency symbol: ETH

		Select the custom added network 
		import wallet in metamask using the private key generated after running ganache(in terminal)

		In remix ide, in deployment tab, set environment to injected provider - metamask (Which will prompt metamask and authorise the same)
		Select account which is imported in metamask

		Now we can deploy the smart contract using the ganche environment.

		For testnet:
			Change the network to sepolia and corresponding from address to test in sepolia testnet.
			Note: Import wallet if neccessary and integrate in remix ide using injected provider


------------------------------------
Configurations to do:
	provider url(alchemy)
	private key of sender wallet
	smart contract address.
	Use Smart contract abi.

For sending ether:
	We can directly call the smart contract from node using the mentioned configurations.
	We need to pass the address of multiple receiver and corresponding amount to smart contract to complete the process.
	
For sending tokens in etherium network:
	Additional configurations to do:
		Smart contract address of which token we are sending.
		Need to use token smart contract abi too.
	
	Need to set allowance for the token smart contract and approve the same to do the transaction.
	Once approved, we need to pass the address of multiple receiver and corresponding amount to smart contract to complete the process.
	



