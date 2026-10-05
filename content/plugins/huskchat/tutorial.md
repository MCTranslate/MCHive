---
id: huskchat
name: HuskChat
description: 轻量聊天系统 — 频道、私聊、权限过滤、机器学习脏话识别，跨 Spigot 与 Velocity/BungeeCord 同步。⚠️ 作者已宣布停止维护，介意稳定性就别用。
category: 聊天美化
version: 3.0.1（MC 1.16.5+ · 已停更）
tags: [聊天, 频道, 私聊, 跨服, 脏话过滤]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## ⚠️ 先看这里：HuskChat 已停止维护

**作者已在 Modrinth 和项目主页明确标注插件 discontinued（停止维护）**。原话是：不再积极维护，可能在更新的 Spigot/Paper/Velocity/Waterfall 版本上失效，不再提供支持。

这是最要紧的一条，剩下的内容你得在这个前提下读。

**具体后果：**

| 后果 | 说明 |
|------|------|
| 新版 MC 上可能直接坏 | 作者不再跟进 API 变化 |
| 报 bug 没人修 | 没有维护者 |
| 遇到问题只能自己改 | 源码在 GitHub，你得自己编译 |
| 依赖它的其他插件可能连带出问题 | 连锁故障 |

**如果你是新开服：不建议装。** 现在有更活跃的选择（Carbon 虽然是 beta 但在活跃开发）。

**如果你是存量服已经在用**：那继续用，但要意识到**你自己得准备维护它**。

本页内容以 `3.0.1` 为准。

## HuskChat 安装教程

### 1. 它是什么

HuskChat（William278）走的是**「轻量、无花架子」**路线。作者的定位是「装上就能用」而不是「功能堆满」。

功能清单：

| 能力 | 说明 |
|------|------|
| 频道 | 自定义频道，可设收发权限、快捷命令 |
| 私聊 | 含群聊、回复、**管理spy（偷看）** |
| 脏话过滤 | **机器学习**方案（不是关键词匹配） |
| 过滤器 | 刷屏限制、反广告、特殊 emoji 替换 |
| Discord webhook | 频道消息转发 |
| 权限集成 | LuckPerms 前缀/后缀、PAPIProxyBridge 变量 |
| 格式化 | MineDown，支持 RGB 和渐变 |

**亮点是那个脏话过滤。** 它用的是 `alt-profanity-check`（机器学习分类器），比关键词列表强得多——关键词库能绕，模型不好绕。

**跨平台是它最大的优势**：同一套逻辑跑在 Spigot 后端和 Velocity/BungeeCord 代理端上。

### 2. 前置条件

| 要求 | 说明 |
|------|------|
| Java | **16+** |
| 服务端 | Spigot 1.16.5+（单服）**或** Velocity / BungeeCord / Waterfall 代理（推荐） |
| 硬依赖 | 无 |

> HuskChat 官方推荐装在**代理端**。单服也支持，但功能会少一些（跨服聊天没了）。

### 3. 下载与安装

- 仓库：<https://github.com/WiIIiam278/HuskChat>
- Modrinth：`huskchat`

**代理端装法**：

```
plugins/（代理端）
└── huskchat-3.0.1.jar
```

**单服装法**：

```
plugins/（Spigot 后端）
└── huskchat-3.0.1.jar
```

> 如果你用 Velocity，**代理端和后端都装**，配置要一致，否则跨服消息会出问题。

### 4. 频道配置

HuskChat 的频道是 YAML 定义，大致结构（**以你版本的配置注释为准**）：

```yaml
channels:
  global:
    display-name: "&a全局"
    scope: GLOBAL
    send-permission: "huskchat.channel.global.send"
    receive-permission: "huskchat.channel.global.receive"
    shortcut-commands:
      - g
  trade:
    display-name: "&6交易"
    scope: GLOBAL
    send-permission: "huskchat.channel.trade.send"
```

**`scope` 是关键**，决定消息往哪发：

