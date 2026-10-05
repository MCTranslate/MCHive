---
id: silkspawners
name: SilkSpawners
description: 让附魔精准采集的镐能挖走刷怪笼并保留原刷怪种类的插件，带完整的权限矩阵与掉落概率配置。装之前先想清楚服务器还撑不撑得住刷怪笼农场。
category: 世界管理
version: SilkSpawners（MC 1.8 - 26.2）
tags: [刷怪笼, 精准采集, 刷怪, 平衡, 权限]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## SilkSpawners 安装教程

### 1. 它做什么

原版刷怪笼**挖了就没了**。SilkSpawners 补上这一环：

| 情况 | 原版 | 装了 SilkSpawners |
|------|------|------------------|
| 精准采集镐挖刷怪笼 | 什么都没 | 掉落刷怪笼物品 |
| 放回去 | — | **还是原来那个刷怪种**（不会变猪） |
| 普通镐挖 | 什么都不掉 | 可配置是否掉落（默认不） |

关键点是**种类保留**：你挖一个蜘蛛刷怪笼，放到基地里，它继续刷蜘蛛，不会因为放置而变成默认种类。

支持 Paper / Spigot / Purpur / Bukkit / Folia，MC 1.8 一直到 26.x。

### 2. ⚠️ 先读这一段：平衡性代价

**刷怪笼是原版刷怪系统的核心。**

原版设计里，刷怪笼是**有限的、不可再生的资源**——一个废弃矿井里就那么几个，挖了就没了，所以玩家必须去下一个结构。这构成了 MC 的探索节奏和资源稀缺性。

SilkSpawners 把这个限制拆了。后果是连锁的：

| 影响 | 表现 |
|------|------|
| 刷怪笼不再稀缺 | 玩家基地里摆满刷怪笼，怪物密度远超原版 |
| 战斗向内容贬值 | 刷怪笼刷怪是前中期最主要的战斗经验来源，难度被稀释 |
| 掉落物通胀 | 击杀量暴增，稀有掉落和经验产出跟着贬值 |
| 地图失去意义 | 「去地下找刷怪笼」这条探索动机基本消失 |
| 服务器负载上升 | 大量刷怪笼 = 持续刷怪 = 实体生成压力 |

**这不是 bug，是设计上故意的**——插件把选择权交给服主。默认配置没帮你调平衡，只是把开关交出来。

**你至少要做一件事：**

- 收紧权限（只给 VIP / 建造者 / 管理），别全服默认
- 或设一个非 100% 的掉落概率，让刷怪笼保持一点稀缺
- 或干脆只允许 `/silkspawners give` 发放，不允许采集

**如果你的服是那种「认真做生存、想保留探索压力」的设计，装之前三思。** 硬上限是 5 小时看完末影龙的服，加刷怪笼农场会跑偏。

### 3. 安装

- 源码：<https://github.com/CorneliusMa/SilkSpawners_v2>
- 发行页：<https://github.com/CorneliusMa/SilkSpawners_v2/releases>
- Modrinth / SpigotMC 搜索 `silkspawners`

下载对应 MC 版本的 jar 丢进 `plugins/`，重启。

### 4. 快速上手

装上之后可以直接跑一键配置：

```
/silkspawners setup
```

它会按推荐值写好权限，然后要你确认。**跑之前先想好要不要全服默认**——确认下去权限就写进配置了，改起来比一开始就想清楚麻烦。

### 5. 权限矩阵

SilkSpawners 的权限设计是把「行为」和「刷怪种类」两个维度拆开：

| 权限 | 控制什么 |
|------|---------|
| `silkspawners.break.*` | 采集刷怪笼 |
| `silkspawners.place.*` | 放置刷怪笼 |
| `silkspawners.change.*` | 用刷怪蛋改刷怪笼种类 |
| `silkspawners.explosion` | 挖刷怪笼时是否可能爆炸 |

星号位置可以填实体名来限定单种：

```
silkspawners.break.*        所有种类都能采集
silkspawners.break.zombie   只有僵尸刷怪笼能采
```

命令权限单独一组（`silkspawners.command.*`），和上面分开。这是个好设计——**你可以让普通玩家采集，但不给任何管理命令**。

想知道有哪些实体名可用：

```
/silkspawners entities
```

### 6. 常用命令

