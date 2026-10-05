---
id: tabtps
name: TabTPS
description: 把 TPS / MSPT / 内存 / 延迟实时显示在 Tab 列表、Boss 血条或 ActionBar 上 — 让玩家自己就能看出服务器卡没卡，不用再问管理员。
category: 运维工具
version: TabTPS（MC 1.8 - 26.3）
tags: [TPS, MSPT, 监控, 性能, 排障]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## TabTPS 安装教程

### 1. 为什么需要它

服务器卡的时候，最先发现问题的是玩家，但他们只会说「好卡」。**让玩家能自己看到 TPS/MSPT，比管理员在控制台查效率高得多**——他们会告诉你「刚才 15 秒掉到 14」，而这句话比「有点卡」有用一百倍。

TabTPS 把这些数据直接画在屏幕上：

| 显示位置 | 命令 | 适合 |
|---------|------|------|
| **Tab 列表**（多人列表） | `/tabtps toggle tab` | 大多数服，玩家不用改任何东西就能看到 |
| **ActionBar**（物品栏上方） | `/tabtps toggle actionbar` | 干净，不遮挡列表 |
| **Boss 血条** | `/tabtps toggle bossbar` | 很显眼 |

它**不是被动监控工具**，只是个显示层。想做事后分析，用 [卡顿与掉帧诊断](#/guide/lag-diagnosis) 那套方法。

### 2. 装之前先想清楚给谁看

这不是小问题：

| 给谁 | 建议 |
|------|------|
| **管理员和 staff** | ✅ 一定要给，这是核心用途 |
| **所有玩家** | ⚠️ 想清楚——你等于公开告诉所有人你的服务器性能上限。**被 DoS 或者硬件扛不住的时候，这个数字会变成攻击目标的参考** |
| **完全不给玩家** | 也很常见，只给 staff 看 |

> **TPS 是可以公开的信息，也可以不是。** 很多服主本能地全服开，然后有人截图发论坛说「这破服才 8 TPS」。技术上没什么问题，运营上是自找麻烦。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper、Sponge 8+、Fabric（需 Fabric API）、NeoForge |
| 硬依赖 | **无** |

**它支持的服务端类型比多数插件多**——Fabric 和 NeoForge 也能用，这比较少见。

### 4. 安装

- Modrinth：搜 `tabtps`
- GitHub：<https://github.com/jmanpenilla/TabTPS>

丢进 `plugins/`，重启。生成 `plugins/TabTPS/`。

## 5. 核心机制：显示配置 + 权限

TabTPS 的设计不是「开一个全局开关」，而是**显示配置（display config）**：

```
plugins/TabTPS/
  main.conf          ← 主配置，含各显示配置的优先级
  display-configs/   ← 每个显示配置一个文件
  themes/            ← 配色主题
```

**逻辑是这样的：**

1. 每个显示配置绑定一个权限节点
2. 玩家拥有哪个权限，就用哪个显示配置
3. **一个玩家只会用一个显示配置**，即使他有多个权限
4. 有多个配置时，按 `main.conf` 里的**优先级**决定

**这个设计的意义**：你可以做「普通玩家看到精简版，staff 看到完整版」，靠权限区分，而不是所有人看同一个东西。

**默认显示配置使用的权限是 `tabtps.defaultdisplay`。**

### 6. 命令

| 命令 | 说明 | 权限 |
|------|------|------|
| `/tabtps toggle tab` | 切换 Tab 列表显示 | — |
| `/tabtps toggle actionbar` | 切换 ActionBar 显示 | — |
| `/tabtps toggle bossbar` | 切换 Boss 血条显示 | — |
| `/tickinfo` 或 `/mspt` | 打开详细的 TPS 信息 | `tabtps.tps` |
| `/memory`、`/mem`、`/ram` | 查看 JVM 内存池 | `tabtps.tps` |
| `/ping` | 看自己延迟 | `tabtps.ping` |
| `/ping <玩家>` | 看别人延迟 | `tabtps.ping.others` |
| `/pingall` | 全体延迟汇总 | — |
| `/tabtps reload` | 重载配置 | `tabtps.reload` |

> **给 staff 的推荐组合**：`tabtps.tps` + `tabtps.ping.others` + `tabtps.reload`。有这三样就够排障了。

### 7. 关于 `/mspt` 输出的一条重要说明

`/memory` 的输出**和「你有多少内存」关系不大**。

它的价值取决于你用的垃圾回收器（GC）和 GC 参数：

| GC 类型 | `/memory` 输出 usefulness |
|--------|------------------------|
| G1 | 有参考价值，能看出老年代占用趋势 |
| ZGC / Shenandoah | 参考价值有限，它们刻意模糊内存使用 |
| 参数不当 | **可能什么都看不出来**，或者看起来一直在满但 GC 很频繁 |

**所以别把这个数字当作「内存够不够」的答案。** 它是一个诊断辅助，不是结论。

### 8. 三个显示模式怎么选

| 模式 | 效果 | 适合 |
|------|------|------|
| **Tab 列表** | 在 Tab 里加一行显示 | 绝大多数服，首选 |
| **ActionBar** | 物品栏上方一行 | 不想占 Tab 列表 |
| **Boss 血条** | 最显眼 | 公开服做「服务器状态」展示，或者调试时临时用 |

**Boss 血条会挡住准星和血条。** 玩家在战斗中被这个干扰会很烦——如果你打算全服开，别选这个。

### 9. 常见坑

**改了配置没生效**

`/tabtps reload`。

**玩家说看不到**

按顺序查：

1. 玩家有没有对应的**显示配置权限**（默认是 `tabtps.defaultdisplay`）
2. 他有没有用 `/tabtps toggle tab` 打开
3. 他的客户端版本支不支持对应显示位置（老版本客户端 Boss 血条显示可能有问题）

**两个玩家配置不一样**

正常——这就是权限设计的用途。用 `main.conf` 里的优先级调一下。

**`/mspt` 显示的 TPS 和 `/tabtps` 显示的不一样**

`/mspt` 是即时详细视图，Tab 显示是采样后的值。有轻微差异是正常的，差很多才要去查。

**公开显示后被质疑性能**

见第 2 节。建议只给 staff，或者给一个「宽松区间」的显示配置。

## 10. 缺点

| 缺点 | 说明 |
|------|------|
| **只是显示层，不解决问题** | 它告诉你卡，不帮你修 |
| **全服公开 = 泄露性能信息** | 见第 2 节 |
| **Boss 血条挡准星** | 战斗场景体验差 |
| **TabTPS 支持的服务端类型有限** | Fabric/NeoForge 需要额外 API，不适用于所有服务端实现 |
| **`/memory` 输出不好解读** | 强依赖 GC 类型 |

## 11. 关于汉化

> ⚠️ **本站未核实到 TabTPS 的官方中文语言文件机制。**

TabTPS 的显示内容大多是数字和固定的英文标签。想改：

1. 打开 `plugins/TabTPS/display-configs/` 看显示配置里有哪些文本字段
2. 搜 `themes/` 目录里的配色配置

**具体可改的键名以你手上版本的官方配置文件注释为准。**

顺带一提：TabTPS 1.3.22 的更新日志提到新增了繁体中文和西班牙语翻译，**但简体中文本站未核实到**。如果你需要中文，可以看看你的版本里有没有对应语言文件。

## 下一步

- 真的卡了怎么查 → [卡顿与掉帧诊断](#/guide/lag-diagnosis)
- 服务端参数怎么调 → [性能调优](#/guide/performance-tuning)
- Tab 列表美化成完整计分板 → [TAB 计分板](#/guide/tab-scoreboard)