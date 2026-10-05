---
id: libertybans
name: LibertyBans
description: 处罚管理 — 封禁/禁言/踢出/警告，含 IP 封禁、限时处罚、alt 小号检测、多代理同步、豁免层级和处罚模板。有测试框架的工程级实现。
category: 玩家管理
version: 1.1.4（MC 1.10.2 - 26.3）
tags: [封禁, 禁言, 处罚, 权限, 网络]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## LibertyBans 安装教程

### 1. 它是什么

LibertyBans 是**处罚管理插件**——处理封禁、禁言、踢出、警告这些事。

和其他处罚插件的区别，作者自己写得很直白：现有的处罚插件要么有 bug 和并发问题，要么闭源收费，要么两者都有，而且**没有一个像它一样有测试框架**。

这句话是它的核心竞争力：

| 特点 | 说明 |
|------|------|
| **有自动化测试** | bug 在进正式版之前就被抓到了 |
| **UUID 存储** | 所有玩家数据按 UUID 存，不按名字 |
| **SQL 设计** | UUID 和 IP 存**原始字节**而不是字符串，省空间也快 |
| **豁免层级** | 见习不能封管理员，管理员不能封服主 |
| **处罚模板** | 第一次骂人禁言 10 天，第二次 30 天，第三次永久 |
| **多代理同步** | 群组服全局处罚一致 |
| **零外部依赖下载** | 依赖自动下载并用 SHA-512 校验，校验和可复现 |

### 2. 支持哪些处罚

| 类型 | 命令 |
|------|------|
| 封禁 | `/ban` `/ipban` `/unban` `/unbanip` |
| 禁言 | `/mute` `/ipmute` `/unmute` `/unmuteip` |
| 警告 | `/warn` `/ipwarn` `/unwarn` `/unwarnip` |
| 踢出 | `/kick` `/ipkick` |

**所有类型都有限时版本**。永久和限时用**同一条命令**，加时间参数：

```
/ban Player1 30d      ← 封 30 天
/ban Player1          ← 永久封
```

这个设计很干净——不需要「/tempban」这种额外命令。

### 3. 前置条件

| 要求 | 说明 |
|------|------|
| Java | **17+** |
| 服务端 | Bukkit / Spigot / Paper / Purpur（+ Folia） |
| 代理 | BungeeCord / Waterfall / Velocity / Sponge |
| 数据库 | 内置 HyperSQL（本地文件）或 MariaDB / MySQL / PostgreSQL |

> ⚠️ **Java 17 是硬要求。** 1.20.5+ 的服务端本来就跑 Java 21，但如果你的服是 1.16 之类还在 Java 8/11 上，**LibertyBans 直接起不来**。

> ⚠️ **Velocity 上有个额外坑**：1.19+ 聊天签名机制，**Velocity 代理端的禁言需要 SignedVelocity** 才能生效。要么代理端和后端都装 SignedVelocity，要么把 LibertyBans 装在后端。

### 4. 安装

- 仓库：<https://github.com/A248/LibertyBans>
- Wiki：<https://github.com/A248/LibertyBans/wiki>

**单代理服**：装在**代理端**（推荐）。

**群组服**：装在**代理端 + 每个后端**，配置成多实例同步。

