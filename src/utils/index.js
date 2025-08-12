/**
 * 配置 Ethereum 监听器, 监听钱包连接、断开连接、账户切换、网络切换
 * @returns void
 */
export const setupEthereumListeners = () => {
  if (!window.ethereum) return;

  // 监听钱包连接（MetaMask 会在 eth_requestAccounts 时触发）
  window.ethereum.on("connect", (info) => {
    console.log("钱包连接成功:", info.chainId);
  });

  // 断开连接
  window.ethereum.on("disconnect", (error) => {
    console.warn("钱包断开连接:", error);
  });

  // 监听账户变动（包括首次连接）
  window.ethereum.on("accountsChanged", (accounts) => {
    // accountsChanged 事件可能会返回空数组，表示用户断开了所有账户授权，需要处理这种情况
    try {
      if (accounts.length === 0) {
        console.log("用户断开所有账户");
      } else {
        console.log("账户切换，当前账户:", accounts);
      }
    } catch (e) {
      console.error("accountsChanged 处理异常", e);
    }
  });

  // 网络变化
  window.ethereum.on("chainChanged", (chainId) => {
    try {
      console.log("网络切换到", chainId);
      // chainChanged 事件触发时建议刷新页面，因为合约地址、链上状态可能发生变化。
      window.location.reload();
    } catch (e) {
      console.error("chainChanged 处理异常", e);
    }
  });
};
