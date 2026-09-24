# === EssentialsX 配置文件（中文注释版）===
# 完整配置请从官方jar中解压，这里仅展示常用选项
#
# 每个选项后面有用 # 开头的解释行，用于帮助理解

# 语言设置 — 默认 english，改为 zh 启用中文（需配合 lang_zh.yml）
locale: english

# ========= 经济系统 =========
currency-symbol: '$'              # 显示在经济金额前的符号
max-money: 10000000000000         # 玩家最大余额，防止经济溢出
min-money: -10000                 # 玩家最小余额（允许欠费的额度）
default-balance: 100              # 新玩家初始余额

# ========= 传送设置 =========
teleport-delay: 3                 # 传送等待秒数（设为0则瞬间传送）
teleport-cooldown: 5              # 传送冷却秒数（防滥用）
teleport-invulnerability: 5       # 传送后的无敌秒数

# ========= 家设置 =========
homes:
  default: 3                      # 默认可设置的家数量
  vip: 10                         # 有 essentials.sethome.multiple.vip 权限的上限
  vip2: 20                        # 更高权限组的上限

# ========= 昵称设置 =========
nickname:
  max-length: 30                  # 昵称最大字符长度
  prefix: '~'                     # 昵称前缀 — ~nick 表示是昵称
  change-displayname: true        # 是否在头顶/列表也显示昵称

# ========= 聊天设置 =========
chat:
  radius: 0                       # 本地聊天半径（0 = 全局聊天）
  format: '&r{DISPLAYNAME}&7:&r {MESSAGE}'  # 聊天格式模板

# ========= OP 保护 =========
op-protect: true                  # 防止覆盖已有的 OP 列表

# ========= 静置踢出 =========
idle-timeout: 60                  # 多少分钟不动后被踢出（0 为禁用）
idle-kick-message: "&c你因长时间不动被踢出。"

# ========= 最大冰冻 =========
freeze-timeout: 60                # 玩家被管理员冰冻后多久自动解冻

# ========= 清理设置 =========
auto-cleanup:                     # 自动清理间隔（天）
  accounts: 0                     # 清理未登录的天数（0为禁用）

# ========= 调试 =========
debug: false                      # 是否输出调试日志
