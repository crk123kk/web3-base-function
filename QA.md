# window.ethereum

    typeof window.ethereum !== "undefined"

    这段代码的作用是 判断当前浏览器环境里是否存在 window.ethereum 对象，也就是判断 用户是否安装了支持 Ethereum 的钱包插件（最常见的是 MetaMask）。

    如果用户安装了像 MetaMask 这样的浏览器扩展，扩展会在页面中注入一个 ethereum 对象。

    JavaScript 中，如果访问不存在的变量或属性会报错，但 typeof 用于安全检测，即使 window.ethereum 不存在也不会抛出错误。

    window.ethereum 是钱包注入到页面的全局 API，遵循 EIP-1193 标准。因此任何支持 EIP-1193 的钱包都可以通过 window.ethereum 访问。比如 MetaMask、Coinbase Wallet、WalletConnect 等。

# try/catch/promise

    当函数执行时，如果代码块中出现了错误，就会抛出一个错误对象

    尤其连接钱包获取钱包信息以及转账等操作的时候，如果没有捕获异常，就会导致页面出现异常，给人的体验很不好

# new Web3()

    new Web3(window.ethereum)
    new Web3(Web3.givenProvider)
    new Web3("wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2")

    这三个代码片段都是用来初始化 Web3.js 实例，用于与以太坊区块链交互，但它们的 Provider（提供者）来源不同，导致功能和使用场景有所区别。

## new Web3(window.ethereum)

    来源：
        window.ethereum 是由 MetaMask、Coinbase Wallet 等浏览器钱包 注入到网页全局环境的对象，遵循 EIP-1193 标准。

        直接使用钱包提供的 Provider。

    特点：
        ✅ 支持用户交互（如请求账户、签名交易）
        ✅ 自动适配用户当前选择的网络（如 Mainnet、Sepolia）
        ❌ 依赖用户安装钱包（如果没有钱包，window.ethereum 会是 undefined）

    适用场景：
        需要获取用户账户信息的场景。
        需要用户 连接钱包、签名交易 的 DApp（如 DeFi、NFT 市场）。

## new Web3(Web3.givenProvider)

    来源：
        Web3.givenProvider 是 Web3.js 自动检测 的 Provider，通常就是 window.ethereum（如果存在）。

        它本质上是 web3.js 对 window.ethereum 的封装，行为几乎相同。

    特点：
        ✅ 和 window.ethereum 几乎一样，但更符合 Web3.js 的 API 风格
        ✅ 兼容性更好（某些旧版钱包可能只支持 Web3.givenProvider）
        ❌ 仍然依赖用户安装钱包

    适用场景：
        与 new Web3(window.ethereum) 相同，但更推荐在 Web3.js 项目中使用。

## new Web3("wss://sepolia.infura.io/ws/v3/...")

    来源：
        直接连接 Infura、Alchemy 或自建节点 提供的 WebSocket/HTTP 接口。
        不依赖用户钱包，而是使用固定的节点 URL。

    特点：
        ✅ 不依赖用户钱包，适用于无钱包环境（如后端、脚本）
        ✅ 可自由选择网络（如 Mainnet、Sepolia、Goerli）
        ❌ 无法直接签名交易（除非手动添加私钥）
        ❌ 需要 API Key（公开的 Key 可能被滥用）

    适用场景：
        只读操作（查询余额、合约状态）。
        监听链上事件（如智能合约的 Event）。
        自动化测试或后台服务（无需用户交互）。

## 如何选择

    需要用户交互（如 DeFi、NFT 交易）
    → 优先用 new Web3(window.ethereum) 或 new Web3(Web3.givenProvider)。

    只需读取数据（如查询余额、监听事件）
    → 使用 new Web3("wss://infura.io/...")（适合后端或无钱包环境）。

    混合模式（既支持钱包又支持无钱包查询）
    → 使用 Web3.givenProvider || "wss://infura.io/..." 作为回退：

    const web3 = new Web3(
        Web3.givenProvider ||
        "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
    );

# const accounts = web3.eth.getAccounts()

    const accounts = await web3.eth.getAccounts();

        读取当前钱包已连接的账户：只会读取已授权的账户，不会发送请求（不会弹窗）

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

        原生方法

    accounts

        这个accounts表示的连接的账户的数目，而不是当前选中的账户，所以这个accounts是一个数组，凡是切换之后同意连接的都会展示出来

