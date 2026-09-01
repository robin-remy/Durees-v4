import React, { useState, useEffect, useRef } from 'react';
import { SecurityLogEvent } from '../types/security';
import { Terminal, Trash2, Pause, Play, Download, ShieldCheck } from 'lucide-react';

interface LiveLogStreamProps {
  logs: SecurityLogEvent[];
  onClearLogs: () => void;
}

export const LiveLogStream: React.FC<LiveLogStreamProps> = ({ logs, onClearLogs }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter(
    (l) => filterLevel === 'ALL' || l.level === filterLevel
  );

  const getLevelColor = (level: SecurityLogEvent['level']) => {
    switch (level) {
      case 'DANGER':
        return 'text-rose-400 bg-rose-950/80 border-rose-800/60';
      case 'SECURITY':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60';
      case 'CRYPTO':
        return 'text-purple-400 bg-purple-950/80 border-purple-800/60';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/80 border-amber-800/60';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const handleExport = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duress-security-logcat-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
      {/* Console Top Bar */}
      <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Security Logcat Stream (Cero Fugas)
          </h4>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">TODOS</option>
            <option value="DANGER">DANGER</option>
            <option value="SECURITY">SECURITY</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
          </select>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title={isPaused ? 'Reanudar logcat' : 'Pausar logcat'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Exportar logs"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Limpiar consola"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Console Body */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-[180px] max-h-[300px] overflow-y-auto p-3 font-mono text-xs text-slate-300 space-y-1.5 bg-slate-950"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-center py-6 text-xs italic">
            Sin eventos de seguridad registrados. Interactúa con el emulador para generar telemetría.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{log.timestamp}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded border font-bold shrink-0 ${getLevelColor(
                  log.level
                )}`}
              >
                {log.level}
              </span>
              <span className="text-slate-400 font-semibold text-[11px] shrink-0">
                [{log.source}]:
              </span>
              <span className="text-slate-200 text-xs break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
