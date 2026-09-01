export type DuressActionType = 'DECOY_VAULT' | 'SILENT_APP_WIPE' | 'FULL_DEVICE_WIPE' | 'SILENT_SOS_ALERT' | 'LOCK_IMMEDIATE';

export interface SecurityConfig {
  realPin: string;
  duressPin: string;
  duressAction: DuressActionType;
  scrambleKeypad: boolean;
  enableHardwareTriggers: boolean;
  volumePressCount: number;
  panicKitEnabled: boolean;
  deviceAdminGranted: boolean;
  deviceOwnerMode: boolean;
  sosEmergencyNumber: string;
  sosCustomMessage: string;
  autoWipeDeadmanHours: number;
  stealthCrashEffect: boolean;
}

export interface VaultItem {
  id: string;
  title: string;
  category: 'NOTE' | 'CREDENTIAL' | 'PHOTO' | 'CONTACT' | 'DOCUMENT';
  content: string;
  encrypted: boolean;
  timestamp: string;
  previewUrl?: string;
  badge?: string;
}

export interface MemorySegment {
  address: string;
  label: string;
  status: 'PROTECTED' | 'ACTIVE_KEY' | 'ZEROIZED' | 'ENCRYPTED';
  bytesPreview: string;
}

export interface SecurityLogEvent {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'DANGER' | 'SECURITY' | 'CRYPTO';
  source: 'CryptoManager' | 'DuressAdmin' | 'PanicKit' | 'Keyguard' | 'MemoryShredder' | 'SQLCipher';
  message: string;
  metadata?: Record<string, any>;
}

export interface ThreatAnalysisItem {
  threat: string;
  adversary: string;
  userAppCapability: 'PARCIAL' | 'EFECTIVA' | 'NO_POSIBLE';
  deviceOwnerCapability: 'EFECTIVA' | 'PARCIAL';
  grapheneOsCapability: 'NATIVA_TOTAL';
  description: string;
  mitigation: string;
}