# ethereum.request()

    accounts = await ethereum.request({ method: "eth_requestAccounts" });

        发送连接钱包的请求，连接后返回当前已连接的账户

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

        原生方法

# window.ethereum.on()

    window.ethereum.on('connect', ...) 是 MetaMask 提供的原生事件监听，这是钱包（provider）层的事件，web3.js(ethers.js本质上也没有) 本身并没有封装专门的事件监听接口。

    window.ethereum 是由钱包（如 MetaMask）注入的 Provider 对象，负责和链交互，也提供事件监听接口。

    web3.js 的核心是封装 RPC 调用（比如 eth_getBalance、eth_sendTransaction），但事件监听是底层 provider（即 window.ethereum）负责的。

    所以你要监听钱包连接、账户变化、网络变化事件，必须直接用 window.ethereum.on 去监听，web3.js 目前没有包装这部分 API。

## 常见的 window.ethereum 事件

    | 事件名             | 说明              |
    | ----------------- | --------------- |
    | `connect`         | 连接到区块链网络时触发     |
    | `disconnect`      | 与区块链网络断开连接时触发   |
    | `accountsChanged` | 用户切换账户或者断开账户时触发 |
    | `chainChanged`    | 用户切换链（网络）时触发    |

## 常见坑点及解决方案

    用户断开账户后程序仍显示已连接

        原因：
            accountsChanged 返回空数组时，表示无账户连接。

        解决方案：
            监听 accountsChanged，当数组为空时，清空用户状态，提示用户连接。

    网络切换后状态混乱
        原因：
            chainChanged 后链环境变化，旧状态失效。

        解决方案：
            监听 chainChanged，触发页面刷新或状态重置。

    事件监听写多次导致重复触发
        原因：
            多处重复绑定相同事件监听，导致回调多次调用。

        解决方案：
            确保只绑定一次，或者使用 removeListener 清理旧监听。

    不支持事件或钱包不兼容
        原因：
            不同钱包支持事件不一致，导致部分事件不触发或异常。

        解决方案：
            做兼容处理，捕获异常，提示用户使用主流钱包如 MetaMask。

    页面刷新导致事件监听丢失
        原因：
            浏览器刷新后需要重新绑定事件监听。

        解决方案：
            在页面加载生命周期或初始化逻辑中绑定事件监听。

## wallet_revokePermissions （断开连接）

    在 ethers.js 和 web3.js 中没有官方的 disconnect() 方法，因为 它们只是一个区块链交互库，本身不维护“连接状态”。

    钱包连接和断开是由钱包提供商（MetaMask、WalletConnect 等）管理的，不是由 这些库控制的。

    MetaMask
        没有官方 API 直接让 dApp 主动断开连接，因为连接状态是由用户钱包决定的。不过我们让用户移除站点授权，这会让 MetaMask 撤销你的站点访问权限，下次访问需要重新授权。
            await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [{ eth_accounts: {} }]
            });

    WalletConnect
        是支持主动断开的：await provider.disconnect();

### webJs 能否只断开当前账号的连接授权

    web3.js 和当前大多数 EVM 钱包（MetaMask、Coinbase Wallet 等）本身并没有提供“只断开某一个账号授权”的方法，这是因为浏览器钱包的权限是基于站点级别授权的，而不是针对单个账号的独立授权。

## await web3.eth.getAccounts();

    获取当前已连接的账户地址。这个获取到的地址是一个数组，包含当前已连接的账户地址。第一个是当前选中的已经连接的账户（切换到没有连接的账户的时候，获取到的第一个是上一次返回的数据）

## await web3.eth.getBalance(addr);

    获取账户余额。这个获取到的余额是一个字符串，表示账户的余额，单位是 wei。需要通过 web3.utils.fromWei(balance, 'ether') 转换成 ETH。

    需要传入地址参数，获取到的是对应地址的余额

    如果要获取其他类型的代币数量，需要通过调用合约的abi来实现。ETH（以太币）是以太坊网络的原生代币，它是系统内置资产，不是通过智能合约发行的。以太坊的每个地址都有一个 balance 字段，存储它持有的 ETH 数量（单位是 wei）。而像 USDT、DAI、UNI 这种 ERC-20 代币，都是用智能合约管理的，所以必须调用合约方法才能查余额。

## web3.eth.getChainId()

    web3.js中用于获取当前网络ID的函数。

## wallet_switchEthereumChain

    切换网络

        web3.js中并没有切换网络的API,只能通过调用MetaMask钱包的API，用于切换网络。

        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
        });

