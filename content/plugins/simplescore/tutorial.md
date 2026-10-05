---
id: simplescore
name: SimpleScore
description: 动态记分板 — 侧边栏动画显示信息，按世界/权限/WorldGuard 区域自动切换，能拉 PlaceholderAPI 变量。4.x 是不兼容重构，升 v3 要小心。
category: 菜单界面
version: 4.3.1（MC 1.10.2 - 26.2）
tags: [记分板, 侧边栏, HUD, 变量, WorldGuard]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
---

## SimpleScore 安装教程

### 1. 它是什么

SimpleScore 用来管**侧边栏那个记分板**（Tab 键旁边的那个列表）——显示什么、多久刷新、在哪些世界显示、谁能看到。

和 TAB 插件的区别先说清楚，否则装错：

| | SimpleScore | TAB |
|---|------------|-----|
| 位置 | **游戏内左侧**侧边栏 | 屏幕**顶部**（Tab 列表）+ 底部 |
| 典型用途 | 血量、位置、经济、当前任务、LAP | 玩家列表、rank 前缀、服务器列表 |
| 谁负责 | 这个 | 那个 |

**两个不是替代关系。** 很多服两个都装，各管一摊。这也意味着你该先想清楚自己要显示在哪，而不是照着「记分板」这名字乱搜。

### 2. 三个配置文件

SimpleScore 用三个文件管理，这套结构比很多同类插件清晰：

| 文件 | 管什么 |
|------|--------|
| `config.yml` | 全局设置：更新检查、调试、默认记分板 |
| `scoreboards.yml` | **记分板定义**：标题、行内容、刷新间隔、触发条件 |
| `conditions.yml` | **显示条件**：按世界、权限、游戏模式决定何时显示哪个 |

**逻辑链**：条件判断「谁在什么情况下该看什么」→ 满足则显示 `scoreboards.yml` 里对应的那块板。

### 3. 装之前的重要警告：4.x 是不兼容重构

**SimpleScore 4.0 是一次大重构，官方明确说明配置不向后兼容。**

```
v4.0.0 changelog（官方原文大意）：
- 移除了对 ProtocolLib 的依赖
- 移除旧版存储系统
- 如果你需要旧版存储系统，请继续用 v3 直到 v4 完整发布
- 重构了代码库，配置不兼容
```

**如果你现在是 v3：**

1. **备份 `plugins/SimpleScore/` 整个目录**
2. 读一遍 v4 的迁移说明
3. 确认你用的功能在 v4 里还在

**尤其注意存储系统。** v3 有数据存储，v4 重写时**一度缺失**——官方当时直接建议「需要这功能就继续用 v3」。你现在的 `4.3.1` 之后应该补上了，但升级前务必确认自己依赖的功能还在。

### 4. 前置条件

| 要求 | 说明 |
|------|------|
| 服务端 | Paper / Spigot / Purpur（4.x 起支持 Folia） |
| 硬依赖 | **无**（4.x 起不再需要 ProtocolLib） |
| 可选 | PlaceholderAPI、MVdWPlaceholderAPI、WorldGuard、mcMMO |

> ⚠️ **v3 时代 ProtocolLib 是可选的软依赖，用了能减少发包量。v4 已经移除了这个依赖。** 如果你是从 v3 升级，配置里和 ProtocolLib 相关的部分要清掉。

### 5. 安装

- 仓库：<https://github.com/Necnion8/SimpleScore>
- Modrinth / SpigotMC / PaperMC 都有发布

jar 丢进 `plugins/`，重启，生成 `plugins/SimpleScore/`。

### 6. 内置变量（不装 PAPI 也能用）

SimpleScore 自带一批变量，这些**不需要 PlaceholderAPI**：

| 变量 | 含义 |
|------|------|
| `%online%` | 全服在线人数 |
| `%onworld%` | 当前世界在线人数 |
| `%world%` | 当前世界名 |
| `%maxplayers%` | 最大人数 |
| `%player%` | 玩家名 |
| `%displayname%` | 玩家显示名 |
| `%health%` | 当前血量（数值） |
| `%maxhealth%` | 血量上限（数值） |
| `%hearts%` | 血量（心形显示） |
| `%level%` | 经验等级 |
| `%gamemode%` | 游戏模式 |

**先试内置的。** 大部分服务器记分板要的也就是人数、血量、等级——这几个不用再挂一个 PAPI。

### 7. 装 PlaceholderAPI 拿更多变量

装了之后可以用 PAPI 生态的成千上万个变量：

```
%player_health%
%vault_eco_balance%
%luckperms_prefix%
%quests_completed%
```

