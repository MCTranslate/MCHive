---
id: bluemap
name: BlueMap
description: 网页实时地图 — 玩家在浏览器里看整个服务器地形、找建筑、看地形高度图，渲染在后台异步完成。
category: 运维工具
version: 5.28（MC 1.13 - 26.3）
tags: [地图, 网页, 渲染, BlueMap, 运维]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 汉化
    file: config.md
    description: HOCON 配置文件中文注释版（基于 5.28 真实默认值），含 Web 端口与渲染线程
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 网页地图界面自带多语言，跟随浏览器语言自动切换
---

## BlueMap 安装教程

### 1. 它能做什么、代价是什么

BlueMap 把你的世界渲染成网页 3D/2D 地图，玩家在浏览器里就能看到整个服务器的地形、建筑、玩家标记。

**代价**：渲染结果会占用磁盘（大小取决于世界面积）；首次全图渲染会吃 CPU（后台异步，不影响 TPS）；网页地图等于**把你的地形公开**——涉及隐私和防盗。

### 2. 版本核对（为什么选 BlueMap 不选 Dynmap）

BlueMap 5.28-paper（2026-09-25 发布），**官方声明支持 MC 1.13 – 26.3**，兼容 Paper / Purpur / Spigot / Folia。

**Dynmap 最新 v3.8**（2026-01-14）的 MC 版本**只到 1.21.11**——不覆盖 26.x。老教程普遍推荐 Dynmap，那是 2024 年的正确建议，2026 年已经不是了。

- [Modrinth](https://modrinth.com/plugin/bluemap)（文件名 `bluemap-5.28-paper.jar`）
- [GitHub](https://github.com/BlueMap-Minecraft/BlueMap/releases)

### 3. 安装与配置

⚠ **BlueMap 的配置文件是 HOCON 格式（不是 YAML）**，层级用点号而非缩进。

1. 将 jar 放入 `plugins/`，重启服务器
2. 首次启动会生成 `plugins/BlueMap/core.conf` 等配置文件
3. 打开 `core.conf`，找到 `accept-download`，改为 `true`（允许下载渲染所需的资源文件）
4. 执行 `/bluemap reload`，渲染自动开始

**查看进度**：控制台执行 `/bluemap` 即可看到剩余时间预估。

**打开地图**：浏览器访问 `http://你的IP:8100/`（内置 Web 服务默认端口 **8100**）。

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| `/bluemap` | 查看渲染状态与剩余时间 |
| `/bluemap reload` | 重载全部配置 |
| `/bluemap maps` | 列出已注册的地图 |
| `/bluemap pause` / `resume` | 暂停 / 恢复渲染 |
| `/bluemap force-update <世界>` | 强制重新渲染某世界 |
| `/bluemap freeze <世界>` | 冻结某世界（不渲染变化） |

### 5. 对外访问

内置 Web 服务**不支持 HTTPS**，也**没有内置认证**。生产环境建议：

1. 用 nginx/Caddy 反向代理（官方 wiki 有示例：`proxy_pass http://127.0.0.1:8100/;`）
2. 在 `webserver.conf` 里把监听地址改为 `127.0.0.1`，只允许反代访问
3. 加 HTTPS 证书

### 6. 安全提醒

网页地图等于**把你的地形公开**。如果玩家在偏远地区建了秘密基地，网页地图上会一目了然。BlueMap 可以设置只渲染已探索区域，配合 `render-mask` 可以隐藏特定区域——但**默认是全图公开的**。

## 下一步

- 磁盘空间不够了？→ [服务器日常运维手册](#/guide/server-maintenance) 的磁盘管理章节
- 渲染导致卡顿？→ [卡顿时怎么查](#/guide/lag-diagnosis) 定位问题
- 想保护玩家的秘密基地？→ [领地与保护实战](#/guide/region-protection)
