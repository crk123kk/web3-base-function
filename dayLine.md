# todo

    头部：可以参考metaMask的网页版本（同步功能）——我自己的钱包切换账号同步于浏览器

        切换网络、切换账号、切换钱包

        当存在多个浏览器插件的时候，如何防止冲突，能够唤醒指定钱包，并且操作的时候也是指定的钱包

            metaMask coinbase wallet、trust wallet

    显示多币种余额（通过调用 Token 合约 balanceOf）。只能通过对应合约来获取余额

    发起 Token 转账（调用 ERC20 合约 transfer）。

    刷新数据(刷新数据就会导致交易查询的tx不见，需要一个全局状态更新库)而不是都是通过 window.location.reload();

# 2025.08.14

    1、钱包连接

        1.1、判断当前浏览器支持的钱包插件

        1.2、添加提示信息并更新状态（切换账号、切换网络）

        1.3、添加连接钱包、取消钱包授权功能

# 2025.08.15

    2、账户管理获取当前已连接的钱包地址

        2.1、显示地址的简短版本（0xabc...def）。

        2.2、获取账户余额（web3.eth.getBalance 并格式化为 ETH）。

# 2025.08.15

    3、网络管理检测当前网络 ID 和网络名称

        支持一键切换网络（wallet_switchEthereumChain）。

        支持添加自定义网络（wallet_addEthereumChain）。

# 2025.08.16

    4、交易功能发起 ETH 转账（web3.eth.sendTransaction ）

        显示交易哈希、交易状态（确认数、成功/失败）。

        处理用户拒绝交易的错误。

        签名交易

        私钥交易
