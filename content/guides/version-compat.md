---
id: version-compat
title: 客户端版本兼容：让各版本玩家都能进服
description: 先分清「新客户端连老服」与「老客户端连新服」两个方向 —— ViaVersion / ViaBackwards / ViaRewind 各管哪一段、装了要付什么代价、什么情况坚决别装，附官方 jar 解包核实的配置键与排错方法。
icon: 🧭
tags: [版本兼容, 客户端, ViaVersion, 协议]
order: 10
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（服务端 26.3）与各版本 Java 版客户端。

> 一句话结论：**「新客户端连老服」装 ViaVersion；「老客户端连新服」装 ViaVersion + ViaBackwards**（1.8 / 1.7 的老客户端还要再加 ViaRewind）。只装一个、或把方向弄反，玩家照样被踢。

服务端刚更新到 26.3，一群朋友的客户端还停在 1.21.x；或者你就想开一个「什么版本都能进」的服。这时候需要的不是玄学，是**协议转换**。

但中文圈关于这几个插件的教程，讲反的比讲对的多。本文先把「方向」这件事彻底拆开，再给本站场景（Paper 26.3）的落地方案，最后说清楚**什么情况千万别装**。

## 一、先分清「两个方向」

Minecraft 的客户端和服务端必须用同一套「协议」通信。协议版本对不上，服务端会在**登录阶段**直接把你踢掉——不是进服后才出问题，是门都进不去。

跨版本插件做的事就是**在中间做协议翻译**。而翻译有两条互不相同的路，对应两个不同的插件：

```
方向 ①（新客户端 → 老服务端）        负责：ViaVersion
   客户端 1.21.x  ──▶ ┌────────────┐ ──▶ 服务端 1.8.9
                     │ ViaVersion │
                     └────────────┘

方向 ②（老客户端 → 新服务端）        负责：ViaBackwards（+ ViaRewind）
   客户端 1.9.x   ──▶ ┌──────────────┐ ──▶ 服务端 26.3
                      │ ViaBackwards │
                      └──────────────┘
   客户端 1.8/1.7 ──▶ ┌──────────────────────────┐ ──▶ 服务端 26.3
                      │ ViaBackwards + ViaRewind │
                      └──────────────────────────┘
```

**本站是 26.3 服务端，所以你要的是方向 ②。** 方向 ① 只在「服务端比玩家客户端还老」时才用得上（比如开 1.8 的怀旧服，却想让 1.21 的玩家进）。

三条方向性结论都直接来自插件官方（下节的出处列）：

| 插件 | 官方原文结论 | 翻译成人话 |
|------|-------------|-----------|
| ViaVersion | *Allows the connection of higher client versions to lower server versions* | **新客户端 → 老服务端**，同时是所有 Via 系插件的基础框架 |
| ViaBackwards | *Allows the connection of older clients to newer server versions* | **老客户端（1.9+）→ 新服务端**，依赖 ViaVersion |
| ViaRewind | *ViaVersion addon to allow 1.8.x and 1.7.x clients on newer server versions* | 把「老客户端进新服」再向下延伸到 **1.8.x / 1.7.x**，依赖 ViaVersion + ViaBackwards |

### 最容易搞错的几句话

| 你大概听过 | 事实 |
|-----------|------|
| 「装个 ViaVersion 老客户端就能进新服」 | ❌ 只装 ViaVersion，老客户端**仍然会被踢**——那是 ViaBackwards 的职责 |
| 「ViaVersion 和 ViaBackwards 装一个就行」 | ❌ ViaBackwards 的 `plugin.yml` 写的是 `depend: [ViaVersion]`，**两个必须同时在** |
| 「1.8 客户端，有 ViaBackwards 就够」 | ❌ 1.8 / 1.7 还要再加 ViaRewind（它自己也 `depend: [ViaVersion, ViaBackwards]`） |
| 「装了插件的服务端就该什么版本都能进」 | ❌ 要看版本区间（见第三节），且**只有装了插件、且玩家客户端版本在覆盖范围内的才进得来** |
| 「版本兼容 = 老客户端也能玩到新内容」 | ❌ 新增的方块、物品、机制老客户端**根本渲染不出来**（见第六节） |

