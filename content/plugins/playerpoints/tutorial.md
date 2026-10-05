---
id: playerpoints
name: PlayerPoints
description: 独立点券系统 — 和主经济货币分开的钱包，给活动奖励/VIP/贡献用，支持 MySQL 群组服同步，不会污染主经济平衡。
category: 经济交易
version: 3.3.5（MC 1.8 - 26.2）
tags: [点券, 经济, 货币, 排行, Vault]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: locale/<locale>.yml 单文件结构，中文用下划线命名（zh_CN），共两款中文语言包
downloads: []
---

## PlayerPoints 安装教程

### 1. 它是什么

PlayerPoints 是一套**和主经济完全独立的点券系统**。

为什么服务器需要第二套货币？举个例子：

| 场景 | 用主货币（金币） | 用点券 |
|------|----------------|---------|
| 玩家挖矿卖了 5000 金币 | 照常收入 | 照常收入 |
| 参加活动赢得奖励 | +5000（通胀了） | +50 点券（不影响金币） |
| 商店卖的东西 | 贵 | 便宜 |

**核心价值是经济隔离。** 活动奖励、VIP 福利、贡献度这类「不该影响主经济平衡」的发放，走点券。主货币还是那个数，商店定价不用重算。

其他常见用途：贡献排行榜奖励、投票奖励、建造评分兑换。

### 2. 和 Vault 的关系

PlayerPoints **会向 Vault 注册成一套独立货币**，所以 BossShop、CMI 这类支持 Vault 多货币的插件可以直接调它。

但要注意：**装了 PlayerPoints 不等于有主经济。** 主金币还是得靠 EssentialsX Eco 或 CMI 提供，两者是并行关系：

```
EssentialsX Eco  → 金币（Vault currency #1）
PlayerPoints     → 点券（Vault currency #2）
```

如果你只想要一套货币，**别装这个**，用 EssentialsX 就够了。PlayerPoints 的意义在于「两套」。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper / Spigot（声明支持 Folia） |
| 硬依赖 | 无 |
| 可选 | Vault（接经济类插件）、Votifier（投票奖励） |

### 4. 下载与安装

- 仓库：<https://github.com/Rosewood-Development/PlayerPoints>

jar 丢进 `plugins/`，重启。生成 `plugins/PlayerPoints/`。

**先改语言**，否则全是英文：

```yaml
# plugins/PlayerPoints/config.yml
locale: zh_CN
```

