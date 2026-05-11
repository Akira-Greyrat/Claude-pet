"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteManager = void 0;
class SpriteManager {
    constructor(basePath) {
        this.sequences = new Map();
        this.defaultFps = 8;
        this.basePath = basePath;
    }
    setBasePath(basePath) {
        this.basePath = basePath;
    }
    async loadSequence(type, state) {
        const key = `${type}_${state}`;
        if (this.sequences.has(key)) {
            return this.sequences.get(key);
        }
        const frameCount = this.getFrameCount(type, state);
        if (frameCount === 0) {
            return null;
        }
        // 序列帧加载在 WebView 端进行
        // 这里只返回序列信息
        const sequence = {
            frames: [],
            fps: this.defaultFps,
            frameCount
        };
        this.sequences.set(key, sequence);
        return sequence;
    }
    getFrameCount(type, state) {
        // 默认每种状态4帧
        return 4;
    }
    setFps(fps) {
        this.defaultFps = fps;
    }
    clearCache() {
        this.sequences.clear();
    }
}
exports.SpriteManager = SpriteManager;
//# sourceMappingURL=SpriteManager.js.map