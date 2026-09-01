import { VaultItem } from '../types/security';

export const REAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'rv-1',
    title: 'Claves de Recuperación Bóveda Fría (Seed Phrase)',
    category: 'CREDENTIAL',
    content: 'timber harvest abandon crystal vintage mirror dynamic galaxy pulse echo velvet orbit flame',
    encrypted: true,
    timestamp: 'Hoy, 09:15',
    badge: 'AES-GCM-256'
  },
  {
    id: 'rv-2',
    title: 'Contrato de Confidencialidad & Poder Notarial',
    category: 'DOCUMENT',
    content: 'Expediente legal ref #8841-A: Cláusula de indemnización y custodia en cuenta suiza.',
    encrypted: true,
    timestamp: 'Ayer, 18:40',
    badge: 'Confidencial'
  },
  {
    id: 'rv-3',
    title: 'Canal Seguro Signal - Contactos Clave',
    category: 'CONTACT',
    content: 'Defensor Legal: +34 699 12 34 56 (Fingerprint SHA256: 4e:9a:11:c4...)\nContacto Respaldo: +1 415 800 9090',
    encrypted: true,
    timestamp: 'Hace 3 días',
    badge: 'Zero-Trace'
  },
  {
    id: 'rv-4',
    title: 'Credenciales Servidor Offline & PGP Private Key',
    category: 'CREDENTIAL',
    content: '-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: OpenPGP.js v4.10.10\nxcLYBGB3... [3,840 bytes cifrados]',
    encrypted: true,
    timestamp: 'Hace 1 semana',
    badge: 'RSA 4096'
  }
];

export const DECOY_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'dv-1',
    title: 'Lista de Compras del Supermercado',
    category: 'NOTE',
    content: '• Leche de almendras\n• Café en grano arábica\n• Fruta fresca (plátanos, manzanas)\n• Aceite de oliva virgen extra\n• Pan integral',
    encrypted: false,
    timestamp: 'Hoy, 10:20',
    badge: 'Personal'
  },
  {
    id: 'dv-2',
    title: 'Rutina de Gimnasio - Semana 3',
    category: 'NOTE',
    content: 'Lunes: Pecho y Tríceps (Press banca 4x10, Fondos 3x12)\nMiércoles: Espalda y Bíceps\nViernes: Pierna y Core',
    encrypted: false,
    timestamp: 'Ayer, 16:15',
    badge: 'Fitness'
  },
  {
    id: 'dv-3',
    title: 'Ideas para Vacaciones de Verano',
    category: 'NOTE',
    content: 'Revisar vuelos a Mallorca y hoteles en la costa norte. Presupuesto estimado: 800€ por persona.',
    encrypted: false,
    timestamp: 'Hace 2 días',
    badge: 'Viajes'
  },
  {
    id: 'dv-4',
    title: 'Contactos Taller Mecánico & Dentista',
    category: 'CONTACT',
    content: 'Taller Central Auto: 912 345 678\nDr. Gómez (Dentista): 915 889 900 (Cita jueves 17:00)',
    encrypted: false,
    timestamp: 'Hace 4 días',
    badge: 'Servicios'
  }
];
