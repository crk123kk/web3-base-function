export const netIdList = [
  { label: "Sepolia Testnet", value: 11155111, chainId: "0xAA36A7" },
  { label: "Goerli Testnet", value: 5, chainId: "0x5" },
  { label: "Ethereum Mainnet", value: 1, chainId: "0x1" },
  {
    label: "Polygon Mainnet",
    value: 137,
    chainId: "0x89",
    param: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      rpcUrls: ["https://polygon-rpc.com/"],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  },
  {
    label: "Polygon Mumbai Testnet",
    value: 80001,
    chainId: "0x13881",
    param: {
      chainId: "0x13881",
      chainName: "Polygon Mumbai Testnet",
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    },
  },
  {
    label: "Binance Smart Chain Mainnet",
    value: 56,
    chainId: "0x38",
    param: {
      chainId: "0x38",
      chainName: "Binance Smart Chain",
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      blockExplorerUrls: ["https://bscscan.com"],
    },
  },
  {
    label: "BSC Testnet",
    value: 97,
    chainId: "0x61",
    param: {
      chainId: "0x61",
      chainName: "BSC Testnet",
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
  },
];
