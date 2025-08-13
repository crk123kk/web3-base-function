<template>
  <div>
    <p>
      <span>本地是否安装钱包：</span>
      <span>{{ isInstalled ? "是" : "否" }}</span>
    </p>
    <p>
      <span>是否连接了钱包：</span>
      <span>{{ isLinked ? "是" : "否" }}</span>
    </p>
    <button v-if="!isLinked" @click="linkAccount">连接钱包</button>
    <button v-if="isLinked" @click="revoke">断开连接</button>
  </div>
</template>

<script setup>
import { setupEthereumListeners } from "@/utils";
import { onMounted, ref } from "vue";
import Web3 from "web3";
/**
    1、钱包连接

        支持 MetaMask、Brave Wallet、Coinbase Wallet 等常见钱包。

        支持检测钱包是否安装 (typeof window.ethereum !== "undefined" 或 Web3.givenProvider)。

        一键连接钱包（eth_requestAccounts）。

        自动监听账号和网络切换事件（accountsChanged、chainChanged）。
 */

const isInstalled = ref(false);
const isLinked = ref(false);
// 实例化web3
// QA: new Web3()
const web3 = new Web3(
  Web3.givenProvider ||
    "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
);

onMounted(() => {
  // QA: window.ethereum.on()
  setupEthereumListeners();
  getIsInstall();
  resetInfo();
});

const resetInfo = () => {
  getIsLinked();
};

/**
 * 判断是否安装钱包
 */
const getIsInstall = () => {
  // QA：window.ethereum
  isInstalled.value = typeof window.ethereum !== undefined;
};

/**
 * 判断是否连接钱包
 */
const getIsLinked = async () => {
  // QA： web3.eth.getAccounts()
  const accounts = await web3.eth.getAccounts();
  isLinked.value = accounts && accounts.length > 0;
};
/**
 * 连接钱包
 */
const linkAccount = async () => {
  let accounts = null;
  try {
    // QA: ethereum.request()
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.log(error);
  }
  resetInfo();
};
/**
 * 撤销 MetaMask 授权
 */
const revoke = async () => {
  try {
    // QA: wallet_revokePermissions（断开连接）
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }],
    });
    console.log("MetaMask 授权已撤销");
  } catch (err) {
    console.error(err);
  }
  resetInfo();
};
</script>
<style lang="less" scoped></style>
