---
id: plugin-localization
title: 插件汉化与本地化完全指南
description: 先搞清机制再动手 — 每个插件的语言文件格式、放置目录、启用方式都不一样，附 8 个主流插件的实测结论与自助核查方法。
icon: 🌐
tags: [汉化, 语言, 本地化, 插件]
order: 6
---

> 本教程更新于 2026 年 9 月，适用 Paper 26.x（MC 26.3）。文中每个插件的汉化机制均来自官方 jar 解包核实，版本号与下载源取自各插件官方渠道。

## 一、先破一个最常见的误区

中文 Minecraft 圈里流传最广的一句话是：

> 想汉化插件？下载一个 `lang_zh.yml`，丢进 `plugins/插件名/`，重启。

**这句话对绝大多数插件都是错的。** 后果比"没效果"更糟——文件放进去了、插件不报错、你以为汉化装好了，实际上游戏里一个字都没变，于是开始怀疑服务器、怀疑版本、怀疑人生。

失败的原因有四种，且往往同时命中：

| 失败原因 | 说明 |
|----------|------|
| **格式不对** | 插件要的是 Java `.properties` 或 `.json`，你给的是 YAML——解析器根本不认 |
| **文件名不对** | 插件按固定规则找文件（如 `messages_zh.properties`），名字对不上就直接忽略，连报错都没有 |
| **目录不对** | 不少插件的自定义翻译要放进**子目录**（如 `plugins/Essentials/messages/`），放根目录无效 |
| **根本不需要** | 插件要么自带完整中文（你只需要改一行配置），要么压根没有语言文件机制（放什么进去都没用） |

本站已经把每个插件的官方 jar 下载解包核对过一遍，下面直接给结论——但更重要的是**教你以后遇到新插件怎么自己判断**，毕竟插件有成千上万个。

## 二、第一步：判断这个插件属于哪一类

不要先下载汉化，先花两分钟确认「这个插件到底怎么汉化」。三条命令就够：

```bash
# ① 看 jar 里有没有语言资源文件（这一步能滤掉大半插件）
unzip -l 插件.jar | grep -iE "lang|i18n|locale|messages"

# ② 看插件声明了什么（命令、依赖，有的插件语言开关会写在这里）
unzip -p 插件.jar plugin.yml | grep -iA2 "lang\|description"

# ③ 启动一次服务器，看插件在数据目录里生成了什么
ls -la plugins/插件名/
```

根据结果，插件会落进下面四类之一：

| 类型 | 特征 | 汉化难度 |
|------|------|----------|
| **A. 自带完整翻译** | jar 里能看到 `messages_zh.properties`、`zh-CN/strings.json` 之类 | 改一行配置就行 |
| **B. 自带多语言、按客户端自动切换** | 同上，但没有语言开关，进游戏就是中文 | 无需操作 |
| **C. 有语言文件但需自己放** | jar 里有语言机制，但不带中文 | 需要自己翻译，参考插件自带英文文件 |
| **D. 完全没有语言机制** | jar 里搜不到任何语言资源 | 要么用插件自己的 flag/消息配置，要么用第三方运行时翻译插件 |

> **判断技巧**：如果在 `unzip -l` 的输出里搜不到任何 `lang`、`i18n`、`messages`、`locale` 相关文件，这个插件大概率属于 D 类——**这时无论你放什么文件进去都不会生效**，别再折腾语言文件了。

## 三、主流插件的实测结论（已解包核对）

下表是本站逐一解包核对官方 jar / 仓库文件树的结果，可以直接照做：

