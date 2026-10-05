---
id: skript
name: Skript
description: 用接近英语的语法写 .sk 脚本来造自定义玩法、事件、命令和菜单 — 不写 Java 就能改服务器逻辑，适合小服主和想快速迭代的开发者。
category: 开发前置
version: Skript（MC 1.13.2 - 26.2）
tags: [脚本, 事件, 自定义玩法, 菜单, 命令, 汉化]
sections:
  - id: tutorial
    name: 安装教程
    file: tutorial.md
  - id: lang
    name: 汉化机制
    file: lang.md
    description: Skript 的 .lang 语言文件机制 — 后缀不是 yml，且变量/条件/效果词条全在里面
---

## Skript 安装教程

### 1. 它是什么

Skript 是一个**脚本引擎**。你在 `plugins/Skript/scripts/` 目录下写 `.sk` 文件，改完重载一下就生效——不用编译 Java、不用打包 jar、不用重启服务器。

一段真实的样子：

```
command /heal [<player>]:
    permission: skript.heal
    trigger:
        give {_player} 1.5 hearts
        send "&a已治疗 %{_player}%&a。" to {_player}
```

看完这段你就明白它的定位了：**用接近英语的语法描述服务器逻辑**。上面这个脚本给玩家加血、给权限、改聊天提示，一行 Java 都不用写。

### 2. 它适合什么、不适合什么

| 适合 | 不适合 |
|------|--------|
| 自定义命令（`/gm`、`/spawn` 之类的变体） | 大量数据存储 |
| 小而明确的事件响应（玩家加入时发消息） | 复杂算法 |
| 触发其他插件的命令 | 高频调用（每 tick 循环） |
| 简单的菜单 / 传送点 / 计分板 | 长期维护的大型项目 |

**说清楚它的短板：**

- **性能不如 Java。** Skript 脚本在运行时解释执行，复杂循环会明显吃 tick
- **没有编译期检查。** 语法错了只在加载时告诉你，逻辑错了只有玩家触发时才知道
- **没有 IDE 支持。** 大项目写起来是灾难
- **生态是问题。** 很多人不知道某个效果该怎么写，在论坛翻半小时是常态

**如果你的服需要深度定制的战斗系统、经济系统、或者要长期维护上百个脚本 —— 别用 Skript，写 Java 插件。**

**小服主想加几个自定义命令、响应几个事件 → Skript 是最省事的路。**

### 3. 安装

- Modrinth / SpigotMC / Hangar 搜 `skript`
- 认准 **SkriptLang**（GitHub: `SkriptLang/Skript`），别下到停更多年的旧版

丢进 `plugins/`，重启。生成 `plugins/Skript/`，里面 `scripts/` 是你的脚本目录。

