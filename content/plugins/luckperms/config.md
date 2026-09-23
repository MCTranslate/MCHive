# === LuckPerms 配置文件说明 ===
# 文件位置：plugins/LuckPerms/config.yml

# ========= 存储方式 =========
# 单服务器推荐 YAML，多服务器强烈推荐 MySQL/MariaDB
storage-method: YAML

# MySQL 配置（storage-method 设为 MYSQL 时生效）
data:
  address: localhost
  database: minecraft
  username: root
  password: ''
  pool-size: 10

# ========= 服务器标识 =========
# Velocity 代理或多服环境需要设为不同值
server: global

# ========= 包含全局玩家 =========
# 权限计算时是否自动包括「全局」后缀的玩家数据
include-global: true
include-global-world: true

# ========= 权限计算设置 =========
# 继承规则
apply-wildcards: true           # 通符权限（如 essentials.*）是否生效
apply-regex: true               # regex 权限匹配是否生效

# 应用规则的最高嵌套深度（防止性能问题）
max-group-applications: 300

# ========= 临时权限 =========
# 持续时间上限
max-duration-permanent: false   # 是否禁止永久权限
max-temporary-permission-duration: 30d  # 临时权限最长有效期

# ========= 日志 =========
# 是否记录每次权限检查（调试用，大会卡）
watch-files: false              # 是否监听配置文件变化并自动重载

# ========= 推送同步 =========
# 存储方式相同时，服务器间可通过此功能自动同步权限变更
messaging-service: none          # 设为 redis/bungeeguard 等可跨服同步

# ========= 编辑器 =========
# 编辑器监听的 IP/端口
editor-lifetime: 5              # 编辑器链接有效期（分钟）

# ========= OP 列表管理 =========
# LuckPerms 可以接管原生 OP
auto-op: false                  # 是否自动给所有管理员 OP
commands-allow-op: true         # 是否允许非 LuckPerms 方式给 OP
