---
id: vulcan
name: Vulcan
description: 反作弊系统 — 41 项检查覆盖战斗/移动/玩家行为，支持 Folia，需要 PacketEvents 前置，所有消息在 config.yml 中自定义。
category: 安全管理
version: 2.9.7.22（MC 1.13 - 26.x）
tags: [反作弊, 安全, 检查, 防熊]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版（基于 2.9.7.22 真实数据），含 41 项检查与消息自定义
  - id: lang
    name: Lang 说明
    file: lang.md
    description: Vulcan 没有独立语言文件 — 所有消息都在 config.yml 的 messages 段中自定义
downloads:
  - name: config_zh_CN.yml
    description: 完整 config.yml 中文注释版（4193 行，与官方原版逐键对应，注释与 46 条消息全部汉化，可直接覆盖使用）
    path: /downloads/plugins/vulcan/config.yml
---

## Vulcan 安装教程

### 1. 它能做什么

Vulcan 是一款反作弊插件，通过分析玩家行为数据来检测作弊。它包含 **41 项独立检查**，覆盖三大类别：

| 类别 | 检查项数量 | 覆盖内容 |
|------|-----------|----------|
| **Combat（战斗）** | 9 | KillAura、Reach、AutoClicker、Hitbox、Aim、Velocity、FastBow、Criticals、AutoBlock |
| **Movement（移动）** | 18 | Flight、Speed、Jesus、Step、NoSlow、VClip、Strafe、FastClimb、WallClimb、BoatFly、Elytra 等 |
| **Player（玩家行为）** | 14 | BadPackets、Scaffold、Timer、FastBreak、FastPlace、Improbable、GroundSpoof、Tower 等 |

### 2. 硬依赖：PacketEvents

Vulcan 的 `plugin.yml` 写的是 **`depend: [packetevents]`** — 硬依赖，不装 PacketEvents Vulcan 根本不会加载。

- [PacketEvents Releases](https://github.com/retrooper/packetevents/releases)

> 先装 PacketEvents，再装 Vulcan，然后重启服务器。

### 3. 版本与兼容性

当前版本 **2.9.7.22**（jar 文件名写 2.9.7.23，内部版本串为 2.9.7.22），`api-version: 1.13`，**`folia-supported: True`**。

软依赖（可选联动）：PlaceholderAPI、ViaVersion、Floodgate、mcMMO、MythicMobs、LibsDisguises、ProtocolSupport 等。

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| `/vulcan` | 主命令（含所有子命令） |
| `/alerts` | 开关作弊警报（管理员用） |
| `/vulcan profile <玩家>` | 查看玩家的详细违规概况 |
| `/vulcan cps <玩家>` | 查看玩家 CPS（每秒点击数） |
| `/vulcan kb <玩家>` | 执行击退测试 |
| `/logs <玩家>` | 查看玩家的违规日志 |
| `/jday add <玩家>` | 将玩家加入 Judgment Day 列表 |

### 5. 注意事项

> **Vulcan 没有独立语言文件**——所有消息都在 `config.yml` 的 `messages` 段中（46 键），详见 Lang 说明页。

> **Vulcan 支持 Folia**（`folia-supported: True`），但也兼容 Paper / Spigot。

> **软依赖 Floodgate**：如果服务器有基岩玩家（通过 Geyser + Floodgate），Vulcan 默认会忽略基岩玩家（`settings.ignore-floodgate: true`），避免误判基岩版的移动差异。

> **完整汉化配置**：页面底部下载区提供整个 `config.yml` 的中文注释版 `config_zh_CN.yml`——全部注释与 46 条玩家可见消息均已汉化，配置键、结构与默认值和官方原版完全一致，下载后放入 `plugins/Vulcan/` 执行 `/vulcan reload` 即可生效。

## 下一步

- Config 怎么配？→ [Config 汉化](#/plugin/vulcan/config.md)
- 消息怎么改？→ [Lang 说明](#/plugin/vulcan/lang.md)
- 权限怎么分配？→ [权限系统设计](#/guide/permissions-design)
