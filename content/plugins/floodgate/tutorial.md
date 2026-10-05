---
id: floodgate
name: Floodgate
description: 基岩版跨玩入口 — 让基岩玩家不用 Java 账号就能进服，必须和 Geyser 一起装，单装它没有任何作用。
category: 跨版本
version: 2.2.7-b69（MC 1.8 - 26.2）
tags: [Geyser, 基岩版, 跨玩, 登录, UUID]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## 先说结论：Floodgate 不能单独装

**Floodgate 是 Geyser 的配套插件，不是独立插件。** 它自己不做任何协议转换，只干两件事：

| 插件 | 干什么 | 能单独装吗 |
|------|--------|-----------|
| **Geyser** | 把基岩版协议翻译成 Java 版协议，让基岩客户端能连上 | 能（但基岩玩家还得有 Java 账号） |
| **Floodgate** | 让基岩玩家**不用买 Java 版**就能通过认证进服 | **不能** |

没装 Geyser 就装 Floodgate，Floodgate 加载后什么事也不干——你会看到它启动成功，然后基岩玩家依然连不上。

> ⚠️ **顺序不能反**：Geyser 先装、先重启一次生成配置，再装 Floodgate。

## 1. 它到底解决什么问题

Java 版和基岩版是**两个不同的游戏**。Geyser 解决的是「协议不通」，Floodgate 解决的是「账号不通」。

```
基岩玩家手机/主机
      │  基岩协议（RakNet）
      ▼
   Geyser ── 翻译 ──→ Java 协议（TCP）
      ▲
      │  Floodgate 帮它验证 Xbox Live 身份
      ▼
   你的 Java 服务器（online-mode=true 照常开着）
```

**没有 Floodgate 时**：Geyser 已经能翻译协议了，但登录那一步仍按 Java 版规则走——玩家必须有一个付费的 Java 账号。对手机玩家来说这道门槛劝退绝大多数人。

**有 Floodgate 时**：基岩玩家用自己的 Xbox / PS / Switch 账号完成验证，Java 服务器的 `online-mode=true` 保持不变。

