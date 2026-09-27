---
id: velocity-network
title: 用 Velocity 搭建群组服（一个入口 · 多台子服）
description: 当「主城 + 生存 + 小游戏」需要各自独立、玩家用 /server 互相往返时才值得上代理。手把手从 Velocity 4.2.0 到 Paper 26.3 子服配对，附真实配置键与报错速查。
icon: 🔗
tags: [群组服, 代理, Velocity, 跨服, 进阶]
order: 12
---

# 用 Velocity 搭建群组服（一个入口 · 多台子服）

> 本教程更新于 2026 年 9 月，适用 **Velocity 4.2.0** 与 **Paper 26.x**（MC 26.3 / Java 25）。
>
> ⚠️ **先纠正一个网上还在流传的坑**：PaperMC 的**旧下载 / 元数据接口 `https://api.papermc.io/v2/...` 已被官方停用（sunset）**。现在访问它只会返回：
>
> ```json
> {"ok":false,"error":"sunset","message":"This API version has been sunset and is no longer available. To continue using the service, please upgrade to a supported API version."}
> ```
>
> 旧接口的下载直链会返回 **HTTP 410 Gone**。**新接口是 `https://fill.papermc.io/v3/...`**。很多教程还在贴 v2 链接，照着做必然下载失败——认识这一点，你就已经比 90% 的教程领先了。

单服玩腻了，想搞「主城 + 生存 + 小游戏」三台独立世界，还想让玩家自己用 `/server` 来回跳？这就是**群组服（代理服）**要解决的问题。

---

## 第一步：先判断你要不要上代理

**群组服不是「更高级的单服」，它是为了解决一个特定问题：多个独立服务端之间的无缝跳转。** 如果单台 Paper 加 Multiverse 就能满足你，硬上代理只会凭空多出一台机器、多一堆配置、多一层排查难度。

