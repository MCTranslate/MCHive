---
id: bentobox
name: BentoBox
description: 岛屿玩法平台 — 天空岛/空岛/一键生存等模式的底层框架，20+ 官方扩展，靠权限而非管理员手动分配资源，适合长期生存服。
category: 世界管理
version: 3.23.3（MC 1.18.2 - 26.3）
tags: [岛屿, 空岛, 天空岛, 生存, BentoBox]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: locales/<locale>.yml 语言文件结构，默认跟随客户端、需在 config.yml 显式设 locale 才能锁中文
downloads: []
---

## BentoBox 安装教程

### 1. 它是什么

**BentoBox 本身不是一个模式，它是模式平台。**

装完 BentoBox 你会得到一个空壳——它生成配置、管理数据库、提供岛屿保护框架，但**没有游戏内容**。真正的玩法在「扩展（Addon）」里：

| 扩展 | 玩法 |
|------|------|
| BSkyBlock | 经典天空岛（空岛生存） |
| AcidIsland | 一块橡皮岛上从零重建文明 |
| AOneBlock | 一根柱子上無限刷方块 |
| Boxed | 盒子里的微型世界 |

**如果你以为装 BentoBox 就有空岛了，会白忙一场。** 正确流程是：BentoBox → 放一个模式扩展进 `plugins/BentoBox/addons/` → 重启。

### 2. 为什么值得用它

自己写一套岛屿保护不难，难的是**后面这一堆**：

- 每玩家一块地，地块之间不重叠
- 岛屿保护（PvP、刷怪、火焰、TNT、活塞、村民机制……几十项 flag）
- 团队（owner / member / co-op / trusted / visitor 多级）
- 传送点（sethome / homes / 传送牌）
- 岛屿删除、冷却、重置次数限制
- 数据库抽象（JSON / SQLite / MySQL / MariaDB / MongoDB）
- 蓝图系统（岛屿模板）
- 跨模式共享功能（等级、挑战、传送牌）

这些 BentoBox 都给你了，而且**几乎全靠权限控制**——岛屿数量、保护范围、队伍人数、能不能飞，都是给不给某个权限节点的事，不需要写代码。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | **Paper / Purpur**（不支持 Spigot，官方明确要求 Paper 系） |
| Java | 以你玩的 MC 版本为准，1.20.5+ 需要 Java 21 |
| 硬依赖 | 无，但**必须自己装模式扩展** |

> ⚠️ **不要在 Spigot 上装 BentoBox。** 官方文档写明只支持 Paper 系列。Spigot 缺少很多 Paper 才有的 API，岛屿生成会直接失败。

### 4. 安装步骤

**第一步**：装 BentoBox 本体。

- 仓库：<https://github.com/BentoBoxWorld/BentoBox>
- 文档：<https://docs.bentobox.world>

jar 丢进 `plugins/`，重启，会生成 `plugins/BentoBox/`。

**第二步**：把模式扩展放进 addons 目录。

```
plugins/BentoBox/
├── config.yml
├── locales/            ← 语言文件在这里
└── addons/
    ├── BSkyBlock.jar    ← 扩展放这里，不是 plugins/
    └── ...
```

> **扩展必须放 `addons/` 目录，不是 `plugins/`。** 放错位置插件会当它不存在，启动日志里一句报错都没有——这是最常见的「装了 BSkyBlock 但 /is 没用」原因。

**第三步**：重启。模式世界会自动生成。

**第四步**：先设语言，否则一堆英文。

```yaml
# plugins/BentoBox/config.yml
locale: zh-CN
```

