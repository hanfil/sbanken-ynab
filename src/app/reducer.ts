import { Reducer } from 'redux';
import { ExportedSettings } from './utils';

export enum AppActionType {
  HasUpdates = 'app/has-updates',
  UpdateOfflineStatus = 'app/update-offline-status',
  ImportSettings = 'app/import-settings',
}

const hasUpdates = () => ({
  type: AppActionType.HasUpdates as AppActionType.HasUpdates,
});

const updateOfflineStatus = (offline: boolean) => ({
  type: AppActionType.UpdateOfflineStatus as AppActionType.UpdateOfflineStatus,
  offline,
});

const importSettings = (settings: ExportedSettings) => ({
  type: AppActionType.ImportSettings as AppActionType.ImportSettings,
  settings,
});

export const actions = {
  hasUpdates,
  updateOfflineStatus,
  importSettings,
};

export type AppAction = ReturnType<typeof actions[keyof typeof actions]>

export const appStateKey = 'app';

const initialState = {
  offline: !navigator.onLine,
};

export type AppState = typeof initialState;

const reducer: Reducer<AppState, AppAction> = (state = initialState, action) => {
  switch (action.type) {
    case AppActionType.UpdateOfflineStatus:
      return {
        ...state,
        offline: action.offline,
      };
    default:
      return state;
  }
};

export default reducer;
