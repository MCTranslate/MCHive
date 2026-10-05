# PacketEvents 汉化说明

> 以下结论来自 `retrooper/packetevents` 仓库实际文件树核实。

### 一、结论：它没有语言文件，也不需要

PacketEvents 官方仓库里**语言文件数量为 0**。没有 `lang/`、没有 `locale/`、没有 `locales/`，任何语言都没有。

这不是「中文没翻译」的问题，是**根本没有面向玩家的文本**。

### 二、为什么这个插件不需要语言文件

PacketEvents 是**底层库**，不是玩家看得见的界面：

| 它做的事 | 谁看得见 |
|---------|---------|
| 读写数据包 | 没人 |
| 抽象跨版本映射 | 没人 |
| 提供 API 给别的插件调 | 开发者 |
| 抛异常 / 打调试日志 | 服主（看控制台） |

它屏幕上不会出现一个按钮，也不会弹一条消息给玩家。**没有需要翻译的东西。**

### 三、那些英文是哪来的

你可能会在控制台看到这类内容：

```
[PacketEvents] An error occurred while processing packet...
[PacketEvents] Unable to load version mapping for...
```

这些是**技术日志和异常堆栈**，不是本地化消息。它们的读者是服主和插件开发者，翻译它们没有意义——你真正需要做的是**看懂它**。

对应的处理方式：

| 场景 | 该做什么 |
|------|---------|
| 依赖插件报错提到 PacketEvents | 去搜那个依赖插件的版本兼容说明 |
| 启动时提示 PacketEvents 版本过旧 | 升级 PacketEvents |
| `repack` 相关的警告 | 跑 `/packetevents repack` |
| 数据包映射加载失败 | 检查网络/磁盘，多半是构建产物问题 |
| 调试日志刷屏 | `config.yml` 里把 `debug` 改回 `false` |

### 四、真的想改文本的话

**唯一可改的地方是 `plugins/packetevents/config.yml` 里的配置项值**——比如 `kick_on_packet_exception` 触发时踢人的提示（如果你的版本提供这项配置的话）。

> ⚠️ **具体有哪些可改文本，以你版本生成的 `config.yml` 为准。** PacketEvents 的配置文件在不同 2.x 小版本间有增删，本页不列。

除此之外，**在 PacketEvents 里找汉化文件是白费功夫**。

### 五、真正需要汉化的是依赖它的插件

如果你的目标是「让服务器显示中文」，PacketEvents 帮不上忙——**要汉化的是那些真正有玩家可见界面的插件**：

| 插件 | 有自己的界面吗 |
|------|--------------|
| PacketEvents | ❌ 纯库 |
| **Vulcan** | ✅ 踢出/警告消息可自定义 |
| GrimAC | ✅ 违规提示可配置 |

Vulcan 尤其要注意——**它的所有消息都在 `config.yml` 里，没有独立语言文件**，需要手动改。详见 [Vulcan Lang 说明](#/plugin/vulcan)。

## 下一步

- 全站汉化的通用思路 → [插件汉化与本地化完全指南](#/guide/plugin-localization)
- 依赖它的反作弊怎么配消息 → [Vulcan](#/plugin/vulcan)
