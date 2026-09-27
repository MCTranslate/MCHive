# === WorldGuard 配置文件（中文注释版）===
# 位置: plugins/WorldGuard/config.yml（首次启动后自动生成）
# 说明: 下面每个键名与默认值都取自 WorldGuard 官方源码（WorldConfiguration / BukkitWorldConfiguration）
#       以及 jar 内的键名字符串，可直接对照你服生成的 config.yml。
# 生效: 改完执行 /wg reload（需要 worldguard.reload 权限）或重启服务器。
# 注意: 每个世界还可以在 plugins/WorldGuard/worlds/<世界名>/config.yml 里单独覆盖这些项。

# ========= 玩家圈地：数量限制 =========
regions:
  enable: true                     # 是否启用区域（保护）功能，关闭后所有区域失效

  # 每个玩家可拥有的区域数量上限。
  # default 是「不在下面任何组里」的玩家所用值；
  # 其余键名是【权限组的组名】（来自玩家所属的权限组，如 LuckPerms 的组名，不是权限节点），
  # 玩家同时属于多个已列出的组时，取其中最大的值。
  max-region-count-per-player:
    default: 7
    # vip: 15                      # 例：给名为 vip 的权限组放宽到 15
    # staff: 50                    # 例：给名为 staff 的权限组放宽到 50

  # 玩家 /rg claim 认领时，单个区域的「体积」上限（方块数）。
  # 注意这是「体积」不是「面积」：50x50x12 的区域体积就是 30000。
  max-claim-volume: 30000

  # 认领的区域是否必须与「自己拥有的已有区域」重叠才能认领（防止到处乱圈）。
  claim-only-inside-existing-regions: false

  # 区域查询魔杖的物品（/wg wand 发给玩家、右键可列出该位置的区域）。
  wand: minecraft:leather

  # 以下为进阶项，按需开启：
  nether-portal-protection: true   # 是否保护下界传送门不被破坏/改变
  invincibility-removes-mobs: false # 设为 true 时，区域内的怪物在玩家进入后会消失
  protect-against-liquid-flow: false # 是否阻止液体（水/岩浆）流入/流出区域
  location-flags-only-inside-regions: false # 设为 true 时，spawn 等位置类 flag 只在区域内部生效
  fake-player-build-override: true # 假玩家（NPC 等）是否允许绕过建造限制
# 提示：想给某些玩家解除圈地数量/体积限制，给他们 worldguard.region.unlimited 权限即可。

# ========= 防御性设置（防熊/防破坏）=========
# 下面这些默认值大多为 false，即「允许」。想防住对应破坏行为，把对应项改成 true。

# --- 爆炸物 ---
ignition:
  block-tnt: false                 # true = 禁止点燃 TNT
  block-tnt-block-damage: false    # true = TNT 爆炸不破坏地形（仍可能造成伤害）
  block-lighter: false             # true = 禁止使用打火石

mobs:
  block-creeper-explosions: false  # true = 禁止苦力怕爆炸
  block-creeper-block-damage: false # true = 苦力怕爆炸不破坏地形
  block-wither-explosions: false   # true = 禁止凋灵爆炸
  block-wither-block-damage: false # true = 凋灵爆炸不破坏地形
  block-fireball-block-damage: false # true = 火球不破坏地形
  block-enderdragon-block-damage: false # true = 末影龙不破坏地形
  disable-enderman-griefing: false # true = 末影人不搬方块

# --- 火焰蔓延 ---
fire:
  disable-all-fire-spread: false   # true = 彻底禁止火焰蔓延
  disable-lava-fire-spread: false  # true = 禁止岩浆点燃周围方块

# --- 其他防护 ---
protection:
  item-durability: true            # true = 区域保护生效期间工具不再掉耐久
  remove-infinite-stacks: false    # true = 清理旧版无限堆叠的物品
  disable-xp-orb-drops: false      # true = 禁止掉落经验球
