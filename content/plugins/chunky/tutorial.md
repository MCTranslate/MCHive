---
id: chunky
name: Chunky
description: 地图预生成 — 让服务器提前把世界区块生成好，玩家跑图时不再卡顿，新服必装。
category: 运维工具
version: 1.4.16（MC 1.19.4 - 26.x）
tags: [预生成, 性能, 运维, 区块]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## Chunky 安装教程

### 1. 它解决什么问题

玩家第一次跑到某个区域时，服务器要**现场生成区块**——这一瞬间会卡顿（所有在线玩家都能感受到 TPS 掉落）。Chunky 让你**提前把整个世界生成好**，玩家跑到任何地方都不会触发新区块生成。

**新服强烈推荐在开放前预生成**，与 [性能调优](#/guide/performance-tuning) 配合使用。

### 2. 安装

- [Modrinth](https://modrinth.com/plugin/chunky) 或 [GitHub](https://github.com/pop4959/Chunky/releases)
- 将 jar 放入 `plugins/`，重启服务器

### 3. 预生成世界

```bash
# 1. 设定预生成的中心点（站在出生点执行）
/chunky center

# 2. 设定预生成的半径（单位：区块；256 个区块 ≈ 4096 格）
/chunky radius 256

# 3. 开始预生成
/chunky start

# 4. 查看进度（控制台会实时输出）
/chunky status

# 5. 需要暂停或继续
/chunky pause
/chunky continue
```

> 预生成**可以在服务器运行时进行**，但会占用 CPU 和磁盘 I/O——建议在**玩家少的时段**执行。

### 4. 预生成多大合适

| 场景 | 建议半径（区块） | 实际范围 |
|------|-----------------|----------|
| 小圈子服（5 人以下） | 128 | 约 ±2048 格 |
| 中型生存服（10-30 人） | 256 | 约 ±4096 格 |
| 大型公益服 | 512 | 约 ±8192 格 |

> 半径 256 的世界预生成大约需要 30 分钟到 2 小时（取决于硬件）。**不需要把全世界都预生成**——玩家跑不到那么远。

### 5. 注意事项

> **预生成期间不要动 `view-distance`**——改了会导致部分区块需要重新生成。

> **多世界**：每个世界需要分别预生成。先用 `/chunky world <世界名>` 切换目标世界，再设中心和半径。

> **磁盘空间**：预生成会大量写盘，确保磁盘有足够的空闲空间（一个 256 半径的世界约占 1-3 GB）。

## 下一步

- 预生成完之后的性能调优：[性能调优从入门到精通](#/guide/performance-tuning)
- 预生成时卡顿了？→ [卡顿时怎么查](#/guide/lag-diagnosis)
- 多世界分别预生成？→ [多世界与主城实战](#/guide/multi-world-setup)
