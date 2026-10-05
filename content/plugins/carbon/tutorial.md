---
id: carbon
name: Carbon
description: 频道制聊天系统 — 取代原版全局聊天，把交易/闲聊/管理分成独立频道，支持私聊、Discord 转发、跨服务器同步。⚠️ 当前是 beta 测试版，不建议上生产服。
category: 聊天美化
version: 3.0.0-beta.39（MC 1.19.4 - 26.3 · 测试版）
tags: [聊天, 频道, 跨服, Discord, MiniMessage]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: Carbon 自带简繁中文（messages-zh_CN / zh_TW），跟随客户端语言自动切换
---

## ⚠️ 先看这里：这是 beta 版

**当前版本是 `3.0.0-beta.39`——测试阶段。**

这不是「小版本号」的意思，是**作者自己标注的 beta 通道发布**。具体意味着：

| 风险 | 说明 |
|------|------|
| 配置可能不兼容 | beta 之间的配置改动没有兼容性保证，升级可能丢配置 |
| 可能崩服 | 测试版没有经过长时间实战验证 |
| 缺少功能 | 计划中的功能可能还没做完 |
| 随时可能停止维护 | 作者没有义务继续维护 beta 分支 |

**建议：**

- ✅ 测试服、小型朋友服 —— 随便玩
- ❌ 商业运营服、有真实玩家的服 —— **别装**
- ❌ 已经稳定的服想换聊天系统 —— 等正式版

正式版和 beta 版在作者主页和 Modrinth 上是**分开发布的**，别混着装。本页内容以 `3.0.0-beta.39` 为准。

## Carbon 安装教程

### 1. 它是什么

Carbon（Hexaoxide / Stampede2011）把原版那一个全局聊天框**换掉**，改成频道制——就是 Discord 那种模式：

| 频道类型 | 用途 |
|---------|------|
| `global` | 全频道都能看到 |
| `local` | 只在当前世界/半径内 |
| `private` | 特定玩家（客服频道、举报频道） |
| `passthrough` | 消息直通原版（团队频道、公告频道） |
| 自定义 | 交易频道、水群频道… |

每个频道**独立配置**：显示名、颜色、格式、发送权限、接收权限。

除此之外还有：

- **MiniMessage 格式** —— 支持 RGB 渐变、点击、悬停
- **私聊**（含群聊、回复）
- **@提醒** —— 带高亮和音效
- **Discord 转发** —— 指定频道的消息推送到 Discord webhook
- **跨服聊天** —— 通过 NATS / Redis / RabbitMQ
- **静音与忽略**

### 2. 什么时候真的需要它

**5-10 人的小服：不需要。** 直接用原版聊天，或者 EssentialsX 的格式自定义就够了。频道制在这种规模是纯粹的复杂度。

**什么时候值得上：**

- 全球频道刷屏，重要消息被淹掉 → 交易频道独立出来
- 50+ 人的社区 → 闲聊/交易/管理分开
- 群组服 → 各子服频道不同，跨服还要同步
- 模仿 Discord 的社区氛围

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | **Paper / Folia**（声明支持 Velocity 和 Fabric，但主流用法在 Paper 系） |
| Java | **beta 版要求较新的 Java**（官方仓库构建面向 Java 21+） |
| 硬依赖 | 无 |
| 可选 | LuckPerms / 权限插件、PAPIProxyBridge（跨服变量） |

> ⚠️ **Java 版本是 beta 版的一个隐形门槛。** 1.20 以下的 MC 版本需要 Java 17，而 Carbon beta 的构建面向 Java 21。**装之前先确认你的服务端 Java 版本够**，别装完发现根本起不来。

### 4. 下载与安装

- 仓库：<https://github.com/Hexaoxide/Carbon>
- 发行页：<https://github.com/Hexaoxide/Carbon/releases>
- Modrinth：搜索 `carbonchat`

> ⚠️ **认准作者。** 这个名字很容易混淆：市面上有个 **CarbonSpigot**（Refine Development 的 Paper fork，服务端核心，**不是插件**），和这里的 Carbon Chat 完全无关。搜「Carbon 插件」会搜到一堆混淆结果。

下载对应平台的 jar（`-paper` / `-velocity` / `-fabric`），丢进 `plugins/`，重启。

生成 `plugins/Carbon/`，含频道定义和消息配置文件。

### 5. 频道配置

Carbon 的频道定义是 YAML 结构。基本形态大致是这样（**以你版本的配置文件注释为准**）：

```yaml
channels:
  global:
    display-name: "&b全局"
    color: "BLUE"
    permission: "carbon.channel.global"
  trade:
    display-name: "&6交易"
    color: "GOLD"
    permission: "carbon.channel.trade"
  staff:
    display-name: "&c管理"
    color: "RED"
    permission: "carbon.channel.staff"
```

