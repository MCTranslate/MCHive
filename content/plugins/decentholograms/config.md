# === DecentHolograms config.yml 关键项（中文注释版）===
# 位置: plugins/DecentHolograms/config.yml（首次启动后自动生成）
# 改完执行 /dh reload 生效

# ========= 显示 =========
always-visible-in-visible-range: true  # 是否始终显示（不分距离）

# ========= 交互 =========
click-cooldown: 1000            # 两次点击全息的最小间隔（毫秒）

# ========= 默认外观 =========
default:
  height: 0.25                  # 每行文字之间的垂直间距
```

> DecentHolograms 的全息内容存储在 `plugins/DecentHolograms/holograms.yml`，每条全息记录了名称、位置、各行文字。配置文件本身控制的是**全局行为**（如默认间距、交互冷却），不是每条全息的内容。
>
> 改完全息内容后执行 `/dh reload`，或用 `/dh movehere` / `/dh setline` 在游戏内实时调整。
