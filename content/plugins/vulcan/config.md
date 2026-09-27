# === Vulcan config.yml 常用项（中文注释版 · 基于 2.9.7.22）===
# 位置: plugins/Vulcan/config.yml（首次启动后自动生成，共 4186 行 / 141KB）
# ⚠ Vulcan 的**所有消息**也在此文件中——没有独立语言文件
# 改完执行 /vulcan reload 生效
# 📥 完整 4186 行逐行汉化版可在本页底部下载区获取（config_zh_CN.yml，直接覆盖可用）

# ========= 聊天前缀 =========
prefix: '&4&lVulcan &8»'

# ========= 检查项（41 项）=========
# 三大类别：combat / movement / player
# 每项可单独启停、设置阈值与惩罚

checks:

  # ── Combat（战斗，9 项）──
  combat:
    aim: {}            # 准星异常
    autoblock: {}      # 自动格挡
    autoclicker: {}    # 自动连点
    criticals: {}      # 非法暴击
    fastbow: {}        # 快速射弓
    hitbox: {}         # 碰撞箱异常
    killaura: {}       # KillAura
    reach: {}          # 超距攻击
    velocity: {}       # 击退异常

  # ── Movement（移动，18 项）──
  movement:
    antilevitation: {} # 反漂浮
    boatfly: {}        # 船飞行
    elytra: {}         # 鞘翅飞行异常
    entityflight: {}   # 实体飞行
    entityspeed: {}    # 实体速度
    fastclimb: {}      # 快速攀爬
    flight: {}         # 飞行
    jesus: {}          # 水上行走
    jump: {}           # 跳跃异常
    motion: {}         # 运动异常
    nosaddle: {}       # 无鞍骑行
    noslow: {}         # 无减速（走路上吃食物不减速）
    speed: {}          # 移动速度
    sprint: {}         # 疾跑异常
    step: {}           # 步高异常
    strafe: {}         # 侧移异常
    vclip: {}          # 垂直穿墙
    wallclimb: {}      # 爬墙

  # ── Player（玩家行为，14 项）──
  player:
    airplace: {}       # 空中放置
    badpackets: {}     # 异常数据包
    baritone: {}       # Baritone 自动挖掘
    fastbreak: {}      # 快速挖掘
    fastplace: {}      # 快速放置
    fastuse: {}        # 快速使用
    ghosthand: {}      # 隔墙操作
    groundspoof: {}    # 地面状态伪造
    improbable: {}     # 综合统计不可能行为
    invalid: {}        # 无效数据
    inventory: {}      # 背包操作异常
    scaffold: {}       # 脚手架/搭桥
    timer: {}          # Timer（加速游戏 tick）
    tower: {}          # 塔建

# ═══════════ 服务端全局设置（settings 段，40 键）═══════════
settings:
  async-alerts: false          # 是否异步发送警报
  bstats: true                 # bStats 统计
  cinematic: false             # 电影模式（减少旗帜闪烁）
  debug: true                  # 调试信息
  enable-api: true             # 启用 API（供其他插件调用）
  entity-collision: true       # 实体碰撞检查
  flight-cooldown: 40          # 飞行检测冷却
  hook-brewery: true           # 联动 Brewery
  hook-gsit: true              # 联动 GSit（坐下插件）
  hook-mcmmo: true             # 联动 mcMMO
  hook-mythicmobs: true        # 联动 MythicMobs
  ignore-floodgate: true       # ⭐ 忽略基岩玩家（Geyser+Floodgate 必开！）
  ignore-geyser-prefix: '*'    # 基岩玩家前缀
  ignore-geyser-prefixes: true # 忽略基岩玩家前缀
  ignore-vivecraft: false      # Vivecraft（VR 版）玩家是否忽略
  incompatability-manager: true # 不兼容管理器
  inject-early: true           # 尽早注入
  join-check-wait-time: 2500   # 玩家进服后开始检查的等待时间（毫秒）
  lenient-scaffolding: true    # 宽松脚手架检测（减少误判）
  max-alert-violation: 250     # 警报最大违规等级
  max-logs-file-size: 7500     # 日志文件最大行数
  min-ticks-existed: 3         # 玩家最少先存在的 tick 数

# ═══════════ 惩罚 ═══════════
punishments:
  message: []                  # 惩罚时执行的命令列表（支持 %player% 占位符）
  broadcast: []                # 惩罚时全服广播的消息

# ═══════════ 判决日（Judgement Day）═══════════
judgement-days:
  started-broadcast: []        # 开始时的广播
  ended-broadcast: []          # 结束时的广播
  commands: []                 # 执行的命令列表
  broadcast: true              # 是否广播
  cooldown: 0                  # 冷却时间
  run-at-interval: false       # 是否定时运行

# ═══════════ 冻结 ═══════════
freeze:
  logged-out-while-frozen-commands: []  # 冻结时退出服务器的玩家执行的命令

# ═══════════ 幽灵方块修复 ═══════════
ghost-blocks-fix:
  enabled: true                # 幽灵方块修复（服务器与客户端方块不一致时自动修正）
  ghost-water-fix: true        # 水方块幽灵修复
  minimum-tps: 18.0            # 最低 TPS（低于此值不执行修复）
  setback: true                # 是否回退位置

# ═══════════ Discord Webhook ═══════════
discord-webhook:
  cooldown: 0                  # Webhook 冷却
  alerts: []                   # 警报 Webhook URL 列表
  punishments: []              # 惩罚 Webhook URL 列表

# ═══════════ 以下为 messages 段摘要（46 键，详见 Lang 页）═══════════
# messages 段包含全部 46 条用户可见消息，支持 %prefix% / %player% / %check% 等占位符
```

> **改完执行** `/vulcan reload` 生效。完整配置共 4186 行 / 141KB——本页只列出最常用的项，其余以你生成的文件为准。
>
> ⚠ **Vulcan 的所有消息（包括踢出提示、警报格式、广播内容）都在此文件的 `messages` 段中**——没有独立语言文件。详见 [Lang 说明](#/plugin/vulcan/lang.md)。
