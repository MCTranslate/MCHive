---
id: quests
name: Quests
description: 任务系统 — 用聊天编辑器把「挖 32 个木头」这类目标串成多阶段任务链，配 NPC 发任务、自动发奖，适合给生存服造长期目标。
category: 任务系统
version: 3.16.1（MC 1.8 - 1.21.10）
tags: [任务, 任务链, 奖励, NPC, 玩法]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: 46 个语言文件、中文跟随客户端自动切换，附 config.yml 的 language 项说明
downloads: []
---

## Quests 安装教程

### 1. 它是什么

Quests（PikaMug）是一个**任务引擎**——它自己不提供任何玩法内容，只提供一套「目标 → 进度 → 奖励」的框架。

具体能做什么：

| 能力 | 说明 |
|------|------|
| 多阶段任务 | 一个任务拆成多个 stage，每个 stage 有独立目标 |
| 目标类型 | 破坏方块、击杀生物/玩家、提交物品、到达地点、附魔、养 MythicMobs 怪 |
| 奖励 | 物品、经验、金钱（走 Vault）、权限点、其他插件的自定义动作 |
| 条件 | 等级、权限节点、WorldGuard 区域、必须先完成的任务、冷却时间 |
| 发放方式 | 聊天命令、NPC（Civillens / ZNPCsPlus）、或直接写进任务书 GUI |
| 进度追踪 | 指南针指向、动作条、书本 GUI |

**关键点**：Quests 是纯服务端逻辑，玩家不用装任何客户端模组，也不用下资源包。这在任务类插件里是少数派（很多同类插件要靠 ItemsAdder 之类塞自定义物品）。

> 它适合「给玩家一个继续玩下去的理由」的服。不适合当主玩法——如果你要的是剧情向任务，BetonQuest 那种带对话分支的会更合适。

### 2. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper / Purpur / Spigot（声明支持 Folia） |
| 硬依赖 | **无**。装上就能用 |

可选联动（不装不影响核心功能）：

| 插件 | 联动后多什么 |
|------|-------------|
| Citizens / ZNPCsPlus | NPC 发放任务、对话交付物品 |
| Vault + 经济插件 | 任务发金币奖励 |
| WorldGuard | 任务要求玩家待在指定区域内 |
| MythicMobs | 「击杀指定怪物」目标 |
| PlaceholderAPI | 记分板 / TAB 显示任务状态变量 |
| Dynmap | 任务相关可选 GUI 功能 |

### 3. 下载与安装

- 仓库：<https://github.com/PikaMug/Quests>
- 文档：<https://pikamug.gitbook.io/quests>
- 发行页：<https://github.com/PikaMug/Quests/releases>

把 jar 丢进 `plugins/`，重启。首次启动会生成：

```
plugins/Quests/
├── config.yml      ← 全局设置
├── actions.yml     ← 自定义动作（不建议手改）
├── quests/         ← 任务定义，一个任务一个 .yml
├── data/           ← 玩家进度
└── lang/           ← 语言文件
```

### 4. 先做一件事：定语言

**装完先去 `plugins/Quests/config.yml` 改一行**，不然任务名和提示会是英文：

```yaml
language: zh-CN
```

