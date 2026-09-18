export interface WingetConfig {
  username: string;
  useCustomUserPath: boolean;
  customExecutablePath: string;
  all: boolean;
  silent: boolean;
  ignoreSecurityHash: boolean;
  acceptPackageAgreements: boolean;
  acceptSourceAgreements: boolean;
  disableInteractivity: boolean;
  includeUnknown: boolean;
  autoElevateAdmin: boolean;
  autoInstallWinget: boolean;
  logToFile: boolean;
  logFileName: string;
  notifyOnFinish: boolean;
  includeWindowsUpdate: boolean;
}

export interface ScriptOption {
  id: 'bat' | 'vbs' | 'ps1' | 'shortcut' | 'scheduled';
  title: string;
  badge: string;
  description: string;
  filename: string;
  iconName: string;
}
