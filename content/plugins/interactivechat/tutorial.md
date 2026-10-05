---
id: interactivechat
name: InteractiveChat
description: 聊天增强组件库 — 让玩家在聊天里[分享物品]、[展示背包]、@人，配自定义关键词与悬停点击内容；它是别的聊天插件的地基，自己不直接给玩家用。
category: 开发前置
version: 2026.1.2（MC 1.8 - 26.3）
tags: [聊天, 组件库, 物品分享, 悬停, 前置, API]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## InteractiveChat 安装教程

### 0. 它是前置，不是聊天插件

这一条必须先说，否则你会觉得「装完什么都没变」。

**InteractiveChat 自己不提供聊天格式。** 它是一个**组件库 / 聊天增强层**，工作在「你已经有一个聊天格式插件」的基础上。

它的官方说明里写得很清楚：**它设计为在你现有的聊天格式插件之上工作，不是替代品。**

| 它做什么 | 它不做什么 |
|---------|-----------|
| 把 `[item]` 替换成手持物品的展示 | 不定义 `[VIP]` 之外的聊天格式 |
| 把 `[inv]` 替换成背包展示 | 不改聊天框的背景和布局 |
| 把 `[ender]` 替换成末影箱展示 | 不管 Tab 列表显示 |
| 玩家名变成可悬停、可点击 | 不提供禁言/清理聊天 |
| @ 人 + 多种提醒样式 | 不提供称号系统 |
| 自定义交互关键词 | 不提供群组差异化格式 |
| 提供 API 给其他插件调用 | 不提供 GUI 商店 |

**所以：光装它，玩家的聊天框不会有任何变化。** 你还需要一个负责聊天格式的插件（或者你本服已经有了）。这也是为什么它被归在「开发前置」这一类。

### 1. 为什么它值得装

它加的东西是**原版聊天做不到**的：

| 功能 | 效果 |
|------|------|
| `[item]` | 聊天里直接展示手里的物品，客户端渲染成可悬停的物品图标 |
| `[inv]` | 展示整个背包，跨维度聊天时特别有用（跟队友说「我捡到东西了」直接给他看） |
| `[ender]` | 展示末影箱内容 |
| 玩家名交互 | 聊天里出现的所有玩家名（**含 Essentials 昵称**）变成可悬停、可点击 |
| @ 人提醒 | 多种通知样式：ActionBar / Title+SubTitle / BossBar / Toast，各可单独关 |
| 自定义关键词 | 任意占位符 + 悬停文本 + 点击动作，能组合 |
| **跨服** | BungeeCord / Velocity 模式下 `[item]` `[inv]` 自定义占位符、@人**全部跨服可用** |

**「跨维度/跨服展示背包」是它真正的杀手功能。** 这个功能用其他方案实现起来麻烦得多。

### 2. 前置依赖

**后端服务器（Paper / Spigot / Folia / Purpur）上：**

| 依赖 | 必要性 | 说明 |
|------|--------|------|
| ProtocolLib **或** PacketEvents + 对应 Module | **必须** | 它靠改数据包工作 |
| PlaceholderAPI | **必须** | 变量 |
| Vault | **必须** | 经济 |

**代理端（BungeeCord / Velocity / Waterfall）：不需要任何依赖。**

> ProtocolLib 和 PacketEvents 二选一。走 PacketEvents 路线要额外装 PacketEvents 的 InteractiveChat Module（Modrinth 上单独提供），且要装和你服务端版本兼容的最新版本。

**装错依赖的后果**：插件能启动但所有交互关键词都无效——因为改数据包的模块没挂上。遇到这个先确认依赖装了，别急着改配置。

### 3. 安装

1. 后端和依赖都丢进 `plugins/`
2. 如果要用群组模式：**在代理端也装上同一个 jar**（BungeeCord / Velocity 不需要依赖），并且**在所有 Spigot 后端上把配置里的 bungeecord 选项打开**
4. 重启
5. 需要改配置就改，改完**重启服务器**

> ⚠️ 关于重启：官方安装步骤第 4 步写的是「改完配置需要重启」。这跟大多数插件的 `/xxx reload` 不一样，**这里老老实实重启**。用 PlugManX 之类的热重载搞它，恰好撞上这插件最不该被热插拔的场合（改数据包的）。

