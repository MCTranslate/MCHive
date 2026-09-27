# === Multiverse-Core worlds.yml（5.x 中文注释版）===
# 位置: plugins/Multiverse-Core/worlds.yml
# 这里保存「每个世界的属性」，是 Multiverse 新手最常编辑的文件
# 建议停服修改，改完启动即可；或在游戏内执行 /mv reload
#
# 【5.x 结构说明】
# 文件顶层的每个键就是一个世界（键名 = 世界名，默认三界通常是 world / world_nether / world_the_end；
# 世界名里的点号 . 会写成 [dot]），键下面才是该世界的属性。
# 4.x 旧格式里的 `worlds:` 外层、`==: MVWorld` 标记，以及 `color`/`style` 字段，
# 在 5.x 已被官方自动迁移移除，请勿再照旧教程填写。
#
# 下面以一个名为 world 的世界为例，所列值即 5.x 的默认值。

world:
  # ---------- 基础属性 ----------
  alias: ''                     # 世界显示别名（/mv list、传送提示中显示），支持 & 颜色代码
  hidden: false                 # 是否在 /mv list 中隐藏该世界（有权限者仍可见）
  auto-load: true               # 服务器启动时是否自动加载该世界
  difficulty: normal            # 难度：peaceful / easy / normal / hard
  gamemode: survival            # 默认游戏模式：survival / creative / adventure / spectator
  pvp: true                     # 是否允许玩家互相攻击（主城可关）
  allow-weather: true           # 是否允许天气变化（建筑展示世界建议关）
  allow-flight: false           # 是否允许飞行
  allow-advancement-grant: true # 是否允许获得成就
  hunger: true                  # 是否消耗饥饿值（主城可关）
  auto-heal: true               # 是否自动回血（和平难度下生效）
  adjust-spawn: false           # 是否自动把出生点调整到安全位置
  anchor-respawn: true          # 是否允许用重生锚（下界）设置重生点
  bed-respawn: true             # 是否允许用床设置重生点
  respawn-world: ''             # 在本世界死亡后重生的目标世界，留空 = 在本世界重生
  portal-form: all              # 该世界允许形成的传送门：all / nether / end / none
  player-limit: -1              # 世界玩家上限，-1 = 不限制
  scale: 1.0                    # 坐标缩放（下界默认 8.0，末地默认 16.0；主世界 1.0）
  world-blacklist: []           # 与本世界隔离的实体/玩家黑名单，一般留空
  biome: ''                     # 强制生物群系，一般留空
  generator: ''                 # 地形生成器（创建世界时设定，一般不要手改）
  keep-spawn-in-memory: true    # 出生点区块常驻内存
                                # 注意：MC 1.21.9+ 官方已移除该特性，设为 true 也不再生效
  meta: {}                      # 自定义键值对，供其他插件 / 占位符读取

  # ---------- 进入收费（需要 Vault + 经济插件）----------
  entry-fee:
    enabled: false              # 是否开启进入收费
    amount: 0.0                 # 每次进入扣多少钱，0.0 = 免费
    currency: '@vault-economy'  # 货币；@vault-economy = 跟随经济插件的默认货币

  # ---------- 生物生成控制 ----------
  # 共 8 个分类。每类可设：
  #   spawn:      该分类是否生成生物
  #   spawn-limit: 生成上限，可填整数，或 @unset（不干预）/ @bukkit（跟随服务端配置）
  #   tick-rate:   生成间隔，可填整数，或 @unset / @bukkit
  #   exceptions:  例外实体列表（这里的生物不受 spawn 开关影响）
  spawning:
    monster:                    # 怪物（僵尸、骷髅……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    animal:                     # 动物（牛、羊、猪……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    water_animal:               # 水生动物（鱿鱼、海豚……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    water_ambient:              # 水生环境生物（鱼……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    water_underground_creature: # 水下生物（发光鱿鱼）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    ambient:                    # 环境生物（蝙蝠）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    axolotl:                    # 美西螈
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []
    misc:                       # 其他（玩家、盔甲架、船……）
      spawn: true
      spawn-limit: '@unset'
      tick-rate: '@unset'
      exceptions: []

  # ---------- 只读字段（由 Multiverse 维护，请勿手改）----------
  read-only:
    environment: normal         # 世界环境：normal / nether / the_end
    generator-settings: ''      # 生成器附加参数
    legacy-world-name: world    # 关联的世界文件夹名
    seed: -9223372036854775808  # 世界种子（此默认值表示未记录）
  version: 1.3                  # 配置版本号，请勿修改
