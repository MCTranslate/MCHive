# === BlueMap 配置文件（中文注释版 · 基于 5.28）===
# ⚠ BlueMap 的配置格式是 HOCON（不是 YAML）——层级用点号，值用 = 号
# 配置文件在 plugins/BlueMap/ 目录下，分为多个 .conf 文件
# 改完执行 /bluemap reload 生效

# ═══════════ core.conf（核心设置）═══════════

# 首次启动必须改为 true，否则 BlueMap 无法下载渲染所需的资源文件
accept-download = true

# 渲染线程数：1 = 单线程（最省 CPU 但渲染慢）
# 设为负数 = 使用 (CPU 核数 + 该值) 条线程，如 -1 在 8 核机器上用 7 条
# 建议：小服 1-2 条，大服可以多给
render-thread-count = 1

# 渲染线程优先级（1 = 最低 / 10 = 最高）。低优先级 = 渲染慢但对 TPS 影响小
render-thread-priority = 1

# 两次增量渲染之间的冷却时间（秒）
update-cooldown = 60

# 全量重新渲染的间隔（分钟）。1440 = 每 24 小时一次
full-update-interval = 1440

# ═══════════ webserver.conf（内置 Web 服务器）═══════════

# 内置 Web 服务的监听端口（默认 8100）
webserver.port = 8100
# 监听地址：默认 0.0.0.0 = 全网卡；改 "127.0.0.1" 则只允许本机访问（配合反向代理）
webserver.ip = "0.0.0.0"

# ═══════════ plugin.conf（玩家标记与可见性）═══════════

plugin.conf {
  live-player-markers = true   # 是否在地图上显示在线玩家标记
  hide-vanished = true         # 隐身玩家是否在地图上隐藏
  hide-invisible = true        # 隐形效果玩家是否隐藏
  hide-sneaking = false        # 潜行玩家是否隐藏
  player-render-limit = -1     # 地图上最多显示多少玩家标记，-1 = 不限
}

# ═══════════ storages/file.conf（存储设置）═══════════

# 渲染结果的存储位置与压缩格式
# compression 可选 gzip / zstd / deflate / none
# zstd = 更小更快，但需要较新版本的浏览器支持
storages.file.compression = gzip
```

> **改完执行** `/bluemap reload` 生效。注意：`accept-download` 在首次启动后必须改为 `true`，否则 BlueMap 无法下载渲染资源。
>
> ⚠ **配置格式是 HOCON 而非 YAML**——不要用 Tab 缩进，层级用点号。文档见 <https://bluemap.bluecolored.de/>
