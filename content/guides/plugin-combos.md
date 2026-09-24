---
id: plugin-combos
title: 插件组合：按服务器类型直接抄
description: 生存服 / RPG 服 / 小游戏服 / 公益服 / 生电服 — 每种方案都附完整插件清单、安装顺序、权限依赖和注意事项。
icon: 🧩
tags: [插件, 组合, 推荐]
order: 3
---

# 插件组合方案：按服务器类型直接抄

> 本教程更新于 2026 年 9 月，插件版本随各项目当前发布页为准。
>
> 本文的插件清单经过社区验证，**全部免费**（优先开源项目）。

开服最痛苦的不是装插件，是**选型**：同类型的插件一大堆，装哪个？装了会不会冲突？权限怎么搭配？

本站按服务器类型给出成熟方案。每套方案都经过社区验证，覆盖了该类型服务器 90% 的需求。

---

## ⚠️ 安装插件前的通用注意事项

**无论装哪个插件，遵循这几条铁律**：

```
❶ 永远先备份，再装新插件。
   备份命令（在控制台执行）：
   save-all flush → stop
   
   或直接复制整个 plugins/ 目录：
   cp -r plugins/ plugins_backup_$(date +%Y%m%d)/

❷ 每次只装一个插件 → 看控制台有没有红色报错 → 再装下一个。
   一口气装 110 个再启动 → 出了 bug 你都不知道是谁导致的。

❸ 下载渠道只选官方（避免带后门的「破解版」）：
     ✅ 官方 GitHub Releases
     ✅ SpigotMC / Modrinth 官方页面
     ✅ 本站在插件库提供的直链
     ❌ XX 论坛的「破解合集包」
     ❌ 来路不明的网盘链接

❹ 确认插件版本兼容：
     看插件页面里的「Supported Versions」
     确保包含你的 MC 版本（如 26.x 或 1.21.x）
```

---

## 生存服（最常见）

定位：原版生存玩法 + 基础保护和经济，朋友服 / 小型社区服首选。

> 这套方案是新手最应该先跑的「基线方案」。先把它跑通，再往上面加玩法。

### 基础层（必装，4 个）

