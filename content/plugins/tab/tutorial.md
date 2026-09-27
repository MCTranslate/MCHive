---
id: tab
name: TAB
description: Tab 列表 / 记分板 / BossBar 三合一 — 让侧边栏显示余额、延迟、在线人数，配合 PlaceholderAPI 实现全服信息展示。
category: 美化
version: 6.2.0（MC 1.13 - 26.3）
tags: [Tab, 记分板, BossBar, 美化, PlaceholderAPI]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 说明
    file: config.md
    description: config.yml 关键段中文注释版（基于 6.2.0 真实配置），含 Tab / 记分板 / BossBar 的入口
---

## TAB 安装教程

### 1. 它能做什么

TAB 负责**在界面上展示信息**：Tab 列表的 Header/Footer、侧边栏记分板、BossBar、头顶名字。配合 PlaceholderAPI，可以把余额、TPS、延迟、权限组前缀等信息实时显示在玩家屏幕上。

### 2. 三者关系（与 PlaceholderAPI / LuckPerms 的分工）

| 组件 | 职责 |
|------|------|
| **LuckPerms** | 提供**数据**：前缀、后缀、权限组 |
| **Vault**（可选） | 提供经济数据（余额） |
| **PlaceholderAPI** | 提供**变量**：把数据翻译成 `%xxx%` 占位符的值 |
| **TAB** | 负责**展示**：把变量渲染到 Tab 列表 / 记分板 / BossBar |

> 只装 TAB 不装 PAPI 时，TAB 的**内部变量**（玩家名、延迟、TPS、世界名等）仍可使用。但 PAPI 变量（余额、前缀等）需要 PAPI。

### 3. 版本与下载

当前版本 **6.2.0**（2026-09-17），`api-version: 1.13`，`folia-supported: true`。

- [GitHub Releases](https://github.com/NEZNAMY/TAB/releases)（`TAB.v6.2.0.jar`）
- 配置文件在 `plugins/TAB/` 目录下，首次启动自动生成

### 4. 安装

将 jar 放入 `plugins/`，重启服务器。配置文件在 `plugins/TAB/config.yml`。

**代理安装**：如果使用 Velocity/BungeeCord，将 TAB 安装在**代理**上（推荐），命令变为 `/btab`；后端还需安装 TAB-Bridge 以获得 PAPI 支持。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| `/tab reload` | 重载配置 |
| `/tab player <玩家> <属性> <值>` | 为指定玩家单独设置 |

### 6. 注意事项

> **不要混合安装**：TAB 的官方文档明确说明，在代理和后端**同时安装**（不按规则关闭功能）会导致冲突。选择一种方式即可。

> **配置自动迁移**：升级 TAB 后配置文件格式可能变化，但插件会**自动迁移**旧配置——**不支持降级**。

## 下一步

- 权限怎么分？→ [权限系统设计](#/guide/permissions-design)
- PAPI 变量体系想系统了解？→ [PlaceholderAPI 插件页](#/plugin/placeholderapi)
- 装完一堆插件后要清理？→ [插件组合](#/guide/plugin-combos)
