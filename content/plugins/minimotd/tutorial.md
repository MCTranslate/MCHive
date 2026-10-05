---
id: minimotd
name: MiniMOTD
description: 服务器列表 MOTD 定制 — MiniMessage 写 RGB 渐变、随机 MOTD、图标配文案、可伪造玩家数，Paper/Folia 专用也有代理端版本。
category: 基础工具
version: 2.2.5（MC 1.21.8 - 26.3）
tags: [MOTD, 服务器列表, 迷你消息, RGB, 渐变, 图标]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## MiniMOTD 安装教程

### 1. 它是什么

服务器列表里那个玩家进游戏前看到的两行字——就是 MOTD。MiniMOTD 专门管它。

它不是「聊天美化」，别搞混。聊天格式是玩家进游戏之后的事，MOTD 是玩家**还没连上服务器时**在服务器列表里看到的。**决定玩家会不会点进来的是 MOTD，不是聊天格式。**

| 能力 | 说明 |
|------|------|
| MiniMessage 格式 | 名字来源，支持 RGB 和渐变 |
| 自动降采样 | 老客户端自动降到最近的颜色，不会显示成乱码 |
| 随机 MOTD | 多条轮换，每次 ping 随机取 |
| 玩家数伪装 | 显示「+N」之类的假人数 |
| 随机图标 | 64×64 png 放目录里，多个图标轮换 |
| 图标配文案 | 特定图标配特定 MOTD 文案 |
| 多平台 | Paper / Folia / BungeeCord / Waterfall / Velocity / Fabric / NeoForge / Sponge |

### 2. 平台说明要看清

MiniMOTD **不是单个 jar，是按平台分发的**：

| 平台 | 用哪个 jar |
|------|-----------|
| Paper（1.21.8 及以后的新版命名） | `minimotd-paper` |
| Paper / Folia（老版本） | `minimotd-bukkit` |
| BungeeCord / Waterfall | `minimotd-bungeecord` |
| Velocity | `minimotd-velocity` |
| Sponge 7 / Sponge 8 | `minimotd-sponge7` / `minimotd-sponge8` |
| Fabric | `minimotd-fabric`（需 Fabric API） |
| NeoForge | `minimotd-neoforge` |

**Paper 和 Spigot 共用一个 jar**（BungeeCord 和 Waterfall 同理），不是所有平台一个通用包。

> 本站核实的 2.2.5 版本对应 MC 1.21.8 - 26.3。下别的版本时**去官方发布页确认对应区间**，不同平台 jar 覆盖的 MC 范围不一样（Fabric 和 NeoForge 的 2.2.5 只对应 26.3）。

### 3. 什么时候装、什么时候别装

| 装 | 不装 |
|----|------|
| 服刚开，还没做 MOTD | 已经用别的 MOTD 插件了（**两个会互相覆盖**） |
| 想做渐变、渐字 MOTD | 用群组（Velocity / BungeeCord）且已经在代理侧配了 MOTD |
| 想轮换文案、换图标 | 只需要两行静态文字（改 `server.properties` 就够） |

**群组服注意**：MOTD 应该配在**代理端**，不是在后端。玩家看到的是代理发出来的 MOTD。你在后端装 MiniMOTD 但代理没配，玩家看到的还是代理的默认文字。正确的做法是代理端装 MiniMOTD，后端不装。

### 4. 安装

Paper / Folia 后端：

1. 下对应平台的 jar（新版用 `-paper`，老版用 `-bukkit`）
2. 丢进 `plugins/`
3. 重启
4. 编辑生成的配置
5. `/minimotd reload` 生效

代理端（BungeeCord / Waterfall / Velocity）同理，把 jar 放进代理的 `plugins/` 目录。

### 5. 命令与权限

| 命令 | 说明 |
|------|------|
| `/minimotd reload` | 重载配置 |

| 权限 | 用途 |
|------|------|
| `minimotd.admin` | 使用 reload 命令 |

只有一条命令。这很合理——它只管一件事。

### 6. 配置文件

配置放在 `plugins/MiniMOTD/`，主配置是 `motd.conf`。

> ⚠️ **注意格式**：是 `.conf`（HOCON 风格），不是 YAML。**缩进和括号敏感度不同，语法报错时先检查括号配对。**

**图标**放 `plugins/MiniMOTD/icons/`，要求 **64×64 的 png**。放几个就轮换几个。

