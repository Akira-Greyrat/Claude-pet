"use strict";
// WebView 内部模块 - 序列帧渲染器 (在 WebView 中运行)
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewPet = void 0;
class WebviewPet {
    constructor() {
        this.currentState = 'idle';
        this.config = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeCorner = '';
        this.renderer = new WebviewRenderer();
        this.spriteManager = new WebviewSpriteManager();
    }
    async init(config) {
        this.config = config;
        this.renderer.init();
        this.spriteManager.setBasePath(this.getResourcePath(config.petData.type));
        await this.loadStateAnimations();
        this.renderer.start();
        this.setupEventListeners();
    }
    getResourcePath(type) {
        // 通过 vscode-resource 协议获取资源路径
        return `https://file.vscode-cdn.com/${type}`;
    }
    async loadStateAnimations() {
        if (!this.config)
            return;
        const states = ['idle', 'happy', 'sad', 'eating', 'sleeping', 'playing'];
        for (const state of states) {
            await this.spriteManager.loadSequence(this.config.petData.type, state);
        }
        // 默认播放 idle
        this.setState('idle');
    }
    setState(state) {
        this.currentState = state;
        const sequence = this.spriteManager.getSequence(this.config?.petData.type ?? 'cat', state);
        this.renderer.setSequence(sequence);
    }
    getState() {
        return this.currentState;
    }
    executeAction(action) {
        // 根据动作切换状态
        switch (action) {
            case 'feed':
                this.setState('eating');
                break;
            case 'play':
                this.setState('playing');
                break;
            case 'groom':
                this.setState('happy');
                break;
            case 'rest':
                this.setState('sleeping');
                break;
        }
        // 2秒后恢复 idle
        setTimeout(() => {
            if (this.currentState !== 'sleeping') {
                this.setState('idle');
            }
        }, 2000);
    }
    setupEventListeners() {
        const container = document.getElementById('pet-container');
        if (!container)
            return;
        // 点击事件
        container.addEventListener('click', () => {
            // 点击宠物触发动画
            this.executeAction('play');
        });
    }
    updatePosition(x, y) {
        const container = document.getElementById('pet-container');
        if (container) {
            container.style.left = `${x}px`;
            container.style.top = `${y}px`;
        }
    }
    updateSize(width, height) {
        const container = document.getElementById('pet-container');
        const canvas = document.getElementById('pet-canvas');
        if (container) {
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
        }
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    destroy() {
        this.renderer.stop();
    }
}
exports.WebviewPet = WebviewPet;
class WebviewRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentSequence = null;
        this.currentFrameIndex = 0;
        this.lastFrameTime = 0;
        this.animationId = null;
        this.fps = 8;
        this.animate = () => {
            const now = performance.now();
            const interval = 1000 / this.fps;
            if (now - this.lastFrameTime >= interval) {
                this.draw();
                this.lastFrameTime = now;
                if (this.currentSequence && this.currentSequence.frameCount > 0) {
                    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.currentSequence.frameCount;
                }
            }
            this.animationId = requestAnimationFrame(this.animate);
        };
    }
    init() {
        this.canvas = document.getElementById('pet-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
    }
    setSequence(sequence) {
        this.currentSequence = sequence;
        this.currentFrameIndex = 0;
        this.lastFrameTime = 0;
    }
    start() {
        if (this.animationId !== null)
            return;
        this.animate();
    }
    stop() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    draw() {
        if (!this.ctx || !this.canvas)
            return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentSequence && this.currentSequence.frames.length > 0) {
            const frame = this.currentSequence.frames[this.currentFrameIndex];
            if (frame) {
                this.ctx.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }
}
class WebviewSpriteManager {
    constructor() {
        this.sequences = new Map();
        this.basePath = '';
    }
    setBasePath(basePath) {
        this.basePath = basePath;
    }
    async loadSequence(type, state) {
        const key = `${type}_${state}`;
        if (this.sequences.has(key))
            return;
        // 模拟加载帧数据
        const frames = [];
        const frameCount = 4;
        for (let i = 0; i < frameCount; i++) {
            // 创建占位帧
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // 不同状态不同颜色
                const colors = {
                    idle: '#888888',
                    happy: '#FFD700',
                    sad: '#4169E1',
                    eating: '#FF6347',
                    sleeping: '#9370DB',
                    playing: '#32CD32'
                };
                ctx.fillStyle = colors[state];
                ctx.fillRect(0, 0, 128, 128);
                ctx.fillStyle = '#ffffff';
                ctx.font = '24px Arial';
                ctx.fillText(state, 30, 70);
            }
            const img = new Image();
            img.src = canvas.toDataURL();
            frames.push(img);
        }
        this.sequences.set(key, { frames, frameCount });
    }
    getSequence(type, state) {
        const key = `${type}_${state}`;
        return this.sequences.get(key) || null;
    }
}
// 初始化
let pet = null;
window.addEventListener('message', async (event) => {
    const { type, payload } = event.data;
    switch (type) {
        case 'init':
            pet = new WebviewPet();
            await pet.init(payload);
            break;
        case 'action':
            pet?.executeAction(payload);
            break;
        case 'move':
            const pos = payload;
            pet?.updatePosition(pos.x, pos.y);
            break;
        case 'resize':
            const size = payload;
            pet?.updateSize(size.width, size.height);
            break;
        case 'stateUpdate':
            pet?.setState(payload);
            break;
    }
});
//# sourceMappingURL=pet.js.map