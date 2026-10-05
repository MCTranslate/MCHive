---
id: multiverse-portals
name: Multiverse-Portals
description: Multiverse-Core 的传送门附属 — 把任意形状的门框变成通往其他世界/坐标的传送门，支持权限限制、收费、载具通过和执行命令。
category: 世界管理
version: Multiverse-Portals（MC 1.13 - 26.2）
tags: [Multiverse, 传送门, 多世界, 附属]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## ⚠️ 硬依赖：Multiverse-Core

**Multiverse-Portals 是 Multiverse-Core 的附属插件，没有 Core 它根本不会加载。**

这不是软依赖，是硬依赖——Modrinth 页面上就明确标注 `Required content: Multiverse-Core, Any compatible version`。

```
Multiverse-Core（必须有）
  ├── Multiverse-Portals   ← 本页
  ├── Multiverse-NetherPortals
  ├── Multiverse-Inventories
  └── Multiverse-SignPortals
```

**装之前先确认你已经有 Multiverse-Core 并且能正常跑。** 没有 Core 就装 Portals，你会得到一个红色加载失败。

**安装顺序**：Multiverse-Core → 重启 → Multiverse-Portals → 重启。

## 1. 它和原版传送门的区别

原版传送门只能去固定的目的地（对应维度的下界传送门 / 末地传送门），而且形状写死。Multiverse-Portals 是**完全自定义**：

| | 原版传送门 | Multiverse-Portals |
|---|-----------|-------------------|
| 形状 | 固定（黑曜石框） | **任意形状**（只要是框架结构） |
| 目的地 | 只能对应维度 | **任何世界、任何坐标** |
| 一个门多个目的地 | ❌ | ✅（可以建多个门） |
| 落地位置 | 固定 | 可配（精确坐标） |
| 执行命令而非传送 | ❌ | ✅ |
| 权限限制 | ❌ | ✅ |
| 收费 | ❌ | ✅ |
| 载具通过 | 有限 | 可配 |

**典型用例：**

```
主城大厅 → 资源世界（第一次去要付费）
主城大厅 → 生存世界（VIP 免费）
主城 → 创造建筑世界（仅建造组）
生存世界 → 副本入口（不是传送，而是执行一个开启副本的命令）
```

## 2. 它的核心价值：配合 Multiverse 做世界门户

**单服多世界架构里，玩家在各个世界之间走来走去是最烦的。** 原版方式只有三个命令：

```
/mv tp <世界>    ← 要输命令
/spawn           ← 只能回主城
/rtp             ← 随机传送，不是「回家」
```

**有了 Multiverse-Portals，你可以让玩家走进一扇门就过去了。** 这是从「命令行世界」变成「可探索世界」的关键一步。

玩家不需要记住任何命令，也不需要知道世界名。

## 3. 传送门支持的功能开关

每个传送门可以独立配置这些：

| 功能 | 说明 |
|------|------|
| **目的地** | 另一个 Multiverse 世界、或者精确坐标 |
| **权限限制** | 只有特定权限组能进（比如 VIP 才进资源世界） |
| **收费** | 收玩家货币；可以给特定玩家免费 |
| **落地设置** | 传送到空中（掉下去）还是安全落地 |
| **载具通过** | 矿车和船能不能过 |
| **执行命令** | **不传送，而是执行一条 Multiverse 命令** |
| **安全检查** | 目的地不安全时如何处理 |

### 「执行命令而不是传送」这个功能

这是最容易被忽视但最灵活的一项。传送门的动作不限于「传送」：

| 用途 | 说明 |
|------|------|
| 开启副本/小游戏 | 玩家走进门 → 触发一条命令启动副本 |
| 传送前发提示 | 门本身不是目的地，而是「准备区」的入口 |
| 权限检查 | 门本身就是个检查点，不通过就传送到别处 |

**这条功能让 Multiverse-Portals 不只是「传送工具」，而是一个通用的「门触发器」。**

## 4. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Bukkit / Spigot / Paper / Purpur |
| MC | 1.13+ |
| **硬依赖** | **Multiverse-Core**（任意兼容版本） |
| 建议 | LuckPerms（权限）、Vault（经济） |

> ⚠️ **Multiverse 5 系列要求 MC 1.18+。** 如果你要用 5.x 版本的 Core / Portals，MC 版本得够。

**平台版本覆盖有差异**：Bukkit / Paper / Spigot 从 1.13 起，**Purpur 版本从 1.18.2 起**。

