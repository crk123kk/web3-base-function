## 项目介绍

    这是一个我用于学习web.js的项目，或者说整理web.js基础功能的项目

    包含：连接 metaMask 用户、获取用户信息、获取用户余额等功能

## 项目目标

    实现一个基于 Web3.js 的去中心化钱包应用，支持用户连接钱包、查看账户信息、管理资产、发起交易、与智能合约交互，并具备多网络支持。

## 项目详情（基本功能）

### 1、钱包连接

    支持 MetaMask、Brave Wallet、Coinbase Wallet 等常见钱包。

    支持检测钱包是否安装 (typeof window.ethereum !== "undefined" 或 Web3.givenProvider)。

    一键连接钱包（eth_requestAccounts）。

    自动监听账号和网络切换事件（accountsChanged、chainChanged）。

### 2、账户管理获取当前已连接的钱包地址

    显示地址的简短版本（0xabc...def）。

    获取账户余额（web3.eth.getBalance 并格式化为 ETH）。

    显示多币种余额（通过调用 Token 合约 balanceOf）。

### 3、网络管理检测当前网络 ID 和网络名称

    支持一键切换网络（wallet_switchEthereumChain）。

    支持添加自定义网络（wallet_addEthereumChain）。

### 4、交易功能发起 ETH 转账

    发起 Token 转账（调用 ERC20 合约 transfer）。

            签名交易：（web3.eth.sendTransaction ）

            私钥交易：离线签名交易（web3.eth.accounts.signTransaction）。

    显示交易哈希、交易状态（确认数、成功/失败）。

    处理用户拒绝交易的错误。

    历史交易记录查询（Etherscan API）。

### 5、智能合约交互加载合约 ABI

    调用合约的读方法（contract.methods.methodName().call()）。

    调用合约的写方法（contract.methods.methodName().send()）。

    监听合约事件（contract.events.EventName）。

    NFT 展示（ERC721 / ERC1155）。

    Token 列表管理（读取 CoinGecko 或链上 Token Registry）。

### 6、安全与 UX 防止重放攻击（绑定网络 ID 校验）

    防止用户误操作大额转账（设置 gas 预估、余额检测）。

    提示未连接钱包、网络错误等状态。

## 技术要求

    前端框架：Vue.js / React.js

    Web3 库：web3.js v1.8.1

    钱包支持：MetaMask（可扩展至 WalletConnect）

    网络支持：Ethereum 主网 + 测试网（Sepolia、Goerli）

    部署：vercel

## 项目规划（待定）

    这是 v1 版本，用到的是从视频上学的，并且用到的 web.js的技术是比较老旧的 （1.8.1）主要是对 web.js 的基础功能进行整理

    v2 版本：用 web.js 的最新版本做一个同样功能的

    v3 版本：用 ethers.js 做一个同样功能的

    v4 版本：开始构建 solidity 智能合约，实现基本的转账

    v5 版本：实现基本的铸币

    v6 版本：实现投票功能

    v7 版本：实现拍卖行的功能

    v8 版本：实现交易所功能
