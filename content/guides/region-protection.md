---
id: region-protection
title: 领地与保护实战
description: 从「圈一块不让拆的主城」到「让玩家自己圈地」— 讲清 WorldGuard 的选区、定义区域、flag、优先级与权限分配，以及那些让保护看起来「失效」的坑。
icon: 🏰
tags: [领地, 保护, WorldGuard, WorldEdit, 防熊, flag]
order: 10
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。`/rg` 命令的语法与别名取自 WorldGuard **7.0.19** 的 jar（`RegionCommands.class` / `MemberCommands.class` 内的命令注解）并对照官方文档核对；flag 名称取自 jar 内 `Flags.class` 与官方 Region Flags 文档；圈地相关的配置键与默认值取自官方源码 `BukkitWorldConfiguration.java`。

「保护」在 Minecraft 服务器里其实是一件事：**划定一片空间，规定谁能在这里做什么。** 听起来简单，但新手服主第一次装保护插件时，最常见的体验是——照着教程敲完命令，自己上去一拆，方块照样掉。

本文按「先想清楚保护什么 → 再跑通最小流程 → 再开放给玩家」的顺序讲，最后再集中说坑。

## 一、先分清：你要保护什么

三件事的做法完全不同，别一上来就照抄同一套命令：

| 你的目标 | 典型场景 | 做法要点 |
|----------|----------|----------|
| **主城 / 出生点防破坏** | 不让陌生人拆主城、炸广场 | 服主（OP）用 WorldEdit 选区 → `/rg define` 圈一大块 → 设 `build deny` → 只把建筑师加成成员 |
| **玩家自助领地** | 公益服里每个人自己圈一块地 | 给玩家组 `worldguard.region.claim`，限制数量与体积，靠 `/rg claim` 自助认领 |
| **副本 / 小游戏区域** | 竞技场、副本入口、商店区 | 单独区域 + 针对性 flag（`pvp`、`mob-spawning`、`game-mode`、`blocked-cmds`），通常还要设优先级 |

> 判断标准：**保护范围是「服主划的」还是「玩家自己划的」。** 前者用 `/rg define`，后者用 `/rg claim`。这两个命令的权限、限制、行为都不一样，混着用会踩第六节的坑。

## 二、装什么：WorldEdit + WorldGuard，缺一不可

