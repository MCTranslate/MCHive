# Vane 汉化机制

> 以下路径来自官方仓库 `oddlama/vane` 的实际文件树核实。

## 一、结论：自带简繁中文，且是分模块的

Vane 的语言文件在仓库里共 **7 种语言 ×多个模块**。中文占两种，**并且每个模块各自带一份**。

模块化的语言结构长这样（以 `vane-core` 为例）：

```
vane-core/src/main/resources/lang-en.yml      ← 英语
vane-core/src/main/resources/lang-zh-cn.yml← 简体中文
vane-core/src/main/resources/lang-zh-tw.yml    ← 繁体中文
vane-core/src/main/resources/lang-de.yml← 德语
vane-core/src/main/resources/lang-es.yml      ← 西班牙语
vane-core/src/main/resources/lang-fr-fr.yml   ← 法语（法国）
vane-core/src/main/resources/lang-ru.yml      ← 俄语
vane-core/src/main/resources/lang-tr.yml      ← 土耳其语
```

**带`lang-zh-cn.yml` / `lang-zh-tw.yml` 的模块**（从文件树核实）：

- `vane-core`
- `vane-regions`
- `vane-trifles`
- `vane-enchantments`
- `vane-bedtime`
- `vane-admin`

**这意味着**：Vane 的汉化是**每个模块独立做的**，不是全局一份。**如果你发现某个模块没汉化，先确认那个模块的目录里到底有没有中文文件。**

## 二、怎么切换

默认跟随玩家客户端语言，简体客户端自动生效。

想强制统一语言，**本站未核实到Vane 的具体配置键名**——进 `plugins/Vane/` 的配置文件里搜 `locale`、`language`、`lang` 关键词，以你版本的注释为准。

## 三、能汉化的是什么

| 内容 | 是否汉化 |
|------|---------|
| 各模块的系统提示 | ✅ |
| 物品/方块名称 | ✅ |
| 附魔名称与描述 | ✅ |
| 区域相关提示 | ✅ |

**注意**：附魔的显示名走Minecraft 的**翻译键机制**（`translationKey`），这和普通消息文件是**两套东西**。如果你要改一个附魔的名字，**可能需要改物品的翻译键而不仅是消息文件**。

## 四、想改文案

1. 进 `plugins/Vane/`，找各模块的语言覆盖目录（**具体结构以你版本实际生成的目录为准**）
2. 复制一份 `lang-zh-cn.yml` 进去改
3. 重启服务器

**不要直接改 jar 里的文件** —— 升级就没了。

## 五、四个容易踩的坑

**改了没生效**

语言文件是启动时加载的。改完**完整重启**。

**命名是短横线，不是下划线**

Vane 用的是 `lang-zh-cn.yml`（**短横线 `-zh-cn`**），不是 `lang_zh_CN` 也不是 `lang-zh_CN`。**其他插件常用下划线，这里是短横线**——**文件名写错插件会静默忽略**。

**只改了一个模块，其他模块还是英文**

**这是 Vane 特有的坑。** 因为**每个模块一份语言文件**，你改 `vane-core` 不会影响 `vane-trifles`。**要改哪个模块，就去那个模块的目录改。**

**简繁体选错了**

`lang-zh-cn` 是简体，`lang-zh-tw` 是繁体。大陆玩家用 `zh-cn`。

## 六、什么不会被汉化

- **其他插件的文案** —— 各写各的
- **Vane 之外系统的消息** —— 归对应插件
- **玩家自定义的显示名** —— 玩家自己起的

## 下一步

- [插件汉化与本地化完全指南](#/guide/plugin-localization) — 全站汉化机制总表
- [领地保护与 WorldGuard](#/guide/region-protection) — 专业区域保护
- [PaperTweaks](#/plugin/papertweaks) — 原版机制优化
- [插件组合推荐](#/guide/plugin-combos) — 增强类插件怎么挑
