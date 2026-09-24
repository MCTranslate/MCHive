---
id: luckperms
name: LuckPerms
description: 主流的权限管理插件 — 分组、继承、跨服同步与可视化编辑器一应俱全
category: 基础工具
tags: [权限, 分组, 管理]
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

根据你的服务端核心下载对应的 jar：

| 服务端类型 | 下载版本 |
|------------|----------|
| Spigot / Paper | Bukkit |
| BungeeCord | Bungee |
| Velocity | Velocity |
| Sponge | Sponge |
| Fabric | Fabric |
| Forge | Forge |
| Nukkit | Nukkit |

将 jar 放入 `plugins/`，重启服务器。

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

# 设置组前缀
/lp group <组名> setdisplayname &a[管理员] &f<玩家名>
```

**可视化编辑器：**

```bash
# 打开网页编辑器（自动分配端口）
/lp editor
```

这将生成一个本地 URL（如 `http://localhost:xxxx`），在浏览器中即可可视化编辑权限树。

### 3. LuckPerms 中文（内置）

LuckPerms 自带多语言系统，不需要手动下载汉化。

```bash
# 在控制台执行一键下载所有语言包
/lp translations install
```

下载后的文件在 `plugins/LuckPerms/translations/` 目录下。玩家的 Minecraft 客户端设为简体中文即可自动生效。

### 4. 多服务器同步

默认 LuckPerms 使用 SQLite 单文件数据库。如果你有多台服务器，建议切换到 MySQL：

```yaml
storage-method: MySQL
data:
  address: localhost:3306
  database: minecraft
  username: root
  password: yourpassword
```

所有服务器使用同一个 MySQL 数据库即可自动同步权限。

> 不用每次添加插件权限就重启服务器。LuckPerms 支持热重载，直接 `/lp reload` 即可。