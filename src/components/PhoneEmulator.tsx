import React, { useState, useEffect, useRef } from 'react';
import {
  SecurityConfig,
  VaultItem,
  SecurityLogEvent
} from '../types/security';
import { AndroidLockScreen } from './AndroidLockScreen';
import { PinKeypadScreen } from './PinKeypadScreen';
import { AndroidHomeScreen } from './AndroidHomeScreen';
import { AndroidRecoveryScreen } from './AndroidRecoveryScreen';
import { VaultView } from './VaultView';
import { DECOY_VAULT_ITEMS } from '../data/vaultData';
import {
  Shield,
  WifiOff,
  Battery,
  Lock,
  Volume2,
  Power,
  Flame,
  Radio,
  Send,
  AlertOctagon,
  RefreshCw,
  Eye,
  CheckCircle2,
  Skull,
  PhoneCall,
  ArrowLeft,
  Camera
} from 'lucide-react';

interface PhoneEmulatorProps {
  config: SecurityConfig;
  onAddLog: (event: Omit<SecurityLogEvent, 'id' | 'timestamp'>) => void;
  onMemoryStateChange?: (state: 'NORMAL' | 'REAL_ACTIVE' | 'DECOY_ACTIVE' | 'ZEROIZED' | 'WIPED') => void;
  onOpenSettings?: () => void;
}

export type PhoneScreen =
  | 'LOCKSCREEN'
  | 'KEYPAD'
  | 'REAL_PHONE_HOME'
  | 'DECOY_VAULT'
  | 'WIPED_RECOVERY'
  | 'CRASH_SCREEN'
  | 'EMERGENCY_DIALER'
  | 'QUICK_CAMERA';

