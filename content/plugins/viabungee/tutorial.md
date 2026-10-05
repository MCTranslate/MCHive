---
id: viabungee
name: ViaBungee
description: ViaVersion 在 BungeeCord/Waterfall 代理端的加载器 — 想让老客户端连你的群组服，但服务端是代理架构时需要它。装在代理端，不是后端 Paper 服。
category: 跨版本
version: ViaBungee（MC 1.11 - 1.21）
tags: [跨版本, BungeeCord, Waterfall, 代理端, ViaVersion, 群组服]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
downloads: []
---

## ViaBungee 安装教程

### 1. 它是什么

**ViaBungee 本身不提供跨版本能力，它是个加载器。**

ViaVersion 是一整套协议转换的实现，但它的代码基础是 Bukkit/Paper 的 API。BungeeCord 和 Waterfall **不是 Bukkit 派生服务端**——它们是另一套插件体系（`bungeecord-api`），没有 Bukkit 的那些类。

结果就是：ViaVersion 的 jar 丢进 BungeeCord 的 `plugins/` 里，**它加载不了**，因为它引用的 Bukkit 类根本不存在。

ViaBungee 就是来解决这个的——它是一个跑在 BungeeCord/Waterfall 插件体系里的**适配层**，让 ViaVersion 的能力能在这个平台上跑起来。

| 组件 | 跑在哪 | 作用 |
|------|--------|------|
| **ViaBungee** | BungeeCord / Waterfall **代理端** | 加载器 / 适配层，让 Via 系能在代理端运行 |
| ViaVersion | Paper / Spigot / Fabric **后端服** | 真正干活的协议转换实现 |

> ⚠️ **本页最容易搞错的一点：ViaBungee 装在代理端。**
> 你的 Paper 子服里不需要它，需要它的是那个跑 BungeeCord/Waterfall 的 jar。

### 2. 什么时候需要它

只有一种情况：

```
✅ 你的架构是 BungeeCord / Waterfall 代理
   + 你想让新版本客户端连老版本子服（反之亦然）
   → 需要 ViaBungee
```

| 你的架构 | 需要 ViaBungee 吗 |
|----------|-----------------|
| 单台 Paper / Spigot | ❌ 不需要，直接装 [ViaVersion](#/plugin/viaversion) |
| Velocity 代理 + Paper 子服 | ❌ 不需要，Velocity 有自己的 Via 系方案 |
| **BungeeCord / Waterfall 代理 + 子服** | ✅ **就是它** |

方向判断（和 ViaVersion 本身一致）：

| 服务端版本 | 玩家客户端版本 | 需要的组件 |
|-----------|--------------|-----------|
| 老版本 | 新版本 | ViaBungee + ViaVersion + ViaBackwards |
| 新版本 | 老版本 | ViaBungee + ViaVersion |
| 新版本 | 1.8 / 1.7 客户端 | ViaBungee + ViaVersion + ViaBackwards + ViaRewind |

ViaVersion / ViaBackwards / ViaRewind 三者的方向区别见 [客户端版本兼容策略](#/guide/version-compat)。

### 3. 版本与下载

- 仓库：<https://github.com/ViaVersion/ViaBungee>
- 官方文档：ViaVersion 文档站的 BungeeCord 章节

**声明支持 MC 1.11 - 1.21。** 这个区间比后端 ViaVersion 窄——因为它要跟着 BungeeCord/Waterfall 自己的协议支持走，代理端不支持的版本，它也没辙。

> ⚠️ BungeeCord 系的版本支持本身就有上限。**Waterfall 的落后于主流 Paper 是常态**，如果你需要支持很新的客户端，代理端可能得换或等更新。

### 4. 安装

1. 下载 ViaBungee 的 jar
2. 放进**代理端**的 `plugins/` 目录
3. 重启代理端

**生成 `plugins/ViaBungee/` 目录，含配置文件。**

后端子服那边按需要单独装 ViaVersion 系（见第 2 节的表），两边各管一段。

> ⚠️ 别把 ViaBungee 丢进 Paper 子服的 `plugins/`。那是后端服不是代理端，**它加载不了，只会在控制台报一堆错**。看到这种报错先检查是不是放错地方了。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/viaversion list` | 列出在线玩家及其客户端版本 |
| `/viaversion player <玩家>` | 查看单个玩家的连接详情 |
| `/viaversion reload` | 重载配置 |

> ⚠️ 命令前缀和子命令**以你手上版本的代理端实际输出为准**。Via 系在不同平台上的命令注册方式不完全一样，代理端可能需要不同的权限节点。

### 6. 常见坑

**装完完全不生效**

按顺序排查：

1. **放错地方了吗** —— 应该在 BungeeCord/Waterfall 代理端，不在 Paper 子服
2. **代理端不支持那个版本** —— ViaBungee 的能力上限跟着代理端走，代理端不支持的客户端版本它也接不住
3. **后端子服没装对应的 Via 组件** —— 代理端和后端各管一段，**只装一边通常不够**
4. **版本对应不上** —— Via 系组件之间版本要配套

**控制台刷屏报错**

大概率是缺后端组件或者版本不配套。**看报错里提到的具体类名**——缺哪个就去补哪个。

**新客户端连进来，方块/物品显示错乱**

这通常不是 ViaBungee 的问题，而是**后端子服的 Via 组件没装全，或者两边都在做协议转换**。同一个连接上做两遍转换会出奇怪的问题，检查后端配置。

**玩家说延迟变高了**

跨版本转换本身是有成本的。协议翻译在 CPU 上跑，**人多了是实打实的开销**。这不是 bug，是这类方案的固有代价。

**生电服上的红石表现不对**

跨版本会让依赖精确时序的红石机器表现不一致。**有精密红石的服不要开跨版本。**

### 7. 什么时候别用它

- **单台 Paper 服** —— 直接用 [ViaVersion](#/plugin/viaversion)，没理由加一层
- **用的是 Velocity 而不是 BungeeCord/Waterfall** —— 平台不对，别混
- **代理端版本太老** —— ViaBungee 救不了 BungeeCord 本身不支持的协议
- **服务器有精密红石 / 依赖精确时序的机制** —— 跨版本会改变行为
- **只是想「优化」延迟** —— 见第 6 节，跨版本会让延迟变高，方向反了

### 8. 关于汉化

**本站未核实 ViaBungee 的官方中文语言文件机制。** 若要汉化需自行确认。

引导式排查方法：

1. 进代理端的 `plugins/ViaBungee/`，看有没有语言文件目录（常见形态是 `lang/`、`locale/`、`translations/`）
2. 搜配置文件里有没有 `language`、`lang`、`locale`、`messages` 这类关键词
3. **注意 Via 系组件之间的消息不一定各自独立** —— 玩家看到的提示可能来自 ViaVersion 的资源，ViaBungee 自己只出一部分。**如果 ViaBungee 目录里找不到语言文件，去 ViaVersion 那边看**

想看全站各插件的汉化情况，见 [插件汉化与本地化完全指南](#/guide/plugin-localization)。

### 9. 一句话总结

**ViaBungee = 把 ViaVersion 搬到 BungeeCord/Waterfall 上的适配层。** 装在代理端，后端子服另配 Via 系，两边齐了才有完整效果。

## 下一步

- 版本方向怎么判断、什么时候该开跨版本 → [客户端版本兼容策略](#/guide/version-compat)
- 代理端怎么搭、架构怎么定 → [用 Velocity 搭建群组服](#/guide/velocity-network)
- 后端要装哪个组件 → [ViaVersion](#/plugin/viaversion)
