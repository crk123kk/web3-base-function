<template>
  <div>
    <t-list>
      <t-list-item>
        当前账号地址：{{ formatInfo(currentAddress, 8, 8) }}
        <template #action>
          <t-link
            theme="primary"
            style="margin-left: 32px"
            @click="copyToClipboard(currentAddress)"
          >
            copy
          </t-link>
        </template>
      </t-list-item>
      <t-list-item>
        账户余额：{{ currentBalanceEth }} ETH
        <!-- <template #action>
          <t-link theme="primary" hover="color" style="margin-left: 32px">
            操作3
          </t-link>
        </template> -->
      </t-list-item>
    </t-list>
  </div>
</template>

<script setup>
import Web3 from "web3";
import { onMounted, ref } from "vue";
import { formatInfo, copyToClipboard } from "@/utils/index";
/**
    2 账户管理获取当前已连接的钱包地址。

        2.1、显示地址的简短版本（0xabc...def）。

        2.2、获取账户余额（web3.eth.getBalance 并格式化为 ETH）。

 */

const web3 = new Web3(
  Web3.givenProvider ||
    "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
);

onMounted(() => {
  getAccountInfo();
});

const currentAddress = ref("");
const currentBalanceEth = ref("");
/**
 * 获取账户信息
 */
const getAccountInfo = async () => {
  try {
    // QA：web3.eth.getAccounts()
    // 2.1、获取当前账户的地址
    const curAddrList = await web3.eth.getAccounts();
    currentAddress.value = curAddrList[0];

    // QA：web3.eth.getBalance()
    // 2.2、获取余额（单位：Wei）
    const balanceWei = await web3.eth.getBalance(currentAddress.value);
    // 转换成 ETH
    currentBalanceEth.value = web3.utils.fromWei(balanceWei, "ether");
  } catch (error) {
    console.error("获取余额失败", error);
  }
};
</script>
<style lang="less" scoped></style>
