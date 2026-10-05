# Quests 汉化机制

> 以下路径来自 `PikaMug/Quests` 仓库实际文件树核实，不是猜测。

### 一、结论：中文覆盖很完整，装上就能用

Quests 的语言文件结构是 `lang/<locale>/strings.yml`——**按语言分目录，每个目录里一个 `strings.yml`**：

```
lang/
├── en/                 ← 英文
│   └── strings.yml
├── zh-CN/              ← 简体中文
│   └── strings.yml
├── zh-TW/              ← 繁体中文
│   └── strings.yml
└── ...（共 46 个语言目录）
```

本站核实到**共 46 个语言文件**。这个量级在 Minecraft 插件里属于中上水平——任务名、阶段提示、完成奖励文本、GUI 按钮都在里面。

对比一下：很多任务插件只翻译了「你接取了任务」这一句，任务描述和 GUI 全是英文。Quests 不是。

### 二、怎么切换成中文

有**两种方式**，选一种就行。

**方式 A：跟随客户端（推荐）**

不填 `language` 项（或填客户端对应的 locale），简体客户端自动拿 `zh-CN`。

好处是混合语言环境不用管；坏处是**没法强制全服统一**——英文客户端进来就是英文。

**方式 B：写死 locale**

`plugins/Quests/config.yml`：

```yaml
# 用 /lang/ 下的哪个语言目录。
# 例如 "FR-fr" 会加载 /lang/FR-fr/strings.yml
language: zh-CN
```

中文服务器建议用这个，行为可预期。

> 注意这个值**区分大小写且用连字符**：`zh-CN`、`zh-TW`。写 `zh-cn` 或 `zh_CN` 都不对，会回落到英文。

### 三、翻译和配置是分开的

| 文件 | 管什么 |
|------|--------|
| `lang/zh-CN/strings.yml` | **界面文本**：命令帮助、GUI 标题、提示语、错误信息 |
| `plugins/Quests/quests/*.yml` | **你自己写的任务**：`name`、`ask-message`、`finish-message` 全是你自己填的 |

**所以「任务名是英文」不是汉化问题**——那是任务定义里你自己写的 `name: "Lumberjack Training"`。改任务文件就行，别去动 `lang/`。

这是一个常见误解：很多人把任务文本汉化的锅甩到语言文件上，结果改了半天 `strings.yml` 一点变化都没有。

### 四、想自己补全翻译

1. 进 `plugins/Quests/lang/zh-CN/strings.yml`
2. 对照 `lang/en/strings.yml` 逐条补
3. `/quests reload`

**优先补这几类**（玩家最先看到的）：

| 键名大致位置 | 内容 | 缺失影响 |
|-------------|------|---------|
| 命令帮助段 | `/q list` 之类的用法提示 | 玩家不知道怎么用命令 |
| GUI 按钮 | 任务日志里的按钮 | 界面里是英文 |
| 通用提示 | 接取/放弃/完成提示 | 操作反馈看不懂 |
| 错误信息 | 「你还没完成前置任务」这类 | 玩家不知道为什么接不了 |

改完记得存 **UTF-8**。用 Windows 记事本改的很容易存成 ANSI，然后满屏乱码。

### 五、几个容易踩的坑

**`language` 写小写了没生效**

`zh-cn` ≠ `zh-CN`。这个键值直接拼目录名，大小写错了就找不到文件，静默回落英文。

**改完 lang.md 不生效**

先试 `/quests reload`。**不行就完整重启**——Quests 有些语言内容在启动时就拼进了命令提示，`/reload` 不一定能刷掉。

**任务名改完还是英文**

见上面第三节——任务名在 `quests/*.yml` 里，不在 `lang/` 里。

**子命令变成中文了，脚本/教程失效**

Quests 会把子命令按语言翻译。`/q list` 在中文环境下可能不再是 `list`。给玩家的说明文档要跟着语言走。

**翻译里带 `&` 颜色码被转义了**

`strings.yml` 支持 `&` 颜色码。如果你在某些编辑器里批量替换，把 `&` 变成了 `&amp;`，玩家会直接看到 `&amp;a` 这种东西。

### 六、别指望汉化能覆盖的部分

**语言文件只管 Quests 自己的界面。以下不会汉化：**

- **你任务里写的文本** —— 自己的活
- **物品名 / lore** —— 走 Minecraft 自带的物品名机制，需要 Translators 或资源包
- **Citizens NPC 的名字** —— 那是 Citizens 的事
- **其他插件的提示** —— 各管各的

想让全服都中文，光汉化 Quests 不够。通常的做法是：每个插件各自汉化 + 一个通用翻译插件兜底。

## 下一步

- 全站汉化思路和通用方案 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
- 多语言服怎么配权限 → [权限系统设计](#/guide/permissions-design)
- 用 LuckPerms 管理 Quests 权限节点 → [LuckPerms 权限管理](#/plugin/luckperms)
