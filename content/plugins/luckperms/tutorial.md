---
id: luckperms
name: LuckPerms
description: 主流权限管理 — 分组、继承、前缀后缀、跨服同步与可视化编辑器一应俱全，让你精确控制每个玩家能做什么。
category: 权限管理
version: 5.5.85（MC 1.8.9 – 26.3）
tags: [权限, 分组, 前缀, 管理, 必备]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: LuckPerms 自带完整多语言系统，一行命令即可安装中文语言包
  - id: config
    name: Config 汉化
    file: config.md
    description: LuckPerms 配置文件中文注释版，涵盖存储方式与多服务器同步
downloads: []
---

## LuckPerms 安装与基础教程

### 1. 安装

当前最新版本为 **5.5.85**，支持 MC 1.8.9 一直到最新的 26.3。请到官方下载页获取同版本各平台构建：

- 下载页：<https://luckperms.net/download>
- 元数据接口（可查最新版本与直链）：<https://metadata.luckperms.net/data/all>

根据你的服务端核心下载对应的 jar：

| 服务端类型 | 下载版本 |
|------------|----------|
| Spigot / Paper | Bukkit（MC 1.8 ~ 1.12 老版本用 Bukkit-Legacy） |
| BungeeCord | Bungee |
| Velocity | Velocity |
| Sponge | Sponge |
| Fabric | Fabric |
| Forge / NeoForge | Forge / NeoForge |
| Nukkit | Nukkit |

> **注意下载源**：Modrinth 上的 LuckPerms（`v5.5.71-bukkit`）更新慢于官方，常落后好几个版本。请以 **luckperms.net 官方下载页** 为准，不要只从 Modrinth 下载。

将 jar 放入 `plugins/`，重启服务器即可（LuckPerms 的 `plugin.yml` 声明了 `load: STARTUP`，会最先加载）。

### 2. 基础命令

**用户权限管理：**

```
# 给玩家权限
/lp user <玩家> permission set <权限节点> true

# 撤销玩家权限
/lp user <玩家> permission unset <权限节点>

# 查看玩家的所有权限
/lp user <玩家> info
```

**权限组管理：**

```
# 创建权限组
/lp creategroup <组名>

# 给玩家加入组
/lp user <玩家> parent add <组名>

# 设置组权限
/lp group <组名> permission set <权限节点> true

# 设置组优先级（数值大的优先级高）
/lp group <组名> setweight <数字>

# 设置组聊天前缀（<数字> 是优先级）
/lp group <组名> meta setprefix 100 "&a[管理员] "

# 设置组的显示名（部分插件/Vault 会读取，和聊天前缀是两回事）
/lp group <组名> setdisplayname "&a[管理员]"
```

**可视化编辑器：**

```bash
# 打开网页编辑器
/lp editor
```

执行后会在聊天栏打出一个**在线编辑器链接**（指向 `https://luckperms.net/editor/…`，由插件自动生成会话）。把链接发给管理员，用浏览器打开即可可视化编辑权限树；编辑完成后点击保存，改动会通过链接回传服务器。需要手动应用时可用 `/lp applyedits <代码>`。

### 3. LuckPerms 中文（内置）

LuckPerms 自带多语言系统，不需要手动下载汉化（配置项 `auto-install-translations` 默认为 `true`，插件会自动下载并定期更新语言包）。

```bash
# 在控制台执行，手动下载/更新所有语言包
/lp translations install
```

下载后的文件在 `plugins/LuckPerms/translations/repository/` 目录下。玩家的 Minecraft 客户端设为简体中文即可自动生效。

### 4. 多服务器同步

默认 LuckPerms 使用 **H2** 单文件数据库（`storage-method: h2`），单机开箱即用。如果你有多台服务器，建议切换到 MySQL/MariaDB：

```yaml
storage-method: MySQL
data:
  address: localhost:3306
  database: minecraft
  username: root
  password: yourpassword
```

所有服务器使用同一个数据库即可同步权限数据。若要跨服**即时**同步变更，还需要配置消息服务（`messaging-service`）；使用 MySQL/MariaDB 时默认的 `auto` 会自动启用 SQL 消息通道。

> 不用每次添加插件权限就重启服务器。LuckPerms 支持热重载配置，直接执行 `/lp reloadconfig` 即可。