| scope | 行为 |
|-------|------|
| `GLOBAL` | 发给整个网络 |
| `LOCAL` | 只在当前世界 |
| `LOCAL_WITH_RADIUS` | 一定半径内 |
| `PASSTHROUGH` | 直通原版聊天显示 |

`PASSTHROUGH` 团队频道要用——它让玩家在队内说话时其他人仍能按原版方式看到。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/huskchat help`（或频道快捷命令） | 帮助 |
| `/msg <玩家> <内容>` | 私聊 |
| `/r <内容>` | 回复 |
| `/huskchat reload` | 重载配置 |
| `<频道快捷命令>` | 切频道（自己定义，如 `/g` `/t`） |
| spy 相关 | 管理员查看私聊 |

> ⚠️ 具体命令和权限节点**以你版本的文档和 `/huskchat help` 输出为准**。

### 6. 脏话过滤

这是 HuskChat 的招牌功能：

```yaml
# 典型结构，以官方配置注释为准
profanity-filter:
  enabled: true
```

它是**机器学习分类器**（`alt-profanity-check`），不是关键词匹配。优点：

- 变体绕过（拼写变形、符号插入）识别率比关键词高
- 误报率比纯关键词低
- 支持多语言（**对中文脏话的过滤效果有限**——它的训练数据主要是英文）

**中文服的现实**：这个过滤器对中文基本没用。中文脏话得靠关键词列表或者外部反作弊方案。

### 7. 常见坑

**装了没反应 / 聊天被吞**

检查是否和其他聊天插件冲突。**HuskChat 只能独占聊天系统**——EssentialsX Chat、ChatControl、Carbon 装了都要关掉聊天部分。

**Velocity 上私聊无效 / 报签名错误**

1.19+ 聊天签名机制和代理端有关。HuskChat 的方案是走系统消息分发，这意味着**和原版 Chat Reporting 不兼容**（作者自己说明了这点）。如果你依赖聊天举报功能，这里会有冲突。

**跨服频道不同步**

代理端和后端配置不一致。频道定义、消息服务器地址要对齐。

**脏话过滤把正常词拦了**

机器学习模型有误报。可以在过滤器里加白名单，或者干脆关掉这个功能改用关键词。

**升级后起不来**

**没有维护者意味着没有兼容性修复。** 新版 MC 上可能直接炸。准备好用 GitHub 源码自己编译的方案。

**中文过滤失效**

见上面——它的模型是英文的。

### 8. 什么时候别用 HuskChat

说直白点：

- **新开服** —— 作者已弃坑，不值得赌。除非你有能力自己维护。
- **中文服要脏话过滤** —— 它的模型是英文的，中文基本无效。
- **需要聊天举报功能** —— 和 Chat Reporting 不兼容。
- **新版 MC 上想稳定运行** —— 没人跟进 API 变化。

### 9. 如果你决定要用

**至少做这些准备：**

1. 备份所有配置，**并且知道自己怎么回滚**
2. 把 jar 和配置**单独存一份**在服务器外
3. 记下 GitHub 仓库地址——出问题时你会需要自己看代码
4. 准备一个备用聊天方案（EssentialsX 自带的格式功能是最容易的退路）

**这不是说它现在不能用**——已停更的插件在现有 MC 版本上通常还能跑。问题出现在**下次升级 MC 的时候**，那时候你得自己动手。

### 10. 关于汉化

> ⚠️ **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**
>
> 已知 HuskChat 项目接受翻译 PR（社区曾贡献过简体翻译），但**当前 `3.0.1` 版本里语言文件的实际状态、存放位置和切换方式，本站没有核实到**。请以官方文档和 `plugins/HuskChat/` 目录下实际生成的文件为准。

## 下一步

- 聊天系统怎么设计 → [聊天系统设计](#/guide/chat-system)
- 跨服聊天需要什么 → [Velocity 网络](#/guide/velocity-network)
- 稳定的替代方案参考 → [插件组合推荐](#/guide/plugin-combos)
- 汉化与格式 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
