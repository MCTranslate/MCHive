---
id: viaversion
name: ViaVersion
description: 让新版客户端连接老服务端 — 服务器升版本时不想丢玩家？这个插件让新客户端也能进旧服务端。
category: 跨版本
version: 5.12.0（MC 1.8.9 - 26.3）
tags: [跨版本, 兼容, 客户端, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版（基于 5.12.x 真实默认值），含已废弃的旧键对照
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 自带 146 种语言（含 zh-CN/strings.json），跟随玩家客户端语言自动切换
---

## ViaVersion 安装教程

### 1. 先分清方向（最容易搞反）

ViaVersion 的职责是：**让新客户端连接老服务端**。如果你的服务端是 26.3、玩家客户端是 1.21.x，你需要的是 **ViaBackwards**，不是 ViaVersion。

| 你的场景 | 该装的插件 |
|----------|-----------|
| 服务端 26.3，玩家客户端 1.21.x | ViaVersion + **ViaBackwards** |
| 服务端 1.21.x，玩家客户端 26.3 | **ViaVersion** |
| 服务端 26.3，玩家客户端 1.8/1.7 | ViaVersion + ViaBackwards + **ViaRewind** |

详细的方向说明与选型建议见 [客户端版本兼容策略](#/guide/version-compat)。

### 2. 版本与下载

当前稳定版 **5.12.0**（2026-09-18），支持 MC **1.8.9 – 26.3**。

- [Modrinth](https://modrinth.com/plugin/viaversion)
- [Hangar](https://hangar.papermc.io/ViaVersion/ViaVersion)

> **发布节奏**：MC 更新后通常需要等一两天，跨版本插件才会发布支持版本——这是正常现象，不是配置错误。

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。首次启动会生成 `plugins/ViaVersion/config.yml`。

**ViaBackwards 依赖 ViaVersion**，两者必须同时安装（顺序无关，Bukkit 自动处理）。

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| `/viaversion list` | 列出所有在线玩家及其客户端版本 |
| `/viaversion player <玩家>` | 查看单个玩家的连接详情 |
| `/viaversion pps` | 查看每秒包数统计 |
| `/viaversion reload` | 重载配置 |

### 5. 注意事项

> **与 ProtocolLib 的关系**：ViaVersion 的 `plugin.yml` 写着 `loadbefore: [ProtocolLib]`——ViaVersion 必须在 ProtocolLib **之前**加载，Bukkit 自动处理，你不需要手动调整。

> **不要在生电服上装**：跨版本会让依赖精确时序的红石机器表现不一致。

## 下一步

- 需要老客户端进新服？→ [客户端版本兼容策略](#/guide/version-compat)
- 服务端该选哪个核心？→ [核心怎么选](#/guide/choose-core)
