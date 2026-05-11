import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PetConfig, DEFAULT_CONFIG } from '../types';

export class Storage {
  private configPath: string;
  private spritesPath: string;

  constructor() {
    const userHome = os.homedir();
    const pluginDir = path.join(userHome, '.claude-pet');
    this.configPath = path.join(pluginDir, 'config.json');
    this.spritesPath = path.join(pluginDir, 'sprites');
  }

  getSpritesPath(): string {
    return this.spritesPath;
  }

  getConfigPath(): string {
    return this.configPath;
  }

  ensureDirectory(): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadConfig(): PetConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        const config = JSON.parse(data) as PetConfig;
        return { ...DEFAULT_CONFIG, ...config };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
    return { ...DEFAULT_CONFIG };
  }

  saveConfig(config: PetConfig): void {
    try {
      this.ensureDirectory();
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  savePosition(x: number, y: number): void {
    const config = this.loadConfig();
    config.position = { x, y };
    this.saveConfig(config);
  }

  saveSize(width: number, height: number): void {
    const config = this.loadConfig();
    config.size = { width, height };
    this.saveConfig(config);
  }

  saveVisible(visible: boolean): void {
    const config = this.loadConfig();
    config.visible = visible;
    this.saveConfig(config);
  }

  savePetData(petData: PetConfig['petData']): void {
    const config = this.loadConfig();
    config.petData = petData;
    this.saveConfig(config);
  }

  getSpritesDir(): string {
    this.ensureDirectory();
    const spritesDir = path.join(this.spritesPath);
    if (!fs.existsSync(spritesDir)) {
      fs.mkdirSync(spritesDir, { recursive: true });
    }
    return spritesDir;
  }
}

export const storage = new Storage();