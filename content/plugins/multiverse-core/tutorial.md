---
id: multiverse-core
name: Multiverse-Core
description: 一条命令创建 / 导入 / 管理多个世界 — 主城、资源世界、地皮世界管理必备，5.x 已全面重构
category: 世界管理
version: 5.8.1（MC 26.1.2 – 26.3）
tags: [多世界, 出生点, 传送门, 维度]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: jar 内置简体中文语言包，自动跟随玩家客户端 — 无需下载任何语言文件
  - id: config
    name: Config 汉化
    file: config.md
    description: worlds.yml（每个世界的属性表）中文注释版 — 改世界别名、PVP、难度看这里
---

## Multiverse-Core 安装教程

### 1. 这个插件解决什么问题

一个服务器往往不止一个世界：出生主城、纯生存资源世界、下界、末地、建筑服的地皮世界……原版 server.properties 只有一个主世界。Multiverse-Core 让你**用命令直接创建、删除、传送、管理任意多个世界**，还能给每个世界单独设置别名、难度、PVP、怪物生成、进入收费等属性。

### 2. 下载

当前版本 **5.8.1**，支持 Paper 26.1.2 / 26.2 / 26.3（jar 内 `api-version: 1.13`，老版本核心也能带，但 5.x 是适配新版本的重构版）。

前往 [Modrinth](https://modrinth.com/plugin/multiverse-core) 或 [GitHub Releases](https://github.com/Multiverse/Multiverse-Core/releases) 下载 5.x 版本（大重构后的新架构，持续维护）。

常用附属插件（按需）：

| 附属 | 作用 |
|------|------|
| Multiverse-Portals | 自建传送门，跨世界交通 |
| Multiverse-NetherPortals | 每个主世界配对独立的下界/末地 |
| Multiverse-Inventories | 每个世界独立背包与数据 |

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。首次启动会生成 `plugins/Multiverse-Core/` 目录（含 `config.yml` 与 `worlds.yml`）。

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| /mv list | 列出所有已加载世界 |
| /mv create <世界名> <环境> | 创建世界。环境取 `normal` / `nether` / `the_end` |
| /mv create <世界名> normal -t flat | 创建超平坦世界（`-t` 即 `--world-type`，取值 flat / amplified / large_biomes / normal） |
| /mv create <世界名> normal -s <种子> | 用指定种子创建（`-s` 即 `--seed`） |
| /mv import <世界名> <环境> | 导入已存在于服务端目录的世界文件夹 |
| /mv tp <世界名> | 传送到某世界（也可传送到玩家/锚点） |
| /mv info <世界名> | 查看世界属性详情 |
| /mv setspawn | 把当前位置设为该世界出生点 |
| /mv delete <世界名> | 删除世界（**连世界文件夹一起物理删除，不可恢复**，需再执行 /mv confirm 确认） |
| /mv remove <世界名> | 卸载世界并从 worlds.yml 中移除，**世界文件夹保留**（安全得多） |
| /mv unload <世界名> | 只卸载，保留 worlds.yml 配置 |
| /mv reload | 重载配置文件 |

> 5.x 把旧命令也保留为别名：`mvcreate` / `mvc`、`mvimport`、`mvtp`、`mvinfo`、`mvremove`、`mvdelete`、`mvreload` 等。

### 5. 新手最常做的三件事

**给世界取中文名**：打开 `plugins/Multiverse-Core/worlds.yml`，找到对应世界（顶层键就是世界名），直接给它的 `alias` 填中文（如 `alias: '生存世界'`），游戏内传送提示就会显示中文别名。别名支持 `&` 颜色代码。

**单世界关 PVP**：worlds.yml 中把该世界的 `pvp` 改为 `false`，比改原版 gamerule 更直观，且只影响该世界。详见下方 Config 汉化页。

**给世界换难度**：worlds.yml 中修改 `difficulty`（normal / easy / peaceful / hard），同样只影响该世界。

> **注意字段名写法**：5.x 的世界配置字段是**小写短横线**风格（`allow-weather`、`auto-heal`、`respawn-world`、`keep-spawn-in-memory` …）。网上不少 4.x/旧版教程写的是驼峰名（`allowWeather`、`autoHeal`），5.x 会自动迁移一次，但请以本站 Config 汉化页为准。

### 6. 注意事项

> **删除世界是物理删除**：`/mv delete` 会直接删掉世界文件夹，地图没了就是真没了，只在你想彻底清理时用。只想让世界暂时消失用 `/mv unload`，想连配置一起清掉用 `/mv remove`。

> **世界名别用中文**：世界名必须是合法的命名空间键，只允许小写字母、数字以及 `. _ - /` 等字符（输入的大写会被自动转成小写），**不能含中文或空格**。中文显示名请通过 `alias` 设置。

> **备份优先**：大规模调整世界属性前，先停服备份 worlds.yml 和世界文件夹。
