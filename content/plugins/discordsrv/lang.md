# DiscordSRV 无独立语言文件 — 消息模板在 config.yml 中自定义

DiscordSRV **没有**传统的 `lang_xx.yml` 或 `messages_xx.properties` 语言文件。所有推送到 Discord 的消息模板都写在 `plugins/DiscordSRV/config.yml` 的 `DiscordChatChannelMessageFormat` 等键中，直接编辑即可自定义格式。

支持的占位符包括 `{username}`（玩家名）、`{displayname}`（显示名）、`{message}`（消息内容）、`{world}`（世界名）等，完整列表见官方文档 <https://github.com/DiscordSRV/DiscordSRV/wiki>。
