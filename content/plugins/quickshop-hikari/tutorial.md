---
id: quickshop-hikari
name: QuickShop-Hikari
description: 箱子商店插件 — 右键箱子挂招牌就能卖东西，玩家自助买卖，配合 Vault 实现全服经济流转。
category: 经济交易
version: 6.3.0.3（MC 1.20 - 26.2）
tags: [商店, 经济, 交易, 箱子, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版（基于 6.3.0.3 真实默认值），含经济类型与商店限制
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 内置 38 种语言（含简体中文），跟随玩家客户端语言自动切换
---

## QuickShop-Hikari 安装教程

### 1. 这个插件解决什么问题

没有商店插件时，玩家想卖东西只能在世界频道喊话、当面交易。QuickShop 让你**右键一个箱子挂上招牌**，其他玩家走到招牌前就能看到价格、点击购买——**整个交易过程不需要双方同时在线**。

它是生存服、公益服经济系统的核心。EssentialsX 提供的是「货币」，QuickShop 提供的是「花掉货币的地方」。

### 2. 版本与下载

当前版本 **6.3.0.3**（2026-09-23），支持 **MC 1.20 – 26.2**，兼容 Paper / Purpur / Folia。开源协议 AGPL-3.0。

- [Modrinth](https://modrinth.com/plugin/quickshop-hikari)
- [GitHub Releases](https://github.com/QuickShop-Community/QuickShop-Hikari/releases)

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。首次启动会生成 `plugins/QuickShop-Hikari/config.yml`。

> QuickShop 需要 **Vault** 和一个经济提供方（如 EssentialsX）才能处理货币。只装 QuickShop 不装 EssentialsX 时，它自带内部经济（不推荐生产使用）。

### 4. 创建商店的流程

```
① 手持你想卖的东西
② 用 /qs create <价格> 命令（或潜行+右键容器）
③ 左键点击要作为商店的箱子/桶/潜影盒等容器
④ 招牌自动生成，商店完成
```

其他玩家**右键招牌买**、**潜行+左键招牌卖**。你可以在箱子里面放入/取出库存。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/qs create <价格>` | 创建出售商店（手持物品） |
| `/qs buy <价格>` | 创建收购商店（手持容器） |
| `/qs remove` | 移除你看着的商店 |
| `/qs price <新价格>` | 修改价格 |
| `/qs find <物品>` | 搜索附近商店 |
| `/qs clean` | 清理自己的过期数据 |
| `/qs reload` | 重载配置 |

### 6. 注意事项

> **容器类型决定商店类型**：单格容器（如发射器）只能放一种物品；双箱（大箱子）可以放两种。

> **税收**：`shop-tax` 段可以设置每笔交易的税率，收入进入指定的税务账户（`shop-tax.account`）。默认关闭。

> **保护联动**：QuickShop 自带容器保护——**有商店的箱子其他玩家打不开**。但如果同时装了别的保护插件，注意别冲突。

## 下一步

- 经济系统还没搭好？→ [经济系统搭建：从零让服务器「有钱」](#/guide/economy-setup)
- 想给不同玩家不同权限？→ [权限系统设计](#/guide/permissions-design)
- 插件装完需要汉化？→ [插件汉化与本地化完全指南](#/guide/plugin-localization)
