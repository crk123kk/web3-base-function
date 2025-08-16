## ERROR Failed to compile with 2 errors 14:24:30 error in ./node_modules/cipher-base/index.js Module not found: Error: Can't resolve 'stream' in 'D:\code\web3CodeGitHub\web3-base-function\node_modules\cipher-base' BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case. Verify if you need this module and configure a polyfill for it. If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }' - install 'stream-browserify' If you don't want to include a polyfill, you can use an empty module like this: resolve.fallback: { "stream": false }

    你遇到的错误是 Webpack 5+ 默认不再为 Node.js 核心模块自动提供 polyfill 导致的。
    这是在前端使用 Web3 或 ethereumjs-tx 类库时很常见的问题，因为这些库依赖 Node.js 模块（比如 stream、crypto、buffer 等）。

    可以参考 QA：sendSignedTransaction 解决

## 发送交易失败 Error: MetaMask Tx Signature: User denied transaction signature. { "location": "confirmation", "cause": null

    交易失败：参考QA：交易错误提示
