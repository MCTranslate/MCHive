---
id: account-security
title: 账号安全：正版验证、白名单与登录插件
description: 服务器对外开放前必须做完的三件事 — online-mode 的取舍、白名单怎么用、离线服为什么必须配 AuthMe，以及换模式会导致玩家数据「消失」的原因。
icon: 🔐
tags: [账号, 正版, 白名单, AuthMe, 安全]
order: 11
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。`server.properties` 键名与 `/whitelist` 命令对照官方文档核对，AuthMe 命令树取自其官方自动生成的命令文档，版本信息取自官方发布说明。

## 一、三个概念先分清

新手最容易把这三件事混成一件事：

| 机制 | 解决的问题 | 谁在管 |
|------|-----------|--------|
| **正版验证**（`online-mode`） | 「你是谁」——连接时向 Mojang 验证账号真实性 | 服务端原生 |
| **白名单** | 「谁能进」——只有名单里的玩家能连 | 服务端原生 |
| **登录插件**（AuthMe） | 「离线服里怎么证明你是你」——用密码代替 Mojang 验证 | 第三方插件 |

一句话选择：

- **正版服**（`online-mode=true`）→ 有白名单就够，**不需要**登录插件
- **离线服**（`online-mode=false`）→ **必须**配登录插件，白名单只是补充
- 需要对外宣传、让陌生人也能注册进来 → 离线服 + AuthMe + 反作弊/反机器人

## 二、正版验证（online-mode）：最强的一道门

`server.properties` 里：

```properties
online-mode=true          # 默认值，保持开启
```

开启后，玩家连接时服务端会向 Mojang 的会话服务器验证身份。好处是**根本性的**：

- **无法冒用他人名字**：顶着别人 ID 连会被踢
- **身份稳定**：玩家改名后 UUID 不变，家、权限、余额都还认得出他
- **没有「猜密码」攻击面**：不存在密码，也就没有撞库、没有社工盗号

> 官方文档的表述很直接：**只有服务器不连网时才应该关掉它**。如果你的服务器在公网上，却因为「想省事」或「想让盗版玩家进来」而关掉它，就必须用第三节和第五节的办法把缺口补上。

## 三、离线模式（online-mode=false）意味着什么

关掉正版验证，等于**放弃了服务端对玩家身份的任何验证**。具体后果：

| 风险 | 说明 |
|------|------|
| **任何人可以冒名顶替** | 知道你的 ID，就能顶着你的名字进服，拿走你箱子里的东西 |
| **改名即变成另一个人** | 离线模式下服务器只能靠名字区分玩家，玩家一改名，原来的家、权限、余额就都「对不上」了 |
| **登录插件成为必需项** | 必须用密码把身份补回来，否则服务器等于没有门 |
| **机器人/刷屏攻击** | 没有账号成本，可以被脚本批量连接（这也是 AuthMe 内置 AntiBot 的原因） |

**离线服的最低配置清单**（三件套）：

