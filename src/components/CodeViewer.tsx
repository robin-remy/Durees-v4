import React, { useState } from 'react';
import { KotlinFile } from '../data/kotlinCodebase';
import { FileCode, Copy, Check, Download, Layers, ShieldCheck, Terminal, FileText } from 'lucide-react';

interface CodeViewerProps {
  files: KotlinFile[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFiles = files.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  const currentFile = files[selectedFileIndex] || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const fullBundle = files
      .map(
        (f) =>
          `// =============================================================================\n// FILE: ${f.path}\n// =============================================================================\n\n${f.code}\n\n`
      )
      .join('\n');

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DuressGuard-Kotlin-Architecture-Bundle.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (cat: KotlinFile['category']) => {
    switch (cat) {
      case 'crypto':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'admin':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      case 'receiver':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      case 'domain':
        return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
      case 'ui':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header / Actions */}
      <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white leading-none">
              Arquitectura Kotlin & Código Fuente de Producción
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Android Studio Ready • Clean Architecture • Jetpack Compose
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Archivo</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadAll}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Bundle</span>
          </button>
        </div>
      </div>

      {/* Main Split: File Tree on left, Code on right */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[480px] overflow-hidden">
        {/* Left Sidebar: File list */}
        <div className="w-full md:w-72 bg-slate-950/70 border-r border-slate-800 flex flex-col">
          {/* Filter Pills */}
          <div className="p-2.5 border-b border-slate-800/80 flex items-center gap-1 overflow-x-auto text-[10px]">
            {['all', 'crypto', 'admin', 'receiver', 'domain', 'ui', 'config'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-1 rounded-lg capitalize font-mono transition-colors whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map((file) => {
              const originalIndex = files.findIndex((f) => f.path === file.path);
              const isSelected = originalIndex === selectedFileIndex;

              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFileIndex(originalIndex)}
                  className={`p-2 rounded-xl text-xs cursor-pointer transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/40 text-white shadow-sm'
                      : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-200 truncate">{file.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono border uppercase ${getCategoryBadge(
                        file.category
                      )}`}
                    >
                      {file.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono truncate">{file.path}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code Content Pane */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* File description header */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-emerald-400 font-medium">{currentFile.path}</span>
            <span className="text-[11px] text-slate-400">{currentFile.description}</span>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 select-text">
            <pre className="text-slate-200">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
