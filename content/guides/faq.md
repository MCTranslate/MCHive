---
id: faq
title: 避坑与排错速查
description: 插件冲突速查表 + 常见报错速查 — 出事先 Ctrl+F 搜关键词
icon: 🛟
tags: [排错, FAQ, 避坑]
order: 5
---

# 避坑与排错速查

本文分两部分：**插件冲突速查表**（装之前看）和**常见报错速查**（炸了之后看）。建议加书签，出事直接 Ctrl+F 搜关键词。

## 插件冲突速查表

装插件前先看这张表，能省下几小时的排错时间。

### 高频冲突组合

| 冲突组合 | 症状 | 解决方案 |
|----------|------|----------|
| 两个权限插件（如 LuckPerms + PermissionsEx） | 权限随机失效 | 只留一个，LuckPerms 优先 |
| 两个经济插件（如 EssentialsX Economy + XConomy） | 余额显示错乱 | 只留一个经济实现，其他只当 API 用 |
| 两个登录插件（AuthMe + 其他登录） | 无法登录/数据错乱 | 只留一个 |
| EssentialsX Chat + 其他聊天插件 | 聊天格式打架 | EssentialsX config 里禁用 chat 模块 |
| Multiverse + 其他多世界插件 | 世界创建失败 | 只留一个世界管理器 |
| 组合式传送插件（tpa 类）多个共存 | 命令覆盖 | 留 EssentialsX 的就够 |

### 权限插件冲突的通用判断法

如果出现「给玩家权限但没生效」：

1. 控制台输入 `/lp user 玩家名 info`，看权限是否真的给了
2. 给了但不生效 → 大概率有另一个权限插件在捣乱，`/plugins` 检查
3. 没给上 → 检查权限组继承关系，VIP 组是否继承了 default 组

## 常见报错速查

### 服务器起不来

**报错含 `UnsupportedClassVersionError`**

Java 版本太低。核心需要 Java 21 你却在用 Java 8。解决：装对应版本的 Java（见 [极速开服](#/guide/quick-start) 第 1 步）。

**报错含 `Invalid plugin.yml`**

某个插件的 plugin.yml 坏了——通常是下载的 jar 不完整或者核心版本不兼容。看报错上方一行，有插件名，把它删了或换版本。

**报错含 `Could not load 'plugins/xxx.jar' in folder 'plugins'`**

同上，看插件名。另外检查：这个插件是 Bukkit 系（Paper/Spigot）的 jar 吗？Forge 的 mod jar 丢进 plugins 是加载不了的。

### 游戏内问题

**输入命令提示 `Unknown command` 但插件明明装了**

1. `/plugins` 看插件是不是红色（加载失败）
2. 红色 → 看启动日志里该插件的报错
3. 绿色但命令不可用 → 大概率权限不够，用 OP 号测试：控制台 `op 玩家名`

**玩家反馈「进服就卡」或「区块加载慢」**

1. 装 [spark](https://spark.lucko.me/)，游戏内 `/spark profiler start` 跑 5 分钟再 `/spark profiler stop`，打开链接看哪里耗时
2. 常见元凶：单区块实体过多（挂机塔/刷怪塔）、视野距离太大、地图未预生成
3. 快速缓解：`view-distance` 调到 6-8，装 Chunky 预生成

**TNT/刷怪塔导致卡顿**

实体清理插件没配好。ClearLagg 的默认配置偏保守，手动把实体上限调低，或者直接在 paper 世界配置里限制实体。

**中文在聊天/名牌上乱码**

服务器编码问题。启动参数加 `-Dfile.encoding=UTF-8`：

```bash
java -Dfile.encoding=UTF-8 -Xms4G -Xmx4G -jar server.jar --nogui
```

Windows 下还要确保 `start.bat` 保存为 ANSI 或 UTF-8 编码（记事本另存为时选）。

**装了汉化文件但不生效**

按顺序检查：

1. 文件名对不对？大部分插件要求固定名（如 EssentialsX 要 `zh.yml` 且 config 里 `locale: zh`）
2. 放的目录对不对？是 `plugins/插件名/` 不是 `plugins/` 根目录
3. 重启了吗？改配置文件后必须重启或用插件自己的 reload 命令
4. YML 格式对不对？复制粘贴时中文引号/缩进错误最常见，用 [YAML 校验器](https://www.yamllint.com/) 检查

### 网络问题

**朋友连不上，显示 `Connection refused`**

服务器没开，或者端口没放行。云服务器检查安全组，家宽检查防火墙。

**显示 `Connection timed out`**

IP 打错了，或者内网穿透没跑，或者 IP 是内网的发给了外网的朋友。

**能进服但延迟巨高**

服务器在境外而玩家在国内（或反过来）。物理距离没得救，换服务器位置或加加速器。国内玩家优先选国内/香港节点。

## 排错的通用思路

报错看不懂时，按这个顺序处理：

1. **读日志最后一行**——80% 的关键信息在最后 10 行里，把报错原文复制去搜索引擎
2. **看时间戳**——确认报错发生在什么时候，启动时还是玩家操作时
3. **二分法排查插件**——`plugins` 目录里一次删一半，锁定问题插件
4. **最小可复现**——全新空服 + 只装出问题的插件，如果还炸就是插件本身的问题，找插件作者

## 去哪里求助

- 本站 GitHub 提 Issue：描述问题 + 贴日志
- 插件本身的 bug：去插件的 GitHub Issue 区，用英文或插件作者的语言
- 综合求助：MINECRAFT 论坛、相关 QQ 群（描述清楚 + 附日志，别只发「大佬救命」）