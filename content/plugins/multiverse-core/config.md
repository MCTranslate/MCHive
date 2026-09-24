# === Multiverse-Core worlds.yml（中文注释版）===
# 位置: plugins/Multiverse-Core/worlds.yml
# 这里保存「每个世界的属性」，是 Multiverse 新手最常编辑的文件
# 建议停服修改，改完启动即可；或在游戏内执行 /mv reload
#
# 结构：每个世界一个顶级键（键名 = 世界文件夹名），下面是它的属性

world:
  ==: MVWorld
  hidden: 'false'            # 是否在世界列表（/mv list）中隐藏该世界
  alias: '生存世界'           # 显示别名 — 想让玩家看到中文名就填这里，支持 & 颜色代码
  color: WHITE               # 别名颜色（别名的基础色，可用颜色代码覆盖）
  style: NORMAL              # 显示样式
  pvp: 'true'                # 是否允许玩家互相攻击（生存主城建议关掉）
  scale: '1.0'               # 坐标缩放 — 下界设为 8.0（走 1 格 = 主世界 8 格），主世界保持 1.0
  respawnWorld: ''           # 在本世界死亡后重生的目标世界，留空 = 在本世界重生
                             # 典型用法：小游戏世界死亡后回主城，这里填 hub
  allowWeather: 'true'       # 是否允许天气变化（建筑展示世界建议关）
  difficulty: EASY           # 难度：PEACEFUL 和平 / EASY 简单 / NORMAL 普通 / HARD 困难
  hunger: 'true'             # 是否消耗饥饿值（主城可关，让玩家不会饿死）
  autoHeal: 'true'           # 是否自动回血（和平难度下生效）
  adjustSpawn: 'true'        # 是否自动把出生点调整到安全位置
  portalForm: ALL            # 该世界中能否形成传送门：ALL / NETHER / END / NONE
  gameMode: SURVIVAL         # 进入该世界强制的游戏模式：SURVIVAL / CREATIVE / ADVENTURE
                             # 想让各世界模式不同时改这里；保持一致则不动
  keepSpawnInMemory: 'true'  # 出生点区块常驻内存（主城建议 true，大世界可关省内存）
  autoLoad: 'true'           # 服务器启动时是否自动加载该世界
  bedRespawn: 'true'         # 允许用床设置重生点
  worldBlacklist: []         # 与本世界隔离的实体/玩家黑名单，一般不用
  environment: NORMAL        # 环境类型：NORMAL 主世界 / NETHER 下界 / END 末地
  generator: 'null'          # 地形生成器插件名（如 PlotSquared），原版地形保持 'null'
  spawning:                  # 生物生成控制
    animals:
      spawn: 'true'          # 是否生成动物（牛羊猪）
      spawnrate: '-1'        # 生成速率倍率，-1 = 使用原版规则
      exceptions: []         # 例外生物列表
    monsters:
      spawn: 'true'          # 是否生成怪物（僵尸骷髅等，主城世界建议 false）
      spawnrate: '-1'
      exceptions: []
  entryfee:                  # 进入收费（需要 Vault + 经济插件支持）
    amount: '0.0'            # 每次进入扣多少钱，0 = 免费
    currency: '-1'           # 使用的货币，-1 = 服务器默认货币