## wallet_addEthereumChain

    添加网络

        web3.js中并没有添加网络的API,只能通过调用MetaMask钱包的API，用于添加网络。

        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [addNetworkParams],
        });

        添加 Sepolia、Goerli、Ethereum Mainnet这种钱包（以太坊）自带的网络，不需要而外参数

        但是添加其他的网络，需要添加参数：
            param: {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                rpcUrls: ["https://polygon-rpc.com/"],
                nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
                blockExplorerUrls: ["https://polygonscan.com"],
            },

## 交易

### 完整的交易步骤

#### 钱包签名交易： web3.eth.sendTransaction(txParams);

```js
/**
 * 发送签名交易
 */
const sendTransactionBySign = async () => {
  try {
    if (!senderAddr.value) {
      MessagePlugin.error("请登录");
      return;
    }
    if (!toAddress.value) {
      MessagePlugin.error("请输入转账地址");
      return;
    }
    if (!transNum.value) {
      MessagePlugin.error("请输入转账金额");
      return;
    }
    // 获取当前账户
    const fromAddr = senderAddr.value;
    // 转账目标地址
    const toAddr = toAddress.value;
    // 转账金额（ETH 转 Wei）
    const amount = transNum.value;
    const amountInWei = web3.utils.toWei(amount, "ether");

    // 构建交易参数(最基本参数)
    const txParams = {
      from: fromAddr,
      to: toAddr,
      value: amountInWei,
    };

    // 发送交易（由 MetaMask 弹窗签名确认）
    // QA：sendTransaction
    const tranRes = await web3.eth.sendTransaction(txParams);
    MessagePlugin.success("交易成功");
    transactionHash.value = tranRes.transactionHash;
  } catch (error) {
    MessagePlugin.error("发送交易失败");
    // 1. 用户拒绝
    if (error.code === 4001 || error.message?.includes("User denied")) {
      console.error("❌ 交易已取消：用户拒绝签名");
      return null;
    }

    // 2. 余额不足
    if (error.message?.includes("insufficient funds")) {
      console.error("❌ 交易失败：余额不足");
      return null;
    }

    // 3. Gas 相关错误
    if (
      error.message?.includes("intrinsic gas too low") ||
      error.message?.includes("out of gas")
    ) {
      console.error("❌ 交易失败：Gas 设置不足");
      return null;
    }

    // 4. 其他未知错误
    console.error("❌ 交易失败:", error);
    return null;
  }
};
```

#### 私钥签名交易： web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"))

```js
/**
 * 私钥交易：需要私钥
 */
const sendTransactionByPrivateKey = async () => {
  // 私钥
  const priKey = Buffer.from(privateKey.value, "hex");

  if (!priKey) {
    MessagePlugin.error("请输入转账私钥");
    return;
  }
  // 获取当前账户
  const fromAddr = senderAddr.value;
  // 转账目标地址
  const toAddr = toAddress.value;
  // 转账金额（ETH 转 Wei）
  const amount = transNum.value;
  const amountInWei = web3.utils.toWei(amount, "ether");

  // 交易次数（交易Id）
  const nonce = await web3.eth.getTransactionCount(fromAddr);

  // 获取当前 gasPrice
  const gasPrice = await web3.eth.getGasPrice();

  // 获取当前的 chainId
  const chainId = await web3.eth.getChainId();

  // 构建交易参数(最基本参数)
  const txParams = {
    from: fromAddr,
    to: toAddr,
    value: web3.utils.toHex(amountInWei),
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasPrice),
    chainId,
  };

  let gas = await web3.eth.estimateGas(txParams);
  txParams.gas = web3.utils.toHex(gas);

  // 创建交易对象
  const tx = new Tx(txParams);
  // 签名交易
  tx.sign(priKey);

  // 序列化交易：生成 serializedTx,有这个值才可以实现转账
  const serializedTx = tx.serialize();

  confirmVisible.value = false;
  pageLoading.value = true;

  // 发送交易
  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("transactionHash", (txId) => {
      // 可以通过这个交易Id 去 sepolia 上查交易记录
      console.log("交易Id:", txId);
    })
    .on("receipt", (tranRes) => {
      console.log("tranRes :>> ", tranRes);
      pageLoading.value = false;
      transactionHash.value = tranRes.transactionHash;
    })
    .on("error", (err) => {
      pageLoading.value = false;
      console.error("交易失败：", err);
    });
};
```