> ⚠️ **Java 版本要看。** Skript 面向现代 Java 构建，老 Java 起不来。1.20.5+ 的 MC 需要 Java 21。对照 [Java 运行时选择](#/guide/java-runtime-choice)。

### 4. 第一个脚本

新建 `plugins/Skript/scripts/hello.sk`：

```
command /hello:
    trigger:
        send "&6你好，&e%player%&6！欢迎来到本服。" to player
```

重载：

| 命令 | 说明 |
|------|------|
| `/skript reload all` | 重载所有脚本（改完用这个） |
| `/skript reload <文件名>` | 只重载某个脚本 |
| `/skript enable <文件名>` | 启用某个被 `disable` 掉的脚本 |
| `/skript disable <文件名>` | 停用某个脚本 |
| `/skript info` | 列出所有脚本和加载状态 |
| `/skript unpermission` | 清除 Skript 加的临时权限 |

`/skript reload all` 是日常最常用的一个。**它比重启快得多**，所以写脚本时就是：改 → 存 → reload → 进游戏试。

### 5. 脚本里最常用的语法

```
# 玩家事件
on join:
    send "&e欢迎，%player%！" to player

on quit:
    broadcast "&7%player% 离开了服务器"

on death of player:
    broadcast "&c%player% 死了"

# 区块事件
on block break:
    if event-block is diamond ore:
        give player 1 diamond

# 物品事件
on item held:
    send "&b你现在拿着 %item%"

# 定时
every 10 seconds:
    broadcast "&7服务器已运行 %playtime%"
```

**中文能用吗？** 变量名可以用中文（`玩家`），但不推荐——你以后要维护。**事件名、条件、效果必须用英文**，这是 Skript 的语法关键字，不在语言文件里。

### 6. 结构化语法：菜单、变量、函数

Skript 有比单行命令更完整的结构。下面是一个功能完整的菜单：

```skript
command /menu:
    trigger:
        open virtual chest inventory named "&8服务器菜单" to player

        set {_slot} to 0
        make a gui with 27 slots named "&8服务器菜单"

        set slot {_slot} of the gui to green stained glass pane named "&a传送点"
        {_slot} +:= 1
        set slot {_slot} of the gui to yellow stained glass pane named "&e商店"
        {_slot} +:= 1
        set slot {_slot} of the gui to red stained glass pane named "&c退出"
        {_slot} +:= 1

        open {_gui} to player
```

**函数**用来复用逻辑：

```skript
function giveKit(p: player):
    give {_p} 1 iron sword
    give {_p} 32 bread
    send "&a已发放初始装备" to {_p}
```

### 7. 性能：哪些写法会拖慢服务器

**Skript 的坑一半在性能上。** 几条硬规则：

| 别这么写 | 为什么 | 这么写 |
|---------|--------|-------|
| 死循环 `loop 999999 times:` | 直接卡死主线程 | 缩小次数或改用 `every` |
| 高频事件里做重活 | 每个方块破坏都算一遍 | 先判断条件再做事 |
| 到处 `broadcast` | 每次都拼字符串发给所有人 | 加条件限定 |

**`every 20 ticks` 类型的定时任务也不便宜。** 你写 10 个每秒跑的循环，服务器就多 200 次/秒的解释执行。

> **判断标准**：如果一个脚本做了明显的事，加载之后用 `/mspt` 前后对比一下。有差就是有差。

### 8. 汉化：Skript 的机制和其他插件不一样

**这一点值得单独讲**，因为 Skript 的语言文件**不是** yml、也不是 properties。

```
plugins/Skript/lang/simplifiedchinese.lang
```

- 后缀是 **`.lang`**，不是 `.yml`、不是 `.json`
- 语法**长得像 YAML，但不是 YAML** —— Skript 有自己的解析器
- 里面不只是「消息文案」，**变量名、条件名、效果名**这些显示给玩家看的部分**也在里面**

切换语言在 `plugins/Skript/config.sk` 里：

```
language: simplifiedchinese
```

具体机制、外部目录优先级、占位符语法，见 [汉化机制](#/plugin/skript/lang.md)。

### 9. 常见坑

| 症状 | 处理 |
|------|------|
| **脚本报错，插件不加载** | 看控制台。Skript 会指出行号和原因。**有语法错误时整个文件都不加载**，不是只跳过出错那行 |
| **写好了没反应** | ① `/skript reload all` 了吗 ② 语法关键字是不是英文的 ③ 触发条件你真的满足吗（比如 `on block break:` 里你得真的挖了个方块）④ `command /xxx:` 里写了 `permission:` 就必须给玩家这个权限 |
| **菜单点了没反应** | GUI 的 `slot` 索引和物品堆叠没问题时，通常是 `on inventory click` 事件的写法问题 |
| **中文乱码** | 脚本文件要存成 **UTF-8 无 BOM**。用记事本改容易存成 GBK 或带 BOM。**用 VS Code 或 Notepad++ 存 UTF-8 无 BOM** |
| **加载慢 / 卡顿** | 脚本多的时候解析和加载耗时明显。测试阶段就放少量脚本，别一次塞几十个 |

### 10. 什么时候别用 Skript

- **要做复杂或高性能的逻辑** —— 写 Java
- **项目要长期维护、代码量大** —— Skript 没有版本控制友好性、没有静态检查
- **你不会写脚本** —— 语法是英文的，且文档散在各处
- **只是想加个传送点命令** —— EssentialsX 已经能做了，装 Skript 是杀鸡用牛刀

**它的正确用法是：快速补上一个小功能，验证玩法可行性，然后决定要不要重写成正式插件。**

## 下一步

- 汉化怎么做 → [汉化机制](#/plugin/skript/lang.md)
- 全站汉化说明 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
- 权限怎么配 → [权限系统设计](#/guide/permissions-design)
- 常用基础插件 → [快速入门](#/guide/quick-start)