> 记住一句话就够了：**ViaVersion 是「框架 + 向前兼容」，ViaBackwards 是「向后兼容」，ViaRewind 是「向后兼容到 1.8/1.7」。** 老客户端进新服 = 后两个 + 那个必装的框架。

## 二、三个插件、谁是谁、从哪下

三个插件的职责和依赖关系如下（`plugin.yml` 原文核实）：

| 插件 | 作用方向 | 依赖（`plugin.yml` 原文） | 其他声明 |
|------|----------|--------------------------|----------|
| **ViaVersion** | 新客户端 → 老服务端（框架层） | 无 | `loadbefore: [ProtocolLib]`、`folia-supported: true` |
| **ViaBackwards** | 老客户端（1.9+）→ 新服务端 | `depend: [ViaVersion]` | `folia-supported: true` |
| **ViaRewind** | 老客户端（1.8.x / 1.7.x）→ 新服务端 | `depend: [ViaVersion, ViaBackwards]` | `load: STARTUP`、`folia-supported: true` |

因为依赖都写在 `plugin.yml` 里，**加载顺序不用你操心**——Bukkit 会按依赖自动排序。你要做的只是「三个 jar 都放齐」。反过来，如果 ViaRewind 孤零零地放进 `plugins/` 而没有另外两个，它**不会加载**，控制台会提示缺少依赖。

最新发布版本（2026 年 9 月核实，均走**正式 Release 通道**）：

| 插件 | 最新 Release | 发布日期 | 下载文件名 | 项目标注支持的服务端区间 |
|------|-------------|----------|-----------|------------------------|
| ViaVersion | 5.12.0 | 2026-09-18 | `ViaVersion-5.12.0.jar` | 1.8.9 – 26.3 |
| ViaBackwards | 5.12.0 | 2026-09-18 | `ViaBackwards-5.12.0.jar` | 1.10 – 26.3 |
| ViaRewind | 4.2.0 | 2026-09-18 | `ViaRewind-4.2.0.jar` | 1.8.8 – 26.3 |

官方下载入口（只认这两个，别在群里收 jar）：

| 渠道 | ViaVersion | ViaBackwards | ViaRewind |
|------|-----------|--------------|-----------|
| **Hangar（插件推荐）** | <https://hangar.papermc.io/ViaVersion/ViaVersion> | <https://hangar.papermc.io/ViaVersion/ViaBackwards> | <https://hangar.papermc.io/ViaVersion/ViaRewind> |
| **Modrinth** | <https://modrinth.com/mod/viaversion> | <https://modrinth.com/mod/viabackwards> | <https://modrinth.com/mod/viarewind> |

> **关于 Snapshot**：这几个项目的更新节奏是「MC 出新版后几天才发正式版」，中间会先推 Snapshot 构建。所以在 Modrinth / Hangar 上，**列表最上面那条常常是 Snapshot 而不是 Release**（例如 ViaVersion `5.12.1-SNAPSHOT+1069`，2026-09-20）。服务端版本已经和 Release 对得上时（本站 26.3 就是这种情况），**优先选 Release**；只有服务端刚升到很新的版本、Release 还没跟上时，才考虑 Snapshot。

> **Java 版本**：官方 Wiki 标注 ViaVersion 需要 **Java 17+**，当前构建的运行时检查则要求 **Java 21+**。本站目标环境是 Java 25（Paper 26.x 的要求），天然满足，不用管。

## 三、本站场景：26.3 服务端 + 各版本客户端，到底装什么

先给结论表。**「装什么」一栏里，ViaVersion 是所有情况的必装基础件**：

