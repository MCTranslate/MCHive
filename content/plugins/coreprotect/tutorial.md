---
id: coreprotect
name: CoreProtect
description: 回滚与日志神器 — 记录所有方块与容器操作，被熊了能一键查凶手、一键回滚，也能查谁偷了箱子的东西。
category: 安全管理
tags: [查询, 回滚, 防熊, 日志, 监控]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 官方暂无简体中文界面 — 本页提供查询结果与消息的逐项中文对照注解
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版，含 SQLite 换 MySQL 指引
---

## CoreProtect 安装教程

### 1. 这个插件解决什么问题

玩家喊「我被熊了」的时候，你面临三个问题：**谁干的、干了什么、怎么恢复**。CoreProtect 把服务器里每一次方块放置/破坏、箱子存取、点火、TNT 爆炸都记进数据库，事后可以精确查询到人，并**一键回滚到破坏发生前**。

它是公益服、生存服的管理底牌——没有它，处理熊事件全靠猜。

### 2. 下载

前往 [Modrinth](https://modrinth.com/plugin/coreprotect) 或官网 coreprotect.net 下载。

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。首次启动会自动建立数据库（默认 SQLite，单个文件），无需任何配置即可工作。

> 玩家量大后再考虑切换 MySQL，见 Config 汉化页。SQLite 的 `database.db` 文件就是全部日志，**备份它 = 备份所有记录**。

### 4. 核心工作流：查询模式

输入 `/co inspect`（或简写 `/co i`）进入查询模式，再点/右键即可：

| 操作 | 结果 |
|------|------|
| 左键点方块 | 查看这个方块最近被谁放置、破坏 |
| 右键点箱子等容器 | 查看谁取走/放入了什么物品 |
| 右键点门/按钮 | 查看谁交互过 |
| 再次输入 /co inspect | 退出查询模式 |

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| /co i | 进入/退出查询模式 |
| /co lookup u:<玩家> t:<时间> r:<半径> | 搜索记录 |
| /co rollback u:<玩家> t:<时间> r:<半径> | 回滚（撤销该范围内玩家的操作） |
| /co restore u:<玩家> t:<时间> r:<半径> | 恢复（把回滚过的操作复原回来，撤销回滚用） |
| /co purge t:30d | 清理 30 天前的记录（定期跑，控制数据库体积） |

**参数含义**（所有查询/回滚命令通用）：

| 参数 | 含义 | 示例 |
|------|------|------|
| u: | 用户名 | u:Steve |
| t: | 时间范围 | t:10m 十分钟 / t:24h 一天 / t:7d 七天 |
| r: | 范围 | r:20 半径 20 格 / r:world 世界 / r:#global 全服 |
| a: | 行为过滤 | a:block 方块 / a:chat 聊天 / a:container 容器 |
| b: | 方块过滤 | b:tnt 只查 TNT 相关 |

**实战示例**：

```
# 查最近30分钟 Steve 在你半径20格内干了什么
/co lookup u:Steve t:30m r:20

# 查全服过去24小时所有 TNT 相关操作
/co lookup b:tnt t:24h r:#global

# 回滚 Steve 最近1小时在半径50格内的所有破坏
/co rollback u:Steve t:1h r:50
```

### 6. 注意事项

> **先查后滚**：回滚前一定先 `/co lookup` 确认范围和对象，回滚本身也会记录，但误伤玩家正常建筑会引发信任危机。

> **回滚不会恢复容器内物品的"设计感"**：箱子内容可以恢复，但复杂的空岛/地形结构建议配合 WorldEdit 的 `//regen` 或备份使用。

> **不要用 /co purge 超长保留**：日志越久越利于翻旧账，一般保留 60-90 天，清理动作放在凌晨低峰期执行。
