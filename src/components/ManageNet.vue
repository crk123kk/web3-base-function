<template>
  <div class="page-content">
    <div class="page-title">
      <span class=""> 网络信息： </span>
    </div>
    <div class="page-main">
      <t-row :gutter="20">
        <t-col :span="4">
          <t-space
            ><span>当前 chinaId：</span>
            <span>：{{ currentChinId }} </span></t-space
          >
        </t-col>
        <t-col :span="4">
          <t-space>
            <span>请选择要切换的网络</span>
            <t-select
              placeholder="请选择要切换的网络"
              value-type="object"
              clearable
              :options="netIdList"
              @change="handleChange"
            ></t-select>
            <t-link
              theme="primary"
              style="margin-left: 32px"
              @click="switchNetwork(selectedOption.value, selectedOption.param)"
            >
              确认切换
            </t-link></t-space
          >
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script setup>
import Web3 from "web3";
import { onMounted, ref } from "vue";
import { netIdList } from "@/assets/config";

const web3 = new Web3(
  Web3.givenProvider ||
    "wss://sepolia.infura.io/ws/v3/a12179495f334c078af782cd44dc7df2"
);

const selectedOption = ref(null);

const currentChinId = ref("");

const handleChange = (selected, content) => {
  selectedOption.value = content.selectedOptions[0];
};

onMounted(() => {
  getCurrentChainId();
});
const getCurrentChainId = async () => {
  try {
    // QA： web3.eth.getChainId()
    currentChinId.value = await web3.eth.getChainId();
  } catch (err) {
    console.error("获取 chainId 失败:", err);
  }
};

/**
 * 一键切换网络
 * @param {number} chainIdDecimal - 十进制 Chain ID
 * @param {object} addNetworkParams - 可选，钱包中没有该网络时用来添加网络的参数
 */
async function switchNetwork(chainIdDecimal, addNetworkParams = null) {
  if (!window.ethereum) {
    console.error("未检测到钱包");
    return;
  }

  // 转为十六进制，带 0x 前缀
  const chainIdHex = "0x" + chainIdDecimal.toString(16);

  try {
    // QA: wallet_switchEthereumChain
    // 请求切换网络
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    console.log(`成功切换到网络: ${chainIdHex}`);
  } catch (error) {
    // 钱包中没有该网络
    if (error.code === 4902 && addNetworkParams) {
      console.log("钱包中没有该网络，尝试添加网络...");
      try {
        // QA: wallet_addEthereumChain
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [addNetworkParams],
        });
        console.log("网络添加成功，请手动切换或再次调用切换");
      } catch (addError) {
        console.error("添加网络失败:", addError);
      }
    } else {
      console.error("切换网络失败:", error);
    }
  }
}
</script>
