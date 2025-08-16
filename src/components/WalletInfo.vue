<template>
  <div class="page-content">
    <div class="page-title">
      <span class=""> 钱包信息： </span>
    </div>
    <div class="page-main">
      <t-row :gutter="20">
        <t-col :span="4">
          <t-space>
            <span>本地是否安装钱包：</span>
            <t-switch v-model="isInstalled" size="large" disabled>
              <template #label="slotProps">{{
                slotProps.value ? "是" : "否"
              }}</template>
            </t-switch>
          </t-space>
        </t-col>
        <t-col :span="4"
          ><t-space>
            <span>是否连接了钱包：</span>
            <t-switch v-model="isLinked" size="large" @change="onChange">
              <template #label="slotProps">{{
                slotProps.value ? "连接" : "断开"
              }}</template>
            </t-switch>
          </t-space>
        </t-col>
        <t-col :span="4">
          <t-space>
            <span>已经安装的钱包列表：</span>
            <t-select
              v-model="selectWallet"
              :options="walletOptions"
              placeholder="请选择要使用的钱包"
              clearable
            ></t-select>
          </t-space>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script setup>
import Web3 from "web3";
import { setupEthereumListeners } from "@/utils";
import { onMounted, ref } from "vue";
import { detectWallets } from "@/utils";
/**
    1、钱包连接

        支持 MetaMask、Brave Wallet、Coinbase Wallet 等常见钱包。钱包列表

        支持检测钱包是否安装 (typeof window.ethereum !== "undefined" 或 Web3.givenProvider)。

        一键连接钱包（eth_requestAccounts）。

        自动监听账号和网络切换事件（accountsChanged、chainChanged）。
 */

const walletOptions = ref([]);
const selectWallet = ref("");
const isInstalled = ref(false);
const isLinked = ref(false);
// 实例化web3
// QA: new Web3()
const web3 = new Web3(
  Web3.givenProvider ||
    "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
);

onMounted(() => {
  getWalletList();
  // QA: window.ethereum.on()
  setupEthereumListeners();
  getIsInstall();
  resetInfo();
});

const resetInfo = () => {
  getIsLinked();
};

/**
 * 获取当前浏览器安装的钱包列表
 */
const getWalletList = () => {
  const walletList = detectWallets();
  walletOptions.value = walletList.map((wallet) => ({
    content: wallet,
    value: wallet,
  }));
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
 * 连接和断开钱包
 */
const onChange = (val) => {
  if (val) {
    linkAccount();
  } else {
    revoke();
  }
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
<style lang="less" scoped>
.page-content {
  margin: 20px 0;
  .page-title {
    text-align: center;
    margin-bottom: 16px;
    span {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
    }
  }
}
</style>
