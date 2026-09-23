# === WorldGuard 配置文件（中文注释版）===
# 此文件位于 plugins/WorldGuard/config.yml

# ========= 玩家可创建区域数 =========
# 每个玩家（按权限组区分）最多能创建多少区域
max-region-count-per-player:
  default: 7    # 默认玩家
  vip: 15       # 有 worldguard.vip 权限的玩家
  staff: 50     # 有 worldguard.staff 权限的玩家

# ========= 玩家可创建区域面积 =========
# 每个区域最多包含多少个方块
max-region-area:
  default: 2500   # 默认玩家最大面积（50x50）
  vip: 10000      # VIP 玩家
  staff: 50000    # 管理员

# ========= 安全选项 =========
# 只在已有区域内部可创建新区域（防止重叠）
claim-only-inside-existing-regions: false

# 禁止玩家在世界边界外创建区域
regions:
  max-claim-volume: 30000  # 玩家所有权区域的总体积上限

# ========= 防御性设置 =========

# 阻止黑曜石生成器（水+岩浆形成黑曜石的机制）
disable-obsidian-generators: true

# TNT 只造成伤害，不破坏地形
block-tnt-block-damage: false

# 苦力怕爆炸是否破坏地形
block-creeper-block-damage: false

# 凋零爆炸是否破坏地形
block-wither-block-damage: true

# 末影人是否搬动方块
block-ender-block-damage: true

# 苦力怕/恶魂火球是否造成火焰蔓延
block-fireball-fire: true

# ========= 游戏规则覆盖 =========
# 这些规则会在有区域的地方被强制设置

game-rules:
  # 禁止生物破坏地形（末影人、苦力怕等）
  mob-griefing: false

  # 是否在无区域的世界中覆盖游戏规则
  disable-in-worlds:
    # - world_nether  # 下界不覆盖

# ========= 性能设置 =========
# 防止因大量实体导致卡服
max-players-per-region: 100  # 单区域最多实体数

# ========= 权限调试 =========
# 设为 true 后会输出 flag 检查的调试信息
debug-flag-state: false
