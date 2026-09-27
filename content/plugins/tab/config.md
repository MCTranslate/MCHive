# === TAB config.yml 关键段（中文注释版 · 基于 6.2.0）===
# 位置: plugins/TAB/config.yml（首次启动后自动生成）
# TAB 使用配置自动迁移——升级后旧配置会自动转换为新格式，不支持降级
# 改完执行 /tab reload 生效

# ═══════════ Tab 列表（Header/Footer）═══════════
tablist:
  enabled: true                 # 是否启用 Tab 列表的 Header/Footer
  header:                       # Tab 列表顶部文字，支持多行
    - '&3&lMCHive 服务器'
    - '&7在线: &a%online%&7/&a%maxplayers%'
  footer:                       # Tab 列表底部文字
    - '&7延迟: &f%ping%'

# ═══════════ 侧边栏记分板 ═══════════
scoreboard:
  enabled: false                # 默认关闭，改为 true 启用侧边栏
  title: '&a&l服务器信息'
  lines:                        # 每行一个占位符条目
    - '&7在线: &f%online%'
    - '&7延迟: &f%ping%'
    - '&7余额: &f%vault_eco_balance%'

# ═══════════ BossBar ═══════════
bossbar:
  enabled: false                # 默认关闭
  bars:                         # BossBar 定义（需在 bossbar 段里先定义再引用）

# ═══════════ 名字与排序 ═══════════
nametags:
  enabled: true                 # 是否修改玩家头顶名称
  format: '%luckperms_prefix%%player%'  # 头顶名称格式

# ═══════════ 玩家列表排序 ═══════════
sort:
  enabled: true                 # 按 Tab 列表中的排序规则排序
  type: 'GROUPS'                # 按权限组排序（也可按 WEIGHT 等）

# ═══════════ 防滥用 ═══════════
anti-override:
  enabled: true                 # 防止其他插件覆盖 TAB 的显示效果
```

> **以上键名为 TAB 6.2.0 的典型结构**。完整键以你生成的 `config.yml` 为准——TAB 会在首次启动时生成带注释的默认配置。
>
> **占位符来源**：`%luckperms_prefix%` 需要 PAPI 的 LuckPerms 扩展；`%vault_eco_balance%` 需要 PAPI 的 Vault 扩展；`%online%` / `%ping%` 是 TAB 的内部变量。
