import { AnimationState, SpriteSequence } from '../types';

export class SpriteManager {
  private sequences: Map<string, SpriteSequence> = new Map();
  private basePath: string;
  private defaultFps: number = 8;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  setBasePath(basePath: string): void {
    this.basePath = basePath;
  }

  async loadSequence(type: string, state: AnimationState): Promise<SpriteSequence | null> {
    const key = `${type}_${state}`;

    if (this.sequences.has(key)) {
      return this.sequences.get(key)!;
    }

    const frameCount = this.getFrameCount(type, state);
    if (frameCount === 0) {
      return null;
    }

    // 序列帧加载在 WebView 端进行
    // 这里只返回序列信息
    const sequence: SpriteSequence = {
      frames: [],
      fps: this.defaultFps,
      frameCount
    };

    this.sequences.set(key, sequence);
    return sequence;
  }

  private getFrameCount(type: string, state: AnimationState): number {
    // 默认每种状态4帧
    return 4;
  }

  setFps(fps: number): void {
    this.defaultFps = fps;
  }

  clearCache(): void {
    this.sequences.clear();
  }
}
