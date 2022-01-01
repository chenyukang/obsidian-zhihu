import type ZhihuPlugin from '../main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { get } from 'svelte/store';

const { moment } = window;

export class SettingsTab extends PluginSettingTab {
  public app: App;
  private plugin: ZhihuPlugin;
  
  constructor(app: App, plugin: ZhihuPlugin) {
    super(app, plugin);
    this.app = app;
    this.plugin = plugin;
}

  public async display(): Promise<void> {
    const { containerEl } = this;

    containerEl.empty();
  }
}