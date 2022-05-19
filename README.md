# staking smart contract 
Simple educational staking smart contract

![Contract schema](./schema.jpg)
      
#### Clone test ```staking``` repo
```     
git clone https://github.com/PavlovIvan/staking.git
cd staking
npm install hardhat
npm install
```        
#### Make tests run
```     
npx hardhat test
npx hardhat coverage
```

#### Deploy local
```
npx hardhat node
npx hardhat run --network localhost scripts/deploy.ts
```

#### Deploy rinkeby
Create in the root of your project a ```.env``` file:
```
RENKEBY_URL=https://eth-rinkeby.alchemyapi.io/v2/<YOUR_ALCHEMY_APP_ID>
PRIVATE_KEY=<YOUR_BURNER_WALLET_PRIVATE_KEY>
```

```
npx hardhat run --network rinkeby scripts/deploy.ts
```
