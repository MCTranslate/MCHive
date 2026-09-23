# LuckPerms 中文说明

LuckPerms 自带完整的多语言系统，无需手动翻译。

## 安装中文语言包

在服务器控制台执行一行命令即可：

```
/lp translations install
```

这会自动下载包括简体中文在内的所有语言包到 `plugins/LuckPerms/translations/` 目录。

如果服务器无法访问外网，也可以在 [GitHub](https://github.com/lucko/LuckPerms/tree/master/translations) 下载后手动放入目录。

## 如何让玩家显示中文

玩家的 Minecraft 客户端只需设置为「简体中文」，进入游戏后 LuckPerms 相关的消息就会自动显示中文。

## 常见问题

- **没汉化？** 检查语言包是否下载、玩家客户端语言设置
- **部分英文？** 等待翻译更新，或自己修改 `translations/` 目录下的语言文件
- **contrib 文件夹的用途？** 社区贡献的语言包，可放入 `translations/` 文件夹手动加载