见 [汉化机制](#/plugin/bentobox/lang.md)。

### 5. 常用命令

核心命令（都能简写 `/bbox`）：

| 命令 | 说明 |
|------|------|
| `/bentobox version` | **看版本和所有扩展版本**——报 bug 时必带这个 |
| `/bentobox manage` | 打开管理面板 GUI |
| `/bentobox catalog` | 打开扩展目录，可以直接下载/更新扩展 |
| `/bentobox reload` | 重载插件、扩展、配置和语言 |
| `/bentobox perms` | **列出所有权限节点（YAML 格式）** |
| `/bentobox migrate` | 跨数据库迁移数据 |

BSkyBlock 玩家命令（前缀 `/is`，可简写 `/island`）：

| 命令 | 说明 |
|------|------|
| `/is create` | 创建岛屿（可选蓝图） |
| `/is go [家名]` | 回家（支持模糊匹配） |
| `/is sethome [家名]` | 设传送点 |
| `/is homes` | 列出所有家 |
| `/is deletehome <名>` | 删一个家 |
| `/is settings` | 岛屿保护设置面板 |
| `/is team` | 队伍管理（邀请/接受/踢/离队/转让） |
| `/is ban` / `unban` | 拉黑/解除拉黑 |
| `/is info` | 岛屿信息 |
| `/is level` | 岛屿等级（需 Level 扩展） |
| `/is near` | 显示附近岛屿名 |
| `/is reset` | 重置岛屿（受重置次数限制） |
| `/is language` | 单独切换这个玩家的界面语言 |

BSkyBlock 管理命令（前缀 `/bsb`，可简写 `/bsbadmin`）：

| 命令 | 说明 |
|------|------|
| `/bsb tp <玩家>` | 传送到玩家岛屿 |
| `/bsb delete <玩家>` | 删除玩家岛屿（无参数 = 软删除脚下这座） |
| `/bsb undelete` | 取消待删除状态 |
| `/bsb setowner <玩家>` | 转移所有权 |
| `/bsb range <半径>` | 调整保护范围 |
| `/bsb setspawn` | 设置世界出生点 |
| `/bsb why` | **打开保护调试**，控制台会打印该玩家每次操作的允许/拒绝原因 |

> **`/bsb why` 是排查神器。** 玩家抱怨「我明明是岛主却不能 XXX」的时候，跑这个命令，让玩家操作一次，控制台会明确告诉你**是哪个 flag 挡的**。比翻配置猜快十倍。

### 6. 关键配置

`plugins/BentoBox/config.yml`：

```yaml
# 语言锁定
locale: zh-CN

# 数据库类型：JSON / SQLITE / MYSQL / MARIADB / MONGODB
database:
  type: JSON
```

**数据库选型**：

| 场景 | 推荐 | 原因 |
|------|------|------|
| 单服、几十人 | `JSON` | 开箱即用，够用 |
| 单服、几百人+ | `SQLITE` | JSON 写入会卡 |
| 群组服 | `MYSQL` / `MARIADB` | 多后端共享数据必需 |

> 从 JSON 换数据库**必须用 `/bentobox migrate`**，直接改 `type` 会让所有岛屿「消失」——数据还在 JSON 文件里，BentoBox 只是不读了。用完记得**备份**。

模式扩展的配置在 `plugins/BentoBox/addons/<模式>/config.yml`。BSkyBlock 常用项：

```yaml
# 岛屿生成的距离上限（格）
distance-between-islands: 400

# 默认保护范围
protection-range: 50

# 是否允许玩家在岛内 PvP
allow-pvp: false
```

> ⚠️ 保护范围和距离上限**改大了会拖垮服务器**。范围 50 意味着每座岛要加载约 250×250 格的区域，上百座岛就是几百万格。**开服前定好，别在运营中途往上加。**

### 7. 权限设计

BentoBox 的资源分配**全靠权限**。`/bentobox perms` 会打印完整列表，直接照着分。

常用的数值型权限：

| 权限 | 控制什么 |
|------|---------|
| `island.number` | 能拥有几座岛 |
| `island.reset.maxresets` | 能重置几次 |
| `island.home.maxhomes` | 能设几个家 |
| `island.range` | 保护范围上限 |
| `team.maxsize` | 队伍人数上限 |

等级权限：`bskyblock.mod.*`（协管）、`bskyblock.admin.*`（管理员）。

> **坑：部分数值权限（岛屿范围、队伍上限）改完要玩家重新登录才生效。** `/bentobox reload` 不解决这个，重启也未必，直接踢他下线。

### 8. 常见坑

**`/bbox` 提示未知命令 / 扩展没加载**

检查两处：扩展 jar 在不在 `addons/` 目录、jar 里有没有 `addon.yml`。Modrinth 上错下成 fabric 版（`-paper` 才是服务端版）也会这样。

**数据库换完岛屿全没了**

见上面——必须用 `/bentobox migrate`。

**玩家说「我明明是岛主却放不下方块」**

跑 `/bsb why`。九成是某个 flag 被关了，或者玩家在**另一个玩家的岛**上（岛屿范围重叠时容易搞混位置）。

**进不属于自己的岛会被弹出去 / 打不了怪**

保护是对的。想改行为去 `island settings` 或管理端面板调 flag。**不建议全服关保护**——岛屿玩法的乐趣就在「各家边界清晰」。

**Paper 上区块生成卡顿 / 崩服**

保护范围和岛间距设太大。改了之后需要重启才完全生效，且**已有岛屿不会自动缩小**——得用 `/bsb range` 逐个调，或者接受现状。

**多模式（天空岛 + 一键生存）玩家串了**

正常现象，玩家在两个模式里是独立数据。用 `/is` 前缀区分不了的时候，看各模式扩展自己的 admin 前缀（BSkyBlock 是 `/bsb`，AcidIsland 是 `/acid`）。

### 9. 什么时候别用 BentoBox

- **纯生存服，没有岛屿玩法需求** — 这插件是重型框架，纯粹为了「每人一块地」装它是杀鸡用牛刀。世界保护 + 简单家系统更合适。
- **Spigot 服** — 直接别装，它要 Paper。
- **1 人服** — 没有「邻居」，岛屿保护毫无意义。

## 下一步

- 语言切换细节 → [汉化机制](#/plugin/bentobox/lang.md)
- 多世界怎么配合扩展用 → [多世界搭建](#/guide/multi-world-setup)
- 跨服数据怎么存 → [数据库配置](#/guide/database-setup)
- 权限节点怎么规划 → [权限系统设计](#/guide/permissions-design)