保护功能由 [WorldGuard](#/plugin/worldguard) 提供，但它**硬依赖 [WorldEdit](#/plugin/worldedit)**——WorldGuard 的 `plugin.yml` 里写着 `depend: [WorldEdit]`，**不装 WorldEdit，WorldGuard 根本不会加载**（启动日志里会直接报缺少依赖）。别指望「我只要保护功能，能不能不装 WorldEdit」，不能。

版本按你的服务端选：

| 插件 | MC 26.2 | MC 26.3 | 说明 |
|------|---------|---------|------|
| WorldGuard | 7.0.19（稳定） | 7.0.19（稳定） | 2026-09-18 发布，官方标注支持 MC 26.2–26.3；`api-version: 26.2`、`folia-supported: true` |
| WorldEdit | 7.4.5（稳定） | **7.4.6-beta-02**（测试版） | 7.4.5 官方只标到 26.2；**MC 26.3 需要 7.4.6-beta-02** |

装完重启，会生成 `plugins/WorldGuard/` 目录。

> **WorldGuard 没有语言文件机制**：它的提示是硬编码在代码里的英文，jar 内没有任何语言包。别去找「WorldGuard 汉化包」放进插件目录——原版根本不读它。好消息是**消息类 flag（`greeting` / `farewell` / `deny-message`）可以直接写中文**，那是官方功能；插件自身的英文提示要汉化得靠第三方翻译插件，详见 [WorldGuard 插件详情](#/plugin/worldguard) 的 Lang 说明。

## 三、最小可用流程：5 步圈出第一块保护区

假设你要保护主城出生点周围一片区域。

```bash
# 1. 拿 WorldEdit 的选区工具（木斧）
//wand

# 2. 左键点地面一角 → pos1；右键点对角 → pos2（两点之间是长方体选区）
#    嫌麻烦可以站好位置用 //pos1 / //pos2，或指哪选哪的 //hpos1 / //hpos2

# 3. 用当前选区定义区域（区域名不区分大小写，同一世界内不能重名）
/rg define spawn

# 4. 禁止非成员建造（这一条就是「防熊」的核心）
/rg flag spawn build deny

# 5. 把自己或建筑师加成成员（加进来的人不受 build deny 限制）
/rg addmember spawn 玩家A
/rg addmember spawn g:builder     # g: 前缀表示权限组，不是玩家
```

**然后一定要验证**：换一个**没有 OP、没有 `*` 权限**的小号（或临时给自己 `/lp user 自己 permission unset` 掉权限）走到区域内，试着拆一格方块。

> ⚠️ **这一步不能省，也不能用自己的 OP 号测。** 官方权限文档明确警告：**如果你有 OP 或拥有全部权限，你会隐式拥有绕过保护的能力，看起来就像「保护没生效」。** 用 OP 号测试得到「方块能拆」是正常现象，不是配置错了。

验证通过后，再按需加 flag：

```bash
/rg flag spawn pvp deny                    # 主城禁止 PVP
/rg flag spawn mob-spawning deny           # 不刷怪
/rg flag spawn creeper-explosion deny      # 苦力怕不炸
/rg flag spawn greeting &a欢迎来到主城！      # 进入提示（可直接写中文）
/rg flag spawn farewell &7慢走~             # 离开提示
```

## 四、`/rg` 命令速查

命令前缀 `/region` 与 `/rg` 完全等价。表格里的「别名」是 jar 内命令注解里实测存在的写法。

### 创建与删除

| 命令 | 别名 | 作用 |
|------|------|------|
| `/rg define [-w <世界>] [-g] <id> [所有者...]` | `/rg create`、`/rg def`、`/rg d` | 用**当前 WorldEdit 选区**创建区域；可在后面直接跟所有者名 |
| `/rg redefine [-w <世界>] [-g] <id>` | `/rg update`、`/rg move` | 用新选区替换已有区域的**范围**（成员和 flag 保留） |
| `/rg remove [-w <世界>] [-f] [-u] <id>` | `/rg rem`、`/rg delete`、`/rg del` | 删除区域；有子区域时必须指定 `-u`（子区域脱离父级）或 `-f`（连子区域一起删），两者不能同时用 |
| `/rg claim <id>` | — | **玩家自助认领**，执行者自动成为所有者（见第六节） |

> 定义区域**必须先有 WorldEdit 选区**。WorldGuard 自己的 `/wg wand` 给的不是选区工具——那是「区域查询魔杖」（默认物品是皮革），右键方块可列出该位置有哪些区域，需要 `worldguard.region.wand` 权限。选区永远用 WorldEdit。

### 成员管理

| 命令 | 别名 | 作用 |
|------|------|------|
| `/rg addmember [-w <世界>] <id> <成员...>` | `/rg addmem`、`/rg am` | 添加成员（可多个）；`g:<组名>` 表示权限组 |
| `/rg removemember [-w <世界>] [-a] <id> <成员...>` | `/rg remmember`、`/rg removemem`、`/rg remmem`、`/rg rm` | 移除成员；`-a` 清空全部 |
| `/rg addowner [-w <世界>] <id> <所有者...>` | `/rg ao` | 添加所有者（所有者权限高于成员，且也是成员） |
| `/rg removeowner [-w <世界>] [-a] <id> <所有者...>` | `/rg remowner`、`/rg ro` | 移除所有者；`-a` 清空全部 |

```bash
/rg addmember -w lobby spawn g:builder sk89q   # 官方示例写法：一次加组 + 加玩家
```

### 查看信息

| 命令 | 别名 | 作用 |
|------|------|------|
| `/rg info [-u] [-s] [-w <世界>] [<id>]` | `/rg i` | 看区域信息；不写 id 就看脚下的；`-s` 顺手把该区域设为选区，`-u` 显示 UUID 而非玩家名 |
| `/rg flags [-w <世界>] [-p <页>] <id>` | `/rg perms` | 分页列出该区域所有 flag（游戏内可点击改值，很方便） |
| `/rg list [-i <名字搜索>] [-p <玩家>] [-w <世界>] [-s] [<页>]` | — | 列出区域；`-p` 按玩家筛，`-i` 按名字筛，`-s` 只列与选区相交的 |
| `/rg select [-w <世界>] [<id>]` | `/rg sel`、`/rg s` | 把某个区域的范围读回成你的 WorldEdit 选区（改范围前很好用） |

### 设置 flag、优先级与父区域

| 命令 | 别名 | 作用 |
|------|------|------|
| `/rg flag <id> <flag> [-w <世界>] [-g <组>] [-e] [<值>]` | `/rg f` | 设 flag；**不给值 = 移除该 flag**；`-e` = 设为空值；`-g` = 指定区域组 |
| `/rg setpriority [-w <世界>] <id> <优先级>` | `/rg priority`、`/rg pri` | 设优先级，默认 0，数字越大越优先 |
| `/rg setparent [-w <世界>] <id> [<父区域>]` | `/rg parent`、`/rg par` | 设父区域；不写父区域名 = 取消继承 |
| `/rg teleport [-w <世界>] [-c] [-s] <id>` | `/rg tp` | 传送到区域的 `spawn`/`teleport` flag 位置；`-c` 传送到几何中心（需旁观者模式） |

```bash
/rg flag mall pvp -g nonmembers deny   # 官方示例：只禁止「非成员」PVP
/rg flag mall greeting                 # 不给值 = 移除 greeting
/rg flag mall greeting -e              # 设为空值（用于覆盖父区域的 greeting）
/rg setpriority pub 10                 # 官方示例：让 pub 盖过优先级为 0 的 spawn
/rg setparent plot1 mall               # 让 plot1 继承 mall
/rg setparent plot1                    # 取消继承
```

### 管理与维护

| 命令 | 别名 | 作用 |
|------|------|------|
| `/rg load [-w <世界>]` | **`/rg reload`** | 从**文件**重新读取区域数据 |
| `/rg save [-w <世界>]` | `/rg write` | 手动把区域数据写入磁盘（正常情况会自动保存，不必手敲） |
| `/wg reload` | — | **重载 WorldGuard 的配置**（`config.yml`），权限 `worldguard.reload` |
| `/rg bypass [on\|off]` | `/rg toggle-bypass` | 临时关闭自己的绕过能力（仍需有绕过权限） |

> ⚠️ **`/rg reload` 和 `/wg reload` 是两回事，别搞混**：前者是 `/rg load` 的别名，重载的是**区域数据**（而且官方注明「如果最近在游戏里改过区域数据，可能造成数据丢失」）；后者重载的是**插件配置**。改了 `config.yml` 要用 `/wg reload`，改了区域要小心 `/rg load` 会覆盖内存里的改动。

## 五、常用 flag 速查表（本页重点）

### 5.1 取值类型

flag 能填什么值，由它的类型决定：

| 类型 | 可填的值 |
|------|----------|
| `state` | `allow` 或 `deny`；**不给值就是移除该 flag** |
| `string` | 任意文本；支持 `&` 颜色码、`\n` 换行、`%name%` 等占位符——**可以直接写中文** |
| `integer` / `double` | 整数 / 小数 |
| `boolean` | `true` / `false` |
| `location` | 一个坐标（`teleport`、`spawn` 用） |
| `set` | 逗号分隔的列表，如 `cow,pig`、`/tp,/home` |
| `gamemode` | `survival` / `creative` / `adventure` |
| `weather` | `rain` / `clear` |

### 5.2 保护类（最常用）

| Flag | 类型 | 作用 |
|------|------|------|
| `build` | state | **总开关**：挖/放方块、用门拉杆、与实体交互、PvP、睡觉、开容器、放船矿车等一整票。成员与所有者默认可建造，非成员默认不行 |
| `block-break` | state | 能否破坏方块（设 `deny` 时**活塞也推不动**） |
| `block-place` | state | 能否放置方块 |
| `interact` | state | 与方块/实体交互：门、拉杆、骑乘载具等（不含容器） |
| `use` | state | 使用门、拉杆等（不含容器） |
| `chest-access` | state | 能否打开箱子/容器 |
| `pvp` | state | 是否允许玩家对战 |
| `sleep` | state | 能否在床上睡觉 |
| `tnt` | state | TNT 能否引爆或破坏方块 |
| `lighter` | state | 能否用打火石 / 火焰弹 |
| `vehicle-place` | state | 能否放置船、矿车 |
| `vehicle-destroy` | state | 能否破坏载具 |
| `ride` | state | 能否骑乘载具 |
| `damage-animals` | state | 能否伤害牛、羊等友好动物 |
| `pistons` | state | 活塞能否工作 |
| `passthrough` | state | 设为 `allow` = **该区域不再保护范围**（但仍可用 PVP、治疗等其他 flag）。官方提醒：它与移动无关，不要乱设 |

> ⚠️ 官方明确警告：保护类 flag **不是玩家专属的**。比如 `block-break deny` 也会阻止活塞破坏方块。想只管玩家、不管机械，别用这一类粗粒度 flag 硬套。

### 5.3 怪物、火与爆炸

| Flag | 类型 | 作用 |
|------|------|------|
| `creeper-explosion` | state | 苦力怕爆炸是否造成破坏/伤害 |
| `mob-damage` | state | 怪物能否伤害玩家 |
| `mob-spawning` | state | 怪物能否生成（含刷怪蛋、命令生成） |
| `deny-spawn` | set | 禁止生成的实体列表，如 `/rg flag spawn deny-spawn cow,pig` |
| `enderdragon-block-damage` | state | 末影龙能否破坏方块 |
| `wither-damage` | state | 凋灵能否造成伤害 |
| `ghast-fireball` | state | 恶魂火球、凋灵之首能否造成伤害 |
| `other-explosion` | state | 其他爆炸能否造成伤害 |
| `enderman-grief` | state | 末影人能否搬方块 |
| `fire-spread` | state | 火能否蔓延（**需先开 `regions.high-frequency-flags`**） |
| `lava-fire` | state | 岩浆能否点燃周围（**同上**） |
| `water-flow` | state | 水能否流动（**同上**） |
| `lightning` | state | 能否劈闪电 |

> `fire-spread` / `lava-fire` / `water-flow` / `lava-flow` 属于「高频检查」的 flag，官方默认**关闭**对应能力——配置键 `regions.high-frequency-flags` 默认 `false`。直接设这些 flag 却发现没效果，先去把开关打开。

### 5.4 进出与消息（这三个能写中文）

| Flag | 类型 | 作用 |
|------|------|------|
| `greeting` | string | 进入区域时的聊天提示 |
| `farewell` | string | 离开区域时的聊天提示 |
| `deny-message` | string | 动作被拒绝时的提示（**可写中文**） |
| `greeting-title` / `farewell-title` | string | 进入/离开时的大标题，含 `\n` 会拆出副标题 |
| `entry` | state（默认组 `nonmembers`） | 能否进入该区域 |
| `exit` | state（默认组 `nonmembers`） | 能否离开该区域 |
| `entry-deny-message` / `exit-deny-message` | string | 被拒绝进入/离开时的提示 |
| `exit-via-teleport` | state | 能否用传送离开（仅在被禁止离开时有意义） |
| `notify-enter` / `notify-leave` | boolean | 有 `worldguard.notify` 权限的人是否收到他人进出通知 |
| `enderpearl` | state | 能否用末影珍珠 |
| `teleport` / `spawn` | location | `/rg teleport` 的目标点 / 区域内重生点（`spawn` 默认组是 `members`） |
| `teleport-message` | string | 用 `/rg teleport` 时发给玩家的消息 |

### 5.5 地图制作 / 杂项

| Flag | 类型 | 作用 |
|------|------|------|
| `item-pickup` / `item-drop` | state | 能否捡起 / 丢弃物品 |
| `exp-drops` | state | 是否掉落经验 |
| `invincible` | state | 玩家是否无敌 |
| `fall-damage` | state | 是否受摔落伤害 |
| `game-mode` | gamemode | 进入区域强制切换的 game mode |
| `time-lock` | string | 区域内看到的时间（0–24000，支持 `+`/`-` 相对值） |
| `weather-lock` | weather | 区域内看到的天气（`rain` / `clear`） |
| `blocked-cmds` / `allowed-cmds` | set | 屏蔽的命令名单 / 命令白名单 |
| `send-chat` / `receive-chat` | state | 能否发/收聊天 |

### 5.6 区域组 `-g`：这个 flag 对谁生效

`/rg flag <区域> <flag> -g <组> <值>` 里的「组」是 **WorldGuard 的区域组**，和 LuckPerms 的权限组**不是一回事**：

| `-g` 取值 | 含义 |
|-----------|------|
| `all` | 所有人（**绝大多数 flag 的默认值**） |
| `members` | 成员 + 所有者 |
| `owners` | 仅所有者 |
| `nonmembers` | **非**成员（即除成员和所有者以外的人） |
| `nonowners` | **非**所有者 |

注意两个例外：`entry` / `exit` 默认组是 `nonmembers`，`spawn` 默认组是 `members`。另外**同一个区域上的同一个 flag 不能对不同组设不同值**——有这种需求就多建一个区域。

## 六、让玩家自助圈地（公益服高频需求）

### 6.1 需要哪些权限

玩家要做的事只有两件：**圈出选区** 和 **认领**。对应权限：

| 用途 | 权限节点 | 出处 |
|------|----------|------|
| 认领区域 | `worldguard.region.claim` | 官方文档 / jar 内 `RegionPermissionModel` |
| 拿木斧 `//wand` | `worldedit.wand` | jar 内 `SelectionCommands.class` |
| 用 `//pos1` / `//pos2` | `worldedit.selection.pos` | 同上 |
| 用 `//hpos1` / `//hpos2` | `worldedit.selection.hpos` | 同上 |
| 解除数量/体积限制 | `worldguard.region.unlimited` | 官方定义为 "Bypass claiming limits" |

官方 Claiming 文档的说法是：认领区域仍需要 WorldEdit 选区，但「只需要 `worldedit.selection` 权限即可」。jar 里真正的选区子命令权限是上面 `worldedit.wand` / `worldedit.selection.pos` / `worldedit.selection.hpos` 这几个——**实操给 `worldedit.selection.*` 加 `worldedit.wand` 最省事。**

```bash
# 允许默认组玩家圈地（自己选区 + 认领）
/lp group default permission set worldedit.wand true
/lp group default permission set worldedit.selection.pos true
/lp group default permission set worldedit.selection.hpos true
/lp group default permission set worldguard.region.claim true

# 让玩家能查看/管理自己的区域（own.* 只允许操作自己拥有的区域）
/lp group default permission set worldguard.region.info.own.* true
/lp group default permission set worldguard.region.addmember.own.* true
/lp group default permission set worldguard.region.removemember.own.* true
/lp group default permission set worldguard.region.teleport.own.* true
```

> ❌ **千万别给 `worldedit.*`**。WorldEdit 能改地形，给了就等于把刷子交出去——熊孩子一条 `//set air` 就能清空一片。只给「选区」相关的最小权限。

### 6.2 数量与体积怎么限

认领的限制都在 `plugins/WorldGuard/config.yml`（也可在 `plugins/WorldGuard/worlds/<世界名>/config.yml` 里按世界覆盖）：

| 配置键 | 默认值 | 作用 |
|--------|--------|------|
| `regions.max-region-count-per-player.default` | `7` | 每个玩家可拥有区域数的上限。键名里的 `default` 是「不在其他组里的玩家」；其余键是**权限组的组名**（如 `vip: 15`、`staff: 50`），玩家同属多个组时取最大值 |
| `regions.max-claim-volume` | `30000` | 单个认领区域的**体积**上限（不是面积：50×50×12 就是 30000） |
| `regions.claim-only-inside-existing-regions` | `false` | 设为 `true` 后，认领的区域必须与「自己已拥有的区域」重叠才能认领（防止满地图乱圈） |
| `regions.wand` | `minecraft:leather` | 区域查询魔杖的物品 |

拥有 `worldguard.region.unlimited` 的玩家**同时豁免数量与体积限制**。改完执行 `/wg reload` 或重启。

### 6.3 认领时会检查什么

官方 Claiming 文档列出的规则（与 jar 内的报错文案一致）：

1. **不能同名覆盖**：不能顶替一个已存在的同名区域
2. **不能压别人的地**：要认领的区域不能与「自己不是所有者」的已有区域重叠
3. **数量上限**：超过 `max-region-count-per-player` 会报 "You own too many regions, delete one first to claim a new one."
4. **体积上限**：超过 `max-claim-volume` 会提示 "Max. volume: X, your volume: Y"
5. **多边形暂不支持**：jar 内原文 "Polygons are currently not supported for /rg claim."——玩家用多边形选区认领会被拒绝

> 所以防互相覆盖**不用你额外做什么**——重叠检查是 `/rg claim` 内置的。真正要你动的是第 2 条之外的场景：比如你想让玩家只能在指定的「地皮大区」里圈地，才需要开 `claim-only-inside-existing-regions`。

## 七、区域重叠时谁说了算

区域可以重叠，重叠时的规则是：

- **成员与能否建造**：只看**优先级最高**的那几个区域
- **flag**：取「**优先级最高的、且定义了该 flag**」的区域的值
- 优先级默认 **0**，范围是 -2147483648 ~ 2147483647，实际用 -2、10、15、100 这种就够
- `deny` 压过 `allow`：想用 `allow` 覆盖低优先级区域的 `deny`，**必须**提高优先级；反过来想加一条 `deny` 则不用动优先级

**继承**（`/rg setparent`）用来做「模板」：子区域继承父区域的成员/所有者，以及**自己没有定义**的 flag。每个区域最多一个父级，循环继承会被检测并拒绝。官方给的经典例子：

```bash
/rg define -g plot_template          # -g = 创建一个没有实体范围的「模板区域」
/rg setparent plot1 plot_template
/rg setparent plot2 plot_template
/rg flag mall chest-access allow     # 整个商场能开箱
/rg flag plot_template chest-access deny   # 但每个地皮不行
```

> ⚠️ **父区域的优先级不能高于子区域**，否则继承会失效。另外重叠区域里的「成员」判定很严格：flag 设在哪个区域上，玩家就必须是**那个区域**的成员——是相邻/重叠的另一个区域的成员不算。

## 八、与权限系统的配合

按 [权限系统设计](#/guide/permissions-design) 的四层模型（default → member/vip → staff → admin）分配，只写增量：

| 组 | 建议给的 WorldGuard 节点 | 说明 |
|----|------------------------|------|
| `default` | `worldguard.region.claim` + `worldguard.region.info.own.*` + `worldguard.region.addmember.own.*`（按需） | 「自己的地自己管」，`own.*` 保证碰不到别人的区域 |
| `member` / `vip` | 在 `max-region-count-per-player` 里给对应组名放宽数量（如 `vip: 15`） | 数量放宽走**配置**，不是走权限 |
| `staff` | `worldguard.region.list`、`worldguard.region.info.*`、`worldguard.region.teleport.*`、`worldguard.region.unlimited`、`worldguard.region.wand` | 查询 + 协助处理领地纠纷 |
| `admin` | 区域管理类全给（`define` / `redefine` / `remove.*` / `setpriority.*` / `setparent.*` / `flag.*`） | 需要动别人的区域时才给 |

几点务必注意：

1. **别给 `worldguard.*`**。它包含 `worldguard.region.bypass.*`，等于把保护钥匙一起交出去。
2. **`worldguard.region.bypass.<世界>` 给了就等于那个世界没有保护**（PVP 的 deny flag 除外）。这个节点只适合给你 100% 信任的、需要在保护区内施工的管理员，且**按世界给**——`/lp group staff permission set worldguard.region.bypass.world true` 只影响 `world` 世界。
3. **OP 与全权限会隐式拥有绕过能力。** 这是官方警告，也是「保护看起来失效」的头号原因。
4. `/rg flag` 的权限可以拆得很细：`worldguard.region.flag.regions.own.*` 管「能改哪些区域」，`worldguard.region.flag.flags.<flag名>.*` 管「能改哪些 flag」。想让玩家只能开关 `use` 和 `chest-access`，就只给这两个。

## 九、区域数据存在哪，怎么备份

默认存储是 **YAML 文件**，位置是：

```
plugins/WorldGuard/worlds/<世界名>/regions.yml
```

每个世界一个文件。备份的时候别只备份 `config.yml`——**`worlds/` 目录下这些 `regions.yml` 才是玩家领地的全部数据**，丢了这个文件，所有玩家的圈地就没了。

- 手动落盘：`/rg save`（正常改动会自动保存，一般不需要手敲）
- 从磁盘读回：`/rg load`（`/rg reload` 是它的别名）——注意官方警告：会把内存里未保存的改动覆盖掉
- 迁到 MySQL：配置 `regions.sql.use`，但 **7.0.19 的日志里已明确提示「SQL 存储已弃用，请迁移回 YAML」**，新服别往这个方向走

> 定期备份 `plugins/WorldGuard/` 整个目录。把它和世界存档一起纳入 [服务器维护](#/guide/server-maintenance) 的备份清单里——领地数据丢了，比建筑被炸更难补救。

## 十、常见坑

| 症状 | 原因与解法 |
|------|-----------|
| 自己能拆、别人也能拆，保护「没生效」 | **测试号是 OP 或有 `*` 权限**，会隐式绕过。换一个无 OP 小号测 |
| 给了某人 `worldguard.region.bypass.<世界>` 后他到处能拆 | 这个节点就是「在该世界绕过保护」。不该给就收回来 |
| 玩家在野外建东西被拦 | 大概率站进了别人的区域，或进了设了 `build deny` 的大区。用 `/rg info` 看脚下有哪些区域；区域重叠时**必须所有重叠区域都允许**才行 |
| 区域重叠后优先级不生效 | 记住两点：`deny` 天然压过 `allow`（想覆盖 deny 必须提优先级）；**父区域优先级不能高于子区域** |
| 设了 `water-flow` / `fire-spread` 没反应 | 这些高频 flag 需要先把 `regions.high-frequency-flags` 设为 `true` |
| 改了 `config.yml` 没生效 | 要 `/wg reload`（不是 `/rg reload`）或重启 |
| 手改了 `regions.yml` 想生效 | 用 `/rg load`，但它会**丢弃内存中未保存的改动**；更安全的做法是停服改完再启动 |
| 玩家圈地报 "too large" | 超过 `regions.max-claim-volume`（默认 30000）。注意算的是体积不是面积 |
| 玩家圈地报 "too many regions" | 超过 `regions.max-region-count-per-player`（默认 7）。给权限组加配额，或给 `worldguard.region.unlimited` |
| `/rg claim` 报多边形不支持 | 官方已知限制，让玩家改用长方体选区 |
| 想汉化但找不到语言文件 | WorldGuard 没有语言文件机制，提示是英文的；**只有消息类 flag 能写中文**，其余要第三方翻译插件 |
| WorldGuard 启动就报错不加载 | 没装 WorldEdit，或 WorldEdit 版本不覆盖当前 MC 版本（26.3 需要 7.4.6-beta-02） |
| 用 `/wg wand` 圈不出范围 | 那是**查询**魔杖（皮革），不是选区工具。选区请用 `//wand` 拿木斧 |

## 下一步

- 决定「哪些权限给哪个组」：[权限系统设计：别让权限越用越乱](#/guide/permissions-design)
- 插件命令与配置的完整说明：[WorldGuard 插件详情](#/plugin/worldguard)、[WorldEdit 插件详情](#/plugin/worldedit)
- 主城之外还要划安全边界：[安全加固：从裸奔到站稳](#/guide/security-hardening)
- 想和世界层面的规则（PVP、刷怪、重生点）配合：[多世界与主城实战](#/guide/multi-world-setup)
