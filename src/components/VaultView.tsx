import React, { useState } from 'react';
import { VaultItem } from '../types/security';
import { Shield, FileText, Key, User, Lock, Plus, LogOut, Check, Copy, AlertTriangle } from 'lucide-react';

interface VaultViewProps {
  isDecoy: boolean;
  items: VaultItem[];
  onLock: () => void;
  onItemClick?: (item: VaultItem) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  isDecoy,
  items,
  onLock,
  onItemClick
}) => {
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.content.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (cat: VaultItem['category']) => {
    switch (cat) {
      case 'CREDENTIAL':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'CONTACT':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Vault Top Bar */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDecoy
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-none text-white">
              {isDecoy ? 'Mis Notas Personales' : 'Bóveda Cifrada'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {isDecoy ? 'Almacenamiento Local (Señuelo)' : 'SQLCipher • AES-GCM-256'}
            </span>
          </div>
        </div>

        <button
          onClick={onLock}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
          title="Bloquear y destruir clave en RAM"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar</span>
        </button>
      </div>

      {/* Main Content List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Search input */}
        <input
          type="text"
          placeholder="Buscar elementos..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/60"
        />

        {/* Item List */}
        <div className="space-y-2 pt-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-700/50">
                    {getIcon(item.category)}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isDecoy
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 pl-8 font-mono">
                {item.content}
              </p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/40 pl-8 text-[10px] text-slate-400">
                <span>{item.timestamp}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.encrypted ? 'Encrypted' : 'Plain'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedItem && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800">
                {getIcon(selectedItem.category)}
              </div>
              <h4 className="text-xs font-bold text-white max-w-[180px] truncate">
                {selectedItem.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cerrar
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {selectedItem.content}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleCopy(selectedItem.content, selectedItem.id)}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedId === selectedItem.id ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado (Auto-limpieza 10s)
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar al Portapapeles
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
