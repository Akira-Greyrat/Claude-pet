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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const PetEngine_1 = require("./core/PetEngine");
const Storage_1 = require("./core/Storage");
let petEngine;
let storage;
let currentConfig;
let statusBarItem;
let webviewPanel = null;
function activate(context) {
    storage = new Storage_1.Storage();
    currentConfig = storage.loadConfig();
    petEngine = new PetEngine_1.PetEngine(currentConfig.petData);
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem('claude-pet', vscode.StatusBarAlignment.Left, 0);
    statusBarItem.text = '🐱';
    statusBarItem.tooltip = 'Claude Pet';
    statusBarItem.command = 'claude-pet.toggle';
    statusBarItem.show();
    // Register commands
    const commands = [
        { name: 'claude-pet.show', handler: showPet },
        { name: 'claude-pet.hide', handler: hidePet },
        { name: 'claude-pet.toggle', handler: togglePet },
        { name: 'claude-pet.feed', handler: () => executeAction('feed') },
        { name: 'claude-pet.play', handler: () => executeAction('play') },
        { name: 'claude-pet.groom', handler: () => executeAction('groom') },
        { name: 'claude-pet.rest', handler: () => executeAction('rest') },
        { name: 'claude-pet.reset', handler: resetPet },
        { name: 'claude-pet.switch', handler: switchPet }
    ];
    commands.forEach(({ name, handler }) => {
        const disposable = vscode.commands.registerCommand(name, handler);
        context.subscriptions.push(disposable);
    });
    petEngine.startDecayTimer(60000);
    if (currentConfig.visible) {
        showPet();
    }
}
function getWebviewContent() {
    const extensionUri = vscode.extensions.getExtension('claude.claude-pet').extensionUri;
    const htmlPath = vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'pet.html');
    return fs.readFileSync(htmlPath.fsPath, 'utf-8');
}
async function showPet() {
    if (webviewPanel) {
        webviewPanel.reveal(vscode.ViewColumn.Nine, true);
        return;
    }
    const extensionUri = vscode.extensions.getExtension('claude.claude-pet').extensionUri;
    webviewPanel = vscode.window.createWebviewPanel('claudePet', 'Claude Pet', {
        viewColumn: vscode.ViewColumn.Nine,
        preserveFocus: true
    }, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, 'src', 'webview'),
            vscode.Uri.joinPath(extensionUri, 'resources', 'sprites')
        ]
    });
    const spritesRoot = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'resources', 'sprites'));
    let htmlContent = getWebviewContent();
    htmlContent = htmlContent.replace('{SPRITES_BASE_URL}', spritesRoot.toString());
    webviewPanel.webview.html = htmlContent;
    webviewPanel.webview.postMessage({
        type: 'init',
        payload: currentConfig
    });
    webviewPanel.webview.onDidReceiveMessage((message) => {
        handleWebviewMessage(message);
    });
    webviewPanel.onDidDispose(() => {
        webviewPanel = null;
    });
    currentConfig.visible = true;
    storage.saveVisible(true);
}
function hidePet() {
    if (webviewPanel) {
        webviewPanel.dispose();
        webviewPanel = null;
    }
    currentConfig.visible = false;
    storage.saveVisible(false);
}
function togglePet() {
    if (currentConfig.visible) {
        hidePet();
    }
    else {
        showPet();
    }
}
function switchPet() {
    const petTypes = ['cat', 'dog', 'rabbit', 'bird'];
    const currentIndex = petTypes.indexOf(currentConfig.petData.type);
    const nextIndex = (currentIndex + 1) % petTypes.length;
    const nextType = petTypes[nextIndex];
    currentConfig.petData.type = nextType;
    petEngine.updatePetData({ type: nextType });
    storage.savePetData(currentConfig.petData);
    if (webviewPanel) {
        webviewPanel.webview.postMessage({
            type: 'switchPet',
            payload: nextType
        });
    }
    const icons = { cat: '🐱', dog: '🐶', rabbit: '🐰', bird: '🐦' };
    statusBarItem.text = icons[nextType] || '🐱';
    vscode.window.showInformationMessage(`Switched to ${nextType}!`);
}
function executeAction(action) {
    petEngine.executeAction(action);
    const petData = petEngine.getPetData();
    storage.savePetData(petData);
    if (webviewPanel) {
        webviewPanel.webview.postMessage({ type: 'action', payload: action });
    }
}
function resetPet() {
    petEngine.reset();
    const petData = petEngine.getPetData();
    storage.savePetData(petData);
    if (webviewPanel) {
        webviewPanel.webview.postMessage({ type: 'stateUpdate', payload: 'idle' });
    }
}
function handleWebviewMessage(message) {
    switch (message.type) {
        case 'move':
            const pos = message.payload;
            currentConfig.position = pos;
            storage.savePosition(pos.x, pos.y);
            break;
        case 'resize':
            const size = message.payload;
            currentConfig.size = size;
            storage.saveSize(size.width, size.height);
            break;
    }
}
function deactivate() {
    petEngine?.stopDecayTimer();
    if (webviewPanel) {
        webviewPanel.dispose();
    }
    statusBarItem?.dispose();
}
//# sourceMappingURL=extension.js.map