丢进 `plugins/`，重启。**开箱即用**——默认配置就能用，不需要先建数据库。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/libertybans` | 显示所有命令用法（**不带斜杠**，控制台输入） |
| `/ban <玩家> [时间] [原因]` | 封禁 |
| `/unban <玩家>` | 解封 |
| `/ipban <IP> [时间]` | IP 封禁 |
| `/unbanip <IP>` | 解封 IP |
| `/mute <玩家> [时间] [原因]` | 禁言 |
| `/unmute <玩家>` | 解禁 |
| `/warn <玩家> [时间] [原因]` | 警告 |
| `/unwarn <玩家>` | 撤销警告 |
| `/kick <玩家> [原因]` | 踢出 |
| `/banlist` | 所有封禁 |
| `/mutelist` | 所有禁言 |
| `/history <玩家>` | **该玩家的全部处罚记录** |
| `/warns <玩家>` | 该玩家的警告记录 |
| `/blame <管理组员>` | **某个管理员执行过哪些处罚** |
| `/alts <玩家>` | 疑似小号 |
| `/accounthistory` | 账号历史 |
| `/libertybans reload` | 重载大部分配置 |
| `/libertybans restart` | **完整重启插件**（`sql.yml` 等必须用这个） |
| `/libertybans debug` | 调试信息 |
| `/libertybans addon` | 管理扩展 |
| `/libertybans import` | 从其他处罚插件导入数据 |
| `/libertybans ip-records ...` | IP 记录管理 |

**`-s` 静默参数**（silent）：执行处罚但不广播。比如 `/ban -s Player1 30d  spam`。

### 6. 权限设计（1.0 起的命名方案）

LibertyBans 1.0 重做了权限命名。**它是分层的**——先有总权限，再有具体权限。

**1.0+ 的命名模式：**

```
libertybans.<类型>.do.<动作>.target.<对象>
```

| 权限 | 含义 |
|------|------|
| `libertybans.ban.do.target.uuid` | 能封禁玩家 |
| `libertybans.ban.do.target.ip` | 能封禁 IP |
| `libertybans.ban.do.target.both` | 一次处罚同时封玩家和 IP |
| `libertybans.ban.do.silent` | 能用静默参数 |
| `libertybans.ban.do.notify` | 能收到封禁通知 |
| `libertybans.ban.undo.target.uuid` | 能解封玩家 |
| `libertybans.ban.undo.target.ip` | 能解封 IP |
| `libertybans.commands` | **所有命令的前置权限** |

禁言、警告、踢出把 `ban` 换掉即可。

**限时处罚权限**（需要开启 duration 权限）：

```
libertybans.ban.dur.6d      → 最多能封 6 天
libertybans.ban.dur.perm     → 能封永久
```

**多个时长权限取最长的那个。** 这是个很聪明的设计——给见习 `dur.1d`、给正式 `dur.30d`、给主管 `dur.perm`，自动分级，不用手动配多组。

**列表类：**

| 权限 | 命令 |
|------|------|
| `libertybans.list.banlist` | `/banlist` |
| `libertybans.list.mutelist` | `/mutelist` |
| `libertybans.list.history` | `/history` |
| `libertybans.list.warns` | `/warns` |
| `libertybans.list.blame` | `/blame` |

> ⚠️ **0.8.x 和 1.0+ 的权限命名完全不同**（0.8 是 `libertybans.ban.command`、`libertybans.ban.ip` 这种）。**网上老教程全部是 0.8 的**，照抄会完全不起作用。1.1.4 用的是新命名。

### 7. 关键配置

配置文件是 `plugins/libertybans/*.yml`（多个文件），官方注释写得很细。几个重要的：

**数据库选择**

| 选项 | 适用 |
|------|------|
| 内置 HyperSQL（本地文件） | 单服，**默认，够用** |
| MariaDB / MySQL / PostgreSQL | 群组服必选 |

**连接池** —— 官方明确说可以调，性能敏感时值得优化。

**消息配置**

- 所有玩家可见的文本在这里
- 有 `censor-ip-addresses` 之类的开关（`libertybans.admin.viewips` 控制谁能看 IP）

> ⚠️ **具体可用键以你版本生成的配置文件及其注释为准**——1.x 各小版本有增删。

### 8. alt 小号检测

这是 LibertyBans 的实用功能，两种方式：

**自动**：用 IP 封禁时，**被封主号的 IP 自动禁止其他号加入**。默认开启，强度可调。

**手动**：

- `/alts <玩家>` —— 列出疑似小号
- **`/alts.autoshow`** —— 有人因疑似小号（已封/已禁言）被拦时，自动给管理组报一条

对付「封一个号开三个小号」很有效。

### 9. 常见坑

**权限发了但命令用不了**

确认给了 **`libertybans.commands`** 这个前置权限。1.0 之后所有子命令都卡这个。

**照着网上教程配权限没反应**

**那个教程是 0.8.x 的。** 1.0+ 改了命名，见上面第 6 节。

**群组服后端和代理端处罚不一致**

没配多实例同步。**群组服必须用 MySQL/MariaDB/PostgreSQL**，内置的本地文件存储**不能跨机器共享**。

**`/libertybans reload` 之后数据库设置没变**

正常。`sql.yml` 和部分设置**必须**用 `/libertybans restart` 或者直接重启服务器。官方文档明确区分了这两者。

**Velocity 上禁言没效果**

1.19+ 聊天签名的限制。需要 SignedVelocity（代理端和后端都装），或者把 LibertyBans 装到后端。

**新版本装上后控制台一片红色**

Java 版本不够（要 17+），或者从旧版升上来的配置不兼容。**升级前备份 `plugins/libertybans/`**。

**BungeeCord 上装错了位置**

单代理服**推荐装代理端**。装后端也能用，但要配多实例同步。

**要迁移别的处罚插件的数据**

有 `/libertybans import`。**先备份目标数据库**——导入是写操作，出错不好回滚。

### 10. 什么时候别用 LibertyBans

- **只有一个玩家，从来不需要处罚** —— 不用装
- **纯离线单机存档** —— 处罚系统是给多人服设计的
- **Java 版本不达标** —— 硬性要求，别硬上
- **想要图形化 Web 管理界面** —— 它是命令驱动的（社区有第三方 Web 界面，但需要额外搭建）

### 11. 补一句：它为什么值得关注

**这个插件最值得说的不是功能，是工程。**

作者用**可复现构建**（构建产物校验和可验证）和**自动化测试**来解决「处罚插件的 bug 会直接影响玩家」这个问题。处罚系统是那种「平时没人注意，出事就是大事」的功能——误封了正常玩家、封禁记录丢了，这类事故对一个服主的伤害远大于记分板显示错位。

**有测试覆盖的处罚插件和没有的，是两种东西。** 这就是它值 17 个 Java 版本要求的原因。

### 12. 关于汉化

> ⚠️ **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**
>
> 已知 LibertyBans 声明支持多种语言（含简体、繁体中文），**但当前 `1.1.4` 版本的语言文件存放路径、文件名格式和 locale 切换方式，本站没有核实到**。请以 `plugins/libertybans/` 目录下实际生成的文件和官方 Wiki 为准。

## 下一步

- 权限怎么分配和管理组分级 → [权限系统设计](#/guide/permissions-design)
- 账号安全与防外挂 → [账号安全加固](#/guide/account-security)
- 群组服怎么统一管理处罚 → [Velocity 网络](#/guide/velocity-network)
- 服务端加固 → [服务器安全加固](#/guide/security-hardening)