export const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  config,
  onAddLog,
  onMemoryStateChange,
  onOpenSettings
}) => {
  const [screen, setScreen] = useState<PhoneScreen>('LOCKSCREEN');
  const [currentTime, setCurrentTime] = useState('12:00');
  const [currentDate, setCurrentDate] = useState('Martes, 1 de Septiembre');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [emergencyInput, setEmergencyInput] = useState('112');

  // Volume key cadence detection
  const [volumePressCount, setVolumePressCount] = useState(0);
  const lastVolumePressRef = useRef<number>(0);
  const volumeResetTimerRef = useRef<any>(null);

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(
        d.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlockPin = (pin: string) => {
    setIsVerifying(true);
    const startTime = performance.now();

    onAddLog({
      level: 'CRYPTO',
      source: 'CryptoManager',
      message: `Iniciando derivación PBKDF2/Argon2id para PIN ingresado (${pin.length} dígitos)...`
    });

    // Constant-time artificial delay to match AuthenticateUseCase
    setTimeout(() => {
      const elapsed = Math.round(performance.now() - startTime);

      if (pin === config.realPin) {
        onAddLog({
          level: 'SECURITY',
          source: 'CryptoManager',
          message: `PIN Real de Desbloqueo autenticado (${elapsed}ms). Acceso concedido al Sistema Operativo y Apps.`
        });
        setScreen('REAL_PHONE_HOME');
        onMemoryStateChange?.('REAL_ACTIVE');
        setIsVerifying(false);
      } else if (pin === config.duressPin) {
        onAddLog({
          level: 'DANGER',
          source: 'CryptoManager',
          message: `¡CÓDIGO DE BORRADO DE FÁBRICA INGRESADO! Iniciando borrado inmediato e irrevocable sin confirmaciones...`
        });

        executeDuressAction();
      } else {
        onAddLog({
          level: 'WARN',
          source: 'CryptoManager',
          message: `Fallo de autenticación: PIN incorrecto (${elapsed}ms). Zeroization inmediata de buffers temporales.`
        });
        setErrorAnimation(true);
        setTimeout(() => setErrorAnimation(false), 500);
        setIsVerifying(false);
      }
    }, 280);
  };

  const executeDuressAction = () => {
    setIsVerifying(false);

    switch (config.duressAction) {
      case 'FULL_DEVICE_WIPE':
      default:
        onAddLog({
          level: 'DANGER',
          source: 'DuressAdmin',
          message: 'EMERGENCIA: Invocando DevicePolicyManager.wipeData(WIPE_EXTERNAL_STORAGE | WIPE_SILENTLY)...'
        });
        onMemoryStateChange?.('WIPED');
        setScreen('WIPED_RECOVERY');
        break;

      case 'DECOY_VAULT':
        onAddLog({
          level: 'SECURITY',
          source: 'SQLCipher',
          message: 'Zeroization: Clave real purgada de RAM. Desbloqueando base de datos Bóveda Señuelo (Decoy Vault).'
        });
        setScreen('DECOY_VAULT');
        onMemoryStateChange?.('DECOY_ACTIVE');
        break;

      case 'SILENT_APP_WIPE':
        onAddLog({
          level: 'DANGER',
          source: 'MemoryShredder',
          message: 'Destruyendo alias en Android Keystore y sobreescribiendo base de datos con 0x00/0xFF...'
        });
        onMemoryStateChange?.('ZEROIZED');
        if (config.stealthCrashEffect) {
          setScreen('CRASH_SCREEN');
        } else {
          setScreen('LOCKSCREEN');
        }
        break;

      case 'SILENT_SOS_ALERT':
        onAddLog({
          level: 'DANGER',
          source: 'DuressAdmin',
          message: `Despachando SMS de auxilio silencioso a ${config.sosEmergencyNumber} con coordenadas GPS fijadas: [40.4168° N, 3.7038° W]`
        });
        setSosActive(true);
        setScreen('DECOY_VAULT');
        onMemoryStateChange?.('DECOY_ACTIVE');
        setTimeout(() => setSosActive(false), 4000);
        break;

      case 'LOCK_IMMEDIATE':
        onAddLog({
          level: 'WARN',
          source: 'DuressAdmin',
          message: 'DevicePolicyManager.lockNow() ejecutado. Bloqueando pantalla forzosamente.'
        });
        onMemoryStateChange?.('ZEROIZED');
        setScreen('LOCKSCREEN');
        break;
    }
  };

  // Hardware Volume Button handler
  const handleVolumeDownPress = () => {
    const now = Date.now();
    if (now - lastVolumePressRef.current < 2500) {
      const nextCount = volumePressCount + 1;
      setVolumePressCount(nextCount);
      onAddLog({
        level: 'INFO',
        source: 'Keyguard',
        message: `Hardware Key: Volume Down detectado (${nextCount}/${config.volumePressCount})`
      });

      if (nextCount >= config.volumePressCount) {
        onAddLog({
          level: 'DANGER',
          source: 'Keyguard',
          message: 'Cadencia de Coacción por Hardware alcanzada. Disparando borrado de fábrica de emergencia...'
        });
        executeDuressAction();
        setVolumePressCount(0);
      }
    } else {
      setVolumePressCount(1);
      onAddLog({
        level: 'INFO',
        source: 'Keyguard',
        message: 'Hardware Key: Secuencia iniciada (1/5 toques)...'
      });
    }
    lastVolumePressRef.current = now;

    clearTimeout(volumeResetTimerRef.current);
    volumeResetTimerRef.current = setTimeout(() => {
      setVolumePressCount(0);
    }, 2500);
  };

  // External PanicKit Trigger simulation
  const handlePanicKitTrigger = () => {
    onAddLog({
      level: 'DANGER',
      source: 'PanicKit',
      message: 'BroadcastReceiver: Recibido intent "info.guardianproject.panic.action.TRIGGER"'
    });
    executeDuressAction();
  };

  const handleResetDevice = () => {
    setScreen('LOCKSCREEN');
    onMemoryStateChange?.('NORMAL');
    onAddLog({
      level: 'INFO',
      source: 'CryptoManager',
      message: 'Dispositivo reiniciado en estado BFU (Before First Unlock). Claves bloqueadas.'
    });
  };

  const togglePowerScreen = () => {
    if (screen === 'LOCKSCREEN') {
      setScreen('KEYPAD');
      onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Hardware: Encendido de pantalla -> Mostrando PIN Keypad' });
    } else if (screen === 'KEYPAD' || screen === 'REAL_PHONE_HOME' || screen === 'DECOY_VAULT' || screen === 'QUICK_CAMERA' || screen === 'EMERGENCY_DIALER') {
      setScreen('LOCKSCREEN');
      onMemoryStateChange?.('NORMAL');
      onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Hardware: Botón Power -> Pantalla Bloqueada (Keyguard Activo)' });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Hardware Shell (Pixel 8 / Modern Titanium Flagship) */}
      <div className="relative w-[340px] sm:w-[365px] h-[710px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12),0_0_50px_rgba(16,185,129,0.15)] border-[4px] border-slate-800 flex flex-col justify-between select-none">
        
        {/* Hardware Button: Volume Up */}
        <button
          onClick={() => {
            onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Hardware: Volume Up pressed' });
          }}
          className="absolute -left-3.5 top-28 w-2 h-12 bg-slate-700 hover:bg-slate-600 rounded-l-md active:scale-95 transition-all shadow-md"
          title="Botón Volumen +"
        />

        {/* Hardware Button: Volume Down (Coercion Multi-press trigger) */}
        <button
          onClick={handleVolumeDownPress}
          className="absolute -left-3.5 top-44 w-2 h-14 bg-emerald-700/80 hover:bg-emerald-600 rounded-l-md active:scale-95 transition-all shadow-md group"
          title="Botón Volumen - (Pulsa 5 veces seguidas para trigger de coacción)"
        >
          {volumePressCount > 0 && (
            <span className="absolute -left-7 top-3 bg-emerald-500 text-[10px] font-bold text-slate-950 px-1 rounded-full shadow">
              {volumePressCount}
            </span>
          )}
        </button>

        {/* Hardware Button: Power Button (Toggle Screen Lock) */}
        <button
          onClick={togglePowerScreen}
          className="absolute -right-3.5 top-32 w-2 h-14 bg-slate-700 hover:bg-slate-600 rounded-r-md active:scale-95 transition-all shadow-md"
          title="Botón Power (Bloquear / Encender Pantalla)"
        />

        {/* Inner Screen Area */}
        <div className="relative w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-800/80">
          
          {/* Punch-hole Camera & Speaker Earpiece */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
            <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-950 rounded-full"></div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-8 px-6 flex items-center justify-between text-[11px] font-medium text-slate-300 z-30 pt-1">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-emerald-400 font-mono text-[9px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                <WifiOff className="w-2.5 h-2.5" /> SEC-OFFLINE
              </span>
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* SOS Sending Pill Alert */}
          {sosActive && (
            <div className="absolute top-10 left-4 right-4 z-50 bg-rose-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Enviando SOS Silencioso (SMS + GPS)...</span>
              </div>
              <span className="font-mono text-[10px]">100%</span>
            </div>
          )}

          {/* Screen Content Switcher */}
          <div className="flex-1 relative overflow-hidden">
            {/* 1. REALISTIC SMARTPHONE LOCK SCREEN */}
            {screen === 'LOCKSCREEN' && (
              <AndroidLockScreen
                config={config}
                currentTime={currentTime}
                currentDate={currentDate}
                onSwipeUp={() => setScreen('KEYPAD')}
                onEmergencyCall={() => setScreen('EMERGENCY_DIALER')}
                onCameraLaunch={() => setScreen('QUICK_CAMERA')}
                onFlashlightToggle={() => {
                  onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Atajo: Linterna alternada en pantalla de bloqueo' });
                }}
              />
            )}

            {/* 2. AUTHENTIC SYSTEM LOCKSCREEN PIN KEYPAD */}
            {screen === 'KEYPAD' && (
              <PinKeypadScreen
                scramble={config.scrambleKeypad}
                onPinSubmit={handleUnlockPin}
                isVerifying={isVerifying}
                errorAnimation={errorAnimation}
                onBackToLock={() => setScreen('LOCKSCREEN')}
                onEmergencyCall={() => setScreen('EMERGENCY_DIALER')}
                hint={
                  config.scrambleKeypad
                    ? 'Teclado Aleatorio Anti-Espionaje'
                    : `Prueba ${config.realPin} (Desbloqueo) o ${config.duressPin} (Borrado Fábrica)`
                }
              />
            )}

            {/* 3. UNLOCKED SMARTPHONE DESKTOP & APPS (CODE 1 UNLOCKED) */}
            {screen === 'REAL_PHONE_HOME' && (
              <AndroidHomeScreen
                config={config}
                onLockScreen={() => {
                  setScreen('LOCKSCREEN');
                  onMemoryStateChange?.('ZEROIZED');
                  onAddLog({
                    level: 'INFO',
                    source: 'Keyguard',
                    message: 'Dispositivo bloqueado. Retornando a Lockscreen.'
                  });
                }}
                onOpenSettings={() => {
                  onOpenSettings?.();
                }}
                onAddLog={onAddLog}
              />
            )}

            {/* 4. DECOY VAULT VIEW (PLAUSIBLE DENIABILITY) */}
            {screen === 'DECOY_VAULT' && (
              <VaultView
                isDecoy={true}
                items={DECOY_VAULT_ITEMS}
                onLock={() => {
                  setScreen('LOCKSCREEN');
                  onMemoryStateChange?.('ZEROIZED');
                  onAddLog({
                    level: 'INFO',
                    source: 'CryptoManager',
                    message: 'Bóveda Señuelo cerrada.'
                  });
                }}
              />
            )}

            {/* 5. INSTANT FACTORY RESET / ANDROID RECOVERY (CODE 2 TRIGGERED) */}
            {screen === 'WIPED_RECOVERY' && (
              <AndroidRecoveryScreen onRestartDevice={handleResetDevice} />
            )}

            {/* 6. EMERGENCY DIALER SCREEN */}
            {screen === 'EMERGENCY_DIALER' && (
              <div className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setScreen('LOCKSCREEN')}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xs font-bold text-rose-400">Llamada de Emergencia</h3>
                  <div className="w-5" />
                </div>

                <div className="my-auto text-center">
                  <span className="text-3xl font-mono font-bold text-white tracking-widest">
                    {emergencyInput}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Llamada a servicios de urgencias (112 / 911)</p>
                </div>

                <div className="w-full max-w-[200px] mx-auto grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setEmergencyInput((prev) => prev + k)}
                      className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold flex items-center justify-center border border-slate-700"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-3">
                  <button
                    onClick={() => {
                      onAddLog({ level: 'DANGER', source: 'Keyguard', message: `Llamada de emergencia iniciada a ${emergencyInput}...` });
                      alert(`Conectando con el centro de emergencias (${emergencyInput})...`);
                    }}
                    className="py-2.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <PhoneCall className="w-4 h-4" /> Marcar Emergencia
                  </button>
                </div>
              </div>
            )}

            {/* 7. QUICK CAMERA SCREEN */}
            {screen === 'QUICK_CAMERA' && (
              <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setScreen('LOCKSCREEN')}
                    className="p-1 rounded-lg bg-slate-800 text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-mono">Cámara Rápida desde Bloqueo</span>
                  <div className="w-5" />
                </div>

                <div className="my-auto w-full aspect-square rounded-3xl border border-slate-700 bg-slate-900 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-slate-600 animate-pulse" />
                </div>

                <div className="flex items-center justify-center pb-2">
                  <button
                    onClick={() => {
                      onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Captura rápida guardada en sandbox seguro.' });
                      alert('Foto capturada sin desbloquear el dispositivo.');
                    }}
                    className="w-14 h-14 rounded-full border-4 border-white bg-slate-200 active:scale-95"
                  />
                </div>
              </div>
            )}

            {/* 8. CRASH SCREEN */}
            {screen === 'CRASH_SCREEN' && (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 max-w-xs shadow-2xl">
                  <AlertOctagon className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-white mb-1">
                    La aplicación se ha detenido
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-4">
                    DuressGuard cerró inesperadamente debido a un error de memoria no controlado.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetDevice}
                      className="flex-1 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700"
                    >
                      Cerrar app
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Android Navigation Gesture Pill */}
          <div className="h-5 flex items-center justify-center bg-slate-950">
            <div
              onClick={() => {
                if (screen !== 'LOCKSCREEN' && screen !== 'WIPED_RECOVERY') {
                  setScreen('LOCKSCREEN');
                  onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Gesto Home: Pantalla bloqueada' });
                }
              }}
              className="w-28 h-1 bg-slate-600 hover:bg-slate-400 rounded-full cursor-pointer transition-colors"
              title="Barra de Inicio (Home Gestures)"
            />
          </div>
        </div>
      </div>

      {/* Quick Hardware & Panic Action Bar under Phone */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-[365px]">
        <button
          onClick={togglePowerScreen}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          title="Alterna entre Pantalla Bloqueada y Encendida"
        >
          <Power className="w-3.5 h-3.5 text-amber-400" />
          <span>Botón Power</span>
        </button>

        <button
          onClick={handleVolumeDownPress}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          title="Emula pulsaciones en el botón de volumen"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vol- ({volumePressCount}/5)</span>
        </button>

        <button
          onClick={handlePanicKitTrigger}
          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          title="Emula la recepción del broadcast PanicKit desde una app como Ripple"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>PanicKit</span>
        </button>

        <button
          onClick={handleResetDevice}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          title="Reinicia el estado del teléfono a Lockscreen"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
