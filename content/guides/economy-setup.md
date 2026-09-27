---
id: economy-setup
title: 经济系统搭建：从零让服务器「有钱」
description: EssentialsX 管钱、Vault 当接口、商店当消费方 — 三者关系、EssentialsX 经济最小配置、免费商店插件选型（QuickShop-Hikari 实测），以及 Vault 与 VaultUnlocked 的取舍。
icon: 💰
tags: [经济, 货币, Vault, 商店, EssentialsX]
order: 7
---

# 经济系统搭建：从零让服务器「有钱」

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。文中所有配置键、命令、权限节点均对照插件真实 jar 核对过。
>
> 本页承诺：**只推荐免费 / 开源插件**，版本号与下载地址都可追溯。

很多新手服主对「经济系统」的第一反应是：装个经济插件、再装个商店插件，齐活。

结果往往是：钱能显示但商店读不到、或 `/vault-info` 一片 `None`、或装了两个经济插件后余额开始错乱。

问题不在插件，而在**没搞清这三者的分工**。这篇教程先讲关系，再给配置，最后给一套能直接抄的落地流程。

---

## 一、先搞清三者关系（全文最关键的一节）

服务器里的「经济」从来不是一个插件，而是**三个角色**配合出来的：

| 角色 | 代表插件 | 干什么 | 类比 |
|------|---------|--------|------|
| **① 真正持有余额的人（提供方）** | **EssentialsX**（自带经济模块） | 记账：谁有多少钱、加钱、扣钱、排行、转账 | 银行本体 |
| **② 通用接口（桥）** | **Vault** | 把「①的余额」翻译成一套所有插件都认的调用方式 | 柜台 / 转接头 |
| **③ 消费方** | **QuickShop-Hikari**、ChestShop、Jobs 等 | 通过接口读写余额，实现买、卖、工资、税收 | 商户 |

一句话概括：

```
EssentialsX  = 真正有钱的那位（数据在它手里）
Vault        = 让别人也能用这笔钱的标准接口（自己没钱）
商店/任务插件 = 花钱、收钱的商户（自己也不存余额）
```

### 「只装 EssentialsX 能不能用经济系统？」——能，而且完全够用

这是新手最容易走进的误区。答案是：**只装 EssentialsX，经济系统就已经能跑**。

- `/balance`、`/pay`、`/eco`、`/baltop`、`/sell`、`/worth` 全部由 EssentialsX 自己实现，**不依赖 Vault**；
- 玩家之间转账、服主发钱、财富排行、把物品卖给系统，都不需要 Vault。

**那什么时候才需要 Vault？**

> 当你装了**依赖 Vault 的「消费方」插件**（商店、任务、领地收费、点券……）时，才需要 Vault。因为这些插件自己不会记账，只能通过 Vault 去读 EssentialsX 的余额。

判断方法：打开某个插件的 `plugin.yml`，如果里面有 `depend: [Vault]` 或 `softdepend: [Vault]`，它就属于「消费方」——这类插件多一个，Vault 的必要性就高一分。

```
只装 EssentialsX                        → 不需要 Vault
EssentialsX + 商店 / 任务 / 依赖 Vault 的插件 → 需要 Vault
```