| 命令 | 说明 |
|------|------|
| `/silkspawners help [命令]` | 帮助 |
| `/silkspawners give [数量]` | 直接给刷怪笼 |
| `/silkspawners set` | 改你正在看的那个刷怪笼的种类 |
| `/silkspawners explosion` | 临时开关某玩家的刷怪笼爆炸 |
| `/silkspawners locale` | 重载 / 更新语言文件 |
| `/silkspawners config` | 查 / 改 / 重载配置 |
| `/silkspawners setup [confirm/revert]` | 应用 / 恢复推荐权限 |
| `/silkspawners entities` | 列出可用实体名 |
| `/silkspawners version` | 检查更新 |
| `/silkspawners dump` | 生成诊断报告，报 bug 用这个 |

`config`、`give`、`set` 这几个支持 Tab 补全，参数和值都能补。**不确定能填什么就按 Tab**，比翻文档快。

### 7. 值得关注的配置项

配置项**以你手上版本的注释为准**，这里只说几个真正需要你做决定的：

**掉率** —— 采集和破坏是分开的两项掉率。`100` 就是必掉。想保留稀缺性就调低，或者干脆改成 0 只走权限发放。

**是否必须精准采集** —— 有开关可以允许非精准采集也掉。

**最低精准采集等级** —— 除了 1 级，还可以要求更高等级。**这是给自定义工具/附魔做门槛用的**，比如你想定向刷怪笼必须用特定工具，门槛等级 + 权限双保险。

**防止经验刷取** —— 默认开启，阻止玩家反复拆了又放来刷经验。这个必须开着，否则会有人拿它当经验机。

**是否查 WorldGuard 建造权限** —— 领地内改别人刷怪笼会被拦。**开了这个，WorldGuard 就成了硬依赖**，你领地里装了这插件但没 WorldGuard 的行为要留意。

**爆炸机制** —— 挖刷怪笼有概率炸。分档（普通 / 精准采集）可以配不同强度。这是个可选的「代价」设计，不是必须的。

**自动更新** —— 有个 autoUpdater 开关。**服务器环境里关掉它**，让更新走你正常的测试流程。

### 8. 常见坑

**装完不生效**
检查 `silktouchRequired` 之类的开关是不是被配置成了反的，以及玩家是不是真没权限。

**刷怪笼放下去变了种类**
正常不该发生。如果发生，检查是不是**用了刷怪蛋去改**（`change` 行为），或者有别的插件介入了方块放置。

**重载语言文件把改动冲掉了**
`/silkspawners locale` 会重新拉取语言文件，**你自己改的翻译会被覆盖**。要长期自定义，自己新建一个 locale 文件（按 `messages_你的文件名.properties` 命名），然后在配置里指定用它。作者也鼓励把翻译提交回项目。

**权限生效了但行为还是不对**
权限有四组（break / place / change / explosion）互相独立。只给了一组的话，其他行为仍然走默认值。

**和 WorldGuard 冲突表现**
确认 `useWorldGuard` 开关状态，以及你的 WorldGuard 版本是否正常提供建造权限查询。

### 9. 关于汉化

**没有核实到官方中文语言文件机制。**

SilkSpawners 有多语言机制（`/silkspawners locale` 命令的存在说明确实有语言文件体系），但**具体的中文语言文件名、格式、以及是否已内置简体中文，本站未能核实**。

不写猜测的路径。引导式排查：

1. 装上后跑 `/silkspawners locale`，看它生成 / 更新了哪些文件
2. 解压 jar，看 `resources/` 下的语言资源目录和文件命名规则
3. 跑 `/silkspawners locale` 时留意控制台输出的文件名——它会告诉你用的是哪个
4. 想自己造语言文件，按 `messages_<你起的名字>.properties` 命名，然后在配置里把 `locale` 设成你起的名字

> ⚠️ 关键坑（这条从作者的 README 直接确认）：**通过 `/silkspawners locale` 更新语言文件会覆盖你的修改**。自定义翻译必须放自己的文件里，不能改原文件。

## 下一步

- 权限怎么分配才合理 → [权限系统设计](#/guide/permissions-design)
- 刷怪笼在世界里怎么限制 → [世界管理与多世界](#/guide/multi-world-setup)
- 领地内怎么管 → [区域保护](#/guide/region-protection)