| 玩家的客户端 | 需要装 | 玩家能做什么 | 主要代价 |
|-------------|--------|-------------|----------|
| **26.3**（与服务端同版本） | 什么都不用装 | 原生体验 | 无 |
| **26.1.x / 26.2** | ViaVersion + ViaBackwards | 正常游戏 | 极小 |
| **1.21.x** | ViaVersion + ViaBackwards | 正常游戏 | 小 |
| **1.9.x – 1.20.x** | ViaVersion + ViaBackwards | 正常游戏 | 中（越老越多内容看不到） |
| **1.8.x / 1.7.x** | ViaVersion + ViaBackwards + **ViaRewind** | 可进服、可玩 | 大（见第六节） |
| **比 26.3 更新**（未来版本） | 只装 ViaVersion | 正常游戏 | 小 |

一句话：**要「勉强什么都能进」，就三个都装；只服务 1.9+ 玩家，装前两个即可。**

> 边界以官方为准：官方 Wiki 原文写的是「ViaBackwards 提供 1.9–1.21 的向后支持，ViaRewind 负责 1.8 / 1.7」——这句话写在 1.21 时代，区间会随版本推进而延伸。所以上表里「1.9.x 是向后支持的起点」是可靠的，「顶部」则跟着 ViaBackwards 的支持范围走。想精确确认某个客户端版本该装哪几个，官方有个选版本工具：<https://viaversion.com/setup>。

> **不打算让老客户端进？那就一个都别装。** 见第七节——多数正经服真的不需要它。

## 四、落地流程：5 步让老客户端进来

**第 1 步：下载。** 按第二节的表格，从 Hangar 或 Modrinth 下载对应的 Release jar，丢进 `plugins/` 即可。这几个项目的 jar 是**多平台合一**的（同一个文件里同时打包了 Bukkit 的 `plugin.yml` 以及 Fabric / Velocity 的描述文件），所以你**不需要**去挑「服务端专用版」——Hangar 页面给的、Modrinth 上放出的都是同一个通用 jar。

**第 2 步：放入 `plugins/`。**

```
plugins/
├── ViaVersion-5.12.0.jar
├── ViaBackwards-5.12.0.jar
└── ViaRewind-4.2.0.jar        # 只有要放行 1.8 / 1.7 才需要
```

三条铁律：**① 一次装齐再启动**（缺依赖的插件不会加载）；**② 用正式启动，别用 `/reload`**（官方明确说明：配合 ProtocolLib 时 reload 会把玩家踢掉，且插件升级用重启才彻底生效）；**③ 备份 `plugins/`**。

**第 3 步：启动一次，让它生成配置。** 首次启动会在各插件的数据目录里生成默认配置：

| 插件 | 配置文件位置 | 说明 |
|------|-------------|------|
| ViaVersion | `plugins/ViaVersion/config.yml` | 官方 Wiki 明示的路径 |
| ViaBackwards | `plugins/ViaBackwards/config.yml` | 按插件名生成的数据目录 |
| ViaRewind | `plugins/ViaRewind/config.yml` | 同上 |

**默认配置基本可直接用**，不改也能跑。启动日志里应能看到 ViaVersion 打印出它识别到的服务端版本：

```
ViaVersion detected server version: 26.3
```

**第 4 步：重启（或首次启动就是正式启动）。**

**第 5 步：用不同版本的客户端实测验证。**

| 验证手段 | 看什么 |
|----------|--------|
| 控制台启动日志 | 三个插件都是绿色加载；出现 `ViaVersion detected server version: 26.3` |
| `/viaversion list` | 列出**所有在线玩家及其客户端版本**——用它确认「谁真的用老版本进来了」 |
| `/viaversion player <玩家>` | 看单个玩家的连接详情（排错时很有用） |
| 老客户端实际登录 | 能进世界、能走动、能开关箱子；再让老客户端玩家自己确认画面没花 |
| 服务端控制台报错 | 见第八节的「报错怎么读」 |

