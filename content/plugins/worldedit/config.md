# === WorldEdit 配置文件（中文注释版）===
# 位置: plugins/WorldEdit/config.yml（首次启动后自动生成）
# 说明: WorldEdit 的默认配置项很多，这里只列新手真正会动到的部分。
#       下面每个键名与默认值都取自官方 jar 内 defaults/config.yml，可直接对照。
# 注意: YAML 缩进必须用 4 个空格，不能用 Tab，否则插件会报错。
# 生效: 改完执行 /we reload（需要 worldedit.reload 权限）或重启服务器。

# ========= 选区工具 =========
wand-item: minecraft:wooden_axe    # 选区魔杖，默认木斧。可换成其他物品，用完整物品 ID

# ========= 历史记录（//undo 靠它）=========
history:
    size: 15                       # 每个玩家保留多少步撤销记录，越大越吃内存
    expiration: 10                 # 记录保留分钟数，超时后 //undo 就失效了

# ========= 操作上限（开服防卡重点！）=========
# 默认 -1 = 不限制。别人一条 //set 填几十万格会把整个服卡死，
# 建议把 max-blocks-changed.default 设成保守值（如几千~几万）。
# 管理员需要临时大范围操作时用 //limit 提高，但最高不超过 maximum。
limits:
    max-blocks-changed:
        default: -1                # 单次操作默认最多变更多少方块（-1 = 不限制）
        maximum: -1                # //limit 能调到的上限（-1 = 不限制）
    vertical-height:
        default: 256               # 垂直方向操作的最大高度
    max-polygonal-points:
        default: -1                # //sel poly 多边形默认最多顶点数（-1 = 用下面的 maximum）
        maximum: 20                # 多边形选区允许的最大顶点数
    max-radius: -1                 # //sphere、//cyl 等半径类命令的最大半径（-1 = 不限制）
    max-super-pickaxe-size: 5      # 超级镐（//sp）范围模式的最大尺寸
    max-brush-radius: 5            # 笔刷（//brush）最大半径
    butcher-radius:
        default: -1                # //butcher 清理生物的最大半径（-1 = 不限制）
        maximum: -1
    disallowed-blocks:             # 禁止用于填充/替换的方块（默认是一批易「掉落」的物理方块）
    - "minecraft:oak_sapling"
    - "minecraft:tnt"
    - "minecraft:bedrock"
    # ……完整列表见你服生成的 config.yml；想彻底放开可改成 []

# ========= 背包模式（防作弊/防熊进阶）=========
use-inventory:
    enable: false                  # 开启后 WorldEdit 只能使用玩家背包里真实拥有的方块来填充
    allow-override: true           # 是否允许用权限绕过（默认 true；生存向公益服可改 false）
    creative-mode-overrides: false # 创造模式玩家是否无视背包限制

# ========= 建筑文件（schematic）=========
saving:
    dir: schematics                # //schem 保存的建筑文件目录（相对插件目录，即 plugins/WorldEdit/schematics）

# ========= 快照（//restore 用）=========
snapshots:
    directory:                     # 快照目录，默认为空（= 关闭快照功能）。填入目录名后可用 //restore 回滚地形

# ========= 其他常用 =========
show-help-on-first-use: true       # 玩家第一次使用时是否发送欢迎/帮助信息（嫌吵可关）
server-side-cui: true              # 是否开启服务端选区可视化（//sel 高亮框）
command-block-support: false       # 是否允许命令方块执行 WorldEdit 命令（谨慎开启）
navigation-wand:
    item: minecraft:compass        # 导航魔杖默认物品
    max-distance: 100              # 导航传送的最大距离
no-op-permissions: false           # 是否把「未声明权限的玩家」默认当作有全部权限（除非你清楚后果，保持 false）