> ⚠️ 群组模式必须「所有后端 + 代理端都装、都开」。漏一个后端，那个后端的玩家聊天就没有交互功能，症状是「有的服能用有的不能用」。这是最常见的群组服投诉来源。

### 4. 命令

**Minecraft 服务端：**

| 命令 | 作用 |
|------|------|
| `/interactivechat reload`（`/ic reload`） | 重载插件 |
| `/interactivechat update`（`/ic update`） | 检查更新 |
| `/interactivechat chat`（`/ic chat`） | 发送带占位符和玩家名补全的聊天消息 |
| `/interactivechat list`（`/ic list`） | 列出你能用的占位符 |
| `/interactivechat mentiontoggle`（`/ic mentiontoggle`） | 开关自己的 @ 提醒 |
| `/interactivechat setinvdisplaylayout` | 选自己的背包展示布局 |

**代理端：**

| 命令 | 作用 |
|------|------|
| `/icp backendinfo` | 列出代理上各后端服务器的 InteractiveChat 状态 |

`/icp backendinfo` 在群组服排错时很好用——它能告诉你哪个后端没接上。

### 5. 默认关键词

默认配置自带几个交互占位符（1-3 是物品展示类）：

| 关键词 | 效果 |
|--------|------|
| `[item]` | 手持物品 |
| `[inv]` | 背包 |
| `[ender]` | 末影箱 |
| `v` | 悬停消息示例关键词 |
| `[pos]` | 多行悬停文本示例 |

**物品/背包展示有两种布局**（Layout 0 和 Layout 1），玩家可以自己用 `/ic setinvdisplaylayout` 选偏好。

> 默认关键词的**具体内容可以在配置里改掉，也可以加自己的**。默认那几条是示例，删掉不影响功能。

### 6. 自定义关键词

这是插件最灵活的部分，两种用法，可以叠加：

**① 当占位符用** — 在聊天里替换成一段内容

**② 当交互按钮用** — 加悬停文本 + 点击动作

```xml
[点击这里领取奖励]
  hover: '点击领取！需 10 金币'
  click: '/eco give %player_name% 10'
```

多行悬停用 `v` / `[pos]` 这种分行的写法。

**自定义的东西最终会变成 PAPI 变量输出到别的地方**——记分板、Tab、第三方插件都能引用。官方建议的做法是：这里定义原始内容，让聊天插件去格式化。

### 7. 关键：它是怎么改数据的

这一节决定你会不会和别的插件打架。

> **它在数据包层面修改消息。**

这句话是理解 InteractiveChat 一切冲突问题的钥匙。

| 推论 | 后果 |
|------|------|
| 它改的是发出去的原始数据包 | 所以它能「工作在其它聊天插件之上」——它改的是最终结果 |
| 其它也在改数据包的插件会跟它抢 | **同时改数据包的插件会互相覆盖或产生乱码** |
| 颜色码也是靠改写实现的 | 所以它的颜色转义靠 hack，别的插件读不懂就会显示成 `&#xxxxxx` 字面量 |

**所以有一条硬规则：聊天链路上只能有一个插件负责颜色和数据包改写。** 想要 RGB / MiniMessage 渐变 / 特殊字体，就让 InteractiveChat 管；想用别的插件管颜色，就得关掉 InteractiveChat 的相关功能（`interactivechat.chatcolor.translate` 权限就是干这个的）。

