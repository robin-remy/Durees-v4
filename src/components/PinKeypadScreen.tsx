import React, { useState, useEffect } from 'react';
import { Shield, Delete, CornerDownLeft, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface PinKeypadScreenProps {
  scramble: boolean;
  onPinSubmit: (pin: string) => void;
  isVerifying: boolean;
  errorAnimation: boolean;
  hint?: string;
  stealthMode?: boolean;
}

export const PinKeypadScreen: React.FC<PinKeypadScreenProps> = ({
  scramble,
  onPinSubmit,
  isVerifying,
  errorAnimation,
  hint,
  stealthMode = false
}) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [keypadLayout, setKeypadLayout] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  const [showNumbers, setShowNumbers] = useState(false);

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
        // Auto-submit after 4 digits for fast testing, or user can press submit
        setTimeout(() => {
          onPinSubmit(newDigits.join(''));
        }, 150);
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

  // Clear on error
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
    <div className="flex flex-col h-full items-center justify-between p-4 select-none text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col items-center pt-2 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-inner shadow-emerald-500/5">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white">Bóveda Cifrada</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {scramble ? 'Teclado Scramble Anti-Espionaje' : 'Introduce tu código de acceso'}
        </p>

        {hint && (
          <div className="mt-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {hint}
          </div>
        )}
      </div>

      {/* PIN Dots Display */}
      <div className={`my-4 flex items-center justify-center gap-3 transition-transform ${errorAnimation ? 'animate-bounce' : ''}`}>
        {[0, 1, 2, 3].map((idx) => {
          const filled = idx < digits.length;
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                filled
                  ? 'bg-emerald-400 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : 'bg-slate-700/60 border border-slate-600'
              }`}
            />
          );
        })}
      </div>

      {/* Scrambled Matrix 3x4 */}
      <div className="w-full max-w-[240px] flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2.5">
          {gridKeys.map((digit) => (
            <button
              key={digit}
              id={`pin-btn-${digit}`}
              disabled={isVerifying}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-800/90 border border-slate-700/70 hover:bg-slate-700/90 active:scale-95 active:bg-emerald-500/20 active:border-emerald-500/40 text-xl font-semibold text-slate-100 transition-all flex items-center justify-center shadow-sm"
            >
              {digit}
            </button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            id="pin-delete-btn"
            disabled={isVerifying || digits.length === 0}
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/60 active:scale-95 text-slate-300 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>

          <button
            id={`pin-btn-${lastKey}`}
            disabled={isVerifying}
            onClick={() => handleDigit(lastKey)}
            className="h-14 rounded-2xl bg-slate-800/90 border border-slate-700/70 hover:bg-slate-700/90 active:scale-95 active:bg-emerald-500/20 active:border-emerald-500/40 text-xl font-semibold text-slate-100 transition-all flex items-center justify-center shadow-sm"
          >
            {lastKey}
          </button>

          <button
            id="pin-submit-btn"
            disabled={isVerifying || digits.length < 4}
            onClick={handleManualSubmit}
            className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/40 disabled:text-slate-600 disabled:border-slate-700/30 text-white font-bold transition-all flex items-center justify-center active:scale-95 shadow-md shadow-emerald-950/40"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Status / Privacy Note */}
      <div className="pt-2 pb-1 text-center">
        <span className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-emerald-400" />
          Zeroization activa • Argon2id KDF
        </span>
      </div>
    </div>
  );
};
