# === WorldGuard 中文语言文件 ===
# 放入 plugins/WorldGuard/ 目录
# 注意：原版的 WorldGuard 未内置多语言，需要自行添加

region:
  build-denied: "&c你不能在这里建造。"
  pvp-denied: "&c此区域禁止 PVP。"
  enter-greeting: "&a%owner% 欢迎来到 %region%。"
  leave-farewell: "&7已离开区域 %region%。"
  forbidden: "&c你没有权限执行此操作。"
  added-member: "&a已将玩家 &e%1 &a加入区域。"
  removed-member: "&c已将玩家 &e%1 &c移出区域。"

wand:
  info: "&6区域选择工具 &e— &a左键选起点，右键选终点。"
  no-permission: "&c你没有权限使用选区工具。"

define:
  success: "&a区域 &e%region% &a已创建。"
  overlap: "&c该区域与现有区域 &e%overlap% &c重叠。"
  too-large: "&c选择的区域过大（最大 %max% 个方块）。"
  too-many: "&c你已达到创建区域的上限 (%max%)。"
  missing-select: "&c你还没有选择区域，先使用选区工具选定范围。"

info:
  owners: "&a区域 %region% 的拥有者：%members%"
  members: "&a区域 %region% 的成员：%members%"
  no-owner: "&c该区域没有拥有者。"

select:
  first: "&a已选择点1：%1"
  second: "&a已选择点2：%1"
  show-selection: "&a区域大小：%1 方块（%2 x %3 x %4）"
