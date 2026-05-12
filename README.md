# Claude Pet

VSCode 虚拟宠物插件！在编辑器中养一只可爱的动画宠物。

## 功能特性

- **4 种宠物类型**：猫、狗、兔子、鸟，每种都有独特的序列帧动画
- **6 种动画状态**：待机、开心、难过、进食、睡觉、玩耍
- **丰富的交互**：喂食、玩耍、清洁、休息
- **数据持久化**：宠物状态保存在本地，卸载插件不会丢失数据
- **可自定义**：拖拽调整位置，角落拖拽缩放大小
- **序列帧系统**：替换序列帧文件即可自定义宠物外观

## 命令

打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`），搜索：

| 命令 | 说明 |
|------|------|
| `Claude Pet: Show Pet` | 显示宠物悬浮窗口 |
| `Claude Pet: Hide Pet` | 隐藏宠物 |
| `Claude Pet: Feed Pet` | 喂食（增加饥饿度） |
| `Claude Pet: Play with Pet` | 和宠物玩耍（增加快乐度，获得经验） |
| `Claude Pet: Groom Pet` | 清洁宠物（增加健康度） |
| `Claude Pet: Rest Pet` | 让宠物休息 |
| `Claude Pet: Reset Pet` | 重置宠物属性 |
| `Claude Pet: Switch Pet` | 切换宠物类型（猫→狗→兔子→鸟→猫） |

## 宠物属性

| 属性 | 说明 | 衰减 |
|------|------|------|
| 饥饿度 | 宠物饥饿程度 (0-100) | 每分钟 -2 |
| 快乐度 | 宠物快乐程度 (0-100) | 每分钟 -1 |
| 健康度 | 宠物健康程度 (0-100) | 饥饿时下降 |
| 经验值 | 宠物经验 | 玩耍时获得 |
| 等级 | 宠物等级 | 经验值达标后提升 |

## 宠物状态

宠物会根据属性自动切换动画：

- **开心** (黄色)：快乐度 > 80
- **难过** (蓝色)：快乐度 < 20
- **睡觉** (紫色)：健康度 < 30
- **进食** (红色)：喂食时
- **玩耍** (绿色)：玩耍时
- **待机** (灰色)：默认状态

## 工作原理

### WebView 渲染
宠物在 VSCode WebView 面板中渲染，使用 HTML5 Canvas 绘制序列帧动画。

### 数据持久化
宠物数据存储在：
- **Windows**：`%USERPROFILE%\.claude-pet\config.json`
- **macOS**：`~/.claude-pet/config.json`
- **Linux**：`~/.claude-pet/config.json`

卸载或更新插件不会删除你的宠物数据！

## 自定义序列帧

### 目录结构
```
resources/sprites/
├── cat/
│   ├── idle/      # idle_001.png ~ idle_004.png
│   ├── happy/
│   ├── sad/
│   ├── eating/
│   ├── sleeping/
│   └── playing/
├── dog/
├── rabbit/
└── bird/
```

### 创建自定义序列帧
1. 创建 PNG 图片（建议 128x128 或 256x256）
2. 命名格式：`{状态}_{序号}.png`（例如 `idle_001.png`）
3. 放入对应的状态文件夹
4. 替换默认序列帧或创建新宠物类型

### 状态说明
每个状态需要 4 帧图片，以 8fps 播放：
- `idle` - 默认待机动画
- `happy` - 开心动画
- `sad` - 难过动画
- `eating` - 进食动画
- `sleeping` - 睡觉动画
- `playing` - 玩耍动画

## 安装方式

### 从 VSIX 安装
1. 下载 `.vsix` 文件
2. 运行：`code --install-extension claude-pet-0.1.0.vsix`

### 从源码安装
```bash
npm install
npm run compile
npm run package  # 生成 .vsix 文件
```

## 开发

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 监听模式
npm run watch

# 打包为 VSIX
npm run package

# 调试模式运行
# 在 VSCode 中按 F5
```

## 快捷键

插件没有添加默认快捷键，你可以自行添加：

1. 打开 `首选项: 打开键盘快捷键`
2. 搜索 `claude-pet.*`
3. 添加你喜欢的快捷键

示例：
```json
{
  "key": "ctrl+shift+p",
  "command": "claude-pet.play"
}
```

## 常见问题

### 宠物不显示
- 执行 `Claude Pet: Show Pet` 命令
- 查看 VSCode 通知区域是否有错误

### 序列帧加载失败
- 确保 `resources/sprites/` 文件夹存在于扩展目录中
- 打开 VSCode 开发者工具（帮助 → 切换开发者工具）查看错误

### 宠物状态不变化
- 属性会随时间衰减，请稍等几分钟
- 尝试喂食或和宠物玩耍

## 许可证

MIT