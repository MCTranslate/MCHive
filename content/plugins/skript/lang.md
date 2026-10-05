# Skript 汉化机制

> Skript 的语言机制和本站收录的绝大多数插件都不一样——**后缀是 `.lang`，不是 yml**。
> 这一页说明它到底怎么工作，以及怎么改。

## 一、结论：自带简体中文

Skript 内置 13 种语言文件，简体中文是其中之一：

```
english.lang              ← 默认
simplifiedchinese.lang    ← 简体中文 ✅
german.lang
french.lang
spanish.lang
polish.lang
russian.lang
korean.lang
japanese.lang
turkish.lang
dutch.lang
catalan.lang
```

文件名全部小写无空格。

## 二、切换语言

编辑 `plugins/Skript/config.sk`：

```
language: simplifiedchinese
```

值就是语言文件名去掉 `.lang`，全小写。简体中文写 `simplifiedchinese`，**不要写 `zh_CN`，也不要写 `simplified-chinese`**。

改完重启服务器，或 `/skript reload all`。

> **不是所有条目都被翻译了。** 没翻译的部分会回退到英文——这是 Skript 的设计，不是 bug。页面上看着半中半英是正常现象。

## 三、关键区别：这不是 YAML

Skript 的 `.lang` 文件**看起来像 YAML，但不是 YAML**。它由 Skript 自己的解析器处理（`ch.njol.skript.config.Node` 那一套）。

这带来几个实际差异：

| 方面 | 真正的 YAML | Skript 的 `.lang` |
|------|-----------|----------------|
| 行注释 | `#` | `#` 和 `~`，**两个都合法** |
| 缩进 | 必须是空格，tab 常出问题 | 空格和 tab 都可以 |
| 锚点/别名 | 支持 | 不支持 |
| 多行文本 | `\|` 或 `>` | 不支持，另有语法 |

**如果你的编辑器给你自动加 YAML 语法高亮并报「invalid」，那是编辑器的误判。** 把后缀改成 `.lang` 关掉高亮即可。

## 四、外部目录优先级

Skript 从两个地方加载语言文件：

| 位置 | 优先级 |
|------|--------|
| `plugins/Skript/lang/` | **高** |
| Skript.jar 内部的 `lang/` | 低 |

两个都会加载，**外部目录的条目覆盖 jar 内的**。这就是自定义的入口：

```
plugins/Skript/lang/simplifiedchinese.lang   ← 你的自定义版（覆盖 jar 内）
plugins/Skript/lang/mylanguage.lang          ← 你新建的语言
```

**唯一的例外：默认英文 `english.lang` 只从 jar 内加载。** 就算你放一个外部的 `english.lang` 也不生效——Skript 故意这么设计，避免有人手滑把默认语言改坏。

## 五、怎么改文案

**Step 1 — 从 jar 里取出原文件**

把 `Skript.jar` 当作 ZIP 打开 → `lang/` 目录 → 复制 `english.lang` 或 `simplifiedchinese.lang`。

**Step 2 — 放进外部目录**

```
plugins/Skript/lang/simplifiedchinese.lang
```

**Step 3 — 检查 version 行**

```
version: @version@
```

这个占位符表示「和你手上这版 Skript 对应」。**版本不匹配会产生警告**。Skript 升级后记得回来更新这行。

**Step 4 — 翻译**

键是英文的，值改成中文：

```
skript:
    no scripts: 没有找到任何脚本，也许你该写一些 ;)
    no errors: 所有脚本已加载，无错误。
```

**Step 5 — `/skript reload all`**

## 六、文件里都有什么（不只是消息）

这一点和其他插件差别最大。`.lang` 里的顶层节点大致是：

| 节点 | 内容 |
|------|------|
| `skript` | 插件标识、核心消息 |
| `skript command` | 命令反馈（重载结果、帮助） |
| `scripts` / `types` / `conditions` / `effects` | **脚本语法里显示给玩家看的词条** |
| `aliases` | 方块/物品的别名 |
| `updater` | 版本检查 |

`none` 这一项要特别注意：

```
none: ~
```

它定义「空值在文本里显示成什么」。中文服通常改成 `无` 或 `空`。

## 七、占位符语法

语言文件里的参数用 **Java Formatter** 语法，不是 Skript 的 `%变量%` 语法：

| 写法 | 含义 |
|------|------|
| `%s` | 按顺序的第一个参数 |
| `%1$s` `%2$s` | 指定位置 |
| `%3$sms` | 带格式修饰（宽度 3） |

例子：

```
error: 重载 %1$s 时遇到 %2$s 个错误！（%3$sms）
```

`%1$s` 是脚本名、`%2$s` 是错误数、`%3$s` 是耗时毫秒。**顺序可能和直觉不同**，改的时候照抄原文件的顺序。

## 八、复数形式

用 `¦` 分隔单复数：

```
script¦¦s¦
```

左边是单数，右边是复数。更复杂的：

```
shel¦f¦ves¦
```

分三段：`she` + `l¦f¦` + `ves`。

**中文没有单复数变化，所以理论上这对你不影响**——但如果你把语言文件改成中文却保留了原键的复数结构，语法仍会解析成功。

## 九、性别/量词

有些语言用语法性别编码：

```
word¦s @a ocelot¦s @an
```

第一段是名词，后面 `@a` / `@an` 是冠词。英语靠 a/an 区分，其他语言可能是阳性/阴性/中性。

**中文不需要这些。** 保留原样即可。

## 十、三个容易踩的坑

**改了没生效**

Skript 在启动时加载语言文件。改完必须**完整重启服务器**，或者至少确认 `/skript reload all` 真的执行了。语言文件的加载时机和脚本不同，改完观察启动日志里 Skript 有没有重新读语言。

**复制过去后全变成英文了**

检查两件事：

1. 文件真的在 `plugins/Skript/lang/` 下，文件名拼写完全正确（含小写）
2. `config.sk` 里的 `language:` 值和文件名对得上

**UTF-8 带 BOM**

用 Windows 记事本保存很容易带 BOM。Skript 的解析器可能把第一行的键认错，症状是「整个文件都不生效」。**用 VS Code 存 UTF-8 无 BOM。**

## 十一、什么不会被汉化

语言文件只管 Skript 自己发给玩家的文本。**这些还是英文（或你自己写的）：**

- **脚本语法关键字** —— `command`、`trigger`、`on join` 这些是解析器认的，改语言文件不会让脚本能写中文
- **变量名** —— 可以用中文但不推荐
- **你自己脚本里的文案** —— 直接在 `.sk` 文件里写中文
- **第三方 addon 的文案** —— 每个 addon 自己的语言文件

**Skript 生态里大量 addon（SkBee、SkriptUtils 等）都有自己的语言文件机制**，和 Skript 本体不是一套。装了 addon 要去那个 addon 的目录找。

## 下一步

- 全站汉化机制总表 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
- 脚本怎么写 → [Skript 安装教程](#/plugin/skript/tutorial.md)
- 权限怎么配 → [权限系统设计](#/guide/permissions-design)