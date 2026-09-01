import React, { useState, useEffect } from 'react';
import { Skull, RefreshCw, AlertOctagon, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface AndroidRecoveryScreenProps {
  onRestartDevice: () => void;
}

export const AndroidRecoveryScreen: React.FC<AndroidRecoveryScreenProps> = ({
  onRestartDevice
}) => {
  const [progress, setProgress] = useState(15);
  const [phase, setPhase] = useState<'WIPING' | 'PURGING_KEYS' | 'REFORMATTING' | 'COMPLETE'>('WIPING');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setPhase('PURGING_KEYS');
    }, 1200);

    const t2 = setTimeout(() => {
      setProgress(85);
      setPhase('REFORMATTING');
    }, 2400);

    const t3 = setTimeout(() => {
      setProgress(100);
      setPhase('COMPLETE');
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black text-slate-100 flex flex-col items-center justify-between p-6 text-center font-mono select-none overflow-hidden">
      {/* Background Matrix/Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

      {/* Top Header */}
      <div className="pt-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/80 text-[10px] text-rose-400 font-bold tracking-wider uppercase animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Android Recovery • Duress Wipe</span>
        </div>
      </div>

      {/* Center: Android Wipe Graphic */}
      <div className="flex flex-col items-center gap-4 z-10 my-auto">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-rose-950/30 border border-rose-800/60 flex items-center justify-center text-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]">
            <Skull className="w-10 h-10 animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
            ⚡
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-rose-400 tracking-wider">
            {phase === 'WIPING' && 'BORRANDO DISPOSITIVO...'}
            {phase === 'PURGING_KEYS' && 'DESTRUYENDO STRONGBOX HSM...'}
            {phase === 'REFORMATTING' && 'SOBREESCRIBIENDO PARTICIONES /DATA...'}
            {phase === 'COMPLETE' && 'RESTABLECIMIENTO COMPLETADO'}
          </h2>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
            {phase === 'WIPING' && 'Ejecutando DevicePolicyManager.wipeData(WIPE_SILENTLY).'}
            {phase === 'PURGING_KEYS' && 'Claves de cifrado FBE purgadas de RAM y chip de seguridad.'}
            {phase === 'REFORMATTING' && 'Sobreescritura 0x00 en almacenamiento flash UFS.'}
            {phase === 'COMPLETE' && 'El teléfono ha quedado en estado de fábrica sin rastros forenses.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono font-semibold">
          {progress}% COMPLETADO
        </span>

        {/* Security Audit Details */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-900 text-left text-[10px] text-slate-400 w-full max-w-[270px] space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>• Android Keystore StrongBox:</span>
            <span className="text-rose-400 font-bold">REVOCADO</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>• Partición /userdata (FBE):</span>
            <span className="text-rose-400 font-bold">FORMATEADA</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>• Memoria Volátil (Zeroization):</span>
            <span className="text-rose-400 font-bold">0x00 PURGADA</span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full pb-3 z-10">
        <button
          onClick={onRestartDevice}
          disabled={phase !== 'COMPLETE'}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-slate-700 text-xs text-slate-100 font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${phase !== 'COMPLETE' ? 'animate-spin' : ''}`} />
          <span>{phase === 'COMPLETE' ? 'Reiniciar Teléfono (Configuración Inicial)' : 'Formateando...'}</span>
        </button>
      </div>
    </div>
  );
};