**改完配置执行 `/minimotd reload`**，玩家立刻看到新的 MOTD，不用重启。

### 7. 写 MOTD：MiniMessage 入门

MiniMOTD 的格式全靠 MiniMessage 标签，本质上像 HTML 标签。

**基础用法（推荐）**：

```xml
<rainbow>彩虹渐变文本</rainbow>
<gradient:#ff0000:#00ff00>两色渐变</gradient>
<color:#ff8800>十六进制颜色</color>
<bold>加粗</bold>
<italic>斜体</italic>
```

**三个格式体系**（都可以用，效果等价）：

```
<color:#123456>   ← MiniMessage 标签
&#fe34d5          ← 旧式六位十六进制
&x&f&f&f&f&f&f    ← 旧式 RGB 展开
```

**没有居中。** MOTD 里没有「居中」这个概念。想看起来居中只能靠手动加空格。这是最多人踩的坑——加完发现不同分辨率下还是歪的，因为玩家列表里 MOTD 的起始位置和客户端窗口宽度、缩放设置都有关。**别在居中上花时间。**

**多行**：`motd.conf` 里一行一条。

### 8. 三个实用玩法

**① 随机 MOTD**

配多条 MOTD，玩家每次 ping 看到不同的。这个对留存有帮助——服务器列表里那个反复出现的熟悉句子，本身就是一次曝光。

**② 玩家数伪装**

可以显示成「X (+N)」，N 是你配的数字。加这个之前想清楚：**虚报人数是短期内拉新最有效的手段，也是最容易翻车的方式。** 玩家进来发现只有 3 个人，负面印象比正面的强得多。新服期可以少量虚报（比如 +20），稳定运营后建议去掉。

**③ 图标配文案**

不同图标对应不同文案，轮换时会连着换文字。这个组合做起来效果最好——文字和视觉是一套的。

### 9. 汉化

> **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**

不过这个插件的汉化需求约等于零——**MOTD 文本就是你自己在配置里写的**，直接写中文就行。

唯一可能需要改的是插件自己的提示消息（重载成功/失败之类）。配置是 HOCON 格式，打开 `motd.conf` 搜一下 `message` 之类的地方看看，**以实际文件为准**。

> 顺带一个格式上的事：`<rainbow>` 这类标签是 MiniMessage 的，不是本插件的。想了解完整语法去 MiniMessage 官方文档，那里有在线编辑器可以预览效果——**比反复重启服务器看效果快得多**。

### 10. 常见坑

**改了配置没生效**

1. 忘了 `/minimotd reload`
2. `motd.conf` 语法错误（括号没配对是最常见）
3. MiniMessage 标签没闭合——**标签必须成对**，没闭合会直接让解析器报错

**老客户端显示成乱码 / 问号**

正常情况下会自动降采样。如果你用的是 `-paper` 版配了非常新的特性，可能触发边缘情况。**要兼容 1.8 客户端就老实写标准颜色，别指望新特性。**

**改了 MOTD 但群组服玩家看到的还是旧的**

**因为你在后端改了，代理端的 MOTD 覆盖了后端的。** 群组服在代理端装 MiniMOTD，后端那套删掉。

**和别的 MOTD 插件冲突**

两个插件都改 MOTD，**后加载的赢**。装之前先查 `server.properties` 有没有相关设置、有没有别的插件在管这件事。

**图标不显示**

- 必须是 **64×64 png**
- 文件名乱码/带特殊字符可能导致读不到
- 缓存：改完图标后客户端可能要重新拉取才能看到变化，试试强制刷新服务器列表

**`/minimotd reload` 报权限不足**

`minimotd.admin`，默认 OP。

**格式预览**

改之前想看效果，不必每次都重启服务器：MiniMessage 有官方在线编辑器，把文本粘进去直接看渲染结果。**开发阶段用编辑器调好格式再写进配置，效率差很多。**

## 下一步

- 服务器列表整体包装（图标、简介、端口）→ [快速开服指南](#/guide/quick-start)
- 群组服的 MOTD 配在代理 → [Velocity 组网](#/guide/velocity-network)
- MOTD 之外，聊天框还想美化 → [聊天系统配置](#/guide/chat-system)
- 开服前把基础配置过一遍 → [服务端选型](#/guide/choose-core)
