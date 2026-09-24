---
id: placeholderapi
name: PlaceholderAPI
description: 服务器变量的统一接口 — 记分板、Tab 列表、聊天栏里的 %player_name% 这类变量都靠它
category: 开发基础
version: 1.13 - 26.x
tags: [变量, 占位符, 记分板, 美化]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 本插件没有语言文件 — 本页提供常用变量（占位符）的中文注解速查表
---

## PlaceholderAPI 安装教程

### 1. 这个插件解决什么问题

你想让记分板显示玩家余额、让聊天栏显示权限组前缀、让公告自动带服务器在线人数——这些「随时间变化的动态内容」在插件之间没有统一格式，各写各的。PlaceholderAPI（下称 PAPI）定义了统一变量语法 `%变量%`，其他插件接入它之后，就能在各自位置使用同一个变量池。

**一句话理解**：PAPI 本身不产生内容，它是「变量插座」；具体变量由扩展（Expansion）提供。

### 2. 安装

前往 [Modrinth](https://modrinth.com/plugin/placeholderapi) 或 [SpigotMC](https://www.spigotmc.org/resources/placeholderapi.6245/) 下载，放入 `plugins/` 重启。

### 3. 安装扩展（关键步骤）

装完 PAPI 后变量池是空的，要用内置的 eCloud 下载扩展：

```
# 下载 player 扩展（玩家基础信息类变量）
/papi ecloud download player

# 下载 vault 扩展（余额、权限组变量，需先装 Vault）
/papi ecloud download vault

# 下载 server 扩展（在线人数、TPS 等服务器变量）
/papi ecloud download server

# 下载 luckperms 扩展（权限组前缀变量，需先装 LuckPerms）
/papi ecloud download luckperms

# 让扩展生效
/papi reload
```

### 4. 验证变量是否工作

```
# parse 命令会把变量替换成实际内容，是调试利器
/papi parse me 余额: %vault_balance%
```

发出来是 `余额: 12345.0` 就说明变量链路通了；如果原样输出 `%vault_balance%`，说明对应扩展没装。

### 5. 使用场景

几乎所有主流插件都支持 PAPI 变量，常见接入位置：

| 位置 | 代表插件 |
|------|----------|
| 聊天格式 | EssentialsX Chat / ChatControl |
| 记分板侧边栏 | 各类 scoreboard 插件 |
| Tab 列表 | TAB 插件 |
| 全息图 | DecentHolograms |
| 公告/菜单标题 | 各类菜单插件 |

在支持 PAPI 的插件配置里，直接把 `%变量%` 写进文本模板即可。

### 6. 注意事项

> **变量装对服**：群组服架构下，变量在「显示它的那台服务器」上生效。大厅显示在线人数，扩展和 PAPI 就要装在大厅服。

> **依赖前置**：vault 变量需要 Vault，luckperms 变量需要 LuckPerms，缺前置时变量不生效且通常原样输出。

> **变量名区分大小写**，且左右两个 `%` 缺一不可——写错时最常见现象就是「变量原样显示」。