| 你的需求 | 用单服 + [Multiverse](#/plugin/multiverse-core) | 上代理（Velocity） |
|----------|----------------------|--------------------|
| 主城 / 资源世界 / 下界 | ✅ 够用 | ❌ 过度设计 |
| 不同玩法**各自独立的插件的版本**（如两个服用了冲突的插件版本） | ❌ 做不到 | ✅ 天然隔离 |
| 生存服崩了不影响主城继续在线 | ❌ 一崩全崩 | ✅ 子服崩溃只影响那一个服 |
| 生存 / 小游戏使用**不同的服务端版本** | ❌ 一把梭 | ✅ 各自版本 |
| 玩家用 `/server survival` 跨服往返 | ⚠️ 只能同世界传送 | ✅ 就是为它设计的 |
| 单机玩家数 < 20、玩法单一 | ✅ **别折腾** | ❌ 徒增复杂度 |

> **一句话判断**：只要你回答不了「我为什么非得让两台服务端**互相隔离**」，就先别上代理。先按 [15 分钟极速开服](#/guide/quick-start) 把单服跑顺。

---

## 第二步：搞懂架构 —— 一个入口，多台子服

群组服只有**一个对外端口**，所有玩家从代理进来，再由代理分发到后台子服：

```
                        玩家（互联网）
                             │
                             │  只暴露 25565（代理端口）
                             ▼
                 ┌───────────────────────┐
                 │   Velocity 代理（4.2.0）│  ← 唯一的对外入口
                 │   online-mode = true   │     负责正版验证
                 │   端口 25565            │     负责转发玩家身份
                 └───────────┬───────────┘
                             │  内网 / 白名单访问
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │  Paper 子服 │     │  Paper 子服 │     │  Paper 子服 │
   │  lobby     │     │  survival  │     │  minigames │
   │ :30066     │     │ :30067     │     │ :30068     │
   │ online-mode │     │ online-mode │     │ online-mode │
   │   = false  │     │   = false  │     │   = false  │
   └────────────┘     └────────────┘     └────────────┘
```

**角色分工：**

| 角色 | 干什么 | 对外暴露端口？ |
|------|--------|----------------|
| Velocity 代理 | 正版验证、`/server` 跳转、把玩家真实 IP / UUID 转发给子服 | ✅ 只有它对外 |
| Paper 子服（lobby / survival / …） | 真正的游戏世界与玩法 | ❌ **绝对不能**直接对外 |

> **子服为什么不能开放端口？** 子服为了接受代理转发，`online-mode=false`（不再自己验证正版）。一旦它的端口能被公网直接访问，**任何人都能绕过代理、伪造任意玩家名和 UUID 连进来**——这是群组服最常见的致命配置错误。子服只应允许**代理所在机器**连入（见第五步的 `server-ip` 与防火墙）。

---

## 第三步：手把手搭建

### 第 0 步：装 Java 25 与准备目录

Velocity 与 Paper 26.x 都用 Java 25。若还没装，见 [15 分钟极速开服](#/guide/quick-start) 第 1 步。

建议给代理和每个子服**各自独立的目录**：

```
~/mcnetwork/
├── proxy/        # 只放 Velocity
│   ├── velocity.jar
│   └── velocity.toml
├── lobby/        # 子服 1
│   └── server.jar
├── survival/     # 子服 2
│   └── server.jar
└── minigames/    # 子服 3
    └── server.jar
```

> 路径**不要含中文与空格**，否则 Java 会出现诡异的编码问题。Vue 静态站如此，服务端更是如此。

### 第 1 步：下载 Velocity 4.2.0（用对入口）

**截止本文写作时（2026 年 9 月）Velocity 最新稳定版为 `4.2.0`**，构建号 `30`，频道 `STABLE`，发布于 `2026-09-14`，jar 文件名 `velocity-4.2.0-30.jar`，大小约 42 MB。

**正确的下载入口有两个：**

| 方式 | 地址 | 说明 |
|------|------|------|
| 官网下载页（新手推荐） | <https://papermc.io/downloads/velocity> | 选版本 → 点下载，浏览器直接下 |
| 新 API（查版本 / 拿直链） | `https://fill.papermc.io/v3/projects/velocity` | 返回 JSON，含各版本族与构建 |
| 查某版本的全部构建 | `https://fill.papermc.io/v3/projects/velocity/versions/4.2.0/builds` | 从中取 `downloads` 里的直链 |

新接口返回的关键字段长这样（已核实）：

```json
[{
  "id": 30,
  "time": "2026-09-14T16:50:54.749Z",
  "channel": "STABLE",
  "commits": [{ "sha": "c10b4925...", "message": "Release 4.2.0\n" }],
  "downloads": {
    "server:default": {
      "name": "velocity-4.2.0-30.jar",
      "size": 42163652,
      "checksums": { "sha256": "35a5596a5468a035d8a32c8de5ebb0dc6b8d8f0cc3ff5169d514aca762af8aa8" },
      "url": "https://fill-data.papermc.io/v1/objects/35a5596a.../velocity-4.2.0-30.jar"
    }
  }
}]
```

**版本族说明**（来自 `https://fill.papermc.io/v3/projects/velocity`）：

| 版本族 | 当前最新稳定版 | 备注 |
|--------|----------------|------|
| `4.0.0` | **4.2.0** | 推荐，支持 MC 1.13+ 的现代转发 |
| `3.0.0` | 3.5.1 | 老版本线，除非有特殊兼容需求 |

```bash
# Linux 示例：先查直链，再下载
cd ~/mcnetwork/proxy
# 用 curl 拉新接口，找到 4.2.0 构建 30 的 downloads.url，然后：
curl -L -o velocity.jar "<上面拿到的 fill-data 直链>"
ls -lh velocity.jar    # 应为 ~42MB
```

```
Windows：直接去 https://papermc.io/downloads/velocity 下载，
把 jar 放到 D:\mcnetwork\proxy\ 并重命名为 velocity.jar
```

> ⚠️ **不要再用 `https://api.papermc.io/v2/...` 的链接。** 它对 Paper 和 Velocity 都已停止服务（见文首）。凡是让你敲 v2 地址的教程，基本都是 2024 年前的旧文。

### 第 2 步：首次启动，生成 velocity.toml

Velocity 的配置是**一个 TOML 文件 `velocity.toml`**，首次启动会自动生成。

```bash
cd ~/mcnetwork/proxy
java -Xms512M -Xmx512M -jar velocity.jar
#    代理本体非常轻量，512MB 堆内存足够起步；
#    具体给多少取决于你后面装的代理插件数量
```

首次启动后目录里会生成 `velocity.toml`、`forwarding.secret`（转发密钥）、`logs/` 等文件。可以先 `stop` 停掉，改完配置再正式开。

> `forwarding.secret` 里是一行随机密钥，**后面子服的 `paper-global.yml` 必须与它一字不差**。这个文件不要外泄。

### 第 3 步：读懂并修改 velocity.toml

下面是 Velocity 4.2.0 的**真实键名**（配置版本 `config-version = "2.9"`，逐键对照官方默认模板 `proxy/src/main/resources/default-velocity.toml` 整理）。你只需改标 ⭐ 的几项：

```toml
# ══════════════════════════════════════════════════
#  velocity.toml — Velocity 4.2.0 真实键（config-version "2.9"）
# ══════════════════════════════════════════════════

config-version = "2.9"          # 配置版本，勿改

# ⭐ 代理监听地址。默认监听所有网卡的 25565，就是对外入口
bind = "0.0.0.0:25565"

# ⭐ 服务器列表里显示的描述。注意：只支持 MiniMessage 格式，不是旧版 & 颜色代码
motd = "<#09add3>A Velocity Server"

# 服务器列表里显示的「最大人数」——只是显示用，Velocity 本身不限人数
show-max-players = 500

# ⭐ 正版验证开关。代理负责验证，所以子服才能关掉它
online-mode = true

# 是否强制新版公钥验证（保持默认 true 即可）
force-key-authentication = true

# 客户端 ISP 与 Mojang 认证服务器不一致时踢出。可拦住部分 VPN/代理，是很弱的防护
prevent-client-proxy-connections = false

# ⭐⭐ 玩家信息转发模式。四选一：none / legacy / bungeeguard / modern
#     modern = Velocity 原生现代转发（最安全，仅 MC 1.13+），新手用这个
player-info-forwarding-mode = "none"

# ⭐ 存放转发密钥的文件名（内容在 forwarding.secret 里）
forwarding-secret-file = "forwarding.secret"

# 是否对外宣称自己是 Forge 兼容服。纯原版服保持 false
announce-forge = false

# 正版模式下，重复登录时是否踢掉已在线的同一玩家
kick-existing-players = false

# 悬停人数时是否显示在线玩家样本
sample-players-in-ping = false

# 是否在日志里记录玩家真实 IP（关掉则显示 <ip address withheld>）
enable-player-address-logging = true

# ── 服务器列表（你真正的子服都填这里）────────────────
[servers]
# 键 = 代理内部使用的服务器名（子服必须在这个列表里）
# 值 = 子服的 IP:端口（同一台机器用 127.0.0.1）
lobby = "127.0.0.1:30066"
survival = "127.0.0.1:30067"
minigames = "127.0.0.1:30068"

# ⭐ 玩家登录时、或从某服被踢后，按此顺序尝试连接
try = [
    "lobby"
]

# ── 强制主机（按域名分流，可选）──────────────────────
[forced-hosts]
# 访问 lobby.example.com 的玩家固定进 lobby 服
"lobby.example.com" = [
    "lobby"
]

# ── 高级选项（默认即可）─────────────────────────────
[advanced]
compression-threshold = 256     # 大于该字节数才压缩
compression-level = -1          # -1 = zlib 默认等级
login-ratelimit = 3000          # 同 IP 两次连接最短间隔（毫秒）
connection-timeout = 5000       # 连接子服超时
read-timeout = 30000            # 读超时
haproxy-protocol = false        # 不用 HAProxy 就别开
tcp-fast-open = false           # 需要 Linux
bungee-plugin-message-channel = true
announce-proxy-commands = true  # 向 1.13+ 客户端声明代理命令
log-command-executions = false
log-player-connections = true
accepts-transfers = false       # 是否接受 1.20.5+ 的 Transfer 转服
enable-reuse-port = false       # 多核高并发可选，需要 Linux/macOS
command-rate-limit = 50         # 命令限速（毫秒/条）
```

> **几个容易被旧教程带偏的点：**
>
> 1. **`ping-passthrough` 已经是「表」而不是「字符串」了。** 早期文档说它取 `NONE` / `MODS` / `DESCRIPTION` / `ALL` 这样的单值；4.x 的默认配置里它是分区：
>
>    ```toml
>    [ping-passthrough]
>    version = false
>    players = false
>    description = false
>    favicon = false
>    modinfo = false
>    ```
>
>    按需置 `true`，把对应字段透传自子服。网上贴字符串写法的攻略已经过期。
> 2. `motd` **只认 MiniMessage**（`<color>` 标签），不是旧版的 `&` 颜色代码。写 `&a` 不会变色。
> 3. `[servers]` 里的名字（`lobby` 等）就是玩家 `/server <名字>` 用的名字，**必须改对**，否则报「指定的服务器不存在」。

### 第 4 步：各子服安装 Paper 26.3 并改 server.properties

**在每一个子服目录**里装 Paper 26.3。

Paper 的最新版本族为 **26.3**（与本站目标一致），下载入口同样是**新接口**：

| 方式 | 地址 |
|------|------|
| 官网下载页 | <https://papermc.io/downloads/paper> |
| 新 API | `https://fill.papermc.io/v3/projects/paper` |
| 某版本构建 | `https://fill.papermc.io/v3/projects/paper/versions/26.3/builds` |

新接口返回的 `downloads` 字段里含 `paper-26.3-<build>.jar` 的直链、`size` 与 `sha256`（写作时 26.3 的最新构建可在上述接口查到）。

**关键：子服的 `server.properties` 必须改这 3 项：**

```properties
# ⭐ 关掉子服自身的正版验证 —— 由代理统一验证
online-mode=false

# ⭐ 只监听本机回环地址，杜绝外部直连（代理与子服同机时用 127.0.0.1）
server-ip=127.0.0.1

# ⭐ 每个子服一个独立端口，和 velocity.toml 的 [servers] 一一对应
server-port=30066
```

> ⚠️ **`online-mode=false` 是有前提的**：只有当**子服的端口不可能被外部直接访问**时才允许。若代理与子服不在同一台机器（无法用 `127.0.0.1`），必须在子服机器的系统防火墙里**只放行代理 IP**，详见第六步。

### 第 5 步：配置子服的 paper-global.yml（转发密钥必须一致）

现代转发（modern forwarding）下，子服需要相信「这个连接确实来自我的代理」。在**每个子服**的 `config/paper-global.yml` 里配置 `proxies.velocity` 段：

```yaml
# config/paper-global.yml （Paper 1.18.2 及更早叫 paper.yml，键名是 settings.velocity-support.*）
proxies:
  # ⭐ 现代转发三件套：开启 + 与代理一致的密钥 + 与代理一致的 online-mode
  velocity:
    enabled: true
    online-mode: true                 # 必须与 velocity.toml 的 online-mode 一致
    secret: '把 forwarding.secret 里的整行原样贴进来'
  # 只用 Velocity 就无需理会 BungeeCord 段
  bungee-cord:
    online-mode: true
  # 是否启用 HAProxy PROXY protocol，普通场景保持 false
  proxy-protocol: false
```

> **这三个键名的出处**：Paper 源码 `io.papermc.paper.configuration.GlobalConfiguration` 中的 `Proxies` / `Velocity` 配置类（字段 `enabled`、`online-mode`、`secret`）。官方文档也明确要求 `proxies.velocity.enabled` 设为 `true`、`secret` 与 `forwarding.secret` 一致、`online-mode` 与 `velocity.toml` 一致（见 <https://docs.papermc.io/velocity/player-information-forwarding/>）。

> **如果密钥填错 / 漏填会怎样？** Paper 启动时会打印：
>
> ```
> Velocity is enabled, but no secret key was specified. A secret key is required. Disabling velocity...
> ```
>
> 并自动关闭 velocity 支持（该字符串来自 Paper 源码）。此时子服会拒绝代理的转发，玩家进不去或被当作离线 UUID。

**legacy 与 modern 的配置差异（重要）：**

| 模式 | velocity.toml | 子服额外要求 |
|------|---------------|--------------|
| **modern**（推荐） | `player-info-forwarding-mode = "modern"` | 填 `paper-global.yml` 的 `proxies.velocity`；**不需要**开 bungee |
| legacy | `player-info-forwarding-mode = "legacy"` | `spigot.yml` 里 `settings.bungeecord: true`；`paper-global.yml` 的 `proxies.bungee-cord.online-mode` 与代理一致 |

### 第 6 步：启动顺序与网络隔离

**启动顺序：先启动所有子服，最后启动代理。** 代理启动时会去连 `[servers]` 里的子服；子服没起来的话，`try` 列表会连不上。

```bash
# 每个子服目录各开一个终端：
java -Xms4G -Xmx4G -jar server.jar --nogui

# 等所有子服出现 "Done (x.xxx s)!" 后，再启动代理：
cd ~/mcnetwork/proxy
java -Xms512M -Xmx512M -jar velocity.jar
```

**网络隔离（本页的「安全红线」）：**

```
✅ 代理：对外只开放 25565/TCP
✅ 子服：server-ip=127.0.0.1，端口不对公网开放
❌ 绝对不要让子服的 30066/30067/30068 出现在任何公网 IP 上
```

- **代理与子服同机**：子服 `server-ip=127.0.0.1` 即可（最简单，官方推荐）。
- **代理与子服不同机**：用系统防火墙（Linux `iptables`/`nftables`、Windows 防火墙）**只放行代理 IP** 访问子服端口；或干脆用 WireGuard 之类加密隧道。官方明确 **强烈建议使用防火墙**，并指出「现代转发不能替代防火墙」（见 <https://docs.papermc.io/velocity/security/>）。

### 第 7 步：验证

启动代理后，玩家连**代理的公网 IP:25565**，验证四件事：

| 检查项 | 期望结果 | 失败说明 |
|--------|----------|----------|
| 能进服且落到 `try` 里的默认服 | 进入 `lobby` | 见下方报错速查 |
| `/server survival` 能跳转 | 成功切到生存服 | 名字 / 端口对不上 |
| 子服看到**真实玩家名与正版 UUID** | 名字正确、无「离线模式」标记 | 转发没生效 |
| 权限 / 金钱在子服生效 | 与主城一致 | 跨服数据未同步（见第七步） |

**代理内置命令**（已核实，来自 Velocity 源码 `command/builtin/`）：

| 命令 | 语法 | 谁能用 / 权限 | 说明 |
|------|------|---------------|------|
| `/server` | `/server <服务器名>` | 仅玩家，权限 `velocity.command.server` | 把自己切到某个子服 |
| `/send` | `/send <玩家> <服务器名>` | 权限 `velocity.command.send` | 把指定玩家送到某子服 |
| `/glist` | `/glist [服务器名]` | 权限 `velocity.command.glist` | 查看代理 / 某子服的在线人数 |
| `/velocity` | `/velocity <dump\|heap\|info\|plugins\|reload>` | 逐子命令权限 `velocity.command.dump` 等 | 代理信息、重载配置等 |
| `/shutdown` | `/shutdown [原因]` | **仅控制台**，别名 `end` / `stop` | 关闭代理 |

> 注意 `/server` 只有**玩家**能用（控制台没有「我在哪个服」的概念）；`/shutdown` 只有**控制台**能用。这两个限制来自源码，不是配置项。

---

## 第四步：常见报错速查

以下报错原文均来自 Velocity / Paper 的源码字符串或官方文档，可放心按关键词搜索。

| 报错原文（关键词） | 出现在哪 | 原因 | 解决 |
|--------------------|----------|------|------|
| `If you wish to use IP forwarding, please enable it in your BungeeCord config as well!` | **子服**把玩家踢回 | 用了 legacy 转发，但子服 `spigot.yml` 的 `settings.bungeecord` 为 `false` | 改成 `true` 并重启子服（或改用 modern 转发） |
| `Unknown data in login hostname, did you forget to enable BungeeCord in spigot.yml?` | 子服 | 同上：子服没开 bungee 转发却收到了 legacy 数据 | 同上 |
| `Velocity is enabled, but no secret key was specified. A secret key is required. Disabling velocity...` | 子服控制台 | `paper-global.yml` 里 `proxies.velocity.secret` 为空 | 填入与 `forwarding.secret` 一致的密钥 |
| `Unable to connect you to <服务器名>. Please try again later.` | 玩家客户端 | 代理连不上目标子服 | 检查子服是否已启动、`[servers]` 的 IP:端口是否正确、防火墙 |
| `Your server did not send a forwarding request to the proxy. Make sure the server is configured for Velocity forwarding.` | 玩家客户端 | 设了 modern，但子服没配 `proxies.velocity` | 按第 5 步配置子服 |
| `There are no available servers to connect you to.` | 玩家客户端 | `try` 里的子服全部不可达 | 先启动子服，再启动代理 |
| `The specified server <服务器名> does not exist.` | 玩家执行 `/server` | 名字拼错，或不在 `[servers]` 里 | 对照 `velocity.toml` 的键名 |
| 子服里玩家显示为**离线模式 / UUID 不一致** | 子服 | 转发密钥不匹配或转发模式错 | 三方（代理模式、子服密钥、`online-mode`）逐一比对 |
| 跨越子服后**权限 / 金钱不同步** | 子服 | 每个子服独享数据库 | 见第七步「跨服数据同步」 |

> 「secret mismatch」类问题九成是**空格或换行**：`forwarding.secret` 是单行文本，复制时别带首尾空格，`paper-global.yml` 里用引号包住即可。

---

## 第五步：进阶话题

### 现代化转发（modern）vs legacy：到底选哪个？

| 维度 | modern（现代转发） | legacy（BungeeCord 兼容） |
|------|--------------------|---------------------------|
| 安全性 | ✅ 高：带 MAC 校验 + 共享密钥 | ❌ 本质不安全：可被伪造 |
| 支持的 MC 版本 | 仅 **1.13+** | 可到 1.7.2（老版本服） |
| 子服要求 | Paper 1.14+ 原生支持 | 需开 `settings.bungeecord` |
| 是否需要额外插件 | 否 | 共享主机场景才考虑加 BungeeGuard |
| **推荐度** | **新服一律选它** | 只有必须兼容 1.12 及以下时才用 |

> 官方原文：legacy 转发 **fundamentally insecure（本质上不安全）**；若不是必须兼容老版本，一律用 modern。modern 也不能替代防火墙——两者要一起用。

### `try` 与 `forced-hosts` 怎么用？

- **`try`**：玩家登录时、以及从某个子服被踢出后，按顺序尝试的连接列表。通常把 `lobby` 放首位。
- **`forced-hosts`**：按**域名**分流。例如让 `survival.你的域名` 固定进生存服、`mc.你的域名` 默认进主城。需要把域名解析指向代理 IP，并在该段里配置。

### 跨服数据同步（群组服真正的难点）

代理只解决「跳转」，**不解决「数据」。** 每个子服是独立进程、独立文件，默认互不相通：

| 数据 | 不同步的后果 | 推荐做法 |
|------|--------------|----------|
| 权限 / 分组（LuckPerms） | 主城是管理员、生存服变普通玩家 | 所有子服连**同一个 MySQL**，并启用消息服务；见 [LuckPerms](#/plugin/luckperms) |
| 经济（Vault / 经济插件） | 每个服各算各的钱 | 用**支持跨服**的经济方案（共享数据库），普通文件型经济无法跨服 |
| 玩家背包 / 血量 / 经验 | 换服后装备清空 | 用 Multiverse-Inventories 或专门的数据同步插件 |

> **最容易被忽略的一条**：LuckPerms 默认用本地 H2 单文件库，每个子服一份、互不相通。想让权限跨服一致，**必须**切到共用的 MySQL/MariaDB（`storage-method: MySQL`）。细节见 [LuckPerms 教程](#/plugin/luckperms) 的「多服务器同步」小节。

### 代理要不要装插件？

代理本身可以做轻量工作（如全局聊天、Tab 列表、`/server` 别名）。但**只装支持 Velocity 的代理端插件**——Bukkit 插件（`.jar` 里声明 `plugin.yml` 的那些）**不能**丢进代理，放进去只会报错。装之前先确认插件页写明了支持 Velocity。

---

## 下一步

- 还没搞懂单服基础？先回去把单服跑顺：[15 分钟极速开服](#/guide/quick-start)
- 多世界 / 主城 / 资源世界的常规做法：[多世界管理](#/guide/multi-world-setup)
- 群组服的权限怎么设计才不打架：[权限体系设计](#/guide/permissions-design)
- 想让代理和子服都更稳：[性能调优从入门到精通](#/guide/performance-tuning)
- 担心子服被绕过代理直连、被攻击：[安全加固](#/guide/security-hardening)
