// Import env
require('dotenv').config()
// Import Moralis
const Moralis = require("moralis").default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const {fetchEntityData} = require("./fetchEntityAddresses")

const runApp = async () => {
    const ERC20_transfer_ABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        }
      ]
      
      const filter_ERC20 = {  
        "gt": ["value", "1000"], 
      };
      
      const options = {
        chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
        description: "monitor all ERC20 transfers", // your description
        tag: "ERC20_transfers", // give it a tag
        abi: ERC20_transfer_ABI,
        includeContractLogs: true,
        allAddresses: false,
        topic0: ["Transfer(address,address,uint256)"], // topic of the event
        advancedOptions: [
          {
            topic0: "Transfer(address,address,uint256)",
            filter: filter_ERC20
          },
        ],
        webhookUrl: process.env.WEBHOOK_URL, // webhook url to receive events,
      };

      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
        });
      
      const stream = await Moralis.Streams.add(options);

      const { id } = stream.toJSON();

      const binanceAddresses = await fetchEntityData('binance','0x1');
      
      await Moralis.Streams.addAddress({
        id,
        address: binanceAddresses,
    });
      
      
};

runApp();