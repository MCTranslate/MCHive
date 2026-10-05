# BentoBox 汉化机制

> 以下路径来自 `BentoBoxWorld/BentoBox` 仓库实际文件树核实，不是猜测。

### 一、结论：语言文件存在，但要你显式指定 locale

BentoBox 的语言文件是**平铺的单个 yml**，按 locale 命名，**不分子目录**：

```
locales/
├── en.yml
├── de.yml
├── fr.yml
├── zh-CN.yml          ← 简体中文
├── zh-TW.yml          ← 繁体中文
└── ...
```

结构比 Quests 简单，但**它不会自动跟随客户端**——必须告诉它用哪个。

### 二、怎么切换成中文

编辑 `plugins/BentoBox/config.yml`：

```yaml
locale: zh-CN
```

繁体就是 `zh-TW`。

**值写错会怎样**：BentoBox 找不到对应文件会回落到 `en.yml`，**只在控制台打一行提示**，游戏里就默默变英文了。所以「改了 locale 还是英文」第一件事是去看控制台。

| locale 值 | 对应文件 |
|----------|---------|
| `zh-CN` | `locales/zh-CN.yml` |
| `zh-TW` | `locales/zh-TW.yml` |
| `en` | `locales/en.yml` |

> 注意这里是**连字符**（`zh-CN`），和 PlayerPoints 的**下划线**（`zh_CN`）不一样。两个插件的写法别搞混。

### 三、player 侧也能单独切语言

除了全局 `locale`，玩家自己可以单独改：

```
/island language
```

这会打开语言选择 GUI。**这个设置是按玩家存的**，会覆盖全局 locale。

管理上这其实是个麻烦事：管理员设了 `zh-CN`，玩家自己切成英文，你从配置里看不出来。所以这条命令建议**收回权限**，只留给管理组。

### 四、想自己补全翻译

1. 进 `plugins/BentoBox/locales/zh-CN.yml`
2. 对照 `locales/en.yml` 补
3. `/bentobox reload`

这个文件是**一个巨型 yml**，内容会很长。优先补这几块：

| 内容 | 缺失影响 |
|------|---------|
| 岛屿设置面板的 flag 名称与说明 | 玩家在 GUI 里看选项全英文，不知道哪个是啥 |
| 队伍 / 传送 / 删除相关提示 | 日常操作反馈看不懂 |
| 错误信息 | 不知道为什么操作失败 |
| 等级、成就类文本（来自扩展） | 装了扩展但扩展的文本是英文 |

**关键点：扩展有自己的语言文件。** `zh-CN.yml` 只管 BentoBox 本体，各扩展的文本在：

```
plugins/BentoBox/addons/<扩展名>/locales/
```

装了 Level、Challenges、Warps 这些扩展，**每个都要单独汉化**，光汉化本体是不够的。

### 五、几个容易踩的坑

**`locale` 改了但没生效**

先 `/bentobox reload`。还不行就完整重启——某些扩展在启动时就把语言文本读进内存了。

**`locales/zh-CN.yml` 编辑后加载失败**

YAML 缩进错一个空格，整个文件解析失败，BentoBox 回落到英文，**控制台只报一个模糊的行号**。改大文件前先备份。

**改完变成乱码**

存成了非 UTF-8。Windows 记事本默认 ANSI，用 VSCode / Notepad++ 明确选 UTF-8。

**扩展的语言是英文，汉化本体没用**

见上面。`locales/` 是分层的：BentoBox 自己的、各扩展自己的，互不相通。

**玩家切了语言后管理员改 locale 没反应**

因为玩家级设置优先级更高。要统一管理就收回 `/island language` 的权限。

### 六、别指望汉化能覆盖的部分

- **岛屿蓝图里的自定义名字** —— 你自己的
- **物品名 / lore** —— 走 Minecraft 机制
- **其他插件的 GUI** —— 各管各的

岛屿玩法通常还会带一堆附属插件（Level / Challenges / Warps / Biomes），要全中文得逐个汉化。想省事用通用翻译插件兜底。

## 下一步

- 全站汉化的通用思路 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
- 多语言服权限怎么分 → [权限系统设计](#/guide/permissions-design)
- 岛屿等级 / 传送牌这些扩展怎么装 → [BentoBox 汉化机制](#/plugin/bentobox/lang.md)
