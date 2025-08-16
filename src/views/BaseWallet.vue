<template>
  <div class="base-wallet">
    <div class="page-header">web3.js基础功能</div>
    <div class="page-content">
      <WalletInfo></WalletInfo>
      <t-divider></t-divider>
      <ManageNet></ManageNet>
      <t-divider></t-divider>
      <AccountInfo></AccountInfo>
      <t-divider></t-divider>
      <SendTransaction></SendTransaction>
      <t-divider></t-divider>
      <TransactionHistory></TransactionHistory>
    </div>
  </div>
</template>

<script setup>
import AccountInfo from "@/components/AccountInfo.vue";
import WalletInfo from "@/components/WalletInfo.vue";
import ManageNet from "@/components/ManageNet.vue";
import SendTransaction from "@/components/SendTransaction.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
</script>
<style lang="less">
.base-wallet {
  width: 80%;
  margin: auto;
  .page-header {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #2c3e50;
  }
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
    .page-main {
      text-align: left;
    }
  }
}
</style>
