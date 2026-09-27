# === DiscordSRV config.yml 关键项（中文注释版）===
# 位置: plugins/DiscordSRV/config.yml（首次启动后自动生成）
# 下面列出的是最常用的配置项；完整键以你生成的文件为准

# ========= 机器人凭证 =========
BotToken: "你的Discord Bot Token"
# 从 Discord Developer Portal 获取，泄露后任何人可以控制你的机器人

# ========= 频道绑定 =========
# 格式: "游戏内频道ID": "Discord频道ID"
# 获取方式: Discord 里右键频道 → 复制频道 ID（需开启开发者模式）
Channels: {"000000000000000000": "000000000000000000"}

# ========= 消息模板 =========
# 游戏内消息同步到 Discord 的格式
DiscordChatChannelMessageFormat:
  - "**{displayname}**: {message}"

# 进服/退服通知
MinecraftPlayerJoinMessageFormat: "**{username}** 加入了服务器"
MinecraftPlayerQuitMessageFormat: "**{username}** 离开了服务器"

# ========= 行为开关 =========
DiscordChatChannelPrefixRequiredToProcessMessage: ""
# 设为 "!" 则只有以 ! 开头的 Discord 消息才会同步到游戏（防止刷屏）

Experiment_MCDiscordReserializer_ToDiscord: true
# 启用后游戏内的颜色/格式代码会转为 Discord 的 Markdown 显示
```

> **验证**：启动后控制台如果出现 `[DiscordSRV] Bot connected`，说明连接成功。
>
> **安全提醒**：Bot Token 不要分享、不要提交到 Git。泄露后请在 Discord Developer Portal 立即 Reset Token。
