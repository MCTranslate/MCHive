# === QuickShop-Hikari 配置文件（中文注释版 · 基于 6.3.0.3）===
# 位置: plugins/QuickShop-Hikari/config.yml（首次启动后自动生成，共 1050+ 行）
# 下面每一项的键名与默认值都取自 QuickShop-Hikari 6.3.0.3 的实际定义
# 改完执行 /qs reload 生效

# ========= 语言 =========
game-language: default          # default = 跟随玩家客户端语言；也可填 "zh-CN" 强制简体
enabled-languages:
  - '*'                         # 启用全部语言包（'*' = 全部）
lang-processor:
  papi-post-process: true       # 允许翻译文本中使用 PlaceholderAPI 变量
  fix-item-always-italic: true  # 修复物品名始终斜体的显示问题

# ========= 经济系统 =========
economy-type: 0                 # 0 = Vault（推荐）/ 其他值见官方文档
currency: ''                    # 留空 = 使用 Vault 的默认货币；多经济插件时可填指定名称
use-decimal-format: false       # 是否格式化小数显示
decimal-format: '#,###.##'      # 小数格式模板

# ========= 税收 =========
shop-tax:
  type: basic                   # basic = 固定税率；progressive = 按余额分段
  account: ''                   # 税收取入存入的账户名，留空 = 只扣不存
  apply-to: []                  # 限定哪些商店类型收税
  basic:
    rate: 0.0                   # 税率（0.05 = 5%）；0 = 不收税

# ========= 数据库 =========
# 默认内嵌 H2 数据库（文件存储），中小型服完全够用
database:
  mysql: false                  # 改 true 切换到 MySQL
  host: localhost
  port: 3306
  database: quickshop
  username: root
  password: ''

# ========= 商店数量限制 =========
limits:
  use: false                    # 改 true 启用商店数量限制
  default: 10                   # 无额外权限时的默认上限
  ranks:                        # 按权限节点分配上限（权限节点 = quickshop.limit.<名字>）
    quickshop.example: 20

# ========= 允许作为商店容器的方块 =========
shop-blocks:
  - CHEST                       # 木箱
  - TRAPPED_CHEST               # 陷阱箱
  - BARREL                      # 木桶
  - SHULKER_BOX                 # 潜影盒

# ========= 商店行为 =========
shop:
  shoppable-check: true         # 检查商店容器是否仍然有效
  update-sign-on-load: false    # 加载时更新招牌文字
  skip-command-confirmation: false  # 跳过删除商店时的确认提示

# ========= 更新与反馈 =========
check-updates: true             # 启动时检查更新
auto-report-errors: true        # 出错时自动上报给插件作者

# ========= 保护 =========
protect:
  prevent:
    hopper-minecart: true       # 防止漏斗矿车抽取商店内容
```

> **改完执行** `/qs reload` 生效。`config.yml` 共 1050+ 行，本页只列出最常用的项——其余键均取自 6.3.0.3 真实默认值，直接对照你生成的文件即可。
