import { MessagePlugin } from "tdesign-vue-next";
/**
 * 配置 Ethereum 监听器, 监听钱包连接、断开连接、账户切换、网络切换
 * @returns void
 */
export const setupEthereumListeners = () => {
  if (!window.ethereum) return;
  console.log("1111");

  // 监听钱包连接（MetaMask 会在 eth_requestAccounts 时触发）
  // 这里要理解一点的是：这个connect是连接钱包，而不是所谓的账户切换！！！这个很重要
  window.ethereum.on("connect", (info) => {
    console.log("钱包连接成功:", info.chainId);
    MessagePlugin.success("钱包连接成功");
  });

  // 断开连接
  window.ethereum.on("disconnect", (error) => {
    console.warn("钱包断开连接:", error);
    MessagePlugin.error("钱包断开连接");
  });

  // 监听账户变动（包括首次连接）
  // MetaMask 的限制导致“切到未连接账号”不会被推送事件。要解决，就得额外加轮询检测来补这个缺口。
  window.ethereum.on("accountsChanged", (accounts) => {
    // accountsChanged 事件可能会返回空数组，表示用户断开了所有账户授权，需要处理这种情况
    try {
      if (accounts.length === 0) {
        console.log("用户断开所有账户");
        MessagePlugin.error("用户断开所有账户");
      } else {
        console.log("账户切换，当前账户:", accounts);
        MessagePlugin.info("账户切换，当前账户");
      }
    } catch (e) {
      console.error("accountsChanged 处理异常", e);
    }
  });

  // 网络变化
  window.ethereum.on("chainChanged", (chainId) => {
    try {
      console.log("网络切换到", chainId);
      MessagePlugin.info("网络切换了", chainId);
      // chainChanged 事件触发时建议刷新页面，因为合约地址、链上状态可能发生变化。(应该做个延迟刷新，如果有全局状态需要更新)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.error("chainChanged 处理异常", e);
    }
  });
};

export const detectWallets = () => {
  const wallets = [];

  // MetaMask
  if (window.ethereum && window.ethereum.isMetaMask) wallets.push("MetaMask");

  // Coinbase Wallet Extension
  if (window.coinbaseWalletExtension) wallets.push("Coinbase Wallet");

  // Trust Wallet
  if (window.ethereum && window.ethereum.isTrust) wallets.push("Trust Wallet");

  // Binance Chain Wallet
  if (window.BinanceChain) wallets.push("Binance Chain Wallet");

  // Frame Wallet
  if (window.ethereum && window.ethereum.isFrame) wallets.push("Frame Wallet");

  // OKX Wallet
  if (window.ethereum && window.ethereum.isOkxWallet)
    wallets.push("OKX Wallet");
  if (window.okxwallet) wallets.push("OKX Wallet");

  // Tally Wallet
  if (window.ethereum && window.ethereum.isTally) wallets.push("Tally");

  return wallets;
};
