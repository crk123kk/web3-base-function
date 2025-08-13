import { createApp } from "vue";
import TDesign from "tdesign-vue-next";
import App from "./App.vue";
import router from "./router";

// 引入组件库的少量全局样式变量
import "tdesign-vue-next/es/style/index.css";

createApp(App).use(router).use(TDesign).mount("#app");
