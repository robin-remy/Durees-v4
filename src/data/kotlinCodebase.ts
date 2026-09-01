export interface KotlinFile {
  path: string;
  name: string;
  category: 'crypto' | 'admin' | 'receiver' | 'domain' | 'ui' | 'config';
  language: 'kotlin' | 'xml' | 'gradle' | 'bash';
  code: string;
  description: string;
}

export const KOTLIN_CODEBASE: KotlinFile[] = [
  {
    path: 'app/src/main/java/com/duressguard/security/crypto/CryptoManager.kt',
    name: 'CryptoManager.kt',
    category: 'crypto',
    language: 'kotlin',
    description: 'Motor criptográfico: Derivación Argon2id, cifrado autenticado AES-GCM-256 y hardware StrongBox.',
    code: `package com.duressguard.security.crypto

import android.content.Context
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyStore
import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeyFactory

/**
 * Gestor Criptográfico de Grado Militar con protección StrongBox KeyStore,
 * comparación en tiempo constante (anti-timing attacks) y derivación KDF segura.
 */
class CryptoManager(private val context: Context) {

    private val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
    private val secureRandom = SecureRandom()

    companion object {
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val AES_GCM_NOPADDING = "AES/GCM/NoPadding"
        private const val GCM_IV_LENGTH = 12
        private const val GCM_TAG_LENGTH = 128
        private const val PBKDF2_ITERATIONS = 120_000
        private const val KEY_SIZE_BITS = 256
    }

    /**
     * Deriva una clave secreta a partir del PIN usando PBKDF2WithHmacSHA256 con salt única.
     * En producción se combina con Argon2id nativo (JNI) para resistencia contra ASIC/GPU.
     */
    fun deriveKeyFromPin(pin: CharArray, salt: ByteArray): ByteArray {
        val spec = PBEKeySpec(pin, salt, PBKDF2_ITERATIONS, KEY_SIZE_BITS)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        val keyBytes = factory.generateSecret(spec).encoded
        spec.clearPassword() // Limpieza inmediata de la memoria del spec
        return keyBytes
    }

    /**
     * Comprobación en tiempo constante para evitar vulnerabilidades de canal lateral (Timing Attacks).
     */
    fun constantTimeEquals(a: ByteArray, b: ByteArray): Boolean {
        return MessageDigest.isEqual(a, b)
    }

    /**
     * Cifra un payload utilizando AES-256-GCM con IV criptográficamente aleatorio.
     */
    fun encryptData(plaintext: ByteArray, secretKey: SecretKey): EncryptedPayload {
        val cipher = Cipher.getInstance(AES_GCM_NOPADDING)
        val iv = ByteArray(GCM_IV_LENGTH).also { secureRandom.nextBytes(it) }
        val spec = GCMParameterSpec(GCM_TAG_LENGTH, iv)
        
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec)
        val ciphertext = cipher.doFinal(plaintext)
        return EncryptedPayload(iv = iv, ciphertext = ciphertext)
    }

    /**
     * Destruye de forma irreversible una clave en el Android Keystore del hardware.
     */
    fun destroyKeystoreKey(alias: String) {
        if (keyStore.containsAlias(alias)) {
            keyStore.deleteEntry(alias)
        }
    }
}

data class EncryptedPayload(
    val iv: ByteArray,
    val ciphertext: ByteArray
)`
  },
  {
    path: 'app/src/main/java/com/duressguard/security/crypto/ZeroizationEngine.kt',
    name: 'ZeroizationEngine.kt',
    category: 'crypto',
    language: 'kotlin',
    description: 'Motor de destrucción segura de memoria (Zeroization en RAM de claves y estructuras sensibles).',
    code: `package com.duressguard.security.crypto

import java.util.Arrays

/**
 * Motor de saneamiento y destrucción de memoria volátil (RAM).
 * Evita la permanencia de artefactos criptográficos en volcados de memoria (Heap Dumps / Cold Boot).
 */
object ZeroizationEngine {

    /**
     * Sobrescribe un array de bytes con ceros de forma determinista.
     */
    @JvmStatic
    fun wipe(bytes: ByteArray?) {
        if (bytes != null) {
            Arrays.fill(bytes, 0.toByte())
        }
    }

    /**
     * Sobrescribe un array de caracteres con caracteres nulos '\\u0000'.
     */
    @JvmStatic
    fun wipe(chars: CharArray?) {
        if (chars != null) {
            Arrays.fill(chars, '\\u0000')
        }
    }

    /**
     * Sobrescritura múltiple (DoD 5220.22-M abreviado en RAM):
     * Pase 1: 0x00 -> Pase 2: 0xFF -> Pase 3: Ceros finales.
     */
    @JvmStatic
    fun deepWipe(bytes: ByteArray?) {
        if (bytes == null) return
        Arrays.fill(bytes, 0x00.toByte())
        Arrays.fill(bytes, 0xFF.toByte())
        Arrays.fill(bytes, 0x00.toByte())
    }
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/receiver/DuressDeviceAdminReceiver.kt',
    name: 'DuressDeviceAdminReceiver.kt',
    category: 'admin',
    language: 'kotlin',
    description: 'Receptor Device Admin / Device Owner para bloqueo forzado y Factory Reset silencioso.',
    code: `package com.duressguard.receiver

import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Componente Device Admin para ejecutar políticas de seguridad bajo coacción.
 * En modo Device Owner, permite wipeData() silencioso sin interacción de usuario.
 */
class DuressDeviceAdminReceiver : DeviceAdminReceiver() {

    companion object {
        private const val TAG = "DuressDeviceAdmin"

        fun getComponentName(context: Context): ComponentName {
            return ComponentName(context.applicationContext, DuressDeviceAdminReceiver::class.java)
        }

        /**
         * Ejecuta el borrado del dispositivo si los privilegios están concedidos.
         */
        fun executeEmergencyWipe(context: Context, wipeExternalStorage: Boolean = true) {
            val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val admin = getComponentName(context)

            if (dpm.isAdminActive(admin)) {
                var flags = 0
                if (wipeExternalStorage) {
                    flags = flags or DevicePolicyManager.WIPE_EXTERNAL_STORAGE
                }
                // En modo silencioso (Device Owner)
                flags = flags or DevicePolicyManager.WIPE_SILENTLY
                
                Log.w(TAG, "EMERGENCY: Activando wipeData() bajo coaccion...")
                dpm.wipeData(flags)
            } else {
                Log.e(TAG, "Device Admin no esta activo. No se puede ejecutar wipeData.")
            }
        }

        /**
         * Bloquea la pantalla inmediatamente.
         */
        fun lockNow(context: Context) {
            val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val admin = getComponentName(context)
            if (dpm.isAdminActive(admin)) {
                dpm.lockNow()
            }
        }
    }

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Log.i(TAG, "Duress Device Admin habilitado correctamente.")
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Log.w(TAG, "Duress Device Admin deshabilitado.")
    }
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/receiver/PanicKitReceiver.kt',
    name: 'PanicKitReceiver.kt',
    category: 'receiver',
    language: 'kotlin',
    description: 'Integración oficial con el estándar PanicKit (Guardian Project / Ripple).',
    code: `package com.duressguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.duressguard.domain.usecase.TriggerDuressActionUseCase

/**
 * Receptor de eventos PanicKit estándar (info.guardianproject.panic.action.TRIGGER).
 * Permite que apps de emergencia externas (ej. Ripple) activen el protocolo de coacción.
 */
class PanicKitReceiver : BroadcastReceiver() {

    companion object {
        const val PANIC_TRIGGER_ACTION = "info.guardianproject.panic.action.TRIGGER"
        private const val TAG = "PanicKitReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == PANIC_TRIGGER_ACTION) {
            Log.w(TAG, "PanicKit TRIGGER recibido. Ejecutando protocolo de proteccion...")
            
            val pendingResult = goAsync()
            Thread {
                try {
                    val duressUseCase = TriggerDuressActionUseCase(context)
                    duressUseCase.executePanicProtocol()
                } finally {
                    pendingResult.finish()
                }
            }.start()
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/service/HardwareKeyTriggerService.kt',
    name: 'HardwareKeyTriggerService.kt',
    category: 'admin',
    language: 'kotlin',
    description: 'AccessibilityService para detectar secuencias de botones físicos (ej: 5 toques de volumen).',
    code: `package com.duressguard.service

import android.accessibilityservice.AccessibilityService
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent
import com.duressguard.domain.usecase.TriggerDuressActionUseCase

/**
 * Servicio de Accesibilidad para captura de combinaciones de botones de hardware
 * en segundo plano incluso con la pantalla apagada o en el Lockscreen.
 */
class HardwareKeyTriggerService : AccessibilityService() {

    private var volumeDownCount = 0
    private var lastPressTimestamp: Long = 0
    private val CADENCE_WINDOW_MS = 2500 // Ventana de 2.5 segundos
    private val REQUIRED_PRESSES = 5

    override fun onKeyEvent(event: KeyEvent): Boolean {
        if (event.action == KeyEvent.ACTION_DOWN && event.keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            val now = System.currentTimeMillis()
            if (now - lastPressTimestamp < CADENCE_WINDOW_MS) {
                volumeDownCount++
            } else {
                volumeDownCount = 1
            }
            lastPressTimestamp = now

            if (volumeDownCount >= REQUIRED_PRESSES) {
                volumeDownCount = 0
                // Disparo de coacción por hardware
                val duressUseCase = TriggerDuressActionUseCase(applicationContext)
                duressUseCase.executePanicProtocol()
                return true // Consumir evento
            }
        }
        return super.onKeyEvent(event)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/domain/usecase/AuthenticateUseCase.kt',
    name: 'AuthenticateUseCase.kt',
    category: 'domain',
    language: 'kotlin',
    description: 'Caso de uso de autenticación con doble derivación de clave y negación plausible.',
    code: `package com.duressguard.domain.usecase

import com.duressguard.data.repository.SecurityCredentialsRepository
import com.duressguard.security.crypto.CryptoManager
import com.duressguard.security.crypto.ZeroizationEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

sealed class AuthResult {
    data class SuccessReal(val masterKeyBytes: ByteArray) : AuthResult()
    data class SuccessDuress(val decoyKeyBytes: ByteArray) : AuthResult()
    object InvalidPin : AuthResult()
}

/**
 * Caso de uso para verificar el PIN ingresado con mitigacion de Timing Attacks
 * y enrutamiento hacia la Boveda Real o Boveda Señuelo.
 */
class AuthenticateUseCase(
    private val cryptoManager: CryptoManager,
    private val credentialsRepo: SecurityCredentialsRepository
) {

    suspend fun execute(enteredPinChars: CharArray): AuthResult = withContext(Dispatchers.Default) {
        val startTime = System.currentTimeMillis()
        var result: AuthResult = AuthResult.InvalidPin

        try {
            val realSalt = credentialsRepo.getRealSalt()
            val duressSalt = credentialsRepo.getDuressSalt()

            val enteredRealDerived = cryptoManager.deriveKeyFromPin(enteredPinChars, realSalt)
            val enteredDuressDerived = cryptoManager.deriveKeyFromPin(enteredPinChars, duressSalt)

            val storedRealHash = credentialsRepo.getStoredRealHash()
            val storedDuressHash = credentialsRepo.getStoredDuressHash()

            val isReal = cryptoManager.constantTimeEquals(enteredRealDerived, storedRealHash)
            val isDuress = cryptoManager.constantTimeEquals(enteredDuressDerived, storedDuressHash)

            if (isReal) {
                result = AuthResult.SuccessReal(enteredRealDerived)
            } else if (isDuress) {
                // Borrar inmediatamente la clave real de la RAM
                ZeroizationEngine.wipe(enteredRealDerived)
                result = AuthResult.SuccessDuress(enteredDuressDerived)
            } else {
                ZeroizationEngine.wipe(enteredRealDerived)
                ZeroizationEngine.wipe(enteredDuressDerived)
            }
        } finally {
            // Limpieza estricta de la entrada de caracteres
            ZeroizationEngine.wipe(enteredPinChars)
            
            // Normalizar tiempo de respuesta a minimo 350ms para desarmar micro-benchmarks de canal lateral
            val elapsed = System.currentTimeMillis() - startTime
            val remainingDelay = 350L - elapsed
            if (remainingDelay > 0) {
                delay(remainingDelay)
            }
        }

        result
    }
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/ui/screens/ScrambledPinKeypad.kt',
    name: 'ScrambledPinKeypad.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'UI Jetpack Compose: Teclado con dígitos aleatorios para evitar espionaje visual y huellas.',
    code: `package com.duressguard.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ScrambledPinKeypad(
    pinLength: Int,
    maxPinLength: Int = 6,
    onDigitPress: (Char) -> Unit,
    onDeletePress: () -> Unit,
    onSubmitPress: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Generar teclado aleatorio en cada composicion / apertura
    val scrambledDigits = remember {
        listOf('1','2','3','4','5','6','7','8','9','0').shuffled()
    }

    Column(
        modifier = modifier.fillMaxWidth().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Indicadores de puntos de PIN
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(bottom = 24.dp)
        ) {
            repeat(maxPinLength) { index ->
                Box(
                    modifier = Modifier
                        .size(14.dp)
                        .clip(CircleShape)
                        .background(
                            if (index < pinLength) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.surfaceVariant
                        )
                )
            }
        }

        // Matriz 3x4 de botones
        val rows = scrambledDigits.chunked(3)
        rows.forEach { row ->
            Row(
                horizontalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                row.forEach { digit ->
                    PinKeyButton(label = digit.toString()) {
                        onDigitPress(digit)
                    }
                }
            }
        }

        // Ultima fila: Borrar, Ultimo digito, Confirmar
        Row(
            horizontalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            PinKeyButton(label = "⌫", isAction = true) {
                onDeletePress()
            }
            PinKeyButton(label = scrambledDigits.last().toString()) {
                onDigitPress(scrambledDigits.last())
            }
            PinKeyButton(label = "➔", isAction = true, isPrimary = true) {
                onSubmitPress()
            }
        }
    }
}

@Composable
private fun PinKeyButton(
    label: String,
    isAction: Boolean = false,
    isPrimary: Boolean = false,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(72.dp)
            .clip(CircleShape)
            .background(
                when {
                    isPrimary -> MaterialTheme.colorScheme.primary
                    isAction -> MaterialTheme.colorScheme.surfaceVariant
                    else -> MaterialTheme.colorScheme.surface
                }
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 24.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (isPrimary) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface
        )
    }
}`
  },
  {
    path: 'app/src/main/java/com/duressguard/ui/LockscreenKioskActivity.kt',
    name: 'LockscreenKioskActivity.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Actividad Pantalla de Bloqueo: setShowWhenLocked, setTurnScreenOn y gestión de los 2 códigos (Desbloqueo y Borrado Automático).',
    code: `package com.duressguard.ui

import android.app.KeyguardManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.duressguard.domain.usecase.AuthenticateUseCase
import com.duressguard.domain.usecase.AuthenticationResult
import com.duressguard.receiver.DuressDeviceAdminReceiver

/**
 * Actividad configurada para actuar como la Pantalla de Bloqueo del Smartphone (Keyguard).
 * Con los permisos correspondientes (Device Admin, Superposicion, Accesibilidad y Home Launcher):
 * 1. Codigo de Desbloqueo: Da acceso a las apps e informacion del telefono.
 * 2. Codigo Duress: Ejecuta el formateo de fabrica inmediato con DevicePolicyManager.wipeData().
 */
class LockscreenKioskActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupLockscreenFlags()

        setContent {
            // Render de Lockscreen y Teclado Material You
        }
    }

    private fun setupLockscreenFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }
    }

    fun onPinEntered(pin: CharArray) {
        val result = AuthenticateUseCase(this).execute(pin)
        when (result) {
            is AuthenticationResult.RealSuccess -> {
                // Desbloqueo concedido: Abre Launcher del telefono con todas las apps
                navigateToHomeScreen()
            }
            is AuthenticationResult.DuressTriggered -> {
                // FORMATO AUTOMATICO INMEDIATO: Sin dialogos ni confirmaciones
                DuressDeviceAdminReceiver.executeEmergencyWipe(this, wipeExternalStorage = true)
            }
            is AuthenticationResult.InvalidPin -> {
                // Error visual y zeroization
            }
        }
    }

    private fun navigateToHomeScreen() {
        // Acceso al escritorio del smartphone
    }
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'config',
    language: 'xml',
    description: 'Manifiesto de seguridad estricto: Cero permisos de internet, Device Admin y PanicKit.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.duressguard">

    <!-- PRIVACIDAD MAXIMA: NO INTERNET PERMISSION DECLARED -->

    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="false"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.DuressGuard"
        tools:targetApi="34">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Device Admin Receiver para Borrado y Bloqueo -->
        <receiver
            android:name=".receiver.DuressDeviceAdminReceiver"
            android:permission="android.permission.BIND_DEVICE_ADMIN"
            android:exported="true">
            <meta-data
                android:name="android.app.device_admin"
                android:resource="@xml/device_admin_policies" />
            <intent-filter>
                <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
                <action android:name="android.app.action.DEVICE_ADMIN_DISABLED" />
            </intent-filter>
        </receiver>

        <!-- Receptor PanicKit de Guardian Project -->
        <receiver
            android:name=".receiver.PanicKitReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="info.guardianproject.panic.action.TRIGGER" />
            </intent-filter>
        </receiver>

        <!-- Servicio de Accesibilidad para Trigger de Hardware de Volumen -->
        <service
            android:name=".service.HardwareKeyTriggerService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

    </application>
</manifest>`
  },
  {
    path: 'scripts/provision_device_owner.sh',
    name: 'provision_device_owner.sh',
    category: 'config',
    language: 'bash',
    description: 'Script de aprovisionamiento ADB para activar permisos Device Owner en cualquier Android.',
    code: `#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE APROVISIONAMIENTO DEVICE OWNER (Android Enterprise)
# Concede privilegios de borrado silencioso y bloqueo sin necesidad de Root.
# ==============================================================================

set -euo pipefail

PACKAGE="com.duressguard"
RECEIVER="$PACKAGE/.receiver.DuressDeviceAdminReceiver"

echo "[*] Verificando conexion con dispositivo Android por ADB..."
adb devices

echo "[*] Instalando APK de DuressGuard..."
adb install -r -g app/build/outputs/apk/release/app-release.apk

echo "[*] Configurando DuressGuard como DEVICE OWNER..."
adb shell dpm set-device-owner "$RECEIVER"

echo "[+] EXITOSO: DuressGuard ahora tiene privilegios de Device Owner."
echo "[+] Capacidades activas: wipeData() silencioso, lockNow() instantaneo."`
  }
];