## 5. 和其他 Multiverse 附属怎么分工

Multiverse 的附属不是随便起的名字，各管一件事：

| 插件 | 干什么 |
|------|--------|
| **Multiverse-Core** | 创建/导入/加载世界、每世界设置、传送 |
| **Multiverse-Portals** | **本页** — 自定义形状的传送门，通往任意目的地 |
| **Multiverse-NetherPortals** | **每个主世界有独立的下界和末地** |
| **Multiverse-Inventories** | 按世界/分组隔离背包、血量、经验 |
| **Multiverse-SignPortals** | **告示牌**当传送点 |

**别搞混两个「传送门」插件：**

> **Multiverse-Portals** = 你自己搭的门框，通往任何地方
> **Multiverse-NetherPortals** = 原版那种下界传送门，但每个世界独立

**想要「主世界 A 通向自己独立的下界」，你要的是 NetherPortals，不是 Portals。**

## 6. 安装

- Modrinth：搜 `multiverse-portals`
- 官方文档：<https://mvplugins.org/>
- 源码：<https://github.com/Multiverse/Multiverse-Portals>

丢进 `plugins/`，重启。

### 版本一致性要求

**所有 Multiverse 子插件必须同一个主版本。**

> Mixing a version 5 Core with a version 4 add-on is not supported.

Core 用 5.x，所有附属都得用 5.x。**Core 4 + Portals 5 这种组合不支持。**

## 7. 常见坑

**插件加载失败 / 变红**

**Core 没装或者没先装。** 这是最高频的问题。确认 `plugins/Multiverse-Core/` 存在且 Core 本身是正常的（`/mv` 能用）。

**Core 装了但 Portals 还是不加载**

检查 Core 和 Portals 的**主版本是否一致**。Core 5.x + Portals 4.x 不支持。

**玩家穿门没反应**

| 检查 | 说明 |
|------|------|
| 门框结构对吗 | 必须是**框架结构**（内部中空），实心的不是门 |
| 目的地世界存在吗 | Multiverse-Core 里的世界名 |
| 有权限限制吗 | 玩家有没有那个权限节点 |
| 收费功能开了吗 | 玩家余额够吗 |
| 是服务端创造模式才能建门 | 玩家能不能在那个位置放方块 |

**跨版本不兼容**

1.13+ 的 Paper 上，Multiverse 5 有过一处**不可降级**的变更：一旦你跑过 5.x 就回不到 4.x 了。**升级前备份整个 `plugins/Multiverse-*/`。**

**Purpur 上找不到对应版本**

Purpur 版本的覆盖比 Bukkit/Paper/Spigot 晚（从 1.18.2 起）。老 Purpur 上没有对应版本。

**经济收费不生效**

需要 Vault，并且接了经济插件。两个都要。

## 8. 缺点和取舍

| 缺点 | 说明 |
|------|------|
| **必须先有 Multiverse-Core** | 新人以为「装个插件就能传送」，实际上要先搞懂整个 Multiverse |
| **版本必须一致** | Core 和所有附属主版本要对齐，升级规划麻烦 |
| **门框结构设计仍然费时间** | 功能强，但「设计一个好看的传送门」是体力活 |
| **5.x 不可降级** | 一次升级就把你的退路断了 |
| **跨版本覆盖不齐** | 各平台起始版本不同 |
| **本质上是「配结构 + 配权限」** | 功能很灵活，但配置和权限设计的工作量都在管理员身上 |

## 9. 关于汉化

> ⚠️ **本站未核实到 Multiverse-Portals 的官方中文语言文件机制（具体路径与格式）。**

**一个间接的好消息：Multiverse-Core 支持中文**（站内 [Multiverse-Core](#/plugin/multiverse-core) 页有说明）。Portals 作为同一家族的附属，通常会跟随 Core 的语言。

想改文案：

1. 打开 `plugins/Multiverse-Portals/` 看生成的文件
2. 搜配置文件里带 `message` 的段落（传送失败、收费不足、权限不足这些提示）

**具体配置键名以你手上版本的官方配置文件注释为准。**

## 下一步

- Core 必须先装 → [Multiverse-Core](#/plugin/multiverse-core)
- 多世界整体怎么规划 → [多世界配置](#/guide/multi-world-setup)
- 权限怎么分配 → [权限系统设计](#/guide/permissions-design)
- 插件组合建议 → [插件组合推荐](#/guide/plugin-combos)