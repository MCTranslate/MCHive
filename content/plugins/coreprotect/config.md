# === CoreProtect 配置文件（中文注释版）===
# 位置: plugins/CoreProtect/config.yml（首次启动后自动生成）
# CoreProtect 的日常操作全部通过 /co 命令完成，config.yml 需要动的项很少
# 修改后重启服务器生效

# ========= 数据库 =========
# 默认使用内置 SQLite（plugins/CoreProtect/database.db），中小型服完全够用
# 玩家量大（日活 100+）或想用数据库面板备份时再切 MySQL
use-mysql: false
mysql-host: 127.0.0.1         # 数据库地址
mysql-port: 3306              # 数据库端口
mysql-database: coreprotect   # 数据库名
mysql-username: root          # 数据库用户
mysql-password: ''            # 数据库密码

# 切换 MySQL 的完整步骤：
# 1. 先建好数据库并给账号授权
# 2. 填写上面五项，把 use-mysql 改为 true
# 3. 重启服务器，插件会自动建表并把旧数据留在 SQLite 文件里
# 注意：切换前务必停服备份 plugins/CoreProtect/ 整个目录

# ========= 查询默认值 =========
check-radius: 100             # 查询/回滚允许的最大半径（格），防止误操作全服回滚
check-radius-rollback: 20     # 回滚操作默认的最大半径
default-radius: 10            # /co lookup 不写 r: 时使用的默认半径
default-restore-radius: 50    # /co restore 不写 r: 时使用的默认半径
verbose: false                # true 后控制台会持续输出日志写入明细，排查问题时再开

# ========= 这些事不靠 config 做 =========
# 清理旧日志      → /co purge t:60d（不要手删数据库文件）
# 查询 / 回滚     → /co lookup / /co rollback（见「安装教程」页）
# 权限控制        → 权限插件里分配 coreprotect.* 与 coreprotect.inspect
