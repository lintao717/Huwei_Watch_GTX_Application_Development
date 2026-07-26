# Water Reminder 图标映射

图标源文件位于 `Doc/ui/icons`，运行时资源位于
`entry/src/main/resources/base/media`。所有常规图标均为透明背景的 48 × 48 PNG；
大状态图标另提供 96 × 96 PNG。页面引用 PNG，不依赖尚未在 GT4 验证的 SVG 加载能力。

| 语义 | 运行时文件 | 使用页面 | 显示尺寸 |
|---|---|---|---:|
| 水滴 | `water-drop.png` | 首页、提醒页 | 24 / 56 px |
| 水杯 | `water-cup.png` | 空状态页 | 72 px |
| 记录 | `history.png` | 首页、记录页 | 24 px |
| 设置 | `settings.png` | 首页、设置页 | 24 px |
| 时间 | `clock.png` | 首页、设置页 | 22 px |
| 提醒 | `bell.png` | 设置页 | 22 px |
| 关闭提醒 | `bell-off.png` | 设置页 | 22 px |
| 目标 | `target.png` | 设置页、统计页 | 22 px |
| 统计 | `chart.png` | 统计页 | 24 px |
| 达标 | `check-circle.png` | 达标页 | 56 px |
| 编辑 | `edit.png` | 记录编辑页 | 22 px |
| 删除 | `trash.png` | 记录编辑页 | 22 px |
| 前进 | `chevron-right.png` | 设置列表 | 20 px |
| 返回 | `chevron-left.png` | 二级页面 | 20 px |
| 增加 | `plus.png` | 快速添加页 | 20 px |
| 减少 | `minus.png` | 编辑页 | 20 px |
| 关闭 | `close.png` | 弹窗 | 20 px |
| 日历 | `calendar.png` | 统计页 | 22 px |
| 稍后提醒 | `snooze.png` | 提醒页 | 22 px |
| 重置 | `reset.png` | 设置页 | 22 px |

大状态图标：`water_drop_large.png`、`water_cup_large.png`、`bell_large.png`、
`check_circle_large.png`、`target_large.png`。

所有 SVG 使用 24 × 24 viewBox、圆角线条、透明背景和 `currentColor` 描边；PNG
为当前 Lite Wearable 运行时的本地兼容版本。图标不包含 Emoji、网络资源、文本、
位图嵌入、滤镜或外部依赖。