#### 获取当前账户可转账余额

    这里需要注意：

        gasLimit 不是固定的

            普通 ETH 转账 21000 是对的 （普通转账（ETH），并且计算最大可用余额——最大可转账数目）

            如果是 合约调用 / ERC20 转账，gasLimit 会更高（几万~几十万）。（这时候就需要动态计算——因为 gasPrice 会变化的）

                // 这个计算出来的就是当前交易需要的 gas 费用，然后传入下面的方法进行计算
                let gas = await web3.eth.estimateGas(txParams);

```js
/**
 * QA：获取当前账户可转账余额
 * @param fromAddress 当前账号地址：转账账号
 * @param gasLimit
 */
const getMaxTransNum = async (fromAddress, gasLimit = 21000) => {
  // 1. 查询余额（单位：wei）
  const balanceWei = BigInt(await web3.eth.getBalance(fromAddress));

  // 2. 查询当前 gasPrice（单位：wei）
  const gasPriceWei = BigInt(await web3.eth.getGasPrice());

  // 3. 计算 gas 费用 = gasLimit * gasPrice
  const estimatedFeeWei = gasPriceWei * BigInt(gasLimit);

  // 4. 可转金额 = 余额 - gas费（必须大于0）
  if (balanceWei <= estimatedFeeWei) {
    return "0"; // 余额不足
  }

  const transferableWei = balanceWei - estimatedFeeWei;

  // 5. 转换为 ETH
  return web3.utils.fromWei(transferableWei.toString(), "ether");
};
```

### 关于交易的其他信息

#### rawTx （交易参数）

      const txParams = {
        from: fromAddr,
        to: toAddr,
        value: web3.utils.toHex(amountInWei),
        nonce: web3.utils.toHex(nonce),
        // gas/gasLimit: web3.utils.toHex(gasLimit),
        // gasLimit: web3.utils.toHex(gasLimit),
        gasPrice: web3.utils.toHex(gasPrice),
        chainId,
    };

    from：发起交易的账户地址。

    to：接收交易的账户地址。

    value：交易金额，以 wei 为单位。

    nonce：交易编号，用于防止交易重放攻击。

        const nonce = await web3.eth.getTransactionCount(fromAddr);
        getTransactionCount：用于获取 nonce，它是每个以太坊账户发出的交易计数器
        每发起一笔交易，nonce 就会 +1，可以用来确认交易是哪笔

        用来确保：

            交易顺序（即先发的交易先执行）

            防止重放攻击（同一个交易不能在不同网络重复使用）

    gas/gasLimit：交易消耗的gas

        gasLimit：签名交易中

        gas：私钥交易中，用的是gas而不是gasLimit（虽然都是一个东西）

            ethereumjs-tx 里不认 gasLimit，它要的 key 是 gas，所以这里是gas而不是gasLimit

            gas可以直接设置固定值，但是很多情况下这个值会根据交易内容而变化，所以我们通常需要去计算当前交易的gas值，并且为了获得更好的成功率，可能还会对它进行1.1倍这样的加成

            ETH之间的交易是固定值（最少）21000（也可以多设置，从而提高成功率）

            计算gas值需要提供交易参数，因为不同的交易需要的 gas 是不同的

                const txParams = {
                        from: fromAddr,
                        to: toAddr,
                        value: web3.utils.toHex(amountInWei),
                        nonce: web3.utils.toHex(nonce),
                        gasPrice: web3.utils.toHex(gasPrice),
                        chainId,
                };
                let gas = await web3.eth.estimateGas(txParams);
                // 获取到gas值然后再赋给txParams
                txParams.gas = web3.utils.toHex(gas);

    gasPrice：交易消耗的gas价格

    chainId：交易所属的链ID，用于防止交易重放攻击

        chainId 是 以太坊网络的唯一标识符，用于区分不同的链。它是交易签名的一部分，用来防止同一笔交易在其他链上被重复使用（重放攻击）

    web3.utils.toHex(nonce)

        gasPrice, nonce, value, gas 都要用 十六进制字符串（BN 转 hex），而不是 JS 的 number

        这个很重要，如果没有转换会导致交易失败，并且提示什么余额不足等奇怪问题，但是你又没发现余额不足，这时候可能就是没有转换的问题

