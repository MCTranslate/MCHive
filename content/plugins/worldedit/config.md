# === WorldEdit 配置文件（中文注释版）===
# 位置: plugins/WorldEdit/config.yml（首次启动后自动生成）
# 完整文件项很多，这里列出新手真正会动到的常用项
# 修改后执行 /we reload 或重启服务器生效
# 提示: 文件里没有的项保持默认即可，不要照抄别人的整份配置

# ========= 选区工具 =========
register-on-help: true             # 是否把 // 命令注册进 /help 列表（关掉可以减少刷屏）
wand-item: minecraft:wooden_axe    # 选区魔杖，默认木斧。可以换成金斧等，用完整物品 ID

# 超级镐（//sp 命令调用的工具，与木斧选区无关）
super-pickaxe:
  mode: single                     # single=单块 / area=范围 / recursive=连锁挖掘
  drop-items: true                 # 被超级镐挖掉的方块是否生成掉落物
  max-range: 5                     # area / recursive 模式的最大作用范围（格）

# ========= 历史记录（//undo 靠它）=========
history:
  size: 15                         # 每个玩家保留多少步撤销记录，越大越吃内存
  expiration: 10                   # 记录保留分钟数，超时后 //undo 就失效了

# ========= 操作上限（开服防卡重点！）=========
# 不设上限时，别人一条 //set 填几十万格会把整个服卡死
# 建议按服的规模设一个保守值，管理员可以用 //limit 临时提高
limits:
  max-blocks-changed:
    default: 20000                 # 单次操作默认最多变更多少方块（-1 = 不限制）
    maximum: 20000                 # 玩家用 //limit 能自行调到的上限，建议与 default 相同
  max-radius: 100                  # //sphere、//cyl 等半径类命令的最大半径（-1 = 不限制）
  max-super-pickaxe-size: 5        # 超级镐范围模式的最大尺寸
  max-brush-radius: 10             # 笔刷（//brush）最大半径
  default-max-polygon-points: 20   # 多边形选区（//poly）默认最大顶点数

# ========= 背包模式（防作弊/防熊进阶）=========
use-inventory:
  enable: false                    # 开启后 WorldEdit 只能使用玩家背包里真实拥有的方块来填充
                                   # 生存向公益服建议开启，防止管理员"凭空变方块"
  allow-override: false            # 是否允许玩家用权限绕过背包模式

# ========= 建筑文件（schematic）=========
snapshots:
  directory: plugins/WorldEdit/snapshots
                                   # 快照目录：放入世界备份文件夹后可用 //restore 恢复地形

# ========= 其他 =========
no-double-slash: false             # true 后允许用单斜杠 /set 代替 //set（容易与普通命令混淆，不建议开）