核心逻辑：**`permission` 那一行决定谁能用这个频道。** 发消息需要发送权限，接收需要接收权限，两者是分开的。

### 6. 常用命令

| 命令 | 说明 |
|------|------|
| `/carbon reload` | 重载配置 |
| `/carbon help` | 帮助 |
| `/switch <频道>` 或频道快捷命令 | 切换频道（快捷命令可自定义） |
| `/msg <玩家> <内容>` | 私聊 |
| `/r <内容>` | 回复私聊 |
| `/ignore <玩家>` | 忽略 |
| `/channel create <名>` | 管理员建频道 |

> ⚠️ **具体命令和权限节点以你版本的 `plugin.yml` 和配置注释为准**——beta 版还在改，命令表可能变。装完先进游戏敲 `/carbon help` 看实际有什么。

### 7. Discord 转发

Carbon 能把指定频道的消息推到 Discord webhook：

```yaml
# 典型结构，以官方配置文件注释为准
discord-webhooks:
  enabled: true
  urls:
    - "https://discord.com/api/webhooks/..."
  channel-mapping:
    staff: "https://discord.com/api/webhooks/..."
```

**这是 Carbon 最实用的功能之一**——玩家在 Discord 里就能看到管理频道，不用上游戏。

**安全提醒**：
- **webhook URL 等于密码。** 谁拿到就能往那个频道发消息。
- 不要把带 webhook 的配置文件传到公开的地方（GitHub 仓库、论坛附件）
- 转发内容包含玩家聊天内容，**开之前想清楚隐私合规**

### 8. 跨服聊天

群组服可以让多个后端共享聊天：

| 方案 | 说明 |
|------|------|
| NATS | 需要独立运行的 NATS 服务 |
| Redis | 多数群组服已有 |
| RabbitMQ | 同上 |

**所有节点配置要一致**（同样的频道定义、同样的消息服务器地址）。有一台没配对，频道行为就不一致。

> 如果你的服只有一台，**别碰这个功能**。配错了会静默失败，消息就是不跨服，你查半天。

### 9. 常见坑

**装完不加载 / 类加载失败**

九成是 **Java 版本不够**。beta 版面向 Java 21+，老 Java 装不上。看控制台堆栈最上面的 `UnsupportedClassVersionError`。

**和其他聊天插件冲突**

**只能装一个聊天插件。** EssentialsX Chat / ChatControl / Carbon 三选一。同时装会出现消息被重复发送、格式叠加、命令打架。

> 尤其注意 EssentialsX：**要用 Carbon 就把 EssentialsX 的聊天部分关掉**（`config.yml` 里禁掉），只留 EssentialsX 的经济、权限功能。

**频道权限发了但玩家还是看不到**

检查**发送权限和接收权限是两回事**。玩家有 `carbon.channel.trade.send` 但没有对应的 `.receive`，就会发不出去或收不到。

**跨服不同步**

检查：消息服务器地址、频道定义是否一致、认证信息。以及**是不是根本没用配**。

**玩家说消息被吞了**

大概率是静音/忽略设置。`/ignore` 是持久化的，玩家之前忽略过某人就会一直收不到——这类问题最容易被当成 bug 报上来。

**升级 beta 后配置全乱**

**beta 之间没有配置兼容承诺。** 升级前备份 `plugins/Carbon/` 整个目录。

### 10. 什么时候别用 Carbon

- **小服**（20 人以内）—— 原版 + EssentialsX 格式自定义就够了
- **生产环境求稳**—— beta 版风险不对等
- **已经有稳定聊天系统**—— 迁移成本高于收益
- **Java 17 且不打算升**—— 装不上

### 11. 关于汉化

**Carbon 自带简繁中文，开箱即用**，跟随玩家客户端语言自动切换：

- 简体中文：`messages-zh_CN.properties`
- 繁体中文：`messages-zh_TW.properties`

频道显示名和格式支持 MiniMessage，可以直接写中文（包括 RGB 渐变）。

需要注意的是，语言文件只管**界面提示文本**。**自定义消息模板**（Discord 转发内容、跨服同步消息）不走语言文件，得在对应配置里自己写。

完整机制、改文案的方法和坑，见 [汉化机制](#/plugin/carbon) 页。

## 下一步

- 怎么控制发言频率和屏蔽广告 → [聊天系统设计](#/guide/chat-system)
- 跨服聊天要配合什么 → [Velocity 网络](#/guide/velocity-network)
- 群组服的配置思路 → [插件组合推荐](#/guide/plugin-combos)
- 汉化与格式 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
