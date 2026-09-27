---
id: worldedit
name: WorldEdit
description: 建筑与地形编辑 — 选区、批量填充、复制粘贴建筑、球体圆柱生成，也是 WorldGuard 的前置依赖。
category: 建筑工具
version: 7.4.5 / 7.4.6-beta-02（MC 1.21.4 - 26.3）
tags: [建筑, 选区, 地形, 修复, 创造]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 自带多语言（含简体中文），自动跟随玩家客户端语言 — 一般无需下载语言文件
  - id: config
    name: Config 汉化
    file: config.md
    description: config.yml 常用项中文注释版，重点讲解操作上限设置防止卡服
---

## WorldEdit 安装教程

### 1. 这个插件解决什么问题

原版 Minecraft 里想填平一片地、复制一栋楼、修复一个被炸的坑，只能一格一格挖。WorldEdit 让你**框选一片区域，一条命令批量操作**：

- 圈出 100x100 的地面，一条命令全部换成草方块
- 复制一栋建筑，粘贴到 500 格外的另一个世界
- 玩家炸了主城？框选区域一条命令恢复原样

同时它是 **WorldGuard 的前置**——WorldGuard 的 `plugin.yml` 里写着 `depend: [WorldEdit]`（硬依赖），装 WorldGuard 必须先装 WorldEdit。

### 2. 选哪个版本（先看这里）

去 [Modrinth](https://modrinth.com/plugin/worldedit) 或 [EngineHub 官网](https://enginehub.org/worldedit) 下载，注意 **Bukkit 系（Paper/Spigot/Folia）构建** 与你服务端 MC 版本要匹配：

| 你的服务端 MC 版本 | 该下载的构建 | 说明 |
|--------------------|--------------|------|
| 1.21.4 – 26.2 | **7.4.5**（稳定版） | 2026-08-09 发布，官方标注支持 MC 1.21.4–26.2 |
| 26.3 | **7.4.6-beta-02**（测试版） | 2026-09-24 发布，是支持 26.3 的测试版系列（另有 7.4.6-beta-01，2026-09-21）；稳定版 7.4.5 只标到 26.2 |

> 该 jar 的内部版本串为 `7.4.5+7590-b8dc4c1`，`plugin.yml` 的 `api-version: 1.21.4`，即服务端至少要是 MC 1.21.4；同时它对 **Folia** 也有官方支持（`folia-supported: true`）。

> 提示：网络上流行的 **FAWE（FastAsyncWorldEdit）** 是 WorldEdit 的异步优化分支，大批量操作不卡服。新手可以先装原版 WorldEdit 跑通流程，等服内经常出现超大范围操作（几万格以上）再考虑换 FAWE，两者命令基本一致。

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。WorldEdit 会在启动阶段加载（`load: STARTUP`），装好后生成 `plugins/WorldEdit/config.yml`。

### 4. 选区三步走（新手必会）

1. 输入 `//wand` 获取选区工具（默认是木斧，也可以直接用木斧）
2. **左键**点击一个方块，设置第一个选点（pos1）
3. **右键**点击另一个方块，设置第二个选点（pos2）

两点之间的长方体区域就是你的选区。嫌木斧麻烦可以用 `//pos1` / `//pos2` 以你站的位置设点，或 `//hpos1` / `//hpos2` 指着哪就选哪。

### 5. 常用命令

| 命令 | 说明 |
|------|------|
| //wand | 获取选区工具（木斧） |
| //pos1 / //pos2 | 以脚下位置设置选点 |
| //hpos1 / //hpos2 | 以准星指向的方块设置选点 |
| //set <方块> | 选区全部填成指定方块 |
| //replace <旧> <新> | 把选区内的旧方块替换成新方块 |
| //walls <方块> | 沿选区边缘建墙 |
| //copy / //paste | 复制 / 粘贴选区（以你当前站位为锚点） |
| //cut | 剪切选区 |
| //undo / //redo | 撤销 / 重做（救命用） |
| //sphere <方块> <半径> | 生成实心球 |
| //hcyl <方块> <半径> [高度] | 生成空心圆柱（塔、烟囱常用） |
| //regen | 选区恢复为地形原样（修复被熊区域神器） |
| //schem save <名> / //schem load <名> | 保存 / 加载建筑文件（`//schematic` 是同名别名） |

> 注意命令是 **两个斜杠** `//`——WorldEdit 的命令名本身自带一个斜杠，所以你手输时要写两个。

### 6. 注意事项

> **操作上限**：默认配置下 `limits.max-blocks-changed.default` 为 `-1`（不限制），也就是一次 `//set` 几十万格会直接卡死服务器。强烈建议按下方 Config 汉化页把它改成具体数值（例如几千到几万），管理员临时需要大范围操作时用 `//limit` 提高（受 `worldedit.limit` 权限约束）。

> **权限**：WorldEdit 的 `plugin.yml` 没有声明默认权限，因此所有命令默认只给 OP。用 LuckPerms 分组管理时，给管理组 `worldedit.*` 权限，千万别给普通玩家——它能改地形，也就熊得了地形。

> **修复被熊区域**：配合 CoreProtect 查出破坏范围，再用 `//regen` 或备份的 schematic 恢复，是标准处理流程。
