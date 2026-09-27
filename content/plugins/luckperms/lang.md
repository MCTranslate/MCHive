# LuckPerms 中文说明

LuckPerms 自带完整的多语言系统，无需手动翻译。

## 安装中文语言包

默认配置里 `auto-install-translations` 为 `true`，插件会自动下载并定期更新语言包。你也可以手动触发一次：

```
/lp translations install
```

这会从与插件同一套官方服务器（`metadata.luckperms.net`）下载包括简体中文在内的所有语言包。语言文件会放在：

- `plugins/LuckPerms/translations/repository/` — 插件自动下载的语言包
- `plugins/LuckPerms/translations/custom/` — 手动放置的自定义语言包

如果服务器无法访问外网，就把别人机器上 `translations/repository/` 里的 `.properties` 文件复制到你自己服务器的对应目录（或放进 `custom/`）。

## 如何让玩家显示中文

玩家的 Minecraft 客户端只需设置为「简体中文」，进入游戏后 LuckPerms 相关的消息就会自动显示中文。语言是按玩家客户端语言分别显示的，同一台服务器上不同语言的玩家各看各的。

## 常见问题

- **没汉化？** 检查语言包是否已下载（`translations/` 下是否有文件）、以及玩家客户端的语言设置
- **部分英文？** 说明对应句子还没翻译或翻译未更新，可等待官方更新，或自行修改 `custom/` 目录下的语言文件
- **控制台一直是英文？** 正常现象，游戏内消息按玩家客户端语言本地化
