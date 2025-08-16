<template>
  <div class="page-content">
    <div class="page-title">
      <span class=""> 钱包信息 </span>
    </div>
    <div class="page-main">
      <t-row :gutter="20">
        <t-col :span="4">
          <t-space>
            <span>当前账号地址：</span>
            <span>{{ formatInfo(currentAddress, 8, 8) }}</span>
            <t-link
              theme="primary"
              style="margin-left: 32px"
              @click="copyToClipboard(currentAddress)"
            >
              copy
            </t-link>
          </t-space>
        </t-col>
        <t-col :span="4">
          <t-space>
            <span>账户余额：</span>
            <span>{{ currentBalanceEth }} ETH</span>
          </t-space>
        </t-col>
        <t-col span="4">
          <t-space style="text-align: center">
            <span>可转账最大余额：</span>
            <span>{{ maxTransNum }} </span>
          </t-space>
        </t-col>
      </t-row>
    </div>
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
const currentAddress = ref("");
const currentBalanceEth = ref("");
// 最大可转账余额
const maxTransNum = ref(0);

onMounted(() => {
  getAccountInfo();
});

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

    // 获取当前账户可转账余额
    await getMaxTransNum(currentAddress.value);
  } catch (error) {
    console.error("获取账户信息失败", error);
  }
};

/**
 * QA：获取当前账户可转账余额
 * @param fromAddress 当前账号地址：转账账号
 * @param gasLimit 交易手续费
 */
const getMaxTransNum = async (fromAddress, gasLimit = 21000) => {
  // 1. 查询余额（单位：wei）
  const balanceWei = BigInt(await web3.eth.getBalance(fromAddress));

  // 2. 查询当前 gasPrice（单位：wei）
  const gasPriceWei = BigInt(await web3.eth.getGasPrice());

  // 3. 计算 gas 费用 = gasLimit * gasPrice
  const estimatedFeeWei = gasPriceWei * BigInt(gasLimit);

  // 4. 可转金额 = 余额 - gas费（必须大于0）
  if (balanceWei <= estimatedFeeWei) {
    maxTransNum.value = "0"; // 余额不足
  }

  const transferableWei = balanceWei - estimatedFeeWei;

  // 5. 转换为 ETH
  maxTransNum.value = web3.utils.fromWei(transferableWei.toString(), "ether");
};
</script>
