---
id: worldeditsui
name: WorldEditSUI
description: 用粒子把 WorldEdit 的选区框画出来 — 服务端实现，玩家不用装 WorldEditCUI 客户端模组，还能预览剪贴板和 WorldGuard 区域。
category: 建筑工具
version: WorldEditSUI（MC 1.9 - 26.3）
tags: [WorldEdit, 选区可视化, 粒子, 建筑, FAWE]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## WorldEditSUI 安装教程

### 1. 它解决什么

WorldEdit 有一个长期存在的问题：**选区是隐形的。**

```
//pos1 -100,60,100
//pos2 100,60,-100
```

你现在选了一个 200×200 的立方体——**但你看不到它在哪**。要找边界只能靠数方块、走一遍、或者装客户端模组。

WorldEditCUI（那个著名的客户端模组）能画出来，但要求**每个玩家都装模组**。这对服务器运营是灾难：不是所有玩家愿意装、装了还得统一版本、还要在客户端分配内存。

**WorldEditSUI 的做法：粒子画在服务端。**

```
┌────────────────────────────────┐
│  WorldEditCUI（客户端模组）│  ← 玩家要装东西，效果好，耗客户端资源 │
│  WorldEditSUI（服务端插件）  │  ← 玩家零安装，服务端出粒子 │
└────────────────────────────────┘
```

作者自己说得直白：**「It mimics the functionality of the popular WorldEditCUI client mod, but running as a serverside plugin, so that you/your users do not need to install any mods.」**

**代价是它不如客户端模组精细**（作者也承认），换来的是零门槛。

### 2. 它能显示什么

| 内容 | 命令 |
|------|------|
| **当前选区** | `/wesui`（默认开） |
| **剪贴板**（`//copy` 之后） | `/wesui toggleclipboard` |
| **WorldGuard 区域** | `/wesui showregion <区域名>` |

**支持的选区形状**：

| 形状 | 状态 |
|------|------|
| 立方体（Cuboid） | ✅ |
| 球体 / 椭球体（Sphere / Ellipsoid） | ✅ |
| 圆柱体（Cylinder） | ✅ |
| 2D 多边形 | ✅ |
| 3D 多面体 | ✅（较新版本） |

**注意：FAWE（FastAsyncWorldEdit）的部分选区类型可能不支持。** 它主要针对 WorldEdit 自身的选区类型实现。

**剪贴板预览的实际用途**：复制一个建筑之后，先用粒子看一眼粘贴范围对不对，再 `//paste`。**粘贴错位置是建筑服最常见的灾难**——这个功能能防住大部分。

## 3. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Bukkit / Spigot / Paper / Purpur（支持 Folia） |
| MC | **1.9+**（1.8.x 要去 GitHub Releases 找 legacy 版） |
| **依赖** | **WorldEdit / FastAsyncWorldEdit / AsyncWorldEdit 三选一** |

### WorldEdit 版本对应关系

**这是最容易装错的地方：**

| WorldEdit 版本 | 对应的 MC |
|--------------|----------|
| 6.0.0 - 6.1.9 | 1.8.x - 1.12.x |
| 7.0.0 及以上 | **1.13+** |

**版本选错了 WorldEditSUI 就是不工作**（或者报错）。

它支持三个分支：官方 **WorldEdit**、**FastAsyncWorldEdit（FAWE）**（性能更好，大型建筑服常用）、以及 **AsyncWorldEdit** 及其 Premium 版。**你的服已经装了 FAWE 也兼容。**

## 4. 安装

- Modrinth：搜 `worldeditsui`
- SpigotMC：<https://www.spigotmc.org/resources/worldeditcui-1-8-x-1-13-x-support.60726/>
- 源码：<https://github.com/kennytv/WorldEditSUI>

丢进 `plugins/`，重启。生成 `plugins/WorldEditSUI/config.yml`。

> ⚠️ **1.8.x 必须去 GitHub Releases 下 legacy 版。** Modrinth / SpigotMC 上的版本只到 1.9+。

## 5. 命令与权限

| 命令 | 权限 | 说明 |
|------|------|------|
| `/wesui` | `wesui.command` | 主命令 |
| `/wesui toggle` | `wesui.command.toggle` | 切换自己的选区粒子 |
| `/wesui toggleclipboard` | `wesui.command.toggleclipboard` | 切换剪贴板粒子 |
| `/wesui showregion <区域>` | `wesui.command.showregion` | 显示 WorldGuard 区域 |
| `/wesui reload` | `wesui.command.reload` | 重载配置 |

额外权限 `wesui.maxselectionsize.bypass` 用于绕过选区大小限制。

## 6. 关键配置项

配置结构大致是这样（**以你版本的配置注释为准**）：

