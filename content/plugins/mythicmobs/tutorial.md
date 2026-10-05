---
id: mythicmobs
name: MythicMobs
description: 配置驱动的自定义怪物/Boss 引擎 — 用 YAML 写技能、掉落、刷怪规则，RPG 服刷怪系统的地基。
category: 功能插件
version: 5.7.1（MC 1.18.2 - 26.2）
tags: [刷怪, Boss, 怪物, 技能, RPG, YAML]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## MythicMobs 安装教程

### 1. 它是什么

MythicMobs 不是一个「加了几只新怪」的插件。它是一台**用 YAML 驱动的怪物引擎**：你写一份配置，它负责把这些怪生成到世界里、跑 AI、放技能、掉装备、算掉落倍率。

| 能力 | 说明 |
|------|------|
| 自定义怪物 | 改原版怪的血量、伤害、名称、皮肤、装备、掉落表 |
| 技能系统 | 发射物、粒子、位移、治疗、召唤、随机目标选择、条件触发 |
| 刷怪规则 | 定时随机刷、批量刷、代替原版自然生成 |
| 掉落表 | 独立掉落配置，支持权重、掉率、条件、每玩家独立结算 |
| 手持物品 / 头部装饰 | 手里拿着自定义物品的怪，视觉上比裸模强太多 |

**为什么它是 RPG 服的地基**：一个能玩的 RPG 服需要「BOSS 有阶段机制、精英怪会远程放技能、玩家死亡不掉装备」这些东西。MythicMobs 就是干这个的，而且不用写代码——改 YAML 就能生效，这对没有程序员的服主是决定性的。

### 2. 不适合什么场景

先把话说清楚，不然你会白折腾：

