# === WorldGuard 语言说明 ===
# 结论先说：WorldGuard 原版没有内置多语言，也没有「放进去就会被读取」的语言文件。

## WorldGuard 为什么没有直接可用的中文文件

WorldGuard 7 的插件消息是**硬编码在代码里的英文**，jar 内没有任何语言包 / messages 资源，
也没有类似 EssentialsX `messages_zh.properties`、WorldEdit `lang/i18n.zip` 那样的翻译加载机制。
因此，往 `plugins/WorldGuard/` 里放一个 `lang_zh.yml` 并不会改变游戏里的提示——原版根本不读它。

## 那要怎么汉化

WorldGuard 的提示主要有两类，处理方式不同：

| 提示类型 | 例子 | 汉化方式 |
|----------|------|----------|
| 区域消息 flag | `greeting` / `farewell` / `deny-message` 等 | **直接用中文写 flag 值**即可，如 `/rg flag 主城 greeting &a欢迎`，这是官方功能，无需任何插件 |
| 插件自身提示 | 「你不能在此建造」这类由插件写死的英文 | 需要第三方翻译插件 |

主流做法是装一个运行时翻译插件，例如 **[WorldGuard-Translator](https://www.spigotmc.org/resources/135615/)**（SpigotMC / [Modrinth](https://modrinth.com/plugin/worldguard-translator)，MIT 许可，支持 MC 1.16–26.x）。
它的原理是服务端启动时**在内存中对 WorldGuard 做字节码改写**，把英文提示替换成你配置的中文，**不需要改动 WorldGuard 的 jar**，升级 WorldGuard 后翻译仍然有效。
配套的中文词条可在它的 [translations 目录](https://github.com/SuperCHIROK1/WorldGuard-Translator/tree/main/translations) 里找或自己加。
同类工具（如 InJarTranslator 这类直接改 jar 的方案）也能用，但每次升级 WorldGuard 都要重做一次，维护成本更高。

> 经验提示：即便装了翻译插件，`/rg` 命令的**帮助与描述文本**仍可能有部分保持英文（来自上游命令框架，不在 WorldGuard 自己的消息表里）。

## 附：常用提示词条对照表

下面这份只是**对照参考**，帮你读懂日志和游戏里的英文提示，原版 WorldGuard 不会加载它。
真正会被读取的中文只有你自己写进 flag 的内容。

# 拒绝类提示（deny-message 相关）
build denied        → 你不能在这里建造。
pvp denied          → 此区域禁止 PVP。
you may not ...     → 你没有权限执行此操作。

# 区域与成员
Region defined      → 区域已创建。
Region ... overlaps → 该区域与现有区域重叠。
added member        → 已将玩家加入区域。
region info         → 区域拥有者 / 成员列表

# 选区与容量
region too large    → 选择的区域超过允许体积（regions.max-claim-volume）
max regions reached → 已达到可创建区域数量上限（regions.max-region-count-per-player）
