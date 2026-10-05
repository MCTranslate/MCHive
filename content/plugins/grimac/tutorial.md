---
id: grimac
name: GrimAC
description: 预测型反作弊 — 1:1 重放玩家可能的移动再比对，从原理上治加速/飞行/自动点击，误报远低于阈值式检测。开源、带 API，和 Vulcan 是互补关系。
category: 安全管理
version: 2.3.73（MC 1.7.2 - 26.2）
tags: [反作弊, 移动检测, 预测, 开源, PacketEvents]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## GrimAC 安装教程

### 1. 它和 Vulcan 的关系（先说这个，不然会装重）

**GrimAC 和 Vulcan 不是二选一，是互补。** 这是最容易搞错的地方。

| | GrimAC | Vulcan |
|---|--------|--------|
| 强项 | **移动预测**、网络层审计、战斗距离 | **战斗检查多**、41 项检查、警报系统成熟 |
| 原理 | 模拟玩家「应该」怎么动，比对实际发的包 | 阈值/行为模式判定 |
| 检查项数量 | 相对少，但准 | 多 |

**常见搭配**：GrimAC 管移动类（飞行、加速、耶稣、墙类），Vulcan 管战斗类（Aura、Reach、AutoClicker）。

装一个能解决大部分问题。**两个都装，覆盖最全。**

> ⚠️ **两个反作弊同时用同一个 PacketEvents**，这没问题。但要注意**别让两个都对同一件事做处罚**——玩家被 Grim 判飞行，又被 Vulcan 判飞行，然后被踢两次。配之前先想清楚谁主谁辅。

### 2. 核心原理：预测，不是阈值

大部分老反作弊的逻辑是「速度超过 X 就判定加速」。问题是**X 该设多少**：

- 设低了 → 正常玩家冰道、鞘翅、村民加速时被误判
- 设高了 → 作弊器轻松绕过

GrimAC 的做法完全不同：**它自己模拟一遍玩家「应该」能怎么动**，然后拿实际收到的数据包对。

```
1. 读玩家状态（位置、速度、方块碰撞）
2. 用自己的物理引擎算出「这一步应该发什么位置」
3. 收到玩家的包 → 比对
4. 差异超出容差 → flag
```

**为什么这个方式更难绕过**：作弊器必须骗过一套完整物理模拟，而不是调一个数字。作者自己标的数据是 3.01 格 reach、1.005 timer、0.01% speed、99.99% antikb。

### 3. 跨版本物理差异处理

这是 GrimAC 相对 Vulcan 的技术优势。它对不同客户端版本的物理差异做了大量适配：

| 情况 | 处理 |
|------|------|
| 1.13+ 客户端连 1.12- 服务器 | 按对应版本物理算 |
| 1.12- 客户端连 1.13+ 服务器 | 同上 |
| 单个玻璃板碰撞形状 | 1.7-1.8 是 `+` 形，1.9+ 是 `*` 形 |
| ViaVersion 转换后的碰撞 | 通过 PacketEvents 拿到客户端协议版本，套对应数据 |
| 1.21.2+ 的移动机制变化 | 单独适配 |

**这意味着：通过 ViaVersion 让 1.8 客户端连 1.20 服务器的服，GrimAC 依然能正确工作。** 这对跨版本服很重要。

### 4. 前置条件

| 要求 | 说明 |
|------|------|
| Java | 以你的 MC 版本为准 |
| 服务端 | Paper / Spigot / Purpur（声明支持 Folia） |
| **硬依赖** | **PacketEvents** |
| 可选 | **ViaVersion（重要！）**、Geyser + Floodgate、PlaceholderAPI |

