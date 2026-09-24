---
id: worldguard
name: WorldGuard
description: 区域保护 — 给主城、资源区、玩家领地划定不可建造/不可破坏的安全区，防熊与领地管理的核心插件。
category: 安全管理
tags: [保护, 区域, 领地, 防熊, 编辑]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: Lang 汉化
    file: lang.md
    description: WorldGuard 提示信息中文语言文件
  - id: config
    name: Config 汉化
    file: config.md
    description: WorldGuard 配置文件中文注释版，重点解释玩家圈地数量与面积限制
downloads:
  - name: lang_zh.yml
    description: WorldGuard 中文语言文件
    path: /downloads/plugins/worldguard/lang_zh.yml
---

## WorldGuard 安装与教程

### 1. 前置依赖

确保已安装 [WorldEdit](https://modrinth.com/plugin/worldedit)，WorldGuard 依赖它来处理选区操作。

### 2. 安装

1. 下载 WorldGuard jar 放入 `plugins/`
2. 重启服务器（生成的配置目录在 `plugins/WorldGuard/`）

### 3. 创建保护区

1. 获取选区工具（默认是木斧）：`/wg wand` 或手动拿一个木斧
2. **左键点击方块** 选第一个点，**右键点击方块** 选第二个点，圈出一个立方体
3. 执行 `/region define <区域名>` 创建区域

### 4. 设置权限

```
# 禁止在区域内建造（非成员无法放置/破坏方块）
/region flag <区域名> build deny

# 禁止 PVP
/region flag <区域名> pvp deny

# 进入区域提示
/region flag <区域名> greeting &a欢迎进入安全区！

# 离开区域提示
/region flag <区域名> farewell &7再见！

# 允许某个玩家建造
/region addmember <区域名> <玩家名>
```

### 5. 常用 flag 说明

| Flag | 说明 |
|------|------|
| build | 是否允许建造 |
| pvp | 是否允许 PVP |
| chest-access | 是否允许开箱子 |
| use | 是否允许使用门/按钮等 |
| greeting | 进入提示 |
| farewell | 离开提示 |
| mob-spawning | 是否允许刷怪 |
| creeper-explosion | 苦力怕是否爆炸 |

### 6. 玩家圈地

给玩家 `worldguard.region.claim` 权限后，玩家可以用 `/region claim <名>` 自己创建保护区，
再通过 `/region flag ...` 自行控制权限。

> 建议在 config.yml 中配置玩家可创建的最大区域数量和面积限制。