| 场景 | 建议 |
|------|------|
| 只是想让原版怪变强一点 | 用 [LibertyBans](#/plugin/libertybans) 那类小插件更省事，MythicMobs 对新手偏重 |
| 想加**新方块**、新矿物、新机器 | MythicMobs 不做方块，要用 ItemsAdder / Oraxen |
| 单人原版生存、想保持原味 | 别装。它会接管刷怪逻辑，收益远小于成本 |
| 极限性能压力服（几百实体同屏） | 先看 [性能调优](#/guide/performance-tuning)，MythicMobs 的 AI 和技能循环是实体密集型开销 |

还有一个常见误解：**MythicMobs 不是「配置面板插件」**。它没有 GUI，全部靠改 YAML + `/mm reload`。策划要自己动手。

### 3. 前置依赖

| 依赖 | 是否必须 | 说明 |
|------|----------|------|
| MythicLib | **必须** | MythicMobs 5.x 的通用库，不装直接启动失败 |
| PlaceholderAPI | 建议 | 名字plate、血条、Tab 里显示怪物信息 |
| ProtocolLib | 可选 | 一些技能效果需要 |
| ItemsAdder / Oraxen | 可选 | 让怪物手持自定义材质物品 |

MythicMobs 只提供 **Paper / Purpur / Spigot** 构建，不支持 Bukkit 官方核心，也不单独声明 Folia 支持。要跑 Folia 请先确认手上的构建是否适配。

### 4. 下载与安装

官方仓库（唯一可信来源）：

- 仓库：<https://github.com/ItsMythics/MythicMobs>
- 发行页：<https://www.mythiccraft.io/>（免费版下载在官网）

> 免费版（Free）功能已经够用：Boss、技能、掉落、刷怪全都有。Premium 主要卖的是**属性上限和更多技能**。别一上来就买，先用免费版把玩法跑通。

丢进 `plugins/`，连同 MythicLib 一起。重启后会生成 `plugins/MythicMobs/` 目录。

### 5. 目录结构

装完之后目录里最重要的是这几个文件：

```
plugins/MythicMobs/
├── config.yml     # 全局开关、性能上限、调试选项
├── mobs.yml       # 怪物定义（血量、名字、技能、掉落）
├── skills.yml     # 技能定义
├── drops.yml      # 掉落表
├── items.yml      # 自定义物品
└── RandomSpawns/ # 随机刷怪规则（升级后会生成）
```

**新手只需要先碰 `mobs.yml`。** 其他都是进阶。

### 6. 第一个怪物

在 `mobs.yml` 里加一段，格式是这样（YAML 对缩进敏感，**只能用空格，不能用 Tab**）：

```yaml
MyFirstBoss:
  Type: ZOMBIE
  Display: '&c[首领] &f初始魔像'
  Health: 1000
  Damage: 15
  Options:
    FollowRange: 40
    Despawn: false
    PreventOtherDrops: true
  Skills:
  - particles{m particles=flame;amount=30} @self ~onTimer:20
  - projectile{onTick=...;v=8;i=1;hR=1} @target
  Drops:
  - drop{(drop=GoldHelmet) 0.05}
```

> 上面的 `projectile` 参数只是示意写法，实际参数名和语法**以你手上版本的 MythicMobs 文档为准**（技能语法在 5.x 里版本间调整过）。写之前先去官方文档查对应版本的技能语法，别照抄网上的老版本例子。

改完执行 `/mm reload`。

### 7. 常用命令

| 命令 | 说明 |
|------|------|
| `/mm mobs spawn <类型> [数量]` | 生成指定怪物，用来测试 |
| `/mm mobs kill <类型> [半径]` | 击杀范围内指定类型的怪 |
| `/mm mobs info` | 查看附近有什么怪（排查刷怪问题） |
| `/mm mobs stats` | 怪物性能统计 |
| `/mm reload` | 重载配置 |
| `/mm reload log` | 重载并输出详细日志（排查 YAML 报错用这个） |
| `/mm skills` | 技能相关命令 |
| `/mm items list` | 列出已加载的自定义物品 |
| `/mm drop <类型> [数量]` | 直接给玩家结算某怪的掉落 |
| `/mm mobs setpose <类型>` | 摆姿势（主要用于盔甲架伪装） |
| `/mm generate <类型> <半径>` | 预生成刷怪点，减少第一次进服的卡顿 |

`/mm reload log` 值得单独说一句：**YAML 写错了 reload 只会报一个笼统的错**，加 `log` 能在控制台看到具体哪一行解析失败。这是 MythicMobs 排错的第一个工具。

### 8. 关键配置：性能上限

MythicMobs 自带实体数量限制，在 `config.yml` 里。**开服前先把上限设好**，否则玩家一多，实体堆积会直接把 TPS 拖死。

需要关注的思路是：给 `mobs.yml` 里的大怪关掉 `Despawn`（不然打死后尸体堆积），同时给刷怪规则设数量上限。具体键名请打开你版本的 `config.yml` 搜索 `Entities` / `Limit` 之类的段落确认——**各版本键名有变化，以实际文件为准**。

### 9. 常见坑

**怪物不刷 / 技能不触发**

90% 是 YAML 缩进用了 Tab，或者技能名拼错。用 `/mm reload log` 看具体报错行。

**reload 之后怪还是旧的**

有些版本 reload 不会刷新已经存在的实体。用 `/mm mobs kill <类型>` 清一遍再生成。

**怪物卡在墙里 / 瞬移到你脸上**

`FollowRange` 设太大，加上地形复杂的地图很容易出这问题。远程怪建议把跟随距离压到 20 以内，位移技能要设冷却。

**战斗中 TPS 突然掉到个位数**

典型的实体过载。检查：一次刷太多怪、怪的技能里带高频粒子、Boss 血量太高导致战斗拉太长。优化顺序：先降粒子数量 → 再降刷怪密度 → 最后才考虑加内存。开 [lag-diagnosis](#/guide/lag-diagnosis) 那篇用 spark 定位。

**版本升级后技能失效**

MythicMobs 5.x 之间技能参数改过好几次。**跨大版本升级时必须重读官方 changelog**，不要假设配置能直接搬。

### 10. 汉化

> **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**

没有核实到独立的中文语言文件，所以汉化只能走「改显示文本」这条路：

| 位置 | 改什么 |
|------|--------|
| `mobs.yml` 的 `Display` | 怪物头顶显示的名字，这是最直接的 |
| `items.yml` 的显示名 / Lore | 掉落物和手持物品的名字与描述 |
| 技能里的 `message` 类参数 | 技能播报文本 |
| `config.yml` 中 `messages` / `locale` 之类段落 | 打开文件搜一下这类段落，插件的通用提示语往往在这里 |

> ⚠️ **以你手上版本的实际文件为准。** 各版本字段位置有变动，本站不提供逐键对照的汉化文件，避免给出对不上的键名。

## 下一步

- 配好刷怪规则之后，看一下 [插件组合搭配](#/guide/plugin-combos) 里 MythicMobs 常见的搭配
- 想让怪物信息显示在血条 / Tab 上 → [PlaceholderAPI](#/plugin/placeholderapi)
- 领地保护压住野外刷怪 → [WorldGuard](#/plugin/worldguard)
- 掉率算不明白 → [经济系统搭建](#/guide/economy-setup)