> ⚠️ **PacketEvents 是硬依赖。** 不装它 GrimAC 无法工作。装法见 [PacketEvents](#/plugin/packetevents)。

> ⚠️ **ViaVersion 的位置很关键。** 如果你用 ViaVersion，**ViaVersion 要装在 GrimAC 所在的那些后端服务器上，不是只装代理端。** 只在代理端装、后端没装，GrimAC 的跨版本判断会出问题。
>
> 另外 GrimAC 会检查某些 ViaVersion 设置（如 `fix-1_21-placement-rotation`），这类设置在老版本服务端上会引起误报。

> ✅ **Geyser / Floodgate 玩家被完全豁免。** 基岩版的移动机制和 Java 版差异太大，GrimAC 直接全部放过。**如果你的服基岩玩家很多，这个插件的检测价值会明显下降。**

### 5. 安装

- 仓库：<https://github.com/GrimAnticheat/Grim>
- Modrinth：搜 `grim` / `grimac`

**步骤**：

1. 装 **PacketEvents**
2. 装 **GrimAC**
3. 丢进 `plugins/`，重启

基本是 plug and play——官方说默认配置就挺能打。

> **1.21+ 支持的特别说明**（如果你用的是较早期版本）：需要在 GitHub Actions 下载 Grim 的最新构建 + **booky10/packetevents 的 spigot-build**。2.x 正式版已经处理了这个问题，正常从发行页下载即可。

### 6. 常用命令

| 命令 | 说明 |
|------|------|
| `/grim help` | 帮助 |
| `/grim alerts` | 开关自己的违规提醒 |
| `/grim profile [玩家]` | 玩家信息：客户端版本、延迟等 |
| `/grim reload` | **重载所有配置，同时清空在线玩家的违规记录** |
| `/grim spectate [玩家]` | 旁观该玩家 |
| `/grim stopspectating` | 停止旁观，回到原位 |
| `/grim log [0-255]` | 上传 debug 日志（预测 flag 用） |
| `/grim verbose` | 显示每一个 flag，不缓冲 |
| `/grim debug` | 开关预测输出 |
| `/grim consoledebug` | 把预测输出打到控制台 |
| `/grim sendalert [消息]` | 内部命令，测试警报发给谁 |
| `/grim dump` | 环境诊断（服务端实现、Java 版本、兼容层情况） |

> **`/grim dump` 是排查环境的利器** —— 它会输出服务端实现、Java 版本、有没有 ViaVersion、Paper 兼容性等信息。报 bug 前先跑它，能省掉一轮来回。

> ⚠️ **`/grim verbose` 和 `/grim consoledebug` 会刷屏。** 只在排查具体问题的时候临时开。

### 7. 数据库配置

GrimAC 有 `config.yml` 和 `database.yml` 两个主要配置。

**单服用默认的 SQLite 就够**（官方明确建议非群组服保持默认）。

**群组服要换 MySQL：**

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

然后编辑 `databases/mysql.yml` 填连接信息。

| 数据库 | 用途 |
|--------|------|
| `violation` | 违规记录 |
| `session` | 会话数据 |
| `player-identity` | 玩家身份标识 |
| `setting` | 插件设置 |
| `blob` | 二进制大对象（可设 `none`） |

**切换数据库前先备份。** 见 [数据库配置](#/guide/database-setup)。

### 8. 检查项怎么调

`config.yml` 里每一项检查都有阈值。方向很简单：

| 症状 | 调法 |
|------|------|
| 误报太多 | **放宽**对应检查的判定值 |
| 漏报 | **收紧**判定值 |

**如果误报和踢人太多，官方建议先联系社区讨论，而不是自己乱调。** 因为把阈值调松很容易——调到不报警反作弊就废了。

**调试顺序建议**：

1. `/grim dump` 确认环境正确
2. 确认没有 ViaVersion 配置冲突
3. 确认基岩玩家已豁免（Geyser 场景）
4. 单独 `/grim spectate <玩家>` 观察
5. 还不明白 → `/grim log`

### 9. 常见坑

**装了不加载 / 报缺依赖**

PacketEvents 没装或版本太老。更新到最新版。

**玩家说被误判**

按上面第 8 节的顺序查。最常见的三个原因：

1. **ViaVersion 设置冲突** —— 尤其 `fix-1_21-placement-rotation`
2. **服务端有非标准位移的插件** —— 传送、载具、弹射器
3. **网络延迟高** —— GrimAC 的预测对高延迟环境更敏感

**基岩玩家大量误报**

不会——GrimAC 对 Geyser/Floodgate 玩家**完全豁免**。如果你看到的误报是基岩玩家，那可能不是 GrimAC 干的。

**和 Vulcan 双重踢人**

配之前想清楚谁主谁辅。同一次作弊被两个插件各判一次，玩家被踢两下、通知收两条——体验很差。

**群组服后端没装 ViaVersion 但代理端装了**

跨版本判断会出问题。见上面第 4 节。

**`/grim reload` 把所有违规记录清了**

**这是设计如此** —— reload 会重置所有在线玩家的违规记录。用来调配置正好，但**别在有人作弊的时候 reload**。

**`/grim consoledebug` 之后控制台刷爆**

关掉：再跑一次 `/grim consoledebug` 切换。

**Java 版本要求**

以你的 MC 版本为准。1.20.5+ 需要 Java 21。这类前置要求请对照 [Java 运行时选择](#/guide/java-runtime-choice)。

### 10. 什么时候别用 GrimAC

- **基岩玩家占大多数** —— 全被豁免，检测价值接近零
- **玩法依赖非标准位移** —— 大量传送/弹射/载具的服，预测引擎会持续误报
- **PVP 竞技服且追求严格** —— 竞技场景对延迟极敏感，误报成本高
- **没有 PacketEvents 就装不了** —— 你得先接受这个前置
- **想省事** —— Vulcan 的告警和管理界面更成熟，GrimAC 更偏底层检测

### 11. 它的独特价值

**开源 + 有 API。**

作者明确说：2.0 开源分支已功能完成，bugfix 和增强走赞助，没有赞助可以提 PR。这对反作弊这种「你要读它源码才敢信任它」的类别很重要。

社区有 [Grim API](https://github.com/GrimAnticheat/Grim-API)，可以自己写插件集成。

**它也明确标注自己是 "bypassable"** —— 没有反作弊是完美的。这个诚实比吹嘘有价值。

### 12. 关于汉化

> ⚠️ **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**
>
> GrimAC 的违规提示和命令输出**大概率是内嵌在代码里**的（开源项目，翻译贡献路径不明显）。**当前 `2.3.73` 版本是否存在独立语言文件、路径在哪，本站没有核实到**。请以 `plugins/GrimAC/` 目录下实际生成的文件和仓库源码为准。

## 下一步

- 搭配另一个反作弊 → [Vulcan](#/plugin/vulcan)
- 前置怎么装 → [PacketEvents](#/plugin/packetevents)
- 权限怎么分 → [权限系统设计](#/guide/permissions-design)
- 误报/异常怎么排查 → [卡顿与掉帧诊断](#/guide/lag-diagnosis)
- 服务端加固 → [服务器安全加固](#/guide/security-hardening)
