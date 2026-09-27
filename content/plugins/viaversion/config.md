# === ViaVersion 配置文件（中文注释版 · 基于 5.12.x）===
# 位置: plugins/ViaVersion/config.yml（首次启动后自动生成）
# 改完执行 /viaversion reload 生效

# ========= 更新检查 =========
check-for-updates: true         # 启动时检查是否有新版本

# ========= 服务器列表 =========
send-supported-versions: false  # 在服务器列表 ping 响应中附带支持的版本范围

# ========= 版本拦截 =========
block-versions: []              # 用可读版本号屏蔽客户端，如 ['<1.16', '>1.17.1']
block-protocols: []             # 用协议号屏蔽客户端（进阶用法）
block-disconnect-msg: "You are using an unsupported Minecraft version!"
                                # 被上面两项拦截时显示的踢出消息
logging:
  log-blocked-joins: false      # 是否把「因版本被拦」的踢出记录到控制台

# ========= 包速率限制 =========
packet-limiter:
  enabled: true                 # 开启包速率限制，防止恶意刷包
  max-per-second: 800           # 短时上限（包/秒）
  max-per-second-kick-message: "You are sending too many packets!"
  sustained-max-per-second: 200 # 长时平均上限（包/秒）
  sustained-period-seconds: 7   # 长时统计的时间窗口（秒）
  sustained-threshold: 4        # 超过该次数后才踢出（防误判偶发高峰）
  sustained-kick-message: "You are sending too many packets, :("

# ========= 配置迁移 =========
migrate-default-config-changes: true
# 升级时自动把「仍为默认值」的键迁移到新默认值。
# 注意：你手动改过的键不会被自动覆盖。

# ========= 已废弃的旧键（不要再写）=========
# max-pps                    → 改为 packet-limiter.max-per-second
# max-pps-kick-msg           → 改为 packet-limiter.max-per-second-kick-message
# tracking-period            → 改为 packet-limiter.sustained-period-seconds
# suppress-conversion-warnings → 已收入 logging 段
