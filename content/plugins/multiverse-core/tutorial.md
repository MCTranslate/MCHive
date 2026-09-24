---
id: multiverse-core
name: Multiverse-Core
description: 一条命令创建 / 导入 / 管理多个世界 — 主城、资源世界、地皮世界管理必备，5.x 已全面重构
category: 世界管理
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

前往 [Modrinth](https://modrinth.com/plugin/multiverse-core) 或 [GitHub Releases](https://github.com/Multiverse/Multiverse-Core/releases) 下载 5.x 版本（大重构后的新架构，持续维护）。

常用附属插件（按需）：

| 附属 | 作用 |
|------|------|
| Multiverse-Portals | 自建传送门，跨世界交通 |
| Multiverse-NetherPortals | 每个主世界配对独立的下界/末地 |
| Multiverse-Inventories | 每个世界独立背包与数据 |

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。

### 4. 常用命令

| 命令 | 说明 |
|------|------|
| /mv list | 列出所有已加载世界 |
| /mv create <世界名> normal | 创建普通世界（把 normal 换成 nether / end / void 创建下界、末地、虚空世界） |
| /mv create <世界名> normal -t flat | 创建超平坦世界 |
| /mv create <世界名> normal -s <种子> | 用指定种子创建 |
| /mv import <世界名> normal | 导入已存在于服务端目录的世界文件夹 |
| /mv tp <世界名> | 传送到某世界 |
| /mv info <世界名> | 查看世界属性详情 |
| /mv setspawn | 把当前位置设为该世界出生点 |
| /mv delete <世界名> | 删除世界（**不可恢复**，需 /mv confirm 确认） |
| /mv remove <世界名> | 只卸载不删文件（安全得多） |
| /mv reload | 重载配置 |

### 5. 新手最常做的三件事

**给世界取中文名**：打开 `plugins/Multiverse-Core/worlds.yml`，找到对应世界的 `alias` 直接填中文（如 `alias: '生存世界'`），游戏内传送提示就会显示中文别名。配合本站 luckperms 等教程中提到的 Tab 列表插件效果更好。

**单世界关 PVP**：worlds.yml 中把该世界的 `pvp` 改为 `false`，比改原版 gamerule 更直观，且只影响该世界。详见下方 Config 汉化页。

**给世界换难度**：worlds.yml 中修改 `difficulty`（peaceful / easy / normal / hard），同样只影响该世界。

### 6. 注意事项

> **删除世界是物理删除**：`/mv delete` 会直接删掉世界文件夹，地图无了就是真没了。只想让世界暂时消失用 `/mv remove`。

> **世界名别用中文**：世界文件夹名必须是合法文件名，中文别名请通过 alias 设置，世界名保持英文小写。

> **备份优先**：大规模调整世界属性前，先停服备份 worlds.yml 和世界文件夹。
