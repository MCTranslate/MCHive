---
id: viabackwards
name: ViaBackwards
description: 跨版本登录的核心组件 — 配合 ViaVersion，让 1.10 到最新版的玩家都能进同一个服。ViaVersion 单独装没有用，这一个是必需品。
category: 跨版本
version: 5.12.0（MC 1.10 - 26.3）
tags: [跨版本, ViaVersion, 兼容, 老版本, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: 无独立语言文件 — 它的提示消息走英文硬编码，但玩家实际看到的提示由 ViaVersion 决定
downloads: []
---

## ViaBackwards 安装教程

### 1. 先搞清楚它和 ViaVersion 的关系

这是最多人搞混的地方。

| 插件 | 作用 | 类比 |
|------|------|------|
| [ViaVersion](#/plugin/viaversion) | 让**新版本**客户端能连你的服 | 「向下兼容」 |
| **ViaBackwards** | 让**老版本**客户端能连你的服 | 「向上兼容」 |

**ViaBackwards 是 ViaVersion 的硬依赖。** 只装 ViaBackwards 不装 ViaVersion，它不会正常工作。

所以正常情况下你装的是**一套**，不是一个。ViaVersion 的下载页会打包好 ViaBackwards。

### 2. 它到底做了什么

Minecraft 各版本的协议（数据包格式）一直在变。ViaBackwards 的作用是**在老客户端和新服务端之间做协议翻译**：

```
1.8 客户端 ──协议翻译──> 1.21 服务端
```

它能翻译的东西包括：

- 登录握手
- 区块数据格式
- 物品栏、NBT、实体元数据
- 聊天与插件消息
- 部分 GUI 与界面数据包

**它不是「让老玩家看到新内容」**——老玩家进来看到的还是老版本的东西，只是服务端可以正常运转。这是本质区别。

### 3. 版本支持

当前版本 **5.12.0**，支持 **MC 1.10 – 26.3**。

注意下限是 **1.10**（不是 1.8）。如果你要支持 1.8 玩家，需要额外的 [ViaRewind](#/plugin/viarewind)。

**三件套关系**：

| 目标 | 需要装 |
|------|--------|
| 支持 1.10+ 老玩家 | ViaVersion + ViaBackwards |
| 支持 1.8.x / 1.7.x 玩家 | 再加 [ViaRewind](#/plugin/viarewind) |
| 支持 1.7.2 及更早 | 再加 ViaRewindLegacySupport（**这个我们未核实到官方渠道**） |

### 4. 安装

ViaVersion 官方渠道（**不要从第三方网盘下**）：

- 官网：<https://viaversion.com/>
- Modrinth：<https://modrinth.com/plugin/viaversion>
- Hangar：<https://hangar.papermc.io/ViaVersion/ViaVersion>

下载时选你的服务端平台（Paper / Velocity / BungeeCord / Fabric 等），**同时装 ViaVersion 和 ViaBackwards**。

丢进 `plugins/`，重启。控制台出现 ViaVersion 启动成功即完成。

### 5. 验证是否生效

进服后用老版本客户端连一下，或者在控制台执行：

```
/viaversion
```

看当前支持的协议范围。如果 ViaBackwards 正常加载，输出里会包含向下的版本列表。

**装完还是进不去的常见原因**：

| 现象 | 原因 |
|------|------|
| 提示「服务器版本太新」 | ViaBackwards 没装或没加载 |
| 老玩家能看到新版本的物品 | 正常，翻译的是协议不是内容 |
| 控制台报缺依赖 | ViaVersion 版本要对，两者要同版本 |
| 装了还是不行 | 检查是否装到了代理端而非后端（群组服要注意） |

### 6. 群组服里的位置

ViaBackwards 有两种装法，取决于你的群组架构：

- **装在代理端（Velocity / BungeeCord）**：所有子服统一处理，通常更简单
- **装在每个后端子服**：各子服独立处理，需要代理端也装 ViaVersion

两种都行，**但不要代理端装全套 + 后端又装全套**，容易出现协议翻译冲突。具体取舍见 [用 Velocity 搭建群组服](#/guide/velocity-network)。

### 7. 性能影响

ViaBackwards 本身是**低开销**的——它只在有老版本客户端连入时才会做翻译工作，没有老玩家的服上几乎不产生额外负担。

**不用担心它会拖慢服务器。** 真正需要注意的是：老玩家越多、服越活跃，翻译开销越大。但这个量级远小于插件本身的开销。

## 下一步

- [客户端版本兼容：让各版本玩家都能进服](#/guide/version-compat) — 完整方案与踩坑
- [ViaVersion](#/plugin/viaversion) — 主插件
- [ViaRewind](#/plugin/viarewind) — 还想支持 1.8 玩家就加它
