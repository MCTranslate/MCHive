# QuickShop-Hikari 自带简体中文 — 无需下载语言文件

**结论先说：QuickShop-Hikari 自带完整的多语言系统，且默认跟随玩家客户端语言。** 大多数情况下你不需要做任何事。

## 语言机制

QuickShop-Hikari 的翻译通过 **Crowdin OTA** 系统自动分发。`config.yml` 里有一个开关控制是否启用：

```yaml
use-crowdin-ota: true      # 默认 true，自动从 Crowdin 拉取最新翻译
crowdin-host: "https://crowdinota.hikari.r2.quickshop-powered.top"
```

玩家进服时，插件会检测其客户端语言并自动使用对应翻译，**无需手动配置**。

## 想强制全服使用中文？

```yaml
game-language: zh-CN       # 默认 "default"（跟随客户端）
```

改成 `zh-CN` 后，**所有玩家**（无论客户端语言设置）都会看到中文提示。

## 想改某条消息？

编辑 `plugins/QuickShop-Hikari/lang/zh-CN/messages.yml`——这个文件**只放你要覆盖的条目**，其余条目自动回退到内置翻译。

> 这个机制和 CoreProtect 的 `language.yml` 类似：**只写你要改的**，不要复制整个文件。
