# Vulcan 没有独立语言文件 — 所有消息都在 config.yml 中

**结论先说：Vulcan 没有独立的语言文件（没有 `lang_xx.yml` 或 `messages_xx.properties`）。全部 46 条用户可见消息都写在 `config.yml` 的 `messages` 段中。**

## 怎么改消息

打开 `plugins/Vulcan/config.yml`，找到 `messages:` 段（46 个键），直接编辑对应的值即可。改完执行 `/vulcan reload` 生效。

每条消息支持 `%prefix%`（聊天前缀）占位符，以及 `&` 颜色代码。

## 常用消息键（取自 jar 内真实数据）

| 键名 | 默认值（英文） | 含义 |
|------|---------------|------|
| `no-permission` | `You don't have permission to execute this command!` | 没有权限 |
| `frozen` | `You are frozen! Please await instructions from staff.` | 被冻结提示 |
| `injection-failure` | `You joined too quickly. Please try again!` | 进服太快被拒 |
| `reload-success` | `Successfully reloaded Vulcan!` | 重载成功 |
| `invalid-check` | `Invalid check name! Examples: AimA, BadPacketsF, AutoClickerJ.` | 无效检查名 |
| `no-logs` | `This player set off no logs!` | 该玩家没有违规日志 |

## 聊天前缀

```yaml
prefix: '&4&lVulcan &8»'
```

这条控制所有消息的前缀，可以在 `messages` 段中的任意消息里通过 `%prefix%` 引用。

## 全部 46 条消息键一览

按功能分类，方便查找：

**命令语法提示（14 条）**
`ban-command-syntax`、`kb-command-syntax`、`profile-command-syntax`、`jday-command-syntax`、`jday-remove-syntax`、`logs-command-syntax`、`cps-command-syntax`、`connection-command-syntax`、`description-command-syntax`、`disable-check-command-syntax`、`freeze-command-syntax`、`rotate-command-syntax`、`shuffle-command-syntax`、`reset-command-syntax`

**命令结果（14 条）**
`froze`、`froze-staff-broadcast`、`unfroze`、`unfroze-staff-broadcast`、`logged-out-while-frozen`、`shuffled-hotbar`、`randomly-rotated`、`kb-test-success`、`sent-test-alert`、`removed-check`、`disabled-check`、`reset-command`、`violations-reset`、`reload-success`

**错误/无效（5 条）**
`no-permission`、`cant-execute-from-console`、`invalid-check`、`invalid-target`、`unknown-command`

**日志/页面（4 条）**
`logs-command-no-logs`、`no-logs`、`no-logs-file`、`no-page`

**Judgement Day（4 条）**
`jday-added-to-list`、`jday-no-pending-bans`、`removed-from-jday`、`punishlogs-syntax`

**版本/其他（5 条）**
`latest-version`、`update-available`、`injection-failure`、`frozen`、`description-command-syntax`

## 为什么没有独立语言文件

Vulcan 的设计理念是**把所有配置和消息集中在 `config.yml` 一个文件里**。这有优点也有缺点：

- **优点**：只改一个文件就能完成全部配置和汉化
- **缺点**：文件很大（4186 行 / 141KB），找起来比较费劲

这与 CoreProtect（`language.yml` 独立文件）、EssentialsX（`messages_xx.properties`）、WorldEdit（`strings.json`）等插件的机制完全不同。

## 下一步

- 配置键怎么配？→ [Config 汉化](#/plugin/vulcan/config.md)
- 安装和命令 → [安装教程](#/plugin/vulcan/tutorial.md)
