# === LuckPerms 配置文件说明（依据 5.5.85 官方默认 config.yml 核对）===
# 文件位置：plugins/LuckPerms/config.yml
# 官方逐条说明：https://luckperms.net/wiki/Configuration
#
# 注意：新版不会把新增选项自动写进你的旧文件；文件里没写的键会直接使用默认值。

# ========= 服务器标识 =========
# 本服在权限系统中的名字，用于“按服务器区分”的权限。
# 设为 global 表示不分服（单服默认值）。
server: global

# 是否使用服务端自带的 UUID 缓存/查询（玩家从未进服时用）。
use-server-uuid-cache: false

# ========= 存储方式 =========
# 默认 h2（内置单文件数据库，无需额外配置），单机推荐。
# 可选值：mysql / mariadb / postgresql / mongodb / h2 / sqlite / yaml / json / hocon / toml
#   - 远程数据库：MySQL、MariaDB（官方更推荐）、PostgreSQL、MongoDB
#   - 本地数据库：H2（官方更推荐）、SQLite
#   - 可读文本：YAML、JSON、HOCON、TOML（想手动改数据就用 YAML）
# 任意一种都可加 -combined 后缀，把用户/组/轨道数据合并到同一文件，如 yaml-combined
storage-method: h2

# 远程数据库连接设置（用本地存储时可忽略）
data:
  # 默认端口按数据库类型取（MySQL 3306 / PostgreSQL 5432 / MongoDB 27017），
  # 非默认端口才写成 "host:port"
  address: localhost
  database: minecraft
  username: root
  password: ''

  # MySQL 连接池设置：默认值适合绝大多数用户，不了解就不要改
  pool-settings:
    maximum-pool-size: 10        # 连接池最大连接数
    minimum-idle: 10             # 保持的最小空闲连接数
    maximum-lifetime: 1800000    # 连接最长存活时间（毫秒，30 分钟）
    keepalive-time: 0            # 保活探测间隔（毫秒），0 关闭
    connection-timeout: 5000     # 从连接池取连接的等待超时（毫秒）
    properties:
      useUnicode: true
      characterEncoding: utf8

  table-prefix: 'luckperms_'          # 远程 SQL 表名前缀
  mongodb-collection-prefix: ''       # MongoDB 集合前缀
  mongodb-connection-uri: ''          # MongoDB 连接串（填写后会覆盖上面的地址等）

# 分体存储：为不同类型的数据分别指定存储方式，默认关闭
split-storage:
  enabled: false
  methods:
    user: h2
    group: h2
    track: h2
    uuid: h2
    log: h2

# ========= 同步与消息服务 =========
# 定期从存储全量刷新的间隔（分钟）；-1 表示关闭（默认）
sync-minutes: -1

# 是否监听数据文件变化并自动重载（仅对文件型存储有意义）
watch-files: true

# 跨服变更通知。可选：sql / pluginmsg / lilypad / redis / rabbitmq / nats / custom / auto
# 用 MySQL/MariaDB 时默认 auto 会自动启用 sql；用插件消息通道则写 pluginmsg
# 注意：合法值里没有 none；想彻底关掉可设为 notsql
messaging-service: auto

auto-push-updates: true                # 命令改动后自动推送
push-log-entries: true                 # 把日志推送给其他服
broadcast-received-log-entries: true   # 把收到的日志广播给本服玩家

# Redis 设置（messaging-service 为 redis 时生效），默认端口 6379
redis:
  enabled: false
  address: localhost
  username: ''
  password: ''

# ========= 权限计算与继承 =========
# 临时权限/组/元数据重复添加时的行为：accumulate（累加）/ replace（取更晚到期）/ deny（报错，默认）
temporary-add-behaviour: deny

# 主组判定方式：stored（读取存储值）/ parents-by-weight（取权重最高的父组，默认）/ all-parents-by-weight（含间接继承）
primary-group-calculation: parents-by-weight

apply-wildcards: true      # 是否解析并应用通配权限（如 essentials.*）
apply-regex: true          # 是否解析并应用正则权限（r= 开头）
apply-shorthand: true      # 是否展开简写权限节点

include-global: true            # 本服是否应用玩家的“全局”权限
include-global-world: true      # 本服是否应用玩家的“全局世界”权限
apply-global-groups: true       # 本服是否应用“非服务器专属”的全局组
apply-global-world-groups: true # 本服是否应用“非世界专属”的全局组

# 继承树遍历算法：breadth-first / depth-first-pre-order（默认）/ depth-first-post-order
inheritance-traversal-algorithm: depth-first-pre-order

# ========= 语言 =========
# 自动下载并定期更新语言包（中文相关见本站 Lang 汉化页）
auto-install-translations: true

# ========= 服务器 OP =========
enable-ops: true          # 是否允许 OP 存在；false 会取消所有 OP 并禁用 /op /deop
auto-op: false            # true 时改为“拥有 luckperms.autoop 权限即自动获得 OP”
commands-allow-op: true   # OP 是否默认可以使用全部 LuckPerms 命令

# ========= 前缀/后缀叠加规则 =========
# format 决定取哪个前缀；duplicates 处理重复项：retain-all / first-only / last-only
meta-formatting:
  prefix:
    format:
      - "highest"
    duplicates: first-only
    start-spacer: ""
    middle-spacer: " "
    end-spacer: ""
  suffix:
    format:
      - "highest"
    duplicates: first-only
    start-spacer: ""
    middle-spacer: " "
    end-spacer: ""
