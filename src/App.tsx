import React, { useState } from 'react';
import { SecurityConfig, SecurityLogEvent } from './types/security';
import { PhoneEmulator } from './components/PhoneEmulator';
import { ForensicInspector } from './components/ForensicInspector';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureMatrix } from './components/ArchitectureMatrix';
import { LiveLogStream } from './components/LiveLogStream';
import { SettingsModal } from './components/SettingsModal';
import { KOTLIN_CODEBASE } from './data/kotlinCodebase';
import {
  Shield,
  Smartphone,
  FileCode,
  Layers,
  Settings,
  Flame,
  Terminal,
  Cpu,
  Lock,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'codebase' | 'architecture'>('simulator');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Security Configuration State
  const [config, setConfig] = useState<SecurityConfig>({
    realPin: '1337',
    duressPin: '9999',
    duressAction: 'FULL_DEVICE_WIPE',
    scrambleKeypad: true,
    enableHardwareTriggers: true,
    volumePressCount: 5,
    panicKitEnabled: true,
    deviceAdminGranted: true,
    deviceOwnerMode: true,
    sosEmergencyNumber: '+34 600 00 00 00',
    sosCustomMessage: 'DURESS ALERT: Security emergency triggered at current location.',
    autoWipeDeadmanHours: 48,
    stealthCrashEffect: true
  });

  // Memory & RAM Inspector State
  const [memoryState, setMemoryState] = useState<'NORMAL' | 'REAL_ACTIVE' | 'DECOY_ACTIVE' | 'ZEROIZED' | 'WIPED'>('NORMAL');

  // Real-time security telemetry logs
  const [logs, setLogs] = useState<SecurityLogEvent[]>([
    {
      id: 'log-1',
      timestamp: '12:00:01',
      level: 'INFO',
      source: 'CryptoManager',
      message: 'DuressGuard inicializado en modo 100% Offline. Android Keystore StrongBox vinculado.'
    },
    {
      id: 'log-2',
      timestamp: '12:00:02',
      level: 'SECURITY',
      source: 'DuressAdmin',
      message: 'DeviceAdminReceiver verificado: Privilegios de DevicePolicyManager activos (lockNow, wipeData).'
    },
    {
      id: 'log-3',
      timestamp: '12:00:03',
      level: 'CRYPTO',
      source: 'SQLCipher',
      message: 'Base de datos cifrada montada con cabecera HMAC-SHA512 y páginas AES-256.'
    }
  ]);

  const addLog = (event: Omit<SecurityLogEvent, 'id' | 'timestamp'>) => {
    const newLog: SecurityLogEvent = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      ...event
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-950/50">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-white">
                  DuressGuard
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                  KOTLIN / ANDROID 14+
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Arquitectura Duress PIN, Negación Plausible & Borrado de Emergencia
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Emulador & Laboratorio</span>
            </button>

            <button
              onClick={() => setActiveTab('codebase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'codebase'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Código Kotlin ({KOTLIN_CODEBASE.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Matriz & GrapheneOS</span>
            </button>
          </div>

          {/* Right Tools & Badges */}
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/50">
              <WifiOff className="w-3 h-3" />
              <span>100% OFFLINE</span>
            </span>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Ajustes de PIN y Coacción"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden items-center justify-around mt-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg ${
              activeTab === 'simulator' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'
            }`}
          >
            Emulador
          </button>
          <button
            onClick={() => setActiveTab('codebase')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg ${
              activeTab === 'codebase' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'
            }`}
          >
            Código Kotlin
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`text-xs font-semibold py-1 px-2 rounded-lg ${
              activeTab === 'architecture' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'
            }`}
          >
            Matriz de Seguridad
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* TAB 1: EMULATOR & LAB */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Phone Emulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="mb-3 text-center">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                  Pantalla de Bloqueo Android 14/15
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  1. Desbloqueo Apps: <strong className="text-emerald-400">{config.realPin}</strong> | 2. Auto Wipe: <strong className="text-rose-400">{config.duressPin}</strong>
                </p>
              </div>

              <PhoneEmulator
                config={config}
                onAddLog={addLog}
                onMemoryStateChange={(state) => setMemoryState(state)}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>

            {/* Right Column: Forensic Inspector & Logcat Console */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Dual-Code Operation & Permissions Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Pantalla de Bloqueo & 2 Códigos Operativos
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      El dispositivo actúa como la <strong>Pantalla de Bloqueo del Smartphone</strong>. Con los permisos concedidos por el usuario (Device Admin, Superposición, Accesibilidad y Home Launcher), opera con 2 códigos:
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 shrink-0 transition-colors"
                  >
                    Ajustes
                  </button>
                </div>

                {/* 2 Codes Visual Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Code 1 */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-300">1. Código de Desbloqueo</span>
                      <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                        {config.realPin}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Desbloquea el teléfono y da <strong>acceso completo al escritorio, apps (Galería, Bóveda, Mensajes, Teléfono)</strong> e información confidencial.
                    </p>
                  </div>

                  {/* Code 2 */}
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-rose-300">2. Código de Borrado</span>
                      <span className="font-mono text-xs font-extrabold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/60">
                        {config.duressPin}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      <strong>Automático e inmediato</strong>: Sin confirmaciones ni ventanas, invoca <code className="text-rose-300 font-mono text-[10px]">dpm.wipeData()</code> y formatea todo el dispositivo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Memory / Forensic Inspector */}
              <ForensicInspector
                memoryState={memoryState}
                realPin={config.realPin}
                duressPin={config.duressPin}
              />

              {/* Logcat Live Console */}
              <LiveLogStream logs={logs} onClearLogs={handleClearLogs} />
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTION KOTLIN CODEBASE */}
        {activeTab === 'codebase' && (
          <div className="h-full">
            <CodeViewer files={KOTLIN_CODEBASE} />
          </div>
        )}

        {/* TAB 3: ARCHITECTURE & GRAPHENEOS MATRIX */}
        {activeTab === 'architecture' && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">
                Arquitectura de Seguridad & Análisis de Factibilidad Android
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comparativa exhaustiva entre implementaciones a nivel de Sistema Operativo (GrapheneOS / Keyguard FBE), Android Enterprise (Device Owner / DPM) y Aplicaciones en Espacio de Usuario (User-Space Sandboxed).
              </p>
            </div>

            <ArchitectureMatrix />
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newCfg) => {
          setConfig(newCfg);
          addLog({
            level: 'INFO',
            source: 'CryptoManager',
            message: `Ajustes actualizados: PIN Real [${newCfg.realPin}], Duress PIN [${newCfg.duressPin}], Acción [${newCfg.duressAction}]`
          });
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DuressGuard • Arquitectura de Protección bajo Coacción para Android</span>
          <span className="font-mono text-[11px] text-slate-400">
            Zero Telemetry • StrongBox HSM • SQLCipher 4.5 • PanicKit Standard
          </span>
        </div>
      </footer>
    </div>
  );
}
