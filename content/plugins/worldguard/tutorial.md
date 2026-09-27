---
id: worldguard
name: WorldGuard
description: 区域保护 — 给主城、资源区、玩家领地划定不可建造/不可破坏的安全区，防熊与领地管理的核心插件。
category: 安全管理
version: 7.0.19（MC 26.2 - 26.3）
tags: [保护, 区域, 领地, 防熊, 编辑]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: WorldGuard 未内置多语言，提示为英文 — 汉化需借助第三方翻译插件
  - id: config
    name: Config 汉化
    file: config.md
    description: WorldGuard 配置文件中文注释版，重点解释玩家圈地数量与体积限制
---

## WorldGuard 安装与教程

### 1. 前置依赖

WorldGuard 的 `plugin.yml` 里写着 `depend: [WorldEdit]`，也就是**硬依赖**——不装 WorldEdit，WorldGuard 根本不会加载。请先装好 [WorldEdit](https://modrinth.com/plugin/worldedit)，WorldGuard 会调用它的选区系统来确定区域范围。

### 2. 选哪个版本

WorldGuard 的 `api-version` 是 `26.2`，也就是服务端至少要 **MC 26.2**。去 [Modrinth](https://modrinth.com/plugin/worldguard) 下载时按下表选：

| 你的服务端 MC 版本 | 该下载的版本 | 说明 |
|--------------------|--------------|------|
| 26.2 – 26.3 | **7.0.19**（稳定版） | 2026-09-18 发布，官方标注支持 MC 26.2–26.3 |
| 26.1 – 26.3 | 7.0.18 | 2026-07-31 发布 |
| 1.21.11 – 26.2 | 7.0.17 | 2026-05-30 发布 |

> WorldGuard 只提供 **Bukkit 系（Paper/Spigot/Folia）** 构建，且对 Folia 官方支持（`folia-supported: true`）。装它之前请确认 WorldEdit 版本能覆盖同一 MC 版本。

### 3. 安装

1. 下载 WorldGuard jar 放入 `plugins/`
2. 重启服务器（生成的配置目录在 `plugins/WorldGuard/`）

### 4. 创建保护区

1. 先用 **WorldEdit 的选区工具**圈出范围：`//wand` 拿木斧，**左键**点第一点、**右键**点第二点；或用 `//pos1` / `//pos2` 按站位设点
2. 执行 `/region define <区域名>`（等价写法 `/rg define <名>`、`/rg d <名>`）创建区域，当前 WorldEdit 选区就是它的范围；也可以顺手指定所有者：`/rg define 主城 玩家A 玩家B`

> 注意 `/wg wand` **不是**选区工具：它给的是 WorldGuard 的「区域查询魔杖」（默认物品是皮革），右键方块可列出该位置有哪些区域，需要 `worldguard.region.wand` 权限。选区始终用 WorldEdit 的工具。

### 5. 设置权限（flag）

```
# 禁止在区域内建造（非成员无法放置/破坏方块）
/rg flag <区域名> build deny

# 禁止 PVP
/rg flag <区域名> pvp deny

# 进入区域提示
/rg flag <区域名> greeting &a欢迎进入安全区！

# 离开区域提示
/rg flag <区域名> farewell &7再见！

# 允许某个玩家建造
/rg addmember <区域名> <玩家名>
```

> `build` 是兜底开关：一旦设为 `deny`，非成员连门、按钮、箱子等交互大多也会一并被拦下。想精细控制可以用 `block-break`、`block-place`、`use`、`chest-access` 等更细的 flag。消息类 flag（greeting / farewell）支持 `&` 颜色代码和 `\n` 换行。

### 6. 常用 flag 说明

| Flag | 说明 |
|------|------|
| build | 总开关，控制建造、交互、PvP、睡觉、开箱等一大票行为 |
| pvp | 是否允许玩家对战 |
| chest-access | 是否允许开箱子/访问容器 |
| use | 是否允许使用门、拉杆等（不含容器） |
| greeting | 进入区域时的聊天提示 |
| farewell | 离开区域时的聊天提示 |
| mob-spawning | 是否允许怪物生成 |
| creeper-explosion | 苦力怕爆炸是否造成伤害 |

### 7. 玩家圈地

给玩家组 `worldguard.region.claim` 权限后，玩家就能自助圈地：

1. 自己用 WorldEdit 选区圈好范围（只需要 `worldedit.selection` 权限）
2. `/rg claim <区域名>` 认领，命令执行者会自动成为该区域的所有者
3. 再配合 `worldguard.region.flag.*` 等权限，让玩家自己调 flag

**限制规则**（都可在 config.yml 调整，见 Config 汉化页）：

- **数量**：玩家可拥有区域数的上限由 `regions.max-region-count-per-player` 控制（默认 7，可按权限组分别设置）；拥有 `worldguard.region.unlimited` 权限则不受限
- **体积**：单个认领区域的**体积**不能超过 `regions.max-claim-volume`（默认 30000，即约 30×30×33）；同样受 `worldguard.region.unlimited` 豁免
- **重叠**：认领的区域不能与「自己不是所有者」的已有区域重叠；开启 `regions.claim-only-inside-existing-regions` 后，还必须与已有区域（自己拥有的）重叠才能认领
