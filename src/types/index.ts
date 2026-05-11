// 宠物数据类型
export interface PetData {
  name: string;
  type: string;
  hunger: number;
  happiness: number;
  health: number;
  exp: number;
  level: number;
  lastActiveAt: number;
  createdAt: number;
}

// 位置和尺寸
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// 插件配置
export interface PetConfig {
  position: Position;
  size: Size;
  visible: boolean;
  petData: PetData;
}

// 动画状态
export type AnimationState = 'idle' | 'happy' | 'sad' | 'eating' | 'sleeping' | 'playing';

// 动作命令
export type ActionCommand = 'feed' | 'play' | 'groom' | 'rest';

// 序列帧信息 (WebView 使用)
export interface SpriteFrame {
  image: unknown;  // HTMLImageElement 在 WebView 中
  loaded: boolean;
}

export interface SpriteSequence {
  frames: SpriteFrame[];
  fps: number;
  frameCount: number;
}

// WebView 消息类型
export interface WebviewMessage {
  type: 'init' | 'action' | 'move' | 'resize' | 'stateUpdate';
  payload?: unknown;
}

// 默认配置
export const DEFAULT_PET_DATA: PetData = {
  name: 'Buddy',
  type: 'cat',
  hunger: 80,
  happiness: 80,
  health: 100,
  exp: 0,
  level: 1,
  lastActiveAt: Date.now(),
  createdAt: Date.now()
};

export const DEFAULT_CONFIG: PetConfig = {
  position: { x: 100, y: 100 },
  size: { width: 200, height: 200 },
  visible: true,
  petData: { ...DEFAULT_PET_DATA }
};