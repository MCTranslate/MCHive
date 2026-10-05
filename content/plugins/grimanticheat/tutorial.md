---
id: grimanticheat
name: GrimAnticheat
description: 预测型反作弊 — 1:1 重放玩家可能的移动再比对，治加速/飞行/自动点击，误报远低于阈值式检测，硬依赖 PacketEvents。
category: 安全管理
version: 2.3.73（MC 1.7.2 - 26.2）
tags: [反作弊, 移动检测, 预测, PacketEvents, 开源]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## ⚠️ 先说这个：它和 Vulcan 只能选一个

**GrimAnticheat 和 Vulcan 是同类竞品，不是互补的。** 这是本站最容易踩的坑之一。

| | GrimAnticheat | Vulcan |
|---|---------------|--------|
| 原理 | **预测**：自己算一遍玩家「应该」怎么动，拿实际数据包对 | 阈值/行为模式：超过某个数就判 |
| 检查项数量 | 相对少，但准 | 41 项，铺得广 |
| 战斗类检查 | 有，但不如 Vulcan 细 | 9 项，成熟 |
| 抗误报 | 高（跨版本物理适配做得深） | 中（阈值调不好就误封） |
| 告警/管理界面 | 偏底层 | 成熟，有 Web 面板 |

**为什么必须选一个：**

1. **同一次作弊会被两个插件各判一次** —— 玩家被踢两次、通知收两条、执法记录两条。体验极差。
2. **两边都会因为对方的存在而更容易出问题** —— 报警重复、封禁理由冲突、玩家申诉时你手里有两份互相矛盾的证据。
3. **运维成本翻倍** —— 两套配置、两套阈值要调，出问题要同时排查两个。

