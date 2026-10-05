# Multiverse-Inventories 汉化机制

> 以下来自 Multiverse 官方系列的机制核实（与本站 [Multiverse-Core 汉化机制](#/plugin/multiverse-core) 同源）。

## 一、结论：自带中文，开箱即用

Multiverse-Inventories 内置简体中文语言文件：

```
multiverse-inventories_zh.properties
```

命名是 Java `.properties` 的标准写法（插件名 + `_` + 语言码 + 后缀），**跟随玩家客户端语言自动切换**。

**Multiverse 官方系列的汉化是一等公民**——Core、Inventories 等模块都有内置中文。这在 Bukkit 插件里不算普遍，但在这一批里是加分项。

## 二、怎么切换

默认跟随玩家客户端语言，简体客户端自动生效。

如果服务器里玩家客户端语言五花八门、想强制统一，**本站未核实到该插件是否提供强制语言的配置项**，需要的话请自行确认——

1. 进 `plugins/Multiverse-Inventories/` 目录
2. 看有没有 locale / language 相关的配置文件
3. 以你版本的实际配置文件注释为准

**不要照抄其他版本的键名** —— Multiverse 5.x 换过配置结构。

## 三、想改文案

1. 进 `plugins/Multiverse-Inventories/`
2. 找语言覆盖目录（**具体结构以你版本实际生成的目录为准**）
3. 复制一份 `multiverse-inventories_zh.properties` 进去改
4. 重启服务器

**不要直接改 jar 里的文件** —— 升级就没了。

## 四、三个容易踩的坑

**改了没生效**

语言文件启动时加载。改完**完整重启**。

**文件名写错**

必须是 `multiverse-inventories_zh.properties` 这个名字（**下划线 `_zh`**，不是 `-zh`）。**文件名不对插件会静默忽略它**，你以为改了其实没生效。

**和 Multiverse-Core 的语言文件搞混**

两个插件**各有各的语言文件**，别互相覆盖。Core 的归 Core，Inventories 的归 Inventories。

## 五、什么不会被汉化

语言文件只管**界面提示文本**。这些仍需你自己处理：

- **世界分组的名字** —— 分组名是你自己起的（配置文件里写），**不走语言文件**
- **其他插件的文案** —— 各写各的

> **实际建议**：这个插件需要汉化的价值很小——**它本来就没多少玩家可见的文本**。真正要汉化的东西（世界分组名）本来就是你配的，直接写中文。

## 下一步

- [插件汉化与本地化完全指南](#/guide/plugin-localization) — 全站汉化机制总表
- [Multiverse-Core](#/plugin/multiverse-core) — 前置插件
- [多世界配置](#/guide/multi-world-setup) — 整体规划
