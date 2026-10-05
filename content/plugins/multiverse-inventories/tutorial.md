---
id: multiverse-inventories
name: Multiverse-Inventories
description: Multiverse-Core 的官方附属 — 把背包/末影箱按世界分组隔离，跨世界要带东西得走箱子或末影箱。配groups 配置用。
category: 世界管理
version: Multiverse-Inventories（MC 1.13 - 26.3）
tags: [多世界, 背包, 隔离, Multiverse, 附属, 前置]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: Multiverse-Inventories 内置简繁中文语言文件（multiverse-inventories_zh.properties），跟随客户端语言自动切换
downloads: []
---

## Multiverse-Inventories 安装教程

### 1. 它解决什么问题

**先确认你真的需要它。**

原版 Minecraft 所有世界**共用一份背包和末影箱**。多世界服这通常不是想要的：

| 场景 | 共用背包的问题 |
|------|--------------|
| 生存服 + 创造建筑世界 | 在建筑世界误刷物品，**生存党的经济崩了** |
| 生存 + 资源世界 | 资源世界挖的矿和主世界混在一起 |
| PVP服 + 休闲服 | 休闲服捡到的装备带进 PVP |

Multiverse-Inventories 的作用：**把不同世界的背包/末影箱隔离开。**

> ⚠️ **重要认知：这不是「共享背包」插件，是「隔离背包」插件。** 它的默认效果是**分开**，不是**互通**。

### 2. ⚠️ 前置：必须先装 Multiverse-Core

**这是硬依赖，不是可选。**

Multiverse-Inventories 是 **Multiverse-Core 的官方附属**——它靠 Multiverse-Core 管理世界，自己才有意义。

| 要求 | 说明 |
|------|------|
| **Multiverse-Core** | ⚠️ **硬前置，必须先装** |
| **版本匹配** | 两者版本要配套 |

**没有 Multiverse-Core，Multiverse-Inventories 装了也没用**（它不知道你的世界有哪些）。

> 详见 [Multiverse-Core](#/plugin/multiverse-core) 页。

### 3. 它的核心概念：group（分组）

Multiverse-Inventories 的核心不是「世界A用背包1」，而是**分组（group）**：

```
group "survival"  ← world_survival, world_resources
   └─ 这两个世界共用一份背包

group "creative"  ← world_build
   └─ 这个世界用另一份背包
```

**同一 group 内的世界共享背包；不同 group 之间隔离。**

**这个设计的意义**：你想要的往往不是「每个世界一份背包」，而是「**生存的在一起、建筑的在一起**」。group 就是表达这个的。

> ⚠️ **具体配置键名请以你版本的 `config.yml` 注释为准。** 本页不列键名——**不同版本的配置结构差别很大**（group 的定义方式、字段名都可能变）。**看配置文件注释是最可靠的方式。**

### 4. 一个必须提前想清楚的设计决策

装之前，**先回答这个问题：你希望哪些世界共用背包？**

**因为这里没有「撤销」**——分错了分组，玩家现有的背包归属就乱了。

举例：

| 你的世界 | 该怎么分 |
|---------|---------|
| `world`(主城生存) + `world_nether` + `world_the_end` | **必须同一组**（下界末地是主世界的一部分，**分开了玩家进下界要重新开背包**） |
| `world_survival`（生存） | 一组 |
| `world_build`（建筑） | 另一组 |
| `world_pvp` | 看你要不要隔离 |

> ⚠️ **最常见的错误：把下界/末地和主世界分开。** 结果玩家进下界发现背包不一样，要重新开箱子、重新装物资——**体验极差**。**同一个维度的下界/末地必须和主世界同组。**

### 5. 安装

1. 先确认 **Multiverse-Core 已装且正常工作**
2. 下载 Multiverse-Inventories（**Multiverse/Multiverse-Inventories**，Modrinth: `multiverse-inventories`）
3. 丢进 `plugins/`
4. 启动

**主命令和 Multiverse-Core 共用/整合**，用 `/mvinv` 相关的命令管理分组。**具体命令以你版本的命令列表为准。**

### 6. 改了配置之后：老玩家怎么办

**这是升级/改配置时最容易出事的地方。**

**新分组只对新玩家生效，已经有数据的玩家**：

- 玩家原本在主世界有一份背包
- 你改了分组，他进新分组的第一个世界时，**会拿到一份新的（空的？）背包**

**这意味着玩家可能「东西不见了」（其实在旧的那份里）。**

> ⚠️ **实操建议：改分组前，先想清楚现有玩家数据怎么迁。** 这是最需要小心的一步。**先在测试服验证你的分组方案，再动生产服。**

### 7. 什么时候用 / 不用

**用：**

- **不同世界应该有不同的物品边界**（生存 vs 创造）
- **资源世界/刷宝世界不该影响主世界背包**
- **PVP 和休闲要隔离**

**不用：**

- **单世界服** —— 装它纯多余
- **想「跨世界带东西」** —— **它做不到这个方向**。它管的是隔离，跨世界要带东西得走**箱子 / 末影箱 / 传送带**。如果你要的是「背包互通」，**装错插件了**
- **只有两三个世界且都是纯玩法** —— 隔离带来的复杂度可能大于收益

> ⚠️ **特别提醒「背包互通」这个常见误解。** Multiverse-Inventories **不是**用来让世界间共享背包的——**它默认就是隔离的**。想互通，反而要**把它们放同一 group**。

### 8. 常见坑

**玩家说进下界背包变了**

**下界/末地没和主世界放同一组。** 这是最常见的配置错误，见上面第4 点。

**玩家说物品「不见了」**

多半是**改过分组后数据归属变了**。他的物品在旧的那份背包里。**改分组前要意识到这个风险。**

**和 EssentialsX 的传送/tpa 冲突？**

一般不冲突。但如果你的 EssentialsX 有「跨世界传送保留背包」相关行为，**以你的实际配置为准**。

**命令找不到 / 无效**

确认 **Multiverse-Core 装好了**。没装前置，这个插件的部分功能不会正常工作。

**配置改了没生效**

配置相关的改动**通常需要重启**（或插件提供的重载命令，**以你版本为准**）。

### 9. 什么时候别装

- **单世界服** —— 纯多余
- **想要背包互通** —— **方向错了，互通应该把世界放同组**
- **多世界但都该共享背包** —— 那就不需要这个插件（原版就是这样）
- **没有测试服** —— **改分组有数据风险，先测**

### 10. 关于汉化

**这个插件有官方中文。**

Multiverse-Inventories 自带中文语言文件 `multiverse-inventories_zh.properties`，**跟随玩家客户端语言自动切换**。

**和 Multiverse-Core 一样属于 Multiverse 官方系列，汉化是一等公民**——这一批插件里算好的。

需要改文案或确认当前加载了哪个语言文件，详见 [汉化机制](#/plugin/multiverse-inventories) 页。

## 下一步

- 前置插件先看这个 → [Multiverse-Core](#/plugin/multiverse-core)
- 多世界整体怎么规划 → [多世界配置](#/guide/multi-world-setup)
- 跨世界怎么带东西 → [插件组合推荐](#/guide/plugin-combos)
- 汉化机制和全站总表 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
