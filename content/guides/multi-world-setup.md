---
id: multi-world-setup
title: 多世界与主城实战
description: 从「一个世界够用吗」讲到落地配置 — 创建/导入世界、给玩家看中文别名、按世界独立规则、以及 5.x 与旧教程差异最大的那几个坑。
icon: 🌍
tags: [多世界, 主城, Multiverse, 世界管理]
order: 9
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。Multiverse-Core 5.8.1 的 worlds.yml 字段与命令均对照官方 jar 与官方文档核实。

## 一、先判断：你真的需要多世界吗

多世界不是"高级服才配"，但也绝不是越多越好。每个加载中的世界都在**独立跑实体、方块刻和区块加载**——世界越多，同样的 CPU 和内存要做的事越多。

| 你的情况 | 建议 |
|----------|------|
| 只有一个生存服，朋友直接在主世界出生 | **不需要**。原版的 `world` / `world_nether` / `world_the_end` 已经够用 |
| 想要一个「干净的主城/出生点」，不让人在主世界乱建 | 需要（或考虑用 WorldGuard 在主世界圈一块保护区，成本更低） |
| 生存 / 创造 / 小游戏三种玩法要各自的规则和背包 | 需要 |
| 定期重置的「资源世界」 | 需要，而且非常好用 |
| 想开多个服务器串起来（主城 + 生存 + 小游戏分别在独立进程） | 那是**群组服**，请看 [用 Velocity 搭群组服](#/guide/velocity-network)，不是多世界 |

> 判断标准很简单：**是否需要"不同的世界规则"或"不同的世界生命周期"**。只是想保护出生点，用区域插件比多世界划算得多。

## 二、装什么、装哪个版本

核心是 [Multiverse-Core](#/plugin/multiverse-core)，当前版本 **5.8.1**（2026-08-28 发布），官方标注支持 **MC 26.1.2 – 26.3**。下载走 [Modrinth](https://modrinth.com/plugin/multiverse-core) 或 [GitHub Releases](https://github.com/Multiverse/Multiverse-Core/releases)。

> **5.x 是彻底重构过的版本**（配置格式、命令、权限都与 4.x 不同）。网上大量教程还是 4.x 时代的写法，照着抄会踩坑——本文按 5.8.1 的实际行为写。

按需安装的官方附属（都在 Modrinth 上，且都在持续更新，下面的日期是最近更新时间）：

| 附属 | 作用 | 最近更新 |
|------|------|----------|
| Multiverse-Portals | 自建传送门，支持跨世界交通 | 2026-08-21 |
| Multiverse-NetherPortals | 每个主世界配对独立的下界/末地 | 2026-07-23 |
| Multiverse-Inventories | 每个世界独立背包与玩家数据 | 2026-09-21 |

Core 的 `plugin.yml` 里只有 `softdepend: [Vault, PlaceholderAPI]`——也就是**没有硬依赖**，单独装 Core 就能用。只有「世界进入收费」这类功能才需要 Vault 和一个经济插件。

## 三、5 分钟上手流程

装好插件、重启服务器后，插件会自动把已有的世界（`world` / `world_nether` / `world_the_end`）接管进来，不用手动导入。

```bash
# 1. 看现在有哪些世界被接管了
/mv list

# 2. 创建三个新世界
/mv create hub normal          # 主城：普通地形，建成后自己搭
/mv create resource normal     # 资源世界：定期重置
/mv create arena normal -t flat   # 小游戏图：超平坦地形

# 3. 传过去看看（先把主城搭好）
/mv tp hub

# 4. 站在主城出生点位置，把当前位置设为该世界的出生点
/mv setspawn

# 5. 给世界起个中文别名（可选，见下一节）
#    编辑 plugins/Multiverse-Core/worlds.yml 里对应世界的 alias
```

**环境参数只有三个**：`normal`、`nether`、`the_end`。

> 网上有些教程会写 `void`（虚空世界）——**5.x 里不存在这个环境值**，游戏内 Tab 补全只会给出上面三个。想要虚空世界，用 `normal` 创建后自己清空，或配合生成器插件。

**创建时的可用选项**（5.8.1 实际支持的长选项，短选项请以 Tab 补全为准）：

| 选项 | 作用 |
|------|------|
| `--world-type` | 地形类型，取值来自 Bukkit 的 WorldType（如 `normal`、`flat`、`amplified`、`large_biomes`） |
| `--seed` | 指定种子 |
| `--generator` / `--generator-settings` | 指定生成器插件及其参数（地皮、自定义地形） |
| `--biome` | 指定生物群系 |
| `--no-structures` | 不生成结构（村庄、要塞等） |
| `--no-adjust-spawn` | 不自动调整出生点到安全位置 |
| `--force-spawn-position` | 强行使用指定出生点坐标 |
| `--properties` | 附加世界属性 |
| `--generate-bonus-chest` | 生成奖励箱 |

**导入已有世界文件夹**（比如从旧服搬过来）：

```bash
/mv import 旧世界文件夹名 normal
```

> 导入前务必确认：该世界是**用相同或更旧的 MC 版本生成的**。用新版客户端打开过的存档拿回旧服务端导入，会出区块错误。

## 四、worlds.yml 的真实结构（5.x 与旧教程差异最大的地方）

世界属性存在 `plugins/Multiverse-Core/worlds.yml`。**顶层的每个键就是一个世界**，键名是世界的内部名（默认三界通常是 `world` / `world_nether` / `world_the_end`）。

先看下面这张对照表——如果你手上的旧教程与它冲突，**以这张表为准**：

| 旧教程（4.x 时代） | 5.x 的真实情况 |
|--------------------|----------------|
| 文件里有 `worlds:` 外层 | **没有外层**，世界键直接在顶层 |
| 每个世界下有 `==: MVWorld` 标记 | **已移除**（5.x 会自动迁移旧文件，别手动加） |
| 有 `color:` / `style:` 字段 | **已移除**，颜色直接写在 `alias` 里 |
| 字段写成驼峰 `keepSpawnInMemory` | 改成**小写短横线** `keep-spawn-in-memory` |
| 有 `spawning.animals` / `spawning.monsters` | 改成 **8 个生物分类**（见第六节） |
| 有 `entryfee.amount` / `entryfee.currency` | 改成 `entry-fee:` 且**多了 `enabled` 开关** |

**最常用的字段**（值即 5.x 的默认值）：

```yaml
world:
  alias: ''                     # 世界显示别名，支持 & 颜色代码 —— 想显示中文就填这里
  hidden: false                 # 是否在 /mv list 中隐藏
  auto-load: true               # 服务器启动时是否自动加载该世界
  difficulty: normal            # peaceful / easy / normal / hard
  gamemode: survival            # survival / creative / adventure / spectator
  pvp: true                     # 是否允许玩家互相攻击
  allow-weather: true           # 是否允许天气变化（展示型建筑世界建议关）
  allow-flight: false           # 是否允许飞行
  allow-advancement-grant: true # 是否允许获得成就
  hunger: true                  # 是否消耗饥饿值（主城可关，玩家不会饿死）
  auto-heal: true               # 是否自动回血
  adjust-spawn: false           # 是否自动把出生点调整到安全位置
  anchor-respawn: true          # 是否允许重生锚设定重生点
  bed-respawn: true             # 是否允许床设定重生点
  respawn-world: ''             # 死亡后重生到哪个世界，留空=本世界
  portal-form: all              # 允许形成的传送门：all / nether / end / none
  player-limit: -1              # 世界玩家上限，-1 = 不限
  scale: 1.0                    # 坐标缩放（下界默认 8.0、末地默认 16.0，主世界 1.0）
  world-blacklist: []           # 孤立规则：这些世界的玩家无法传送到本世界
  biome: ''                     # 强制生物群系，一般留空
  generator: ''                 # 地形生成器（创建时设定，别手改）

  read-only:                    # 只读字段，由插件维护，不要手改
    environment: normal         # 世界环境
    generator-settings: ''      # 生成器参数
    legacy-world-name: world    # 关联的世界文件夹名
    seed: 0                     # 世界种子
  version: 1.3                  # 配置版本号，别动
```

改完 `worlds.yml` 后执行 `/mv reload`（或重启服务器）生效。

> **别在世界名里用中文**：世界的内部名要能当文件夹名用，只允许小写字母、数字、`.`、`_`、`-`。中文显示名请写进 `alias`，那才是给玩家看的东西。

## 五、最常改的几件事

**给世界取中文名**：编辑 `worlds.yml`，把对应世界的 `alias` 填成中文即可，`/mv list`、传送提示里就会显示中文。也可以游戏内改：`/mv modify <世界> set alias <名字>`。

**单世界关 PVP**：`worlds.yml` 里把该世界的 `pvp` 改成 `false`，或用 `/mv modify <世界> set pvp false`。只影响这个世界的 PvE/PvP 规则，不碰原版 gamerule。

**单世界换难度**：`difficulty` 改为 `peaceful` / `easy` / `normal` / `hard`。

**让死亡后回主城**：在生存世界的 `respawn-world` 填主城的世界名（如 `hub`），玩家在该世界死亡后会重生到主城。

**让主城不受天气影响**：`allow-weather: false`。

**禁止在某个世界生成传送门**：`portal-form: none`（也可以只禁下界 `nether` 或只禁末地 `end`）。

> **关于 `keep-spawn-in-memory`（出生点区块常驻内存）**：这个字段确实存在、默认 `true`，但官方已注明——**Minecraft 1.21.9 起该特性被官方移除，在 1.21.9+ 的服务端上设置为 `true` 也不会有任何效果**。本站面向 Paper 26.x，也就是说：**别再指望靠它优化主城性能了**，把精力放到 [性能调优](#/guide/performance-tuning) 里更有效的手段上。

## 六、按世界控制生物生成

5.x 的生物控制配置长这样：`spawning` 下是**8 个生物分类**，每类有四个字段。

```yaml
  spawning:
    monster:                    # 怪物（僵尸、骷髅……）
      spawn: true               # 该分类是否生成
      spawn-limit: '@unset'     # 生成上限，可填整数，或 @unset（不干预）/ @bukkit（跟随服务端）
      tick-rate: '@unset'       # 生成间隔，同上
      exceptions: []            # 例外实体列表（不受 spawn 开关影响）
    animal:                     # 动物（牛、羊、猪……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    # 其余分类：water_animal（鱿鱼/海豚）、water_ambient（鱼类）、
    # water_underground_creature（发光鱿鱼）、ambient（蝙蝠）、
    # axolotl（美西螈）、misc（玩家/盔甲架/船等）
```

**最常见的需求：主城不要刷怪**——把主城世界的 `spawning.monster.spawn` 改成 `false`。游戏内也可以操作：

```bash
/mv entity-spawn-config modify monster set spawn false
```

> 注意 `spawn-limit` 和 `tick-rate` 的特殊取值：`@unset` 表示"不干预"，`@bukkit` 表示"跟随服务端的 Bukkit 配置"。填整数则直接覆盖。旧教程里的 `spawnrate` 是 4.x 的写法，5.x 已不使用。

## 七、世界进入收费

需要 Vault + 一个经济插件（详见 [经济系统搭建](#/guide/economy-setup)）。配置在对应世界下：

```yaml
  entry-fee:
    enabled: false            # 必须显式打开，否则金额填了也不生效
    amount: 0.0               # 每次进入扣多少钱
    currency: '@vault-economy'  # 使用哪个经济实现；默认跟随 Vault 的默认经济
```

> **重复扣费**：这个功能是"每次进入"扣费，玩家反复传送会反复扣钱。如果只是想收"一次性的门票"，用权限或商店插件实现更合适。

## 八、命令速查

| 命令 | 说明 |
|------|------|
| `/mv list` | 列出所有已加载世界 |
| `/mv create <名> <环境>` | 创建世界（环境：`normal` / `nether` / `the_end`） |
| `/mv import <名> <环境>` | 导入服务端目录里已存在的世界文件夹 |
| `/mv tp <世界>` | 传送到世界的出生点（`/mvtp` 是简写；也支持锚点、精确坐标、玩家等目的地，具体前缀用 Tab 补全确认） |
| `/mv info [世界]` | 查看世界属性详情 |
| `/mv setspawn` | 把当前位置设为你所在世界的出生点 |
| `/mv modify <世界> set <属性> <值>` | 游戏内修改世界属性（等价于改 worlds.yml） |
| `/mv gamerule set <规则> <值> [世界]` | 读写该世界的原版 gamerule |
| `/mv entity-spawn-config` | 管理生物生成设置 |
| `/mv anchor set/list/delete` | 管理命名锚点（比记坐标方便的目的地） |
| `/mv clone <源> <新名>` | 复制一个世界（做模板/开新副本很好用） |
| `/mv regen <世界>` | 重新生成世界地形（**会清空建筑，谨慎**） |
| `/mv unload <世界>` | 只从内存卸载，配置和文件都保留 |
| `/mv remove <世界>` | 卸载并从 worlds.yml 中移除（世界文件夹保留） |
| `/mv delete <世界>` | **物理删除世界文件夹**，需要 `/mv confirm` 二次确认 |
| `/mv reload` | 重载配置 |
| `/mv confirm` | 确认上一个危险操作 |

## 九、常见坑

| 症状 | 原因与解法 |
|------|-----------|
| 世界列表里没有我导入的世界 | 用 `/mv import <名> <环境>`，或者该世界没被识别——检查文件夹名是否合法（不能有中文/空格/大写） |
| 改了 worlds.yml 没反应 | 没执行 `/mv reload`，或改的键名是 4.x 的旧写法（对照第四节表格） |
| 玩家用 `/mv tp` 报没权限 | Multiverse 有自己的权限节点体系；用 `/mv` 系列命令的玩家需要 `multiverse.teleport.*` 一类的权限，另有更细的 teleport 权限开关在 Core 的 config.yml 里 |
| 旧教程说的 `==: MVWorld` 我加了反而乱 | 该标记是 4.x 的，5.x 会主动迁移并移除它，**不要手动添加** |
| 主城卡顿，想靠 `keep-spawn-in-memory` 优化 | MC 1.21.9+ 该特性已被官方移除，**此路不通**，请走性能调优 |
| 中文别名显示成乱码 | `worlds.yml` 必须以 **UTF-8 无 BOM** 保存，不要用记事本 |
| 世界里的命令帮助是英文 | Multiverse 内置简体中文，但 `/mv` 命令的**部分描述文本**受上游命令库限制暂时无法翻译，属已知情况 |

## 十、备份与删除：最危险的两件事

**删除世界是物理删除。** `/mv delete` 会真的把世界文件夹从磁盘上删掉——地图没了就是真没了。想临时让世界消失，用 `/mv unload`（只卸载）或 `/mv remove`（卸载+从配置移除，文件保留）。

**动手前先备份。** 涉及世界的操作，至少要备份三样：

1. `plugins/Multiverse-Core/worlds.yml`（世界配置，改坏了所有世界属性一起乱）
2. 世界文件夹本身（`world/`、`hub/`、`resource/`……）
3. 如果装了 Multiverse-Inventories，还要备份它的数据目录

> 顺带一提：`/mv regen` 会重新生成地形，**建筑会全部消失**。它的常见用法是重置"资源世界"这类拿来做消耗品的世界——对其他世界使用前，务必确认你不需要里面的建筑了。

## 下一步

- 还没装插件？先看 [插件组合：按服务器类型直接抄](#/guide/plugin-combos)
- 想给主城划出「不可破坏」的安全区？看 [区域保护与世界规则](#/plugin/worldguard)（WorldGuard）
- 世界太多导致卡顿？看 [性能调优从入门到精通](#/guide/performance-tuning)
- 想让不同玩法跑在**独立服务器进程**上？那需要群组服：[用 Velocity 搭群组服](#/guide/velocity-network)
