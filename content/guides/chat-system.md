---
id: chat-system
title: 聊天系统：格式、私聊、广播与 Discord 互通
description: 从「聊天前缀怎么加」到「怎么让服里消息同步到 Discord」— 讲清 EssentialsX 本体、EssentialsXChat 模块、原版自带的防刷屏开关各自管哪一段，附真实配置键与命令。
icon: 💬
tags: [聊天, 格式, 广播, Discord, EssentialsX]
order: 22
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。EssentialsX 相关配置键与命令对照官方 jar 核实，`server.properties` 键名对照官方文档核对。

## 一、先分清：聊天能力分三层，装的东西不一样

新手常以为「装了 EssentialsX 就能配聊天格式」，结果改了半天没反应。因为这三件事由**不同的东西**负责：

| 能力 | 谁负责 | 不装会怎样 |
|------|--------|-----------|
| **基础聊天、私聊、回复、禁言** | EssentialsX **本体** | 这些功能直接就没有 |
| **聊天格式（前缀/颜色/分组模板）** | **EssentialsXChat**（独立模块，要另外下） | 改 `chat.format` **完全不生效** |
| **进出服消息、跨服/Discord 互通** | EssentialsX 配置 + 专门插件（如 DiscordSRV） | 用不上这些功能 |

> 最容易踩的就是第二条：**EssentialsXChat 是单独的 jar**。Modrinth 上有独立项目 `essentialsx-chat-module`（与 EssentialsX 本体同日更新），必须把它也放进 `plugins/`，聊天格式化才会工作。

## 二、时效性提醒：防刷屏不用装插件了

以前防刷屏要装额外插件，现在**原版 `server.properties` 自带了两个阈值**：

```properties
chat-spam-threshold-seconds=10        # 默认 10：聊天消息的最小间隔（秒）
command-spam-threshold-seconds=10     # 默认 10：命令的最小间隔（秒）
```

> 这是当前 Java 版 `server.properties` 的默认键之一。想更严格就把数字调大；**别再为「防止玩家刷屏」去装一堆老插件了**。

## 三、配置聊天格式（需要 EssentialsXChat）

配置文件在 `plugins/Essentials/config.yml`，相关键都在 `chat:` 段下（**注意层级，别写成顶级键**）：

```yaml
chat:
  # 本地聊天半径（格）。0 = 全局聊天
  radius: 0

  # 统一的聊天格式模板
  format: '<{DISPLAYNAME}> {MESSAGE}'

  # 按权限组分别设置格式（留空则都用上面的 format）
  group-formats:
    #default: '{WORLDNAME} {DISPLAYNAME}&7:&r {MESSAGE}'
    #admins: '&c[{GROUP}]&r {DISPLAYNAME}&7:&c {MESSAGE}'
```

**可用占位符**（取自官方配置注释）：

| 占位符 | 含义 |
|--------|------|
| `{MESSAGE}` | 消息内容 |
| `{USERNAME}` | 发送者的用户名 |
| `{DISPLAYNAME}` | 发送者的显示名（含昵称/前缀的效果） |
| `{PREFIX}` / `{SUFFIX}` | 权限插件给的前缀 / 后缀 |
| `{GROUP}` | 权限组名 |
| `{WORLDNAME}` | 所在世界名 |

> **一个常见错误**：同时写 `{PREFIX}`、`{SUFFIX}` 和 `{DISPLAYNAME}`——官方注释明确提醒，`{DISPLAYNAME}` 默认已包含前缀与后缀，**一起用会出现「双重前缀」**。二选一即可。

