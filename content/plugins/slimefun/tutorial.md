---
id: slimefun
name: Slimefun
description: 数百种可自定义的机器、物品与研究系统 — 把废弃科技、魔法、食物、矿物玩出花，是长期生存服的中后期核心玩法插件。
category: 功能插件
version: Slimefun 4（MC 1.14+ · 需 Java 17+）
tags: [科技, 机器, 研究, 玩法, Slimefun]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: Slimefun 的中文覆盖范围实测清单 — 15 个中文语言文件，完整度很高
downloads: []
---

## Slimefun 安装教程

### 1. 它是什么

Slimefun（ slimefun4 ）是一个**纯玩法插件**——它不加新方块、不加新生物，而是在原有物品和机制上搭出一整套「科技树」：

- **矿物**：再矿石、原子矿、放射性矿石
- **食物**：吸血鬼食物、暴食等级、超级糖
- **机器**：磨粉机、熔炉、压缩机、分离机、虚空矿石
- **研究系统**：解锁配方需要「等级」，等级靠挖矿、跑步、吃东西累积
- **武器与护甲**：三叉戟、忍者刀、护甲有耐久和等级
- **传送器**：Slimefun 自己的传送网络，不依赖 WorldEdit

它和 MythicMobs、ItemsAdder 那种「靠资源包加方块」的插件思路不同：**Slimefun 不需要资源包**，纯服务端逻辑，所以兼容性反而更好。

> ⚠️ 别把 Slimefun 看成「玩法插件随便加」。它的机器会持续加载区块、处理物品，**对性能的影响远大于它的存在感**。开服前先看一眼 [性能调优从入门到精通](#/guide/performance-tuning)。

### 2. 前置条件

| 要求 | 说明 |
|------|------|
| Java 17+ | 1.14+ 版本的服务端需要 |
| MC 1.14+ | 更老的版本要下旧版 Slimefun |

Slimefun **需要**的插件：几乎没有。核心功能自足。

可选联动（装了体验更好）：

- **MythicMobs** — 刷 Slimefun 相关的怪
- **ItemsAdder / Oraxen** — 自定义材质包
- **WorldGuard** — 保护机器区域
- **PlaceholderAPI** — 记分板显示研究进度

### 3. 下载与安装

官方仓库（唯一可信来源）：

- 仓库：<https://github.com/Slimefun/Slimefun4>
- 发行页：<https://github.com/Slimefun/Slimefun4/releases>

> **下载时注意版本号格式**。Slimefun 用日期或递增号发版，jar 名字类似 `Slimefun-4.20.jar`。**不要从第三方网盘或 Modrinth 的过期镜像下**，Slimefun 官方明确说过第三方分发经常是旧版或改版。

丢进 `plugins/`，重启。第一次启动会生成 `plugins/Slimefun/` 目录。

### 4. 首次配置

生成的 `plugins/Slimefun/config.yml` 里，**新手只需要动这几项**：

```yaml
# 强制英文界面（关掉它才能用中文）
forceEnglishInterface: false

# 研究等级模式
# PLAYER = 每玩家独立研究进度（适合单人/小服）
# GLOBAL = 全服共享研究进度（适合长期服，玩家之间有竞争）
research-mode: PLAYER

# 是否允许玩家在研究未解锁时看到配方
enableRecipeBook: true
```

**`research-mode` 是个很重要的选择**：

- `PLAYER` 模式下每个玩家自己攒等级，咸鱼各自安好
- `GLOBAL` 模式下全服共享进度，服务器整体推进，适合有「开服纪念」属性的长线服

选错了要重来，建议开服前就想清楚。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/sf help` | 帮助总览 |
| `/sf research` | 打开研究菜单 |
| `/sf give <物品>` | 给自己一个 Slimefun 物品 |
| `/sf giveall <物品>` | 给全服玩家 |
| `/sf stats` | 自己的统计信息 |
| `/sf cheater <玩家>` | 查看玩家的研究速度异常（管理员） |
| `/sf reset` | 重置研究进度（管理员） |
| `/sf give <物品> <数量> <概率>` | 带掉率的给予命令 |
| `/sf world <世界名>` | 只在指定世界生效 |

### 6. 世界与重力配置

Slimefun 的机器会检查所在世界，靠 `slimefun.yml` 里的世界规则控制：

```yaml
worlds:
  world:
    option: false      # false = 完全关闭 Slimefun
    gravity: true      # 是否受重力影响（机器掉落物等）
  world_nether:
    option: true
    gravity: false
```

想**只在生存世界开 Slimefun、下界关掉**，就照这个写。这在世界多的服里很有用——下界玩家不该挖到 Slimefun 矿。

### 7. 常见问题

**机器不工作 / 机器没反应**

先看是不是被 WorldGuard 的区域 flag 挡了。Slimefun 的机器需要交互权限，`#wg` 没给 `use` 就点不动。

**研究进度太慢**

正常玩法就是这样。想快点，可以在 `config.yml` 调 `research-rank` 相关的等级获取速率，或者用 `/sf cheater <玩家>` 查是谁在刷等级。

**装完之后材质全是紫黑格子**

Slimefun 本身不需要资源包，紫黑格子说明是**别的东西**（ItemsAdder/Oraxen 之类）缺材质包。Slimefun 正常情况下是纯服务端渲染。

## 下一步

- [汉化机制](#/plugin/slimefun) — Slimefun 的 15 个中文语言文件实测
- [性能调优从入门到精通](#/guide/performance-tuning) — Slimefun 吃性能的真相
- [插件组合：按服务器类型直接抄](#/guide/plugin-combos) — 和哪些插件搭配
