import React, { useState } from 'react';
import { THREAT_ANALYSIS_DATA, OS_LEVEL_COMPARISON } from '../data/threatModel';
import { Shield, ShieldAlert, Cpu, Terminal, CheckCircle, XCircle, AlertTriangle, Layers, Lock } from 'lucide-react';

export const ArchitectureMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'threats' | 'adb'>('matrix');

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'matrix'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Comparativa de Privilegios
        </button>
        <button
          onClick={() => setActiveTab('threats')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'threats'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Matriz de Amenazas (Threat Model)
        </button>
        <button
          onClick={() => setActiveTab('adb')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'adb'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Guía ADB Device Owner
        </button>
      </div>

      {/* TAB 1: PRIVILEGE COMPARISON */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GrapheneOS Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800/60 font-bold">
                  {OS_LEVEL_COMPARISON.grapheneOs.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {OS_LEVEL_COMPARISON.grapheneOs.title}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 mb-4">
                {OS_LEVEL_COMPARISON.grapheneOs.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-slate-300">Limitación:</strong> Requiere ROM personalizada flasheada en Google Pixel.
            </div>
          </div>

          {/* Device Owner Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col justify-between shadow-lg shadow-emerald-950/20">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                  {OS_LEVEL_COMPARISON.deviceOwner.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {OS_LEVEL_COMPARISON.deviceOwner.title}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 mb-4">
                {OS_LEVEL_COMPARISON.deviceOwner.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-emerald-300">Ideal Stock:</strong> Funciona en cualquier teléfono comercial sin Root mediante 1 comando ADB.
            </div>
          </div>

          {/* User Space App Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60 font-bold">
                  {OS_LEVEL_COMPARISON.userApp.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                {OS_LEVEL_COMPARISON.userApp.title}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 mb-4">
                {OS_LEVEL_COMPARISON.userApp.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-slate-300">Portabilidad:</strong> Se instala como APK estándar, 100% offline y seguro.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THREAT MODEL TABLE */}
      {activeTab === 'threats' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 pr-4">Vector de Amenaza</th>
                <th className="pb-3 pr-4">Adversario / Escenario</th>
                <th className="pb-3 pr-4">App Normal</th>
                <th className="pb-3 pr-4">Device Owner</th>
                <th className="pb-3 pr-4">GrapheneOS</th>
                <th className="pb-3">Mitigación Técnica en DuressGuard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {THREAT_ANALYSIS_DATA.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-4 font-bold text-white">{t.threat}</td>
                  <td className="py-3 pr-4 text-slate-400">{t.adversary}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        t.userAppCapability === 'EFECTIVA'
                          ? 'bg-emerald-950 text-emerald-400'
                          : t.userAppCapability === 'PARCIAL'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {t.userAppCapability}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400">
                      {t.deviceOwnerCapability}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-950 text-purple-400">
                      {t.grapheneOsCapability}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 text-[11px] leading-relaxed">
                    {t.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ADB PROVISIONING */}
      {activeTab === 'adb' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              Aprovisionamiento de DuressGuard como Device Owner (Sin Root)
            </h4>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Para conceder a la aplicación la capacidad de ejecutar <code className="text-emerald-400 font-mono">DevicePolicyManager.wipeData()</code> silencioso y <code className="text-emerald-400 font-mono">lockNow()</code> sin confirmación del usuario, se debe aprovisionar como Propietario del Dispositivo (Device Owner) mediante depuración USB (ADB) o durante el asistente de configuración inicial de Android.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 space-y-2 mb-4">
            <div># 1. Conectar teléfono con Depuración USB habilitada</div>
            <div className="text-slate-100 font-bold">adb devices</div>
            <div className="pt-2"># 2. Configurar componente Device Admin como Owner</div>
            <div className="text-slate-100 font-bold">
              adb shell dpm set-device-owner com.duressguard/.receiver.DuressDeviceAdminReceiver
            </div>
            <div className="pt-2"># 3. Verificar estado</div>
            <div className="text-slate-100 font-bold">adb shell dumpsys device_policy</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Nota de Seguridad Android:</strong> Para configurar Device Owner mediante ADB, el dispositivo no debe tener cuentas de Google u otros usuarios configurados previamente (o debe realizarse inmediatamente tras un reinicio de fábrica).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
