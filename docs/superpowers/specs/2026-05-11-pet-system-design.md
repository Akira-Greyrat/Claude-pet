# Claude Pet 宠物系统设计文档

## 概述

Claude Pet 是一个 VSCode 扩展宠物系统，用户安装后可获得一个悬浮在编辑器中的虚拟宠物。宠物由序列帧动画定义，用户可通过替换序列帧文件自定义外观。

## 技术栈

| 层级 | 技术选择 |
|------|----------|
| VSCode 扩展主体 | TypeScript |
| WebView 内容 | HTML5 + CSS3 + Canvas |
| 数据持久化 | VSCode 全局状态 + fs 写入用户目录 |
| 包管理 | npm + VSCode Extension Manager |

## 整体架构

```
┌─────────────────────────────────────────────────┐
│              VSCode Extension                    │
│  ┌─────────────────────────────────────────────┐│
│  │            extension.ts                      ││
│  │  - 注册命令 (command)                        ││
│  │  - 创建/管理 WebView 面板                    ││
│  │  - 数据持久化 (读写用户目录)                 ││
│  └─────────────────────────────────────────────┘│
│                       ↕ postMessage              │
│  ┌─────────────────────────────────────────────┐│
│  │              WebView (pet.html)              ││
│  │  ┌─────────────┐  ┌────────────────────┐   ││
│  │  │ Canvas渲染层 │  │  交互层 (点击/拖拽)  │   ││
│  │  └─────────────┘  └────────────────────┘   ││
│  │  ┌─────────────┐  ┌────────────────────┐   ││
│  │  │ 宠物状态机   │  │  动画控制器         │   ││
│  │  └─────────────┘  └────────────────────┘   ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

## 模块职责

### PetEngine (宠物状态机)
- 管理宠物属性：饥饿度、快乐度、健康度、经验值
- 计算属性随时间的衰减
- 处理状态转换逻辑

### SpriteManager (序列帧管理)
- 从资源目录加载序列帧
- 管理动画状态切换
- 缓存已加载的帧数据

### Renderer (Canvas 渲染)
- 绑定 Canvas 元素
- 控制帧率和播放时序
- 处理缩放渲染

### Storage (数据持久化)
- 宠物数据序列化/反序列化
- 读写用户目录配置文件
- 位置、大小配置持久化

## 数据模型

### PetConfig (插件配置)
```typescript
interface PetConfig {
  position: { x: number; y: number };  // 悬浮窗位置
  size: { width: number; height: number };  // 悬浮窗尺寸
  visible: boolean;  // 是否显示
  petData: PetData;  // 宠物数据
}
```

### PetData (宠物数据)
```typescript
interface PetData {
  name: string;  // 宠物名字
  type: string;  // 宠物类型/序列帧目录名
  hunger: number;  // 饥饿度 0-100
  happiness: number;  // 快乐度 0-100
  health: number;  // 健康度 0-100
  exp: number;  // 经验值
  level: number;  // 等级
  lastActiveAt: number;  // 最后活跃时间戳
  createdAt: number;  // 创建时间戳
}
```

## 序列帧系统

### 目录结构
```
resources/
└── sprites/
    ├── cat/
    │   ├── idle/      # idle_001.png, idle_002.png, ...
    │   ├── happy/
    │   ├── sad/
    │   ├── eating/
    │   ├── sleeping/
    │   └── playing/
    ├── dog/
    │   └── ...
    └── [custom]/  # 用户自定义宠物
        └── ...
```

### 规格
- 格式: PNG/WebP
- 推荐尺寸: 128x128 或 256x256
- 默认帧率: 8fps
- 动画状态: idle, happy, sad, eating, sleeping, playing

### 用户自定义
- 用户可替换 `resources/sprites/` 下的序列帧文件
- 用户可创建新的宠物类型目录
- 宠物外观与属性解耦，相同序列帧可用于不同宠物实例

## 状态机

### 动画状态
| 状态 | 触发条件 | 描述 |
|------|----------|------|
| idle | 默认状态 | 宠物静止待机 |
| happy | 快乐度 > 80 | 宠物开心 |
| sad | 快乐度 < 20 | 宠物难过 |
| eating | 执行喂食命令 | 宠物进食中 |
| sleeping | 健康度 < 30 | 宠物休息 |
| playing | 执行玩耍命令 | 宠物玩耍中 |

### 状态优先级
eating > sleeping > playing > happy > sad > idle

## 交互设计

### VSCode 命令
| 命令 | 说明 |
|------|------|
| `claude-pet.show` | 显示宠物悬浮窗 |
| `claude-pet.hide` | 隐藏宠物悬浮窗 |
| `claude-pet.feed` | 喂食 |
| `claude-pet.play` | 玩耍 |
| `claude-pet.groom` | 清洁 |
| `claude-pet.rest` | 休息 |
| `claude-pet.reset` | 重置宠物 |

### WebView 内交互
- 点击宠物: 播放当前状态的动画
- 拖拽窗口: 调整悬浮窗位置
- 拖拽角落: 缩放窗口大小

## 窗口管理

### 悬浮窗行为
- 默认显示在编辑器右下角
- 可自由拖拽到任意位置
- 可通过拖拽边缘/角落缩放
- 位置和大小变化后自动保存
- 插件卸载不删除用户配置（保存在用户目录）

### 配置存储路径
- Windows: `%USERPROFILE%/.claude-pet/`
- 包含: `config.json` (宠物配置) 和 `sprites/` (用户自定义序列帧)

## 内置宠物类型

| 类型 | 目录名 | 描述 |
|------|--------|------|
| 猫 | cat | 橙色的猫 |
| 狗 | dog | 可爱的狗 |
| 兔 | rabbit | 白色的小兔 |
| 鸟 | bird | 蓝色的小鸟 |

## 开发命令

```bash
npm install     # 安装依赖
npm run compile # 编译 TypeScript
npm run watch   # 监听模式
npm run test    # 运行测试
```

## 下一步

1. 初始化 VSCode 扩展项目
2. 实现基础 WebView 面板
3. 实现 Canvas 序列帧渲染
4. 实现宠物状态机
5. 实现数据持久化
6. 添加拖拽和缩放功能
7. 打包内置序列帧资源
