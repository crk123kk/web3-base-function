<template>
  <div v-loading="pageLoading" class="page-content">
    <div class="page-title">
      <span class=""> 转账 </span>
    </div>
    <div class="page-main">
      <t-form :label-width="100">
        <t-form-item label="转入地址：" name="name">
          <t-input v-model="toAddress" placeholder="请输入转入地址" />
        </t-form-item>
        <t-form-item label="转账金额：" name="password">
          <t-input v-model="transNum" placeholder="请输入转账金额" />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" @click="sendTransactionBySign">
            发起签名交易
          </t-button>
          <t-button
            theme="danger"
            style="margin-left: 32px"
            @click="confirmInputKey"
          >
            发起私钥交易
          </t-button>
        </t-form-item>
        <t-form-item label="交易查询：" name="password" v-if="transactionHash">
          <span>{{ formatInfo(transactionHash, 8, 8) }}</span>
          <t-link
            theme="primary"
            style="margin-left: 32px"
            @click.native="searchTransaction(transactionHash)"
          >
            前往查询
          </t-link>
        </t-form-item>
      </t-form>
    </div>

    <t-dialog
      :visible="confirmVisible"
      @confirm="sendTransactionByPrivateKey"
      @cancel="confirmVisible = false"
      @close="confirmVisible = false"
    >
      <template #header>请输入私钥</template>
      <template #body>
        <t-input
          type="password"
          v-model="privateKey"
          :prefix-icon="renderPrefixIcon"
      /></template>
    </t-dialog>
  </div>
</template>

<script setup>
/*
    4、交易功能发起 ETH 转账（web3.eth.sendTransaction ）

        显示交易哈希、交易状态（确认数、成功/失败）。

        处理用户拒绝交易的错误。

        QA：完整的交易步骤
*/

import Web3 from "web3";
import Tx from "ethereumjs-tx";
import { onMounted, ref } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { formatInfo } from "@/utils/index";

const pageLoading = ref(false);

const web3 = new Web3(
  Web3.givenProvider ||
    "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
);

// 当前账户
const senderAddr = ref("");

// 转账目标地址
const toAddress = ref("");
// 转账金额
const transNum = ref("");
// 交易签名（发起查询的依据）
const transactionHash = ref("");

// 确认提示框
const confirmVisible = ref(false);

// 私钥
const privateKey = ref("");

onMounted(() => {
  getCurrentAccountInfo();
});

/*
  获取当前账户信息
*/
const getCurrentAccountInfo = async () => {
  // 获取当前账户
  const accounts = await web3.eth.getAccounts();
  senderAddr.value = accounts[0]; // 发送者地址
};

/**
 * 发送签名交易
 */
const sendTransactionBySign = async () => {
  try {
    if (!senderAddr.value) {
      MessagePlugin.error("请登录");
      return;
    }
    if (!toAddress.value) {
      MessagePlugin.error("请输入转账地址");
      return;
    }
    if (!transNum.value) {
      MessagePlugin.error("请输入转账金额");
      return;
    }
    // 获取当前账户
    const fromAddr = senderAddr.value;
    // 转账目标地址
    const toAddr = toAddress.value;
    // 转账金额（ETH 转 Wei）
    const amount = transNum.value;
    const amountInWei = web3.utils.toWei(amount, "ether");

    // 构建交易参数(最基本参数)
    const txParams = {
      from: fromAddr,
      to: toAddr,
      value: amountInWei,
    };

    pageLoading.value = true;
    // 发送交易（由 MetaMask 弹窗签名确认）
    // QA：sendTransaction
    const tranRes = await web3.eth.sendTransaction(txParams);
    pageLoading.value = false;
    MessagePlugin.success("交易成功");
    transactionHash.value = tranRes.transactionHash;
    searchTransaction(transactionHash.value);
  } catch (error) {
    MessagePlugin.error("发送交易失败");
    // 1. 用户拒绝
    if (error.code === 4001 || error.message?.includes("User denied")) {
      console.error("❌ 交易已取消：用户拒绝签名");
      return null;
    }

    // 2. 余额不足
    if (error.message?.includes("insufficient funds")) {
      console.error("❌ 交易失败：余额不足");
      return null;
    }

    // 3. Gas 相关错误
    if (
      error.message?.includes("intrinsic gas too low") ||
      error.message?.includes("out of gas")
    ) {
      console.error("❌ 交易失败：Gas 设置不足");
      return null;
    }

    // 4. 其他未知错误
    console.error("❌ 交易失败:", error);
    return null;
  }
};