1. 登录插件（AuthMe）——用密码补上身份验证
2. 白名单 或 登录插件的反机器人机制
3. 反作弊 + [CoreProtect](#/plugin/coreprotect)（离线服里「内鬼」比外挂更常见，能回滚才有救）

## 四、白名单：最省事的准入机制

**开启方式**（两种等价）：

```properties
# server.properties
white-list=true
enforce-whitelist=false    # true = 重载名单时把不在名单上的在线玩家踢出
```

或在游戏内直接执行 `/whitelist on`（会同步写回配置文件）。

**管理名单**（Java 版命令语法）：

```bash
/whitelist add <玩家名>      # 添加（玩家不需要在线）
/whitelist remove <玩家名>   # 移除（玩家不需要在线）
/whitelist list             # 查看名单
/whitelist on               # 启用白名单
/whitelist off              # 关闭白名单
/whitelist reload           # 从磁盘重新读取 whitelist.json
```

名单存在服务端根目录的 `whitelist.json` 里，直接改文件后用 `/whitelist reload` 生效。

> **时效性提醒**：较新版本的 Java 版把**白名单默认设为开启**（更早的版本默认关闭），所以「装完就开服让朋友进」可能直接被 `You are not whitelisted on this server!` 挡住。以你自己生成的 `server.properties` 里 `white-list` 的实际值为准；要临时放开就执行 `/whitelist add 玩家名`，或先 `/whitelist off`。

> **一个小陷阱**：Java 版里 **OP 在白名单开启时始终能连**，即使他不在名单上。所以别用「他能进、我进不去」来判断白名单配没配对。

## 五、登录插件：AuthMe 6.0.1

离线服里，**AuthMe** 是事实标准。**6.x 是一次大改版**，与网上大量 5.x 教程差异很大，务必注意版本。

**当前版本：6.0.1**（2026-09-03），官方仓库 [AuthMe/AuthMeReloaded](https://github.com/AuthMe/AuthMeReloaded)，Modrinth 项目名也叫 AuthMeReloaded。

**按平台分发**（必须选对 jar，装错平台的行为会不对）：

| 服务端 | 该下的包 |
|--------|----------|
| **Paper 1.21+**（本项目目标） | Paper 构建（1.21.11+ 才支持图形化登录对话框） |
| Spigot 1.20–1.21+ | 对应 Spigot 构建 |
| Spigot 1.16–1.19 | Spigot Legacy 构建 |
| Folia 1.21+ | Folia 构建 |
| Velocity / BungeeCord 代理 | 各自的代理插件（见 [群组服教程](#/guide/velocity-network)） |

> **6.0.0 的两条破坏性变更，老教程不会告诉你**：
> 1. **Spigot 1.21 / Paper / Folia 构建最低要求 Java 21**（Spigot Legacy 最低 Java 17）。本项目是 Paper 26.x + Java 25，满足要求。
> 2. **用 PacketEvents 取代了 ProtocolLib**（背包保护、tab 补全屏蔽、premium 免密登录这些功能都依赖它）。如果你按老教程去装 ProtocolLib，会发现没用——需要装 [PacketEvents](https://modrinth.com/plugin/packetevents) 2.x。

> **安全提醒**：官方在 6.0.1 的发布说明里明确写了，**Paper / Folia 离线服若启用了 pre-join 登录对话框，6.0.0 存在会话被劫持的漏洞**，并建议尽快升级。**正在用 6.0.0 的请立刻更新到 6.0.1。**

### 常用命令（官方命令树，实测存在）

**玩家端**：

```bash
/register <密码> <确认密码>   # 首次进服注册
/login <密码>                # 之后每次进服登录
/logout                     # 登出
/changepassword <旧> <新>     # 改密码
/unregister <密码>           # 注销账号
/email add|change|recover    # 邮箱绑定与找回
/totp add                    # 开启两步验证（TOTP）
/captcha <验证码>             # 反机器人验证
```

**管理端**（`/authme`，权限节点形如 `authme.admin.*`）：

```bash
/authme forcelogin <玩家>      # 强制让某玩家登录（玩家忘密码时的救急手段）
/authme password <玩家> <新密码>  # 直接改密码
/authme unregister <玩家>      # 注销账号
/authme accounts <玩家>        # 按名字或 IP 查该玩家的所有账号（查小号用）
/authme getip <玩家>           # 查在线玩家 IP
/authme lastlogin <玩家>       # 查最后登录时间
/authme backup                # 备份已注册用户数据 ← 定期跑，很重要
/authme switchantibot <模式>   # 切换反机器人模式（被刷屏时用）
/authme purge <天数>           # 清理 N 天前的旧数据
/authme reload                # 重载配置
```

### 一个容易被忽略的能力：正版免密

AuthMe 支持**正版免密登录**：有正版账号的玩家可以完全跳过输密码，AuthMe 会与 Mojang 做一次加密握手来验证身份——**而不是只比对用户名**（只比名字是能被伪造的）。相关命令是玩家用 `/premium` 开启、`/freemium` 关闭。

这对「离线服但部分玩家是正版」的混合服非常有用：正版玩家体验不受影响，离线玩家仍需密码。

> 另外，AuthMe 的消息会**跟随玩家客户端语言**显示，中文客户端自动看到中文，不需要额外汉化（机制说明见 [插件汉化与本地化完全指南](#/guide/plugin-localization)）。

## 六、为什么「换了模式，玩家数据会消失」

这是迁移和改配置时最容易造成灾难的一点，务必先理解再动手：

| 场景 | 会发生什么 |
|------|-----------|
| 离线服运行一段时间后，改成正版验证 | 所有玩家的**身份标识都变了**。原本靠名字生成的身份，会被换成 Mojang 账号的身份 → 原来的家、权限、经济余额、领地全部「找不到主人」，看起来就像数据丢了 |
| 正版服改成离线服 | 同理反方向崩坏；且还会引入冒名风险 |
| 离线服里玩家改名 | 该玩家会变成「新玩家」，旧数据留在旧名字下 |

**所以：**

- **在开服第一天就定好模式**，别等有几十个玩家在线记录了再改
- 如果**必须**切换，请提前把玩家数据按名字/身份做好对照表，准备好逐个迁移的方案，并**先完整备份**（`plugins/` 下各插件的数据目录 + 世界存档）
- 迁移流程与检查清单见 [服务器迁移与升级](#/guide/server-migration)

## 七、按服务器类型推荐组合

| 服务器类型 | online-mode | 白名单 | AuthMe | 说明 |
|-----------|-------------|--------|--------|------|
| 自己和小伙伴玩（都是正版） | `true` | 开 | 不需要 | 最省心，强烈推荐 |
| 小圈子，有人没正版 | `false` | 开 | **必需** | 白名单先挡一层，AuthMe 再补身份 |
| 公益服 / 对外开放 | `false` | 关（或不拦截） | **必需** | 重点配 AuthMe 的 AntiBot + 反作弊 + CoreProtect |
| 生电服 / 竞技服 | `true` | 开 | 不需要 | 公平性优先，坚决不开离线 |

## 八、常见坑

| 症状 | 原因 |
|------|------|
| `You are not whitelisted on this server!` | 白名单开着但玩家不在名单（**26.3 起默认开启**，注意） |
| 玩家能冒用别人名字进来 | 离线服没配登录插件，或 AuthMe 没启用 |
| 改了 `online-mode` 后「数据全丢了」 | 见第六节——身份变了，不是数据丢了 |
| AuthMe 装了不生效 | jar 装错平台（Paper 服装了 Spigot Legacy 包）；或版本太老 |
| 按老教程装 ProtocolLib 没用 | 6.0.0 起改用 PacketEvents 2.x |
| AuthMe 5.x 的配置项在新版找不到 | 6.x 改过配置结构（如登录/注册超时被拆成 `loginTimeout` / `registerTimeout`），以你 jar 内生成的配置与官方 `docs/config.md` 为准 |
| 装到了名字很像的 fork | 官方是 Modrinth 上的 `AuthMeReloaded`；另有一个 2024 年后未更新的同名 fork，注意别装错 |
| 忘记管理员密码 | 用 `/authme unregister <自己>` 注销后重新注册，或直接改数据库 |

> **离线自动化提醒**：AuthMe 的注册数据默认存在插件目录下（也可切数据库，见 [数据库部署与插件接入](#/guide/database-setup)）。**定期执行 `/authme backup` 或备份整个 `plugins/AuthMe/` 目录**——玩家账号数据丢了，比世界存档丢了更难补救。

## 下一步

- 还没让外网连上？先看 [让外网连上你的服务器](#/guide/port-forwarding)
- 对外开放后的整体加固清单：[安全加固：从裸奔到站稳](#/guide/security-hardening)
- 要给玩家分配权限组：[权限系统设计：别让权限越用越乱](#/guide/permissions-design)
