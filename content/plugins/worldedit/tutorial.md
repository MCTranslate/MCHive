---
id: worldedit
name: WorldEdit
description: 建筑与地形编辑 — 选区、批量填充、复制粘贴建筑、球体圆柱生成，也是 WorldGuard 的前置依赖。
category: 建筑工具
tags: [建筑, 选区, 地形, 修复, 创造]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: 自带多语言（含简体中文），自动跟随玩家客户端语言 — 无需下载任何语言文件
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

同时它是 **WorldGuard 的前置**——装 WorldGuard 必须先装 WorldEdit。

### 2. 下载

前往 [Modrinth](https://modrinth.com/plugin/worldedit) 或 [EngineHub 官网](https://enginehub.org/worldedit) 下载与你服务端版本匹配的 jar。

> 提示：网络上流行的 **FAWE（FastAsyncWorldEdit）** 是 WorldEdit 的异步优化分支，大批量操作不卡服。新手可以先装原版 WorldEdit 跑通流程，等服内经常出现超大范围操作（几万格以上）再考虑换 FAWE，两者命令完全一致。

### 3. 安装

将 jar 放入 `plugins/` 文件夹，重启服务器。

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
| //set <方块> | 选区全部填成指定方块 |
| //replace <旧> <新> | 把选区内的旧方块替换成新方块 |
| //walls <方块> | 沿选区边缘建墙 |
| //copy / //paste | 复制 / 粘贴选区（以你当前站位为锚点） |
| //cut | 剪切选区 |
| //undo / //redo | 撤销 / 重做（救命用） |
| //sphere <方块> <半径> | 生成实心球 |
| //hcyl <方块> <半径> [高度] | 生成空心圆柱（塔、烟囱常用） |
| //regen | 选区恢复为地形原样（修复被熊区域神器） |
| //schematic save <名> / //schematic load <名> | 保存 / 加载建筑文件 |

> 注意是 **两个斜杠** `//`。在控制台执行时用 `worldedit:/set` 或加 `/` 前缀均可。

### 6. 注意事项

> **操作上限**：默认配置下单次操作的方块数不受限制，一次 `//set` 几十万格会直接卡死服务器。强烈建议按下方 Config 汉化页设置 `max-blocks-changed` 上限。

> **权限**：WorldEdit 默认只给 OP。用 LuckPerms 分组管理时，给管理组 `worldedit.*` 权限，千万别给普通玩家——它能改地形，也就熊得了地形。

> **修复被熊区域**：配合 CoreProtect 查出破坏范围，再用 `//regen` 或备份的 schematic 恢复，是标准处理流程。