官方推荐用它的 [MiniMessage 查看器](https://webui.adventure.kyori.net/) 预览效果。

**它还支持资源包字体**：

```xml
[font=uniform]
```

**「对聊天里的任何消息都生效，包括其它插件发的消息」**——这是它的能力，也意味着它会介入别人的消息。

### 8. 权限节点

| 节点 | 默认 | 用途 |
|------|------|------|
| `interactivechat.reload` | op | 重载 |
| `interactivechat.backendinfo` | op | 代理端看后端状态 |
| `interactivechat.cooldown.bypass` | op | 绕过冷却 |
| `interactivechat.module.item` | true | 用物品占位符 |
| `interactivechat.module.inventory` | true | 用背包占位符 |
| `interactivechat.module.inventory.setlayout` | true | 改自己的布局 |
| `interactivechat.module.inventory.setlayout.others` | op | 改别人的布局 |
| `interactivechat.module.enderchest` | true | 用末影箱占位符 |
| `interactivechat.module.custom` | true | 用自定义关键词 |
| `interactivechat.mention.player` | true | @ 别人 |
| `interactivechat.mention.here` | op | @ 本服所有人 |
| `interactivechat.mention.everyone` | op | @ 全服所有人 |
| `interactivechat.mention.toggle` | true | 开关自己的提醒 |
| `interactivechat.mention.toggle.others` | op | 开关别人的提醒 |
| `interactivechat.list` | true | 列出自己的占位符 |
| `interactivechat.list.all` | op | 列出全部占位符 |
| `interactivechat.parse` | true | 测试占位符 |
| `interactivechat.chat` | true | 用 `/ic chat` |
| `interactivechat.chatcolor.translate` | true | 用替代颜色码 |
| `interactivechat.customfont.translate` | true | 用字体代码 |
| `interactivechat.update` | op | 更新通知 |
| `interactivechat.bedrock.events` | true | **基岩玩家**访问聊天事件菜单 |

三点值得注意：

- **功能节点默认是 `true`（所有人）**。想要 VIP 专属的物品分享功能，需要主动把 `interactivechat.module.item` 从默认组移除再加给对应组。
- `mention.here` 和 `mention.everyone` 默认 OP，**这是对的，不要给普通玩家**。
- `bedrock.events` 是给 Geyser 基岩玩家用的，跨端服注意这个节点 → [Geyser 基岩玩家](#/guide/geyser-bedrock)

### 9. 常见坑

**「玩家被踢了：You are sending too many packets!」**

ViaVersion 的全局包限流器（Global Packet Limiter）拦的。解决办法是把 ViaVersion 配置里的**全局包限流设为 -1**，**BungeeCord / Velocity 侧和后端都要设**。

这个坑的本质是：它改数据包的量很大，被防作弊性质的限流规则误伤。**在装了 ViaVersion 的多端服上这是必配项。**

**占位符显示成 `%player_name%` 原样**

PlaceholderAPI 的变量没下载。要用 `%player_name%` 得先：

```
/papi ecloud download player
/papi reload
```

PlaceholderAPI 的变量需要单独下载扩展才生效，这一步经常被忘。

**群组服里有的服能用有的不能**

bungeecord 模式没在**所有**后端打开，或者代理端没装 jar。用 `/icp backendinfo` 查。

**颜色变成 `&#ff8800` 字面量**

数据包改写打架，见第 7 节。

**API 接入**

它提供 API：<https://github.com/LOOHP/InteractiveChat/tree/master/common/src/java/com/loohp/interactivechat/api>

**要接自己的昵称插件**（比如别的改名插件）：官方有专门的一页教程 `Registering-your-own-nickname-provider`，在仓库 Wiki 里。**这个必须照官方走**，昵称注册涉及其它插件的 API 调用，自己猜容易崩。

**Discord 里也要显示物品/背包**

有个官方附属插件：InteractiveChat-DiscordSRV-Addon。它还能把 Discord 发来的图片预览到地图上、把附件变成游戏内可点击的漂亮文本。有 Discord 机器人再考虑。

### 10. 汉化

> **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**

它确实有语言功能（官方描述里专门列了「Languages!」，并提到**物品材质名会自动翻译成各客户端语言**），但**本站没核实到语言文件的实际文件名、路径和简体中文的完整度**。

需要改的中文文本：

| 改什么 | 在哪 |
|--------|------|
| 提示消息、拒绝消息 | 配置文件里搜 `messages` / `lang` / `locale` 段落 |
| 确认/邀请/邀请确认文本 | 同上 |
| 自定义关键词的默认文案 | 自定义关键词配置 |
| 默认示例关键词（`v`、`[pos]`）| 示例配置，可以直接删或改 |

**物品材质名自动本地化这件事值得你亲自验一下**：找个基岩版客户端（或者用 [Geyser](#/guide/geyser-bedrock) + 基岩版客户端）看聊天里的物品名显示成中文还是英文。**这是判断它语言机制覆盖到哪一步的最快方式。**

> ⚠️ **以实际文件为准。** 本站不提供逐键对照的汉化文件。

## 下一步

- 聊天格式本身还没配 → [聊天系统配置](#/guide/chat-system)
- 遇到被踢的包限流问题 → [版本兼容与 ViaVersion](#/guide/version-compat)
- 想在 Discord 里同步 → [Discord 机器人](#/plugin/discordsrv)
- 跨端服先搞清楚架构 → [Velocity 组网](#/guide/velocity-network)