## 五、配置文件长什么样（别照抄旧教程）

ViaVersion 的配置键在近几年**换过一轮**。官方 Wiki 上的说明页（2025 年更新）到现在还写着旧键名，直接照着抄会「改了没效果」。下面是本站对 **ViaVersion 5.12.x 官方 jar 解包**后读到的**真实键名**：

```yaml
# plugins/ViaVersion/config.yml（节选，键名与默认值均取自 jar 内置默认配置）

check-for-updates: true          # 启动时 / OP 登录时检查更新
send-supported-versions: false   # 是否在服务器列表 ping 响应里附带支持的版本范围
block-versions: []               # 用可读版本号屏蔽客户端，支持 '<1.16' '>1.17.1' 这类前缀
block-protocols: []              # 用协议号屏蔽客户端
block-disconnect-msg: "You are using an unsupported Minecraft version!"  # 被上面两项拦下时的踢出提示
logging:
  log-blocked-joins: false       # 是否把「因版本被拦」的踢出记录到控制台
config-version: 1                # 配置版本号，勿手改

# 每秒包数限制（防刷包炸服）
packet-limiter:
  enabled: true
  max-per-second: 800                     # 短时上限
  max-per-second-kick-message: "You are sending too many packets!"
  sustained-max-per-second: 200           # 长时上限
  sustained-period-seconds: 7
  sustained-threshold: 4
  sustained-kick-message: "You are sending too many packets, :("
```

**旧教程 / 官方 Wiki 上的键 → 当前的真实情况：**

| 旧教程里写的 | 当前 5.12.x 的真实情况 |
|-------------|----------------------|
| `max-pps`（默认 800） | 已重构，改为 `packet-limiter.max-per-second` |
| `max-pps-kick-msg` | 改为 `packet-limiter.max-per-second-kick-message` |
| `tracking-period` | 改为 `packet-limiter.sustained-period-seconds` |
| `suppress-conversion-warnings` 等零散开关 | 被收进 `logging` 段（如 `log-other-conversion-warnings`） |
| 一长串 `1_13-tab-complete-delay`、`prevent-collision` 之类的老选项 | **仍然存在**（多为「新客户端连老服务端」场景准备），本站用不上，保持默认即可 |

> 一句话：**改配置前先打开你自己的 `plugins/ViaVersion/config.yml`，以文件里实际存在的键为准。** 网上（包括官方 Wiki 的旧段落）写的一些键在新版里已经不存在了，写了也是白写。ViaVersion 自带 `migrate-default-config-changes: true`，会把「仍是默认值」的键迁移到新默认值，**但你手动改过的键不会被自动识别**，升级后建议对照检查一遍。

ViaBackwards 和 ViaRewind 的配置也都偏「细节修正」，与「能不能进服」无关，保持默认即可。ViaRewind 里唯一值得留意的是 1.8 玩家的冷却提示：

```yaml
# plugins/ViaRewind/config.yml
cooldown-indicator: 'TITLE'     # 1.8 客户端如何显示 1.9+ 的攻击冷却：TITLE / ACTION_BAR / BOSS_BAR / DISABLED
```

> 如果你在服务端**关掉了 1.9 的攻击冷却**，这里对应的要改；否则 1.8 玩家会问「为什么 PvP 手感不对」。改这行**需要重启**生效。

## 六、装了要付什么代价

跨版本不是免费的。三重代价，按重要性排序：

**① 内容差异：老客户端看不到、也用不了新东西。** 这是最本质的一条。ViaBackwards 只能做「映射」——把老客户端根本不认识的新方块/实体，替换成它能认识的旧东西。你从它的配置里就能看出现实的做法：