> ⚠️ **注意这里是下划线 `zh_CN`，不是连字符。** 和 BentoBox（`zh-CN`）、Quests（`zh-CN`）都不一样。写错了不报错，只是悄悄变英文。详见 [汉化机制](#/plugin/playerpoints/lang.md)。

### 5. 常用命令

主命令 `/points`，别名 `/playerpoints`、`/p`。

| 命令 | 权限 | 说明 |
|------|------|------|
| `/points` | 无 | 显示版本与作者 |
| `/points me` | `playerpoints.me` | 查自己的点券 |
| `/points look <玩家>` | `playerpoints.look` | 查别人有多少 |
| `/points pay <玩家> <数量>` | `playerpoints.pay` | 转给别人 |
| `/points lead [next/prev/#页]` | `playerpoints.lead` | 点券排行榜 / 翻页 |
| `/points give <玩家> <数量>` | `playerpoints.give` | 管理员发放 |
| `/points take <玩家> <数量>` | `playerpoints.take` | 管理员扣除 |
| `/points set <玩家> <数量>` | `playerpoints.set` | 设为指定值 |
| `/points reset <玩家>` | `playerpoints.reset` | 清零 |
| `/points giveall <数量>` | `playerpoints.giveall` | 给全体在线 |
| `/points broadcast <数量>` | `playerpoints.broadcast` | 公告某人获得点券 |
| `/points export` | `playerpoints.export` | 导出到 storage.yml |
| `/points import` | `playerpoints.import` | 从 storage.yml 导入 |
| `/points reload` | `playerpoints.reload` | 重载并保存改动 |

**别把 `/p` 完整权限发给普通玩家。** `/p` 是 `/points` 的缩写，但历史上和 PlotMe、地皮类插件的 `/p` 冲突过。群组服里建议**收回 `/p` 别名**，只留 `/points`——或者给地皮插件改别名。

### 6. 权限怎么分

| 节点 | 该给谁 |
|------|--------|
| `playerpoints.me` | 所有人 |
| `playerpoints.look` | 所有人（查别人） |
| `playerpoints.pay` | 所有人（转账） |
| `playerpoints.lead` | 所有人（排行榜） |
| `playerpoints.give` | 活动组 / 协管 |
| `playerpoints.take` | 协管 |
| `playerpoints.set` | **只给管理员**（直接改余额，等于造币） |
| `playerpoints.reset` | **只给管理员** |
| `playerpoints.giveall` / `broadcast` | 管理员 |

`give` 和 `set` 不是一个量级——`give` 一次发一点，`set` 能把余额直接写成任意数。**`set` 别下放。**

### 7. 存储方式

`plugins/PlayerPoints/config.yml`：

```yaml
# 存储方式：YAML / SQL / MYSQL / SQLITE
storage:
  method: YAML
```

| 方式 | 适用 |
|------|------|
| `YAML` | 单服、几十人，默认够用 |
| `SQL` / `SQLITE` | 单服几百人+，减少读写卡顿 |
| `MYSQL` | 群组服必选，多后端共享余额 |

群组服**必须用 MySQL**，否则各后端余额互相看不见——玩家在生存服存的钱，到 lobby 服显示是 0。

> 换存储方式有专门的导入流程（`/points export` → 改配置 → `/points import`）。**别直接改 `method` 了事**，那等于换了个空数据库。

### 8. Votifier 投票奖励

装了 Votifier 可以给玩家投票奖励点券：

```yaml
# 以官方 config.yml 注释为准，下面是常见结构
votifier:
  enabled: false
  amount: 100
  online: false
```

- `amount`：每次投票给多少点券
- `online`：是否要求玩家在线才发放。设 `false` 更保险（玩家投票时可能已下线），但需要 PlayerPoints 存的是 UUID 而不是名字——**换版时务必确认这一点。**

> ⚠️ `online: true` + 玩家离线 = 奖励丢失。投票奖励是拉留存的重要手段，丢一次玩家就不会再投第二次了。设 `false`。

### 9. 常见坑

**BossShop 里看不到点券选项**

BossShop 要在配置里**手动添加** Vault 货币类型，插件装上不会自动出现。检查 BossShop 的货币配置里有没有指向 PlayerPoints 的 Vault 货币编号。

**离线玩家余额丢了 / 显示 0**

YAML 存储在某些情况下对离线玩家数据处理有问题。**用 YAML 时 `/points look` 查离线玩家要特别留意。** 认真对待这个需求就上 SQLite。

**`/p` 和别的插件命令打架**

见上面。群组服统一改别名。

**给离线玩家 give 报错**

看 `votifier.online` 那类设置，以及存储方式是不是支持离线操作。建议用 `playerpoints.give` 而不是让玩家自己 `pay`（`pay` 天然需要对方在收）。

**`/points set` 之后数据错乱**

`set` 是覆盖式的，绕过了所有加减逻辑。多人同时操作时容易出竞态。**除非在补数据，否则别用 `set` 当日常工具。**

**改完配置玩家数据还在但显示异常**

先备份 `storage.yml` 或数据库，再 `/points reload`。reload 会**保存内存中的改动**——如果你手改了文件但没重启，reload 可能把文件改回去。改存储方式必须重启。

### 10. 什么时候别用 PlayerPoints

说直白点：

- **只有一套货币需求** → 装 EssentialsX Eco 就够，多一个插件多一份维护。
- **没有多服需求，也不到几百人** → YAML 存储够用，别为了「以后可能要」提前上 MySQL，那是给自己找运维活。
- **主经济本身就没平衡好** → **先别加第二套货币。** 两套货币的兑换比值会立刻变成新问题（1 点券值多少金币？），这个比例一旦定错，玩家会疯狂套利。经济没定型就上双货币，是给服主自己挖坑。

## 下一步

- 语言怎么切、坑在哪 → [汉化机制](#/plugin/playerpoints/lang.md)
- 主经济怎么配 → [经济系统搭建](#/guide/economy-setup)
- 两套货币的兑换怎么设计 → [经济系统搭建](#/guide/economy-setup)
- 权限怎么规划 → [权限系统设计](#/guide/permissions-design)
