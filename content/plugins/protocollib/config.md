# === ProtocolLib config.yml 说明 ===
# 位置: plugins/ProtocolLib/config.yml（首次启动后自动生成）
# ⚠ 绝大多数服主不需要修改此文件——它是一个被动的底层库

# ========= 常用项 =========
global:
  auto listener tick delay: 20  # 事件监听的 tick 间隔，默认 20（= 每 1 秒一次）
  debug: false                  # 调试模式（会输出大量日志，仅排错时开）
```

> **不要修改此文件**除非插件文档明确要求。改坏会导致依赖 ProtocolLib 的所有插件失效。
>
> 如果你看到 `ProtocolLib` 在启动日志中报红色错误，通常是**版本与 MC 不匹配**——去 [GitHub Releases](https://github.com/dmulloy2/ProtocolLib/releases) 下载与你的 MC 版本对应的 ProtocolLib 构建。
