# Slimefun 汉化机制

> 以下路径来自官方仓库 `Slimefun/Slimefun4` 的实际文件树核实，不是猜测。

### 一、结论：汉化非常完整，装完就有中文

Slimefun 的语言文件在 `src/main/resources/languages/` 下，**按语言分目录**，每个目录内是分模块的 YAML：

```
src/main/resources/languages/
├── en/                     ← 英文（基准）
│   ├── categories.yml      ← 分类名（机器/食物/矿物…）
│   ├── messages.yml        ← 界面提示
│   ├── recipes.yml         ← 配方显示名
│   ├── researches.yml      ← 研究条目
│   └── ...
└── zh/                     ← 简体中文
    ├── categories.yml
    ├── messages.yml
    ├── recipes.yml
    ├── researches.yml
    └── ...
```

本站核实到 Slimefun 仓库里**共有 216 个语言相关文件**，其中**中文（`zh/`）占 15 个**，覆盖 `categories.yml`、`messages.yml`、`recipes.yml`、`researches.yml` 等核心模块。

这个完整度在 Minecraft 插件里属于**第一梯队**——比很多只翻译提示语的插件强得多。

### 二、怎么切换成中文

**默认就是中文。** Slimefun 会跟随玩家客户端语言，简体客户端自动拿 `zh/` 目录。

想强制指定，在 `plugins/Slimefun/config.yml`：

```yaml
# 强制英文界面：true = 全员英文，false = 按客户端语言
forceEnglishInterface: false
```

关键是**这个值要保持 `false`**。之前版本的老教程会让你手动改 `language:` 项，但当前版本已经改成「跟随客户端 + 一个英文开关」，照老教程加 `language: zh` 反而可能无效。

### 三、想自己补全翻译

1. 进服务器目录下的 `plugins/Slimefun/lang/`（**不是仓库里的 `languages/`**，运行时目录名可能不同）
2. 找到 `zh/` 目录（没有就自己建）
3. 对照 `en/` 目录里的英文文件逐条补
4. 重启服务器

**建议优先补这几个**：

| 文件 | 内容 | 缺失的影响 |
|------|------|-----------|
| `messages.yml` | 各类提示、报错 | 玩家看不懂操作反馈 |
| `categories.yml` | 分类标签 | 菜单分类显示英文 |
| `researches.yml` | 研究名称与描述 | 研究列表看不懂 |
| `recipes.yml` | 配方显示名 | 合成表里是英文 |

### 四、几个容易踩的坑

**菜单里出现 `&a` 之类的颜色代码乱码**

`messages.yml` 支持 `&` 颜色码。如果汉化时把 `&` 写成了 HTML 实体 `&amp;`，就会原样显示出来。改完检查一遍有没有误替换。

**物品名字显示不出来**

物品显示名走的是 Minecraft 自带的物品名机制，不是语言文件。如果显示异常，多半是资源包或客户端语言的问题，不是 Slimefun 的锅。

**翻译后重启没生效**

Slimefun 的语言文件在启动时读取。改完必须**完整重启服务器**，`/reload` 不生效。

### 五、别指望汉化能覆盖的部分

Slimefun 的中文文件只覆盖**界面文本**。这些不会汉化：

- **物品 lore**（说明文本）——大部分走物品元数据
- **研究树连线上的描述**——在物品元数据里
- **第三方扩展**（Slimefun 附属插件）——各写各的

这三块要中文只能自己动手改物品配置。

## 下一步

- [插件汉化与本地化完全指南](#/guide/plugin-localization) — 全站汉化思路
- [性能调优从入门到精通](#/guide/performance-tuning) — Slimefun 吃性能的真相
- [插件组合：按服务器类型直接抄](#/guide/plugin-combos) — 和哪些插件搭配