/**
 * 发起交易查询
 */
const searchTransaction = (txHash) => {
  try {
    // 方式 1: 跳转查询：调到 sepolia 测试网的查询网站进行查询
    // etherscan 的 tx 地址拼接
    const url = `https://sepolia.etherscan.io/tx/${txHash}`;
    window.open(url, "_blank");

    // 方式 2：获取交易信息 log 打印
    // getTxReceipt(txHash);
  } catch (error) {
    console.error("查询交易失败", error);
  }
};

/**
 * 自查询交易信息
 */
const getTxReceipt = async (txHash) => {
  try {
    // QA: await web3.eth.getTransactionReceipt(txHash)
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) {
      console.log("交易回执:", receipt);
      if (receipt.status) {
        console.log("✅ 交易成功");
      } else {
        console.log("❌ 交易失败");
      }
    } else {
      console.log("⏳ 交易还在打包中...");
    }
  } catch (error) {
    console.error("查询交易失败:", error);
  }
};

const confirmInputKey = async () => {
  if (!senderAddr.value) {
    MessagePlugin.error("请登录");
    return;
  }
  if (!toAddress.value) {
    MessagePlugin.error("请输入转账地址");
    return;
  }
  if (!transNum.value) {
    MessagePlugin.error("请输入转账金额");
    return;
  }
  confirmVisible.value = true;
};
/**
 * 私钥交易：需要私钥
 */
const sendTransactionByPrivateKey = async () => {
  // 私钥
  const priKey = Buffer.from(privateKey.value, "hex");

  if (!priKey) {
    MessagePlugin.error("请输入转账私钥");
    return;
  }
  // 获取当前账户
  const fromAddr = senderAddr.value;
  // 转账目标地址
  const toAddr = toAddress.value;
  // 转账金额（ETH 转 Wei）
  const amount = transNum.value;
  const amountInWei = web3.utils.toWei(amount, "ether");

  // 交易次数（交易Id）
  const nonce = await web3.eth.getTransactionCount(fromAddr);

  // 获取当前 gasPrice
  const gasPrice = await web3.eth.getGasPrice();

  // 获取当前的 chainId
  const chainId = await web3.eth.getChainId();

  // 构建交易参数(最基本参数)
  const txParams = {
    from: fromAddr,
    to: toAddr,
    value: web3.utils.toHex(amountInWei),
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasPrice),
    chainId,
  };

  let gas = await web3.eth.estimateGas(txParams);
  txParams.gas = web3.utils.toHex(gas);

  // 创建交易对象
  const tx = new Tx(txParams);
  // 签名交易
  tx.sign(priKey);

  // 序列化交易：生成 serializedTx,有这个值才可以实现转账
  const serializedTx = tx.serialize();

  confirmVisible.value = false;
  pageLoading.value = true;

  // 发送交易
  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("transactionHash", (txId) => {
      // 可以通过这个交易Id 去 sepolia 上查交易记录
      console.log("交易Id:", txId);
    })
    .on("receipt", (tranRes) => {
      console.log("tranRes :>> ", tranRes);
      pageLoading.value = false;
      transactionHash.value = tranRes.transactionHash;
    })
    .on("error", (err) => {
      pageLoading.value = false;
      console.error("交易失败：", err);
    });
};
</script>
<style lang="less" scoped>
.page-main {
  width: 50%;
  margin: auto;
}
</style>
