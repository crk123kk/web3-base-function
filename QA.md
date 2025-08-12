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
