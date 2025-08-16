<template>
  <div v-loading="pageLoading">
    <t-list>
      <t-list-item>转账：</t-list-item>
      <t-list-item>
        可转账最大余额：
        <template #action> {{ maxTransNum }} </template>
      </t-list-item>
      <t-list-item>
        转入地址：
        <template #action>
          <t-input v-model="toAddress" placeholder="请输入转入地址" />
        </template>
      </t-list-item>
      <t-list-item>
        转账金额：
        <template #action>
          <t-input v-model="transNum" placeholder="请输入转账金额" />
        </template>
      </t-list-item>

      <t-list-item>
        发起签名交易：
        <template #action>
          <t-link
            theme="primary"
            style="margin-left: 32px"
            @click="sendTransactionBySign"
          >
            确认交易
          </t-link>
        </template>
      </t-list-item>
      <t-list-item>
        发起私钥交易（需要私钥构建交易，注意私钥隐私）：
        <template #action>
          <t-link
            theme="primary"
            style="margin-left: 32px"
            @click="confirmInputKey"
          >
            确认交易
          </t-link>
        </template>
      </t-list-item>
      <t-list-item v-if="transactionHash">
        交易查询：{{ formatInfo(transactionHash, 8, 8) }}
        <template #action>
          <t-link
            theme="primary"
            style="margin-left: 32px"
            @click.native="searchTransaction(transactionHash)"
          >
            前往查询
          </t-link>
        </template>
      </t-list-item>
    </t-list>

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
// 最大可转账余额
const maxTransNum = ref(0);
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

  // 获取当前账户可转账余额
  maxTransNum.value = await getMaxTransNum(senderAddr.value);
};

/**
 *
 * @param fromAddress 当前账号地址：转账账号
 * @param gasLimit
 *      gasLimit 不是固定的
 *      普通 ETH 转账 21000 是对的 （普通转账（ETH），并且计算最大可用余额——最大可转账数目）
 *      如果是 合约调用 / ERC20 转账，gasLimit 会更高（几万~几十万）。（这时候就需要动态计算——因为 gasPrice 会变化的）
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
    return "0"; // 余额不足
  }

  const transferableWei = balanceWei - estimatedFeeWei;

  // 5. 转换为 ETH
  return web3.utils.fromWei(transferableWei.toString(), "ether");
};

/**
 * 发送签名交易(不需要dialog了，因为会钱包会弹出提示)
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

    // 发送交易（由 MetaMask 弹窗签名确认）
    const tranRes = await web3.eth.sendTransaction(txParams);
    MessagePlugin.success("交易成功");
    transactionHash.value = tranRes.transactionHash;
    // 刷新数据(刷新数据就会导致交易查询的tx不见，需要一个全局状态更新库)
    // window.location.reload();
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
    // const url = `https://sepolia.etherscan.io/tx/${txHash}`;
    // window.open(url, "_blank");

    // 方式 2：获取交易信息 log 打印
    getTxReceipt(txHash);
  } catch (error) {
    console.error("查询交易失败", error);
  }
};

/**
 * 自查询交易信息
 */
const getTxReceipt = async (txHash) => {
  try {
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
 *   通过私钥创建交易对象，私钥的获取可以是自己输入，也可以是当时创建钱包的时候保存在服务器等，但是，不管哪种，私钥的隐秘性是很重要的！！！
 *   只有通过私钥自行生成签名，才可以不需要通过浏览器钱包插件进行签名确认
 */
const sendTransactionByPrivateKey = async () => {
  // 私钥（注意：测试用，实际不要明文存放！）
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

  // getTransactionCount：用于获取 nonce，它是每个以太坊账户发出的交易计数器
  // 每发起一笔交易，nonce 就会 +1，可以用来确认交易是哪笔
  const nonce = await web3.eth.getTransactionCount(fromAddr);

  // 获取当前 gasPrice
  const gasPrice = await web3.eth.getGasPrice();
  // 设置 ETH 转账最低 21000
  // ethereumjs-tx 里不认 gasLimit，它要的 key 是 gas
  const gasLimit = 21000;

  // 获取当前的 chainId
  // chainId 是 以太坊网络的唯一标识符，用于区分不同的链。它是交易签名的一部分，用来防止同一笔交易在其他链上被重复使用（重放攻击）。
  const chainId = await web3.eth.getChainId();

  // gasPrice, nonce, value, gas 都要用 十六进制字符串（BN 转 hex），而不是 JS 的 number

  // 构建交易参数(最基本参数)
  const txParams = {
    from: fromAddr,
    to: toAddr,
    value: web3.utils.toHex(amountInWei),
    nonce: web3.utils.toHex(nonce),
    // gas: web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(gasPrice),
    chainId,
  };

  // 需要将交易的数据进行预估 gas，然后将gas 设置到 rawTx 中
  // 除了ETH之间交易是固定值21000外，很多情况下这个值会根据交易内容而变化，所以我们通常需要去计算它
  // 并且为了获得更好的成功率，可能还会对它进行1.1倍这样的加成
  let gas = await web3.eth.estimateGas(txParams);
  txParams.gas = web3.utils.toHex(gas);

  // 创建交易对象：ethereumjs-tx 实现私钥加密
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
<style lang="less" scoped></style>
