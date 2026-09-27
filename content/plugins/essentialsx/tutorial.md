---
id: essentialsx
name: EssentialsX
description: 全能基础功能 — 家、传送、经济、飞行、昵称、邮件、天气与时间控制，生存服必装的瑞士军刀。
category: 功能插件
version: 2.22.0（MC 1.8.8 - 26.1.2）
tags: [经济, 传送, 家, 基础, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 自带完整简体中文（1633 条）— 改一行 locale 即可，无需下载任何语言文件
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版（基于 2.22.0 真实默认值），逐项解释参数含义与推荐值
---

## EssentialsX 安装教程

### 1. 版本与下载

当前稳定版是 **2.22.0**（2026-05-31），支持 **MC 1.8.8 – 26.1.2**，兼容 Paper / Spigot。

前往 [Modrinth](https://modrinth.com/plugin/essentialsx) 或 [SpigotMC](https://www.spigotmc.org/resources/essentialsx.9089/) 下载；更新日志见 [GitHub · EssentialsX/Essentials](https://github.com/EssentialsX/Essentials/releases)。

> 如果你的服务端是更新的 MC 版本（如 26.2+）而 2.22.0 尚未声明支持，请先查看 GitHub Releases 或 Modrinth 上是否有更新的构建，不要硬装不匹配的版本。

### 2. 安装

将 jar 文件放入服务器的 `plugins/` 文件夹，重启服务器。首次启动会生成 `plugins/Essentials/config.yml`。

> 注意目录名是 **`plugins/Essentials/`**（不是 `EssentialsX`），所有配置、语言文件和玩家数据都在这里。装错位置是新手最常见的「改了没生效」原因。

### 3. 汉化（不用下载任何文件）

EssentialsX **自带完整的简体中文翻译**，jar 内就有 `messages_zh.properties`（1633 条，比英文原文还多）。你只需要改一行：

1. 打开 `plugins/Essentials/config.yml`
2. 找到被注释掉的那一行 `#locale: en`（大约在文件中部，"Set the locale for all messages." 注释下方）
3. 去掉行首的 `#`，并把 `en` 改成 `zh`：

```yaml
locale: zh
```

4. 执行 `/ess reload`（`/ess` 是 `/essentials` 的官方别名）或重启服务器

改完后，所有界面提示都会变成中文。想要更细粒度的控制，还有一个开关：

```yaml
per-player-locale: false   # 改为 true：每个玩家按自己客户端的语言显示，控制台保持英文
```

详见「Lang 汉化」页。

### 4. 常用命令

EssentialsX 有 150+ 条命令，新手最常用的是这些：

| 命令 | 说明 |
|------|------|
| `/sethome [名称]` | 设置家 |
| `/home [名称]` | 传送回家 |
| `/delhome <名称>` | 删除家 |
| `/tpa <玩家>` | 请求传送到某玩家 |
| `/tpahere <玩家>` | 请求把某玩家传送到你这里 |
| `/tpaccept` / `/tpdeny` | 接受 / 拒绝传送请求 |
| `/back` | 回到上一个位置（死亡后回原地） |
| `/fly` | 切换飞行模式 |
| `/speed <1-10>` | 调整移动/飞行速度 |
| `/balance` / `/baltop` | 查看余额 / 财富排行 |
| `/pay <玩家> <金额>` | 转账 |
| `/seen <玩家>` | 查看玩家最后上线时间 |
| `/nick <昵称>` | 设置昵称 |
| `/whois <玩家>` | 查看玩家信息 |
| `/ess reload` | 重载配置（改完 config.yml 后用） |

可设置的家数量由 `sethome-multiple` 配合权限节点控制，见 Config 页。

### 5. 关于 Vault

EssentialsX 的经济系统（`/balance`、`/pay`、`/eco`）**不依赖 Vault 也能独立工作**。

Vault 的作用是让**其他插件**（商店、任务、点券类插件）能读到这套经济与权限数据。所以：

- 只有 EssentialsX → **不需要**装 Vault
- 还要装商店 / 任务 / 依赖 Vault 的插件 → 才需要装 Vault