```yaml
# 缓存已计算的粒子位置，大幅降低 CPU，占一点内存
cache-calculated-positions: true

# 各类显示用的粒子
particle: FLAME                    # 选区
clipboard-particle: VILLAGER_HAPPY  # 剪贴板
wg-region-particle: VILLAGER_HAPPY # WG 区域

# 每格方块显示多少个粒子（建议 2-4）
particles-per-block: 3

# 每隔多少 tick 发一次（20 tick = 1 秒）
particle-send-interval: 12

# 玩家延迟超过这个值就不给他发粒子（仅 Paper），-1 = 关闭
max-ping: 150

# 选区大小上限，防止大范围选区拖垮服务器
max-selection-size-to-display: 10000000
```

两个值得注意的设置：

- **`max-ping`** —— 高延迟玩家收到大量粒子包反而更卡，这个设置直接跳过他们，挺有用
- **`max-selection-size-to-display`** —— 大选区（比如整座城）计算粒子位置能直接把服务器拖死，这个上限就是防这一手

### 进阶网格

```yaml
advanced-grid:
  enabled: false
  particles-per-block: 2
```

打开后不仅画边框，还在内部画网格。**大范围选区定位很方便**，但计算量大约翻 2-3 倍。剪贴板和 WG 区域各有独立的网格开关。

### 需要额外数据的粒子

有些粒子（`REDSTONE`、`FALLING_DUST`、`BLOCK_DUST`、`BLOCK_CRACK`、`ITEM_CRACK`）**需要额外数据才能显示**，得在配置里加对应的 `-data` 段才能用。**具体字段名以你的配置注释为准。**

## 7. 性能：为什么它不卡

作者在选区大的时候做了几件事，值得说清楚：

**缓存机制**

```
第一次计算选区粒子位置 → 算一遍，存起来
之后每次发包 → 直接读缓存
```

这把「每 tick 重算」变成了「只在选区变化时算一次」，是它「看起来不卡」的根本原因。代价是选区频繁变动时缓存命中率低。

> ⚠️ **别关缓存。** 作者加这个功能就是为了「基本消除 lag」。关掉之后大选区就是 CPU 灾难。

**选区大小上限**：`max-selection-size-to-display` 防的就是这一手。默认值约等于 250×150×250，已经上千万方块了，再大下去计算本身就能卡死服务器。

## 8. 常见坑

| 症状 | 处理 |
|------|------|
| **装了没反应** | ① WorldEdit 装了吗，版本和 MC 对得上吗（6.x vs 7.x）② 有 `wesui.command.toggle` 权限吗 ③ `/wesui toggle` 开了吗 ④ 选区形状它支持吗（FAWE 特殊选区可能不支持） |
| **1.20.5+ Paper 报 remapping 错** | 较新版本已处理（会跳过 remapping）。版本较老就升级 |
| **配置改了不生效** | `/wesui reload` |
| **更新后配置项缺失** | 新增选项**不会自动加入旧配置文件**。删掉旧配置让它重新生成，再手动合并你的改动 |
| **选区太大时卡服** | 调低 `max-selection-size-to-display`；保持缓存开启；关掉 advanced-grid（网格计算量翻 2-3 倍） |
| **粒子太密/太疏** | `particles-per-block` 在 2-4 之间试。配置允许 1-5，但**大于 4 会很乱** |

## 9. 缺点和取舍

| 缺点 | 说明 |
|------|------|
| **不如客户端模组精细** | 作者自己承认。WECUI 能做的事更多、更好看 |
| **吃服务端 CPU 和带宽** | **关键取舍：客户端模组消耗的是玩家电脑的资源，这个插件消耗的是服务器的资源** |
| **粒子包对高延迟玩家不友好** | 靠 `max-ping` 缓解 |
| **要装 WorldEdit** | 不能单独用 |
| **1.8 要单独下 legacy 版** | 版本分裂 |
| **FAWE 部分选区不支持** | 兼容但不完整 |

**核心取舍说清楚：**

> 把「画选区」这件事的开销从**每个玩家的电脑**转移到**你的服务器**。

对 5-20 人的小服，这个交换非常划算（省掉让所有人装模组的麻烦）。对 200 人同时建筑的服，**要仔细算一下这笔账**——可能反而让客户端模组更合适。

## 10. 关于汉化

> ⚠️ **本站未核实到 WorldEditSUI 的官方中文语言文件机制。**

它的玩家可见文本极少：一个过期提示消息（更新日志里提到「Fixed some typos in the language file」，说明确实存在语言文件，但内容和路径本站没有核实到）。

想改文案：

1. 打开 `plugins/WorldEditSUI/` 看实际生成的文件，**找语言文件（可能叫 lang 或 messages）**
2. 命令帮助和过期提示可能在里面

**具体文件名和键名以你手上版本的官方文件为准。** 不要照抄网上随便找的模板。

## 下一步

- WorldEdit 怎么用 → [WorldEdit](#/plugin/worldedit)
- 领地插件 → [领地保护](#/guide/region-protection)
- 大范围建筑怎么防崩服 → [卡顿与掉帧诊断](#/guide/lag-diagnosis)
- 地图渲染 → [地图渲染](#/guide/map-render)