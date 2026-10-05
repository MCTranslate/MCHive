---
id: packetevents
name: PacketEvents
description: 数据包协议库 — 拦读改写原始网络数据包，这是 Bukkit API 做不到的事。Vulcan / GrimAC 等反作弊的硬前置，自己不给玩家提供任何功能。
category: 开发前置
version: 2.14.0+spigot（MC 1.8 - 26.3）
tags: [前置, 协议, 数据包, API, 反作弊依赖]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化说明
    file: lang.md
    description: 仓库里没有任何语言文件 — 所有文本都在 config.yml 里自行修改
downloads: []
---

## PacketEvents 安装教程

### 1. 先搞清楚它是什么

**PacketEvents 不是功能插件，是库。** 它自己不给你任何玩家能感知的东西——装了它，游戏体验完全没变化。

它的作用是：**让别的插件能读写 Minecraft 客户端与服务端之间的原始网络数据包。**

为什么需要它？因为 Bukkit API 抽象掉了网络层。服务端 API 看到的是「玩家点击了按钮」「玩家挥了下手」，而不是原始字节。而下面这些东西，Bukkit API **根本拿不到**：

| 需求 | 只能靠数据包层 |
|------|-------------|
| 检测玩家发来的移动包是否合法 | ✅ |
| 知道玩家的 ping / 客户端版本 | ✅ |
| 拦截并修改某个数据包 | ✅ |
| 监听聊天报告（1.19+） | ✅ |
| 让插件在多个 MC 版本上用同一套 API | ✅ |

**一句话**：需要动网络层的东西都归它。

### 2. 哪些插件依赖它

站内已经收录的这几个，**装之前必须先装它**：

| 插件 | 依赖强度 |
|------|---------|
| **Vulcan** | 硬依赖（`depend: [packetevents]`），不装 Vulcan 根本不加载 |
| **GrimAC** | 硬依赖，检测引擎靠它拿版本和移动数据 |

还有一堆非本站收录的：Vulcan 系生态、部分反作弊、连击记录类、经济反作弊插件。

> 如果你是因为要装 Vulcan 才看到这一页——那不用纠结，**直接装上就行**。它的存在就是为了服务这类插件。

### 3. 装哪个 jar

PacketEvents **同一个版本号下有多个平台构建**，选错了装上去就是块砖。

| jar 后缀 | 用在哪 |
|----------|--------|
| `-spigot` / spigot 构建 | **Paper / Spigot / Purpur / Folia 服务端** ← 大多数人用这个 |
| `-bungeecord` | BungeeCord / Waterfall 代理端 |
| `-velocity` | Velocity 代理端 |
| `-fabric` | Fabric 服务端 |

你给定的当前版本就是 **`2.14.0+spigot`**，也就是 spigot 构建。`plugins/packetevents-spigot-2.14.0.jar` 这种文件名。

- 仓库：<https://github.com/retrooper/packetevents>
- 官方站点：<https://packetevents.com>
- 文档：<https://docs.packetevents.com>

> **别混装两个平台。** 代理端和后端各装各的构建是正常的；但同一台服务端里塞了 spigot 版又塞 velocity 版，会出很难查的问题。

### 4. 安装

1. 下载对应平台的 jar
2. 丢进 `plugins/`
3. 重启

生成 `plugins/packetevents/` 目录，含 `config.yml`。

**没有额外前置，没有数据库，不占什么性能。** 装完基本就可以忘了它。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/packetevents reload` | 重载配置（部分设置） |
| `/packetevents repack` | **压缩数据包映射表缓存**，首次启动后跑一次能省内存 |
| `/pe` | 部分环境下的短别名 |

> `repack` 这个命令值得说两句：PacketEvents 会把版本映射表缓存成二进制文件，第一次启动生成得慢且占内存。跑一次 `repack` 生成压缩缓存，之后启动更快。**第一次启动完等个几十秒再跑**。

### 6. 常用配置

`plugins/packetevents/config.yml`：

```yaml
# 调试模式：会打印大量数据包日志，只在排查问题时开
debug: false

# 默认是否重新编码数据包
re_encode_by_default: false

# 数据包异常时踢出玩家
kick_on_packet_exception: true

# PacketEvents 终止时踢出玩家
kick_if_terminated: true
```

> **不要为了「性能优化」去动 `re_encode_by_default`。** 改成 `true` 会让所有数据包都走一遍重编码，CPU 开销显著上升，收益是零。默认的 `false` 就是对的。
>
> `debug: true` 会把每个数据包都打进日志，几秒钟就能刷爆控制台并拖慢服务器。**只在排查具体问题时临时开一次。**

> ⚠️ 本页只列了这几项，**具体可用键以你版本生成的 `config.yml` 及其注释为准**——这个文件在 2.x 各小版本间有增删。

### 7. 常见坑

**Vulcan 装上不加载，控制台说缺依赖**

PacketEvents 没装，或者**版本太老**。Vulcan 需要 API 级别的功能，老版本 PacketEvents 不一定够。更新到最新版。

**重载 / 重启后依赖插件报错**

PacketEvents 加载顺序通常在依赖插件**之前**。如果 `/reload` 后出问题，**完整重启服务器**，不要用 `/reload`。

**和 ProtocolLib 冲突吗**

**不冲突，可以共存。** 两个是完全独立的实现，只是服务不同插件。很多服两个都装着。但要注意：**别的插件用哪个都行，别让 Vulcan 用 ProtocolLib 那条路径**（Vulcan 明确只要 PacketEvents）。

**`repack` 跑完报错了**

一般不影响功能。检查 `plugins/packetevents/` 目录权限，以及磁盘空间。

**装完内存占用莫名上升**

大概率是映射表还没压缩。跑一次 `/packetevents repack`。

**在 Velocity 代理端装 spigot 版**

装完不加载，或者代理端日志里一堆警告。**代理端就用 velocity 构建**，别混。

### 8. 什么时候可以删掉它

只有一种情况：**你把依赖它的插件全卸了。**

如果服务器上还有任何反作弊、经济反作弊、或者第三方插件声明依赖它，就**别删**。删了会导致那一堆插件连锁加载失败，而报错信息往往只说「缺少依赖」，不会告诉你是 PacketEvents。

怎么确认有没有人在用？控制台启动时看哪些插件报了 `depends on packetevents`，或者直接看其他插件的 `plugin.yml` 里有没有 `depend` / `softdepend` 写了它。

### 9. 关于汉化

**PacketEvents 没有任何语言文件。** 官方仓库里语言文件数量为 0。

这不是缺陷——它本来就没有玩家可见的文本。它抛出的异常信息、调试日志都是给开发者和服主看的。

**所以别去找汉化文件。** 那些偶尔会出现在控制台的技术性英文（异常堆栈、版本不匹配提示），要么自己看懂，要么搜对应关键词。

详见 [汉化说明](#/plugin/packetevents/lang.md)。

## 下一步

- 装完它，接着装依赖它的反作弊 → [Vulcan](#/plugin/vulcan)
- 反作弊怎么和权限系统配合 → [权限系统设计](#/guide/permissions-design)
- 多个协议库共存的说明 → [选择服务端核心](#/guide/choose-core)
