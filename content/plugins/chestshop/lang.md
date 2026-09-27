# ChestShop 内置简体中文 — `lang.zh.yml` 已随 jar 分发

**结论先说：ChestShop 自带简体中文翻译（`lang.zh.yml`，97 行），无需额外下载语言文件。**

## 启用方式

ChestShop 自动检测服务端语言。如果你需要强制指定：

```properties
language=zh
```

在生成的 `plugins/ChestShop/config.yml` 中设置即可。

## 编辑翻译

语言文件在 jar 内的 `languages/` 目录，生成后位于 `plugins/ChestShop/languages/`。每个文件是一个 **YAML** 文件（键值对，无嵌套），键名固定不可改，值可以自由编辑。

## 常见坑

| 症状 | 原因 |
|------|------|
| 招牌上显示英文 | 招牌**自动生成的部分**（物品名、价格）由插件代码控制，无法翻译 |
| 消息仍是英文 | ChestShop 的消息文件在 `languages/` 目录下；检查 `config.yml` 的 `language` 设置 |
| 改了语言文件没效果 | ChestShop 需要**重启服务器**才会重新加载语言文件（无 reload 命令） |

## 下一步

- 经济系统还没搭好？→ [经济系统搭建](#/guide/economy-setup)
- QuickShop 和 ChestShop 怎么选？→ [插件组合](#/guide/plugin-combos) 有对比
