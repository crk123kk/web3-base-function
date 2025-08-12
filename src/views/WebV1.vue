<template>
  <div>web3.js基础功能</div>
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
  </div>
</template>

<script setup>
import { setupEthereumListeners } from "@/utils";
import { onMounted, ref } from "vue";
import Web3 from "web3";

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
  judgeIsInstall();
  judgeIsLinked();
});

const judgeIsInstall = () => {
  // QA：window.ethereum
  isInstalled.value = typeof window.ethereum !== undefined;
};

const judgeIsLinked = async () => {
  // QA： web3.eth.getAccounts()
  const accounts = await web3.eth.getAccounts();
  return accounts && accounts.length > 0;
};

const linkAccount = async () => {
  let accounts = null;
  try {
    // QA: ethereum.request()
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.log(error);
  }
  isLinked.value = accounts && accounts.length > 0;
};
</script>
<style lang="less" scoped></style>
