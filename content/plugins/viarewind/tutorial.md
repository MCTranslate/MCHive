---
id: viarewind
name: ViaRewind
description: 1.8 / 1.7 玩家的准入通道 — 补上 ViaBackwards 够不到的老版本，让非常老的客户端也能进服，代价是包体更大。
category: 跨版本
version: 4.2.0（MC 1.8.8 - 26.3）
tags: [跨版本, ViaVersion, "1.8", 老版本, 兼容]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: 无独立语言文件 — 同属协议翻译层，不面向玩家输出文案
downloads: []
---

## ViaRewind 安装教程

### 1. 它补的是哪一段

先看清三个插件的分工：

| 插件 | 覆盖的客户端版本 |
|------|-----------------|
| [ViaVersion](#/plugin/viaversion) | 新客户端 → 你的服（主插件，必装） |
| [ViaBackwards](#/plugin/viabackwards) | 1.10 及以上的老客户端 |
| **ViaRewind** | **1.8.8 / 1.7.x 的老客户端** |

**ViaRewind 是可选的**，只有你确实需要支持 1.8 玩家时才装。

ViaRewind 的引入让 ViaVersion 从「基本够用」变成「真的能接住 2011 年的客户端」——很多 2011 年进服的玩家，到 2020 年代还在玩。

### 2. 什么时候真的需要它

**先算一笔账。** 你的服务器现在还有 1.8 玩家吗？

- **有，而且占比不小（比如服务器主打怀旧/老玩家社区）** → 装
- **有一两个，但正在流失** → 装，这是挽留老玩家的低成本手段
- **没有，玩家都是新版本** → **别装**

理由很实在：1.8 客户端**玩不了**你服上的现代玩法（新的物品、新的界面、新的数据包效果）。老玩家进来看到的是残缺的体验。**如果你的服重度依赖新版本内容，支持 1.8 反而是给他们添堵。**

### 3. 装它有什么代价

| 方面 | 影响 |
|------|------|
| 包体大小 | jar 比只有 ViaBackwards 时大不少（多带很多老版本映射数据） |
| 内存 | 启动时会加载老版本映射，占一点内存 |
| 兼容风险 | 老版本和新版本之间有些功能**无法翻译**（新内容本来就无法在 1.8 客户端显示） |

**这些代价都不致命**，但你要知道它在。

### 4. 安装

**三个插件要同版本号**，一起从官方渠道下：

- 官网：<https://viaversion.com/>
- Modrinth：<https://modrinth.com/plugin/viaversion>
- Hangar：<https://hangar.papermc.io/ViaVersion/ViaVersion>

全部丢进 `plugins/`，重启。

### 5. 安装后没生效的排查

| 现象 | 原因 |
|------|------|
| 1.8 客户端还是进不来 | 三个插件版本号不一致 |
| 启动报缺依赖 | 少了 ViaBackwards 或 ViaVersion |
| 1.8 玩家进服后看不到某些东西 | **正常**——1.8 客户端渲染不出新内容 |
| 1.8 玩家频繁掉线 | 1.8 客户端的协议很老，某些机制翻译不完整 |

最后一条是真实存在的坑：1.8 客户端在某些 Paper 机制下会不稳定。**观察一段时间，如果老玩家体验明显不好，考虑劝他们升级**。

### 6. 关于 1.7.2 及更早

技术上还有一个 `ViaRewindLegacySupport` 可以继续往下接。**但本站未核实到它的官方发布渠道**，所以这里不写具体版本号。

如果你的需求真的到了 1.7.2 这个层级，去 ViaVersion 官方 Discord 问维护者，比看二手教程靠谱。

## 下一步

- [客户端版本兼容：让各版本玩家都能进服](#/guide/version-compat) — 完整方案
- [ViaVersion](#/plugin/viaversion) — 主插件
- [ViaBackwards](#/plugin/viabackwards) — 中间层的关键组件