#### sendTransaction

    发送交易到以太坊网络，但交易需要由 web3 连接的钱包来签名（比如 MetaMask）。

    也就是web3.js 不需要你提供私钥

    钱包会弹出签名窗口

    本质：不需要私钥提供签名，而是钱包发起签名交易，只需要提供转入转出的地址和金额，其他参数都会由钱包设置

    注意点：

        不需要 dialog，因为钱包会有一个确认交易的过程（会和你确认from\to\value）

        最基本的交易参数：（其他参数钱包会自动设置，当然也可以人为设置）
            const txParams = {
                from: fromAddr,
                to: toAddr,
                value: amountInWei,
            };

        弹窗：
            有时候弹窗并不会自动弹出，原因可能由很多，比如多个钱包，比如网络设置是否是native点击都有可能影响，这个不重要，重要的是钱包是否收到签名请求，后者说右上角钱包插件是否有消息，如果有，点开钱包就可以看到请求交易

    使用

```js
const txParams = {
  from: fromAddr,
  to: toAddr,
  value: amountInWei,
};
const tranRes = await web3.eth.sendTransaction(txParams);
```

#### sendSignedTransaction

    发送已经签名好的交易。

    需要提供交易的签名数据（raw transaction），通常是自己用私钥签名。（注意：私钥实际不要明文存放！）

    本质：需要私钥提供签名，从而发起签名交易，并且其他参数需要设置好，不然很容易交易失败

    注意点：

        1、可以提供确认是否要交易的弹窗（from\to\value等）不提供交易是直接发生的，用户无感知

        2、私钥交易需要额外的配置：

            import Tx from "ethereumjs-tx";

            通过Tx创建交易对象：  const tx = new Tx(txParams);

        3、要使用 ethereumjs-tx，需要 polyfill

            如果没有配置，会报错：BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.

            原因是 Webpack 5+ 默认不再为 Node.js 核心模块自动提供 polyfill 导致的。

    使用

```js
// 构建交易参数(最基本参数)
const txParams = {
  from: fromAddr,
  to: toAddr,
  value: web3.utils.toHex(amountInWei),
  nonce: web3.utils.toHex(nonce),
  gasPrice: web3.utils.toHex(gasPrice),
  chainId,
};

let gas = await web3.eth.estimateGas(txParams);
txParams.gas = web3.utils.toHex(gas);

// 创建交易对象
const tx = new Tx(txParams);
// 签名交易
tx.sign(priKey);

// 序列化交易：生成 serializedTx,有这个值才可以实现转账
const serializedTx = tx.serialize();

await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
```

#### sendSignedTransaction 需要额外的 polyfill

    1、需要 ethereumjs-tx 来创建交易对象

        引入对应的库：

            "ethereumjs-tx": "^1.3.7",
            "ethereumjs-util": "^7.1.5",
            "ethereumjs-wallet": "^1.0.2",

    2、使用 ethereumjs-tx 就需要垫片 polyfill

        在前端使用 Web3 或 ethereumjs-tx 类库时需要依赖 Node.js 模块（比如 stream、crypto、buffer 等）。

            npm install --save-dev stream-browserify buffer process

        实际我引入了：

            "node-polyfill-webpack-plugin": "^4.1.0",
            "crypto-browserify": "^3.12.1",
            "buffer": "^6.0.3",
            "process": "^0.11.10",
            "stream-browserify": "^3.0.0"

    3、配置 webpack

```js
        const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
        const webpack = require("webpack");

        module.exports = defineConfig({
            configureWebpack: {
                resolve: {
                    fallback: {
                        stream: require.resolve("stream-browserify"),
                        crypto: require.resolve("crypto-browserify"),
                        buffer: require.resolve("buffer/"),
                        process: require.resolve("process/browser"),
                    },
                },
                plugins: [=
                    new NodePolyfillPlugin(),
                    new webpack.ProvidePlugin({
                        process: "process/browser",
                        Buffer: ["buffer", "Buffer"],
                    }),
                ],
            },
        });
```

#### 交易的监听处理（常见的监听事件）

