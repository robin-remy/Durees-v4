import { ThreatAnalysisItem } from '../types/security';

export const THREAT_ANALYSIS_DATA: ThreatAnalysisItem[] = [
  {
    threat: 'Coacción Física / Desbloqueo Forzado (Rubber-Hose)',
    adversary: 'Atacante presencial exigiendo el desbloqueo del dispositivo',
    userAppCapability: 'EFECTIVA',
    deviceOwnerCapability: 'EFECTIVA',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'El usuario introduce el PIN bajo amenaza. Se debe evitar despertar sospechas.',
    mitigation: 'Bóveda Señuelo (Decoy Vault) con datos cotidianos verosímiles + Zeroization en RAM de la clave maestra real.'
  },
  {
    threat: 'Extracción Forense por Hardware (Cellebrite / Graykey)',
    adversary: 'Laboratorio forense con acceso físico mediante cable USB y modo EDL/Fastboot',
    userAppCapability: 'PARCIAL',
    deviceOwnerCapability: 'PARCIAL',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'Extracción de dumps de memoria flash NAND y chips de almacenamiento.',
    mitigation: 'Cifrado SQLCipher + AES-256-GCM con claves en Android Keystore/StrongBox. GrapheneOS elimina claves FBE a nivel de HAL; en app normal se borra el alias Keystore localmente.'
  },
  {
    threat: 'Ataques de Análisis de Tiempo (Timing Attacks)',
    adversary: 'Malware local o atacante midiendo microsegundos de respuesta al validar PIN',
    userAppCapability: 'EFECTIVA',
    deviceOwnerCapability: 'EFECTIVA',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'Diferencia de tiempo entre fallo de PIN en el primer dígito vs último dígito.',
    mitigation: 'Uso estricto de MessageDigest.isEqual() en tiempo constante y retraso deliberado normalizado (~300ms).'
  },
  {
    threat: 'Inspección de Residuos en RAM (Cold Boot & Heap Dumps)',
    adversary: 'Extracción de volcados de memoria volátil tras suspender el proceso',
    userAppCapability: 'EFECTIVA',
    deviceOwnerCapability: 'EFECTIVA',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'Restos de claves o contraseñas en memoria no recolectada por el Garbage Collector.',
    mitigation: 'Arrays primitivos (ByteArray / CharArray) sobreescritos con ceros (Zeroization) inmediatamente tras derivación; nunca usar Strings inmutables para secretos.'
  },
  {
    threat: 'Observación por el Hombro (Shoulder Surfing / Huellas en Pantalla)',
    adversary: 'Vigilancia visual de la posición de los dedos al teclear el PIN',
    userAppCapability: 'EFECTIVA',
    deviceOwnerCapability: 'EFECTIVA',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'Deducción del PIN mediante la geometría del teclado o residuos grasos en el cristal.',
    mitigation: 'Teclado Scrambled dinámico que reorganiza los dígitos aleatoriamente en cada sesión.'
  },
  {
    threat: 'Interceptar Desbloqueo del Lockscreen del Sistema Operativo',
    adversary: 'Exigencia de desbloquear la pantalla principal del teléfono',
    userAppCapability: 'NO_POSIBLE',
    deviceOwnerCapability: 'PARCIAL',
    grapheneOsCapability: 'NATIVA_TOTAL',
    description: 'Capturar el PIN del sistema en la pantalla de bloqueo nativa de Android.',
    mitigation: 'Android aísla el Keyguard del sistema. En app normal se mitiga con Launcher Kiosco seguro o disparador de hardware de volumen (AccessibilityService / PanicKit).'
  }
];

export const OS_LEVEL_COMPARISON = {
  grapheneOs: {
    title: 'GrapheneOS (Nivel SO / Kernel)',
    badge: 'Hardware Key Wipe',
    pros: [
      'Intercepta el PIN en el Keyguard nativo del sistema.',
      'Destruye instantáneamente claves FBE (File-Based Encryption) en chip StrongBox / Titan M.',
      'Reinicia el dispositivo instantáneamente a estado BFU (Before First Unlock).',
      'Sin dependencia de permisos ni servicios en background.'
    ],
    cons: [
      'Requiere flashear una ROM personalizada (dispositivos Google Pixel exclusivamente).',
      'No accesible para el 99% de usuarios con dispositivos comerciales estándar (Samsung, Xiaomi, etc.).'
    ]
  },
  deviceOwner: {
    title: 'Android Enterprise (Device Owner / ADB)',
    badge: 'Máximo Privilegio Stock',
    pros: [
      'Ejecuta DevicePolicyManager.wipeData() silencioso sin cuadros de confirmación.',
      'Capacidad de ocultar o desinstalar aplicaciones sin interacción del usuario.',
      'Bloqueo inmediato forzado de pantalla (lockNow).',
      'Funciona en cualquier dispositivo Android estándar sin Root.'
    ],
    cons: [
      'Requiere aprovisionamiento previo por ADB o escaneo de código QR en la configuración inicial de fábrica.'
    ]
  },
  userApp: {
    title: 'Aplicación Convencional (Espacio de Usuario)',
    badge: '100% Portátil & Local',
    pros: [
      'Instalable directamente mediante APK o F-Droid.',
      'Bóveda Señuelo (Decoy Vault) con negación plausible matemáticamente perfecta.',
      'Borrado seguro de claves locales en Android Keystore en milisegundos.',
      'Integración con el estándar PanicKit (Ripple) y disparadores físicos de volumen.'
    ],
    cons: [
      'No puede borrar datos de otras aplicaciones ni interceptar el Lockscreen nativo de Android.',
      'El Factory Reset completo requiere activar el permiso de Device Admin en Ajustes.'
    ]
  }
};