> 更完整的 Vault 说明见 [Vault 插件页](#/plugin/vault)，EssentialsX 侧见 [EssentialsX 教程](#/plugin/essentialsx)。两页口径与本页一致：**EssentialsX 不依赖 Vault 也能独立工作；Vault 只是让别的插件读经济。**

---

## 二、最小可用配置：把 EssentialsX 经济调顺手

装好 EssentialsX（下载与安装见 [EssentialsX 教程](#/plugin/essentialsx)）后，配置都在：

```
plugins/Essentials/config.yml
```

> 目录名是 **`Essentials`**（不是 `EssentialsX`）。改错了位置，是「改了没生效」的头号原因。

经济相关段落集中在文件的中部（`##### Economy #####` 区块）。下面每一条的**键名与默认值都取自 EssentialsX 2.22.0 的真实 config.yml**，可以直接对照你的文件：

```yaml
# ───────── 经济系统（EssentialsX 2.22.0 真实键名）─────────

# 新玩家首次进服的初始余额
starting-balance: 0

# 货币符号，显示在金额「前面」
currency-symbol: '$'
# 改成 true → 符号显示在金额「后面」（欧元习惯，如 100€）
currency-symbol-suffix: false

# 玩家余额上限（防经济溢出 / 防刷钱把数字撑爆）
max-money: 10000000000000

# 玩家余额下限。负数 = 允许透支 / 贷款
# 玩家需要有 essentials.eco.loan 权限才能真的拥有负余额
min-money: -10000

# /pay 的最小转账金额（防止有人用 0.0001 反复刷屏刷记录）
minimum-pay-amount: 0.001

# /baltop 是否显示余额 ≤ 0 的玩家（详见后文「常见坑」）
show-zero-baltop: true

# 记录买卖 / 交易告示牌的经济日志（默认关闭）
economy-log-enabled: false

# 是否允许潜行时用告示牌批量买卖
allow-bulk-buy-sell: true
```

### 新手该怎么改？一张表看完

| 键名 | 默认值 | 推荐值（生存服） | 说明 |
|------|--------|------------------|------|
| `starting-balance` | `0` | `0` 或 `100` | 想给新人「启动资金」就设 100 |
| `currency-symbol` | `'$'` | 随你（`'¥'`、`'金币'` 都行） | 支持中文，但文件必须存成 UTF-8 |
| `max-money` | `10000000000000` | 保持默认 | 一万亿足够，改小会挡住恶意刷钱 |
| `min-money` | `-10000` | 不需要贷款就设 `0` | **设 0 = 彻底关闭透支** |
| `minimum-pay-amount` | `0.001` | `1` 或 `10` | 防止 0.001 级别的转账刷屏 |
| `show-zero-baltop` | `true` | `true` | 见后文坑 4 |

### 为什么 `min-money` 是负数？——透支 / 贷款

`min-money: -10000` 的意思是：一个玩家**最多可以欠到 -10000**。

- 这为「贷款」「透支」玩法留了口子；
- 但光把配置设成负数还不够，玩家还必须拥有权限节点 **`essentials.eco.loan`**，否则到 0 就被卡住，扣不动；
- **不想要贷款？** 直接把 `min-money` 设成 `0`，透支功能即被完全关闭。

> 官方注释原文：*"Setting this to 0 will disable overdrafts/loans completely. Players need 'essentials.eco.loan' permission to have a negative balance."*

### 改完记得生效

```
/ess reload
```

（`/ess` 是 `/essentials` 的官方别名。）改了 `show-zero-baltop` 后，还需要让排行重算：

```
/baltop force
```

---

## 三、从零到能用：一条落地流程

严格按顺序做，每一步都有验证，做完一步确认一步。

### 步骤 1：装 EssentialsX（经济提供方）

下载 EssentialsX 的三个 jar（`EssentialsX.jar` + `EssentialsXChat.jar` + `EssentialsXSpawn.jar`），放进 `plugins/`，重启。

验证：控制台出现 `Loading Essentials 2.22.0`，且游戏内 `/balance` 能返回你自己的余额。

### 步骤 2：改 config.yml（最小配置）

按上一节把 `starting-balance`、`currency-symbol`、`minimum-pay-amount` 调成你要的值，保存后执行 `/ess reload`。

验证：游戏内 `/balance` 显示的货币符号变成你设的样式。

### 步骤 3：用 `/eco give` 发初始币

`/eco` 是管理经济的主命令，**只有服主 / 管理员用**。它的用法（取自 EssentialsX 2.22.0 的真实定义）：

```
/eco <give|take|set|reset> <玩家> <金额>
```

四个子命令的含义：

| 子命令 | 作用 | 示例 |
|--------|------|------|
| `give` | 给玩家加钱 | `/eco give Steve 1000` |
| `take` | 从玩家扣钱 | `/eco take Steve 500` |
| `set` | 把余额直接设成某个值 | `/eco set Steve 0` |
| `reset` | 把余额重置为初始值 | `/eco reset Steve` |

> 命令别名：`/eco` = `/eeco` = `/economy` = `/eeconomy`。
>
> 使用权限：`essentials.eco`（默认仅 OP）。

验证：`/eco give <你的游戏名> 1000` 后，`/balance` 显示 1000。

### 步骤 4：用 `/baltop` 验证排行

```
/baltop
```

如果你刚才发的钱让榜上出现了名字，说明整套经济已经正常工作。

- 命令别名：`/baltop` = `/balancetop` = `/ebalancetop` = `/ebaltop`
- 权限：`essentials.balancetop`；看别人的余额另需 `essentials.balance.others`

### 步骤 5：装商店插件（消费方）

商店插件见下一节。它**依赖 Vault 才能读余额**，所以这一步同时会把 Vault 带进来。

### 步骤 6：装 Vault，验证「接口」是否接通

把 Vault 的 jar 放进 `plugins/`，重启。Vault **没有任何配置文件**，装上即生效。

验证——在控制台 / 游戏内输入：

```
/vault-info
```

正常输出格式如下（格式串取自 Vault 源码）:

```
[Vault] Vault v1.7.3-b131 Information
[Vault] Economy: Essentials Economy [Essentials]
[Vault] Permission: LuckPerms [LuckPerms]
[Vault] Chat: ...
```

**重点看 `Economy:` 那一行**：

- 显示 `Essentials Economy [Essentials]` → 接上了，商店能读到钱；
- 显示 `None`（或对应位置为空）→ **没有经济实现挂上来**，商店会全程「读不到余额」。

> `/vault-info` 需要 `vault.admin` 权限（默认仅 OP）。

---

## 四、商店插件选型：免费的够用，推荐 QuickShop-Hikari

本站只推荐免费 / 开源插件。商店这一类，重点推荐 **QuickShop-Hikari**（箱子商店，玩家不用敲命令）。

### 为什么是它（均为实际核对数据）

| 项目 | QuickShop-Hikari | ChestShop（备选参考） |
|------|------------------|----------------------|
| 许可证 | **AGPL-3.0**（开源免费） | **LGPL-2.1**（开源免费） |
| 最新版本 | **6.3.0.3**（2026-09-23） | 3.13-pre-1（beta，2026-07-15） |
| 支持的 MC | 到 **26.3**（对齐本站目标环境） | 到 26.2 |
| 加载器 | Paper / Purpur / Folia | Paper / Purpur / Folia / Spigot |
| 是否需要 Vault | 是（`softdepend: [Vault]`） | 是（`softdepend: [Vault]`） |
| 中文 | **内置简体中文**（`lang/zh-CN/`） | 需另配 |
| 建店方式 | 对着箱子塞一次物品即建店（快创） | 敲告示牌 |

> 数据来源：Modrinth 项目接口（`api.modrinth.com/v2/project/quickshop-hikari`、`.../chestshop`）与两个 jar 内的真实 `plugin.yml`。
>
> QuickShop-Hikari 的 `plugin.yml` 写明 `version: 6.3.0.3`、`api-version: '1.20'`、`folia-supported: true`，且 jar 内含 `PacketFactoryv26_3` 类，对应 26.3。ChestShop 的 `plugin.yml` 为 `version: '3.13-pre-1 (build 474)'`、`api-version: '1.13'`。**目标是 26.3 就用 QuickShop-Hikari；ChestShop 当前最新是 beta 且只声明到 26.2。**

### 下载地址（官方 / 官方镜像）

```
QuickShop-Hikari（推荐）
  项目页：https://modrinth.com/plugin/quickshop-hikari
  6.3.0.3 主 jar：
  https://cdn.modrinth.com/data/ijC5dDkD/versions/OxlW1jL5/QuickShop-Hikari-6.3.0.3.jar
  源码：https://github.com/QuickShop-Community/QuickShop-Hikari

ChestShop（备选）
  项目页：https://modrinth.com/plugin/chestshop
  源码：https://github.com/ChestShop-authors/ChestShop-3
```

> 下载时只认官方页 / Modrinth / GitHub Releases，别用来路不明的「整合包」。见 [插件组合](#/guide/plugin-combos) 的通用注意事项。

### 安装

1. 把 `QuickShop-Hikari-6.3.0.3.jar` 放进 `plugins/`；
2. 确认 **Vault 已装**（QuickShop 的 `softdepend` 里有 `Vault`，装了才能读余额）；
3. 重启服务器 → 首次生成 `plugins/QuickShop-Hikari/`。

验证：`/plugins` 里 QuickShop-Hikari 是绿色；`/vault-info` 的 `Economy:` 行有实现。

### 基础配置（`plugins/QuickShop-Hikari/config.yml`）

经济相关的真实键（默认值取自 6.3.0.3 的 jar）：

```yaml
# 经济接口类型：0 = Vault / VaultUnlocked
# 保持 0 即可；只有多货币等高级场景才需要动它
economy-type: 0

# ── 商店税率与去向 ──
shop-tax:
  type: basic            # basic = 固定税率；progressive = 按余额分档
  account: tax           # 税收汇入的账户名；设为 "" 则不实际入账
  apply-to: player       # 向谁收税：player / shop / payee / both
  basic:
    rate: 0.05           # 固定税率 5%

# ── 商店本体 ──
shop:
  cost: 0                # 建店费用，0 = 免建店费
  refund: false          # 删店是否退款
  lock: true             # 锁定箱子，防止非店主偷拿（强烈建议保持 true）
  price-change-requires-fee: true   # 改价是否收费（抑制恶意压价）
  fee-for-price-change: 50          # 改价费金额
```

想要「交易抽税」，把 `shop-tax.type` 设成 `basic` 并调 `rate`；想按余额贫富分档抽税，则设成 `progressive` 并编辑 `brackets` 分档表（低余额低税率、高余额高税率，具体格式见配置内注释）。

> 税收入账到 `account` 指定的账户（默认 `tax`）。若希望这笔钱真的能被领取 / 统计，需要经济系统里存在该账户；设为 `""` 则只扣税不入账。

### 常用权限节点（真实节点，取自 jar 内 `plugin.yml`）

| 权限节点 | 默认 | 作用 |
|----------|------|------|
| `quickshop.use` | **true** | 使用别人的商店买卖（玩家默认就有） |
| `quickshop.create.sell` | op | 创建**出售**商店（卖东西给系统/玩家） |
| `quickshop.create.buy` | op | 创建**收购**商店 |
| `quickshop.create.double` | op | 创建大箱子双箱商店 |
| `quickshop.create.cmd` | op | 用命令建店 |
| `quickshop.find` | **true** | 查找附近商店 |
| `quickshop.browse` | op | 浏览商店 GUI |
| `quickshop.tax` | op | **免除**税收（给管理组） |
| `quickshop.bypasscreatefee` | op | **免除**建店费 |
| `quickshop.moderator` | op | 管理组总权限（含删他人店、改价等） |
| `quickshop.player` | op | 玩家功能总权限包 |

> **重点**：`quickshop.create.*` 默认是 **op**，普通玩家默认建不了店！想开放商店玩法，必须用权限插件把 `quickshop.create.sell`、`quickshop.create.buy`、`quickshop.create.double`、`quickshop.browse` 等授予默认组。权限怎么授予见 [权限系统设计](#/guide/permissions-design)。
>
> 命令前缀是 `/qs`（`config.yml` 的 `custom-commands` 还注册了 `shop`、`chestshop`、`cshop` 等别名）。但普通玩家其实**几乎不需要命令**——对着箱子塞一次物品就会自动创建商店。

---

## 五、Vault 与 VaultUnlocked：什么时候用哪个

Vault 是很多教程的「标配」，但它已经很久没更新了；社区出现了延续项目。两个都免费，但**二选一即可，不要同时装**。

| 对比项 | Vault | VaultUnlocked |
|--------|-------|---------------|
| 当前版本 | **1.7.3-b131** | **2.20.3**（2026-09-16） |
| 发布节奏 | 1.7.3 发布于 2020-07-17，之后长期未更新 | 持续更新 |
| 支持的 MC | 声明到 1.13+（可跑在 Paper 26.x 上） | 声明到 **26.3** |
| Folia 支持 | 无 | **有** |
| 许可证 | 原版 Vault | **LGPL-3.0-or-later** |
| 定位 | 经济 / 权限 / 聊天三合一 API 桥 | **drop-in 替代**（drop-in Vault fork） |
| 多货币 | 无 | 支持（需经济插件配合） |

> 数据来源：Vault 1.7.3 的 jar 内 `plugin.yml`（`version: 1.7.3-b131`、`api-version: 1.13`）；VaultUnlocked 取自 Modrinth 接口（`api.modrinth.com/v2/project/vaultunlocked` 及 `/version`），slug 为 `vaultunlocked`，源码在 `github.com/TheNewEconomy/VaultUnlockedAPI`，官方描述为 *"A modern drop-in Vault fork, with Folia support, and enhanced APIs."*

**结论（保守版）**：

- **大多数单服玩家：继续用 Vault 1.7.3 就够了。** 它只是一个 API 桥，`api-version: 1.13` 且 `load: startup`，在 Paper 26.x 上仍能正常加载；本站的 [Vault 页面](#/plugin/vault) 也是这个口径。
- **什么时候考虑 VaultUnlocked**：你用的是 **Folia**、需要**多货币**，或者希望这个「桥」本身有持续维护。它的定位就是替换 Vault，装上后行为与原版一致（drop-in）。
- **不确定就用 Vault。** 因为消费方插件（商店/任务）大多只在原版 Vault 上测过，换桥存在「作者没测过」的风险。VaultUnlocked 的数据很新（2026-09 仍在发版），但「能不能 100% 兼容你那个特定插件」，只有你实测才知道——**没把握就别换**。

> ⚠ 不要同时装 Vault 和 VaultUnlocked：VaultUnlocked 本身就是 Vault 的替代品，两个桥同时存在只会让「谁在提供服务」变得混乱。二选一。

---

## 六、常见坑（照着排，省几小时）

### 坑 1：装了 Vault，但 `/vault-info` 显示 `None`

**症状**：`/vault-info` 的 `Economy:` 行是 `None`，商店提示「无法读取余额」。

**原因**：Vault 只是接口，接口后面**必须有一个提供方**（EssentialsX）。只装 Vault 不装 EssentialsX，等于柜台后面没人。

**解决**：
```
① 确认 EssentialsX 已装且加载成功（/plugins 绿色）
② 重启（不是 reload）让 Vault 重新协商
③ 再 /vault-info 确认 Economy: 行有内容
```

### 坑 2：同时装了多个经济插件 → 数据分裂

**症状**：`/balance` 显示 A，商店扣的却是 B；或者两边数字对不上。

**原因**：Vault 会从多个经济实现里**挑一个**用（按优先级），玩家的余额可能存在另一个插件里，于是「看的是一个、扣的是另一个」。

**解决**：**只留一个经济实现**（推荐 EssentialsX 自带）。其他同类插件要么卸载，要么在它自己的配置里关掉经济模块，只当 API 用。这条与 [插件组合](#/guide/plugin-combos) 的「两个经济插件」冲突条目一致。

### 坑 3：改了余额但不生效

**症状**：手改了 `plugins/Essentials/userdata/<uuid>.yml`，进游戏却没变，甚至过一会儿又被改回去。

**原因**：EssentialsX 在内存里维护余额，服务器运行时会把自己的版本写回文件，**覆盖你手改的内容**。

**解决**：不要在服务器运行时手改玩家数据文件。正确做法是用命令改：
```
/eco set <玩家> <金额>
/eco give <玩家> <金额>
```

### 坑 4：`/baltop` 不显示余额为 0 的玩家

**症状**：明明有几十个玩家，`/baltop` 只有几行。

**原因**：`show-zero-baltop: true` 才会列出 0 及以下余额的玩家；若被设成 `false`，他们会被隐藏。此外还有 `baltop-requirements`（`minimum-balance` / `minimum-playtime`）会过滤上榜条件。

**解决**：
```
① config.yml 里确认 show-zero-baltop: true
② 执行 /baltop force  ← 改完后必须刷新才生效
③ 检查 baltop-requirements 是否把门槛设高了
④ 大服可留意 baltop-entry-limit（默认 -1 = 不限）
```

### 坑 5：做破坏性改动前不备份经济数据

**症状**：误用 `/eco reset`、换经济插件迁移失败、配置文件写坏——玩家攒的钱一夜清零，无法回滚。

**原因**：经济数据是「玩家最在乎的资产」，却常常没有单独备份。

**解决**：**任何涉及经济的改动（换插件、批量 `/eco`、迁移存储）之前，先备份：**

```
plugins/Essentials/userdata/     ← 每个玩家一个 <uuid>.yml，余额就在里面
```

把它整个目录复制一份留档，再动手。备份 / 回滚的完整流程见 [服务器日常运维手册](#/guide/server-maintenance)。

> 小提示：`economy-log-enabled: false` 默认**不记录**买卖日志。如果你在排查经济异常（谁在刷钱、交易对不上），可临时设为 `true` 记录交易告示牌与 `/sell`，排查完再关掉，避免日志膨胀。

---

## 七、一页速查表：常见需求 → 命令 / 配置

| 我想…… | 怎么做 | 备注 |
|---------|--------|------|
| 给玩家发钱 | `/eco give <玩家> <金额>` | 需 `essentials.eco` |
| 扣玩家钱 | `/eco take <玩家> <金额>` | 同上 |
| 把余额设成某值 | `/eco set <玩家> <金额>` | 危险操作，先备份数据 |
| 重置余额为初始值 | `/eco reset <玩家>` | 走 `starting-balance` |
| 看自己余额 | `/balance`（别名 `/bal`、`/money`） | `essentials.balance` |
| 看别人余额 | `/balance <玩家>` | `essentials.balance.others` |
| 转账给玩家 | `/pay <玩家> <金额>` | `essentials.pay`；最小额看 `minimum-pay-amount` |
| 看财富排行 | `/baltop` | 改配置后 `/baltop force` |
| 让玩家可透支 | 设 `min-money: -10000` + 给 `essentials.eco.loan` | 不想透支就设 `0` |
| 设新玩家初始币 | `starting-balance: 100` 然后 `/ess reload` | — |
| 改货币符号 | `currency-symbol: '¥'`（UTF-8 保存） | 后缀显示用 `currency-symbol-suffix: true` |
| 检查经济接口是否接通 | `/vault-info` → 看 `Economy:` 行 | 显示 `None` = 没提供方 |
| 装个免费商店 | QuickShop-Hikari 6.3.0.3 | 见第四节；记得授权限 |
| 给玩家建店权限 | 授予 `quickshop.create.sell` / `.buy` / `.double` | 默认是 op，务必手动给 |

---

## 下一步

- 权限还没理清？→ [权限系统设计：别让权限越用越乱](#/guide/permissions-design)（商店权限要挂在这套体系里）
- 想按服务器类型抄整套插件清单？→ [插件组合：按服务器类型直接抄](#/guide/plugin-combos)
- 经济数据 / 配置的日常备份与回滚？→ [服务器日常运维手册](#/guide/server-maintenance)
- EssentialsX 的完整配置逐项解释？→ [EssentialsX 插件页](#/plugin/essentialsx)
