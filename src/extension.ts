import * as vscode from 'vscode';
import * as fs from 'fs';
import { PetEngine } from './core/PetEngine';
import { Storage } from './core/Storage';
import { PetConfig, ActionCommand } from './types';

let petEngine: PetEngine;
let storage: Storage;
let currentConfig: PetConfig;
let webviewPanel: vscode.WebviewPanel | null = null;

export function activate(context: vscode.ExtensionContext) {
  storage = new Storage();
  currentConfig = storage.loadConfig();
  petEngine = new PetEngine(currentConfig.petData);

  const commands = [
    { name: 'claude-pet.show', handler: showPet },
    { name: 'claude-pet.hide', handler: hidePet },
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

function getWebviewContent(): string {
  const extensionUri = vscode.extensions.getExtension('claude.claude-pet')!.extensionUri;
  const htmlPath = vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'pet.html');
  return fs.readFileSync(htmlPath.fsPath, 'utf-8');
}

async function showPet() {
  if (webviewPanel) {
    webviewPanel.reveal(vscode.ViewColumn.One, true);
    return;
  }

  const extensionUri = vscode.extensions.getExtension('claude.claude-pet')!.extensionUri;

  webviewPanel = vscode.window.createWebviewPanel(
    'claudePet',
    'Claude Pet',
    {
      viewColumn: vscode.ViewColumn.One,
      preserveFocus: true
    },
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, 'src', 'webview'),
        vscode.Uri.joinPath(extensionUri, 'resources', 'sprites')
      ]
    }
  );

  const spritesRoot = webviewPanel.webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'resources', 'sprites')
  );

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
}

function hidePet() {
  if (webviewPanel) {
    webviewPanel.dispose();
    webviewPanel = null;
  }
  storage.saveVisible(false);
}

async function switchPet() {
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

  vscode.window.showInformationMessage(`Switched to ${nextType}!`);
}

function executeAction(action: ActionCommand) {
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

function handleWebviewMessage(message: { type: string; payload?: unknown }) {
  switch (message.type) {
    case 'move':
      const pos = message.payload as { x: number; y: number };
      currentConfig.position = pos;
      storage.savePosition(pos.x, pos.y);
      break;
    case 'resize':
      const size = message.payload as { width: number; height: number };
      currentConfig.size = size;
      storage.saveSize(size.width, size.height);
      break;
  }
}

export function deactivate() {
  petEngine?.stopDecayTimer();
  if (webviewPanel) {
    webviewPanel.dispose();
  }
}