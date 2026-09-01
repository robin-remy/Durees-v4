import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Flashlight,
  Camera,
  PhoneCall,
  Bell,
  ChevronUp,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  Wifi,
  WifiOff,
  Battery
} from 'lucide-react';
import { SecurityConfig } from '../types/security';

interface AndroidLockScreenProps {
  config: SecurityConfig;
  currentTime: string;
  currentDate: string;
  onSwipeUp: () => void;
  onEmergencyCall: () => void;
  onFlashlightToggle?: () => void;
  onCameraLaunch?: () => void;
}

export const AndroidLockScreen: React.FC<AndroidLockScreenProps> = ({
  config,
  currentTime,
  currentDate,
  onSwipeUp,
  onEmergencyCall,
  onFlashlightToggle,
  onCameraLaunch
}) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setTouchStartY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartY === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = touchStartY - clientY;
    if (diff > 0) {
      setDragOffset(Math.min(diff, 120));
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 40) {
      onSwipeUp();
    }
    setTouchStartY(null);
    setDragOffset(0);
  };

  const toggleTorch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlashlightOn(!flashlightOn);
    onFlashlightToggle?.();
  };

  const openCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCameraLaunch?.();
  };

  const openEmergency = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEmergencyCall();
  };

  return (
    <div
      onClick={onSwipeUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      className="relative w-full h-full flex flex-col justify-between p-5 select-none cursor-pointer overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 transition-transform duration-200"
      style={{
        transform: dragOffset > 0 ? `translateY(-${dragOffset}px)` : 'none'
      }}
    >
      {/* Dynamic Ambient Glow / Torch Reflection */}
      {flashlightOn && (
        <div className="absolute top-0 left-0 right-0 h-48 bg-radial from-amber-400/20 via-amber-500/5 to-transparent pointer-events-none animate-pulse" />
      )}

      {/* Top Header / Lock Icon & Security Badge */}
      <div className="flex flex-col items-center pt-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[10px] text-emerald-400 font-semibold shadow-sm">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>DuressGuard Lockscreen • Permisos Activos</span>
        </div>

        {/* Large Android Clock (Material You styling) */}
        <div className="mt-6 flex flex-col items-center text-center">
          <span className="text-5xl sm:text-6xl font-extralight tracking-tight text-slate-100 font-mono drop-shadow-md">
            {currentTime}
          </span>
          <span className="text-xs text-slate-300 font-medium mt-1 drop-shadow">
            {currentDate}
          </span>
        </div>
      </div>

      {/* Center: Notifications & Lock Indicator */}
      <div className="flex flex-col items-center gap-3 z-10 w-full max-w-[280px] mx-auto">
        {/* Simulated System Notification 1 */}
        <div className="w-full p-2.5 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-start gap-2.5 text-left">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white truncate">DuressGuard OS</span>
              <span className="text-[9px] text-slate-400 font-mono">Ahora</span>
            </div>
            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
              Protección de bloqueo activa: 2 códigos armados
            </p>
          </div>
        </div>

        {/* Simulated Private Chat Notification 2 */}
        <div className="w-full p-2.5 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-md shadow-lg flex items-start gap-2.5 text-left">
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white truncate">Mensajes Seguros</span>
              <span className="text-[9px] text-slate-400 font-mono">1m</span>
            </div>
            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
              🔒 1 nuevo mensaje confidencial cifrado
            </p>
          </div>
        </div>

        {/* Lock Screen Code Reference Pills */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 font-medium">
              PIN Desbloqueo: <strong>{config.realPin}</strong> (Apps & Datos)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60 font-semibold">
              PIN Borrado: <strong>{config.duressPin}</strong> (Auto Wipe)
            </span>
          </div>
        </div>

        {/* Pulsing Lock Icon */}
        <div className="mt-1 flex flex-col items-center gap-1.5 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
            <span>Desliza hacia arriba o toca para ingresar PIN</span>
          </div>
        </div>
      </div>

      {/* Bottom Row Shortcuts (Torch, Emergency Call, Camera) */}
      <div className="flex items-center justify-between w-full pt-2 z-10">
        {/* Flashlight Shortcut */}
        <button
          onClick={toggleTorch}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            flashlightOn
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-105'
              : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
          title="Linterna"
        >
          <Flashlight className="w-5 h-5" />
        </button>

        {/* Emergency Call Shortcut */}
        <button
          onClick={openEmergency}
          className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-semibold text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Llamada de Emergencia"
        >
          <PhoneCall className="w-3 h-3 text-rose-400" />
          <span>Emergencia</span>
        </button>

        {/* Camera Shortcut */}
        <button
          onClick={openCamera}
          className="w-11 h-11 rounded-full bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 flex items-center justify-center transition-all"
          title="Cámara"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Home Indicator Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-500/80 rounded-full" />
    </div>
  );
};
