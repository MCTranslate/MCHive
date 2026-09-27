---
id: dynmap
name: Dynmap
description: 老牌网页地图 — 功能丰富、生态成熟，但**项目已滞后：MC 版本只到 1.21.11，不支持 26.x**。
category: 运维工具
version: 3.8（MC 1.10.2 - 1.21.11）⚠ 不支持 26.x
tags: [地图, 网页, Dynmap, 已过时]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 内置多语言（含简体中文），跟随浏览器语言自动切换
---

## Dynmap 安装教程

### ⚠ 时效性警告：不适用于 Paper 26.x

**Dynmap 最新版 v3.8（2026-01-14）的项目元数据显示 MC 版本只到 1.21.11**——没有 26.x。如果你的服务端是 Paper 26.3，装它属于拿一个自己都不声明支持的版本去赌。

**本站推荐使用 [BlueMap](#/plugin/bluemap)**（2026-09-25，官方声明支持 MC 1.13 – 26.3）。

> 老教程推荐 Dynmap 是因为它在 2024 年之前确实是主流选择。判断方法很简单：去 Modrinth 项目页看 **Game versions** 一栏有没有你要跑的版本号——比任何教程都可靠。

### 如果你仍在 1.21.x 或更老版本上

Dynmap 仍然可用，安装方式如下：

1. 从 [Modrinth](https://modrinth.com/plugin/dynmap) 或 [GitHub](https://github.com/webbukkit/dynmap/releases) 下载
2. 将 jar 放入 `plugins/`，重启服务器
3. 浏览器访问 `http://你的IP:8123/`（默认端口 8123）

### 常用命令

| 命令 | 说明 |
|------|------|
| `/dynmap fullrender <世界>` | 全图渲染 |
| `/dynmap render <世界>` | 增量渲染 |
| `/dynmap pause` | 暂停渲染 |
| `/dynmap reload` | 重载配置 |

### 配置文件

Dynmap 使用 `plugins/Dynmap/configuration.txt`（**不是 YAML**，是 Hocon 风格的旧格式），首次启动自动生成。

### 安全提醒

网页地图等于**把你的地形公开**。用 `render-mask` 或只渲染特定世界可以控制暴露范围。相关安全思路见 [安全加固](#/guide/security-hardening)。

## 下一步

- 你用的是 Paper 26.x？→ 用 [BlueMap](#/plugin/bluemap) 替代
- 渲染导致卡顿？→ [卡顿时怎么查](#/guide/lag-diagnosis)
