# ViaVersion 自带 146 种语言（含 zh-CN）— 无需下载语言文件

**结论先说：ViaVersion 自带完整的多语言系统，且跟随玩家客户端语言自动切换。**

## 机制

ViaVersion 的翻译来源是 **Crowdin 社区**（[crowdin.com/project/viaversion-core](https://crowdin.com/project/viaversion-core)），随每次版本发布打包进 jar。

- jar 内 `lang/i18n.zip` 包含 **146 个语言目录**，其中 `zh-CN/strings.json` 就是简体中文（**451 条**，覆盖默认英文 461 条的约 **98%**）
- 还有 `zh-HK/`、`zh-TW/` 供港台玩家
- 服务端**没有任何语言开关**——所有语言自动启用

## 自定义翻译

ViaVersion 支持在插件目录中覆盖任意条目。查找优先级：

1. `plugins/WorldEdit/lang/<语言码>/strings.json`（用户目录，最高优先）
2. `plugins/WorldEdit/lang/i18n.zip` 里的 `<语言码>/strings.json`
3. jar 内 `lang/i18n.zip` 里的 `<语言码>/strings.json`
4. jar 内 `lang/strings.json`（默认英文）

> **只写你要覆盖的条目**——其余条目自动回退到内置翻译，升级后其它条目的翻译改进能自动享受到。

**限制**：自定义翻译**改不了颜色**，这一层只负责文本。另外，命令帮助里的部分描述受上游命令库限制暂时无法翻译。

## 下一步

- 服务端版本兼容的整体策略 → [客户端版本兼容策略](#/guide/version-compat)
- 老客户端进新服的方案 → [ViaBackwards](#/guide/version-compat)
