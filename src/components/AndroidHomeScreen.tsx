import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Phone,
  MessageSquare,
  Image,
  FileText,
  Settings,
  Compass,
  Camera,
  Users,
  Search,
  CloudSun,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Power,
  RotateCcw,
  Plus,
  Send,
  User,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { SecurityConfig, VaultItem } from '../types/security';
import { VaultView } from './VaultView';
import { REAL_VAULT_ITEMS } from '../data/vaultData';

interface AndroidHomeScreenProps {
  config: SecurityConfig;
  onLockScreen: () => void;
  onOpenSettings: () => void;
  onAddLog: (event: any) => void;
}

type ActiveApp = 'NONE' | 'VAULT' | 'GALLERY' | 'MESSAGES' | 'PHONE' | 'SETTINGS_APP' | 'CAMERA' | 'BROWSER';

export const AndroidHomeScreen: React.FC<AndroidHomeScreenProps> = ({
  config,
  onLockScreen,
  onOpenSettings,
  onAddLog
}) => {
  const [activeApp, setActiveApp] = useState<ActiveApp>('NONE');
  const [phoneDial, setPhoneDial] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Contacto Seguro (Signal)', text: 'Clave pública rotada con éxito. El canal es 100% seguro.', time: '11:45', unread: false },
    { id: 2, sender: 'Defensa Jurídica', text: 'Documento notarial archivado en bóveda fría.', time: '09:30', unread: true }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, title: 'Documento Notarial Cifrado', category: 'Legal', color: 'from-emerald-800 to-slate-900', preview: '📄 Doc #4412-B' },
    { id: 2, title: 'Backup de Claves Físicas', category: 'Cripto', color: 'from-amber-800 to-slate-900', preview: '🔑 Hardware Key #1' },
    { id: 3, title: 'Contrato Social', category: 'Privado', color: 'from-blue-800 to-slate-900', preview: '📜 Acta Fundacional' },
    { id: 4, title: 'Plano de Ubicación Segura', category: 'Mapas', color: 'from-purple-800 to-slate-900', preview: '🗺️ Coordenadas Almacén' }
  ]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<any | null>(null);

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Tú (Zero-Trace)',
        text: newMessageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: false
      }
    ]);
    setNewMessageText('');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Dynamic Wallpaper Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 pointer-events-none" />

      {/* When NO APP is active: Standard Android Home Desktop Launcher */}
      {activeApp === 'NONE' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 overflow-y-auto">
          {/* Top Widget: Clock & Search */}
          <div className="pt-2 flex flex-col gap-3">
            {/* Weather & Date Pill */}
            <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">22°C Soleado</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Martes, 1 Sep</span>
            </div>

            {/* Google Search Bar Mock */}
            <div className="flex items-center justify-between px-3 py-2 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-md">
              <div className="flex items-center gap-2 text-slate-400">
                <Search className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300">Buscar apps y archivos...</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                G
              </div>
            </div>
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-4 gap-y-5 gap-x-2 my-auto py-4">
            {/* App 1: Bóveda Secreta */}
            <button
              onClick={() => setActiveApp('VAULT')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Bóveda
              </span>
            </button>

            {/* App 2: Galería Segura */}
            <button
              onClick={() => setActiveApp('GALLERY')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
                <Image className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Galería
              </span>
            </button>

            {/* App 3: Mensajes Seguros */}
            <button
              onClick={() => setActiveApp('MESSAGES')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform relative">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Mensajes
              </span>
            </button>

            {/* App 4: Teléfono */}
            <button
              onClick={() => setActiveApp('PHONE')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Teléfono
              </span>
            </button>

            {/* App 5: Ajustes & Permisos */}
            <button
              onClick={() => setActiveApp('SETTINGS_APP')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-emerald-400 border border-slate-600 shadow-lg group-hover:scale-105 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Ajustes
              </span>
            </button>

            {/* App 6: Cámara */}
            <button
              onClick={() => setActiveApp('CAMERA')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-900 flex items-center justify-center text-white shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Cámara
              </span>
            </button>

            {/* App 7: Navegador Seguro */}
            <button
              onClick={() => setActiveApp('BROWSER')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center text-white shadow-lg shadow-orange-900/40 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 group-hover:text-white truncate max-w-[64px]">
                Navegador
              </span>
            </button>

            {/* App 8: Bloquear Dispositivo */}
            <button
              onClick={onLockScreen}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-rose-400 border border-rose-900/40 shadow-lg group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-rose-300 group-hover:text-white truncate max-w-[64px]">
                Bloquear
              </span>
            </button>
          </div>

          {/* Bottom Dock */}
          <div className="mt-auto mb-1 p-2 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-center justify-around shadow-2xl">
            <button
              onClick={() => setActiveApp('PHONE')}
              className="w-11 h-11 rounded-2xl bg-teal-600/90 flex items-center justify-center text-white shadow-md active:scale-95"
              title="Teléfono"
            >
              <Phone className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveApp('MESSAGES')}
              className="w-11 h-11 rounded-2xl bg-blue-600/90 flex items-center justify-center text-white shadow-md active:scale-95"
              title="Mensajes"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveApp('VAULT')}
              className="w-11 h-11 rounded-2xl bg-emerald-600/90 flex items-center justify-center text-white shadow-md active:scale-95"
              title="Bóveda Secreta"
            >
              <Shield className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveApp('SETTINGS_APP')}
              className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700 shadow-md active:scale-95"
              title="Ajustes y Permisos"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* APP: VAULT VIEW */}
      {activeApp === 'VAULT' && (
        <div className="relative z-10 w-full h-full flex flex-col">
          <VaultView
            isDecoy={false}
            items={REAL_VAULT_ITEMS}
            onLock={() => setActiveApp('NONE')}
          />
        </div>
      )}

      {/* APP: GALLERY */}
      {activeApp === 'GALLERY' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-slate-900">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveApp('NONE')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xs font-bold text-white">Galería Segura Cifrada</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              AES-256
            </span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 gap-2.5">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedGalleryItem(img)}
                className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800 flex flex-col cursor-pointer group hover:border-emerald-500/50 transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${img.color} flex items-center justify-center text-slate-200 font-mono text-xs text-center p-2 group-hover:scale-105 transition-transform`}>
                  {img.preview}
                </div>
                <div className="p-2 bg-slate-900">
                  <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                    {img.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{img.category}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedGalleryItem && (
            <div className="absolute inset-0 bg-black/90 z-30 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-bold">{selectedGalleryItem.title}</span>
                <button
                  onClick={() => setSelectedGalleryItem(null)}
                  className="px-2 py-1 bg-slate-800 rounded text-xs"
                >
                  Cerrar
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700 text-center font-mono text-emerald-400 text-sm">
                  {selectedGalleryItem.preview}
                  <p className="text-[10px] text-slate-400 mt-3 font-sans">
                    Archivo desencriptado en memoria volátil (RAM Segura).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* APP: MESSAGES (SIGNAL / ENCRYPTED CHAT) */}
      {activeApp === 'MESSAGES' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-slate-900">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveApp('NONE')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-xs font-bold text-white">Mensajería Cifrada E2EE</h3>
                <span className="text-[9px] text-emerald-400 font-mono">Canal Zero-Trace</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-2xl max-w-[85%] text-xs ${
                  msg.sender.includes('Tú')
                    ? 'ml-auto bg-emerald-700 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold opacity-80">{msg.sender}</span>
                  <span className="text-[9px] opacity-60 font-mono">{msg.time}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje cifrado..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* APP: PHONE / DIALER */}
      {activeApp === 'PHONE' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-slate-900 justify-between p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveApp('NONE')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xs font-bold text-white">Teléfono Cifrado</h3>
            <span className="text-[9px] text-emerald-400 font-mono">VoIP / GSM</span>
          </div>

          {/* Number Display */}
          <div className="my-auto text-center">
            <div className="h-10 text-2xl font-mono font-bold text-white tracking-widest">
              {phoneDial || 'Introduce número'}
            </div>
          </div>

          {/* Dialer Keypad */}
          <div className="w-full max-w-[220px] mx-auto grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
              <button
                key={key}
                onClick={() => setPhoneDial((prev) => prev + key)}
                className="h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-lg font-bold text-slate-100 flex items-center justify-center border border-slate-700"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Call & Delete Actions */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              onClick={() => setPhoneDial((prev) => prev.slice(0, -1))}
              className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (phoneDial) {
                  onAddLog({
                    level: 'INFO',
                    source: 'Keyguard',
                    message: `Llamada saliente cifrada a ${phoneDial}...`
                  });
                  alert(`Iniciando llamada segura a ${phoneDial}...`);
                }
              }}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* APP: SETTINGS & PERMISSIONS MANAGER */}
      {activeApp === 'SETTINGS_APP' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-slate-900 overflow-y-auto">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveApp('NONE')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xs font-bold text-white">Ajustes de DuressGuard OS</h3>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60"
            >
              Configurar PINs
            </button>
          </div>

          <div className="p-3 space-y-3">
            {/* Codes Status Box */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Códigos de Seguridad
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">1. PIN Desbloqueo (Acceso):</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  {config.realPin}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">2. PIN Borrado Fábrica:</span>
                <span className="font-mono text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">
                  {config.duressPin} (Auto Wipe)
                </span>
              </div>
            </div>

            {/* Android Permissions Hub */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-2.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Permisos de Android Otorgados
              </span>

              {/* Perm 1: Device Admin */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <div>
                  <div className="text-[11px] font-bold text-white">Device Policy Manager</div>
                  <div className="text-[9px] text-slate-400">Permite formateo automático wipeData() sin confirmación</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              {/* Perm 2: Overlay */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <div>
                  <div className="text-[11px] font-bold text-white">Superposición de Pantalla</div>
                  <div className="text-[9px] text-slate-400">SYSTEM_ALERT_WINDOW para actuar como Lockscreen</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              {/* Perm 3: Accessibility */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <div>
                  <div className="text-[11px] font-bold text-white">Servicio de Accesibilidad</div>
                  <div className="text-[9px] text-slate-400">Captura de teclas físicas y bloqueo al apagar pantalla</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>

              {/* Perm 4: Default Launcher */}
              <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <div>
                  <div className="text-[11px] font-bold text-white">Lanzador por Defecto (Home)</div>
                  <div className="text-[9px] text-slate-400">Modo Kiosk para control total del escritorio</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </div>
            </div>

            <button
              onClick={onLockScreen}
              className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/60 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Bloquear Pantalla Ahora
            </button>
          </div>
        </div>
      )}

      {/* APP: CAMERA */}
      {activeApp === 'CAMERA' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-black justify-between p-4">
          <div className="flex items-center justify-between text-white">
            <button
              onClick={() => setActiveApp('NONE')}
              className="p-1 rounded-lg bg-slate-800 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono">Cámara Segura (Sin Metadatos EXIF)</span>
            <div className="w-6" />
          </div>

          <div className="my-auto w-full aspect-square rounded-3xl border border-slate-700 bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <div className="text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
              <Camera className="w-8 h-8 text-slate-600 animate-pulse" />
              <span>Visor de Cámara Activo</span>
            </div>
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10">
              <div className="border border-white/10"></div>
              <div className="border border-white/10"></div>
              <div className="border border-white/10"></div>
            </div>
          </div>

          <div className="flex items-center justify-center pb-2">
            <button
              onClick={() => {
                onAddLog({
                  level: 'SECURITY',
                  source: 'CryptoManager',
                  message: 'Captura de foto cifrada al vuelo en almacenamiento seguro.'
                });
                alert('Foto capturada y cifrada directamente en la Bóveda Segura.');
              }}
              className="w-16 h-16 rounded-full border-4 border-white bg-slate-200 active:scale-95 transition-transform"
            />
          </div>
        </div>
      )}

      {/* APP: BROWSER */}
      {activeApp === 'BROWSER' && (
        <div className="relative z-10 w-full h-full flex flex-col bg-slate-900">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950">
            <button
              onClick={() => setActiveApp('NONE')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 border border-slate-700">
              <Lock className="w-3 h-3" />
              <span>https://duckduckgo.com (Tor Routing)</span>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
            <Compass className="w-12 h-12 text-amber-500 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Navegación Privada</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Cero rastreadores, bloqueo de telemetría y enrutamiento por nodos seguros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
