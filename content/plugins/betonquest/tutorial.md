---
id: betonquest
name: BetonQuest
description: 剧情任务系统 — 用 YAML 写任务链、对话、条件和奖励，是长线服务器的「主线剧情」引擎，支持中文对话与变量条件。
category: 任务系统
version: 3.2.0（MC 1.18.2 - 26.3）
tags: [任务, 剧情, 对话, RPG, 变量]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: 42 个语言文件含 zh-CN，另有 zh-CN.patch.yml 增量补丁机制
downloads: []
---

## BetonQuest 安装教程

### 1. 它是什么

BetonQuest 是**剧情向的任务系统**。和「每日任务插件」不同，它的核心是**任务链**——玩家做任务 A 才能解锁任务 B，做完 B 触发 C，故事一环扣一环往下走。

它能做的事：

- **任务链**：有前置条件的任务序列
- **对话系统**：NPC 对话、条件分支、选项
- **变量系统**：任务进度记在变量里（`player.<name>.quest_progress`）
- **条件与事件**：击杀、到达坐标、获得物品、对话选择触发后续
- **奖励发放**：物品、经验、金币（通过 Vault/经济插件）、权限
- **Mobs 绑定**：给 MythicMobs 的怪挂任务

**适合的场景**：有剧情的长线服、新手引导任务、赛季/活动任务链。

**不适合的场景**：只想搞个每日签到——那用轻量的任务插件就够了，BetonQuest 是重量级的。

### 2. 前置条件

| 要求 | 说明 |
|------|------|
| Java 17+ | — |
| MC 1.18.2 - 26.3 | 官方当前版本支持区间 |

**硬依赖**：无。

**软依赖**（装了能联动，不装也能用）：

- **Vault** — 发金币奖励
- **MythicMobs** — 绑定自定义怪物
- **Citizens** — 任务 NPC
- **PlaceholderAPI** — 变量显示到其他界面
- **ItemsAdder / Oraxen** — 自定义奖励物品

### 3. 安装

官方仓库：<https://github.com/BetonQuest/BetonQuest>

发行页拿 jar，丢进 `plugins/`，重启。生成目录 `plugins/BetonQuest/`。

**关键文件结构**（第一次开服就要看）：

```
plugins/BetonQuest/
├── config.yml              ← 全局配置
├── questdata/              ← 任务定义（核心）
│   ├── main.yml            ← 任务注册表
│   └── objectives/         ← 可复用的目标片段
├── conditions/             ← 可复用的条件
├── journal/                ← 任务日志（玩家可见的列表）
├── lang/                   ← 语言文件 ← 汉化看这里
└── effects/                ← 可复用的效果
```

### 4. 第一个任务长什么样

BetonQuest 的任务用 YAML 定义。这是核心概念，务必看懂。

```yaml
# questdata/main.yml
intro:
  priority: 1
  objective: "kill_mobs;10;skeleton;objective1"
  rewards:
    - "item;diamond;3"
    - "exp;100"
  repeatable: false
  cancellable: false
  notify:
    start: true
    complete: true
```

这一段的意思是：任务 id 是 `intro`，要求击杀 10 只骷髅，完成后给 3 个钻石和 100 经验。

**注意 `objective` 用分号分隔参数**——`kill_mobs;数量;怪物类型;变量名`。这是 BetonQuest 特有的紧凑语法，第一次看会不习惯。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/bq` | 主命令 |
| `/bq reload` | 重载配置（改完任务用它） |
| `/bq create <id>` | 创建一个任务骨架 |
| `/bq list` | 列出所有任务 |
| `/bq journal` | 打开任务日志 |
| `/bq objective <var> <目标>` | 直接推进某个目标（调试用） |
| `/bq reset <var>` | 重置玩家某个变量 |
| `/bq trace` | 打开调试追踪（排查任务不触发用） |

> `/bq reload` 可以在不重启的情况下重载任务配置。但**改 Java 层面的东西（重载类、改依赖）必须重启**。

### 6. 调试任务不触发

这是用 BetonQuest 最常卡住的地方。排查顺序：

**① 变量对不对**

任务靠变量推进。用 `/bq objective <变量名> <目标>` 手动推进一步，看是否触发。

**② 目标类型对不对**

比如击杀任务要的是 `kill_mobs` 而不是 `mob_kill`——拼错了永远不会触发。目标类型是固定的，写错就是静默失败。

**③ 任务有没有被注册**

只在 `questdata/main.yml` 里定义了但没在别处引用，任务不会出现在日志里。

**④ 用 `/bq trace`**

这是最有效的工具。它会输出每一条任务判定过程，直接告诉你哪个条件没满足。

### 7. 变量怎么理解

BetonQuest 里所有进度都是**变量**。常见的三类：

| 变量名形式 | 含义 |
|-----------|------|
| `player.<玩家名>.<变量>` | 玩家私有，比如任务进度 |
| `global.<变量>` | 全服共享，比如世界状态 |
| `<任意自定义名>` | 你自己定义的 |

变量的值可以是数字、字符串或物品栈。`kill_mobs;10;skeleton;objective1` 里的 `objective1` 就是变量名——BetonQuest 每完成一次击杀就把这个变量 +1，加到 10 算完成。

**建议**：变量名加前缀分类，比如 `intro.`、`daily.`、`story_`，后期不会乱。

### 8. 性能注意

BetonQuest 的性能开销主要在**变量读写**和**任务判定频率**。任务多、玩家多的时候要注意：

- 别给每个方块都挂条件判定
- 高频触发的目标（移动、点击）要控制数量
- `/bq trace` 是调试工具，**别开着上线**，它会刷日志

## 下一步

- [汉化机制](#/plugin/betonquest) — 42 个语言文件的实际结构
- [权限系统设计](#/guide/permissions-design) — 任务奖励发权限的做法
- [插件汉化与本地化完全指南](#/guide/plugin-localization) — 全站汉化机制总表