| 插件 | 作用 | 本站教程 | 下载地址 | 注意事项 |
|------|------|---------|---------|---------|
| **EssentialsX** | 家/传送/经济/基础命令 | [✅](#/plugin/essentialsx) | https://essentialsx.net/downloads.html | 必须同时装 EssentialsXChat 和 EssentialsXSpawn（它们是分开的 jar） |
| **LuckPerms** | 权限分组/继承/可视化编辑器 | [✅](#/plugin/luckperms) | https://luckperms.net/downloads | 必须选对应核心的版本（Bukkit/Folia） |
| **Vault** | 经济权限 API 桥梁 | [✅](#/plugin/vault) | https://www.spigotmc.org/resources/vault.34315/ | 不需要配置，装上就生效 |
| **DecentHolograms** | 全息浮空文字 | ❌ | https://www.spigotmc.org/resources/decentholograms.25462/ | 可换 Holographic Displays（更老但稳定） |

### 保护层（强烈推荐，4 个）

| 插件 | 作用 | 本站教程 | 下载地址 | 注意事项 |
|------|------|---------|---------|---------|
| **WorldGuard** | 区域保护（设定谁能拆建） | [✅](#/plugin/worldguard) | https://enginehub.org/worldguard#downloads | 自动依赖 WorldEdit，单独装也能跑，但定义选区需要 WE |
| **WorldEdit** | 地图编辑 + 选区工具 | [✅](#/plugin/worldedit) | https://enginehub.org/worldedit#downloads | 建筑师必备；服主必装（因为 WG 的选区要它） |
| **CoreProtect** | 方块操作记录 + 回滚 | [✅](#/plugin/coreprotect) | https://www.spigotmc.org/resources/coreprotect.8631/ | MySQL 用于大服（100+人），小服用 SQLite 即可 |
| **GriefPrevention** | 玩家自领地（砍木棍圈地） | ❌ | https://www.spigotmc.org/articles/griefprevention.28/ | 和 WorldGuard 任选一个或搭配使用 |

### 经济层（根据需求选择）

| 插件 | 作用 | 本站教程 | 下载地址 | 注意事项 |
|------|------|---------|---------|---------|
| **EssentialsX Economy** | 基础货币（已随 EssentialsX 安装） | [✅](#/plugin/essentialsx) | 和 EssentialsX 同包（EssentialsX.jar） | 不需要额外下载 |
| **ChestShop** | 箱子商店（低价高价手把手教） | ❌ | https://www.spigotmc.org/resources/chestshop.51856/ | 需要玩家理解如何做商店 |
| **Jobs Reborn** | 职业系统（挖矿/杀人/钓鱼给钱） | ❌ | https://www.spigotmc.org/resources/jobs-reborn.4216/ | 需要调 Jobs 配置决定每个职业的费率 |

### 安装顺序（严格按此顺序）

```
步骤 1：mkdir 并进入 plugins/
        mkdir -p ~/mcserver/plugins/ && cd ~/mcserver/plugins/

步骤 2：下载 Vault + LuckPerms
        → 装完启动服务器 → 输入命令：
          lp user <你的游戏名> permission set luckperms.* true
        
步骤 3：下载 EssentialsX（全套 3 个 jar：EssentialsX.jar + EssentialsXChat.jar + EssentialsXSpawn.jar）
        → 启动后运行：
          /essentials reload
          
步骤 4：下载 WorldEdit + WorldGuard
        → 验证：
          /wg version  → 输出版本号
          /we version  → 输出版号
          
步骤 5：下载 CoreProtect、GriefPrevention、ChestShop、Jobs
        → 启动后用 /plugins 验证全部绿色
```

### 一套速用的 LuckPerms 权限组（生存服模板）

```
# 自动化生存服标准权限组（仅参考，新手根据自己的需求调整）
# 复制以下命令，在控制台逐行执行：

# 第 1 步：创建权限组
/lp creategroup default          # 默认组（每个新玩家自动加入）
/lp creategroup member           # 正式成员组（发点小奖励后提）
/lp creategroup vip              # VIP 组（可以出售）
/lp creategroup admin            # 管理组（给你和你的朋友）

# 第 2 步：设置继承关系（下级继承上级的全部权限）
/lp group member parent add default   # member 继承 default 的权限
/lp group vip parent add member       # vip 继承 default + member 的权限
/lp group admin parent add vip        # admin 继承所有下级权限

# 第 3 步：配置每个组的权限
# —— default 组（基础生存权限）
/lp group default permission set essentials.sethome true
/lp group default permission set essentials.home true
/lp group default permission set essentials.tpa true
/lp group default permission set essentials.tpaccept true
/lp group default permission set essentials.tpdecline true
/lp group default permission set essentials.msg true
/lp group default permission set essentials.spawn true
/lp group default permission set essentials.balance true
/lp group default permission set essentials.pay true
/lp group default permission set essentials.warp true
/lp group default permission set essentials.kit true
/lp group default permission set essentials.kit.startup true
/lp group default permission set chestshop.shop.create.* true
/lp group default permission set jobs.join.* true
/lp group default permission set jobs.leave.* true
/lp group default permission set jobs.world.survival true

# —— member 组（在 default 基础上加）
/lp group member permission set essentials.sethome.multiple.3 true
/lp group member permission set essentials.kit.stone true
/lp group member permission set essentials.kit.iron true
/lp group member permission set essentials.nick true

# —— vip 组（在 member 基础上加）
/lp group vip permission set essentials.sethome.multiple.5 true
/lp group vip permission set essentials.kit.diamond true
/lp group vip permission set essentials.fly true
/lp group vip permission set essentials.heal true
/lp group vip permission set essentials.nick.* true
/lp group vip permission set essentials.joinfullserver true

# —— admin 组（全部权限）
/lp group admin permission set * true

# 第 4 步：把你加到 admin 组
/lp user <你的游戏名> parent add admin
```

---

## RPG 生存服

定位：加技能、等级、装备强化，往 MMO 方向靠。

> 在生存服基础上追加，**不要直接跳到这层**，先把生存服跑通！

### 追加插件清单（全部免费）

| 插件 | 作用 | 官网/下载 | 注意事项 |
|------|------|---------|---------|
| **mcMMO** | RPG 化生存技能（挖矿/钓鱼/战斗有等级） | https://www.spigotmc.org/resources/official-mcmmo-original.64348/ | 开源免费，性能影响小，极度推荐 |
| **Quests** | 任务系统（NPC 发布任务） | https://www.spigotmc.org/resources/quests.37148/ | 免费版足够；付费版更多任务类型 |
| **Citizens** | NPC（商人/任务发布者守卫） | https://www.spigotmc.org/resources/citizens.13811/ | 几乎所有 RPG 服基础，按需装 |
| **MythicMobs** | 自定义 Boss/怪物（技能/掉落/AI） | https://www.spigotmc.org/resources/mythicmobs.5702/ | 免费版足够 80% 场景 |
| **ModelEngine** | 自定义 3D 模型驱动怪物 | https://www.spigotmc.org/resources/modelengine.89635/ | 配合 MythicMobs 让 Boss 有专属外观 |
| **Boss** | Boss 血条（屏幕上方显示） | https://www.spigotmc.org/resources/boss.27105/ | 可换 BossBarPro |

### 典型的 RPG 服配置模板

```yaml
# mcMMO 示例配置（plugins/mcMMO/config.yml）
# 只列关键项

# 每个技能的经验倍率（调高让玩家升级更快）
experience:
  formula:
    multiplier:
      global: 1.0          # 全局倍率
      pvp: 1.0             # PVP 经验倍率
      swimming: 0.2        # 游泳较慢升级
      mining: 1.5          # 挖矿快升级
      
  # 等级上限
  levels_max:
    mining: 100            # 挖矿最高 100 级
    woodcutting: 100
    herblore: 100
    excavation: 100
    fishing: 100
    acrobatics: 100
    archery: 100
    axes: 100
    swords: 100
    taming: 100
    unarmed: 100
    repair: 100
```

### RPG 服的特别注意

```
⚠️ 每加一个插件就重启一次测一遍。出问题立刻知道是谁。

⚠️ MythicMobs 配置非常复杂。先跑通生存服再加。

⚠️ RPG 服的复杂度 = N² 倍维护成本。mcMMO + Citizen + MythicMobs 同时跑需要 16GB 内存跑稳。
```

---

## 小游戏 / 起床战争服

定位：多局游戏、地图轮换、计分板。

> 小游戏服和生存服是**完全不同的架构**。大多数小游戏服背后都有一台 Velocity / BungeeCord 代理 + 多套独立的游戏服。这里给出的是**单服（简单）方案**和**群组（标准）方案**。

### 单服方案（适合新手入门）

| 插件 | 作用 | 下载 | 注意事项 |
|------|------|------|---------|
| **Multiverse-Core** | 多世界管理 | [✅](#/plugin/multiverse-core) | 5.x 自带中文 |
| **BedWars2023** | 起床战争（1.8.8+ 玩家都能玩） | https://www.spigotmc.org/resources/bedwars2023.100485/ | BedWars1058 的免费分支 |
| **TAB** | Tab 列表美化（等级/段位显示） | https://www.spigotmc.org/resources/tab-1-5-x-1-21-x.57806/ | 需要 PlaceholderAPI |
| **PlaceholderAPI** | 变量接口基础 | [✅](#/plugin/placeholderapi) | 其他插件的美化基础 |

### Velocity / BungeeCord 群组方案（标准小游戏服架构）

```
标准架构示意图：

玩家 → Velocity 代理（大厅入口）
        │
        ├─ lobby（大厅服）→ 用 Multiverse-Core 管理大厅地图
        ├─ bedwars_01（起床游戏 1 号）→ BedWars2023
        ├─ bedwars_02（起床游戏 2 号）→ BedWars2023
        ├─ skywars_01（空岛 1 号）→ SkyWarsReloaded
        └─ skywars_02（空岛 2 号）→ SkyWarsReloaded

群组服的额外核心依赖：
- Velocity（代理层，处理玩家分发和跨服通信）
- RedisBungee（跨服玩家状态同步）
```

> 🚨 群组服配置复杂度高很多。先单服跑通再研究群组。详见[BungeeCord 教程](#/guide/faq)（待更新）。

---

## 公益服 / 开放社区服

定位：长期运营，玩家多（可能超过 50 人），需要防捣乱。

> 公益服 = 免费进入 + 管理严格 + 反作弊必备。

### 在生存服基础上追加

| 插件 | 作用 | 下载 | 注意事项 |
|------|------|------|---------|
| **AuthMeReloaded** | 登录注册（离线模式必装） | https://www.spigotmc.org/resources/authmereloaded.6269/ | offline-mode=false 时必装 |
| **BanManager** | 封禁系统（封人/禁言带记录） | https://www.spigotmc.org/articles/banmanager.75/ | LiteBans 的免费替代 |
| **ChatControlRed** | 聊天管理（刷屏/广告过滤） | https://www.spigotmc.org/resources/chatcontrol-red.100581/ | 免费版即可做基本过滤 |
| **Plan** | 服务器数据统计 | https://www.spigotmc.org/articles/plan.3280/ | 在线人数/玩家行为分析 |
| **DiscordSRV** | Discord 联动 | https://www.spigotmc.org/resources/discordsrv.18494/ | 国外社区用 |
| **Vulcan Lite** | 反作弊 | https://www.spigotmc.org/resources/vulcan.83626/ | 免费版覆盖基本检测 |
| **Orion** | 反作弊 + 崩溃防护 | https://www.spigotmc.org/resources/orion.85127/ | 替代 Vulcan，零误报 |

### 公益服的 LuckPerms 权限模板

```
/lp creategroup default
/lp creategroup player
/lp creategroup builder
/lp creategroup verified            # 完成验证（如 QQ 绑定）
/lp creegroup vip
/lp creegroup moderator
/lp creegroup admin

# 继承链
/lp group player parent add default
/lp group builder parent add player
/lp group verified parent add builder
/lp group vip parent add verified

# 默认玩家（anti-bot 验证前不给太多权限）
/lp group default permission set authme.player.* true

#  Builder 组
/lp group builder permission set worldedit.* true
/lp group builder permission set worldguard.* true

#  Moderator 组  
/lp group moderator permission set bm.tempban true
/lp group moderator permission set bm.kick true
/lp group moderator permission set bm.mute true
/lp group moderator permission set chatex.moderator true
```

---

## 生电服（红石密集型）

定位：服务 Minecraft 技术玩家，需要完美兼容原版红石机制 + 高性能支撑大量机器。

> 生电服的玩家群体特殊：他们对「飞行器是否有效」「刷铁机效率」「珍珠炮时序」等非常敏感，甚至超过对「画面豪华度」的追求。

### 核心选择（先定核心）

```
首选：Mili（国内生电圈项目，含 Rust 原生加速 + 红石兼容修复）
次选：Leaves（国内生电社区维护）
备选：Paper + redstone-implementation: VANILLA（纯原版，性能次选）
```

### 插件清单（精简）

生电服和普通生存服的插件哲学**完全不同**：

| 类型 | 是否需要 |
|------|---------|
| 权限插件 | ❌ 不需要，给玩家 OP 或不给都行 |
| 经济插件 | ❌ 不需要，没有商店系统 |
| 领地插件 | ❌ 不需要，要么公会自治要么草率 |
| 反作弊 | ❌ 必须关掉，反作弊会干扰红石和实体 |

**生电服的插件要尽量精简**：

```
必装（2 个）：
├── LuckPerms（仅用于组管理）
└── spark（性能分析）

可选（按需）：
├── WorldEdit（玩家要求时可给）
├── CoreProtect（如被人炸，可查回滚）
├── spark + MinecraftDev（性能分析增强）
└── 核心内置的相关配置

不要装：
├── 任何「实体优化」插件（杀红石）
├── AI 优化（改写行为）
├── 怪物生成上限（刷怪塔要自由）
├── 漏斗优化（不要用！）
└── 所有反作弊（必冲突红石机器）
```

### 生电服专用配置重点

```yaml
# paper-world-defaults.yml（生电服关键配置）

# ❶ 红石实现：VANILLA 模式（100% 原版行为）
redstone-implementation: VANILLA

# ❷ 实体激活范围：不要动（要保持原版行为）
#    生电玩家经常用末影珍珠传送 + 需要远距离实体追踪
entities:
  activation-range:
    monsters: 48           # 48 格（比默认 32 更宽）
    animals: 48
    misc: 32

# ❷ 怪物生成上限：尽量高，甚至不限制
  spawning:
    # 绝对不要改！生电常做刷怪塔/刷铁塔
    # 默认值即可，上限设太低等于判了刷怪塔死刑

# ❸ 区块保存：频繁保存（避免机器在崩服时丢失状态）
chunks:
  autosave-period: 3000    # 每 3000 tick（2.5 分钟）保存一次
  
# ❹ 视野 / 模拟距离
#    生电服玩家常「远眺」让机器跑
view-distance: 10          # 不要低于 10
simulation-distance: 8     # 不要低于 8

# ❺ 网络
#    生电服的最小 tick 时间也要注意，大量实体堆叠需要较大带宽
network-compression-threshold: 256    # 不要设太高
```

---

## 权限分组模板速查（所有方案通用）

装完 LuckPerms 后，在控制台执行这套基础命令，一个标准的多级体系就出来了：

```
# ═══════════════════════════════════════════════
#  LuckPerms 标准组结构（所有服务器通用）
#
# 使用方式：直接复制到控制台逐行执行
# ⚠️ 请把「玩家」替换成你的游戏名
# ═══════════════════════════════════════════════

# 1. 创建组
lp creategroup default       # 新玩家默认组
lp creategroup member        # 加入 24 小时的正式玩家
lp creategroup vip           # VIP 玩家
lp creegroup moderator       # 副管理员
lp creegroup admin           # 管理员
lp creegroup owner           # 服主

# 2. 设置继承链（下级继承上级权限）
lp group member parent add default
lp group vip parent add member
lp group moderator parent add vip
lp group admin parent add moderator
lp group owner parent add admin

# 3. 配置 default 组权限
lp group default permission set essentials.sethome true
lp group default permission set essentials.home true
lp group default permission set essentials.tpa true
lp group default permission set essentials.tpaccept true
lp group default permission set essentials.tpdecline true
lp group default permission set essentials.msg true
lp group default permission set essentials.spawn true
lp group default permission set essentials.balance true
lp group default permission set essentials.pay true
lp group default permission set essentials.warp true
lp group default permission set essentials.kit true
lp group default permission set essentials.kit.startup true
lp group default permission set chestshop.shop.create.* true
lp group default permission set jobs.join.* true

# 4. 配置 VIP 组权限（在 member 基础上）
lp group vip permission set essentials.sethome.multiple.5 true
lp group vip permission set essentials.fly true
lp group vip permission set essentials.heal true
lp group vip permission set essentials.feed true
lp group vip permission set essentials.nick true
lp group vip permission set essentials.joinfullserver true

# 5. 配置 Moderator 组权限
lp group moderator permission set essentials.kick true
lp group moderator permission set essentials.tempban true
lp group moderator permission set essentials.mute true
lp group moderator permission set essentials.jail true
lp group moderator permission set essentials.vanish true
lp group moderator permission set coreprotect.inspect true

# 6. Admin / Owner 全部权限  
lp group admin permission set * true
lp group owner permission set * true

# 7. 把自己提为服主
lp user 你的游戏名 parent add owner
```

---

## 插件冲突一览表

> 装插件前先看这张表，能省下几小时的排错时间。

| 冲突组合 | 后果 | 解决方案 |
|----------|------|----------|
| 两个权限插件（如 LuckPerms + PermissionsEx） | 权限随机失效，命令权限混乱 | **只留一个**，LP 优先 |
| 两个经济插件（如 EssentialsX Economy + XConomy） | 余额显示错乱，/eco 命令崩溃 | 只留一个经济实现，其他只当 API 用 |
| 两个登录插件（AuthMe + 其他登录） | 无法登录，玩家数据丢失 | **只留一个** |
| 两个聊天插件（EssentialsX Chat + ChatControl） | 聊天格式打架，颜色代码乱码 | 选一个处理聊天，另一个配置里关 chat 模块 |
| 两个多世界插件（Multiverse + MyWorlds） | 世界重复/丢失 | 只留一个 |
| WorldGuard + GriefPrevention | 圈地命令冲突（用 `/rg` 和 `/claim`） | 可以用但需协调，推荐新手只装一个 |
| EssentialsXChat + VentureChat | 聊天格式打架 | 只留一个 |
| Dynmap + BlueMap | 两个地图都能跑但占双倍资源 | 只留一个 |
| 两个反作弊（Vulcan + Grim） | 雪崩式误报，踢人踢到关服 | **只装一个**反作弊 |

### 权限插件冲突的通用判断法

如果出现「给玩家权限但没生效」：

```
步骤 1：/lp user 玩家名 info
        → 看权限是否真的分配了
步骤 2：给了但不生效 → 大概率有另一个权限插件在捣乱
        → /plugins 检查
步骤 3：没给上 → 检查继承链：vip 是否继承了 default？
        → /lp tree 查看组结构
```

---

## 下一步

- 想知道每个插件的完整配置？→ 左侧插件中心「Config 逐项中文注释」
- 插件之间打架了？→ [避坑与排错速查](#/guide/faq)
- 汉化插件界面？→ 各插件页面底部下载成品汉化
- 服务器装完插件后卡了？→ [性能调优从入门到精通](#/guide/performance-tuning)