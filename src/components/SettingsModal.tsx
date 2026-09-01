import React, { useState } from 'react';
import { SecurityConfig, DuressActionType } from '../types/security';
import { Settings, Shield, Lock, AlertTriangle, Smartphone, PhoneCall, Check, X } from 'lucide-react';

interface SettingsModalProps {
  config: SecurityConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: SecurityConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<SecurityConfig>({ ...config });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Configuración de Seguridad & Coacción</h3>
              <p className="text-xs text-slate-400">Personaliza PINs, acciones de emergencia y disparadores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-200">
          {/* PIN Setup */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Códigos de Acceso (4 a 8 dígitos)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                  PIN Real (Acceso Legítimo)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={formData.realPin}
                  onChange={(e) => setFormData({ ...formData, realPin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-rose-400 text-[11px] mb-1 font-medium">
                  PIN de Coacción (Duress PIN)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={formData.duressPin}
                  onChange={(e) => setFormData({ ...formData, duressPin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-900/60 text-rose-200 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Action on Duress */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Acción al introducir el Duress PIN
            </h4>

            <div className="space-y-2">
              {[
                {
                  id: 'DECOY_VAULT',
                  title: 'Bóveda Señuelo (Negación Plausible)',
                  desc: 'Abre una interfaz idéntica con notas y datos inocuos, purgando la clave real de RAM.'
                },
                {
                  id: 'SILENT_APP_WIPE',
                  title: 'Borrado Seguro Local (App Wipe)',
                  desc: 'Elimina las claves en Android Keystore y sobreescribe los archivos locales de la app.'
                },
                {
                  id: 'FULL_DEVICE_WIPE',
                  title: 'Factory Reset Completo (Device Admin / Owner)',
                  desc: 'Invoca DevicePolicyManager.wipeData() para formatear todo el teléfono sin confirmación.'
                },
                {
                  id: 'SILENT_SOS_ALERT',
                  title: 'Alerta SOS Silenciosa + Señuelo',
                  desc: 'Envía SMS con coordenadas GPS a un contacto y abre la Bóveda Señuelo sin levantar sospechas.'
                },
                {
                  id: 'LOCK_IMMEDIATE',
                  title: 'Bloqueo Forzado Inmediato (lockNow)',
                  desc: 'Apaga y bloquea la pantalla de inmediato mediante Device Policy Manager.'
                }
              ].map((act) => (
                <label
                  key={act.id}
                  onClick={() => setFormData({ ...formData, duressAction: act.id as DuressActionType })}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    formData.duressAction === act.id
                      ? 'bg-slate-900 border-emerald-500/50 text-white'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/80'
                  }`}
                >
                  <input
                    type="radio"
                    name="duressAction"
                    checked={formData.duressAction === act.id}
                    onChange={() => {}}
                    className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{act.title}</div>
                    <div className="text-[11px] text-slate-400">{act.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              Opciones de Disparador & Hardening
            </h4>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-xs text-slate-200">Teclado Scramble Anti-Espionaje</span>
                  <p className="text-[11px] text-slate-400">Reorganiza los dígitos aleatoriamente para evitar shoulder-surfing.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.scrambleKeypad}
                  onChange={(e) => setFormData({ ...formData, scrambleKeypad: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-xs text-slate-200">Disparador por Botón de Volumen (Hardware)</span>
                  <p className="text-[11px] text-slate-400">5 pulsaciones rápidas de Volumen - disparan el protocolo de coacción.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableHardwareTriggers}
                  onChange={(e) => setFormData({ ...formData, enableHardwareTriggers: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500"
                />
              </label>

              {formData.duressAction === 'SILENT_SOS_ALERT' && (
                <div className="pt-2">
                  <label className="block text-slate-300 text-[11px] mb-1 font-medium">
                    Número de Teléfono para SMS SOS de Emergencia
                  </label>
                  <input
                    type="text"
                    value={formData.sosEmergencyNumber}
                    onChange={(e) => setFormData({ ...formData, sosEmergencyNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
