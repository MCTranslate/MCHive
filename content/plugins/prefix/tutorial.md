---
id: prefix
name: PrefiX
description: LuckPerms 的前缀管理器 — 玩家自己就能在聊天框里选颜色、改前缀/后缀，支持 RGB 十六进制和渐变，不用管理员一个个发权限。
category: 聊天美化
version: PrefiX（MC 1.8 - 26.2）
tags: [LuckPerms, 前缀, 标签, 名字颜色, RGB]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## ⚠️ 硬依赖：LuckPerms v5

**PrefiX 只能配 LuckPerms。** 它的 wiki 原话：

> Please be aware it requires **LuckPerms v5** to work.

它**只使用 LuckPerms 来处理和保存数据**。这不是「可选集成」，是唯一路径：

```
没有 LuckPerms  →  PrefiX 完全无法工作
有 LuckPerms v4 →  不行，要 v5
有 LuckPerms v5 →  ✅
```

**为什么依赖 LuckPerms：** 前缀本质上是「给玩家附加一个元数据」，LuckPerms 的 meta 数据模型正好干这个。PrefiX 不自己存数据，全靠 LuckPerms。

**安装顺序**：LuckPerms → 重启 → PrefiX → 重启。

## 1. 它解决什么问题

传统给玩家改前缀的流程：

```
1. 管理员在后台
2. /lp user Steve meta setprefix 50 "&a[管理员] "
3. 玩家 Steve 现在有前缀了
```

问题在于：**玩家想换个颜色、想换个样式，你得再发一次权限。** 一百个玩家就是一百次操作。

PrefiX 把流程反过来了：

```
1. 给玩家一个「可以改前缀」的权限
2. 玩家进服敲 /prefix
3. 一个可点击的颜色/格式列表弹出来
4. 玩家自己点，颜色实时预览
5. 满意了就用
```

**核心价值是「玩家自助」+「权限控制可选样式」。**

## 2. 第二个必须知道的限制：它不管显示

PrefiX 的 wiki 里专门有一段警告，值得原文引用：

> Do you want to display custom prefixes... **in your chat?** → You need a chat formatting plugin.
> **in the tab list?** → You need a tab plugin.
> **somewhere else?** → You need a specific plugin for that.

**意思是：** 聊天框要另装**聊天格式化插件**（Carbon / EssentialsX / ChatControl…），Tab 列表要另装 **TAB 之类的插件**，头顶名要另装对应插件。

**只装 PrefiX 的效果是：数据存进 LuckPerms 了，但你看不到任何变化。**

这是最容易漏掉的一环。装之前先想清楚你的前缀要显示在哪儿，然后把那个显示插件一起准备好。

## 3. 功能一览

| 功能 | 说明 |
|------|------|
| **玩家自助改前缀** | `/prefix` 交互式列表 |
| **颜色独立控制** | **前缀、名字、括号、后缀的颜色分开设置** |
| **每种颜色独立权限** | 想让玩家用金色，就给他金色的权限 |
| **后缀** | `/suffix` 单独设置 |
| **模板** | 预定义的前缀模板，玩家从中挑 |
| **RGB 十六进制 / 渐变** | 支持 `#RRGGBB` 和渐变色 |
| **屏蔽词 / 白名单字符** | 限制玩家能输入什么，防止刷屏和伪装 |
| **管理员改他人前缀** | staff 能直接改别人 |
| **前缀前后装饰符** | 可配置比如 `[` `]` |
| **DeluxeMenus 集成** | **在菜单里让玩家选预设前缀——确保只有管理员定的样式能用** |
| **PAPI / LuckPerms 上下文** | 前缀里能用占位符；尊重 context |
| **跨服（BungeeCord）** | 支持 |

**「颜色分开设置」这条值得注意。** 传统做法是整个前缀一个颜色。PrefiX 能让前缀是 A 色、名字是 B 色、括号是 C 色、后缀是 D 色——这在设计上更有层次。前缀里有空格的话用双引号包裹。

## 4. 安装

- SpigotMC：<https://www.spigotmc.org/resources/prefix.70359/>
- 文档：<https://gitlab.com/martijnpu/prefix/-/wikis/home>

丢进 `plugins/`，重启。**开箱即用**——作者说只要 LuckPerms v5 在就行。

> ⚠️ **平台版本要选对。** 它支持 Spigot / Paper / Folia，以及 BungeeCord。装了 Folia 版就别在纯 Spigot 上用。

## 5. 命令

| 命令 | 说明 |
|------|------|
| `/prefix` | 主命令 |
| `/prefix help` | 帮助菜单 |
| `/prefix reload` | 重载配置 |
| `/prefix version` | 插件信息 |
| `/prefix list` | 列出所有可用颜色和格式 |
| `/prefix reset` | 重置为默认 |
| `/prefix <内容>` | 修改自己的前缀 |
| `/prefix color` / `name` / `bracket` | 分别改前缀 / 名字 / 括号颜色 |
| `/suffix` / `suffix color` | 改后缀 / 后缀颜色 |
| `/suffix list` / `reset` | 列出可用颜色格式 / 重置后缀 |
| `/prefix template` / `list` / `reset` | 使用 / 列出 / 重置预设模板 |

**标 `*` 的命令可以在后面加玩家名，代别人执行**（需要 `prefix.other` 权限）。

## 6. 权限设计

