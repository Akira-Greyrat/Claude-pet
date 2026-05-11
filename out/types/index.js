"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.DEFAULT_PET_DATA = void 0;
// 默认配置
exports.DEFAULT_PET_DATA = {
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
exports.DEFAULT_CONFIG = {
    position: { x: 100, y: 100 },
    size: { width: 200, height: 200 },
    visible: true,
    petData: { ...exports.DEFAULT_PET_DATA }
};
//# sourceMappingURL=index.js.map