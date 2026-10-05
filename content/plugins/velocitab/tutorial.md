---
id: velocitab
name: Velocitab
description: Velocity 代理端的 TAB 列表插件 — 在代理层统一管理 TAB 列表的排序、格式和分组，不需要后端配合。装在 Velocity 上，不是 Paper 后端。
category: 聊天美化
version: Velocitab（MC 3.2 - 3.3）
tags: [Velocity, 代理端, TAB, 玩家列表, 排序, 格式化]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## Velocitab 安装教程

### 1. ⚠️ 先看这个版本区间：它大概率不准

本页 `version` 字段写的是 **`Velocitab（MC 3.2 - 3.3）`**。

**这不是一个 MC 版本区间。** 3.2 / 3.3 明显是**加载器（代理端）的版本号**——Velocity 3.2 / 3.3 被混进了 MC 支持区间的字段里。这是注册表元数据的问题，不是插件本身的问题。

**怎么区分的**：MC 版本号长这样 `1.8` / `1.20.4` / `1.21.4`，带 `1.` 开头。`3.2` / `3.3` 不是 MC 版本。

**所以准确的 MC 支持区间请以官方页面为准。** 本站不给一个编造的区间。查的时候看这两处：

- Modrinth 页面的 Compatibility 区域
- 插件 jar 里 `plugin.yml` 的 `api-version`

**同时也要注意另一个坑**：这个字段混进去的 Velocity 版本号，**反过来可能也是有用的信息**——它暗示这个插件测试时用的代理端是 Velocity 3.2 / 3.3。**代理端版本和插件版本是要对上的**，见第 5 节。

### 2. 它是什么

**Velocitab 是跑在 Velocity 代理端的 TAB 列表（Tab 列表）插件。**

TAB 列表就是按 Tab 键弹出的那个玩家名单。它管三件事：

| 能力 | 说明 |
|------|------|
| **排序** | 让玩家按前缀、所在子服、权重排序，而不是按名字字母排 |
| **格式** | 玩家名前后加前缀/后缀，RGB 颜色，支持 MiniMessage / MineDown / 旧式格式 |
| **分组** | 不同子服群组显示不同的 TAB 列表（比如生存服和 lobbies 服用不同 header/footer） |

**它的技术亮点是「不需要后端插件配合」。** 常规做法是代理端一个插件、后端再装一个桥接插件，两边同步。Velocitab 用 scoreboard team 数据包在代理层直接完成排序，**后端什么都不用装**。