| 插件 | 类型 | 你要做什么 | 中文覆盖 |
|------|------|-----------|----------|
| [EssentialsX](#/plugin/essentialsx) | A | `config.yml` 里把 `#locale: en` 改成 `locale: zh` | 完整（自带 `messages_zh.properties`） |
| [CoreProtect](#/plugin/coreprotect) | A | `config.yml` 里把 `language: en` 改成 `language: zh-CN` | 169 / 189 条约 89% |
| [Slimefun](#/plugin/slimefun) | A | 保持 `forceEnglishInterface: false` 即可 | 216 个语言文件里 15 个中文文件，覆盖 categories / messages / recipes / researches |
| [BetonQuest](#/plugin/betonquest) | A | 无需操作；有改动写进 `zh-CN.patch.yml` | 42 个语言文件，中文有 `zh-CN.yml` + **增量补丁机制** |
| [Carbon](#/plugin/carbon) | B | 无需操作，跟随客户端语言 | `messages-zh_CN.properties` + `messages-zh_TW.properties`（共 20 个语言文件） |
| Residence | A | `config.yml` 里 `language: Chinese` | `Language/Chinese.yml` + `ChineseTW.yml`（简体 + 繁体都有） |
| CMI | A | `config.yml` 里 `locale: ZH` | `Translations/Locale_ZH.yml` |
| [Nova](#/plugin/nova) | B | 无需操作 | `zh_cn.json` + `zh_tw.json`（**118 个语言文件，完整度极高**） |
| [Skript](#/plugin/skript) | B | 无需操作 | `simplifiedchinese.lang` —— **注意是 `.lang` 后缀，机制和其他插件都不同** |
| [GSit](#/plugin/gsit) | B | 无需操作 | `zh_cn.yml` + `zh_tw.yml`（共 19 个语言文件） |
| [AuraSkills](#/plugin/auraskills) | B | 无需操作 | `messages_zh-CN.yml` + `messages_zh-TW.yml`（共 21 个语言文件） |
| [LifestealZ](#/plugin/lifestealz) | B | 无需操作 | `zh-CN.yml`（共 15 个语言文件） |
| [BentoBox](#/plugin/bentobox) | A | `config.yml` 里 `locale: zh-CN` | `locales/zh-CN.yml` + `zh-TW.yml` |
| [PlayerPoints](#/plugin/playerpoints) | A | `config.yml` 里指定 locale | `locale/zh_CN.yml` + `zh_TW.yml` |
| [LuckPerms](#/plugin/luckperms) | B | 控制台执行 `/lp translations install` | 跟随社区翻译进度 |
| [Multiverse-Core](#/plugin/multiverse-core) | B | 无需操作，自动跟随客户端语言 | 306 / 330 条约 93% |
| [Multiverse-Inventories](#/plugin/multiverse-inventories) | B | 无需操作 | `multiverse-inventories_zh.properties` |
| [WorldEdit](#/plugin/worldedit) | B | 无需操作，自动跟随客户端语言 | 451 / 461 条约 98% |
| AuthMe 登录插件 | B | 无需操作，自动跟随客户端语言 | `messages_zhcn.yml` + `messages_zhtw.yml` + 对应的 help 文件（共 5 个） |
| TrMenu | B | 无需操作，自动跟随客户端语言 | `lang/zh_CN.yml` + `zh_TW.yml` |
| [Maintenance](#/plugin/maintenance) | B | 无需操作 | **只有繁体** `language-zh_tw.yml`，无简体 |
| QuickShop-Hikari（箱子商店） | B | 无需操作，默认 `enabled-languages: ['*']` | 38 种语言含 `zh-CN` |
| [WorldGuard](#/plugin/worldguard) | **D** | 区域提示用 `deny-message` 等 flag 直接写中文 | 无语言机制 |
| [PacketEvents](#/plugin/packetevents) | **D** | 无需汉化（底层库，不向玩家输出文案） | 仓库内语言文件数为 0 |
| [SkinsRestorer](#/plugin/skinsrestorer) | **D** | 菜单按钮文字硬编码在代码里，**改不了** | 无独立语言文件 |
| [PlaceholderAPI](#/plugin/placeholderapi) | **D** | 无需汉化（它本身不向玩家输出文案） | 不适用 |
| [Vault](#/plugin/vault) | **D** | 无需汉化（同上，只是 API 桥） | 不适用 |
| PlotSquared | **D** | 有 `resources/lang/` 但**不含中文** | 无中文 |
| Shopkeepers | **D** | 有 `resources/lang/` 但**不含中文** | 无中文 |

> ⚠️ **Citizens 是个例外，值得单独提**：它的中文文件只有 `zh-tw.json`，也就是**只有繁体，没有简体**。如果你要简体，得自己补一份 `zh-cn.json`。
>
> 另外本站核实过一批插件（HuskChat、Towny、GriefPrevention、LibertyBans、GrimAC、MythicMobs、GSit 之外的多数玩法插件等）**在官方仓库里找不到中文语言文件**。这类插件的文档里我们都如实标注了「未核实到汉化机制」——**宁可说不知道，也不能编一个不存在的语言文件路径**，否则你会照着找一个永远不生效的文件。
>
> **反过来也要说清楚**：本站也有把「没核实到」纠正成「确实有」的案例。Carbon 一开始被判为无汉化，后来定位到官方仓库确实带 `messages-zh_CN.properties`。所以**看到「未核实到」不代表一定没有**，只是本站没验证到——以你自己服务器上生成的目录为准。

下面逐个说清「为什么」和「怎么改」。

### EssentialsX

**机制**：Java `.properties` 格式，文件名严格为 `messages_<语言码>.properties`。jar 里已内置 **48 个语言文件**，其中 `messages_zh.properties` 就是简体中文（`zh` = 简体，`zh_TW` / `zh_HK` = 繁体）。

**启用**：打开 `plugins/Essentials/config.yml`，找到被注释的 `#locale: en`，去掉 `#` 并改成：

```yaml
locale: zh
```

执行 `/ess reload` 生效。如果你想**每个玩家看自己的语言**，用 2.21.0 起提供的新开关：

```yaml
per-player-locale: true
```

**改文案**：官方要求把自定义文件放在**子目录**里，不是在插件根目录：

```
plugins/Essentials/messages/messages_zh.properties
```

文件里**只需要写你想改的条目**，其它条目会自动回退到内置翻译。占位符是 `{0}` `{1}`，颜色用 MiniMessage 标签（`<yellow>`，2.21.0+ 还支持 config.yml 里 `message-colors` 定义的 `<primary>` / `<secondary>`）。想把某条消息彻底关掉，把它设成空值即可（如 `noNewMail=`）。

> **千万不要直接改 jar 里的文件**：升级插件时改动会全部丢失，而且不会自动转换到新的 MiniMessage 格式。

### CoreProtect

**机制**：YAML 格式。官方仓库维护着简体中文语言文件（`lang/zh-cn.yml`），文件头标注了译者。`config.yml` 里的 `language` 选项控制使用哪种语言。

**启用**：

```yaml
language: zh-CN    # 默认 en；官方语言码列表见 coreprotect.net/languages/
```

**覆盖单条消息**：`plugins/CoreProtect/language.yml` 会在首次启动时自动生成，里面列出**全部短语键**，未翻译的键自动填英文原文。想改哪条就改哪条，改完 `/co reload`。

> `plugins/CoreProtect/.language`（文件名以点开头）是**翻译缓存**，不要手工编辑。
>
> 占位符有两类：`{0}` `{1}` 是位置变量，`{a|b}` 是根据上下文二选一的变体——改文案时两个都要原样保留。

### LuckPerms

**机制**：自带完整的多语言系统，界面消息**跟随玩家客户端的语言**。所以玩家把 Minecraft 客户端设成简体中文，就能看到中文提示。

**下载语言包**（服务器需要能访问外网）：

```
/lp translations install
```

语言文件落在 `plugins/LuckPerms/translations/` 下（`repository/` 为自动下载，`custom/` 放你自己的）。官方默认配置里 `auto-install-translations` 默认为 `true`，也就是通常你什么都不用做。

### Multiverse-Core

**机制**：jar 内置简体中文语言包（`multiverse-core_zh.properties`，以及其依赖的命令框架 `acf-core_zh_CN.properties`），**自动跟随玩家客户端语言**。

**你要做的**：什么都不用做。也**不需要**往 `plugins/Multiverse-Core/` 里放任何语言文件。

### WorldEdit

**机制**：jar 内置来自 Crowdin 社区的翻译，`lang/i18n.zip` 里有 **146 种语言**，含 `zh-CN`、`zh-HK`、`zh-TW`。同样**跟随玩家客户端语言**，多语言服务器上每个人看到自己母语。

**想补翻译**：在插件目录下建 `lang/<语言码>/strings.json`，只写你要覆盖的条目：

```
plugins/WorldEdit/lang/zh-CN/strings.json
```

官方说明的查找优先级是（逐条字符串生效，不是整包替换）：

1. `plugins/WorldEdit/lang/<语言码>/strings.json`
2. `plugins/WorldEdit/lang/i18n.zip` 里的 `<语言码>/strings.json`
3. jar 内 `lang/i18n.zip` 里的 `<语言码>/strings.json`
4. jar 内 `lang/strings.json`（仅默认语言）

找不到时会先退到更宽泛的语言码（如 `fr-CA` → `fr`），最后回退英文。

> 官方明确提醒两点：① **只写你要覆盖的条目**，这样升级后其它条目的翻译改进能自动享受到；② 自定义翻译**改不了颜色**，这一层只负责文本。另外，命令帮助里的部分描述受上游命令库限制目前无法翻译。

### QuickShop-Hikari（箱子商店）

**机制**：jar 内置 38 种语言，`plugins/QuickShop-Hikari/lang/` 下按语言码分目录（`zh-CN/`、`zh-TW/`、`en-US/`……），**跟随玩家客户端语言自动切换**。它的中文文案里甚至有一条就叫「检测到您的客户端语言已更改」——足以说明这套机制是自动的。

**你要做的**：什么都不用做。`config.yml` 里默认就是全语言启用：

```yaml
enabled-languages:
  - '*'
```

**想改文案**：用官方的语言覆盖系统（配置注释里给了文档地址），不要直接改 jar 内的文件。消息同样使用 `{0}` 占位符与 MiniMessage 标签（`<yellow>`、`<red>`）。

### WorldGuard

**机制**：**没有**。WorldGuard 7 的插件提示是硬编码在代码里的英文，jar 内不含任何语言资源，也没有读取语言文件的逻辑——`plugins/WorldGuard/` 里放任何语言文件都不会生效。

**能做什么**：

- **区域相关的提示**（进入/离开/拒绝破坏等）本身是**区域 flag**，可以直接写中文，例如 `/rg flag 主城 greeting &a欢迎`，这是官方功能，不需要任何插件
- **插件自带的英文提示**（如"你不能在这里建造"）需要第三方运行时翻译插件，如 [WorldGuard-Translator](https://www.spigotmc.org/resources/135615/)（MIT 许可，内存字节码改写，不改 jar）

### PlaceholderAPI / Vault

这两个插件本身**不向玩家输出界面文案**——PlaceholderAPI 提供变量（`%player_name%` 这类），Vault 是经济/权限的 API 桥。所以它们既没有语言文件，也不需要汉化。看到有人"给 Vault 找汉化包"，可以直接跳过。

## 四、三种语言文件格式差在哪

这是"为什么不能一份 lang_zh.yml 走天下"的根源。下面是三种格式的**真实性样例**（分别摘自对应插件的官方文件）：

**Java `.properties`（EssentialsX / Multiverse-Core）**

```properties
addedToOthersAccount=已向<yellow>{1}<green>的账户充值<yellow>{0}<green>。目前余额：<yellow>{2}
```

**JSON（WorldEdit）**

```json
{
    "worldedit.expand.expanded": "选区已扩展 {0} 个方块",
    "worldedit.biomeinfo.position": "当前坐标的生物群系: {0}"
}
```

**YAML（CoreProtect）**

```yaml
LOOKUP_BLOCK: "{0} {放置|破坏}了 {1}。"
ROLLBACK_COMPLETED: "{0} 的{回滚|恢复|预览}操作已完成。"
```

对照表：

| | `.properties` | `.json` | `.yml` |
|---|---|---|---|
| 分隔符 | `键=值` | `"键": "值"` | `键: "值"` |
| 颜色写法 | MiniMessage 标签 `<yellow>` | 由插件代码控制，通常不可改 | 由插件代码控制 |
| 占位符 | `{0}` `{1}` | `{0}` `{1}` | `{0}` `{1}`，另有变体 `{a\|b}` |
| 常见插件 | EssentialsX、Multiverse-Core | WorldEdit | CoreProtect |

**唯一的共通点**：占位符（`{0}` 这类）**必须原样保留**，它们会被替换成玩家名、数量、坐标等真实数据。改了或删了，消息就会缺内容。

## 五、改翻译的正确姿势

**1. 不要改 jar 内部的文件。** 升级插件时你的改动会全部丢失。所有插件都提供了"外部覆盖"机制，只是目录和格式各不相同（见下）。

**2. 只写要改的条目。** 覆盖是**逐条生效**的——你只写一条，其余自动用内置翻译。这样升级插件后，其它条目的翻译改进你能自动拿到。

**3. 记住各组件的自定义位置**：

| 插件 | 自定义翻译放这里 |
|------|------------------|
| EssentialsX | `plugins/Essentials/messages/messages_<语言码>.properties` |
| CoreProtect | `plugins/CoreProtect/language.yml`（自动生成，列出全部键） |
| LuckPerms | `plugins/LuckPerms/translations/custom/` |
| WorldEdit | `plugins/WorldEdit/lang/<语言码>/strings.json` |
| Multiverse-Core | 无需自定义（如需介入，属进阶改造） |
| WorldGuard | 不支持语言文件；改用 flag 或第三方翻译插件 |

**4. 改完记得重载或重启**：EssentialsX 用 `/ess reload`，CoreProtect 用 `/co reload`，WorldEdit 用 `/we reload`，LuckPerms 用 `/lp reloadconfig`。语言文件一般在**启动时**读取，配置项改动才能热重载。

**5. 备份。** 改语言文件前把插件数据目录复制一份，尤其是自己手工翻译的成果——插件升级或重装时最容易丢的就是它。

## 六、想贡献翻译？

几个插件的翻译都是社区协作维护的，比在群里传文件靠谱得多（不会被改坏、不会过期、下个版本自动带上）：

| 插件 | 贡献入口 |
|------|----------|
| EssentialsX | [Crowdin](https://translate.essentialsx.net/) |
| WorldEdit / WorldGuard | [Crowdin](https://crowdin.com/project/worldedit-core) |
| CoreProtect | 官方仓库的 `lang/` 目录，提交 PR（文件头会标注译者） |
| LuckPerms | 官方仓库的 `translations/` 目录 |

> 如果你发现本站某个插件的汉化说明与你的实际测试不符，欢迎提 Issue 告诉我们——本站的插件文档都是**下载官方 jar 解包核对**后写的，如果上游改了机制而我们没跟上，那就是需要修正的地方。

## 七、常见坑速查

| 症状 | 大概率原因 |
|------|-----------|
| 放了语言文件但一点没变 | 格式或文件名不对；或该插件属于 D 类（根本没有语言机制） |
| 改了配置重启无效 | 该行原来是被注释的（前面有 `#`），你以为改了其实没生效 |
| 部分消息仍是英文 | 正常。翻译有覆盖率缺口（如 CoreProtect 缺 20 条较新的数据库诊断消息），会回退英文 |
| 只有自己看到中文、别人看到英文 | 该插件是按**客户端语言**切换的（LuckPerms / WorldEdit / Multiverse-Core），属正常行为 |
| 控制台是英文，游戏内是中文 | 同样正常。按客户端语言切换的插件，控制台固定用英文 |
| 升级插件后自己的翻译没了 | 直接改了 jar 内文件；应使用外部覆盖目录 |
| 自己翻译的文件导致插件报错 | 多半是格式错误（中文全角引号、Tab 缩进、占位符被改坏） |

## 下一步

- 还没装插件？先看 [插件组合：按服务器类型直接抄](#/guide/plugin-combos)
- 想给插件的功能配上权限？看 [权限系统设计实战](#/guide/permissions-design)
- 汉化后玩家还是进不来、或者报错看不懂？查 [避坑与排错速查](#/guide/faq)
