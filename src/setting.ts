import { writable } from 'svelte/store';
import type ZhihuPlugin from '~/main';

type SyncHistory = {
  totalArticles: number;
  totalHighlights: number;
};

type Settings = {
  token: string
  user: string
  highlightsFolder: string;
  lastSyncDate?: Date;
  isConnected: boolean;
  syncOnBoot: boolean;
  history: SyncHistory;
  dateTimeFormat: string;
  autoSyncInterval: number;
};

const DEFAULT_SETTINGS: Settings = {
  token: '',
  user: '',
  highlightsFolder: '/',
  isConnected: false,  
  syncOnBoot: false,
  autoSyncInterval: 0,
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  history: {
    totalArticles: 0,
    totalHighlights: 0,
  }  
};

const createSettingsStore = () => {
  const store = writable(DEFAULT_SETTINGS as Settings);

  let _plugin!: ZhihuPlugin;

  // Load settings data from disk into store
  const initialise = async (plugin: ZhihuPlugin): Promise<void> => {
    const data = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());

    const settings: Settings = {
      ...data,
      lastSyncDate: data.lastSyncDate ? new Date(data.lastSyncDate) : undefined,
    };

    store.set(settings);
    _plugin = plugin;
  };

  // Listen to any change to store, and write to disk
  store.subscribe(async (settings) => {
    if (_plugin) {
      // Transform settings fields for serialization
      const data = {
        ...settings,
        lastSyncDate: settings.lastSyncDate
          ? settings.lastSyncDate.toJSON()
          : undefined,
      };

      await _plugin.saveData(data);
    }
  });

  const connect = async (token: string, userid: string) => {
    store.update((state) => {
      state.isConnected = true;
      state.token = token;
      state.user = userid;
      return state;
    });
  };

  const disconnect = () => {
    store.update((state) => {
      state.isConnected = false;
      state.user = undefined;
      state.token = undefined;
      return state;
    });
  };

  const setHighlightsFolder = (value: string) => {
    store.update((state) => {
      state.highlightsFolder = value;
      return state;
    });
  };

const setSyncOnBoot = (value: boolean) => {
    store.update((state) => {
      state.syncOnBoot = value;
      return state;
    });
  };

  const setDateTimeFormat = (value: string) => {
    store.update((state) => {
      state.dateTimeFormat = value;
      return state;
    });
  };

  const setAutoSyncInterval = (value: number) => {
    store.update((state) => {
      state.autoSyncInterval = value;
      return state;
    });
  };

  return {
    subscribe: store.subscribe,
    initialise,
    actions: {
      setHighlightsFolder,
      connect,
      disconnect,
      setAutoSyncInterval,
      setSyncOnBoot,
      setDateTimeFormat,
    },
  };
};

export const settingsStore = createSettingsStore();