三类数据源（官方支持）：

1. **内置变量**（见上）
2. **PlaceholderAPI**
3. **MVdWPlaceholderAPI**

> 只在需要经济余额、rank 前缀、任务进度这类外部数据时才装 PAPI。PAPI 本身是重量级插件，**记分板刷新频率高，PAPI 解析是有成本的**。

### 8. 常用命令

主命令 `/SimpleScore`，别名 `/SB`。

| 命令 | 权限 | 说明 |
|------|------|------|
| `/sb reload` | `simplescore.cmd.reload` | 重载所有配置 |
| `/sb version` | `simplescore.cmd.version` | 检查更新 |
| `/sb toggle [on/off]` | `simplescore.cmd.toggle` | 切换自己的记分板显示 |
| `/sb toggle player <玩家> [on/off]` | `simplescore.cmd.toggle` | 管理别人的显示 |
| `/sb force <记分板名>` | `simplescore.cmd.force` | 强制指定某玩家显示某个记分板 |
| `/sb force player <玩家> <记分板名>` | `simplescore.cmd.force` | 同上，指定玩家 |

**`toggle` 很有用** —— 玩家嫌烦可以自己关，管理端也留一个逃生阀。

### 9. WorldGuard 区域支持

SimpleScore 注册了一个**自定义区域 flag** 叫 `scoreboard`：

```
/rg flag <区域名> scoreboard <记分板名>
```

- 玩家进入该区域 → 显示指定记分板
- 可以给多个：`/rg flag spawn scoreboard lobby,menu`
- **区域记分板会覆盖世界默认记分板**

典型用法：大厅区显示服务器信息，生存区显示本服数据，战斗区隐藏。

### 10. 常见坑

**记分板不显示**

按顺序查：

1. 条件写对了吗（世界名、权限节点拼写）
2. 玩家有没有那个权限节点
3. `/sb toggle` 是不是被关掉了
4. WorldGuard 区域 flag 是不是覆盖掉了

**v3 升 v4 后配置全废**

**这是已知的不兼容，不是 bug。** 回滚备份，或者按 v4 结构重写。

**4.x 报存储相关错误**

从 v3 升上来的话，重点看这里。v4 重写了存储系统，确认你用到的功能在当前版本存在。

**刷新太频繁掉帧**

刷新间隔调大。**记分板是每帧都渲染的**，行数多 + 刷新快 + PAPI 变量多 = 实打实的客户端和服务器双重开销。

**中文乱码**

保存文件时编码不对。用 UTF-8。

**和 mcMMO 等插件冲突**

SimpleScore 官方说明兼容会临时改记分板的插件（mcMMO 换血量显示时）。如果出现显示错乱，试着关掉其他插件的记分板功能。

**ProtocolLib 还需不需要**

**v4 不需要。** 如果你的配置里还有 ProtocolLib 相关项，可以清掉。

### 11. 常见坑位：别把显示行数堆太多

侧边板**最多 15 行**（Minecraft 客户端限制），超过就不显示。

更重要的是：**行数多 = 视觉噪音**。一个侧边板放 12 行，其中 8 行是玩家根本不会看的内容，效果是**所有内容都不被看**。

**建议：**

- 主侧边板控制在 **5-8 行**
- 关键信息放最上面（眼睛先看到的地方）
- 不重要的信息靠 `/tab` 或记分板标题承载

### 12. 什么时候别用 SimpleScore

- **只需要玩家列表 rank** → 用 [TAB](#/plugin/tab)，那是它的活
- **服里没有「这个玩家要看到自己看不到的东西」的需求** → 固定一块板就够，不需要复杂的条件和区域切换
- **玩家觉得花哨就是负资产** → 记分板是给需要它的人用的，人少的小服硬加只会显得吵

### 13. 关于汉化

> ⚠️ **本站未核实到该插件的官方中文语言文件机制，若要汉化需自行确认。**
>
> 已知 SimpleScore 支持**自定义翻译文件**（可复制默认消息文件到配置目录后修改），但**当前 `4.3.1` 版本该文件的准确名称、路径和格式，本站没有核实到**。请以 `plugins/SimpleScore/` 目录下实际生成的文件为准。

## 下一步

- 顶部玩家列表怎么做 → [TAB 与记分板](#/guide/tab-scoreboard)
- 变量从哪来 → [PlaceholderAPI](#/plugin/placeholderapi)
- 区域怎么配合记分板 → [WorldGuard 区域保护](#/guide/region-protection)
- 渲染开销怎么控制 → [性能调优从入门到精通](#/guide/performance-tuning)