### 那本站为什么还有 GrimAC 一页？

 GrimAC 和 GrimAnticheat **是同一个项目的两个页面**（GrimAnticheat 是 GitHub 组织名，GrimAC 是插件名）。同一个 jar，两个 id。想深入了解预测原理和跨版本物理适配的细节，去 [GrimAC](#/plugin/grimac) 那一页；本页是安装和取舍视角。

### 选哪个

| 你的情况 | 选 |
|---------|-----|
| 只想解决加速/飞行/自动点击，装完不想调 | **GrimAnticheat** |
| 服里有 PVP 竞技、需要完整战斗检查和告警面板 | **Vulcan** |
| 玩家延迟高、经常在复杂地形跑动 | **GrimAnticheat**（抗误报更好） |
| 基岩玩家占大多数 | **两个都别装**（见下） |

## 1. 核心原理：预测，不是阈值

大部分老反作弊的逻辑是「速度超过 X 就判定加速」。问题在于 **X 该设多少**：

- 设低了 → 正常玩家在冰道、鞘翅、村民加速时被误判
- 设高了 → 作弊器轻松绕过

GrimAnticheat 换了个思路：

```
1. 读玩家状态（位置、速度、方块碰撞）
2. 用自己的物理引擎算出「这一步应该发什么位置」
3. 收到玩家的包 → 比对
4. 差异超出容差 → flag
```

**为什么这更难绕过**：作弊器必须骗过一套完整物理模拟，而不是调一个数字。作者自己标的测试数据是 3.01 格 reach、1.005 timer、0.01% speed、99.99% antikb。

**它也明确标注自己是 "bypassable"** —— 没有反作弊是完美的。这个诚实比吹嘘有价值。

## 2. 硬依赖：PacketEvents

`plugin.yml` 里写的是 **`depend: [packetevents]`** —— 硬依赖，不装 PacketEvents 它根本不会加载。

- [PacketEvents Releases](https://github.com/retrooper/packetevents/releases)

**顺序**：PacketEvents 先装 → 重启 → GrimAnticheat → 重启。

## 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper / Spigot / Purpur（声明支持 Folia） |
| Java | 以你的 MC 版本为准 |
| **硬依赖** | **PacketEvents** |
| 可选 | **ViaVersion（重要）**、Geyser + Floodgate、PlaceholderAPI |

> ⚠️ **ViaVersion 的位置很关键。** 用 ViaVersion 时，**它要装在 GrimAnticheat 所在的那些后端服务器上，不是只装代理端**。只在代理端装、后端没装，跨版本判断会出问题。

> ✅ **Geyser / Floodgate 玩家被完全豁免。** 基岩版移动机制和 Java 版差异太大，预测引擎在它身上没有意义。**如果你的服基岩玩家很多，这个插件的检测价值会明显下降** —— 这不是 bug，是没有好选项。

## 4. 安装

- 仓库：<https://github.com/GrimAnticheat/Grim>
- Modrinth：搜 `grim` / `grimac`

步骤就是：装 PacketEvents → 重启 → 装 GrimAnticheat → 重启。官方说默认配置就挺能打。

## 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/grim help` | 帮助 |
| `/grim alerts` | 开关自己的违规提醒 |
| `/grim profile [玩家]` | 玩家信息：客户端版本、延迟 |
| `/grim reload` | **重载配置，同时清空在线玩家的违规记录** |
| `/grim spectate [玩家]` | 旁观该玩家 |
| `/grim stopspectating` | 停止旁观，回到原位 |
| `/grim log [0-255]` | 上传 debug 日志（预测 flag 用） |
| `/grim verbose` | 显示每一个 flag，不缓冲 |
| `/grim debug` | 开关预测输出 |
| `/grim consoledebug` | 把预测输出打到控制台 |
| `/grim dump` | 环境诊断（服务端实现、Java 版本、兼容层情况） |
| `/grim sendalert [消息]` | 内部命令，测试警报发给谁 |

> ✅ **`/grim dump` 是排查环境的利器** —— 输出服务端实现、Java 版本、有没有 ViaVersion、Paper 兼容性。报 bug 前先跑它，能省掉一轮来回。

> ⚠️ **`/grim verbose` 和 `/grim consoledebug` 会刷屏。** 只在排查具体问题的时候临时开。

## 6. 数据库配置

它有 `config.yml` 和 `database.yml` 两个主要配置。

**单服用默认的 SQLite 就够**（官方明确建议非群组服保持默认）。群组服要换 MySQL：

`database.yml` 大致结构（**以你版本的配置注释为准**）：

```yaml
database:
  enabled: true
  routing:
    violation: mysql
    session: mysql
    player-identity: mysql
    setting: mysql
    blob: none
```

然后编辑 `databases/mysql.yml` 填连接信息。切换前先备份，见 [数据库配置](#/guide/database-setup)。

## 7. 阈值怎么调

`config.yml` 里每一项检查都有阈值，方向很简单：

| 症状 | 调法 |
|------|------|
| 误报太多 | **放宽**对应检查的判定值 |
| 漏报 | **收紧**判定值 |

**如果误报和踢人太多，官方建议先联系社区讨论，而不是自己乱调。** 因为把阈值调松很容易——调到不报警，反作弊就废了。

**调试顺序建议**：

1. `/grim dump` 确认环境正确
2. 确认没有 ViaVersion 配置冲突
3. 确认基岩玩家已豁免
4. 单独 `/grim spectate <玩家>` 观察
5. 还不明白 → `/grim log`

## 8. 常见坑

**装了不加载 / 报缺依赖**

PacketEvents 没装或版本太老。更新到最新版。

**玩家说被误判**

按上面第 7 节的顺序查。三个最常见原因：

1. **ViaVersion 设置冲突** —— 尤其 `fix-1_21-placement-rotation`
2. **服务端有非标准位移的插件** —— 传送、载具、弹射器
3. **网络延迟高** —— 预测对高延迟环境更敏感

**和 Vulcan 双重踢人**

**这就是为什么本文开头说只能选一个。** 同一次作弊被两个插件各判一次，玩家被踢两下、通知收两条。

**群组服后端没装 ViaVersion 但代理端装了**

跨版本判断会出问题。

**`/grim reload` 把所有违规记录清了**

**这是设计如此** —— reload 会重置所有在线玩家的违规记录。用来调配置正好，但**别在有人作弊的时候 reload**。

**Java 版本要求**

以你的 MC 版本为准。1.20.5+ 需要 Java 21。对照 [Java 运行时选择](#/guide/java-runtime-choice)。

## 9. 缺点和取舍

敢写缺点才有参考价值：

| 缺点 | 说明 |
|------|------|
| **基岩玩家全豁免** | 基岩玩家占比高 = 插件基本白装 |
| **对非标准位移玩法不友好** | 大量传送、弹射器、载具的服，预测引擎会持续误报 |
| **需要吃内存做跨版本适配** | 覆盖的 MC 版本越多，物理适配表越大 |
| **管理界面弱于 Vulcan** | 没有成熟的 Web 面板，执法记录要靠命令和数据库查 |
| **一定要装 PacketEvents** | 多一个前置，多一层出问题的可能 |
| **重载清违规记录** | 调配置方便，但生产环境误操作代价不小 |

## 10. 关于汉化

> ⚠️ **本站未核实到 GrimAnticheat 的官方中文语言文件机制。**

GrimAnticheat 的违规提示和命令输出**大概率是内嵌在代码里**的（开源项目，翻译贡献路径不明显）。**当前 `2.3.73` 版本是否存在独立语言文件、路径在哪，本站没有核实到。**

想改文案的话：打开 `plugins/GrimAnticheat/`（或 `plugins/GrimAC/`）看实际生成的文件，搜配置文件里带 `message` 的段落。**具体配置键名以你手上版本的官方文件注释为准。**

## 下一步

- 另一个选项（Vulcan）→ [Vulcan](#/plugin/vulcan)
- 同一个项目的原理页 → [GrimAC](#/plugin/grimac)
- 前置怎么装 → [PacketEvents](#/plugin/packetevents)
- 误报/异常怎么排查 → [卡顿与掉帧诊断](#/guide/lag-diagnosis)
- 服务端加固 → [服务器安全加固](#/guide/security-hardening)