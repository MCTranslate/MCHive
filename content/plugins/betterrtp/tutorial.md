---
id: betterrtp
name: BetterRTP
description: 随机传送 — 强制在安全落点传送，可设世界边界、黑名单方块、生物群系、冷却、延迟、经济收费，并自动避开所有领地插件的保护区。
category: 世界管理
version: BetterRTP（MC 1.8 - 1.19.4）
tags: [随机传送, 探索, 世界边界, 领地, 冷却]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## ⚠️ 先看清楚：只到 1.19.4

**BetterRTP 支持到 MC 1.19.4。** 1.20+ 的服不要装这个版本。

它最后更新是 2024 年 5 月（3.6.13），作者基本没在维护。1.20+ 的服需要找别的随机传送插件。

好消息是：**它的功能深度是同类别里最好的**——世界边界、领地兼容、经济收费、首次加入传送这些它都有，很多同类没有。

## 1. 它比原版 `/rtp` 强在哪

原版 `/rtp` 只有一条命令、一个行为。BetterRTP 解决的是**「让随机传送不破坏服务器生态」**：

| 问题 | 原版 | BetterRTP |
|------|------|--------|
| 传到水面上 / 岩浆里 | 会，卡死或烧死 | **黑名单方块，自动避开** |
| 传到别人的领地 | 会，直接进别人家 | **自动避开所有领地插件的保护区** |
| 传到世界边界外 | 不知道边界是什么 | 可遵守世界边界 / 自定义范围 |
| 玩家狂用 RTP 逃票 | 无限制 | **冷却 + 经济收费** |
| 传到下界/末地 | 行为混乱 | 可配置**强制回到主世界** |
| 刚传送完就被 mobs 杀 | 会 | 可给**落地无敌时间** |
| 传送前就飞走 | 无 | **延迟倒计时，移动就取消** |

**「避开领地」这一条是它和其他随机传送插件的分水岭。** 没这一条，你的服上会出现「有人 RTP 到别人家基地里拆家」的纠纷。

## 2. 支持的领地插件

它对下列领地/保护插件做了集成，会自动避开它们的区域：

WorldGuard、GriefPrevention、Towny、RedProtect、FactionsUUID、Lands、Residence、KingdomsX、hClaims、GriefDefender、UltimateClaims、MinePlots、CrashClaims、BetterClaims。

**意思是你不用手动维护「哪些坐标不能去」的列表。** 这也是为什么它比同类多一倍的配置项。

## 3. 安装

- SpigotMC：<https://www.spigotmc.org/resources/betterrtp-random-wild-teleport.36081/>

丢进 `plugins/`，重启 → 编辑配置 → `/rtp reload`。

> ⚠️ **和 EssentialsX 抢 `/rtp`。** 两个插件都想注册它，会打架。**推荐做法是在 EssentialsX 的 `config.yml` 里关掉它的 RTP**（干净；让 BetterRTP 抢别名也可以，但配置会散在两处）。
>
> **EssentialsX 里也要给权限。** 装了 EssentialsX 的服最容易漏这一步，结果 `/rtp` 提示无权限。

## 4. 权限：最容易配错的地方

**这一节请仔细读。** BetterRTP 的权限模型是新人最常卡住的地方。

### 核心规则

> **要在某个世界里传送，玩家需要「通用权限」+「该世界的权限」两个。**

只给一个的表现就是玩家收到「RTP not allowed in this world」。

| 权限 | 作用 |
|------|------|
| `betterrtp.use` | 使用 `/rtp` 的基础权限 |
| `betterrtp.world` | 使用 `/rtp world <世界>` |
| `betterrtp.world.*` | 在所有已启用世界传送 |
| `betterrtp.world.<世界名>` | **在指定世界传送** |

**给所有世界开**：`betterrtp.world.*`
**只给某个世界开**：`betterrtp.world.nether`、`betterrtp.world.world`

### 其他权限

| 权限 | 作用 |
|------|------|
| `betterrtp.player` | 传送别的玩家（`/rtp player <玩家>`） |
| `betterrtp.biome` | 按生物群系传送 |
| `betterrtp.location` | 按预设地点传送 |
| `betterrtp.location.bypass` | 在任意世界使用 location 传送 |
| `betterrtp.bypass.*` | **绕过所有限制**（冷却、延迟、经济、饥饿） |
| `betterrtp.bypass.cooldown` | 绕过冷却 |
| `betterrtp.bypass.delay` | 绕过延迟 |
| `betterrtp.bypass.economy` | 绕过收费 |
| `betterrtp.bypass.hunger` | 绕过饥饿限制 |
| `betterrtp.reload` | 重载配置 |
| `betterrtp.updater` | 接收更新提醒 |
| `betterrtp.info` | 查看各世界参数 |
| `betterrtp.admin` | 用 `/rtp test` 和 `/rtp queue` |
| `betterrtp.group.<组名>` | 权限组功能（PermissionGroups） |

> 💡 **`betterrtp.bypass.cooldown` 要小心给。** 它同时会跳过延迟检查。给玩家这个权限等于让他可以无准备瞬间传送——生成器式的用法很容易被用来卡传送区块。

## 5. 命令

| 命令 | 说明 |
|------|------|
| `/rtp` | 在当前世界随机传送 |
| `/rtp player <玩家> [世界]` | 传送别的玩家 |
| `/rtp player_sudo <玩家> [世界]` | **以管理员身份**传送（跳过限制） |
| `/rtp world <世界> [群系...]` | 传送到另一个世界 |
| `/rtp biome <群系...>` | 在指定生物群系内传送 |
| `/rtp location <地点名>` | 按预设地点传送 |
| `/rtp info` | **查看所有世界和它们的 RTP 参数** |
| `/rtp reload` | 重载配置 |
| `/rtp help` | 帮助 |
| `/rtp test` | 调试：只测效果不真的传送 |
| `/rtp queue` | 查看已生成的排队地点 |
| `/rtp version` | 版本 |
| `/rtp edit <参数>` | 快速改世界参数，不用动配置文件 |

