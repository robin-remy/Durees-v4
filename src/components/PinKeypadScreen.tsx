import React, { useState, useEffect } from 'react';
import { Shield, Delete, CornerDownLeft, Lock, PhoneCall, ChevronDown, CheckCircle2 } from 'lucide-react';

interface PinKeypadScreenProps {
  scramble: boolean;
  onPinSubmit: (pin: string) => void;
  isVerifying: boolean;
  errorAnimation: boolean;
  hint?: string;
  onBackToLock?: () => void;
  onEmergencyCall?: () => void;
}

const KEY_LETTERS: Record<string, string> = {
  '1': '',
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
  '0': '+'
};

export const PinKeypadScreen: React.FC<PinKeypadScreenProps> = ({
  scramble,
  onPinSubmit,
  isVerifying,
  errorAnimation,
  hint,
  onBackToLock,
  onEmergencyCall
}) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [keypadLayout, setKeypadLayout] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

  // Scramble keys on mount or when scramble prop is enabled
  useEffect(() => {
    if (scramble) {
      const shuffled = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].sort(() => Math.random() - 0.5);
      setKeypadLayout(shuffled);
    } else {
      setKeypadLayout(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    }
    setDigits([]);
  }, [scramble]);

  const handleDigit = (d: string) => {
    if (digits.length < 8 && !isVerifying) {
      const newDigits = [...digits, d];
      setDigits(newDigits);
      if (newDigits.length === 4) {
        // Instant check after 4 digits
        setTimeout(() => {
          onPinSubmit(newDigits.join(''));
        }, 120);
      }
    }
  };

  const handleDelete = () => {
    if (!isVerifying && digits.length > 0) {
      setDigits(digits.slice(0, -1));
    }
  };

  const handleManualSubmit = () => {
    if (digits.length >= 4 && !isVerifying) {
      onPinSubmit(digits.join(''));
    }
  };

  // Clear on error animation
  useEffect(() => {
    if (errorAnimation) {
      const timer = setTimeout(() => {
        setDigits([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [errorAnimation]);

  const gridKeys = keypadLayout.slice(0, 9);
  const lastKey = keypadLayout[9];

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 select-none text-slate-100 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Top Header */}
      <div className="flex flex-col items-center pt-2 text-center w-full">
        {onBackToLock && (
          <button
            onClick={onBackToLock}
            className="self-start -mt-1 mb-1 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Volver a la pantalla de bloqueo"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}

        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-inner">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold tracking-tight text-white">Introduce el PIN</h2>
        <p className="text-[11px] text-slate-400">
          {scramble ? 'Teclado aleatorio activo (Anti-espionaje)' : 'Smartphone Lock Screen'}
        </p>

        {hint && (
          <div className="mt-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{hint}</span>
          </div>
        )}
      </div>

      {/* PIN Dots Display */}
      <div className={`my-2 flex items-center justify-center gap-3.5 transition-transform ${errorAnimation ? 'animate-bounce' : ''}`}>
        {[0, 1, 2, 3].map((idx) => {
          const filled = idx < digits.length;
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                filled
                  ? 'bg-emerald-400 scale-125 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                  : 'bg-slate-700/60 border border-slate-600'
              }`}
            />
          );
        })}
      </div>

      {/* Android System Keypad Grid */}
      <div className="w-full max-w-[260px] flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-3">
          {gridKeys.map((digit) => (
            <button
              key={digit}
              id={`pin-btn-${digit}`}
              disabled={isVerifying}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-full bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 active:scale-95 active:bg-emerald-500/20 active:border-emerald-500 text-slate-100 transition-all flex flex-col items-center justify-center shadow-md group"
            >
              <span className="text-xl font-medium leading-none">{digit}</span>
              {!scramble && KEY_LETTERS[digit] && (
                <span className="text-[8px] font-mono text-slate-400 tracking-wider mt-0.5 group-hover:text-slate-200">
                  {KEY_LETTERS[digit]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Emergency Call Button */}
          <button
            onClick={onEmergencyCall}
            disabled={isVerifying}
            className="h-14 rounded-full bg-slate-900/60 border border-slate-800 hover:bg-slate-800 active:scale-95 text-rose-400 disabled:opacity-30 transition-all flex flex-col items-center justify-center"
            title="Llamada de Emergencia"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[8px] font-semibold tracking-tight mt-0.5">SOS</span>
          </button>

          {/* Key 0 / Last Key */}
          <button
            id={`pin-btn-${lastKey}`}
            disabled={isVerifying}
            onClick={() => handleDigit(lastKey)}
            className="h-14 rounded-full bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 active:scale-95 active:bg-emerald-500/20 active:border-emerald-500 text-slate-100 transition-all flex flex-col items-center justify-center shadow-md group"
          >
            <span className="text-xl font-medium leading-none">{lastKey}</span>
            {!scramble && KEY_LETTERS[lastKey] && (
              <span className="text-[8px] font-mono text-slate-400 tracking-wider mt-0.5 group-hover:text-slate-200">
                {KEY_LETTERS[lastKey]}
              </span>
            )}
          </button>

          {/* Delete Button */}
          <button
            id="pin-delete-btn"
            disabled={isVerifying || digits.length === 0}
            onClick={handleDelete}
            className="h-14 rounded-full bg-slate-900/60 border border-slate-800 hover:bg-slate-800 active:scale-95 text-slate-300 disabled:opacity-20 transition-all flex flex-col items-center justify-center"
            title="Borrar dígito"
          >
            <Delete className="w-5 h-5" />
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">BORRAR</span>
          </button>
        </div>
      </div>

      {/* Manual Submit Button if user has > 4 digits */}
      {digits.length > 4 && (
        <button
          onClick={handleManualSubmit}
          className="w-full max-w-[260px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
        >
          <CornerDownLeft className="w-4 h-4" /> Desbloquear
        </button>
      )}

      {/* Bottom Status / Privacy Note */}
      <div className="pt-2 pb-1 text-center">
        <span className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" />
          Keyguard FBE • StrongBox HSM
        </span>
      </div>
    </div>
  );
};
