# === EssentialsX 配置文件（中文注释版 · 基于 2.22.0）===
# 位置: plugins/Essentials/config.yml（首次启动后自动生成，共 1300+ 行）
# 下面每一项的键名与默认值都取自 EssentialsX 2.22.0 的真实配置，可直接对照你的文件修改
# ⚠ 缩进必须用空格，不能用 Tab（Bukkit 会报错）
# 改完执行 /ess reload（或 /essentials reload）生效

# ========= 语言 =========
# 去掉行首 # 并把 en 改成 zh 即启用内置简体中文（文件中该行默认是被注释掉的）
#locale: zh
per-player-locale: false      # 改为 true：每个玩家按自己客户端语言收消息，控制台保持服务器语言

# ========= 经济系统 =========
starting-balance: 0           # 新玩家的初始余额
currency-symbol: '$'          # 货币符号（显示在金额前）
currency-symbol-suffix: false # 改为 true 则符号显示在金额后（欧元习惯）
max-money: 10000000000000     # 玩家余额上限，防止经济溢出
min-money: -10000             # 余额下限（负值=允许透支/贷款，需 essentials.eco.loan 权限）
minimum-pay-amount: 0.001     # /pay 的最小转账金额，防刷小额
show-zero-baltop: true        # /baltop 是否显示余额为 0 的玩家
economy-log-enabled: false    # 是否记录买卖/交易告示牌的经济日志
allow-bulk-buy-sell: true     # 是否允许批量买卖

# ========= 传送 =========
teleport-cooldown: 0          # 传送冷却（秒），防滥用
teleport-delay: 0             # 传送前的等待秒数，0 = 瞬间传送
teleport-invulnerability: 4   # 传送后的无敌秒数
teleport-safety: true         # 自动把玩家挪到安全落点，防止传进方块里
teleport-when-freed: back     # 出狱后传送到的位置：back / spawn
tpa-max-requests: 5           # 同时挂起的最多传送请求数
tpa-accept-cancellation: 120  # 传送请求的有效秒数
respawn-at-home: false        # 死亡后是否回玩家自己的家重生
spawn-if-no-home: true        # 没有家时 /home 是否回出生点
spawn-on-join: false          # 玩家进服是否强制传送到出生点

# ========= 家 =========
sethome-multiple:             # 可设置的家数量——按权限节点分配，不是按组名硬编码
  default: 3                  # 无额外权限时的数量（已进游戏的家数上限）
  vip: 5                      # 需要权限 essentials.sethome.multiple.vip
  staff: 10                   # 需要权限 essentials.sethome.multiple.staff
# 想加档位就自己加一行（如 member: 8），并在权限插件里把 essentials.sethome.multiple.member 给对应组
confirm-home-overwrite: false # 用同名 /sethome 覆盖旧家时是否需要确认
update-bed-at-daytime: true   # 白天右键床是否更新重生点
world-home-permissions: false # 是否按世界隔离家（essentials.home.<世界名>）

# ========= 昵称 =========
nickname-prefix: '~'          # 昵称前缀，用来区分昵称和真实用户名
max-nick-length: 16           # 昵称最大长度（不含前缀）
change-displayname: true      # 是否把昵称同步到头顶/聊天显示名
                              # 若你还装了别的改显示名的插件，可设为 false 避免冲突

# ========= 聊天 =========
chat:
  radius: 0                   # 本地聊天半径（格），0 = 全局聊天
  format: '<{DISPLAYNAME}> {MESSAGE}'   # 聊天格式模板
  # 可用占位符：{MESSAGE} 消息内容、{USERNAME} 用户名、{DISPLAYNAME} 显示名
  # {DISPLAYNAME} 默认已包含 {PREFIX} 与 {SUFFIX}，同时使用会出现双重前缀
  group-formats:              # 按权限组分别设置格式（默认全部注释，按需放开）
    #default: '{WORLDNAME} {DISPLAYNAME}&7:&r {MESSAGE}'
    #admins: '&c[{GROUP}]&r {DISPLAYNAME}&7:&c {MESSAGE}'

# ========= 挂机（AFK）=========
auto-afk: 300                 # 静止多少秒后自动标记为暂离，-1 = 不自动标记
                              # 需要玩家有 essentials.afk.auto 权限
auto-afk-timeout: -1          # 暂离多久后被踢出或执行命令，-1 = 永不踢出
                              # 相关权限 essentials.afk.kickexempt 可豁免
cancel-afk-on-move: true      # 移动即取消暂离
cancel-afk-on-chat: true      # 发言即取消暂离

# ========= 保护（防止破坏性行为）=========
# protect.prevent 下的开关：**设为 true 表示禁用该行为**
protect:
  prevent:
    fire-spread: true         # 禁止火焰蔓延
    lava-fire-spread: true    # 禁止岩浆引燃
    lightning-fire-spread: true  # 禁止雷击引燃
    tnt-explosion: false      # 禁止 TNT 爆炸（默认允许）
    tnt-playerdamage: false   # 禁止 TNT 伤害玩家
    tnt-itemdamage: false     # 禁止 TNT 破坏掉落物
    fireball-explosion: false # 禁止火球爆炸（默认允许）
    lava-flow: false          # 禁止岩浆流动（默认允许）
    water-flow: false         # 禁止水流（默认允许）
    flint-fire: false         # 禁止打火石点火（默认允许）

# ========= 服务器信息与更新 =========
debug: false                  # 是否输出调试日志（排查问题时临时开启）
update-check: true            # 启动时检查 EssentialsX 新版本
ops-name-color: '4'           # OP 名字在 /list 里的颜色代码
allow-silent-join-quit: false # 是否允许静默进出服（essentials.silentjoin 权限）
mails-per-minute: 1000        # 每分钟邮件上限，防刷
max-walk-speed: 0.8           # /speed 步行速度上限
max-fly-speed: 0.8            # /speed 飞行速度上限

# ========= 这些事不靠 config 做 =========
# 给玩家发钱      → /eco give <玩家> <金额>
# 加权限          → 权限插件（LuckPerms 等）里分配 essentials.* 系列节点
# 单个世界禁用某功能 → world-teleport-permissions / no-god-in-worlds 等开关
# 完整配置说明    → https://essentialsx.net/wiki/Home.html