**别名**：`/rtp`、`/brtp`、`/betterrtp`、`/randomtp`、`/wild`、`/wildtp` —— 它们都指向同一个命令实例，参数完全一致。

### 排错必用的两条

| 命令 | 什么时候用 |
|------|-----------|
| `/rtp info` | **配错了先跑这个。** 它打印每个世界的半径、中心点等参数，确认服务器读到了你的配置 |
| `/rtp test` | 冷却、延迟、特效对不对，不想被真的传走的时候 |

## 6. 核心配置项

配置文件是 `plugins/BetterRTP/config.yml`（具体键名以你版本的配置注释为准）。关键概念：

### Worldborder 与 CustomWorlds

| 概念 | 说明 |
|------|------|
| **Default** | 没有单独设置的世界用这套参数 |
| **CustomWorlds** | 给特定世界单独设一套（半径、中心点） |

**要理解这个结构**：玩家在某个世界用 `/rtp` 时，插件先查这个世界有没有在 `CustomWorlds` 里，有就用它，没有就用 `Default`。

### 两种范围模式

| 模式 | 说明 |
|------|------|
| 遵守世界边界 | 尊重 `/worldborder set` 设的边界 |
| 自定义最大/最小 X、Z | 自己设范围，还有中心点 |

### 其他关键项

| 配置方向 | 说明 |
|---------|------|
| **BlacklistedBlocks** | 黑名单方块，默认包含 **Water 和 Lava** |
| **Attempts** | 找安全落点的尝试次数。次数太低会经常失败，太高会卡 |
| **Cooldown** | 冷却时间 |
| **Delay timer** | 传送前等待，移动就取消 |
| **Economy** | 收费 |
| **Invincibility** | 落地无敌时间 |
| **First Join** | 首次进服自动传送 |
| **Override** | 在下界/末地用 `/rtp` 时强制回主世界 |
| **Permission Groups** | 按权限组给不同的 RTP 限制 |
| **locations.yml** | 预设传送地点 |

### locations.yml

这个是独立配置文件，存预设地点。有一个选项 `UseLocationsInSameWorld` —— 打开之后 `/rtp location <名>` 可以在任意世界使用，不打开就只能同世界。

## 7. 常见坑

| 症状 | 处理 |
|------|------|
| **提示「不允许在这个世界传送」** | **权限配错了**，缺 `betterrtp.world.<世界名>`。见第 4 节 |
| **`/rtp` 无权限** | **EssentialsX 的 RTP 没关。** 两边都注册了 `/rtp`，权限被 EssentialsX 拦住了 |
| **传到一半失败 / 找不到安全落点** | `Attempts` 次数不够，或黑名单方块太多导致候选点太少。跑 `/rtp info` 确认范围配置，再提高尝试次数 |
| **经济收费不生效** | 玩家有 `betterrtp.bypass.economy`，或者经济插件没和它对接上 |
| **传送到下界 / 末地了** | 配 `Override`，让它在这些世界触发时强制回主世界 |
| **Elytra 玩家用 `/rtp` 会被卡** | 延迟机制：传送前有倒计时，移动就取消。Elytra 中根本停不下来。要么给 `betterrtp.bypass.delay`，要么改配置 |
| **传送后被 mobs 秒杀** | 开 `Invincibility`，给落地无敌时间 |
| **改配置不生效** | `/rtp reload`。**注意它需要 `betterrtp.reload` 权限，不要给普通玩家** |

## 8. 缺点和取舍

| 缺点 | 说明 |
|------|------|
| **只支持到 1.19.4** | **最大问题。** 1.20+ 直接排除 |
| **基本停更** | 最后更新 2024 年 5 月 |
| **配置项多** | 默认配置加上领地集成，配置量在同类里最大 |
| **升级配置不自动合并** | 老版本升上来可能缺新配置项，要自己对照补 |
| **和 EssentialsX 抢 `/rtp`** | 必须手动处理 |
| **延迟机制和移动玩法冲突** | 鞘翅、载具中传送总是失败 |

**取舍很清楚：给你最细的控制粒度和最完整的领地兼容，代价是配置量和维护成本，以及版本已经落后。**

## 9. 汉化：BetterRTP 是例外

> ⚠️ **本站未核实到 BetterRTP 的官方中文语言文件机制**（文件名、路径、切换方式都没有核实）。

**但有一个重要信息：它的官方页面列出了支持的语言包含 Chinese（中文）。**

也就是说**它是支持中文的**，具体形式可能是：

- 语言文件（具体路径和格式请以官方文档和实际生成的文件为准）
- 或者中文是直接写进默认配置的消息里

想改文案：

1. 打开 `plugins/BetterRTP/` 看实际生成了哪些文件
2. 配置文件里的消息项（`SuccessMessage`、`DisabledWorld`、`ReloadMessage`、`NoPermission` 等方向）**大概率可以直接写中文**
3. **具体键名以你手上版本的配置注释为准**

> 💡 **如果你想用中文，这个插件值得优先试。** 相比同类的英文-only 随机传送插件，它明确声明支持中文。

## 下一步

- 多世界怎么配 → [多世界配置](#/guide/multi-world-setup)
- 领地插件怎么配 → [领地保护](#/guide/region-protection)
- 经济系统怎么对接 → [经济系统配置](#/guide/economy-setup)
- 版本兼容要注意什么 → [跨版本兼容](#/guide/version-compat)