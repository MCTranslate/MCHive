# === CoreProtect 配置文件（中文注释版 · 基于 24.1）===
# 位置: plugins/CoreProtect/config.yml（首次启动后自动生成）
# 下面每一项的键名与默认值都取自 CoreProtect 24.1 的实际定义，可直接对照你的文件修改
# 改完不用重启：游戏内或控制台执行 /co reload 即可生效

# ========= 捐赠密钥（可留空）=========
donation-key: ''
# CoreProtect 是捐赠制插件。捐赠密钥用于解锁 Patreon 专属功能（如 /co migrate-db 数据库迁移）
# 没有密钥也完全不影响正常使用，留空即可

# ========= 数据库 =========
# 默认使用内嵌 SQLite（plugins/CoreProtect/database.db），中小型服完全够用
use-mysql: false
table-prefix: co_              # 表名前缀 — 多个服务端共用一个 MySQL 库时靠它隔开，务必各服不同
mysql-host: 127.0.0.1          # 数据库地址
mysql-port: 3306               # 数据库端口
mysql-database: database       # 数据库名
mysql-username: root           # 数据库用户
mysql-password: ''             # 数据库密码

# 切换 MySQL 的完整步骤：
# 1. 先建好数据库并给账号授权（不用手动建表，插件会自建）
# 2. 填写上面几项，把 use-mysql 改为 true，并按需修改 table-prefix
# 3. 重启服务器，插件会在新库里建表
# 注意：切换数据库只是换了目标，**不会自动搬运已有记录**。切换前务必停服备份
#       plugins/CoreProtect/ 整个目录；要搬迁历史数据只能用捐赠密钥解锁的 /co migrate-db（23.0+ Patreon 版）

# ========= 语言 =========
language: en
# 默认 en。改为 zh-CN 即自动启用简体中文（官方语言码列表：https://coreprotect.net/languages/）
# 详见「Lang 汉化」页

# ========= 自动清理与更新检查 =========
auto-purge: false              # 自动清理过期记录，如 30d / 12w / 6mo；false 表示关闭
check-updates: true            # 启动时检查更新，有新版本会在控制台提示
error-reporting: true          # 出错时自动把错误信息发送给插件作者（隐私敏感可关）
api-enabled: true              # 允许其他插件调用 CoreProtect API（如领地/商店插件联动）

# ========= 查询与回滚行为 =========
verbose: true                  # 回滚/恢复时是否显示详细信息（默认已开；命令里加 #verbose 也能临时触发）
default-radius: 10             # 回滚/恢复**没写 r: 时**自动套用的半径；设为 0 表示不自动加半径
max-radius: 100                # 单条命令允许使用的最大半径；设为 0 表示不限制
                               # 要做全服回滚请用 r:#global，而不要盲目调大 max-radius

# ========= 回滚内容 =========
rollback-items: true           # 回滚时是否一并还原容器内被取走的物品
rollback-entities: true        # 回滚时是否一并还原被杀死的实体（如动物）

# ========= 记录范围（true = 记录）=========
# 这一组决定「什么会被写进数据库」——想看什么就开什么，全关等于白装
skip-generic-data: true        # 跳过通用数据（如僵尸白天被烧死这类自然现象）不记录
block-place: true              # 玩家放置方块
block-break: true              # 玩家破坏方块
natural-break: true            # 附着物掉落（如挖掉泥土后火把掉落）
                               # 关掉会导致床/门无法正确回滚，建议保持开启
block-movement: true           # 追踪方块位移（沙子、沙砾下落）
pistons: true                  # 追踪活塞推动的方块
block-burn: true               # 方块被火烧毁
block-ignite: true             # 方块被自然点燃（如火势蔓延）
fire-extinguish: false         # 火焰自然熄灭（默认关闭，开了日志量很大）
explosions: true               # 爆炸（TNT、苦力怕）
entity-change: true            # 实体改变方块（如末影人搬方块）
entity-kills: true             # 实体被杀死（牛、末影人等）
sign-text: true                # 木牌文字 —— 关掉后回滚出来的牌子会是空白的
buckets: true                  # 玩家用桶放置/收回水与岩浆
leaf-decay: true               # 树叶自然凋零
tree-growth: true              # 树木生长（会关联到种树的玩家）
mushroom-growth: true          # 蘑菇生长
vine-growth: true              # 藤蔓自然生长
sculk-spread: true             # 幽匿催发体扩散
portals: true                  # 传送门自然生成（如下界门）
water-flow: true               # 水流 —— 关掉后水冲掉的火把无法回滚
lava-flow: true                # 岩浆流 —— 同上
liquid-tracking: true          # 把液体与放置它的玩家关联起来
                               # 例：玩家放水冲掉火把，回滚该玩家即可全部还原
item-transactions: true        # 物品交易（从箱子/熔炉/发射器取放物品）
item-drops: true               # 玩家丢弃物品
item-pickups: true             # 玩家拾取物品
hopper-transactions: true      # 漏斗传输（箱子少东西先看这里）
player-interactions: true      # 玩家交互（开门、按按钮、开箱子）——**交互无法回滚**，只用于查询
player-messages: true          # 玩家聊天消息
player-commands: true          # 玩家执行的命令
player-sessions: true          # 玩家登录/登出
username-changes: true         # 玩家改名记录
worldedit: true                # 记录 WorldEdit 造成的改动（装了 WorldEdit 才有意义）

# ========= 这些事不靠 config 做 =========
# 清理旧日志      → /co purge t:60d（游戏内只能清理 30 天前的，控制台只能清理 24 小时前的）
# 查询 / 回滚     → /co lookup / /co rollback（见「安装教程」页）
# 权限控制        → 权限插件里分配 coreprotect.* （或细分到 coreprotect.lookup / rollback / restore / purge / inspect）
# 屏蔽某些记录    → 在插件目录建 blacklist.txt，逐行写要忽略的玩家 / 命令 / 方块 / 实体
#                   例：minecraft:creeper（不记录苦力怕死亡）、minecraft:shears@#dispenser（只屏蔽发射器发出的剪刀）
# 分世界单独设置  → 把 config.yml 复制成 <世界文件夹名>.yml（如 world_nether.yml），只写要改的项
#                   未写的项自动沿用 config.yml 的值
