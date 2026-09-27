---
id: decentholograms
name: DecentHolograms
description: 轻量全息文字 — 不用装额外依赖就能在空中悬浮显示文字与物品图标，建筑服和商店装饰必备。
category: 美化
version: 2.8.11（MC 1.8 - 26.x）
tags: [全息, 装饰, 美化]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: config
    name: Config 说明
    file: config.md
    description: config.yml 关键段中文注释版
---

## DecentHolograms 安装教程

### 1. 它能做什么

在空中悬浮显示文字、物品图标、甚至动态更新内容（如商店余额、排行榜）。**不需要额外的协议库或依赖**，jar 放进去就能用。

### 2. 版本与下载

当前版本 **2.8.11**，开源协议 GPL-3.0，支持 MC 1.8 – 26.x。

- [GitHub Releases](https://github.com/DecentSoftware-eu/DecentHolograms/releases)
- [SpigotMC](https://www.spigotmc.org/resources/decentholograms.25462/)

### 3. 创建全息文字

```
/dh add <名称> <第一行文字>    # 创建全息
/dh addline <名称> <文字>      # 添加一行
/dh remove <名称>              # 删除
/dh movehere <名称>            # 移到你当前位置
/dh setline <名称> <行号> <文字> # 修改指定行
```

**显示物品图标**：在文字行里加入 `[item]` 标记即可。

### 4. 配置

全息内容默认存储在 `plugins/DecentHolograms/holograms.yml`，直接编辑后 `/dh reload` 生效。

### 5. 注意事项

> **全息文字不支持 `&` 颜色代码以外的格式**——不要尝试用 MiniMessage 标签。颜色用 `&a` `&c` 等传统代码。

> **别放在不可交互方块上**——全息文字下方 1-2 格内如果放了按钮/拉杆，玩家点击时可能触发方块而不是全息。

## 下一步

- 装饰建筑？→ [WorldEdit](#/plugin/worldedit) 与 [WorldGuard](#/plugin/worldguard)
- 端口还没开？→ [让外网连上你的服务器](#/guide/port-forwarding)