```js
// 发送交易
web3.eth
  .sendSignedTransaction("0x" + serializedTx.toString("hex"))
  .on("transactionHash", (txId) => {
    // 可以通过 txId 去查询交易
  })
  .on("receipt", (tranRes) => {
    // 获取交易结果,这个对象中包含了交易的所有信息，transactionHash就是交易的哈希值，可以通过这个值去查询交易信息
  })
  .on("confirmation", (confNumber, receipt) => {
    // confNumber: 确认数(有多少个区块链节点已经确认了该交易)
  })
  .on("error", (err) => {
    // error: 错误信息
  });
```

    transactionHash

        说明：当交易被广播到网络（还没确认）时触发
        参数：交易哈希（string）
        用途：前端 UI 可以先提示“交易已提交”，并显示 Etherscan 链接

    receipt

        说明：交易被矿工打包进区块时触发（至少 1 个确认）
        参数：交易回执（receipt）对象
        用途：确认交易成功执行了，前端 UI 可以提示“交易成功”

    confirmation

        说明：当交易被更多区块确认时触发
        参数：(confirmationNumber, receipt)
        用途：可以根据确认次数更新 UI，比如等到 12 个确认后才提示“安全完成”

    error

        说明：交易失败时触发
        参数：错误对象（Error）
        用途：可以在 UI 上显示“交易失败”

    // 没有所谓的 finally

    const tranRes = await web3.eth.sendTransaction(txParams);
    const tranRes = web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"))

    都包含了以上的监听函数

        transRes.on('transactionHash', function(hash){})

#### 交易错误提示

    在以太坊里，能知道交易失败，但不能直接得到失败原因（错误字符串），因为链上执行失败时，节点只会返回一个 status = 0，并不会把错误信息（比如 "SafeMath: subtraction overflow"）保存到链上。

    想要错误原因，必须用 eth_call 回放 或者 调试工具，或者可以根据错误点返回信息进行简单判断

    发送交易失败 Error: MetaMask Tx Signature: User denied transaction signature. { "location": "confirmation", "cause": null

    这个报错其实并不是「链上失败」，而是 用户在 MetaMask 里点了拒绝 ✅。

        交易还没发到区块链 → 因为用户在 MetaMask 弹出的签名窗口里点了 "拒绝" 或 "Cancel"。
        所以没有 txHash、也不会在 Etherscan 里看到任何记录。
        "location": "confirmation" 表示是在等待用户确认阶段失败的。

    在 MetaMask 抛出的错误对象 里，并不是所有情况都会带上 error.code

    常见几种：

        用户拒绝签名
        MetaMask 官方定义的错误码是 4001（EIP-1193 标准）。
        有些旧版本或某些库封装后，错误对象里可能只有 message，没有 code。

        RPC 节点报错（比如余额不足、gas 估算失败等）
        这种一般有 code（-32000 之类），但也可能只有 message。

```js
catch (error) {
    // 1. 用户拒绝
    if (error.code === 4001 || error.message?.includes("User denied")) {
      console.error("❌ 交易已取消：用户拒绝签名");
      return null;
    }

    // 2. 余额不足
    if (error.message?.includes("insufficient funds")) {
      console.error("❌ 交易失败：余额不足");
      return null;
    }

    // 3. Gas 相关错误
    if (
      error.message?.includes("intrinsic gas too low") ||
      error.message?.includes("out of gas")
    ) {
      console.error("❌ 交易失败：Gas 设置不足");
      return null;
    }

    // 4. 其他未知错误
    console.error("❌ 交易失败:", error);
    return null;
  }
```

#### 交易结果查询：web3.eth.getTransactionReceipt(txHash)

```js
const searchTransaction = (txHash) => {
  try {
    // 方式 1: 跳转查询：调到 sepolia 测试网的查询网站进行查询
    // etherscan 的 tx 地址拼接
    // const url = `https://sepolia.etherscan.io/tx/${txHash}`;
    // window.open(url, "_blank");

    // 方式 2：获取交易信息 log 打印
    getTxReceipt(txHash);
  } catch (error) {
    console.error("查询交易失败", error);
  }
};

const getTxReceipt = async (txHash) => {
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      console.log("交易回执:", receipt);
      if (receipt.status) {
        console.log("✅ 交易成功");
      } else {
        console.log("❌ 交易失败");
      }
    } else {
      console.log("⏳ 交易还在打包中...");
    }
  } catch (error) {
    console.error("查询交易失败:", error);
  }
};
```

## 交易列表

    通过 Etherscan API 进行查询：需要去官网注册获取对应的api key 才可以

```js
const url = `${selectedNetwork.value.prefix}?module=account&action=txlist&address=${fromAddr.value}&startblock=0&endblock=99999999&page=${page.value}&offset=${pageSize}&sort=desc&apikey=${apiKey}`;
const res = await axios.get(url);
```