| 服务端的新内容 | 老客户端实际看到 / 体验到的 |
|---------------|---------------------------|
| 幽匿尖啸体（sculk shrieker） | 被映射成**哭泣的黑曜石**（1.18.2 客户端，避免碰撞/挖掘异常） |
| 脚手架（scaffolding） | 被映射成**水或干草块**（1.13.2 客户端） |
| 展示实体（display entity） | 被降级成**带自定义数据的盔甲架**（1.19.3 客户端） |
| 新版对话框（dialog） | 退化成**箱子界面**来展示（1.21.5 客户端） |
| 黑暗效果（darkness） | 被映射成**失明**（1.18.2 客户端） |
| 新增方块 / 物品 / 附魔 | 大量**直接看不到或无法使用** |

> 官方对「为什么老客户端用不了新方块」的答复很干脆：*Our aim is to provide compatibility and balanced gameplay. This is not a feature of ViaVersion nor is it planned.*——**它提供的是「能一起玩」，不是「人人都有全部新内容」。** 别指望靠它做出「1.8 玩家也能用 26.3 新方块」的服。

**② 性能开销：多一层协议翻译。** 所有进出的网络包都要过一遍转换，玩家越多、客户端版本跨度越大，开销越高。它不是免费的，但通常也不至于拖垮小服——真正要警惕的是「**版本跨度极大 + 在线人数高 + 老客户端占多数**」这个组合。如果你的服本来就卡，先按 [性能调优](#/guide/performance-tuning) 把基础问题解决掉，再决定要不要为了跨版本再叠一层开销。

> 判断方法很简单：**装上之前跑一次 [spark](https://spark.lucko.me/) 留个基线，装上并让一批老客户端进来后再跑一次对比。** 差别明显、又确实影响了 TPS，就说明这笔开销对你的服不划算。

**③ 安全与反作弊：这是它为什么总跟反作弊、登录插件一起被讨论的原因。** 协议转换改变了客户端报文的呈现方式，反作弊看到的不再是「原生包」，误报和漏报都可能变多。官方在文档和配置注释里都直白地点了名：

| 来源 | 官方原话 / 键 | 说明 |
|------|--------------|------|
| ViaVersion 安装文档 | *software like anti-cheat may perform worse due to the translation being on a different level.* | 把插件**装在代理层**时反作弊表现可能更差 |
| ViaBackwards `handle-pings-as-inv-acknowledgements`（默认 `false`） | *Useful for anticheat compatibility.* | 为兼容反作弊而生的开关 |
| ViaRewind `handle-player-combat-packet`（默认 `true`） | 1.8 玩家用自定义死亡提示来处理 1.9 新增的战斗包 | 跨版本 PvP 的表现差异可见一斑 |

> 再补一句关于**方向 ①**的旁证：ViaVersion 里另有一大串为「新客户端连老服务端」准备的修正开关，官方在其中明确标注 *This may cause issues with anti-cheat plugins.*（如 `fix-1_21-placement-rotation`）和 *This can cause false positives with anti-cheat plugins.*（如 `cancel-swing-in-inventory`）。**这说明「协议转换与反作弊天生容易打架」是这几个项目的共性**，不管走哪个方向都要心里有数。

> 再加上 ViaVersion 自带的**包速率限制器**（`packet-limiter`），其实已经帮你挡住了「靠狂发包压制服务器」的一类攻击。**但反过来说，跨版本也扩大了作弊面**——同一个反作弊要同时适配多个协议版本的客户端，这本身就是风险。竞技服尤其要慎重。

## 七、什么情况下不要装

这一节的结论和第六节是一体两面：**跨版本是「牺牲原味换兼容」的交易**，很多服的账根本不划算。

| 你的服 | 建议 | 原因 |
|--------|------|------|
| **纯正版新版服**（大家都用最新客户端） | **不要装** | 没有需求，白白多一层开销与风险面 |
| **生电 / 红石技术服** | **强烈不建议** | 不同协议版本对红石、实体时序表现不一致；而且老客户端**看不到新方块**，机器直接报废 |
| **竞技 / PvP 服** | **不建议** | 1.8 与 1.9+ 的战斗机制（冷却、格挡）本就不同，跨版本混战**不公平**，且反作弊误报风险高 |
| **群组服（Velocity 等）** | **可以装，但要选对位置** | 官方提醒：代理或后端**二选一**装即可。装在代理上管理省事，但部分功能（例如 1.8 服上的格挡判定）会打折，反作弊表现也可能变差 |
| **小服 / 朋友服，玩家版本很杂** | **可以装** | 正是它的主战场，装了体验明显变好 |
| **想让玩家逐步升级客户端** | **可以装，但只当过渡** | 装上的同时**发公告**让玩家统一升到 26.3，升完了就考虑卸掉 |

> 如果你只是**服务端升级了，想让玩家先平稳过渡**，那这条线的正确姿势是「装跨版本 + 公告让玩家升级客户端，两者并行」，而不是永久挂着跨版本吃开销。服务端升级本身的流程见 [服务器迁移实战](#/guide/server-migration)。

## 八、报错怎么读、坑在哪

**先学会读控制台。** ViaVersion 在「老客户端进不来」时会直接告诉你缺哪个插件，原文是：

```
ViaVersion only supports newer client versions. Use ViaBackwards to allow older versions (ViaRewind for 1.7/1.8) to join.
```

看到这句，**「装什么」这个问题它已经替你回答了**：缺 ViaBackwards（或 1.7/1.8 玩家缺 ViaRewind）。

| 症状 | 大概率原因与解法 |
|------|-----------------|
| 老客户端连不上，控制台打 `ViaVersion only supports newer client versions...` | 没装 ViaBackwards（1.8/1.7 玩家还得加 ViaRewind） |
| 玩家被踢，提示 `You are using an unsupported Minecraft version!` | 命中了 `block-versions` / `block-protocols` 的拦截；也可能该版本确实超出覆盖范围。核对配置与 [官方选版本工具](https://viaversion.com/setup) |
| 控制台打 `ViaVersion does not have any compatible versions for this server version!` | 服务端版本比插件支持的还新——**升级 ViaVersion 到最新 Release / Snapshot** |
| ViaRewind 放进去了但没加载 | 它 `depend: [ViaVersion, ViaBackwards]`，另外两个不在就不会加载 |
| 更新了 MC 版本后部分玩家进不来 | ViaVersion / ViaBackwards 也要**同步升级**——它们的支持区间随版本走，旧版插件不认识新协议 |
| 改了几个配置键「完全没效果」 | 抄了旧教程的键名（见第五节对照表），新版里那些键已不存在 |
| 装了 Via 之后反作弊开始误报踢人 | 先看第六节列出的相关配置键；再确认反作弊版本是否跟上了跨版本场景 |
| 装了之后「新方块变成别的方块了」 | 正常现象，不是 bug——这是映射机制（见第六节），老客户端本来就渲染不出来 |
| 用 `/reload` 后玩家全被踢 | 官方已知：配合 ProtocolLib 时 reload 会踢人；**改用正式重启** |
| 换了插件版本后配置乱掉 | 备份 `plugins/ViaVersion/`；`config-version` 之类的键**不要手改** |

> **最后一条通用建议**：跨版本插件是**服务端侧**的补丁，玩家那边什么都**不用装**——他们用官方启动器选任意版本即可。如果有人让你「下载一个客户端补丁才能进服」，那多半不是 ViaVersion 的正规用法，别碰。

## 下一步

- 服务端本身要升级版本、而不是迁就客户端？看 [服务器迁移实战](#/guide/server-migration)
- 想在**代理层**统一处理各后端服的版本，或让不同玩法跑不同服务端版本？看 [用 Velocity 搭群组服](#/guide/velocity-network)
- 装了跨版本后卡顿，或反作弊误报，想系统排查？看 [性能调优从入门到精通](#/guide/performance-tuning) 与 [避坑与排错速查](#/guide/faq)
