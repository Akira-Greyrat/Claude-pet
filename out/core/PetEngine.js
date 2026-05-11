"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetEngine = void 0;
class PetEngine {
    constructor(initialData) {
        this.decayInterval = null;
        this.petData = {
            name: initialData?.name ?? 'Buddy',
            type: initialData?.type ?? 'cat',
            hunger: initialData?.hunger ?? 80,
            happiness: initialData?.happiness ?? 80,
            health: initialData?.health ?? 100,
            exp: initialData?.exp ?? 0,
            level: initialData?.level ?? 1,
            lastActiveAt: initialData?.lastActiveAt ?? Date.now(),
            createdAt: initialData?.createdAt ?? Date.now()
        };
    }
    getPetData() {
        return { ...this.petData };
    }
    updatePetData(data) {
        this.petData = { ...this.petData, ...data };
        this.petData.lastActiveAt = Date.now();
    }
    // 根据属性计算当前动画状态
    getAnimationState() {
        const { hunger, happiness, health } = this.petData;
        // 优先级: eating > sleeping > playing > happy > sad > idle
        if (hunger < 30)
            return 'idle';
        if (health < 30)
            return 'sleeping';
        if (happiness > 80)
            return 'happy';
        if (happiness < 20)
            return 'sad';
        return 'idle';
    }
    // 执行动作
    executeAction(action) {
        switch (action) {
            case 'feed':
                this.feed();
                break;
            case 'play':
                this.play();
                break;
            case 'groom':
                this.groom();
                break;
            case 'rest':
                this.rest();
                break;
        }
    }
    feed() {
        this.petData.hunger = Math.min(100, this.petData.hunger + 30);
        this.petData.health = Math.min(100, this.petData.health + 5);
        this.petData.lastActiveAt = Date.now();
    }
    play() {
        this.petData.happiness = Math.min(100, this.petData.happiness + 20);
        this.petData.hunger = Math.max(0, this.petData.hunger - 10);
        this.petData.exp += 10;
        this.checkLevelUp();
        this.petData.lastActiveAt = Date.now();
    }
    groom() {
        this.petData.health = Math.min(100, this.petData.health + 15);
        this.petData.happiness = Math.min(100, this.petData.happiness + 5);
        this.petData.lastActiveAt = Date.now();
    }
    rest() {
        this.petData.health = Math.min(100, this.petData.health + 10);
        this.petData.hunger = Math.max(0, this.petData.hunger - 5);
        this.petData.lastActiveAt = Date.now();
    }
    checkLevelUp() {
        const expNeeded = this.petData.level * 100;
        if (this.petData.exp >= expNeeded) {
            this.petData.level += 1;
            this.petData.exp -= expNeeded;
        }
    }
    // 属性衰减（每分钟调用一次）
    applyDecay() {
        this.petData.hunger = Math.max(0, this.petData.hunger - 2);
        this.petData.happiness = Math.max(0, this.petData.happiness - 1);
        // 饥饿时健康下降
        if (this.petData.hunger < 20) {
            this.petData.health = Math.max(0, this.petData.health - 1);
        }
    }
    // 开始衰减计时器
    startDecayTimer(intervalMs = 60000) {
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
        }
        this.decayInterval = setInterval(() => {
            this.applyDecay();
        }, intervalMs);
    }
    stopDecayTimer() {
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
            this.decayInterval = null;
        }
    }
    // 重置宠物
    reset() {
        this.petData = {
            name: 'Buddy',
            type: this.petData.type,
            hunger: 80,
            happiness: 80,
            health: 100,
            exp: 0,
            level: 1,
            lastActiveAt: Date.now(),
            createdAt: Date.now()
        };
    }
}
exports.PetEngine = PetEngine;
//# sourceMappingURL=PetEngine.js.map