**进阶**：EssentialsX 2.21.0 起消息支持 **MiniMessage** 语法（渐变、悬停、点击执行等），并且可以用 `config.yml` 里 `message-colors` 段定义的 `<primary>` / `<secondary>` 标签统一配色。细节见 [插件汉化与本地化完全指南](#/guide/plugin-localization) 里关于 EssentialsX 消息格式的部分。

### 一份可以直接抄的配置

把下面这段按你的口味改，放进 `plugins/Essentials/config.yml`（**所有键都已核对存在**）：

```yaml
chat:
  radius: 0                                   # 0 = 全服聊天
  format: '<{DISPLAYNAME}> {MESSAGE}'          # 普通玩家的统一格式
  group-formats:
    vip: '&a[VIP] {DISPLAYNAME}&7: &f{MESSAGE}'
    staff: '&c[管理] {DISPLAYNAME}&7: &f{MESSAGE}'

# 私聊回复：最后一个私聊的人自动成为 /r 的目标
last-message-reply-recipient: true

# 进出服消息（默认 "none" 表示不显示）
custom-join-message: "&7[&a+&7] &e{DISPLAYNAME} &7加入了服务器"
custom-quit-message: "&7[&c-&7] &e{DISPLAYNAME} &7离开了服务器"

# 昵称
nickname-prefix: '~'
change-displayname: true
```

> 格式里的 `&` 颜色代码是**聊天格式这一层**的写法；LuckPerms 的前缀也是 `&`。而**消息内容**（如系统提示文本）走的是 MiniMessage 体系。两套并存但用途不同，改哪一层就按哪一层写。

## 四、日常聊天功能（EssentialsX 本体就有）

| 命令 | 作用 |
|------|------|
| `/msg <玩家> <内容>` | 私聊 |
| `/r <内容>` | 快速回复上一个私聊对象 |
| `/reply` | 同上 |
| `/broadcast <内容>` | 全服广播（**这是命令，不是配置项**） |
| `/mute <玩家> [时长]` | 禁言 |
| `/nick <昵称>` | 改显示昵称（受 `nickname-prefix`、`max-nick-length` 限制） |

**几个值得改的配置**（键名均为真实存在）：

```yaml
# 私聊回复：自动把最后一个私聊对象设为 /r 的目标
last-message-reply-recipient: true      # 默认 true

# 被禁言时禁止执行哪些命令（列在下方列表里）
mute-commands:
#- msg
#- r

# 社交间谍（管理员偷看别人的消息）：监听哪些命令
socialspy-commands:
#- msg
#- r

# 进出服消息
custom-join-message: "none"             # 默认 "none"，改成自己的欢迎语即可
custom-quit-message: "none"

# 昵称相关
nickname-prefix: '~'                    # 昵称前缀，用于区分昵称与真名
change-displayname: true                # 是否同步到头顶与聊天显示名
```

> **权限提示**：`/socialspy` 需要对应权限；`essentials.silentjoin` 权限可以静默进出服（`allow-silent-join-quit` 控制）。给权限时参考 [权限系统设计](#/guide/permissions-design)。

## 五、让玩家看到「谁是谁」：前缀与分组

聊天格式里最常用的就是权限组前缀。它来自权限插件（本站用 LuckPerms）：

```
/lp group vip meta setprefix 100 "&a[VIP] "
```

- 数字 `100` 是**优先级**：同时属于多组时，优先级高的前缀生效（详见 [权限系统设计](#/guide/permissions-design)）
- 前缀里可以用 `&` 颜色代码（LuckPerms 侧）或 MiniMessage（EssentialsX 侧，**两套不是同一个体系**，别混着理解）
- 想在聊天里显示组名，用 `{GROUP}` 占位符

## 六、让服里消息同步到 Discord

**DiscordSRV** 是这一块的常用开源方案：Modrinth 项目 `discordsrv`，最近更新 2026-04-24，项目声明支持 **MC 1.7.10 – 26.3**，平台含 `bukkit`/`paper`/`purpur`/`spigot`/`folia`，源码在 `github.com/DiscordSRV/DiscordSRV`。

**它能做什么**：

- 游戏内聊天 ↔ Discord 频道**双向转发**
- 把服务器的进服/退服、死亡、成就等事件推到 Discord
- Discord 里执行命令（需要按官方文档配置，默认通常关闭）

**落地要点**：

1. 在 Discord 开发者后台建一个应用/机器人，拿到 **Bot Token**
2. 把 DiscordSRV 的 jar 放进 `plugins/`，启动一次生成配置文件
3. 在配置里填入 Bot Token 与要同步的**频道 ID**
4. 重启（或按插件自身方式重载）后验证：游戏里发一句话，看 Discord 里是否出现

> **安全提醒**：Discord 互通意味着**服内对话会离开服务器**。请在服务器规则里告知玩家，并对 Discord 侧的频道权限做好管控（别把频道设成公开可见）。相关安全思路见 [安全加固：从裸奔到站稳](#/guide/security-hardening)。

## 七、常见坑

| 症状 | 原因 |
|------|------|
| 改了 `chat.format` 完全没反应 | 没装 **EssentialsXChat**（它是独立模块） |
| 改了没反应，且插件已装 | 键写成了顶级键，正确路径是 `chat.format` / `chat.group-formats` |
| 出现双重前缀 | 同时用了 `{DISPLAYNAME}` 与 `{PREFIX}`/`{SUFFIX}` |
| 前缀不显示 | LuckPerms 没设前缀 / 优先级太低被别的组盖掉 |
| 颜色代码显示成乱码 | 配置里用了 MiniMessage 的 `<...>` 写法，但那条消息走的是 `&` 体系（两套别混用） |
| `/r` 回复不到人 | `last-message-reply-recipient` 被关掉了 |
| 禁言了玩家还能发消息 | 需要确认 `mute-commands` 与实际禁言机制；被禁言者可能用了别的聊天渠道 |
| Discord 收不到消息 | Bot Token 错、频道 ID 错、机器人没被邀请进服务器、或没给消息读取权限 |
| 广播命令没权限 | 需要对应权限节点，按 [权限系统设计](#/guide/permissions-design) 分配 |
| 玩家刷屏拦不住 | 用 `server.properties` 的 `chat-spam-threshold-seconds`（见第二节） |

## 下一步

- 要给不同玩家不同前缀与权限：[权限系统设计：别让权限越用越乱](#/guide/permissions-design)
- 想在记分板 / Tab 显示聊天里的那些变量：[记分板与 Tab 列表实战](#/guide/tab-scoreboard)
- 聊天插件装多了互相打架：[避坑与排错速查](#/guide/faq)
- 装完一堆插件后要清理：[插件组合：按服务器类型直接抄](#/guide/plugin-combos)
