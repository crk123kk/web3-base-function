<template>
  <t-space direction="vertical">
    <t-select
      v-model="selectWallet"
      :options="walletOptions"
      placeholder="请选择要使用的钱包"
      clearable
    ></t-select>
    <div>web3.js基础功能</div>
    <LinkAccount></LinkAccount>
  </t-space>
</template>

<script setup>
import LinkAccount from "@/components/LinkAccount.vue";
import { detectWallets } from "@/utils";
import { onBeforeMount, ref } from "vue";

const walletOptions = ref([]);
const selectWallet = ref("");

onBeforeMount(() => {
  const walletList = detectWallets();
  console.log("walletList :>> ", walletList);
  walletOptions.value = walletList.map((wallet) => ({
    content: wallet,
    value: wallet,
  }));
});
</script>
<style lang="less" scoped></style>
