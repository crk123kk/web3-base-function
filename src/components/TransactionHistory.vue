<template>
  <div>
    <t-space direction="vertical" style="width: 100%">
      <t-form :label-width="60">
        <t-form-item label="查询私钥">
          <!-- 私钥 -->
          <t-input v-model="apiKey"></t-input>
        </t-form-item>
        <t-form-item label="选择网络">
          <!-- 网络选择 -->
          <t-select
            v-model="selectedNetwork.value"
            :options="networks"
            label="name"
            value="value"
            @change="changeNetwork"
            placeholder="选择网络"
            style="width: 200px"
          />
        </t-form-item>
        <t-form-item>
          <t-button @click="handleSearch">查询</t-button>
        </t-form-item>
      </t-form>

      <!-- 交易表格 -->
      <t-table
        :columns="columns"
        :data="transactions"
        :loading="loading"
        bordered
      >
        <template #hash="{ row }">
          <t-link
            :href="etherscanLink(row.hash)"
            target="_blank"
            style="color: blue"
          >
            {{ formatInfo(row.hash, 8, 8) }}
          </t-link>
        </template>

        <template #timeStamp="{ row }">
          {{ formatTime(row.timeStamp) }}
        </template>

        <template #from="{ row }">
          {{ formatInfo(row.from, 8, 8) }}
        </template>

        <template #to="{ row }">
          {{ formatInfo(row.to, 8, 8) }}
        </template>

        <template #value="{ row }">
          {{ formatEth(row.value) }}
        </template>

        <template #isError="{ row }">
          {{ row.isError === "0" ? "✅ 成功" : "❌ 失败" }}
        </template>
      </t-table>

      <!-- 分页 -->
      <t-space>
        <t-button :disabled="page === 1" @click="prevPage">上一页</t-button>
        <span>第 {{ page }} 页</span>
        <t-button :disabled="transactions.length < pageSize" @click="nextPage">
          下一页
        </t-button>
      </t-space>
    </t-space>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Web3 from "web3";
import axios from "axios";
import { formatInfo } from "@/utils";
import { MessagePlugin } from "tdesign-vue-next";

// 初始化 web3
const web3 = new Web3(
  Web3.givenProvider || "https://sepolia.infura.io/v3/你的InfuraKey"
);

// 用户地址
const fromAddr = ref("");

// Etherscan API Key
// const apiKey = "G2YF47XVBEGIPGS1SAADMBWW3K1YKE8RR7";
const apiKey = ref("");

// 分页
const page = ref(1);
const pageSize = 10;

// 网络列表
const networks = [
  {
    name: "Sepolia",
    value: "sepolia",
    prefix: "https://api-sepolia.etherscan.io/api",
    etherscan: "https://sepolia.etherscan.io",
  },
  {
    name: "Goerli",
    value: "goerli",
    prefix: "https://api-goerli.etherscan.io/api",
    etherscan: "https://goerli.etherscan.io",
  },
  {
    name: "Ethereum Mainnet",
    value: "mainnet",
    prefix: "https://api.etherscan.io/api",
    etherscan: "https://etherscan.io",
  },
];

const selectedNetwork = ref(networks[0]);

// 交易列表
const transactions = ref([]);
const loading = ref(false);
const error = ref("");

// 表格列
const columns = [
  { title: "Hash", colKey: "hash" },
  { title: "时间", colKey: "timeStamp" },
  { title: "From", colKey: "from" },
  { title: "To", colKey: "to" },
  { title: "金额(ETH)", colKey: "value" },
  { title: "状态", colKey: "isError" },
];

// 获取当前账户
const getAccount = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    fromAddr.value = accounts[0] || "";
  } catch (err) {
    console.error("获取账户失败", err);
  }
};

// 格式化函数
const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleString();
const formatEth = (wei) => web3.utils.fromWei(wei, "ether");
const etherscanLink = (hash) => `${selectedNetwork.value.etherscan}/tx/${hash}`;

/**
 * 查询交易记录
 */
const fetchTxHistory = async () => {
  if (!fromAddr.value) return;
  loading.value = true;
  error.value = "";
  try {
    const url = `${selectedNetwork.value.prefix}?module=account&action=txlist&address=${fromAddr.value}&startblock=0&endblock=99999999&page=${page.value}&offset=${pageSize}&sort=desc&apikey=${apiKey.value}`;
    const res = await axios.get(url);

    if (res.data.status === "1") {
      transactions.value = res.data.result;
    } else {
      transactions.value = [];
      error.value = res.data.message || "查询失败";
      console.error(error.value);
    }
  } catch (err) {
    transactions.value = [];
    error.value = err.message;
    console.error("查询异常:", err);
  } finally {
    loading.value = false;
  }
};

// 切换网络
const changeNetwork = () => {
  page.value = 1;
};

// 翻页
const prevPage = () => {
  if (page.value > 1) page.value--;
};
const nextPage = () => {
  if (transactions.value.length === pageSize) page.value++;
};

// 监听 page 和网络变化
watch([page, selectedNetwork], fetchTxHistory, { immediate: true, deep: true });

// 页面初始化
onMounted(async () => {
  await getAccount();
});

const handleSearch = async () => {
  if (!apiKey.value) {
    MessagePlugin.error("请输入私钥");
    return;
  }
  await fetchTxHistory();

  // 自动刷新
  // setInterval(fetchTxHistory, 15000);
};
</script>

<style scoped>
span {
  margin: 0 8px;
}
</style>