**这就是它和站内 [TAB](#/plugin/tab) 插件最大的区别** —— 见第 3 节。

### 3. 装在哪个平台（最容易搞错的一节）

**Velocitab 装在 Velocity 代理端的 `plugins/` 目录。**

```
Velocity 代理端
└── plugins/
    ├── Velocitab.jar     ← 放这里
    ├── LuckPerms.jar     ← 强烈建议一起装（代理端 + 各后端都要）
    └── PAPIProxyBridge.jar  ← 可选，要用 PAPI 变量时

Paper 子服 × N
└── plugins/
    └── （Velocitab 不需要装在这里）
```

**为什么强调这个**：Tab 列表是**全服共享的一份数据**——玩家在群组服里看到的是所有子服的人。数据要汇总，就必须在能看见所有连接的地方处理，也就是代理端。**后端各自为政，天然拼不出一份完整名单。**

> ⚠️ **别把它丢进 Paper 子服的 `plugins/`。** 那是 Bukkit 体系，Velocity 插件在那边加载不了。

### 4. 和 TAB 插件怎么选

站内也收录了 [TAB](#/plugin/tab)，功能和 Velocitab 有重叠。区别：

| | **Velocitab** | **TAB** |
|---|---|---|
| 平台 | **Velocity 专用** | 多平台（Paper / Velocity / BungeeCord） |
| 记分板 / BossBar | ❌ 不做 | ✅ 做（Tab / 侧边栏 / BossBar 三合一） |
| 排序 | ✅ 用 scoreboard team 数据包实现 | ✅ |
| 后端是否要装 | **不用** | Velocity 方案下后端要装 TAB-Bridge 拿 PAPI 支持 |
| 适合 | 群组服，只要好看的玩家列表 | 还要侧边栏、BossBar |

**结论很简单：只要 TAB 列表（排序 + 前缀）→ Velocitab；还要侧边栏记分板和 BossBar → [TAB](#/plugin/tab)。**

**⚠️ 两者不要同时管 TAB 列表。** 都在改同一份数据，结果是配置互相覆盖、显示错乱。**选一个。**

### 5. 安装

1. 下载对应你代理端版本的 jar
2. 放进 **Velocity 代理端**的 `plugins/`
3. 启动 Velocity，生成 `plugins/velocitab/config.yml`
4. 改配置，**重启代理端**

**⚠️ 版本要对上。** 本页 version 字段里混进来的 `3.2 - 3.3` 提示了它的测试环境。**下载时挑和你跑的 Velocity 版本对得上的构建**——Velocity 插件的 API 变动不小，装错版本可能直接加载失败。

**LuckPerms：强烈建议在代理端装一份。** 不装的话前缀/后缀和基于权限组的排序都拿不到，Velocitab 最核心的能力就废了一半。**注意 LuckPerms 要代理端和每个后端都装**（或者用代理端的 API 方案，见 [Velocity 网络](#/guide/velocity-network)）。

**可选依赖：**

| 插件 | 用途 |
|------|------|
| PAPIProxyBridge | 在代理端用 PlaceholderAPI 的 `%xxx%` 变量（后端也得装） |
| MiniPlaceholders | 用 MiniMessage 变量 |

### 6. 内置占位符

Velocitab 自带一批占位符，可以直接用在 header / footer / 玩家名格式里：

| 占位符 | 含义 |
|--------|------|
| `%players_online%` | 代理端在线人数 |
| `%max_players_online%` | 代理端人数上限 |
| `%local_players_online%` | 玩家当前所在子服的在线人数 |
| `%server%` | 玩家所在的子服名 |
| `%username%` | 玩家名 |
| `%ping%` | 玩家延迟（ms） |
| `%current_date%` / `%current_time%` | 服务器当前日期 / 时间 |
| `%prefix%` / `%suffix%` | 来自 LuckPerms 的前缀 / 后缀 |
| `%role%` | 玩家的主权限组 |

> ⚠️ **具体的占位符列表和格式以你版本的官方文档为准** —— 插件在演进，占位符会增删。本页列的是官方文档中列出的那一批。

### 7. 常用命令

| 命令 | 权限 | 说明 |
|------|------|------|
| `/velocitab reload` | `velocitab.command.reload` | 重载配置 |
| `/velocitab update` | `velocitab.command.update` | 检查更新 |

> ⚠️ 命令和权限节点**以你版本的实际输出为准**。

**官方对 reload 的建议值得注意：配置有较大改动时，重启代理端比 reload 可靠。** 涉及多服务器分组、排序规则这类改动，直接重启更稳。

### 8. 常见坑

**装完不生效**

按顺序查：**① 装错地方了吗**（应该在 Velocity 代理端，不在 Paper 后端）→ **② Velocity 版本对不上**（见第 5 节）→ **③ 改了 `config.yml` 没重启代理端** → **④ 和别的插件冲突**（代理端和后端是否都有别的东西在管 TAB 列表）。

**前缀不显示 / 排序不生效**

**九成是没在代理端装 LuckPerms。** Velocitab 靠 LuckPerms 拿前缀和权限组权重。**代理端和后端都要装 LuckPerms**，只装后端是不够的。

**玩家在自己子服的 TAB 列表是旧的**

检查两件事：后端有没有别的插件也在管 TAB 列表；以及该子服是否在 Velocitab 的「不接管这些服务器」配置里。

**和 TAB 插件显示打架**

见第 3 节。**二选一。**

**大量玩家时列表刷新有压力**

TAB 列表数据是要在玩家之间同步的。**群组服几千人的时候这类插件的开销是真实的**——排序规则越复杂、变量越多，刷新越频繁。人多的大组建议先在测试服量一下。

### 9. 关于汉化

**本站未核实 Velocitab 的官方中文语言文件机制。** 若要汉化需自行确认。

引导式排查方法：

1. 进 Velocity 的 `plugins/velocitab/`，找语言相关文件（常见形态是 `lang/`、`translations/`、`messages_xx.yml`）
2. 搜配置文件里有没有 `language`、`lang`、`locale`、`messages` 关键词
3. **注意 Velocitab 的很多「文本」其实不是语言文件里的句子，而是配置里的格式串** —— header、footer、玩家名格式这些。**这部分直接改 `config.yml` 就行，不需要语言文件**

**第 3 点是这个插件汉化的实际路径**：你想汉化的多半是 header/footer 模板，直接在 `config.yml` 里写中文（MiniMessage 格式下支持 RGB）比找语言文件更直接。**唯一真正需要语言文件的是命令反馈类文本**（reload 成功、更新提示之类），那部分量也很小。

想看全站各插件的汉化情况，见 [插件汉化与本地化完全指南](#/guide/plugin-localization)。

### 10. 什么时候别用它

- **单服** —— 代理端都不存在，装不了。侧边栏需求用 [TAB](#/plugin/tab)
- **用 BungeeCord / Waterfall 而非 Velocity** —— 平台不对
- **还要侧边栏记分板和 BossBar** —— 用 [TAB](#/plugin/tab)，它一个插件全包
- **不打算装 LuckPerms** —— Velocitab 一半的能力用不了，不如不用
- **几千人的大组服** —— 先在测试服量一下开销

## 下一步

- 代理端怎么搭 → [用 Velocity 搭建群组服](#/guide/velocity-network)
- 侧边栏 / BossBar 怎么做 → [TAB 列表与记分板](#/guide/tab-scoreboard)
- 前缀怎么配 → [权限系统设计](#/guide/permissions-design)
