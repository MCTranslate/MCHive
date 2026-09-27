# EssentialsX 自带完整简体中文 — 改一行配置即可

**结论先说：不需要下载任何语言文件。** EssentialsX 的 jar 里已经内置了 **1633 条**简体中文翻译（`messages_zh.properties`，条数甚至多于英文原文的 1615 条），覆盖率基本完整。

## 启用简体中文

1. 打开 `plugins/Essentials/config.yml`
2. 搜索 `Set the locale for all messages`，你会看到官方注释和一行被注释掉的配置：

```yaml
# Set the locale for all messages.
# ...
# For example, to set the language to English, set locale to 'en'. It will then use the file 'messages_en.properties'.
# Don't forget to remove the # in front of the line.
#locale: en
```

3. 去掉行首的 `#`，把值改成 `zh`：

```yaml
locale: zh
```

4. 执行 `/ess reload` 或重启服务器

`locale` 的取值就是文件名的中间段：设成 `zh` 就会加载 `messages_zh.properties`；繁体中文对应 `zh_TW` / `zh_HK`。

## 让每个玩家看自己的语言

如果你的服务器想面向多语言玩家，可以打开这个开关：

```yaml
# Should Essentials use the player's language instead of the server's when sending messages?
per-player-locale: false
```

- `false`（默认）：所有人统一用 `locale` 指定的语言
- `true`：**每个玩家按自己客户端设置的语言**收消息，控制台消息仍保持服务器语言

## 为什么网上流传的 `lang_zh.yml` 不能用

EssentialsX 的语言文件不是 YAML，而是一份 **Java `.properties` 文件**。两者完全不兼容，所以：

| | EssentialsX 的真实要求 | 网上流传的 `lang_zh.yml` |
|---|---|---|
| 文件格式 | Java `.properties`（`键=值`） | YAML（`键: 值`，还带缩进层级） |
| 文件位置 | `plugins/Essentials/` | 同左，但放进去了也不会被读 |
| 文件命名 | 必须是 `messages_<语言码>.properties` | `lang_zh.yml` —— 名字对不上，直接被忽略 |
| 颜色写法 | MiniMessage 标签，如 `<yellow>`、`<green>` | 用 `&a` 这类旧版颜色代码 |
| 变量占位 | `{0}` `{1}` `{2}` | `%1` `%2` |

即使把 `lang_zh.yml` 强行改名，格式和占位符也是错的，结果只会是消息显示异常或直接报错。**本站此前提供的该文件已下架**，正确做法就是上面的 `locale: zh`。

## 想微调文案？

EssentialsX 支持自定义语言文件：把修改后的 `messages_<语言码>.properties` 放进插件目录，并把 `locale` 指向它即可覆盖内置翻译。官方说明见 <https://essentialsx.net/wiki/Locale.html>（config.yml 里的注释也指向这一页）。

改文案时有两条硬性要求，否则消息会出错：

1. **保留 `{0}` `{1}` 这类占位符**，它们会被替换成玩家名、金额等数值
2. **颜色用 MiniMessage 标签**（`<yellow>`、`<green>`、`<dark_purple>`），不要用 `&a`

真实样例（取自内置 `messages_zh.properties`）：

```properties
addedToOthersAccount=已向<yellow>{1}<green>的账户充值<yellow>{0}<green>。目前余额：<yellow>{2}
alphaNames=<dark_red>玩家名称只能包含字母、数字和下划线。
```

> 小提示：内置中文文件里有个别错字（例如 `addedToAccount` 写成了「已向你的你的账户充值」），这属于上游翻译的小瑕疵，不影响使用；介意的话按上面的方式自定义一份覆盖即可。

## 常见问题

- **改了 `locale` 还是英文？** 确认三件事：① 改的是 `plugins/Essentials/config.yml`（不是 `EssentialsX` 目录）；② 行首的 `#` 确实去掉了；③ 执行过 `/ess reload` 或重启
- **部分消息仍是英文？** 少数新增条目可能尚未翻译，会回退英文；也可能是消息用了自定义格式
- **想让某个玩家单独用英文？** 把 `per-player-locale` 设为 `true`，该玩家客户端语言设成英文即可