`zh-CN` 是简体、`zh-TW` 是繁体。完整机制见 [汉化机制](#/plugin/quests/lang.md)。

> Quests 也支持**留空跟随客户端**——简体客户端自动拿中文。用这个好处是英文服可以不管，缺点是没法强制全服统一语言。

### 5. 第一个任务

任务全部写在 `plugins/Quests/quests/` 下，一个文件一个任务。最短的一个长这样：

```yaml
first-steps:
  name: "伐木工训练"
  ask-message: "村里缺木头，你能帮个忙吗？"
  finish-message: "干得好，村民会记住你的。"
  requirements:
    level: 0
  stages:
    ordered: "1"
    break-block-names:
    - OAK_LOG
    break-block-amounts:
    - 32
  rewards:
    experience: 100
    items:
    - material: IRON_AXE
      amount: 1
```

**几个必须懂的字段**：

| 字段 | 作用 | 踩坑点 |
|------|------|--------|
| 文件名 | 任务 ID，玩家命令里要用它 | 改名会让已接任务的玩家数据对不上 |
| `ordered` | 多阶段时是否为顺序解锁 | 写 `"1"` 就是必须先做 stage 1 |
| `break-block-names` | 目标方块的 `MATERIAL` 名 | **必须是英文 Material 名**，写中文永远不触发 |
| `rewards.money` | 走 Vault 发钱 | **没装 Vault 会报错或直接不发** |
| `npc-giver-uuid` | 指定 NPC 发放 | 手写 UUID 容易错，建议用编辑器 |

改完执行 `/quests reload` 热重载。

### 6. 用游戏内编辑器（推荐）

手写 YAML 适合复制粘贴别人的任务。**自己造任务用编辑器舒服得多**：

| 命令 | 说明 |
|------|------|
| `/quests editor` | 打开任务编辑器，开始新建 |
| `/quests reload` | 重载配置与任务 |
| `/quests create <id>` | 命令行创建 |

编辑器是聊天式一问一答，走完就自动把 YAML 写进 `quests/` 目录。**比手改文件靠谱得多**——手改 YAML 缩进错一个空格，插件直接加载失败且不告诉你哪一行。

### 7. 常用命令

三个主命令，默认全服可用：

| 命令 | 别名 | 说明 |
|------|------|------|
| `/quests` | `/qs` | 任务相关（列表、接取、进度） |
| `/quest` | `/q` | 同上，玩家向 |
| `/questadmin` | `/qa` | 管理向，**只给 OP / 管理员** |

玩家常用子命令：

| 命令 | 说明 |
|------|------|
| `/q list` | 列出当前可接的任务 |
| `/q take <任务ID>` | 接取任务 |
| `/q quit <任务ID>` | 放弃任务 |
| `/q cancel <任务ID>` | 取消任务（管理员） |
| `/q finish <任务ID>` | 直接完成（管理员） |
| `/q journal` | 打开任务日志 GUI |
| `/q progress <任务ID>` | 查看某任务的详细进度 |
| `/q top` | 任务积分排行 |

> ⚠️ **子命令会随语言变**。切成中文后 `list` 可能变成中文子命令，权限节点不变。老教程里写死英文命令的，切换语言后会失效——这是 Quests 最容易踩的坑之一。

### 8. 几个必须知道的配置项

`config.yml` 里新手只需要动这些：

```yaml
# 全局同时能接几个任务（设 0 = 不限制）
max-quests: 0

# 是否允许玩家用命令接任务（关掉就强制走 NPC/UI）
allow-command-questing: true

# NPC 任务是否也能用命令接
allow-command-quests-with-npcs: true

# 接任务时是否需要 Yes/No 确认
ask-confirmation: true

# 任务进度提示的显示间隔（秒），太小会刷屏
npc-effects:
  enabled: true

# 排行榜最多显示几个
top-limit: 10

# 物品名是否翻译成客户端语言
translate-names: true
```

**`max-quests` 建议设个上限**。不设上限的问题：玩家会把所有任务同时接了，然后满地图跑。你的任务设计再精彩，也架不住被当清单刷。

> 其他配置项请以官方 `config.yml` 注释为准，本页不逐条列了。

### 9. 常见坑

**任务不推进 / 进度一直是 0**

九成是目标名写错。`break-block-names` 里必须是 Minecraft 的英文 `MATERIAL` ID（`OAK_LOG` 不是 `橡木原木`），而且**大小写敏感**。去 Minecraft Wiki 查准确名字。

**`rewards.money` 不发钱**

没装 Vault，或者装了 Vault 但经济插件（EssentialsX Eco / CMI）没正常加载。控制台会刷 `Vault not found` 之类的警告，别忽略。

**多人同时接任务后进度串了**

任务数据是**按玩家 UUID 存的**。跨服同步进度需要自己配数据库，Quests 支持但不是开箱即用——单服没事，群组服要单独规划。

**装上就报 `Unknown command`**

`/quests` 系列全被禁用了。看 `config.yml` 里的命令开关，以及 LuckPerms 里有没有把权限节点给误收回。

**中文任务名显示成乱码**

YAML 文件存成了非 UTF-8。用 Windows 记事本改的尤其容易踩。换成 VSCode / Notepad++ 明确选 UTF-8 保存。

**任务编辑到一半崩了**

`actions.yml` 手改容易破坏结构。官方明确说了**不建议手动编辑这个文件**，用 `/quests actions` 命令建。这个文件坏了会让整个插件加载失败。

### 10. 什么时候别用 Quests

说点不好听的：

- **小服（10 人以内）** — 任务系统的价值在于给多人服一个共同目标，5 个人互相认识还需要任务引导吗？纯管理负担。
- **纯 PVP / 小游戏服** — Quests 是给有成长线的服设计的，加在起床服上只会添乱。
- **已经有 BetonQuest** — 功能重叠，两个任务插件同时装会打架（命令、GUI、进度判定）。
- **需要分支剧情** — Quests 的 stage 是线性的，真要分支得自己用 actions 硬凑，维护成本失控。这时候不如上 BetonQuest。

## 下一步

- 语言怎么切、怎么自己补翻译？→ [汉化机制](#/plugin/quests/lang.md)
- 发钱要配什么？→ [经济系统搭建](#/guide/economy-setup)
- 任务进度想显示在 TAB 上？→ [TAB 与记分板](#/guide/tab-scoreboard)
- 区域类任务条件怎么配？→ [WorldGuard 区域保护](#/guide/region-protection)
