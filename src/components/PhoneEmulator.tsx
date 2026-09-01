import React, { useState, useEffect, useRef } from 'react';
import {
  SecurityConfig,
  VaultItem,
  SecurityLogEvent
} from '../types/security';
import { PinKeypadScreen } from './PinKeypadScreen';
import { VaultView } from './VaultView';
import { REAL_VAULT_ITEMS, DECOY_VAULT_ITEMS } from '../data/vaultData';
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
  Skull
} from 'lucide-react';

interface PhoneEmulatorProps {
  config: SecurityConfig;
  onAddLog: (event: Omit<SecurityLogEvent, 'id' | 'timestamp'>) => void;
  onMemoryStateChange?: (state: 'NORMAL' | 'REAL_ACTIVE' | 'DECOY_ACTIVE' | 'ZEROIZED' | 'WIPED') => void;
}

export type PhoneScreen = 'LOCKSCREEN' | 'KEYPAD' | 'REAL_VAULT' | 'DECOY_VAULT' | 'WIPED_RECOVERY' | 'CRASH_SCREEN';

export const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  config,
  onAddLog,
  onMemoryStateChange
}) => {
  const [screen, setScreen] = useState<PhoneScreen>('LOCKSCREEN');
  const [currentTime, setCurrentTime] = useState('12:00');
  const [currentDate, setCurrentDate] = useState('Martes, 1 de Septiembre');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  // Volume key cadence detection
  const [volumePressCount, setVolumePressCount] = useState(0);
  const lastVolumePressRef = useRef<number>(0);
  const volumeResetTimerRef = useRef<any>(null);

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
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
          message: `PIN Real autenticado con éxito (${elapsed}ms). Derivando MasterKey_Real y abriendo Bóveda Cifrada.`
        });
        setScreen('REAL_VAULT');
        onMemoryStateChange?.('REAL_ACTIVE');
        setIsVerifying(false);
      } else if (pin === config.duressPin) {
        onAddLog({
          level: 'DANGER',
          source: 'CryptoManager',
          message: `¡ALERTA DE COACCIÓN! PIN de Coacción ingresado (${elapsed}ms). Ejecutando acción configurada: [${config.duressAction}]`
        });

        executeDuressAction();
      } else {
        onAddLog({
          level: 'WARN',
          source: 'CryptoManager',
          message: `Fallo de autenticación: PIN inválido (${elapsed}ms). Zeroization inmediata de buffers temporales.`
        });
        setErrorAnimation(true);
        setTimeout(() => setErrorAnimation(false), 500);
        setIsVerifying(false);
      }
    }, 350);
  };

  const executeDuressAction = () => {
    setIsVerifying(false);

    switch (config.duressAction) {
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

      case 'FULL_DEVICE_WIPE':
        onAddLog({
          level: 'DANGER',
          source: 'DuressAdmin',
          message: 'EMERGENCY: Invocando DevicePolicyManager.wipeData(WIPE_EXTERNAL_STORAGE | WIPE_SILENTLY)...'
        });
        onMemoryStateChange?.('WIPED');
        setScreen('WIPED_RECOVERY');
        break;

      case 'SILENT_SOS_ALERT':
        onAddLog({
          level: 'DANGER',
          source: 'DuressAdmin',
          message: `Despachando SMS de auxilio silencioso a ${config.sosEmergencyNumber} con coordenadas GPS fijadas: [40.4168° N, 3.7038° W]`
        });
        setSosActive(true);
        setScreen('DECOY_VAULT'); // Opens decoy so attacker doesn't notice
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
          message: 'Cadencia de Coacción por Hardware alcanzada. Disparando protocolo de emergencia...'
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

  return (
    <div className="flex flex-col items-center">
      {/* Phone Hardware Shell (Pixel 8 / Titanium Look) */}
      <div className="relative w-[340px] sm:w-[360px] h-[700px] bg-slate-950 rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),0_0_40px_rgba(16,185,129,0.1)] border-[4px] border-slate-800 flex flex-col justify-between select-none">
        
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

        {/* Hardware Button: Power Button */}
        <button
          onClick={() => {
            if (screen === 'LOCKSCREEN') setScreen('KEYPAD');
            else setScreen('LOCKSCREEN');
            onAddLog({ level: 'INFO', source: 'Keyguard', message: 'Hardware: Botón Power presionado' });
          }}
          className="absolute -right-3.5 top-32 w-2 h-14 bg-slate-700 hover:bg-slate-600 rounded-r-md active:scale-95 transition-all shadow-md"
          title="Botón Power (Alternar Pantalla)"
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
          <div className="h-9 px-6 flex items-center justify-between text-[11px] font-medium text-slate-300 z-30 pt-1">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-emerald-400 font-mono text-[9px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                <WifiOff className="w-2.5 h-2.5" /> NO-NET
              </span>
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* SOS Sending Pill Alert */}
          {sosActive && (
            <div className="absolute top-11 left-4 right-4 z-50 bg-rose-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Enviando SOS Silencioso (SMS + GPS)...</span>
              </div>
              <span className="font-mono text-[10px]">100%</span>
            </div>
          )}

          {/* Screen Switcher */}
          <div className="flex-1 relative overflow-hidden">
            {screen === 'LOCKSCREEN' && (
              <div
                onClick={() => setScreen('KEYPAD')}
                className="w-full h-full flex flex-col items-center justify-between p-6 cursor-pointer bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
              >
                <div className="mt-8 flex flex-col items-center text-center">
                  <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                    {currentTime}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">{currentDate}</span>
                </div>

                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Toca para desbloquear bóveda
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
                      PIN Real: {config.realPin}
                    </span>
                    <span className="text-[10px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-900/40 font-semibold">
                      PIN Coacción (Auto Factory Reset): {config.duressPin}
                    </span>
                  </div>
                </div>

                <div className="w-24 h-1 bg-slate-700 rounded-full mb-1"></div>
              </div>
            )}

            {screen === 'KEYPAD' && (
              <PinKeypadScreen
                scramble={config.scrambleKeypad}
                onPinSubmit={handleUnlockPin}
                isVerifying={isVerifying}
                errorAnimation={errorAnimation}
                hint={
                  config.scrambleKeypad
                    ? 'Teclas aleatorias activas'
                    : `Prueba ${config.realPin} (Real) o ${config.duressPin} (Coacción)`
                }
              />
            )}

            {screen === 'REAL_VAULT' && (
              <VaultView
                isDecoy={false}
                items={REAL_VAULT_ITEMS}
                onLock={() => {
                  setScreen('LOCKSCREEN');
                  onMemoryStateChange?.('ZEROIZED');
                  onAddLog({
                    level: 'INFO',
                    source: 'CryptoManager',
                    message: 'Bóveda Real cerrada. Clave purgada de memoria RAM.'
                  });
                }}
              />
            )}

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

            {screen === 'WIPED_RECOVERY' && (
              <div className="w-full h-full bg-black text-slate-100 flex flex-col items-center justify-center p-6 text-center font-mono select-none">
                <Skull className="w-12 h-12 text-rose-500 mb-4 animate-pulse" />
                <h3 className="text-sm font-bold text-rose-400 tracking-wider">
                  ANDROID RECOVERY
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  DevicePolicyManager.wipeData() ejecutado.
                  <br />
                  Formateando particiones /data y /userdata...
                  <br />
                  Claves de cifrado en hardware purgadas.
                </p>
                <div className="w-full bg-slate-900 h-2 rounded-full mt-6 overflow-hidden border border-slate-800">
                  <div className="bg-rose-500 h-full w-3/4 animate-pulse"></div>
                </div>
                <button
                  onClick={handleResetDevice}
                  className="mt-8 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-200 border border-slate-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reiniciar Teléfono
                </button>
              </div>
            )}

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

          {/* Android Navigation Bar Pill */}
          <div className="h-5 flex items-center justify-center bg-slate-950">
            <div
              onClick={() => {
                if (screen !== 'LOCKSCREEN' && screen !== 'WIPED_RECOVERY') {
                  setScreen('LOCKSCREEN');
                }
              }}
              className="w-28 h-1 bg-slate-600 hover:bg-slate-400 rounded-full cursor-pointer transition-colors"
              title="Barra de Inicio (Home Gestures)"
            />
          </div>
        </div>
      </div>

      {/* Quick Trigger Action Bar under Phone */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-[360px]">
        <button
          onClick={handlePanicKitTrigger}
          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
          title="Emula la recepción del broadcast PanicKit desde una app como Ripple"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>PanicKit Intent</span>
        </button>

        <button
          onClick={handleVolumeDownPress}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
          title="Emula pulsaciones en el botón de volumen"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tap Vol- ({volumePressCount}/5)</span>
        </button>

        <button
          onClick={handleResetDevice}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
          title="Reinicia el estado del teléfono a Lockscreen"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Lock</span>
        </button>
      </div>
    </div>
  );
};