| 权限 | 作用 |
|------|------|
| `prefix.*` | 全部命令 |
| `prefix.change` | 改前缀 |
| `prefix.char` | 允许用 `&` 多色前缀 |
| `prefix.blacklist` | 豁免屏蔽词限制 |
| `prefix.other` | 改别人的前缀/颜色 |
| `prefix.admin` | 接收更新提醒 + 重载配置 |
| `prefix.color` | 前缀和名字用全部颜色 |
| `prefix.color.name` | 名字用全部颜色 |
| `prefix.color.prefix` | 前缀用全部颜色 |
| `suffix.change` | 改后缀 |
| `suffix.char` | 后缀用 `&` 多色 |
| `suffix.remove` | 移除后缀 |
| `suffix.color` | 后缀用全部颜色 |

### 推荐的权限方案

| 角色 | 分配 |
|------|------|
| **普通玩家** | `prefix.change` `prefix.color.prefix` + 你指定的几种颜色权限 |
| **VIP** | 上面 + 更多颜色权限 |
| **管理员** | `prefix.*` `prefix.other` |

> 💡 **「每种颜色独立权限」是它的精髓。** 你想做成「付费 VIP 才能用金色」，只需给 VIP 金色的权限节点，不给就不显示。**不需要写任何配置列表。**

## 7. 关键配置方向

配置文件在 `plugins/PrefiX/`。**具体键名以你手上版本的官方配置注释为准**，这里说功能方向：

| 想做的事 | 配置方向 |
|---------|---------|
| 玩家能自定义前缀文本 | 相关的自定义 / 允许字符配置 |
| **限制玩家能输入什么** | 屏蔽词 + 字符白名单 |
| **改前缀前后显示的符号** | 装饰符配置 |
| **管理自定义消息文案** | 消息 / 语言配置（它明确支持自定义消息或其他语言） |
| 关闭 bStats | 配置里加 `bstats: false` |

### 安全相关的两个配置很重要

| 配置 | 为什么重要 |
|------|-----------|
| **屏蔽词（blacklist）** | **防止玩家把前缀设成冒充管理员的样子。** 比如 `[管理员]`，欺骗其他玩家 |
| **字符白名单（whitelist）** | 限制玩家只能输入颜色代码和字母数字，防止刷屏、乱码、恶意格式 |

> 🔥 **屏蔽词一定要配。** 「玩家可自定义前缀」这个功能最大的风险就是冒充。哪怕只有付费玩家有这个权限，也要防止他们设成 `[Admin]`。

## 8. 常见坑

| 症状 | 原因 / 处理 |
|------|------|
| **装了完全没反应** | ① LuckPerms 装了吗，v5 还是 v4？② LuckPerms 里能查到玩家数据吗 ③ 你给权限了吗（连 `prefix.change` 都没有的话 `/prefix` 什么都做不了） |
| **前缀改了但聊天框看不到** | **最常见的问题。** 见第 2 节——PrefiX 不负责显示，需要聊天格式化插件 |
| **Tab 列表看不到** | 同上，需要 [TAB](#/plugin/tab) 之类的插件 |
| **玩家说自己不能改前缀** | 查他有没有 `prefix.change`。`prefix.*` 是聚合节点，判断要看具体节点 |
| **玩家用不了某个颜色** | **每种颜色有独立权限**，他没有就是用不了。这不是 bug |
| **DeluxeMenus 里怎么用** | 它支持在菜单里让玩家选预设前缀，**比自由输入安全得多**（只有你预定义的样式能被选中）。集成方式看官方 wiki |
| **跨服不一致** | BungeeCord 支持，但**所有后端要装同一版本**、**共享同一个 LuckPerms 数据库** |

## 9. 缺点和取舍

| 缺点 | 说明 |
|------|------|
| **不负责显示** | **最大的坑。** 必须配一个聊天格式化插件才能看到效果 |
| **强依赖 LuckPerms v5** | v4 完全不行，没有降级方案 |
| **需要权限系统支撑** | 每个颜色一个节点，玩家多了权限管理变复杂 |
| **玩家自由输入 = 有冒充风险** | 屏蔽词和白名单必须配 |
| **插件更新偏慢** | 停在 1.8-1.21 区间，新版 MC 跟进不快 |
| **和 MythicPrefixes / UserPrefix 功能重叠** | **同类插件只能选一个**，见下 |

### 和本站其他前缀插件的关系

| 插件 | 定位 |
|------|------|
| **PrefiX** | LuckPerms 标签管理器，玩家自助改颜色 |
| **MythicPrefixes** | 更重的称号/前缀系统 |
| **UserPrefix** | 前缀管理 |

**这三个不要同时装。** 它们都会往 LuckPerms 的 meta 里写前缀，互相覆盖，玩家改一次就被另一个覆盖回来。

## 10. 关于汉化

> ⚠️ **本站未核实到 PrefiX 的官方中文语言文件机制（具体路径与文件名）。**

但有一个明确信息：**它的功能列表里有「Define your own custom messages (Or other languages)」** ——也就是说它明确支持自定义消息文案。

想汉化：

1. 打开 `plugins/PrefiX/` 看配置文件
2. 找**消息 / messages / lang** 相关的段落
3. 直接写中文

**具体配置键名以你手上版本的官方配置文件注释为准。**

另外注意：玩家**自己输入的前缀**当然可以随便写中文，这不受语言文件限制。

## 下一步

- 聊天显示怎么配 → [聊天系统设计](#/guide/chat-system)
- Tab 列表美化 → [TAB](#/plugin/tab)
- Tab 计分板怎么调 → [TAB 计分板](#/guide/tab-scoreboard)
- LuckPerms 怎么配 → [权限系统设计](#/guide/permissions-design)
- 全站汉化机制 → [插件汉化与本地化完全指南](#/guide/plugin-localization)