**关键点：不需要为了 Floodgate 把服务器改成 `offline-mode`。** 网上很多教程让你关掉正版验证，那是错的——关掉之后任何人都能冒用别人的 ID 进服。见 [账户安全](#/guide/account-security)。

## 2. 安装步骤

前提：服务端是 Paper / Spigot / Purpur 系；如果你的架构是 Velocity 代理，见下面第 5 节。

1. 装 **Geyser**（Spigot/Paper 版），放 `plugins/`，重启一次
2. 编辑 `plugins/Geyser-Spigot/config.yml`，至少改这两处：

```yaml
bedrock:
  port: 19132          # 基岩玩家连的端口，必须放行 UDP
remote:
  address: auto        # 和 Geyser 同机时用 auto
  port: 25565
  auth-type: floodgate # 关键：把认证交给 Floodgate
```

3. **服务器防火墙 / 主机面板放行 UDP 19132**
4. 装 **Floodgate**（平台要和 Geyser 一致，如 `floodgate-spigot.jar`），放 `plugins/`，重启
5. 首次启动会生成 `plugins/floodgate/key.pem`，Geyser 同机时会自动读取

> 🔥 **UDP 19132 是九成「装完连不上」的真正原因。** 基岩版走 UDP，Java 版走 TCP。你放行了 25565 但没放行 19132，表现就是「基岩玩家一直连接失败，Java 玩家正常」——很多人在这里查一下午。主机面板默认往往只放行 TCP。

**下载**：Modrinth 和 Geyser 官方站（geysermc.org）都有，认准 **GeyserMC** 组织。

## 3. 那个「点」前缀

Floodgate 默认给所有基岩玩家的名字前面加一个 `.`：

| 玩家 | 实际身份 | 在你服里显示为 |
|------|---------|--------------|
| Java 玩家 Steve | Mojang UUID | `Steve` |
| 基岩玩家 Steve | Xbox Live UUID | `.Steve` |

**这不是 bug，是刻意设计。** 它保证基岩玩家不可能和一个 Java 账号重名——否则你的权限插件就分不清「这两个同名的人是不是同一个人」。

但它带来两个真实麻烦：

| 场景 | 症状 | 怎么办 |
|------|------|-------|
| 白名单 | `/whitelist add .Steve` 说找不到玩家 | 先让他进来一次，再 `whitelist add`，或直接编辑服务器目录的 `whitelist.json` |
| 权限 | LuckPerms 里按名字给权限永远对不上 | 用 UUID 分配权限；临时的话玩家在线时给 |

前缀可以改（`plugins/floodgate/config.yml` 里的 `username-prefix`），但**强烈建议别动**。改了之后你已有的白名单和权限条目全部对不上，而且失去了「一眼看出这是基岩玩家」的能力。

## 4. 它和基岩玩家的其他差异

Floodgate 只管登录，不管这些。装了它不等于基岩玩家体验就和 Java 玩家一样：

| 差异 | 影响 |
|------|------|
| **自定义 GUI** | 箱子式菜单在触屏上很难用，基岩玩家会骂 |
| **资源包** | Java 资源包不能直接给基岩端，需要单独准备 |
| **红石** | 基岩版红石逻辑和 Java 不同，Java 机关可能不工作 |
| **PvP 平衡** | 基岩版没有攻击冷却，Java 版有——这是真实的强度差 |
| **旁观模式** | 基岩端支持有限 |

想要基岩端原生 UI（按钮、下拉框、文本框），需要插件作者专门写 **Form**，不是自动拥有的。

**测试一定要用真机。** 你手上是 Java 客户端，翻译层你测不出来。拿手机连一次才算数。

## 5. Velocity 代理架构下的 Floodgate

群组服 / 代理架构时装的位置不一样，最容易配错：

| 位置 | 装什么 |
|------|-------|
| **Velocity 代理端** | Geyser + Floodgate |
| **每个后端服务器** | Floodgate（**Geyser 不用装**） |

**`key.pem` 必须全服一致。** 代理端生成后，把 `plugins/floodgate/key.pem` 复制到每个后端的 `plugins/floodgate/` 下。所有节点的密钥不一样，Floodgate 会直接拒绝登录，日志里报 key 不匹配。

## 6. 常见坑

**Floodgate 装了但完全没反应**

Geyser 没装，或者 Geyser 的 `auth-type` 还是 `online`。检查 Geyser 配置里这一行：

```yaml
remote:
  auth-type: floodgate
```

**基岩玩家进不来，Java 玩家正常**

按顺序查：

1. UDP 19132 放行了吗（**最常见**）
2. Geyser 和 Floodgate 版本对不对（都从官方站下）
3. Geyser 支持你当前的 MC 版本吗（跨大版本时 Geyser 常要跟着更新）
4. 主机面板是否禁止自定义 UDP 端口

**跨大版本时 Geyser 连不上**

Geyser 需要同时支持「基岩端当前版本」和「你服务端当前版本」。跨度过大时它会直接拒绝启动。这种情况先升级 Geyser。

**登录时提示认证失败**

`auth-type: floodgate` 但 Floodgate 没加载。看控制台有没有 Floodgate 的加载报错——常见是平台选错了（在 Paper 上装了 velocity 版）。

**Nginx / 面板反代后面连不上**

UDP 端口不能用 HTTP 反代转发，只能在防火墙上直接放行。

## 7. 哪些反作弊会「放过」基岩玩家

这一点开服前要知道，否则你会误判安全状况：

| 插件 | 对基岩玩家的处理 |
|------|----------------|
| **Vulcan** | 默认忽略 Floodgate 玩家（避免基岩移动差异导致误封） |
| **GrimAnticheat** | 基岩玩家完全豁免——移动机制差异太大，预测引擎没有意义 |

意思是**装了 Floodgate 之后，反作弊对基岩玩家的覆盖率会下降**。这不是 bug，是没有好选项：基岩版的移动机制和 Java 版差异太大，任何基于物理预测的反作弊都会疯狂误报。接受这个取舍，或者别开基岩入口。

## 8. 关于汉化

> ⚠️ **本站未核实到 Floodgate 的官方中文语言文件机制。**

Floodgate 本身几乎没有玩家可见的文案（它的提示主要在 Geyser 那边），所以汉化需求很弱。如果你确实要改：

- 打开 `plugins/floodgate/` 看生成的文件，搜 `config.yml` 里带 `message` / `prefix` 的段落
- 玩家可见的绝大多数提示**在 Geyser 的配置里**，不在 Floodgate

**不要照抄网上那些「Floodgate 中文配置」教程**，它们大多是把 Geyser 的 `config.yml` 里的 `motd` 之类改了而已。**具体可改的键名请以你手上版本的官方配置文件注释为准。**

## 下一步

- Geyser 完整安装与排错 → [基岩玩家进服（Geyser）](#/guide/geyser-bedrock)
- 反作弊怎么配 → [服务器安全加固](#/guide/security-hardening)
- 代理架构怎么组 → [Velocity 网络](#/guide/velocity-network)
- 开放基岩入口后账号安全 → [账户安全](#/guide/account-security)