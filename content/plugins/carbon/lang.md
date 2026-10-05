# Carbon 汉化机制

> 以下路径来自官方仓库 `Hexaoxide/Carbon` 的实际文件树核实。

## 一、结论：自带简繁中文，开箱即用

Carbon 的语言文件在仓库里共 **20 个**，中文占 2 个：

```
messages-zh_CN.properties      ← 简体中文
messages-zh_TW.properties      ← 繁体中文
```

命名是 Java `.properties` 的标准写法（`messages-` 前缀 + 语言码 + 后缀），**跟随玩家客户端语言自动切换**。

> ⚠️ 文档里前面提过「未核实到汉化机制」，那是当时的核实没查到仓库。**现已核实：Carbon 有官方中文语言文件**，本节即为更正。

## 二、怎么切换

默认跟随客户端语言，简体客户端自动生效。

如果服务器里玩家客户端语言五花八门、想强制统一，在 `plugins/Carbon/config.yml` 里找 locale 相关的配置项改成 `zh_CN`。**具体配置键名请以你手上版本的 `config.yml` 为准**——Carbon 3.x 还是 beta，配置结构可能继续变。

## 三、想改文案

1. 进 `plugins/Carbon/`，找语言覆盖目录（Carbon 3.x 用 `lang/` 子目录承载自定义语言，具体结构以实际生成的目录为准）
2. 复制一份 `messages-zh_CN.properties` 进去改
3. 重启服务器

**不要直接改 jar 里的文件**——升级就没了。

## 四、三个容易踩的坑

**改了没生效**

Carbon 是 beta，语言文件在启动时加载。改完必须**完整重启**，`/reload` 不行。

**简繁体选错了**

`zh_CN` 是简体，`zh_TW` 是繁体（**注意不是 `zh_HK`**，Carbon 没有这个文件）。给大陆玩家用 `zh_CN`。

**beta 版的配置不兼容**

`3.0.0-beta.39` 是 beta 通道。**beta 之间升级不保证配置兼容**，跨版本升级前务必备份 `plugins/Carbon/`。真要上生产服，等正式版。

## 五、什么不会被汉化

语言文件只管**界面提示文本**。这些仍然需要你自己处理：

- **频道显示名和格式** —— 在频道配置里写，支持 MiniMessage，可以直接写中文
- **自定义消息模板**（Discord 转发内容、跨服同步消息）—— 在对应配置里写
- **第三方扩展的文案** —— 各写各的

## 下一步

- [插件汉化与本地化完全指南](#/guide/plugin-localization) — 全站汉化机制总表
- [聊天系统设计](#/guide/chat-system) — 频道制怎么配
- [插件汉化与本地化完全指南](#/guide/plugin-localization)
