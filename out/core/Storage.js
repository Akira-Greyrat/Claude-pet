"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.Storage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const types_1 = require("../types");
class Storage {
    constructor() {
        const userHome = os.homedir();
        const pluginDir = path.join(userHome, '.claude-pet');
        this.configPath = path.join(pluginDir, 'config.json');
        this.spritesPath = path.join(pluginDir, 'sprites');
    }
    getSpritesPath() {
        return this.spritesPath;
    }
    getConfigPath() {
        return this.configPath;
    }
    ensureDirectory() {
        const dir = path.dirname(this.configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf-8');
                const config = JSON.parse(data);
                return { ...types_1.DEFAULT_CONFIG, ...config };
            }
        }
        catch (error) {
            console.error('Failed to load config:', error);
        }
        return { ...types_1.DEFAULT_CONFIG };
    }
    saveConfig(config) {
        try {
            this.ensureDirectory();
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Failed to save config:', error);
        }
    }
    savePosition(x, y) {
        const config = this.loadConfig();
        config.position = { x, y };
        this.saveConfig(config);
    }
    saveSize(width, height) {
        const config = this.loadConfig();
        config.size = { width, height };
        this.saveConfig(config);
    }
    saveVisible(visible) {
        const config = this.loadConfig();
        config.visible = visible;
        this.saveConfig(config);
    }
    savePetData(petData) {
        const config = this.loadConfig();
        config.petData = petData;
        this.saveConfig(config);
    }
    getSpritesDir() {
        this.ensureDirectory();
        const spritesDir = path.join(this.spritesPath);
        if (!fs.existsSync(spritesDir)) {
            fs.mkdirSync(spritesDir, { recursive: true });
        }
        return spritesDir;
    }
}
exports.Storage = Storage;
exports.storage = new Storage();
//# sourceMappingURL=Storage.js.map