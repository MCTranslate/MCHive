---
id: coreprotect
name: CoreProtect
description: 回滚与日志神器 — 记录所有方块与容器操作，被熊了能一键查凶手、一键回滚，也能查谁偷了箱子的东西。
category: 安全管理
version: 24.1（MC 1.16.5 - 26.2）
tags: [查询, 回滚, 防熊, 日志, 监控]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 官方提供简体中文语言包 — 改一行 config.yml 即可切换，另可自制 language.yml 覆盖任意消息
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版（基于 24.1 真实默认值），含 SQLite 换 MySQL 指引
---

## CoreProtect 安装教程

### 1. 这个插件解决什么问题

玩家喊「我被熊了」的时候，你面临三个问题：**谁干的、干了什么、怎么恢复**。CoreProtect 把服务器里每一次方块放置/破坏、箱子存取、点火、TNT 爆炸都记进数据库，事后可以精确查询到人，并**一键回滚到破坏发生前**。

它是公益服、生存服的管理底牌——没有它，处理熊事件全靠猜。

### 2. 版本与下载

当前公开版本是 **24.1**（2026-09-24），支持 **MC 1.16.5 – 26.2**，兼容 Paper / Spigot / Purpur / Folia。下载渠道：

- [Modrinth](https://modrinth.com/plugin/coreprotect)（文件名为 `CoreProtect-CE-24.1.jar`）
- 官网 [coreprotect.net](https://coreprotect.net)
- 源码与更新日志：[GitHub · PlayPro/CoreProtect](https://github.com/PlayPro/CoreProtect)

> **注意**：CoreProtect 官方文档站（含 GitHub 仓库 `docs/` 目录）描述的是**开发分支**，里面的 `database-type`、`duckdb-*`、`clickhouse-*` 等配置项属于**尚未公开发布的 25.x**。在 24.1 上这些键不存在，写了也不会生效——照着官方文档配 24.1 会踩坑，请以本站 Config 页为准。

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。首次启动会自动生成 `config.yml` 并建立数据库（默认内嵌 SQLite，单个文件），无需任何配置即可工作。

> SQLite 的 `plugins/CoreProtect/database.db` 文件就是全部日志，**备份它 = 备份所有记录**。玩家量大（日活 100+）或想用数据库面板备份时再考虑切换 MySQL，见 Config 页。

改完 `config.yml` 不必重启，游戏内或控制台执行 `/co reload` 即可生效。

### 4. 核心工作流：查询模式

输入 `/co inspect`（或简写 `/co i`）进入查询模式，再点/右键即可：

| 操作 | 结果 |
|------|------|
| 左键点方块 | 查看这个方块最近被谁放置、破坏 |
| 右键点箱子等容器 | 查看谁取走/放入了什么物品 |
| 右键点门/按钮 | 查看谁交互过（`a:click` 记录） |
| 再次输入 `/co inspect` | 退出查询模式 |

### 5. 常用命令

CoreProtect 只有一个主命令 `/co`（`/core`、`/coreprotect` 是同一命令的别名，但默认只有 `/co` 对所有玩家开放），所有功能都靠子命令：

| 命令 | 别名 | 说明 |
|------|------|------|
| `/co help` | | 列出全部命令 |
| `/co inspect` | `/co i` | 进入/退出查询模式 |
| `/co lookup <参数>` | `/co l` | 搜索记录 |
| `/co rollback <参数>` | `/co rb` | 回滚（撤销该范围内玩家的操作） |
| `/co restore <参数>` | `/co rs` | 恢复（把回滚过的操作复原，或恢复玩家行为） |
| `/co near` | | 以半径 5 快速查询身边的变化 |
| `/co undo` | | 用相反操作撤销上一次回滚/恢复 |
| `/co purge <参数>` | | 清理旧记录 |
| `/co reload` | | 重载 config.yml |
| `/co status` | | 查看插件版本与状态 |
| `/co consumer` | | 控制台命令：暂停/恢复数据处理队列 |

**参数**（`lookup` / `rollback` / `restore` 通用）：

| 参数 | 含义 | 示例 |
|------|------|------|
| `u:` | 用户，可多选，支持 `#特殊用户` | `u:Steve` / `u:Steve,Alex` / `u:#tnt,#creeper` |
| `t:` | 时间范围，可组合、可小数 | `t:30m` / `t:24h` / `t:7d` / `t:2w,5d` / `t:1h-2h` / `t:2.50h` |
| `r:` | 范围 | `r:20` 半径 20 格 / `r:#world_nether` 指定世界 / `r:#global` 全服 / `r:#worldedit` 用 WorldEdit 选区 |
| `a:` | 行为过滤，`+` 表「只含」、`-` 表「不含」 | `a:block` / `a:+block` 放置 / `a:-block` 破坏 / `a:container` / `a:chat` |
| `i:` | 只包含指定方块/物品/实体 | `i:stone,oak_wood` |
| `e:` | 排除指定方块/物品/实体 | `e:tnt` |
| `#标记` | 附加行为 | `#preview` 预览 / `#count` 只数条数 / `#verbose` / `#silent` |

`a:` 的完整取值：`block`、`chat`、`click`、`command`、`container`、`inventory`、`item`、`kill`、`session`、`sign`、`username`（多数可加 `+`/`-` 前缀）。

**翻页**：结果多于一页时用 `/co lookup <页码>` 翻页，`/co lookup <页码>:<行数>` 指定每页行数，例如 `/co l 1:10`。

### 6. 实战示例

```
# 查最近 30 分钟 Steve 干了什么（lookup 默认搜索全服，不会自动套半径）
/co lookup u:Steve t:30m

# 回滚 Steve 最近 1 小时在半径 50 格内的所有破坏（回滚不写 r: 时默认半径 10）
/co rollback u:Steve t:1h r:50

# 先预览再动手：确认范围无误后去掉 #preview
/co rollback u:Steve t:1h r:50 #preview

# 只回滚 Steve 破坏的石类方块，不动其他
/co rollback u:Steve t:1h i:stone a:-block

# 查全服过去 24 小时所有 TNT 相关操作
/co lookup u:#tnt t:24h r:#global

# 查谁偷了箱子（半径 20 格内的容器存取记录）
/co lookup u:Steve t:3d r:20 a:container

# 撤销上一次回滚
/co undo
```

### 7. 注意事项

> **先查后滚**：回滚前一定先 `/co lookup` 或加 `#preview` 确认范围和对象。回滚本身也会记录，但误伤玩家正常建筑会引发信任危机。

> **`lookup` 和 `rollback` 的默认范围不一样**：不写 `r:` 时，`rollback`/`restore` 会自动套用 `default-radius`（默认 10 格），而 **`lookup` 默认是全服搜索**。查全服回滚也别漏写 `r:#global`。

> **半径有上限**：`max-radius`（默认 100）限制单条命令可用的最大半径，超出会提示 `The maximum radius is 100.`。要绕开半径做全服操作请用 `r:#global`，不要盲目调大 `max-radius`。

> **清理日志有下限**：游戏内执行 `/co purge` 只能清理 **30 天前**的数据，控制台只能清理 **24 小时前**的数据，这是官方的防误删保护。清理期间**不要重启服务器**。

> **回滚不解决地形**：箱子内容可以恢复，但复杂的空岛/地形结构建议配合 WorldEdit 的 `//regen` 或直接回档地图。
