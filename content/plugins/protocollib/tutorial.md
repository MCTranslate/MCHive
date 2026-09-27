---
id: protocollib
name: ProtocolLib
description: 协议层基础设施 — 让其他插件读取和修改底层网络包，是反作弊、GUI 插件、跨版本插件的前置依赖。
category: 开发前置
version: 5.3.0（MC 1.19.4 - 26.x）
tags: [协议, 前置, 开发, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 说明
    file: config.md
    description: config.yml 关键项中文注释版——绝大多数服主不需要动这个文件
---

## ProtocolLib 安装教程

### 1. 它是什么

ProtocolLib 是一个**给其他插件用的底层库**——它让插件可以监听和修改 Minecraft 的底层网络数据包。你自己通常**不需要配置它**，装上就行。

**哪些插件依赖它**：反作弊（如 Vulcan）、跨版本（Via 系列）、聊天/界面美化、部分商店和传送插件。

### 2. 版本与下载

当前版本 **5.3.0**，支持 MC 1.19.4 – 26.x。

- [GitHub Releases](https://github.com/dmulloy2/ProtocolLib/releases)
- [Modrinth](https://modrinth.com/plugin/protocollib)

### 3. 安装

将 jar 放入 `plugins/`，重启服务器。**没有配置文件需要改**——它是一个被动的依赖库。

### 4. 什么时候需要关注它

| 情况 | 说明 |
|------|------|
| 某插件报 `ProtocolLib not found` | 该插件依赖 ProtocolLib，装上后重启即可 |
| ProtocolLib 版本过旧 | 升级到与你的 MC 版本匹配的 ProtocolLib 版本 |
| 与其他协议插件冲突 | 确认 ViaVersion 的 `loadbefore: [ProtocolLib]` 正常（Bukkit 自动处理） |

### 5. 配置文件

ProtocolLib 的 `config.yml` 在首次启动后生成于 `plugins/ProtocolLib/config.yml`。绝大多数项保持默认即可，**除非插件文档明确要求你改**。最常见的一条是：

```yaml
global:
  auto listener tick delay: 20
```

> **除非你知道自己在做什么，否则不要修改此文件。** 改坏了会导致依赖 ProtocolLib 的插件全部失效。
