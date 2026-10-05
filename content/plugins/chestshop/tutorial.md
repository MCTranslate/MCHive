---
id: chestshop
name: ChestShop
description: 经典箱子商店 — 玩家在箱子旁挂招牌即可买卖物品，与 QuickShop 二选一的另一种经济交易方案。
category: 经济交易
version: 3.12.2（MC 1.13.2 - 26.2）
tags: [商店, 经济, 交易, 箱子]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 内置 `lang.zh.yml`（97 行简体中文），生成后可直接编辑覆盖
---

## ChestShop 安装教程

### 1. 它与 QuickShop 有什么不同

两者都是箱子商店，但交互方式完全不同：

| | QuickShop-Hikari | ChestShop |
|--|-----------------|-----------|
| 创建方式 | 命令 + 点击容器 | 在招牌上写三行字 |
| 价格设置 | 命令参数 | 招牌第二/三行 |
| 买和卖 | 同一个招牌（双向） | 需要分别创建买入/卖出招牌 |
| 适合谁 | 新手友好，一步到位 | 习惯传统商店系统的老玩家 |

**二选一即可**——两个同时装不会报错但会互相混淆玩家。

### 2. 版本与下载

当前最新**稳定版**为 **3.12.2**，Hangar 上登记的 Paper 支持区间是 **MC 1.13.2 – 26.2**。开源协议 LGPL-2.1。

- [GitHub Releases](https://github.com/ChestShop-authors/ChestShop-3/releases)
- [Modrinth](https://modrinth.com/plugin/chestshop)
- [Hangar](https://hangar.papermc.io/ChestShop/ChestShop)

> 官方同时在推进 3.13 预发布版。**生产服请用 3.12.2 稳定版**，预发布版的配置不保证向下兼容。

### 3. 安装

将 jar 放入 `plugins/`，重启服务器。**必须同时安装 Vault 和一个经济插件**（如 EssentialsX），否则 ChestShop 无法处理货币。

### 4. 创建商店

ChestShop 的商店挂在**告示牌**上，写三行即可：

```
（第 1 行留空 — 自动填物品名）
B 5          ← B = 买入价（玩家付给你 5 元）
S 10         ← S = 卖出价（你卖给玩家 10 元）
<数量>       ← 每次交易的数量
```

> 注意：**B 和 S 写在同一行**（第二行）时表示双向交易；只写一个表示单向。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/iteminfo [物品]` | 查看手持物品的 ID（写招牌时用） |
| `/shopinfo` | 查看商店信息 |
| `/cstoggle` | 切换交易通知开关 |
| `/csaccess` | 管理员访问所有商店 |

### 6. 注意事项

> **ChestShop 本体没有 config.yml**——所有配置在首次启动后生成，具体键名以你服实际生成的文件为准。

> **区域保护**：ChestShop 的招牌会被 WorldGuard 等保护插件拦截。如果商店建在保护区域内，需要给玩家对应权限或在区域中允许交互。

## 下一步

- 经济系统还没搭好？→ [经济系统搭建](#/guide/economy-setup)
- 想换 QuickShop 试试？→ [QuickShop-Hikari](#/plugin/quickshop-hikari)
- 商店被偷了？→ [CoreProtect](#/plugin/coreprotect) 能查到谁动了箱子
